'use client';

import React, { useState } from 'react';
import { Search, Clipboard, X, Youtube, Image as PinterestIcon, Music, Sparkles, Activity } from 'lucide-react';

interface HeroProps {
  onResolve: (url: string) => void;
  onOpenCmd?: () => void;
}

export default function Hero({ onResolve, onOpenCmd }: HeroProps) {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'pinterest' | 'mp3'>('all');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {}
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onResolve(url);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto pt-20 pb-12 px-4 text-center">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Page H1 */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-red-500" />
        <span>v1.4 Direct CDN Pass-Through Active</span>
        {onOpenCmd && (
          <>
            <span className="text-zinc-600">|</span>
            <button
              type="button"
              onClick={onOpenCmd}
              className="flex items-center gap-1 text-zinc-300 hover:text-red-400 transition-colors cursor-pointer"
              title="Open Command Palette"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-700/60 border border-zinc-600/60 font-mono text-[10px]">⌘K</kbd>
            </button>
          </>
        )}
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight text-center">
        Download{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
          YouTube &amp; Pinterest
        </span>{' '}
        Media
      </h1>
      <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
        Direct CDN stream resolution with zero server buffering.
      </p>

      {/* Converter Tool Section (Added H2 Header) */}
      <div className="mt-12 mb-4">
        <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
          Select Output Format &amp; Resolve Stream
        </span>
        <h2 className="text-xl font-bold text-zinc-100 mt-1 mb-6">Media Link Converter</h2>

        {/* Format Selector Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:text-zinc-200'
            }`}
          >
            All Formats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:text-zinc-200'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            YouTube Video / Shorts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pinterest')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'pinterest'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:text-zinc-200'
            }`}
          >
            <PinterestIcon className="w-3.5 h-3.5 text-red-400" />
            Pinterest Pins
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mp3')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'mp3'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:text-zinc-200'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            MP3 Audio Extractor
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleResolve} className="relative w-full max-w-2xl mx-auto">
          <div className="glass-card p-2 rounded-2xl flex items-center gap-2 border border-zinc-800 shadow-2xl focus-within:border-red-500/50 transition-all">
            <Search className="w-5 h-5 text-zinc-500 ml-3 shrink-0" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube video, Shorts, or Pinterest URL... (or press ⌘K)"
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none py-2"
              required
            />
            {url ? (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-400 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg border border-zinc-700/60 transition-colors shrink-0 cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}
            <button
              type="submit"
              className="btn-primary-glow px-6 py-2.5 rounded-xl text-sm font-bold shrink-0 cursor-pointer"
            >
              Resolve
            </button>
          </div>
        </form>
      </div>

      {/* Performance Benchmarks Strip Header */}
      <div className="mt-16 pt-8 border-t border-zinc-800/60">
        <span className="text-[11px] font-mono tracking-wider text-red-400 uppercase font-semibold">
          LIVE ENGINE BENCHMARKS
        </span>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-zinc-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> ~18ms Manifest Ping
          </span>
          <span>•</span>
          <span>1080p MP4 / 320k MP3</span>
          <span>•</span>
          <span>100% Direct Pass-Through</span>
        </div>
      </div>
    </section>
  );
}

export { Hero };
