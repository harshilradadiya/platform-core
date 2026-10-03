'use client';

import React, { useState } from 'react';
import { UrlForm } from '@/components/downloader/UrlForm';
import { MediaDisplay } from '@/components/downloader/MediaDisplay';
import { resolveMedia, ApiClientError } from '@/lib/api-client';
import { ResolveResponse } from '@/types/api';

export function ShortsDownloaderClient() {
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [inputUrl, setInputUrl] = useState('');

  const sampleShorts = [
    {
      title: 'Viral Dance Challenge',
      duration: '0:15',
      url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      thumbnailBg: 'from-amber-500 to-rose-500',
    },
    {
      title: 'Quick Recipe',
      duration: '0:22',
      url: 'https://www.youtube.com/shorts/jNQXAC9IVRw',
      thumbnailBg: 'from-emerald-500 to-teal-700',
    },
    {
      title: 'Quick Actions',
      duration: '0:30',
      url: 'https://www.youtube.com/shorts/5uN1m2z3xyz',
      thumbnailBg: 'from-blue-600 to-indigo-800',
    },
  ];

  const handleResolve = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await resolveMedia(url);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to resolve Shorts video.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Header */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-sans">
          YouTube Shorts Downloader
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Paste link to save vertical videos in high quality
        </p>
      </section>

      {/* Split Hero Card matching the Design Board (Row 2 Col 1) */}
      {!data && (
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: 9:16 Vertical Preview Frame with Shorts Logo */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-44 sm:w-48 aspect-[9/16] rounded-xl bg-slate-800 border-2 border-slate-700 shadow-md flex flex-col items-center justify-center text-white overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-red-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {/* YouTube Shorts S Logo */}
                  <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                    <path d="M17.77 10.32l-1.2-.5-1.1-.46 1.13-.5c1.47-.64 2.4-2.12 2.4-3.72 0-2.27-1.85-4.12-4.12-4.12-.96 0-1.88.34-2.61.96L4.73 7.24C3.65 8.16 3 9.54 3 11c0 1.6.93 3.08 2.4 3.72l1.2.5 1.1.46-1.13.5c-1.47.64-2.4 2.12-2.4 3.72 0 2.27 1.85 4.12 4.12 4.12.96 0 1.88-.34 2.61-.96l7.54-5.26c1.08-.92 1.73-2.3 1.73-3.76 0-1.6-.93-3.08-2.4-3.72zm-7.27 5.18V8.5l5.5 3.5-5.5 3.5z" />
                  </svg>
                </div>
                <span className="mt-3 text-xs font-semibold tracking-wide text-slate-300">
                  9:16 Vertical HD
                </span>
                <span className="absolute bottom-3 text-[10px] text-slate-400 font-mono">
                  1080 × 1920
                </span>
              </div>
            </div>

            {/* Right: Input, Get Shorts Button & Quality Pills */}
            <div className="md:col-span-8 space-y-5">
              <div className="space-y-3">
                <div className="relative flex items-center w-full">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://www.youtube.com/shorts/..."
                    className="w-full pl-4 pr-24 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) setInputUrl(text);
                      } catch {
                        // ignore clipboard error
                      }
                    }}
                    className="absolute right-2 px-3 py-1.5 bg-[#64748B] hover:bg-[#475569] text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    Paste
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (inputUrl.trim()) handleResolve(inputUrl);
                    }}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    {isLoading ? 'Resolving...' : 'Get Shorts'}
                  </button>

                  {/* Quality Pills matching Design Board */}
                  <div className="flex items-center gap-2">
                    {['1080p', '720p', '480p'].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setSelectedQuality(q)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                          selectedQuality === q
                            ? 'bg-[#2563EB] text-white border-[#2563EB]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>⚡ Instant stream extraction</span>
                <span>🚫 No watermark or overlay</span>
                <span>📱 Compatible with iOS & Android</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Result Card (when resolved) */}
      {data && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mb-12">
          <MediaDisplay data={data} onReset={() => setData(null)} />
        </div>
      )}

      {/* 3 Featured Sample Video Cards with MP4 badges matching Design Board */}
      {!data && (
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sampleShorts.map((short, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Vertical 9:16 Mock Thumbnail with duration pill */}
                <div
                  className={`relative w-full aspect-[9/14] rounded-lg bg-gradient-to-br ${short.thumbnailBg} flex items-center justify-center overflow-hidden mb-3`}
                >
                  <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-xs">
                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 text-white font-mono text-[11px] rounded">
                    {short.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-900 truncate text-center">
                    {short.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleResolve(short.url)}
                    className="w-full py-2 bg-[#64748B] hover:bg-[#475569] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Download</span>
                    <span className="px-1.5 py-0.5 bg-black/25 text-[10px] rounded uppercase font-bold">
                      MP4
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features matching SnapYT Image 3 */}
          <div className="mt-14 text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Features</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
              <span className="flex items-center gap-2">
                <span className="p-1.5 bg-gray-100 rounded-full">📱</span>
                Vertically Optimized
              </span>
              <span className="flex items-center gap-2">
                <span className="p-1.5 bg-gray-100 rounded-full">🎬</span>
                HD Quality
              </span>
              <span className="flex items-center gap-2">
                <span className="p-1.5 bg-gray-100 rounded-full">👁️</span>
                No Watermark
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
