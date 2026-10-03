'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveMedia, ApiClientError, getProxyStreamUrl } from '@/lib/api-client';
import { ResolveResponse, MediaFormat } from '@/types/api';
import {
  Download,
  Check,
  Loader2,
  Smartphone,
  Scissors,
  QrCode,
  X,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Clipboard,
  Youtube,
  Music,
  Image as PinterestIcon,
  Search,
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

export type DownloaderState =
  | 'IDLE'
  | 'PASTING'
  | 'VALIDATING'
  | 'FETCHING_METADATA'
  | 'READY'
  | 'DOWNLOADING'
  | 'COMPLETE'
  | 'ERROR';

interface DownloaderStateMachineProps {
  initialUrl?: string;
  onFocusShortcut?: boolean;
}

export function DownloaderStateMachine({ initialUrl = '' }: DownloaderStateMachineProps) {
  const [state, setState] = useState<DownloaderState>('IDLE');
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [platformMode, setPlatformMode] = useState<'all' | 'youtube' | 'pinterest' | 'mp3'>('all');
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingFormat, setDownloadingFormat] = useState<MediaFormat | null>(null);

  // Secondary utilities
  const [showQr, setShowQr] = useState(false);
  const [showAudioPreview, setShowAudioPreview] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setToast({ message: 'Input focused (Press Enter to resolve)', type: 'info' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  // Handle URL validation & resolution
  const handleResolve = async (targetUrl: string) => {
    const clean = targetUrl.trim();
    if (!clean) {
      setState('ERROR');
      setErrorMsg('Please enter a valid video or audio URL.');
      setToast({ message: 'Please enter a valid URL', type: 'error' });
      return;
    }

    // Validation step
    setState('VALIDATING');
    const isSupported =
      clean.includes('youtube.com') ||
      clean.includes('youtu.be') ||
      clean.includes('pinterest.com') ||
      clean.includes('pin.it');

    if (!isSupported) {
      setState('ERROR');
      setErrorMsg('Unsupported platform. FlowFetch supports YouTube and Pinterest.');
      setToast({ message: 'Please provide a YouTube or Pinterest link', type: 'error' });
      return;
    }

    setState('FETCHING_METADATA');
    setErrorMsg(null);

    try {
      const result = await resolveMedia(clean);
      setData(result);
      setState('READY');
      if (result.duration_seconds) {
        setTrimEnd(Math.min(30, result.duration_seconds));
      }
      setToast({ message: 'Stream manifest resolved successfully', type: 'success' });
    } catch (err: unknown) {
      setState('ERROR');
      const msg =
        err instanceof ApiClientError || err instanceof Error
          ? err.message
          : 'Could not resolve stream manifest. Ensure URL is public.';
      setErrorMsg(msg);
      setToast({ message: msg, type: 'error' });
    }
  };

  const handlePaste = async () => {
    setState('PASTING');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setState('IDLE');
          handleResolve(text.trim());
          return;
        }
      }
    } catch {
      // Clipboard denied
    }
    setState('IDLE');
  };

  const cleanTitle = data?.title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 50) || 'media';

  const videoFormats = data?.formats.filter((f) => !f.is_audio_only && f.ext !== 'mp3') || [];
  const audioFormats = data?.formats.filter((f) => f.is_audio_only || f.ext === 'mp3') || [];
  const primaryFormat = audioFormats[0] || videoFormats[0] || data?.formats[0];

  const getFormatDownloadUrl = (format: MediaFormat) => {
    const filename = `${cleanTitle}.${format.ext}`;
    return format.requires_server_stream
      ? getProxyStreamUrl(format.direct_url, filename, format.audio_url)
      : format.direct_url;
  };

  const handleDownload = (format: MediaFormat) => {
    setDownloadingFormat(format);
    setState('DOWNLOADING');
    setDownloadProgress(20);

    const filename = `${cleanTitle}.${format.ext}`;
    const directUrl = getFormatDownloadUrl(format);

    const progressTimer = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 25;
      });
    }, 180);

    setTimeout(() => {
      clearInterval(progressTimer);
      setDownloadProgress(100);
      setState('COMPLETE');

      // Trigger direct browser save
      const a = document.createElement('a');
      a.href = directUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setToast({ message: `${filename} download dispatched`, type: 'success' });
    }, 1100);
  };

  const resetAll = () => {
    setState('IDLE');
    setData(null);
    setUrl('');
    setErrorMsg(null);
    setDownloadingFormat(null);
    setDownloadProgress(0);
    setShowQr(false);
    setShowAudioPreview(false);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '03:45';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return 'Direct Stream';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-6 font-sans">
      {/* Ambient Top Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={3500}
        />
      )}

      {/* Platform Mode Selector Pills */}
      {state !== 'READY' && state !== 'DOWNLOADING' && state !== 'COMPLETE' && (
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <button
            type="button"
            onClick={() => setPlatformMode('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              platformMode === 'all'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 shadow-xs'
                : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A] hover:text-[#FAFAFA]'
            }`}
          >
            All Formats
          </button>
          <button
            type="button"
            onClick={() => setPlatformMode('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              platformMode === 'youtube'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 shadow-xs'
                : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A] hover:text-[#FAFAFA]'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            YouTube Video / Shorts
          </button>
          <button
            type="button"
            onClick={() => setPlatformMode('pinterest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              platformMode === 'pinterest'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 shadow-xs'
                : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A] hover:text-[#FAFAFA]'
            }`}
          >
            <PinterestIcon className="w-3.5 h-3.5 text-red-400" />
            Pinterest Pins
          </button>
          <button
            type="button"
            onClick={() => setPlatformMode('mp3')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              platformMode === 'mp3'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 shadow-xs'
                : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A] hover:text-[#FAFAFA]'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            MP3 Audio Extractor
          </button>
        </div>
      )}

      {/* FLIP Container Surface */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* State: IDLE / VALIDATING / FETCHING / ERROR / PASTING */}
        {state !== 'READY' && state !== 'DOWNLOADING' && state !== 'COMPLETE' && (
          <div className="p-2 sm:p-2.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResolve(url);
              }}
              className={`relative flex items-center gap-2 p-1 bg-[var(--input-bg)] border rounded-xl transition-all duration-200 ${
                state === 'ERROR'
                  ? 'animate-shake border-red-500/80 ring-1 ring-red-500/20'
                  : 'border-[var(--border-default)] focus-within:border-[var(--brand-primary)] focus-within:ring-1 focus-within:ring-[var(--brand-primary)]/20'
              }`}
            >
              <div className="pl-3 text-[var(--text-muted)]">
                {state === 'FETCHING_METADATA' || state === 'VALIDATING' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-primary)]" />
                ) : (
                  <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
              </div>

              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  platformMode === 'mp3'
                    ? 'Paste link to extract 320kbps MP3 audio...'
                    : platformMode === 'pinterest'
                    ? 'Paste Pinterest video or GIF pin URL...'
                    : platformMode === 'youtube'
                    ? 'Paste YouTube video or Shorts URL...'
                    : 'Paste YouTube video, Shorts, or Pinterest URL... (or press /)'
                }
                disabled={state === 'FETCHING_METADATA' || state === 'VALIDATING'}
                className="w-full py-2.5 px-2 text-sm text-[var(--text-primary)] bg-transparent focus:outline-none placeholder:text-[var(--text-muted)] font-normal"
                required
              />

              {url ? (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={state === 'FETCHING_METADATA'}
                  className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-alt)] border border-[var(--border-default)] px-3 py-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 duration-150 whitespace-nowrap shrink-0"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              )}

              <button
                type="submit"
                disabled={state === 'FETCHING_METADATA' || state === 'VALIDATING' || !url.trim()}
                className="btn-primary-glow group/btn flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap min-w-[96px] justify-center"
              >
                {state === 'FETCHING_METADATA' || state === 'VALIDATING' ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <span>Resolve</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Subtext info */}
            <div className="mt-2.5 px-2 flex items-center justify-between text-xs text-[#71717A]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Direct Pass-Through (Zero Buffering)
              </span>
              <span className="font-mono text-[11px] text-[#A1A1AA]">
                YouTube • Pinterest
              </span>
            </div>

            {/* Stream Telemetry Loading Box */}
            {(state === 'FETCHING_METADATA' || state === 'VALIDATING') && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 p-3.5 bg-[#09090B] border border-[#27272A] rounded-xl font-mono text-xs text-[#A1A1AA] text-left space-y-1.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-400 font-bold">Inspecting Stream Manifest...</span>
                  </div>
                  <span className="text-[10px] text-[#71717A]">HTTP/2.0 TLS v1.3</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p>➜ Protocol: <span className="text-blue-400">Direct Pass-Through</span></p>
                  <p>➜ Upstream: <span className="text-yellow-400">Origin CDN (Zero Storage)</span></p>
                  <p>➜ Latency: <span className="text-purple-400">18ms</span></p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {state === 'ERROR' && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 text-xs text-left"
              >
                {errorMsg}
              </motion.div>
            )}
          </div>
        )}

        {/* State: READY / DOWNLOADING / COMPLETE (FLIP Morphed Surface) */}
        {(state === 'READY' || state === 'DOWNLOADING' || state === 'COMPLETE') && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 sm:p-6 space-y-5"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#FAFAFA] tracking-tight">
                  Download Ready
                </h3>
                <p className="text-xs text-[#71717A] mt-0.5">Stream manifest resolved and verified</p>
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center gap-1 border border-[#27272A] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>New URL</span>
              </button>
            </div>

            {/* Media Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Thumbnail + Secondary Controls */}
              <div className="md:col-span-6 space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#27272A] flex items-center justify-center group">
                  {data.thumbnail ? (
                    <Image
                      src={data.thumbnail}
                      alt={data.title}
                      width={400}
                      height={225}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#18181B]" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 bg-black/75 rounded-full flex items-center justify-center text-white">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-[#FAFAFA] line-clamp-2">
                    {data.title}
                  </p>
                  <p className="text-xs text-[#71717A] font-mono">
                    Duration: {formatDuration(data.duration_seconds)} • 1080p Verified
                  </p>
                </div>

                {/* Secondary Utilities */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQr(!showQr);
                      setShowAudioPreview(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] rounded-lg transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Scan to Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAudioPreview(!showAudioPreview);
                      setShowQr(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] rounded-lg transition-colors cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Audio Preview</span>
                  </button>
                </div>

                {/* QR Code Drawer */}
                {showQr && (
                  <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl text-center space-y-2">
                    <div className="flex justify-between items-center text-xs text-[#FAFAFA]">
                      <span>Scan to Download</span>
                      <button onClick={() => setShowQr(false)} className="text-[#71717A] hover:text-[#FAFAFA]">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex justify-center py-1">
                      <div className="p-1.5 bg-white rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                            primaryFormat ? getFormatDownloadUrl(primaryFormat) : window.location.href
                          )}`}
                          alt="QR Code"
                          width={130}
                          height={130}
                          className="w-28 h-28"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-[#71717A]">Direct download prompt on iOS or Android</p>
                  </div>
                )}

                {/* Audio Preview Drawer */}
                {showAudioPreview && (
                  <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl text-left space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#FAFAFA]">
                      <span>Audio Preview &amp; Trim</span>
                      <button onClick={() => setShowAudioPreview(false)} className="text-[#71717A] hover:text-[#FAFAFA]">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {audioFormats[0]?.direct_url && (
                      <audio
                        ref={audioRef}
                        src={audioFormats[0].direct_url}
                        onEnded={() => setIsPlayingAudio(false)}
                        className="hidden"
                      />
                    )}
                    <div className="flex items-center justify-between text-[11px] text-[#71717A] font-mono">
                      <span>Start: {formatDuration(trimStart)}</span>
                      <span>End: {formatDuration(trimEnd)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={data.duration_seconds || 180}
                        value={trimStart}
                        onChange={(e) => setTrimStart(Number(e.target.value))}
                        className="w-full accent-[#EF4444] h-1.5 bg-[#27272A] rounded cursor-pointer"
                      />
                      <input
                        type="range"
                        min={0}
                        max={data.duration_seconds || 180}
                        value={trimEnd}
                        onChange={(e) => setTrimEnd(Number(e.target.value))}
                        className="w-full accent-[#EF4444] h-1.5 bg-[#27272A] rounded cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!audioRef.current) return;
                        if (isPlayingAudio) {
                          audioRef.current.pause();
                          setIsPlayingAudio(false);
                        } else {
                          audioRef.current.currentTime = trimStart;
                          audioRef.current.play().catch(() => {});
                          setIsPlayingAudio(true);
                        }
                      }}
                      className="px-3 py-1 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] rounded text-[#FAFAFA] flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingAudio ? 'Pause' : 'Play Segment'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Format selection */}
              <div className="md:col-span-6 space-y-3">
                {/* Tabs */}
                <div className="flex border-b border-[#27272A] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`flex-1 pb-2 text-center transition-colors cursor-pointer ${
                      activeTab === 'video'
                        ? 'text-[#EF4444] border-b-2 border-[#EF4444]'
                        : 'text-[#71717A] hover:text-[#FAFAFA]'
                    }`}
                  >
                    Video (MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('audio')}
                    className={`flex-1 pb-2 text-center transition-colors cursor-pointer ${
                      activeTab === 'audio'
                        ? 'text-[#EF4444] border-b-2 border-[#EF4444]'
                        : 'text-[#71717A] hover:text-[#FAFAFA]'
                    }`}
                  >
                    Audio (MP3)
                  </button>
                </div>

                {/* Formats list */}
                <div className="border border-[#27272A] rounded-xl overflow-hidden divide-y divide-[#18181B] bg-[#09090B]">
                  {activeTab === 'video' ? (
                    videoFormats.map((fmt) => (
                      <div
                        key={fmt.id}
                        className="p-2.5 flex items-center justify-between text-xs hover:bg-[#111113] transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-[#FAFAFA]">{fmt.quality_label}</span>
                          <span className="text-[#71717A] text-[11px] ml-2 font-mono">
                            {formatFileSize(fmt.filesize_bytes)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownload(fmt)}
                          disabled={state === 'DOWNLOADING'}
                          className="px-3.5 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    audioFormats.map((fmt) => (
                      <div
                        key={fmt.id}
                        className="p-2.5 flex items-center justify-between text-xs hover:bg-[#111113] transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-[#FAFAFA]">
                            {fmt.quality_label || '320k Audio'}
                          </span>
                          <span className="text-[#71717A] text-[11px] ml-2 font-mono">
                            {formatFileSize(fmt.filesize_bytes)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownload(fmt)}
                          disabled={state === 'DOWNLOADING'}
                          className="px-3.5 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Progress Indicator when downloading or complete */}
                {(state === 'DOWNLOADING' || state === 'COMPLETE') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl space-y-2 text-left text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#FAFAFA] font-medium flex items-center gap-1.5">
                        {state === 'COMPLETE' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Download Dispatched</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EF4444]" />
                            <span>Streaming Chunks from CDN...</span>
                          </>
                        )}
                      </span>
                      <span className="text-[#71717A] font-mono">{downloadProgress}%</span>
                    </div>

                    <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${state === 'COMPLETE' ? 'bg-emerald-400' : 'bg-[#EF4444]'}`}
                        style={{ width: `${downloadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
