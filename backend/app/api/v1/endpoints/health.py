import time
from fastapi import APIRouter, Depends, status
from app.api.deps import get_cache
from app.core.config import settings
from app.services.cache import CacheService

router = APIRouter()
_START_TIME = time.time()


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check and readiness probe",
)
async def health_check(cache: CacheService = Depends(get_cache)):
    redis_healthy = await cache.is_healthy()
    uptime_seconds = round(time.time() - _START_TIME, 2)

    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "redis_connected": redis_healthy,
        "uptime_seconds": uptime_seconds,
    }
