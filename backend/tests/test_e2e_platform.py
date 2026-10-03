import asyncio
import json
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.cache import cache_service
from app.api.v1.schemas.media import MediaFormat, ResolveResponse

client = TestClient(app)


def test_e2e_health_check():
    """Verify health check probe returns 200 OK and valid JSON contract."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "uptime_seconds" in data
    assert "version" in data
    assert "service" in data


def test_e2e_api_docs():
    """Verify Swagger OpenAPI docs and schema are served."""
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "/api/v1/resolve" in schema["paths"]
    assert "/api/v1/stream" in schema["paths"]


@pytest.mark.asyncio
async def test_e2e_cache_behavior():
    """Verify URL caching: first request cached=False, second request cached=True with same data."""
    test_url = "https://www.youtube.com/watch?v=mockE2ECacheTest"
    mock_response = ResolveResponse(
        platform="youtube",
        source_url=test_url,
        media_id="mockE2ECacheTest",
        title="E2E Mock Title Test",
        thumbnail="https://example.com/thumb.jpg",
        duration_seconds=180,
        formats=[
            MediaFormat(
                id="yt-1080p-test",
                ext="mp4",
                quality_label="1080p Full HD",
                filesize_bytes=15000000,
                direct_url="https://example.com/stream1080.mp4",
                is_audio_only=False,
                requires_server_stream=True,
            ),
            MediaFormat(
                id="yt-audio-test",
                ext="mp3",
                quality_label="320kbps MP3 Audio",
                filesize_bytes=3500000,
                direct_url="https://example.com/audio.mp3",
                is_audio_only=True,
                requires_server_stream=True,
            )
        ],
        cached=False,
    )

    # Initial state: not cached
    assert await cache_service.get_resolved(test_url) is None

    # Set in cache (simulating extractor completion)
    await cache_service.set_resolved(test_url, mock_response)

    # Subsequent fetch: should hit cache with cached=True
    cached_obj = await cache_service.get_resolved(test_url)
    assert cached_obj is not None
    assert cached_obj.cached is True
    assert cached_obj.title == "E2E Mock Title Test"
    assert len(cached_obj.formats) == 2


def test_e2e_resolve_validation():
    """Verify resolve endpoint validates URL schemes and unsupported platforms properly."""
    # 1. Non-URL input
    bad_res = client.post("/api/v1/resolve", json={"url": "not-a-valid-url"})
    assert bad_res.status_code in [400, 422]

    # 2. Unsupported domain
    unsupported_res = client.post("/api/v1/resolve", json={"url": "https://unsupported-video-site.com/watch/123"})
    assert unsupported_res.status_code == 400
    assert "No matching extractor" in unsupported_res.json()["detail"]


def test_e2e_stream_endpoint_invalid_url():
    """Verify stream proxy endpoint handles malformed URLs."""
    res = client.get("/api/v1/stream?url=invalid_target&filename=test.mp4")
    assert res.status_code == 400
    assert "Invalid target URL" in res.json()["detail"]
