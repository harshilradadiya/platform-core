import pytest
from fastapi.testclient import TestClient
from app.core.security import sanitize_filename, validate_safe_media_url
from app.main import app

client = TestClient(app)


def test_ssrf_blocks_loopback_and_internal_ips():
    forbidden_urls = [
        "http://127.0.0.1:8080/api/v1/health",
        "http://localhost:6379/",
        "http://10.0.0.1/admin",
        "http://192.168.1.1/router",
        "http://172.16.0.1/internal",
        "http://169.254.169.254/latest/meta-data/",
        "http://0.0.0.0:8000/",
        "file:///etc/passwd",
        "ftp://malicious.com/stream",
    ]
    for url in forbidden_urls:
        with pytest.raises(ValueError):
            validate_safe_media_url(url)


def test_ssrf_allows_public_https_domains():
    valid_urls = [
        "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "https://i.pinimg.com/originals/ab/cd/ef/sample.jpg",
        "https://www.google.com/robots.txt",
    ]
    for url in valid_urls:
        result = validate_safe_media_url(url)
        assert result.startswith("https://")


def test_stream_api_rejects_ssrf_targets():
    # Loopback probe attempt
    res = client.get("/api/v1/stream", params={"url": "http://127.0.0.1:8080/health"})
    assert res.status_code == 400
    assert "Invalid target URL" in res.json()["detail"]

    # Cloud metadata attempt
    res_meta = client.get("/api/v1/stream", params={"url": "http://169.254.169.254/latest/meta-data/"})
    assert res_meta.status_code == 400
    assert "forbidden" in res_meta.json()["detail"].lower()


def test_stream_api_rejects_ssrf_in_audio_url():
    # Valid video URL but malicious internal audio URL
    res = client.get(
        "/api/v1/stream",
        params={
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            "audio_url": "http://10.0.0.1:9000/internal-audio.aac",
        },
    )
    assert res.status_code == 400
    assert "forbidden audio target url" in res.json()["detail"].lower()


def test_filename_sanitizer_prevents_header_injection_and_traversal():
    # CRLF header injection
    malicious_name = "test\r\nContent-Type: text/html\r\n\r\n<script>alert(1)</script>"
    cleaned = sanitize_filename(malicious_name)
    assert "\r" not in cleaned
    assert "\n" not in cleaned
    assert '"' not in cleaned

    # Path traversal
    traversal = "../../../../etc/passwd"
    cleaned_traversal = sanitize_filename(traversal)
    assert ".." not in cleaned_traversal
    assert "/" not in cleaned_traversal
    assert "\\" not in cleaned_traversal

    # Empty fallback
    assert sanitize_filename("") == "media_download.mp4"
    assert sanitize_filename(None) == "media_download.mp4"
