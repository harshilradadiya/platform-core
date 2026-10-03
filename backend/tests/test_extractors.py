import pytest
from app.extractors.base import UnsupportedUrlError
from app.extractors.factory import ExtractorFactory
from app.extractors.pinterest import PinterestExtractor
from app.extractors.youtube import YouTubeExtractor


@pytest.mark.asyncio
async def test_youtube_extractor_validation():
    extractor = YouTubeExtractor()
    assert await extractor.validate("https://www.youtube.com/watch?v=dQw4w9WgXcQ") is True
    assert await extractor.validate("https://youtu.be/dQw4w9WgXcQ") is True
    assert await extractor.validate("https://www.youtube.com/shorts/dQw4w9WgXcQ") is True
    assert await extractor.validate("https://www.youtube.com/playlist?list=PLrAXtmErZgOdP_8GztsuKi9nrraNbKKp4") is True
    assert await extractor.validate("https://example.com/video") is False


def test_youtube_playlist_processing():
    extractor = YouTubeExtractor()
    mock_info = {
        "_type": "playlist",
        "id": "PLmock123",
        "title": "Top Hits Playlist",
        "uploader": "Test Channel",
        "thumbnail": "https://example.com/playlist_thumb.jpg",
        "entries": [
            {
                "id": "vid1",
                "title": "First Song",
                "url": "https://www.youtube.com/watch?v=vid1",
                "duration": 210,
                "channel": "Artist One",
                "thumbnails": [{"url": "https://example.com/vid1.jpg"}],
            },
            {
                "id": "vid2",
                "title": "Second Song",
                "url": "https://www.youtube.com/watch?v=vid2",
                "duration": 180,
                "channel": "Artist Two",
                "thumbnails": [{"url": "https://example.com/vid2.jpg"}],
            },
        ],
    }
    res = extractor._process_playlist(mock_info, "https://www.youtube.com/playlist?list=PLmock123")
    assert res.is_playlist is True
    assert res.item_count == 2
    assert len(res.playlist_items) == 2
    assert res.playlist_items[0].id == "vid1"
    assert res.playlist_items[0].title == "First Song"
    assert res.playlist_items[0].duration_seconds == 210
    assert res.playlist_items[1].id == "vid2"


@pytest.mark.asyncio
async def test_pinterest_extractor_validation():
    extractor = PinterestExtractor()
    assert await extractor.validate("https://www.pinterest.com/pin/123456789012345678/") is True
    assert await extractor.validate("https://pin.it/7a8BcDe") is True
    assert await extractor.validate("https://example.com/pin/123") is False


@pytest.mark.asyncio
async def test_extractor_factory_routing():
    factory = ExtractorFactory()
    yt_extractor = await factory.get_extractor("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    assert isinstance(yt_extractor, YouTubeExtractor)

    pin_extractor = await factory.get_extractor("https://pin.it/abc1234")
    assert isinstance(pin_extractor, PinterestExtractor)

    with pytest.raises(UnsupportedUrlError):
        await factory.get_extractor("https://unsupported-site.com/media/123")


def test_pinterest_pws_data_parsing():
    extractor = PinterestExtractor()
    sample_data = {
        "props": {
            "initialReduxState": {
                "pins": {
                    "99999": {
                        "title": "Beautiful Aesthetic Video",
                        "videos": {
                            "video_list": {
                                "V_720P": {
                                    "url": "https://v.pinimg.com/videos/mc/720p/aesthetic.mp4",
                                    "height": 720,
                                    "width": 1280,
                                }
                            }
                        },
                        "images": {
                            "orig": {
                                "url": "https://i.pinimg.com/originals/aesthetic.jpg"
                            }
                        }
                    }
                }
            }
        }
    }

    formats, title, thumb, dur = extractor._parse_pws_data(sample_data, "99999")
    assert title == "Beautiful Aesthetic Video"
    assert thumb == "https://i.pinimg.com/originals/aesthetic.jpg"
    assert len(formats) == 2
    video_fmt = formats[0]
    assert video_fmt.ext == "mp4"
    assert video_fmt.direct_url == "https://v.pinimg.com/videos/mc/720p/aesthetic.mp4"
    assert video_fmt.requires_server_stream is False

    image_fmt = formats[1]
    assert image_fmt.ext == "jpg"
    assert image_fmt.direct_url == "https://i.pinimg.com/originals/aesthetic.jpg"
