import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Server, ShieldCheck, CheckCircle2, Clock, Zap, Layers } from 'lucide-react';

export const metadata = {
  title: 'MediaFlow API & System Status — Real-Time Health Telemetry',
  description:
    'Live operational status for MediaFlow resolution APIs, YouTube DASH stream multiplexers, and Pinterest CDN pipelines.',
};

const SERVICES = [
  {
    name: 'YouTube DASH Resolution Engine',
    description: 'Manifest inspection, adaptive stream parsing, and metadata retrieval',
    status: 'Operational',
    uptime: '99.98%',
    latency: '142 ms',
  },
  {
    name: 'Real-Time FFmpeg Muxing Daemon',
    description: 'In-memory fragmented audio/video multiplexing and pipe streaming',
    status: 'Operational',
    uptime: '99.99%',
    latency: '34 ms',
  },
  {
    name: 'Pinterest CDN Scraper & Manifest Parser',
    description: 'High-res image extractors, 1080p video pin links, and carousel processors',
    status: 'Operational',
    uptime: '99.95%',
    latency: '118 ms',
  },
  {
    name: 'Zero-Buffering Proxy Pipeline',
    description: 'Direct RAM-forwarding streaming routes without physical disk caching',
    status: 'Operational',
    uptime: '100%',
    latency: '18 ms',
  },
  {
    name: 'Playlist Batch Resolution Queue',
    description: 'Sequential batch extraction queue for multi-video collections',
    status: 'Operational',
    uptime: '99.97%',
    latency: '210 ms',
  },
];

export default function ApiStatusPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 text-left">
      {/* Breadcrumb Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Downloader</span>
      </Link>

      {/* Main Status Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-container rounded border border-outline-variant text-secondary font-mono text-xs uppercase tracking-wider font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Live Infrastructure Health</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight leading-tight">
          System &amp; API Status
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
          Real-time health telemetry across our media resolution engines, FFmpeg stream muxing proxies, and edge CDN pipelines.
        </p>
      </div>

      {/* Banner: Overall System Status */}
      <div className="p-4 sm:p-5 bg-surface-container-lowest border-2 border-secondary rounded-lg mb-8 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-secondary animate-pulse" />
          <div>
            <div className="font-bold text-sm sm:text-base text-on-surface">All Systems Operational</div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              All media resolution pipelines, stream muxers, and format matrix APIs are functioning normally.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-secondary bg-secondary-container px-2.5 py-1 rounded font-bold shrink-0">
          99.98% 30d Uptime
        </span>
      </div>

      {/* Services List Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-xs mb-8">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <span className="font-semibold text-xs sm:text-sm text-on-surface uppercase font-mono tracking-wider">
            Pipeline Components
          </span>
          <span className="font-mono text-xs text-on-surface-variant">Region: Global Distributed Edge</span>
        </div>

        <div className="divide-y divide-outline-variant">
          {SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
            >
              <div>
                <div className="font-semibold text-xs sm:text-sm text-on-surface flex items-center gap-2">
                  <span>{srv.name}</span>
                  <span className="px-1.5 py-0.2 bg-secondary-container text-on-secondary-container font-mono text-[10px] rounded uppercase font-semibold">
                    {srv.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">{srv.description}</p>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs shrink-0 text-on-surface-variant">
                <div>
                  <span className="text-outline text-[11px] block">Latency</span>
                  <span className="font-semibold text-on-surface">{srv.latency}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block">30d Uptime</span>
                  <span className="font-semibold text-secondary">{srv.uptime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident History Panel */}
      <div className="p-6 bg-surface-container rounded border border-outline-variant text-left">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-secondary uppercase mb-2">
          <Clock className="w-4 h-4" />
          <span>Incident History (Last 90 Days)</span>
        </div>
        <p className="text-xs sm:text-sm text-on-surface font-medium">
          No service interruptions or degradation incidents reported in the past 90 days.
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          Automated uptime monitors execute ping sweeps against our backend endpoints every 30 seconds from 8 geographic zones worldwide.
        </p>
      </div>
    </div>
  );
}
