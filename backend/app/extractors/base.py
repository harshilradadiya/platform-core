from abc import ABC, abstractmethod
import logging
from typing import Optional
from app.api.v1.schemas.media import ResolveResponse
from app.services.proxy_manager import proxy_manager

logger = logging.getLogger(__name__)


class ExtractionError(Exception):
    """Raised when an extractor fails to retrieve or parse media metadata."""
    pass


class UnsupportedUrlError(Exception):
    """Raised when an extractor receives a URL format it does not support."""
    pass


class MediaRateLimitError(Exception):
    """Raised when the upstream platform returns an HTTP 429 or bot challenge."""
    pass


class BaseExtractor(ABC):
    """Abstract base class for all platform extractors."""

    def __init__(self):
        self.proxy_manager = proxy_manager

    @abstractmethod
    async def validate(self, url: str) -> bool:
        """Determines whether the given URL matches this extractor's domain and syntax."""
        pass

    @abstractmethod
    async def extract(self, url: str) -> ResolveResponse:
        """
        Asynchronously fetches and resolves media formats.
        Must conform strictly to the Zero-Server-Buffering constraint:
        Returns direct CDN links or proxy stream URLs without saving video files to disk.
        """
        pass
