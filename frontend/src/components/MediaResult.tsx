'use client';

import React from 'react';
import { Download, Film, Music, CheckCircle } from 'lucide-react';

interface ResultProps {
  media: {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
  };
  onDownload?: (quality: string) => void;
}

export default function MediaResult({ media, onDownload }: ResultProps) {
  const downloadOptions = [
    { quality: '1080p Full HD', format: 'MP4', size: '64.2 MB', type: 'video', best: true },
    { quality: '720p HD', format: 'MP4', size: '32.8 MB', type: 'video', best: false },
    { quality: '320kbps Audio', format: 'MP3', size: '8.4 MB', type: 'audio', best: false },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="glass-card p-6 rounded-2xl border border-red-500/20 bg-zinc-900/90 shadow-2xl">
        {/* Media Info Header */}
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start border-b border-zinc-800 pb-6">
          <div className="relative rounded-xl overflow-hidden shrink-0 w-48 h-28 bg-zinc-800 border border-zinc-700">
            {media.thumbnail ? (
              <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                No preview
              </div>
            )}
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-200">
              {media.duration}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Stream Resolved
            </div>
            <h3 className="text-lg font-bold text-zinc-100 line-clamp-2">{media.title}</h3>
            <p className="text-xs text-zinc-400 mt-1">Channel / Creator: {media.author}</p>
          </div>
        </div>

        {/* Quality Download Matrix */}
        <div className="mt-6 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Available Download Qualities
          </span>

          {downloadOptions.map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-red-500">
                  {opt.type === 'video' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100">{opt.quality}</span>
                    {opt.best && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-semibold border border-red-500/30">
                        Highest Quality
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    {opt.format} • ~{opt.size}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDownload && onDownload(opt.quality)}
                className="btn-primary-glow flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { MediaResult };
