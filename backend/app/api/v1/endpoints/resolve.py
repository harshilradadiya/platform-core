import logging
from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.api.deps import get_cache, get_extractor_factory
from app.api.v1.schemas.media import ResolveResponse
from app.api.v1.schemas.request import ResolveRequest
from app.core.security import limiter
from app.extractors.base import ExtractionError, MediaRateLimitError, UnsupportedUrlError
from app.extractors.factory import ExtractorFactory
from app.services.cache import CacheService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/resolve",
    response_model=ResolveResponse,
    status_code=status.HTTP_200_OK,
    summary="Resolve media URL to available formats",
    description="Resolves video/image/audio streams for supported platforms (YouTube, Pinterest). Uses 3-hour Redis caching to minimize bandwidth and upstream throttling.",
)
@limiter.limit("30/minute")
async def resolve_media(
    request: Request,
    payload: ResolveRequest,
    cache: CacheService = Depends(get_cache),
    factory: ExtractorFactory = Depends(get_extractor_factory),
) -> ResolveResponse:
    url = payload.url.strip()

    # 1. Check Redis Cache
    cached_result = await cache.get_resolved(url)
    if cached_result:
        return cached_result

    # 2. Match extractor
    try:
        extractor = await factory.get_extractor(url)
    except UnsupportedUrlError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # 3. Perform Extraction
    try:
        resolved = await extractor.extract(url)
    except MediaRateLimitError as e:
        logger.warning("Upstream rate limit: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Upstream media provider is temporarily rate-limiting requests. Please retry in a few moments.",
        )
    except ExtractionError as e:
        logger.error("Extraction error for URL %s: %s", url, str(e))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Unable to extract media: {str(e)}",
        )
    except Exception as e:
        logger.exception("Unexpected error resolving URL %s", url)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred while processing the media stream.",
        )

    # 4. Cache response in Redis with 3-hour TTL
    await cache.set_resolved(url, resolved)

    return resolved
