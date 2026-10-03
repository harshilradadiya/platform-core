'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is FlowFetch completely free to use?',
      a: 'Yes, FlowFetch is 100% free with no registration or limits. Direct stream pass-through requires no subscription.',
    },
    {
      q: 'Which platforms and formats are supported?',
      a: 'We support YouTube (Videos, Shorts) and Pinterest pins. Downloads are available in 1080p Full HD MP4 video or 320kbps MP3 audio.',
    },
    {
      q: 'Are downloads saved securely?',
      a: 'Yes. Content is extracted via direct CDN links directly to your browser download manager without storing files on intermediate servers.',
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-[#EF4444]">
          Common Inquiries
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA] mt-1">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto mt-1">
          Everything you need to know about our direct stream resolution architecture.
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-zinc-100 hover:text-red-400 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base text-zinc-100">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-red-500' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { FAQ };
