import React from 'react';
import { Zap, Shield, Smartphone, Sparkles, Check, CheckCircle } from 'lucide-react';

interface SeoContentBlockProps {
  platformName?: string;
}

export function SeoContentBlock({ platformName = 'Online' }: SeoContentBlockProps) {
  return (
    <article className="w-full max-w-4xl mx-auto my-14 text-zinc-600 dark:text-zinc-300 space-y-10">
      {/* 3-Step Guide */}
      <section className="tool-panel p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-8">
          How to Download {platformName} Media in 3 Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 tool-panel bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80">
            <div className="w-10 h-10 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono-data font-bold text-sm flex items-center justify-center mb-3 border border-zinc-300 dark:border-zinc-700">
              01
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Copy Link</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Find the video or pin you want to save and copy its URL from the address bar or share button.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 tool-panel bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80">
            <div className="w-10 h-10 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono-data font-bold text-sm flex items-center justify-center mb-3 border border-zinc-300 dark:border-zinc-700">
              02
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Paste & Resolve</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Paste the URL into our search bar. Our non-blocking scraper fetches all available resolutions in milliseconds.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 tool-panel bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80">
            <div className="w-10 h-10 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono-data font-bold text-sm flex items-center justify-center mb-3 border border-zinc-300 dark:border-zinc-700">
              03
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Save Instantly</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Select your preferred format (MP4, MP3, or high-res JPG) and enjoy immediate zero-buffering download.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Value Propositions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="tool-panel p-6 bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Zero-Server-Buffering Technology</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Unlike legacy downloaders that save massive files to slow local hard drives before serving them to you, our platform streams directly from source CDNs through streaming memory chunks.
          </p>
        </div>

        <div className="tool-panel p-6 bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Clean & Adware-Free</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Zero malware, no intrusive desktop installers, and no browser extension tracking. We use modern web standards to deliver clean downloads directly to your device storage.
          </p>
        </div>

        <div className="tool-panel p-6 bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Universal Device Compatibility</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Works seamlessly across all modern browsers and operating systems, including iOS (Safari), Android (Chrome), macOS, Windows, and Linux. No apps needed.
          </p>
        </div>

        <div className="tool-panel p-6 bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Pure Lossless Quality</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Get the true original audio and video bitrates available from {platformName}, whether you need pristine 1080p Full HD video or 320kbps high-definition audio.
          </p>
        </div>
      </section>
    </article>
  );
}
