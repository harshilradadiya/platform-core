'use client';

import React, { useState } from 'react';
import { MediaFormat } from '@/types/api';
import { getProxyStreamUrl } from '@/lib/api-client';

interface FormatCardProps {
  format: MediaFormat;
  mediaTitle: string;
}

export function FormatCard({ format, mediaTitle }: FormatCardProps) {
  const [downloading, setDownloading] = useState(false);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return 'Direct';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const cleanTitle = mediaTitle.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 50);
  const filename = `${cleanTitle || 'media'}.${format.ext}`;

  const downloadUrl = format.requires_server_stream
    ? getProxyStreamUrl(format.direct_url, filename, format.audio_url)
    : format.direct_url;

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noreferrer"
      download={filename}
      onClick={() => {
        setDownloading(true);
        setTimeout(() => setDownloading(false), 2000);
      }}
      className="group w-full py-3 px-4 bg-white border-b border-slate-100 last:border-b-0 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/60"
    >
      {/* Left: Quality Pill + Ext Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold border border-slate-200/60">
          {format.quality_label}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded font-medium shrink-0">
          {format.ext}
        </span>
      </div>

      {/* Right: Size (mono) + Download Action */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="font-mono text-xs text-slate-500">
          {formatFileSize(format.filesize_bytes)}
        </span>

        <span className="inline-flex items-center justify-center px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer">
          {downloading ? (
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
              </svg>
              <span>Saving...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download</span>
            </span>
          )}
        </span>
      </div>
    </a>
  );
}
