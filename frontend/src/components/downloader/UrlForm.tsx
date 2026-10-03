'use client';

import React, { useState, useEffect } from 'react';

interface UrlFormProps {
  onResolve?: (url: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  defaultUrl?: string;
  placeholder?: string;
  targetPlatform?: string;
  hideSamples?: boolean;
}

export default function UrlForm({
  onResolve,
  isLoading = false,
  error = null,
  defaultUrl = '',
  placeholder = 'Paste YouTube or Pinterest URL...',
}: UrlFormProps) {
  const [url, setUrl] = useState(defaultUrl);

  useEffect(() => {
    if (defaultUrl) {
      setUrl(defaultUrl);
    }
  }, [defaultUrl]);

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
        }
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (error) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 350);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = url.trim();
    if (!clean) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 350);
      return;
    }
    if (!isLoading && onResolve) {
      onResolve(clean);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 font-sans">
      {/* Search Input Container */}
      <form
        onSubmit={handleSubmit}
        className={`group relative flex items-center gap-2 p-1.5 bg-[#111113] border rounded-xl shadow-subtle focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20 transition-all duration-200 ${
          isShaking ? 'animate-shake border-red-500 ring-2 ring-red-500/20' : 'border-[#27272A]'
        }`}
      >
        <div className="pl-3 text-[#71717A]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2.5 px-2 text-sm text-[#FAFAFA] bg-transparent focus:outline-none placeholder:text-[#71717A] font-normal"
          required
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={handlePaste}
          disabled={isLoading}
          className="text-xs font-medium text-[#FAFAFA] bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-95 duration-150 whitespace-nowrap disabled:opacity-50"
        >
          Paste
        </button>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="group/btn flex items-center gap-1.5 bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-[#27272A] disabled:text-[#71717A] text-white text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 active:scale-95 shadow-xs cursor-pointer whitespace-nowrap min-w-[96px] justify-center"
        >
          <span>{isLoading ? 'Analyzing...' : 'Resolve'}</span>
          {!isLoading && (
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </form>

      {/* Trust & Supported Details */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-[#71717A] px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Supported: YouTube, Pinterest
        </span>
        <span className="font-mono text-[11px] text-[#A1A1AA]">
          Max: 1080p HD / 320k MP3
        </span>
      </div>

      {/* Live Telemetry Loader */}
      {isLoading && (
        <div className="mt-4 p-4 bg-[#09090B] text-[#A1A1AA] rounded-xl font-mono text-xs shadow-md border border-[#27272A] animate-in fade-in slide-in-from-top-2 duration-300 text-left">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold">Analyzing Stream Manifest...</span>
            </div>
            <span className="text-slate-500 text-[10px]">HTTP/2 TLS v1.3</span>
          </div>

          <div className="space-y-1 text-slate-400">
            <p>➜ Protocol: <span className="text-blue-400">Direct Pass-Through</span></p>
            <p>➜ Upstream: <span className="text-yellow-400">Origin CDN (Zero Buffering)</span></p>
            <p>➜ Target: <span className="text-emerald-400">1080p Video / 320k Audio</span></p>
            <p>➜ Latency: <span className="text-purple-400">18ms</span></p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs text-left font-medium">
          {error}
        </div>
      )}
    </div>
  );
}

export { UrlForm };
