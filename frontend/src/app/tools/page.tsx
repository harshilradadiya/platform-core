import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Youtube,
  Pin,
  ListVideo,
  Music,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const metadata = {
  title: 'MediaFlow Tools Directory — Online Video, Audio & Pin Utilities',
  description:
    'Free high-speed media tools for YouTube and Pinterest. Download 4K & 1080p video, 320kbps MP3 audio, playlists, shorts, and high-res pins.',
};

const TOOLS = [
  {
    id: 'youtube-video',
    title: 'YouTube 4K & 1080p Video Downloader',
    description:
      'Extract uncompressed YouTube streams up to 2160p (4K UHD) and 1080p Full HD with synchronized AAC audio.',
    icon: Youtube,
    iconColor: 'text-red-500',
    route: '/tools/youtube-video',
    badge: 'Popular',
    format: 'MP4 (H.264 / AV1)',
  },
  {
    id: 'youtube-mp3',
    title: 'YouTube to 320kbps MP3 Extractor',
    description:
      'Extract high-fidelity audio tracks from music videos, podcasts, and talks directly at up to 320kbps bitrates.',
    icon: Music,
    iconColor: 'text-emerald-500',
    route: '/tools/youtube-mp3',
    badge: 'Lossless',
    format: 'MP3 / M4A',
  },
  {
    id: 'youtube-shorts',
    title: 'YouTube Shorts Downloader',
    description:
      'Save vertical 9:16 Shorts videos in full original resolution without watermarks directly to your camera roll or desktop.',
    icon: Film,
    iconColor: 'text-red-500',
    route: '/tools/youtube-shorts',
    badge: 'Mobile Optimized',
    format: 'Vertical MP4',
  },
  {
    id: 'youtube-playlist',
    title: 'YouTube Playlist Batch Downloader',
    description:
      'Download entire multi-video playlists in a single batch. Choose global MP4 video or MP3 audio with sequential queueing.',
    icon: ListVideo,
    iconColor: 'text-secondary',
    route: '/tools/youtube-playlist',
    badge: 'Batch Engine',
    format: 'Sequential Queue',
  },
  {
    id: 'pinterest-video',
    title: 'Pinterest Video Pin Downloader',
    description:
      'Download original high-definition Pinterest video pins in crisp 1080p MP4 without compression or watermark overlays.',
    icon: Pin,
    iconColor: 'text-rose-500',
    route: '/tools/pinterest-video',
    badge: 'High-Res',
    format: '1080p MP4',
  },
  {
    id: 'pinterest-image',
    title: 'Pinterest High-Res Photo & Carousel Pin Saver',
    description:
      'Extract raw maximum-resolution JPG and PNG image assets, animated GIFs, and multi-slide carousel story pins.',
    icon: ImageIcon,
    iconColor: 'text-rose-500',
    route: '/tools/pinterest-image',
    badge: 'Raw Graphic',
    format: 'JPG / PNG / GIF',
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 text-left">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Downloader</span>
      </Link>

      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-container rounded border border-outline-variant text-secondary font-mono text-xs uppercase tracking-wider font-semibold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Product Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight leading-tight">
          MediaFlow Utilities &amp; Extractors
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Comprehensive suite of cloud-accelerated media extraction tools. Every utility features zero server disk buffering, line-speed streaming, and multi-format presets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="p-5 bg-surface-container-lowest border border-outline-variant hover:border-secondary/60 rounded-lg flex flex-col justify-between transition-all group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center border border-outline-variant">
                    <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold uppercase">
                    {tool.badge}
                  </span>
                </div>

                <h2 className="font-semibold text-base text-on-surface group-hover:text-primary transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-outline-variant/60 flex items-center justify-between">
                <span className="font-mono text-[11px] text-outline">{tool.format}</span>
                <Link
                  href={tool.route}
                  className="font-mono text-xs font-semibold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-surface-container rounded border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="font-semibold text-sm sm:text-base text-on-surface flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span>Need custom batch pipelines or higher API rate limits?</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Explore our developer API status, rate limiting specifications, and dedicated compute endpoints.
          </p>
        </div>
        <Link
          href="/api-status"
          className="px-4 py-2 bg-primary hover:bg-secondary text-on-primary font-mono text-xs rounded transition-colors whitespace-nowrap self-start sm:self-auto font-medium"
        >
          View API Telemetry
        </Link>
      </div>
    </div>
  );
}
