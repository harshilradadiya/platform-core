import asyncio
import logging
import urllib.parse
from typing import AsyncGenerator, Optional
from fastapi import APIRouter, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse
import httpx
from app.core.config import settings
from app.core.security import sanitize_filename, validate_safe_media_url

logger = logging.getLogger(__name__)

router = APIRouter()

# Global connection-pooled HTTP/2 client for upstream CDN chunk streaming
_streaming_client: Optional[httpx.AsyncClient] = None


def get_streaming_client() -> httpx.AsyncClient:
    global _streaming_client
    if _streaming_client is None or _streaming_client.is_closed:
        limits = httpx.Limits(
            max_keepalive_connections=100,
            max_connections=500,
            keepalive_expiry=60.0,
        )
        _streaming_client = httpx.AsyncClient(
            http2=True,
            limits=limits,
            follow_redirects=True,
            timeout=httpx.Timeout(
                connect=10.0,
                read=settings.STREAM_TIMEOUT_SECONDS,
                write=10.0,
                pool=15.0,
            ),
        )
    return _streaming_client


async def close_streaming_client() -> None:
    """Closes global pooled HTTP/2 streaming client during application teardown."""
    global _streaming_client
    if _streaming_client is not None and not _streaming_client.is_closed:
        try:
            await _streaming_client.aclose()
        except Exception as exc:
            logger.warning("Error closing HTTP streaming client: %s", str(exc))
        finally:
            _streaming_client = None


