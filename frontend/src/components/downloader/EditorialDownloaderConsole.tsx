'use client';

import React, { useState, useEffect, useRef } from 'react';
import { resolveMedia, ApiClientError, getProxyStreamUrl } from '@/lib/api-client';
import { ResolveResponse, MediaFormat } from '@/types/api';
import {
  Search,
  Link as LinkIcon,
  X,
  Clipboard,
  ArrowDown,
  Zap,
  Layers,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Clock,
  Film,
  Music,
  Image as ImageIcon,
  Copy,
  ExternalLink,
  Download,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Server,
  CloudDownload,
  HardDrive,
  Check,
} from 'lucide-react';

export type SimulatorState = 'resolved' | 'progress' | 'skeleton' | 'error';
export type ActiveTab = 'video' | 'audio' | 'thumb';
export type PlatformTab = 'youtube' | 'pinterest';

const DEFAULT_SAMPLE_DATA: ResolveResponse = {
  platform: 'youtube',
  source_url: 'https://www.youtube.com/watch?v=A8vG4UoW_9Q',
  media_id: 'A8vG4UoW_9Q',
  title: 'A Journey Through Beautiful Landscapes — 4K Alpine Documentary',
  thumbnail:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1280&auto=format&fit=crop',
  duration_seconds: 1122, // 18:42
  cached: false,
  formats: [
    {
      id: '2160p',
      ext: 'mp4',
      quality_label: '4K UHD (2160p)',
      filesize_bytes: 1975684915, // ~1.84 GB
      direct_url: '#',
      is_audio_only: false,
      requires_server_stream: true,
    },
    {
      id: '1080p',
      ext: 'mp4',
      quality_label: '1080p Full HD',
      filesize_bytes: 220200960, // ~210 MB
      direct_url: '#',
      is_audio_only: false,
      requires_server_stream: true,
    },
    {
      id: '720p',
      ext: 'mp4',
      quality_label: '720p HD',
      filesize_bytes: 120586240, // ~115 MB
      direct_url: '#',
      is_audio_only: false,
      requires_server_stream: false,
    },
    {
      id: '480p',
      ext: 'mp4',
      quality_label: '480p SD',
      filesize_bytes: 56623104, // ~54 MB
      direct_url: '#',
      is_audio_only: false,
      requires_server_stream: false,
    },
    {
      id: '360p',
      ext: 'mp4',
      quality_label: '360p Compact',
      filesize_bytes: 29360128, // ~28 MB
      direct_url: '#',
      is_audio_only: false,
      requires_server_stream: false,
    },
    {
      id: 'mp3-320',
      ext: 'mp3',
      quality_label: '320 kbps High Fidelity Audio',
      filesize_bytes: 44879052, // ~42.8 MB
      direct_url: '#',
      is_audio_only: true,
      requires_server_stream: true,
    },
    {
      id: 'm4a-256',
      ext: 'mp3',
      quality_label: '256 kbps Standard Audio',
      filesize_bytes: 35861299, // ~34.2 MB
      direct_url: '#',
      is_audio_only: true,
      requires_server_stream: false,
    },
    {
      id: 'mp3-128',
      ext: 'mp3',
      quality_label: '128 kbps Voice / Podcast',
      filesize_bytes: 17930649, // ~17.1 MB
      direct_url: '#',
      is_audio_only: true,
      requires_server_stream: false,
    },
    {
      id: 'thumb-max',
      ext: 'jpg',
      quality_label: 'Maximum Resolution (1920 × 1080)',
      filesize_bytes: 491520, // 480 KB
      direct_url:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
      is_audio_only: false,
      requires_server_stream: false,
    },
    {
      id: 'thumb-std',
      ext: 'webp',
      quality_label: 'Standard Preview (640 × 360)',
      filesize_bytes: 94208, // 92 KB
      direct_url:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=640&auto=format&fit=crop',
      is_audio_only: false,
      requires_server_stream: false,
    },
  ],
};

