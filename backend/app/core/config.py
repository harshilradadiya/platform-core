from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Media Utility Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # CORS configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Redis Cache configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL_SECONDS: int = 10800  # 3-hour TTL
    REDIS_TIMEOUT_SECONDS: float = 2.0

    # Rate limiting configuration
    RATE_LIMIT_PER_MINUTE: int = 30
    RATELIMIT_STORAGE_URI: str = "memory://"

    # Zero-buffering Streaming configuration
    STREAM_CHUNK_SIZE_BYTES: int = 256 * 1024  # 256 KB optimized memory chunks
    STREAM_TIMEOUT_SECONDS: float = 60.0

    # Proxy Pool & Extraction configuration
    ROTATING_PROXIES: List[str] = []
    MAX_RETRIES: int = 3
    RETRY_BACKOFF_FACTOR: float = 1.5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
