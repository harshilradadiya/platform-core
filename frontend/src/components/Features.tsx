'use client';

import React from 'react';
import { Zap, Film, ShieldCheck } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" aria-label="Architecture" className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-16 space-y-6">
      <div className="text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-[#EF4444]">
          High-Speed Architecture
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight mt-1">
          Engineered for Performance
        </h2>
        <p className="text-sm text-[#A1A1AA] mt-1 max-w-lg mx-auto">
          Direct CDN stream extraction protocol without intermediate disk buffering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Large Feature Card (2 Columns) */}
        <div className="group relative md:col-span-2 p-6 bg-[#111113] border border-[#27272A] rounded-2xl shadow-subtle overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3F3F46] flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          <div>
            <div className="w-9 h-9 rounded-xl bg-[#18181B] group-hover:bg-[#EF4444] group-hover:text-white flex items-center justify-center text-[#FAFAFA] transition-colors duration-300 mb-4 font-mono text-sm border border-[#27272A]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#FAFAFA]">Direct Manifest Inspection</h3>
            <p className="text-sm text-[#A1A1AA] mt-1 max-w-lg leading-relaxed">
              Extract stream URLs straight from origin endpoints. Video data pipes directly into browser memory without intermediate disk writes or conversion delays.
            </p>
          </div>

          {/* Terminal Block */}
          <div className="mt-6 p-3.5 bg-[#09090B] text-[#A1A1AA] rounded-xl font-mono text-xs border border-[#27272A] space-y-1">
            <p className="text-emerald-400">➜ HTTP/2.0 200 OK — manifest verified</p>
            <p className="text-[#71717A]">bitrate: 4.8 Mbps • resolution: 1920x1080 • latency: 18ms</p>
            <p className="text-purple-400">buffer_policy: direct_pass_through (0 bytes stored)</p>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="space-y-5">
          {/* Small Card 1: 1080p & 320k Audio */}
          <div className="group relative p-6 bg-[#111113] border border-[#27272A] rounded-2xl shadow-subtle overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3F3F46]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="w-9 h-9 rounded-xl bg-[#18181B] group-hover:bg-[#EF4444] group-hover:text-white flex items-center justify-center text-[#FAFAFA] transition-colors duration-300 mb-4 font-mono text-sm border border-[#27272A]">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#FAFAFA]">1080p &amp; 320k Audio</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              Support for native Full HD 1080p video streams and direct high-bitrate MP3 audio extraction.
            </p>
          </div>

          {/* Small Card 2: Zero Server Logging */}
          <div className="group relative p-6 bg-[#111113] border border-[#27272A] rounded-2xl shadow-subtle overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3F3F46]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="w-9 h-9 rounded-xl bg-[#18181B] group-hover:bg-[#EF4444] group-hover:text-white flex items-center justify-center text-[#FAFAFA] transition-colors duration-300 mb-4 font-mono text-sm border border-[#27272A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#FAFAFA]">Zero Server Logging</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              No user accounts, telemetry, or saved history. Ephemeral URL parsing handled in volatile memory.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Features };
