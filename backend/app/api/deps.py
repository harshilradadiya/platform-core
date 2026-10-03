from typing import AsyncGenerator
from app.core.security import limiter
from app.extractors.factory import ExtractorFactory, extractor_factory
from app.services.cache import CacheService, cache_service


async def get_cache() -> CacheService:
    """Provides singleton cache service dependency."""
    return cache_service


async def get_extractor_factory() -> ExtractorFactory:
    """Provides singleton extractor factory dependency."""
    return extractor_factory
