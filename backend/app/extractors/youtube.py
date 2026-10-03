import asyncio
import logging
import re
from typing import Any, Dict, List, Optional
import yt_dlp
from app.api.v1.schemas.media import MediaFormat, ResolveResponse
from app.extractors.base import BaseExtractor, ExtractionError, MediaRateLimitError

logger = logging.getLogger(__name__)


class YouTubeExtractor(BaseExtractor):
    """
    High-throughput, low-overhead YouTube extractor powered by yt-dlp.
    Operates in zero-download metadata-only mode.
    Dispatches blocking operations via asyncio.to_thread to maintain event loop responsiveness.
    """

    URL_PATTERNS = [
        re.compile(r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})", re.IGNORECASE),
        re.compile(r"(?:https?://)?youtu\.be/([a-zA-Z0-9_-]{11})", re.IGNORECASE),
        re.compile(r"(?:https?://)?(?:www\.)?youtube\.com/shorts/([a-zA-Z0-9_-]{11})", re.IGNORECASE),
        re.compile(r"(?:https?://)?(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})", re.IGNORECASE),
        re.compile(r"(?:https?://)?(?:www\.)?youtube\.com/playlist\?list=([a-zA-Z0-9_-]+)", re.IGNORECASE),
    ]

    async def validate(self, url: str) -> bool:
        return any(p.search(url) is not None for p in self.URL_PATTERNS)

    def _is_playlist_url(self, url: str) -> bool:
        """Determines if the target URL is explicitly a YouTube Playlist catalog."""
        return "playlist?list=" in url.lower()

    def _get_ydl_options(self, is_playlist: bool = False) -> Dict[str, Any]:
        proxy = self.proxy_manager.get_next_proxy()
        user_agent = self.proxy_manager.get_random_user_agent()

        import imageio_ffmpeg

        ydl_opts: Dict[str, Any] = {
            "skip_download": True,
            "extract_flat": "in_playlist" if is_playlist else False,
            "noplaylist": not is_playlist,
            "quiet": True,
            "no_warnings": True,
            "user_agent": user_agent,
            "socket_timeout": 15,
            "ffmpeg_location": imageio_ffmpeg.get_ffmpeg_exe(),
            "js_runtimes": {"node": {}},
            "remote_components": ["ejs:github"],
            "http_headers": {
                "User-Agent": user_agent,
                "Accept-Language": "en-US,en;q=0.9",
            },
        }
        if proxy:
            ydl_opts["proxy"] = proxy
        return ydl_opts

    def _sync_extract_info(self, url: str, ydl_opts: Dict[str, Any]) -> Dict[str, Any]:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            return ydl.extract_info(url, download=False)

    async def extract(self, url: str) -> ResolveResponse:
        is_playlist = self._is_playlist_url(url)
        ydl_opts = self._get_ydl_options(is_playlist=is_playlist)

        try:
            info = await asyncio.to_thread(self._sync_extract_info, url, ydl_opts)
        except yt_dlp.utils.DownloadError as de:
            error_msg = str(de)
            if "HTTP Error 429" in error_msg or "Too Many Requests" in error_msg or "Sign in" in error_msg:
                raise MediaRateLimitError(f"YouTube rate limit or bot verification triggered: {error_msg}") from de
            raise ExtractionError(f"yt-dlp extraction error: {error_msg}") from de
        except Exception as exc:
            raise ExtractionError(f"Unexpected error resolving YouTube media: {str(exc)}") from exc

        if not info:
            raise ExtractionError("yt-dlp returned empty info dictionary.")

        # Check if the extracted target is a playlist
        if info.get("_type") == "playlist" or "entries" in info:
            return self._process_playlist(info, url)

        media_id = str(info.get("id", "unknown"))
        title = info.get("title", f"YouTube Video {media_id}")
        thumbnail = info.get("thumbnail") or f"https://i.ytimg.com/vi/{media_id}/maxresdefault.jpg"
        duration = info.get("duration")

        formats = self._process_formats(info.get("formats", []), title)

        return ResolveResponse(
            platform="youtube",
            source_url=url,
            media_id=media_id,
            title=title,
            thumbnail=thumbnail,
            duration_seconds=duration,
            formats=formats,
            is_playlist=False,
            cached=False,
        )

    def _process_playlist(self, info: Dict[str, Any], url: str) -> ResolveResponse:
        """Processes flat playlist metadata into a high-performance PlaylistItem list."""
        from app.api.v1.schemas.media import PlaylistItem

        playlist_id = str(info.get("id", "playlist"))
        raw_title = info.get("title", f"YouTube Playlist {playlist_id}")
        channel_name = info.get("uploader") or info.get("channel") or ""
        display_title = f"{raw_title} — {channel_name}" if channel_name and channel_name not in raw_title else raw_title

        entries = info.get("entries") or []
        items: List[PlaylistItem] = []

        for idx, entry in enumerate(entries):
            if not entry:
                continue
            entry_id = str(entry.get("id") or f"item-{idx}")
            entry_title = entry.get("title") or f"Video #{idx + 1}"
            entry_url = entry.get("url")
            if not entry_url or not entry_url.startswith("http"):
                entry_url = f"https://www.youtube.com/watch?v={entry_id}"

            entry_duration = entry.get("duration")
            entry_channel = entry.get("channel") or entry.get("uploader") or channel_name or "YouTube"

            # Parse highest-resolution thumbnail available from flat entry
            entry_thumb = None
            raw_thumbs = entry.get("thumbnails")
            if raw_thumbs and isinstance(raw_thumbs, list) and len(raw_thumbs) > 0:
                entry_thumb = raw_thumbs[-1].get("url")
            if not entry_thumb:
                entry_thumb = f"https://i.ytimg.com/vi/{entry_id}/hqdefault.jpg"

            items.append(
                PlaylistItem(
                    id=entry_id,
                    title=entry_title,
                    url=entry_url,
                    duration_seconds=entry_duration,
                    thumbnail=entry_thumb,
                    channel=entry_channel,
                )
            )

        playlist_thumb = info.get("thumbnail")
        if not playlist_thumb and items:
            playlist_thumb = items[0].thumbnail
        if not playlist_thumb:
            playlist_thumb = "https://www.youtube.com/img/desktop/yt_1200.png"

        return ResolveResponse(
            platform="youtube",
            source_url=url,
            media_id=playlist_id,
            title=display_title,
            thumbnail=playlist_thumb,
            duration_seconds=None,
            formats=[],
            is_playlist=True,
            item_count=len(items),
            playlist_items=items,
            cached=False,
        )

    def _process_formats(self, raw_formats: List[Dict[str, Any]], title: str) -> List[MediaFormat]:
        processed: List[MediaFormat] = []
        seen_qualities = set()

        # Filter strictly for direct HTTP/HTTPS downloadable video streams
        # Exclude HLS playlists (m3u8, m3u8_native) and manifest.googlevideo.com
        valid_formats = [
            f for f in raw_formats
            if f.get("url")
            and f.get("url", "").startswith("http")
            and f.get("protocol") in ("http", "https")
            and ".m3u8" not in f.get("url", "").lower()
            and "manifest.googlevideo.com" not in f.get("url", "").lower()
            and f.get("ext") in ("mp4", "m4a", "webm", "mp3")
        ]

        # 1. Best standalone audio stream (for MP3 download AND on-the-fly video muxing)
        audio_formats = [
            f for f in valid_formats
            if f.get("vcodec") == "none" and f.get("acodec") != "none"
        ]
        audio_formats.sort(key=lambda x: x.get("abr") or 0, reverse=True)
        best_audio = audio_formats[0] if audio_formats else None
        best_audio_url = best_audio["url"] if best_audio else None
        best_audio_size = (best_audio.get("filesize") or best_audio.get("filesize_approx") or 0) if best_audio else 0

        # 2. Progressive formats (both video and audio already embedded)
        for f in valid_formats:
            vcodec = f.get("vcodec", "none")
            acodec = f.get("acodec", "none")
            height = f.get("height")
            filesize = f.get("filesize") or f.get("filesize_approx")

            if vcodec != "none" and acodec != "none" and height:
                quality_key = f"{height}p"
                if quality_key not in seen_qualities:
                    seen_qualities.add(quality_key)
                    label = (
                        f"{height}p Full HD (MP4)" if height >= 1080 else
                        f"{height}p HD (MP4)" if height >= 720 else
                        f"{height}p (MP4)"
                    )
                    processed.append(
                        MediaFormat(
                            id=f"yt-{height}p-progressive",
                            ext="mp4",
                            quality_label=label,
                            filesize_bytes=filesize,
                            direct_url=f["url"],
                            audio_url=None,  # Audio already embedded!
                            is_audio_only=False,
                            requires_server_stream=True,
                        )
                    )

        # 3. Pure direct video streams (from 4K down to 240p) with audio muxing
        video_candidates = [
            f for f in valid_formats
            if f.get("vcodec") != "none" and f.get("height") and f.get("ext") == "mp4"
        ]
        video_candidates.sort(key=lambda x: x.get("height", 0), reverse=True)

        for f in video_candidates:
            height = f.get("height")
            filesize = f.get("filesize") or f.get("filesize_approx")

            if height:
                quality_key = f"{height}p"
                if quality_key not in seen_qualities:
                    seen_qualities.add(quality_key)
                    label = (
                        f"{height}p 4K UHD (MP4)" if height >= 2160 else
                        f"{height}p 2K QHD (MP4)" if height >= 1440 else
                        f"{height}p Full HD (MP4)" if height >= 1080 else
                        f"{height}p HD (MP4)" if height >= 720 else
                        f"{height}p (MP4)"
                    )
                    combined_filesize = (filesize + best_audio_size) if (filesize and best_audio_size) else filesize
                    processed.append(
                        MediaFormat(
                            id=f"yt-{height}p-video",
                            ext="mp4",
                            quality_label=label,
                            filesize_bytes=combined_filesize,
                            direct_url=f["url"],
                            audio_url=best_audio_url,  # MUXED WITH AUDIO TRACK!
                            is_audio_only=False,
                            requires_server_stream=True,
                        )
                    )

        # 4. High-quality audio streams (MP3/M4A)
        if best_audio:
            abr = int(best_audio.get("abr") or 128)
            filesize = best_audio.get("filesize") or best_audio.get("filesize_approx")
            processed.append(
                MediaFormat(
                    id="yt-audio-high",
                    ext="mp3",
                    quality_label=f"Audio High Quality (~{abr}kbps MP3)",
                    filesize_bytes=filesize,
                    direct_url=best_audio["url"],
                    audio_url=None,
                    is_audio_only=True,
                    requires_server_stream=True,
                )
            )

        # Sort: Highest resolution Video first, then Audio
        def sort_key(fmt: MediaFormat) -> int:
            if fmt.is_audio_only:
                return 9999
            match = re.search(r"(\d+)p", fmt.quality_label)
            return -int(match.group(1)) if match else 0

        processed.sort(key=sort_key)
        return processed
