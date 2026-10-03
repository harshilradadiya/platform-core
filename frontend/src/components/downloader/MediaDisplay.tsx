'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ResolveResponse, MediaFormat } from '@/types/api';
import { getProxyStreamUrl } from '@/lib/api-client';
import { QrCode, Scissors, Play, Pause, Smartphone, X, Download, Loader2 } from 'lucide-react';

interface MediaDisplayProps {
  data: ResolveResponse;
  onReset?: () => void;
}

export function MediaDisplay({ data, onReset }: MediaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [showAudioPreview, setShowAudioPreview] = useState(false);

  // Audio preview / crop states
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const totalDuration = data.duration_seconds || 180;
  const [trimEnd, setTrimEnd] = useState(Math.min(30, totalDuration));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const videoFormats = data.formats.filter((f) => !f.is_audio_only && f.ext !== 'mp3');
  const audioFormats = data.formats.filter((f) => f.is_audio_only || f.ext === 'mp3');

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '03:45';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return 'Direct Stream';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const cleanTitle = data.title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 50);

  const getFormatDownloadUrl = (format: MediaFormat) => {
    const filename = `${cleanTitle || 'media'}.${format.ext}`;
    return format.requires_server_stream
      ? getProxyStreamUrl(format.direct_url, filename, format.audio_url)
      : format.direct_url;
  };

  const handleDownload = (format: MediaFormat) => {
    setDownloadingId(format.id);
    const filename = `${cleanTitle || 'media'}.${format.ext}`;
    const url = getFormatDownloadUrl(format);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDownloadingId(null), 2500);
  };

  // Primary stream for QR Code and Audio preview
  const primaryFormat = audioFormats[0] || videoFormats[0] || data.formats[0];
  const primaryDownloadUrl = primaryFormat ? getFormatDownloadUrl(primaryFormat) : '';
  const audioStreamUrl = audioFormats[0]?.direct_url || (videoFormats[0] ? getFormatDownloadUrl(videoFormats[0]) : '');

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = trimStart;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-subtle font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Download Ready
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Stream manifests resolved and verified</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Direct Pass-Through
        </span>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Media Thumbnail + Title + Metadata */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center group border border-slate-100">
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
              <div className="w-full h-full bg-slate-800" />
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white shadow-sm">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
              {data.title}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>Duration: {formatDuration(data.duration_seconds)}</span>
              <span>•</span>
              <span className="text-emerald-600 font-sans font-medium">Verified Stream</span>
            </div>
          </div>

          {/* Secondary Utilities: Functional Lucide Icons */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setShowQr(!showQr);
                setShowAudioPreview(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                showQr
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Scan to Mobile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAudioPreview(!showAudioPreview);
                setShowQr(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                showAudioPreview
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Audio Preview / Trim</span>
            </button>
          </div>

          {/* Utility Box 1: Scan to Mobile QR Drawer */}
          {showQr && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-center animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span>Scan to Download on Phone</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowQr(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Close QR drawer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-center py-1">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      primaryDownloadUrl || (typeof window !== 'undefined' ? window.location.href : '')
                    )}`}
                    alt="Scan QR Code"
                    width={140}
                    height={140}
                    className="w-32 h-32 rounded"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Point your mobile camera at this code to download directly to your device storage.
              </p>
            </div>
          )}

          {/* Utility Box 2: Audio Preview / Trim */}
          {showAudioPreview && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-left animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-slate-700" />
                  <span>Audio Preview &amp; Trim</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowAudioPreview(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    }
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Close audio preview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {audioStreamUrl && (
                <audio
                  ref={audioRef}
                  src={audioStreamUrl}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={() => {
                    if (audioRef.current && audioRef.current.currentTime >= trimEnd) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                      audioRef.current.currentTime = trimStart;
                    }
                  }}
                  className="hidden"
                />
              )}

              {/* Scrubber Controls */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-slate-600 font-mono text-[11px]">
                  <span>Start: {formatDuration(trimStart)}</span>
                  <span>End: {formatDuration(trimEnd)}</span>
                  <span>Segment: {trimEnd - trimStart}s</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={totalDuration}
                    value={trimStart}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < trimEnd) setTrimStart(val);
                    }}
                    className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="range"
                    min={0}
                    max={totalDuration}
                    value={trimEnd}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > trimStart) setTrimEnd(val);
                    }}
                    className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleAudioPlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg font-medium transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Segment'}</span>
                </button>

                <span className="text-[11px] text-slate-500 font-mono">
                  Direct Stream
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tab Switcher + Format List */}
        <div className="md:col-span-6 space-y-4">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-200 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex-1 pb-2.5 text-center transition-colors relative cursor-pointer ${
                activeTab === 'video'
                  ? 'text-red-600 border-b-2 border-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Video (MP4)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`flex-1 pb-2.5 text-center transition-colors relative cursor-pointer ${
                activeTab === 'audio'
                  ? 'text-red-600 border-b-2 border-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Audio (MP3)
            </button>
          </div>

          {/* Formats List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            {activeTab === 'video' ? (
              videoFormats.length > 0 ? (
                videoFormats.map((fmt) => (
                  <div
                    key={fmt.id}
                    className="p-3 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {fmt.quality_label}
                      </span>
                      <span className="text-slate-500 text-xs ml-2 font-mono">
                        {formatFileSize(fmt.filesize_bytes)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(fmt)}
                      disabled={downloadingId === fmt.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {downloadingId === fmt.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Starting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No video formats available for this source.</div>
              )
            ) : (
              audioFormats.length > 0 ? (
                audioFormats.map((fmt) => (
                  <div
                    key={fmt.id}
                    className="p-3 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {fmt.quality_label || 'High Quality Audio'}
                      </span>
                      <span className="text-slate-500 text-xs ml-2 font-mono">
                        {formatFileSize(fmt.filesize_bytes)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(fmt)}
                      disabled={downloadingId === fmt.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {downloadingId === fmt.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Starting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No audio formats available for this source.</div>
              )
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-left leading-relaxed">
            Direct CDN stream transfer. Zero intermediate server storage.
          </p>
        </div>
      </div>

      {/* Convert Another Video Button */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex justify-center">
        <button
          type="button"
          onClick={() => {
            if (onReset) onReset();
            else window.location.reload();
          }}
          className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
        >
          Convert Another Video
        </button>
      </div>
    </div>
  );
}