@router.get(
    "/stream",
    summary="High-speed Zero-Server-Buffering proxy stream",
    description="Pipes upstream video/audio chunks directly to the client via memory buffers without writing files to server disk. Uses segmented Range burst streaming to bypass CDN playback throttling.",
)
async def stream_media(
    request: Request,
    url: str = Query(..., description="Target media direct stream URL to pipe"),
    audio_url: Optional[str] = Query(None, description="Optional audio stream URL to mux on-the-fly with video"),
    filename: str = Query("media_download", description="Desired filename for download attachment"),
):
    # Validate target URL against SSRF and private network attacks
    try:
        raw_url = urllib.parse.unquote(url)
        decoded_url = validate_safe_media_url(raw_url)
    except ValueError as val_err:
        logger.warning("SSRF or invalid stream target rejected: %s", str(val_err))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid target URL: {str(val_err)}",
        )

    # Ratebypass parameter injection to prevent CDN throttling
    if "googlevideo.com" in decoded_url and "ratebypass=" not in decoded_url:
        delimiter = "&" if "?" in decoded_url else "?"
        decoded_url = f"{decoded_url}{delimiter}ratebypass=yes"

    clean_filename = sanitize_filename(filename)
    safe_filename = urllib.parse.quote(clean_filename)
    disposition = f'attachment; filename="{clean_filename}"; filename*=UTF-8\'\'{safe_filename}'

    # Case 0: On-the-fly video + audio stream muxing via FFmpeg memory pipe
    if audio_url:
        try:
            raw_audio_url = urllib.parse.unquote(audio_url)
            decoded_audio_url = validate_safe_media_url(raw_audio_url)
        except ValueError as val_err:
            logger.warning("SSRF or invalid audio stream target rejected: %s", str(val_err))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid or forbidden audio target URL: {str(val_err)}",
            )

        if "googlevideo.com" in decoded_audio_url and "ratebypass=" not in decoded_audio_url:
            delimiter = "&" if "?" in decoded_audio_url else "?"
            decoded_audio_url = f"{decoded_audio_url}{delimiter}ratebypass=yes"

        import imageio_ffmpeg

        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        cmd = [
            ffmpeg_exe,
            "-loglevel", "error",
            "-reconnect", "1",
            "-reconnect_streamed", "1",
            "-reconnect_delay_max", "5",
            "-i", decoded_url,
            "-i", decoded_audio_url,
            "-c:v", "copy",
            "-c:a", "aac",
            "-movflags", "frag_keyframe+empty_moov+default_base_moof",
            "-f", "mp4",
            "pipe:1",
        ]

        try:
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
        except Exception as exc:
            logger.error("Failed to spawn FFmpeg muxer: %s", str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to initialize stream muxer: {str(exc)}",
            )

        # Background task to drain FFmpeg stderr to prevent OS pipe buffer deadlock
        stderr_buffer = []

        async def _drain_stderr():
            try:
                while True:
                    line = await proc.stderr.readline()
                    if not line:
                        break
                    stderr_buffer.append(line.decode("utf-8", errors="replace").strip())
                    if len(stderr_buffer) > 20:
                        stderr_buffer.pop(0)
            except Exception:
                pass

        stderr_task = asyncio.create_task(_drain_stderr())

        mux_headers = {
            "Content-Disposition": disposition,
            "Content-Type": "video/mp4",
            "Accept-Ranges": "none",
        }

        async def mux_generator() -> AsyncGenerator[bytes, None]:
            try:
                while True:
                    chunk = await proc.stdout.read(settings.STREAM_CHUNK_SIZE_BYTES)
                    if not chunk:
                        break
                    yield chunk
            except Exception as err:
                logger.warning("Mux stream interrupted: %s", str(err))
            finally:
                try:
                    if proc.returncode is None:
                        proc.kill()
                    await proc.wait()
                except Exception:
                    pass
                try:
                    stderr_task.cancel()
                except Exception:
                    pass
                if proc.returncode is not None and proc.returncode != 0 and stderr_buffer:
                    logger.error("FFmpeg exited with non-zero status: %s", " | ".join(stderr_buffer))

        return StreamingResponse(
            mux_generator(),
            status_code=status.HTTP_200_OK,
            headers=mux_headers,
            media_type="video/mp4",
        )

    referer = (
        "https://www.youtube.com/"
        if ("googlevideo.com" in decoded_url or "youtube" in decoded_url)
        else "https://www.pinterest.com/"
    )
    upstream_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Encoding": "identity",
        "Referer": referer,
    }

    client = get_streaming_client()

    # Case 1: Client specified a byte Range (e.g. download manager, seeking, or resumption)
    if "range" in request.headers:
        upstream_headers["Range"] = request.headers["range"]
        try:
            upstream_req = client.build_request("GET", decoded_url, headers=upstream_headers)
            upstream_res = await client.send(upstream_req, stream=True)
        except httpx.HTTPError as exc:
            logger.error("Failed upstream connection to %s: %s", decoded_url[:80], str(exc))
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to establish upstream connection: {str(exc)}",
            )

        if upstream_res.status_code >= 400:
            error_body = await upstream_res.aread()
            await upstream_res.aclose()
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Upstream media CDN returned error {upstream_res.status_code}.",
            )

        response_headers = {
            "Content-Disposition": disposition,
            "Accept-Ranges": upstream_res.headers.get("Accept-Ranges", "bytes"),
        }
        for h in ("Content-Type", "Content-Length", "Content-Range"):
            if h in upstream_res.headers:
                response_headers[h] = upstream_res.headers[h]

        async def range_chunk_generator() -> AsyncGenerator[bytes, None]:
            try:
                async for chunk in upstream_res.aiter_bytes(chunk_size=settings.STREAM_CHUNK_SIZE_BYTES):
                    yield chunk
            except Exception as err:
                logger.warning("Stream range piping interrupted: %s", str(err))
            finally:
                await upstream_res.aclose()

        return StreamingResponse(
            range_chunk_generator(),
            status_code=upstream_res.status_code,
            headers=response_headers,
        )

    # Case 2: Standard single-connection download
    # Use 2MB Range-burst segmentation to bypass CDN bitrate pacing and maximize throughput
    total_size: Optional[int] = None
    content_type: str = "application/octet-stream"

    try:
        probe_req = client.build_request("GET", decoded_url, headers={**upstream_headers, "Range": "bytes=0-0"})
        probe_res = await client.send(probe_req)
        if probe_res.status_code in (200, 206):
            content_type = probe_res.headers.get("Content-Type", content_type)
            crange = probe_res.headers.get("Content-Range", "")
            if "/" in crange:
                total_size = int(crange.split("/")[-1])
        await probe_res.aclose()
    except Exception as probe_err:
        logger.debug("Probe request failed (%s); falling back to direct continuous stream", str(probe_err))

    # If total file size is known, stream in high-speed 2MB burst slices
    if total_size and total_size > 0:
        SLICE_SIZE = 2 * 1024 * 1024  # 2MB burst slices

        response_headers = {
            "Content-Disposition": disposition,
            "Accept-Ranges": "bytes",
            "Content-Type": content_type,
            "Content-Length": str(total_size),
        }

        async def burst_generator() -> AsyncGenerator[bytes, None]:
            start = 0
            try:
                while start < total_size:
                    end = min(start + SLICE_SIZE - 1, total_size - 1)
                    slice_req = client.build_request(
                        "GET",
                        decoded_url,
                        headers={**upstream_headers, "Range": f"bytes={start}-{end}"},
                    )
                    slice_res = await client.send(slice_req, stream=True)
                    try:
                        async for sub_chunk in slice_res.aiter_bytes(chunk_size=settings.STREAM_CHUNK_SIZE_BYTES):
                            yield sub_chunk
                    finally:
                        await slice_res.aclose()
                    start = end + 1
            except Exception as err:
                logger.warning("Burst stream interrupted: %s", str(err))

        return StreamingResponse(
            burst_generator(),
            status_code=status.HTTP_200_OK,
            headers=response_headers,
        )

    # Fallback: Continuous stream if total size could not be probed
    try:
        fallback_req = client.build_request("GET", decoded_url, headers=upstream_headers)
        fallback_res = await client.send(fallback_req, stream=True)
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to establish upstream connection: {str(exc)}",
        )

    response_headers = {
        "Content-Disposition": disposition,
        "Accept-Ranges": fallback_res.headers.get("Accept-Ranges", "bytes"),
    }
    for h in ("Content-Type", "Content-Length"):
        if h in fallback_res.headers:
            response_headers[h] = fallback_res.headers[h]

    async def fallback_generator() -> AsyncGenerator[bytes, None]:
        try:
            async for chunk in fallback_res.aiter_bytes(chunk_size=settings.STREAM_CHUNK_SIZE_BYTES):
                yield chunk
        except Exception as err:
            logger.warning("Fallback stream interrupted: %s", str(err))
        finally:
            await fallback_res.aclose()

    return StreamingResponse(
        fallback_generator(),
        status_code=fallback_res.status_code,
        headers=response_headers,
    )
