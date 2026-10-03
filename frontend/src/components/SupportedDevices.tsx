'use client';

import React from 'react';
import { Smartphone, Laptop } from 'lucide-react';

export default function SupportedDevices() {
  return (
    <section id="devices" aria-label="Supported Devices" className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-16 space-y-6">
      <div className="text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-[#EF4444]">
          Cross-Platform
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight mt-1">Supported Devices</h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto mt-1">Universal compatibility across all modern web browsers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#111113] border border-[#27272A] rounded-2xl space-y-2 shadow-subtle hover:-translate-y-0.5 transition-all duration-200">
          <Smartphone className="w-5 h-5 text-[#FAFAFA]" />
          <h3 className="font-semibold text-sm text-[#FAFAFA]">iOS (Safari)</h3>
          <p className="text-xs text-[#A1A1AA]">Direct download trigger into the iOS Files app or camera roll.</p>
        </div>
        <div className="p-5 bg-[#111113] border border-[#27272A] rounded-2xl space-y-2 shadow-subtle hover:-translate-y-0.5 transition-all duration-200">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm text-[#FAFAFA]">Android</h3>
          <p className="text-xs text-[#A1A1AA]">Standard stream download directly to local device storage.</p>
        </div>
        <div className="p-5 bg-[#111113] border border-[#27272A] rounded-2xl space-y-2 shadow-subtle hover:-translate-y-0.5 transition-all duration-200">
          <Laptop className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-sm text-[#FAFAFA]">macOS</h3>
          <p className="text-xs text-[#A1A1AA]">Direct browser downloads with native Retina resolution playback.</p>
        </div>
        <div className="p-5 bg-[#111113] border border-[#27272A] rounded-2xl space-y-2 shadow-subtle hover:-translate-y-0.5 transition-all duration-200">
          <Laptop className="w-5 h-5 text-[#A1A1AA]" />
          <h3 className="font-semibold text-sm text-[#FAFAFA]">Windows &amp; Linux</h3>
          <p className="text-xs text-[#A1A1AA]">Standard browser downloads via Chrome, Edge, and Firefox.</p>
        </div>
      </div>
    </section>
  );
}

export { SupportedDevices };