export function EditorialDownloaderConsole() {
  // Simulator state: resolved | progress | skeleton | error
  const [simState, setSimState] = useState<SimulatorState>('resolved');
  const [activePlatform, setActivePlatform] = useState<PlatformTab>('youtube');
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/watch?v=A8vG4UoW_9Q');
  const [mediaData, setMediaData] = useState<ResolveResponse>(DEFAULT_SAMPLE_DATA);
  const [formatTab, setFormatTab] = useState<ActiveTab>('video');
  const [errorMessage, setErrorMessage] = useState<string>(
    'The provided link from Pinterest / YouTube cannot be processed. The resource is either set to Private, restricted by geographic region, or does not contain a public media manifest.'
  );

  // Active Download Progress State
  const [downloadPercent, setDownloadPercent] = useState(68);
  const [downloadSpeed, setDownloadSpeed] = useState('12.4 MB/s');
  const [timeRemaining, setTimeRemaining] = useState('~8s remaining');
  const [isPaused, setIsPaused] = useState(false);
  const [activePreset, setActivePreset] = useState('1080p Full HD • MP4 container • Target size: 210 MB');
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Direct link copy state
  const [linkCopied, setLinkCopied] = useState(false);

  // Handle Platform Tab Switch
  const handlePlatformSwitch = (platform: PlatformTab) => {
    setActivePlatform(platform);
    if (platform === 'youtube') {
      setUrlInput('https://www.youtube.com/watch?v=A8vG4UoW_9Q');
    } else {
      setUrlInput('https://www.pinterest.com/pin/1089304603632948271/');
    }
  };

  // Clipboard Paste
  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
        }
      }
    } catch {
      // Ignored
    }
  };

  // Clear Input
  const handleClear = () => {
    setUrlInput('');
  };

  // Start Download Simulation
  const startDownloadSimulation = (presetName: string, sizeLabel: string) => {
    setActivePreset(`${presetName} • Target size: ${sizeLabel}`);
    setSimState('progress');
    setDownloadPercent(12);
    setIsPaused(false);

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      setDownloadPercent((prev) => {
        if (prev >= 98) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + delta, 98);
      });
    }, 400);
  };

  // Toggle Pause
  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused && progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    } else if (isPaused) {
      progressTimerRef.current = setInterval(() => {
        setDownloadPercent((prev) => {
          if (prev >= 98) {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            return 100;
          }
          const delta = Math.floor(Math.random() * 8) + 4;
          return Math.min(prev + delta, 98);
        });
      }, 400);
    }
  };

  // Submit Resolution (Supports Real API + Fallback)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setSimState('skeleton');

    try {
      const result = await resolveMedia(urlInput.trim());
      setMediaData(result);
      setSimState('resolved');
      setFormatTab('video');
    } catch (err: unknown) {
      // If error, check if default sample or offline fallback
      if (urlInput.includes('A8vG4UoW_9Q')) {
        setTimeout(() => {
          setMediaData(DEFAULT_SAMPLE_DATA);
          setSimState('resolved');
        }, 700);
      } else {
        const msg =
          err instanceof ApiClientError || err instanceof Error
            ? err.message
            : 'Unable to extract downloadable stream. The resource may be restricted or deleted.';
        setErrorMessage(msg);
        setSimState('error');
      }
    }
  };

  // Direct Link Copy
  const copyDirectLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mediaData.source_url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Clean title for download
  const cleanTitle = mediaData.title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 50) || 'media';

  const videoFormats = mediaData.formats.filter((f) => !f.is_audio_only && f.ext !== 'jpg' && f.ext !== 'webp');
  const audioFormats = mediaData.formats.filter((f) => f.is_audio_only || f.ext === 'mp3');
  const thumbFormats = mediaData.formats.filter((f) => f.ext === 'jpg' || f.ext === 'webp');

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return 'Variable';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '18:42';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. PRIMARY DOWNLOAD HERO FORM */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-on-surface tracking-tight leading-tight">
          Paste a link. Get your media.
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-xl leading-relaxed">
          Download available media from a public YouTube or Pinterest link directly to your device.
        </p>

        {/* Platform Segmented Tab Selector */}
        <div
          className="mt-6 flex items-center p-1 bg-surface-container rounded border border-outline-variant shadow-xs"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activePlatform === 'youtube'}
            onClick={() => handlePlatformSwitch('youtube')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded font-mono text-xs transition-all ${
              activePlatform === 'youtube'
                ? 'bg-primary text-on-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>YouTube</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activePlatform === 'pinterest'}
            onClick={() => handlePlatformSwitch('pinterest')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded font-mono text-xs transition-all ${
              activePlatform === 'pinterest'
                ? 'bg-primary text-on-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Pinterest</span>
          </button>
        </div>

        {/* Main Input Bar */}
        <div className="w-full mt-4">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col sm:flex-row items-stretch gap-1.5 p-1.5 bg-surface-container-lowest border-2 border-outline-variant focus-within:border-secondary rounded-lg shadow-xs transition-colors"
          >
            <div className="flex items-center flex-1 min-w-0 px-2 gap-2">
              <LinkIcon className="w-4 h-4 text-outline shrink-0" />
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={
                  activePlatform === 'youtube'
                    ? 'Paste YouTube video or Shorts URL...'
                    : 'Paste Pinterest Pin or Story URL...'
                }
                className="w-full bg-transparent font-body text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none truncate"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear input"
                  className="text-outline hover:text-on-surface p-1 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-on-surface-variant hover:text-primary px-2 py-1 bg-surface-container rounded border border-outline-variant transition-colors whitespace-nowrap"
              >
                <Clipboard className="w-3 h-3" />
                <span>Paste</span>
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-secondary active:scale-[0.98] text-on-primary font-semibold text-xs sm:text-sm rounded transition-all shadow-xs shrink-0"
            >
              <span>Download</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-on-surface-variant font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-secondary" />
            <span>Fast &amp; Direct</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
            <span>No registration required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-secondary" />
            <span>Works on all platforms</span>
          </div>
        </div>
      </section>

      {/* 2. ADVERTISEMENT SLOT 1 */}
      <section aria-label="Sponsored Content" className="max-w-4xl mx-auto w-full">
        <div className="w-full border border-dashed border-outline-variant bg-surface-container-low rounded p-3 flex flex-col items-center justify-center min-h-[84px] text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Advertisement</span>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-2xl px-3 py-1">
            <div className="flex items-center gap-3 text-left">
              <Server className="w-6 h-6 text-outline shrink-0" />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-on-surface">
                  Need faster cloud transcode pipelines?
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Explore low-latency media compute nodes with standard S3 connectors.
                </p>
              </div>
            </div>
            <a
              href="https://nordvpn.com"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1 bg-surface-container-lowest border border-outline text-on-surface font-mono text-xs rounded hover:bg-surface-container whitespace-nowrap transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* 3. STATE SWITCHER / UTILITY SIMULATOR TOOLBAR */}
      <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-2 bg-surface-container rounded border border-outline-variant">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-xs">
          <Sliders className="w-3.5 h-3.5 text-secondary" />
          <span>Utility Simulator:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group">
          <button
            type="button"
            onClick={() => setSimState('resolved')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all ${
              simState === 'resolved'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
          >
            1. Resolved Media
          </button>

          <button
            type="button"
            onClick={() => setSimState('progress')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all ${
              simState === 'progress'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
          >
            2. Active Progress
          </button>

          <button
            type="button"
            onClick={() => setSimState('skeleton')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all ${
              simState === 'skeleton'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
          >
            3. Loading Fetch
          </button>

          <button
            type="button"
            onClick={() => setSimState('error')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all ${
              simState === 'error'
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
          >
            4. Error / Private
          </button>
        </div>
      </div>

      {/* 4. STATE 1: RESOLVED MEDIA RESULT PANEL */}
      {simState === 'resolved' && (
        <section className="max-w-4xl mx-auto w-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-xs text-left">
          {/* Media Header Bar */}
          <div className="p-4 sm:p-5 border-b border-outline-variant flex flex-col md:flex-row gap-4">
            {/* Media Preview Thumbnail (16:9) */}
            <div className="relative w-full md:w-64 aspect-video bg-surface-container shrink-0 rounded overflow-hidden border border-outline-variant">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={mediaData.title}
                src={mediaData.thumbnail}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded tracking-wider font-bold">
                {formatDuration(mediaData.duration_seconds)}
              </div>
              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-on-primary font-mono text-[10px] uppercase font-bold rounded">
                4K UHD
              </div>
            </div>

            {/* Video Metadata Info */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-secondary uppercase tracking-wider font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Metadata Verified</span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-on-surface mt-1 tracking-tight line-clamp-2 leading-snug">
                  {mediaData.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 font-mono text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1 font-medium text-on-surface">
                    <span className="text-red-500 font-bold">YouTube</span>
                  </span>
                  <span>•</span>
                  <span>National Nature Archive</span>
                  <span>•</span>
                  <span>2.4M views</span>
                  <span>•</span>
                  <span>Published 3 days ago</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyDirectLink}
                  className="flex items-center gap-1 font-mono text-xs text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded bg-surface-container border border-outline-variant transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{linkCopied ? 'Copied Link!' : 'Copy Direct Link'}</span>
                </button>
                <a
                  href={mediaData.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-xs text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded bg-surface-container border border-outline-variant transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              </div>
            </div>
          </div>

          {/* Format Filter Tabs */}
          <div className="bg-surface-container-low px-4 pt-2 border-b border-outline-variant flex gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFormatTab('video')}
              className={`font-mono text-xs pb-2 border-b-2 flex items-center gap-1 font-medium whitespace-nowrap transition-colors ${
                formatTab === 'video'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video ({videoFormats.length > 0 ? videoFormats.length : 5})</span>
            </button>

            <button
              type="button"
              onClick={() => setFormatTab('audio')}
              className={`font-mono text-xs pb-2 border-b-2 flex items-center gap-1 font-medium whitespace-nowrap transition-colors ${
                formatTab === 'audio'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio Only ({audioFormats.length > 0 ? audioFormats.length : 3})</span>
            </button>

            <button
              type="button"
              onClick={() => setFormatTab('thumb')}
              className={`font-mono text-xs pb-2 border-b-2 flex items-center gap-1 font-medium whitespace-nowrap transition-colors ${
                formatTab === 'thumb'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Thumbnail Cover ({thumbFormats.length > 0 ? thumbFormats.length : 2})</span>
            </button>
          </div>

          {/* Quality Options Table (Video View) */}
          {formatTab === 'video' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container font-mono text-[11px] text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
                    <th className="py-2.5 px-4">Quality Preset</th>
                    <th className="py-2.5 px-4">Codec</th>
                    <th className="py-2.5 px-4">Est. Size</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-xs text-on-surface">
                  {videoFormats.map((fmt, idx) => {
                    const isUltra = fmt.quality_label.includes('2160p') || fmt.quality_label.includes('4K');
                    const isRec = fmt.quality_label.includes('1080p');
                    const sizeLabel = formatFileSize(fmt.filesize_bytes);

                    return (
                      <tr
                        key={fmt.id || idx}
                        className={`hover:bg-surface-container-low transition-colors ${
                          isRec ? 'bg-secondary-container/20 border-l-4 border-l-secondary' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface">{fmt.quality_label}</span>
                            {isUltra && (
                              <span className="px-1.5 py-0.2 bg-primary text-on-primary font-mono text-[10px] rounded uppercase font-bold">
                                Ultra
                              </span>
                            )}
                            {isRec && (
                              <span className="px-1.5 py-0.2 bg-secondary-container text-on-secondary-container font-mono text-[10px] rounded uppercase font-semibold">
                                Recommended
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-on-surface-variant">
                          MP4 (H.264 / AAC)
                        </td>

                        <td className="py-3 px-4 font-mono text-on-surface font-semibold">
                          {sizeLabel}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => startDownloadSimulation(fmt.quality_label, sizeLabel)}
                            className={`px-3.5 py-1.5 font-mono text-xs rounded transition-colors inline-flex items-center gap-1 shadow-xs ${
                              isRec
                                ? 'bg-secondary hover:bg-primary text-on-secondary'
                                : isUltra
                                ? 'bg-primary hover:bg-secondary text-on-primary'
                                : 'bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface'
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Quality Options Table (Audio View) */}
          {formatTab === 'audio' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container font-mono text-[11px] text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
                    <th className="py-2.5 px-4">Bitrate Profile</th>
                    <th className="py-2.5 px-4">Format</th>
                    <th className="py-2.5 px-4">Est. Size</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-xs text-on-surface">
                  {audioFormats.map((fmt, idx) => {
                    const sizeLabel = formatFileSize(fmt.filesize_bytes);
                    return (
                      <tr key={fmt.id || idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4 font-medium">{fmt.quality_label}</td>
                        <td className="py-3 px-4 font-mono text-on-surface-variant">
                          {fmt.quality_label.includes('256') ? 'M4A (AAC)' : 'MP3 Audio'}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-on-surface">
                          {sizeLabel}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => startDownloadSimulation(fmt.quality_label, sizeLabel)}
                            className="px-3.5 py-1.5 bg-primary hover:bg-secondary text-on-primary font-mono text-xs rounded transition-colors inline-flex items-center gap-1 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save {fmt.quality_label.includes('256') ? 'M4A' : 'MP3'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Quality Options (Thumbnail View) */}
          {formatTab === 'thumb' && (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-surface-container rounded border border-outline-variant flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-sm">Maximum Resolution (1920 × 1080)</div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Original raw keyframe graphic directly from stream payload.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold">JPG • 480 KB</span>
                    <a
                      href={mediaData.thumbnail}
                      download={`${cleanTitle}_max.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1 bg-primary text-on-primary font-mono text-xs rounded hover:bg-secondary inline-flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </a>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container rounded border border-outline-variant flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-sm">Standard Preview (640 × 360)</div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Compressed lightweight cover image suitable for thumbnails.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold">WEBP • 92 KB</span>
                    <a
                      href={mediaData.thumbnail}
                      download={`${cleanTitle}_std.webp`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container font-mono text-xs rounded text-on-surface inline-flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download WEBP</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. STATE 2: ACTIVE DOWNLOAD PROGRESS COMPONENT */}
      {simState === 'progress' && (
        <section className="max-w-4xl mx-auto w-full bg-surface-container-lowest border-2 border-secondary rounded-lg p-4 sm:p-5 shadow-xs text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center shrink-0">
                <CloudDownload className="w-5 h-5 text-on-secondary-container animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-on-surface truncate">
                  {mediaData.title}
                </h3>
                <p className="font-mono text-xs text-on-surface-variant mt-0.5">{activePreset}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={togglePause}
                className="px-3 py-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high font-mono text-xs rounded text-on-surface flex items-center gap-1.5 transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSimState('resolved')}
                className="px-3 py-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high font-mono text-xs rounded text-error flex items-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between font-mono text-xs mb-1.5">
              <span className="text-secondary font-semibold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping" />
                <span>
                  {downloadPercent >= 100
                    ? 'Download Complete (100%)'
                    : `Downloading: ${downloadPercent}% completed (${((downloadPercent * 210) / 100).toFixed(
                        1
                      )} MB / 210 MB)`}
                </span>
              </span>
              <span className="text-on-surface-variant">
                {downloadPercent >= 100 ? 'Transfer Finished' : `${downloadSpeed} • ${timeRemaining}`}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${downloadPercent}%` }}
              />
            </div>
          </div>

          {/* Post-processing Options */}
          <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="accent-primary rounded-xs w-3.5 h-3.5 cursor-pointer"
              />
              <span>Save file directly to system default Downloads directory</span>
            </label>
            <span className="font-mono text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded">
              Transcode engine: FFmpeg v6.1 Direct Stream Copy
            </span>
          </div>
        </section>
      )}

      {/* 6. STATE 3: LOADING SKELETON STATE */}
      {simState === 'skeleton' && (
        <section className="max-w-4xl mx-auto w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-xs animate-pulse text-left">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64 aspect-video bg-surface-container rounded" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-surface-container rounded w-1/4" />
              <div className="h-6 bg-surface-container rounded w-3/4" />
              <div className="h-4 bg-surface-container rounded w-1/2" />
              <div className="h-8 bg-surface-container rounded w-1/3 mt-4" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-8 bg-surface-container rounded w-full" />
            <div className="h-10 bg-surface-container rounded w-full" />
            <div className="h-10 bg-surface-container rounded w-full" />
            <div className="h-10 bg-surface-container rounded w-full" />
          </div>
          <p className="font-mono text-xs text-center text-outline mt-4">
            Resolving video streams and parsing audio mux rates from server...
          </p>
        </section>
      )}

      {/* 7. STATE 4: ERROR / PRIVATE STATE */}
      {simState === 'error' && (
        <section className="max-w-4xl mx-auto w-full bg-surface-container-lowest border border-error/40 rounded-lg p-4 sm:p-5 shadow-xs text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-semibold uppercase text-error">Resolution Error #403</span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant">Private or Restricted Asset</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-on-surface mt-0.5">
                Unable to extract downloadable stream
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                {errorMessage}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    setSimState('resolved');
                  }}
                  className="px-3.5 py-1.5 bg-primary text-on-primary font-mono text-xs rounded hover:bg-secondary transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Another Link</span>
                </button>
                <a
                  href="#faq"
                  className="px-3.5 py-1.5 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface font-mono text-xs rounded transition-colors"
                >
                  Read Why Links Fail
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
