import logging
from typing import List
from app.extractors.base import BaseExtractor, UnsupportedUrlError
from app.extractors.pinterest import PinterestExtractor
from app.extractors.youtube import YouTubeExtractor

logger = logging.getLogger(__name__)


class ExtractorFactory:
    """Dispatches media URLs to the appropriate platform extractor using pattern validation."""

    def __init__(self):
        self._extractors: List[BaseExtractor] = [
            YouTubeExtractor(),
            PinterestExtractor(),
        ]

    def register_extractor(self, extractor: BaseExtractor) -> None:
        """Allows dynamic injection of additional extractors (e.g. TikTok, Instagram)."""
        self._extractors.append(extractor)

    async def get_extractor(self, url: str) -> BaseExtractor:
        """Finds and returns the first registered extractor that validates the given URL."""
        for extractor in self._extractors:
            if await extractor.validate(url):
                return extractor

        raise UnsupportedUrlError(
            f"No matching extractor found for URL '{url}'. Currently supported: YouTube, Pinterest."
        )


extractor_factory = ExtractorFactory()
