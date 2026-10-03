import json
import logging
import re
from typing import Any, Dict, List, Optional
from bs4 import BeautifulSoup
import httpx
from app.api.v1.schemas.media import MediaFormat, ResolveResponse
from app.extractors.base import BaseExtractor, ExtractionError, MediaRateLimitError

logger = logging.getLogger(__name__)


class PinterestExtractor(BaseExtractor):
    """
    High-res image and video scraper for Pinterest.
    Parses both direct pin URLs (pinterest.com/pin/...) and shortlinks (pin.it/...).
    Extracts high-resolution MP4 video streams and raw original JPG images.
    Returns direct CDN links adhering to Zero-Server-Buffering constraints.
    """

    URL_PATTERNS = [
        re.compile(r"https?://(?:www\.|[a-z]{2}\.)?pinterest\.[a-z\.]+/pin/(\d+)", re.IGNORECASE),
        re.compile(r"https?://pin\.it/([a-zA-Z0-9]+)", re.IGNORECASE),
    ]

    async def validate(self, url: str) -> bool:
        return any(pattern.search(url) is not None for pattern in self.URL_PATTERNS)

    def _extract_pin_id(self, url: str) -> Optional[str]:
        match = re.search(r"/pin/(\d+)", url)
        if match:
            return match.group(1)
        return None

    async def extract(self, url: str) -> ResolveResponse:
        headers = self.proxy_manager.get_headers({
            "Referer": "https://www.pinterest.com/",
        })
        proxy = self.proxy_manager.get_next_proxy()

        async with httpx.AsyncClient(
            headers=headers,
            proxy=proxy,
            follow_redirects=True,
            timeout=15.0,
        ) as client:
            try:
                response = await client.get(url)
            except httpx.HTTPError as exc:
                raise ExtractionError(f"Failed to connect to Pinterest: {str(exc)}") from exc

        if response.status_code == 429:
            raise MediaRateLimitError("Pinterest rate limit encountered (HTTP 429).")
        if response.status_code != 200:
            raise ExtractionError(f"Pinterest returned HTTP {response.status_code}")

        final_url = str(response.url)
        pin_id = self._extract_pin_id(final_url) or "pin"
        html = response.text

        soup = BeautifulSoup(html, "html.parser")

        # 1. Parse JSON from __PWS_DATA__ script if available
        formats: List[MediaFormat] = []
        title: Optional[str] = None
        thumbnail: Optional[str] = None
        duration: Optional[int] = None

        pws_tag = soup.find("script", id="__PWS_DATA__")
        if pws_tag and pws_tag.string:
            try:
                data = json.loads(pws_tag.string)
                formats, title, thumbnail, duration = self._parse_pws_data(data, pin_id)
            except Exception as e:
                logger.debug("Failed parsing __PWS_DATA__: %s", str(e))

        # 2. Fallback to OpenGraph / Meta tags & JSON-LD
        if not formats:
            formats, meta_title, meta_thumb = self._parse_meta_fallback(soup, pin_id)
            title = title or meta_title
            thumbnail = thumbnail or meta_thumb

        if not formats and not thumbnail:
            raise ExtractionError("Unable to locate downloadable video or high-res image from Pinterest pin.")

        # Ensure title and thumbnail defaults
        final_title = title or soup.title.string if soup.title else f"Pinterest Pin {pin_id}"
        final_title = final_title.replace(" | Pinterest", "").strip()
        final_thumb = thumbnail or (formats[0].direct_url if formats else "")

        return ResolveResponse(
            platform="pinterest",
            source_url=url,
            media_id=pin_id,
            title=final_title,
            thumbnail=final_thumb,
            duration_seconds=duration,
            formats=formats,
            cached=False,
        )

    def _parse_pws_data(
        self, data: Dict[str, Any], pin_id: str
    ) -> tuple[List[MediaFormat], Optional[str], Optional[str], Optional[int]]:
        formats: List[MediaFormat] = []
        title = None
        thumbnail = None
        duration = None

        initial_state = data.get("props", {}).get("initialReduxState", {})
        pins_data = initial_state.get("pins", {})

        # If pin_id is known, look directly; otherwise inspect first pin entry
        pin = pins_data.get(pin_id)
        if not pin and pins_data:
            pin = next(iter(pins_data.values()), {})

        if not pin:
            return formats, title, thumbnail, duration

        title = pin.get("title") or pin.get("grid_title") or pin.get("description")

        # Extract Video if present
        videos_info = pin.get("videos", {})
        video_list = videos_info.get("video_list", {}) if videos_info else {}

        # video_list has keys like V_720P, V_EXP720P, V_480P, V_HLSV4 etc.
        seen_urls = set()
        for quality_key, vdata in video_list.items():
            v_url = vdata.get("url")
            if not v_url or v_url in seen_urls:
                continue

            # Skip HLS (.m3u8) when direct mp4 is available, or keep if only format
            is_mp4 = ".mp4" in v_url.lower()
            if is_mp4:
                seen_urls.add(v_url)
                height = vdata.get("height", 720)
                width = vdata.get("width", 1280)
                quality_label = f"{height}p HD Video (MP4)" if height >= 720 else f"{height}p Video (MP4)"

                formats.append(
                    MediaFormat(
                        id=f"pinterest-video-{height}p",
                        ext="mp4",
                        quality_label=quality_label,
                        filesize_bytes=None,
                        direct_url=v_url,
                        is_audio_only=False,
                        requires_server_stream=False,  # Pinterest CDN allows direct browser download
                    )
                )

        # Extract high-res image representations
        images = pin.get("images", {})
        orig_image = images.get("orig", {}).get("url")
        if not orig_image and images.get("736x"):
            orig_image = images["736x"].get("url")

        if orig_image:
            thumbnail = orig_image
            formats.append(
                MediaFormat(
                    id="pinterest-image-original",
                    ext="jpg",
                    quality_label="Original Resolution Image (JPG)",
                    filesize_bytes=None,
                    direct_url=orig_image,
                    is_audio_only=False,
                    requires_server_stream=False,
                )
            )

        # Sort formats: best video first, then image
        formats.sort(key=lambda f: (0 if f.ext == "mp4" else 1))
        return formats, title, thumbnail, duration

    def _parse_meta_fallback(
        self, soup: BeautifulSoup, pin_id: str
    ) -> tuple[List[MediaFormat], Optional[str], Optional[str]]:
        formats: List[MediaFormat] = []
        title: Optional[str] = None
        thumbnail: Optional[str] = None

        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            title = og_title["content"]

        og_video = soup.find("meta", property="og:video") or soup.find("meta", property="og:video:secure_url")
        if og_video and og_video.get("content"):
            video_url = og_video["content"]
            if ".mp4" in video_url.lower():
                formats.append(
                    MediaFormat(
                        id="pinterest-video-og",
                        ext="mp4",
                        quality_label="High Definition Video (MP4)",
                        filesize_bytes=None,
                        direct_url=video_url,
                        is_audio_only=False,
                        requires_server_stream=False,
                    )
                )

        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            img_url = og_image["content"]
            thumbnail = img_url
            # Convert /x/ or /736x/ to /originals/ if possible
            orig_img = re.sub(r"/\d+x/", "/originals/", img_url)
            formats.append(
                MediaFormat(
                    id="pinterest-image-og",
                    ext="jpg",
                    quality_label="Full Quality Image (JPG)",
                    filesize_bytes=None,
                    direct_url=orig_img,
                    is_audio_only=False,
                    requires_server_stream=False,
                )
            )

        return formats, title, thumbnail
