import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Youtube, Pin, Music, Film, ListVideo, Image as ImageIcon, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { EditorialDownloaderConsole } from '@/components/downloader/EditorialDownloaderConsole';

interface ToolConfig {
  slug: string;
  title: string;
  headline: string;
  description: string;
  platform: 'youtube' | 'pinterest';
  badge: string;
  format: string;
  features: string[];
  sampleUrl: string;
}

const TOOLS_CONFIG: Record<string, ToolConfig> = {
  'youtube-video': {
    slug: 'youtube-video',
    title: 'YouTube 4K & 1080p Video Downloader',
    headline: 'Download YouTube Videos in 4K UHD & 1080p Full HD with Audio',
    description:
      'Extract pristine, uncompressed YouTube video streams up to 2160p (4K UHD) and 1080p Full HD with synchronized AAC audio track muxing.',
    platform: 'youtube',
    badge: '4K Ultra HD',
    format: 'MP4 (H.264 / AV1)',
    features: [
      'Up to 4K 2160p resolution at 60 frames per second',
      'Real-time FFmpeg in-memory audio/video multiplexing',
      'Zero server disk buffering for maximum privacy',
      'Direct stream memory pipe with zero transcoding lag',
    ],
    sampleUrl: 'https://www.youtube.com/watch?v=A8vG4UoW_9Q',
  },
  'youtube-mp3': {
    slug: 'youtube-mp3',
    title: 'YouTube to 320kbps MP3 Audio Converter',
    headline: 'Extract Lossless High-Fidelity MP3 Audio from YouTube',
    description:
      'Extract studio-grade 320kbps MP3 audio tracks directly from music videos, podcasts, and speeches without quality degradation.',
    platform: 'youtube',
    badge: '320 kbps Lossless',
    format: 'MP3 / M4A',
    features: [
      'Highest source bitrate extraction up to 320 kbps',
      'Preserved ID3 tag metadata and original artist cover art',
      'Compatible with all smartphones, car players, and MP3 devices',
      'Zero lossy re-encoding delays',
    ],
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  'youtube-shorts': {
    slug: 'youtube-shorts',
    title: 'YouTube Shorts Downloader',
    headline: 'Save Vertical 9:16 YouTube Shorts Videos Without Watermark',
    description:
      'Download public YouTube Shorts vertical clips directly to your phone or desktop in original 1080p resolution without compression artifacts.',
    platform: 'youtube',
    badge: 'Mobile 9:16',
    format: 'Vertical MP4',
    features: [
      'Original 1080x1920 vertical mobile resolution',
      'Zero added watermarks or compression loss',
      'Direct save to iOS Camera Roll and Android Gallery',
      'One-click extraction without account login',
    ],
    sampleUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  },
  'youtube-playlist': {
    slug: 'youtube-playlist',
    title: 'YouTube Playlist Batch Downloader',
    headline: 'Download Full Multi-Video Playlists in a Single Batch',
    description:
      'Paste any public YouTube playlist address to parse the entire collection. Select all videos and trigger sequential line-speed downloads.',
    platform: 'youtube',
    badge: 'Batch Console',
    format: 'Sequential Batch MP4 / MP3',
    features: [
      'Batch parse up to 50+ video tracks per playlist',
      'Choose global 1080p MP4 or 320kbps MP3 preset',
      'Sequential downloading to avoid upstream rate throttling',
      'Individual track checkboxes for selective downloading',
    ],
    sampleUrl: 'https://www.youtube.com/playlist?list=PLrEnWoR732-DES01x_0uQsn_pE4H_bEev',
  },
  'pinterest-video': {
    slug: 'pinterest-video',
    title: 'Pinterest Video Pin Downloader',
    headline: 'Save High-Definition 1080p Pinterest Video Pins with Audio',
    description:
      'Extract high-resolution Pinterest video pins, animated loops, and reels in full original MP4 quality with sound.',
    platform: 'pinterest',
    badge: '1080p HD',
    format: '1080p MP4',
    features: [
      'Full 1080p resolution direct from Pinterest CDN',
      'Original audio track preserved and synchronized',
      'Compatible with pin.it shortlinks and full URLs',
      'Zero ads or watermark overlays inserted',
    ],
    sampleUrl: 'https://www.pinterest.com/pin/1089304603632948271/',
  },
  'pinterest-image': {
    slug: 'pinterest-image',
    title: 'Pinterest Photo, GIF & Carousel Pin Saver',
    description:
      'Download raw maximum-resolution static image pins, multi-slide story carousels, and uncompressed animated GIF pins directly.',
    headline: 'Extract Raw Maximum-Resolution JPG, PNG & GIF Pins',
    platform: 'pinterest',
    badge: 'Raw Graphic',
    format: 'JPG / PNG / GIF',
    features: [
      'Original full-resolution keyframe graphics directly from stream manifest',
      'Multi-image carousel pin unpacker',
      'Preserved animated GIF frames without transcode compression',
      'Direct instant browser downloads',
    ],
    sampleUrl: 'https://www.pinterest.com/pin/1089304603632948271/',
  },
};

export function generateStaticParams() {
  return Object.keys(TOOLS_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = TOOLS_CONFIG[params.slug];
  if (!tool) return { title: 'Tool Not Found | MediaFlow' };

  return {
    title: `${tool.title} — Free Online Utility | MediaFlow`,
    description: tool.description,
  };
}

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = TOOLS_CONFIG[params.slug];
  if (!tool) {
    notFound();
  }

  const otherTools = Object.values(TOOLS_CONFIG).filter((t) => t.slug !== tool.slug);

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 text-left">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-on-surface transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-on-surface transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">{tool.title}</span>
      </div>

      {/* Tool Hero Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-container rounded border border-outline-variant text-secondary font-mono text-xs uppercase tracking-wider font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>{tool.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight leading-tight">
          {tool.headline}
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Interactive Tool Downloader Console */}
      <div className="mb-12">
        <EditorialDownloaderConsole />
      </div>

      {/* Features & Specification Box */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 sm:p-8 mb-12 shadow-xs">
        <h3 className="font-semibold text-base sm:text-lg text-on-surface mb-4">
          Key Capabilities &amp; Pipeline Highlights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {tool.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Tool Recommendations */}
      <div className="pt-8 border-t border-outline-variant">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-base text-on-surface">Related Media Utilities</h3>
          <Link href="/tools" className="font-mono text-xs text-primary hover:underline flex items-center gap-1">
            <span>View All Tools</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherTools.slice(0, 3).map((other) => (
            <Link
              key={other.slug}
              href={`/tools/${other.slug}`}
              className="p-4 bg-surface-container-lowest border border-outline-variant hover:border-secondary/60 rounded-lg block transition-all group"
            >
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold uppercase">
                {other.badge}
              </span>
              <h4 className="font-semibold text-xs sm:text-sm text-on-surface group-hover:text-primary mt-2">
                {other.title}
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                {other.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
