import pytest
from fastapi.testclient import TestClient
from app.api.v1.schemas.media import MediaFormat, ResolveResponse
from app.main import app
from app.services.cache import cache_service

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "uptime_seconds" in data
    assert "redis_connected" in data


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Media Utility Platform"


@pytest.mark.asyncio
async def test_cache_service_fallback():
    test_url = "https://www.youtube.com/watch?v=mock12345"
    mock_resp = ResolveResponse(
        platform="youtube",
        source_url=test_url,
        media_id="mock12345",
        title="Mock Video",
        thumbnail="https://example.com/thumb.jpg",
        duration_seconds=120,
        formats=[
            MediaFormat(
                id="yt-720p",
                ext="mp4",
                quality_label="720p HD",
                filesize_bytes=1048576,
                direct_url="https://example.com/stream.mp4",
                is_audio_only=False,
                requires_server_stream=False,
            )
        ],
        cached=False,
    )

    await cache_service.set_resolved(test_url, mock_resp)
    cached = await cache_service.get_resolved(test_url)
    assert cached is not None
    assert cached.title == "Mock Video"
    assert cached.cached is True
    assert len(cached.formats) == 1


def test_resolve_unsupported_url():
    response = client.post(
        "/api/v1/resolve",
        json={"url": "https://unsupported-site.com/video/999"},
    )
    assert response.status_code == 400
    assert "No matching extractor" in response.json()["detail"]


def test_resolve_invalid_url_schema():
    response = client.post(
        "/api/v1/resolve",
        json={"url": "not-a-valid-url"},
    )
    assert response.status_code == 422
