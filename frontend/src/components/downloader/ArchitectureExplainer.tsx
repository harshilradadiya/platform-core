'use client';

import React, { useState } from 'react';
import { Cpu, HardDrive, Zap, Shield, ArrowRight, Check, X, Server, Globe } from 'lucide-react';

export function ArchitectureExplainer() {
  const [activeTab, setActiveTab] = useState<'modern' | 'legacy'>('modern');

  return (
    <div className="w-full max-w-4xl mx-auto my-12 tool-panel p-5 md:p-7">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Zero-Server-Buffering Architecture
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            How MediaFlow streams unthrottled media without saving files to server storage.
          </p>
        </div>

        {/* Mode Comparison Switcher */}
        <div className="flex items-center p-0.5 tool-control bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('modern')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 tool-control transition ${
              activeTab === 'modern'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            MediaFlow Pipeline
          </button>
          <button
            onClick={() => setActiveTab('legacy')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 tool-control transition ${
              activeTab === 'legacy'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            Legacy Proxy Architecture
          </button>
        </div>
      </div>

      {/* Visual Pipeline Diagram */}
      {activeTab === 'modern' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Component 1 */}
            <div className="p-4 tool-panel bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-left">
              <div className="w-9 h-9 tool-control bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-2.5 border border-zinc-300 dark:border-zinc-800">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 text-xs md:text-sm">Metadata Parsing</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Extracts stream URLs in zero-download mode without pulling raw video data.
              </p>
            </div>

            {/* Component 2 */}
            <div className="p-4 tool-panel bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-left">
              <div className="w-9 h-9 tool-control bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-2.5 border border-zinc-300 dark:border-zinc-800">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 text-xs md:text-sm">In-Memory Cache Layer</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Deterministic SHA-256 keying returns format specifications in under 5ms.
              </p>
            </div>

            {/* Component 3 */}
            <div className="p-4 tool-panel bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-left">
              <div className="w-9 h-9 tool-control bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-2.5 border border-zinc-300 dark:border-zinc-800">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 text-xs md:text-sm">Range Burst Pipe</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Streams segmented slices directly to client memory. Server disk usage: 0 MB.
              </p>
            </div>
          </div>

          <div className="p-3 tool-panel bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 flex-wrap text-xs text-zinc-700 dark:text-zinc-300 font-mono-data">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
              <span>Server Disk Footprint: 0 MB</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
              <span>Client Connection: Direct HTTP/2 Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
              <span>Memory Bounds: Bounded 256KB Chunks</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Legacy 1 */}
            <div className="p-4 tool-panel bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 text-left">
              <div className="w-9 h-9 tool-control bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-2.5 border border-zinc-300 dark:border-zinc-800">
                <HardDrive className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm">Disk Ingestion Bottleneck</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Downloads full 500MB payload onto local disk before presenting download link.
              </p>
            </div>

            {/* Legacy 2 */}
            <div className="p-4 tool-panel bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 text-left">
              <div className="w-9 h-9 tool-control bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-2.5 border border-zinc-300 dark:border-zinc-800">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm">Server CPU Transcoding</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                CPU-heavy video re-encoding on shared disks causes gateway timeouts during traffic spikes.
              </p>
            </div>

            {/* Legacy 3 */}
            <div className="p-4 tool-panel bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 text-left">
              <div className="w-9 h-9 tool-control bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-2.5 border border-zinc-300 dark:border-zinc-800">
                <X className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm">Double Egress Costs</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Pays server bandwidth twice: once to download from source CDN, once to send to user.
              </p>
            </div>
          </div>

          <div className="p-3 tool-panel bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 flex-wrap text-xs text-zinc-500 dark:text-zinc-400 font-mono-data">
            <div className="flex items-center gap-2">
              <X className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>Disk Waiting Time: 60s - 180s</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>Bandwidth Waste: 2x Network Egress</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
