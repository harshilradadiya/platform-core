'use client';

import React from 'react';
import { Film, Music } from 'lucide-react';

export default function SupportedFormats() {
  return (
    <section id="formats" aria-label="Supported Formats" className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-16 space-y-6">
      <div className="text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-[#EF4444]">
          Container Matrix
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight mt-1">Supported Formats</h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto mt-1">Native container options available for extraction</p>
      </div>

      <div className="bg-[#111113] border border-[#27272A] rounded-2xl shadow-subtle overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#18181B] border-b border-[#27272A] text-[#71717A] uppercase text-[11px] font-semibold tracking-wider font-mono">
            <tr>
              <th scope="col" className="px-6 py-3.5">Format</th>
              <th scope="col" className="px-6 py-3.5">Resolution / Bitrate</th>
              <th scope="col" className="px-6 py-3.5">Container</th>
              <th scope="col" className="px-6 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18181B] font-sans">
            <tr className="hover:bg-[#18181B]/50 transition-colors">
              <td className="px-6 py-4 font-medium text-[#FAFAFA] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#EF4444]" />
                <span>MP4 Video (1080p)</span>
              </td>
              <td className="px-6 py-4 text-[#A1A1AA]">1920x1080 Full HD</td>
              <td className="px-6 py-4 text-[#71717A] font-mono text-xs">MP4 (H.264 / AAC)</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900 font-mono">
                  Active
                </span>
              </td>
            </tr>
            <tr className="hover:bg-[#18181B]/50 transition-colors">
              <td className="px-6 py-4 font-medium text-[#FAFAFA] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#EF4444]" />
                <span>MP4 Video (720p)</span>
              </td>
              <td className="px-6 py-4 text-[#A1A1AA]">1280x720 Standard HD</td>
              <td className="px-6 py-4 text-[#71717A] font-mono text-xs">MP4 (H.264 / AAC)</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900 font-mono">
                  Active
                </span>
              </td>
            </tr>
            <tr className="hover:bg-[#18181B]/50 transition-colors">
              <td className="px-6 py-4 font-medium text-[#FAFAFA] flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                <span>MP3 Audio</span>
              </td>
              <td className="px-6 py-4 text-[#A1A1AA]">320kbps High Fidelity</td>
              <td className="px-6 py-4 text-[#71717A] font-mono text-xs">Direct Audio Track</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900 font-mono">
                  Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export { SupportedFormats };
