import hashlib
import json
import logging
import time
from typing import Any, Dict, Optional, Tuple
import redis.asyncio as aioredis
from app.api.v1.schemas.media import ResolveResponse
from app.core.config import settings

logger = logging.getLogger(__name__)


class CacheService:
    """High-performance Redis cache service with in-memory fallback for local dev / resilience."""

    def __init__(self):
        self._redis: Optional[aioredis.Redis] = None
        self._memory_cache: Dict[str, Tuple[float, str]] = {}
        self._is_connected = False

    async def connect(self) -> None:
        """Initializes Redis connection pool."""
        try:
            self._redis = aioredis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=settings.REDIS_TIMEOUT_SECONDS,
            )
            # Test connection ping
            await self._redis.ping()
            self._is_connected = True
            logger.info("Connected to Redis successfully at %s", settings.REDIS_URL)
        except Exception as e:
            self._is_connected = False
            logger.warning("Redis unavailable (%s). Falling back to in-memory fallback cache.", str(e))

    async def disconnect(self) -> None:
        """Closes Redis connection cleanly."""
        if self._redis:
            try:
                await self._redis.aclose()
            except Exception as e:
                logger.error("Error closing Redis connection: %s", str(e))
            finally:
                self._is_connected = False

    def _hash_url(self, url: str) -> str:
        """Computes deterministic SHA256 key for a canonicalized URL."""
        normalized = url.strip().lower()
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    def _build_key(self, url: str) -> str:
        return f"cache:resolve:{self._hash_url(url)}"

    async def get_resolved(self, url: str) -> Optional[ResolveResponse]:
        """Retrieves cached ResolveResponse if present and unexpired."""
        key = self._build_key(url)

        # 1. Try Redis
        if self._is_connected and self._redis:
            try:
                raw_data = await self._redis.get(key)
                if raw_data:
                    data = json.loads(raw_data)
                    data["cached"] = True
                    return ResolveResponse(**data)
            except Exception as e:
                logger.warning("Redis GET failed for %s, falling back to memory: %s", key, str(e))

        # 2. In-Memory Fallback
        now = time.time()
        if key in self._memory_cache:
            expires_at, raw_data = self._memory_cache[key]
            if now < expires_at:
                data = json.loads(raw_data)
                data["cached"] = True
                return ResolveResponse(**data)
            else:
                del self._memory_cache[key]

        return None

    async def set_resolved(self, url: str, response: ResolveResponse) -> None:
        """Caches ResolveResponse with 3-hour TTL."""
        key = self._build_key(url)
        # Store with cached=False so deserialized cached objects can explicitly set True
        dump_data = response.model_dump()
        dump_data["cached"] = False
        payload = json.dumps(dump_data)

        # 1. Try Redis
        if self._is_connected and self._redis:
            try:
                await self._redis.set(
                    key,
                    payload,
                    ex=settings.REDIS_CACHE_TTL_SECONDS,
                )
                return
            except Exception as e:
                logger.warning("Redis SET failed for %s: %s", key, str(e))

        # 2. In-Memory Fallback
        expires_at = time.time() + settings.REDIS_CACHE_TTL_SECONDS
        self._memory_cache[key] = (expires_at, payload)

        # Clean old memory keys periodically if dictionary exceeds 1000 items
        if len(self._memory_cache) > 1000:
            now = time.time()
            expired_keys = [k for k, (exp, _) in self._memory_cache.items() if now >= exp]
            for k in expired_keys:
                del self._memory_cache[k]

    async def is_healthy(self) -> bool:
        """Returns True if Redis is responding."""
        if not self._is_connected or not self._redis:
            return False
        try:
            pong = await self._redis.ping()
            return bool(pong)
        except Exception:
            return False


cache_service = CacheService()
