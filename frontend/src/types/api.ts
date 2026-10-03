export interface MediaFormat {
  id: string;
  ext: 'mp4' | 'mp3' | 'jpg' | 'webp';
  quality_label: string;
  filesize_bytes: number | null;
  direct_url: string;
  is_audio_only: boolean;
  requires_server_stream: boolean;
  audio_url?: string | null;
}

export interface PlaylistItem {
  id: string;
  title: string;
  url: string;
  duration_seconds: number | null;
  thumbnail?: string | null;
  channel?: string | null;
}

export interface ResolveResponse {
  platform: 'youtube' | 'pinterest' | 'generic';
  source_url: string;
  media_id: string;
  title: string;
  thumbnail: string;
  duration_seconds: number | null;
  formats: MediaFormat[];
  is_playlist?: boolean;
  item_count?: number | null;
  playlist_items?: PlaylistItem[] | null;
  cached: boolean;
}

export interface ResolveRequest {
  url: string;
}

export interface ApiErrorResponse {
  detail: string;
}
