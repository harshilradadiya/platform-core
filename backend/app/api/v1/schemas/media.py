from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class MediaFormat(BaseModel):
    id: str = Field(..., description="Unique format identifier e.g. 'mp4-1080p', 'audio-mp3'")
    ext: Literal["mp4", "mp3", "jpg", "webp"] = Field(..., description="Target file extension")
    quality_label: str = Field(..., description="Human-readable quality label e.g. '1080p Full HD', '720p HD', '320kbps Audio'")
    filesize_bytes: Optional[int] = Field(None, description="Estimated or exact filesize in bytes")
    direct_url: str = Field(..., description="Direct CDN link or backend proxy streaming URL")
    is_audio_only: bool = Field(False, description="Flag indicating if stream contains audio only")
    requires_server_stream: bool = Field(False, description="Whether client must fetch via backend proxy stream due to CORS/auth headers")
    audio_url: Optional[str] = Field(None, description="Direct audio CDN URL if video stream requires on-the-fly muxing")


class PlaylistItem(BaseModel):
    id: str = Field(..., description="Unique media/video identifier")
    title: str = Field(..., description="Title of the video entry in the playlist")
    url: str = Field(..., description="Full playable URL to the video")
    duration_seconds: Optional[int] = Field(None, description="Duration of video in seconds")
    thumbnail: Optional[str] = Field(None, description="Direct thumbnail preview URL")
    channel: Optional[str] = Field(None, description="Uploader or creator channel name")


class ResolveResponse(BaseModel):
    platform: Literal["youtube", "pinterest", "generic"] = Field(..., description="Resolved media platform")
    source_url: str = Field(..., description="Original input media URL")
    media_id: str = Field(..., description="Unique platform media identifier")
    title: str = Field(..., description="Title or headline of the media item or playlist")
    thumbnail: str = Field(..., description="High-resolution poster or thumbnail URL")
    duration_seconds: Optional[int] = Field(None, description="Duration in seconds (null for playlists or images)")
    formats: List[MediaFormat] = Field(default_factory=list, description="List of available download formats (for single media)")
    is_playlist: bool = Field(False, description="Flag indicating if the resolved resource is a playlist")
    item_count: Optional[int] = Field(None, description="Total number of media items in the playlist")
    playlist_items: Optional[List[PlaylistItem]] = Field(None, description="List of entries in the playlist")
    cached: bool = Field(False, description="Indicates whether this response was served from Redis cache")
