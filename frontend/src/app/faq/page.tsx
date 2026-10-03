'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Info, Wrench, MessageSquare, Smartphone } from 'lucide-react';

interface FaqCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: { q: string; a: string }[];
}

const CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    title: 'General Questions',
    icon: <Info className="w-4 h-4 text-[#DC2626]" />,
    items: [
      {
        q: 'Is MediaFlow free?',
        a: 'Yes, 100% free with no hidden fees, paid tiers, or account registration required.',
      },
      {
        q: 'How safe is MediaFlow?',
        a: 'Completely safe. MediaFlow is a stateless resolver that never installs desktop software or stores files on local disks.',
      },
      {
        q: 'Is there a limit on downloads?',
        a: 'There are no daily video caps for human users. A fair-use rate limit of 30 req/min prevents server exhaustion.',
      },
      {
        q: 'Do I need an account or sign-up?',
        a: 'No registration, login, or email is ever requested. You can download anonymously.',
      },
    ],
  },
  {
    id: 'troubleshoot',
    title: 'Troubleshooting',
    icon: <Wrench className="w-4 h-4 text-[#DC2626]" />,
    items: [
      {
        q: 'Why does my download fail?',
        a: 'Common causes include age-gated videos, region-locked media, private content, or broken URL parameters.',
      },
      {
        q: 'What can I download with YouTube?',
        a: 'You can download public YouTube videos, vertical Shorts, and extract MP3 audio streams in high quality.',
      },
      {
        q: 'Why does video play instead of saving?',
        a: 'Right-click the video and click "Save video as..." on desktop, or choose "Save to Files" when prompted on iOS.',
      },
      {
        q: 'Why is 1080p or 4K quality missing?',
        a: 'Higher resolutions appear only if the original creator uploaded them and the source CDN exposes those tracks.',
      },
    ],
  },
  {
    id: 'content',
    title: 'Supported Content',
    icon: <MessageSquare className="w-4 h-4 text-[#DC2626]" />,
    items: [
      {
        q: 'Can I download private videos?',
        a: 'No. MediaFlow strictly respects creator privacy and does not bypass passwords, DRM, or access controls.',
      },
      {
        q: 'Can I download whole playlists?',
        a: 'To maintain server stability, open playlists on YouTube and copy individual video links to save one by one.',
      },
      {
        q: 'Are downloaded videos watermarked?',
        a: 'No. Files are delivered directly from source servers without modification, banners, or watermarks.',
      },
      {
        q: 'Can I download YouTube Shorts?',
        a: 'Yes. Vertical Shorts links resolve directly to clean 1080p MP4 format without compression artifacts.',
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Help',
    icon: <Smartphone className="w-4 h-4 text-[#DC2626]" />,
    items: [
      {
        q: 'How to download on iOS (iPhone)?',
        a: 'Open Safari, paste the link, choose format, and tap Download. The file saves directly to your Files app → Downloads.',
      },
      {
        q: 'How to download on Android?',
        a: 'Paste the link in Google Chrome or Firefox. Completed videos appear in your notification bar and Downloads folder.',
      },
      {
        q: 'Where do files save on iPhone?',
        a: 'Open the pre-installed Apple "Files" app and check the "Downloads" directory or tap the Safari download manager icon.',
      },
      {
        q: 'Can I save audio to Apple Music?',
        a: 'Downloaded MP3 tracks can be stored in the Files app and played directly with offline music player apps.',
      },
    ],
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const matchesSearch = (text: string) => {
    if (!search.trim()) return true;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-14">
      {/* Title & Subtitle Matching SnapYT Image 5 */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-sans">
          Frequently Asked Questions &amp; Troubleshooting
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Find answers to common downloading issues
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-red-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 4 Categorized Accordion Columns Matching SnapYT Image 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {CATEGORIES.map((cat) => {
          const visibleItems = cat.items.filter(
            (item) => matchesSearch(item.q) || matchesSearch(item.a)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Column Header */}
              <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center gap-2">
                {cat.icon}
                <h2 className="text-sm font-bold text-gray-900 font-sans">
                  {cat.title}
                </h2>
              </div>

              {/* Accordion Questions List */}
              <div className="divide-y divide-gray-100">
                {visibleItems.map((item, idx) => {
                  const key = `${cat.id}-${idx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div key={idx} className="transition-colors">
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-gray-50/60 transition-colors"
                      >
                        <span className="text-xs sm:text-[13px] font-medium text-gray-800 leading-snug">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-gray-700' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-gray-600 leading-relaxed bg-gray-50/40 border-t border-gray-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step-by-Step Guides Section Matching SnapYT Image 5 */}
      <div className="pt-8 border-t border-gray-200 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center font-sans">
          Step-by-Step Guides
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Guide 1: Video */}
          <Link
            href="/how-it-works"
            className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-center flex flex-col items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-red-100/70 text-[#DC2626] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              🎬
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
                Guide 1
              </span>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#DC2626] transition-colors">
                How to download Video
              </h3>
            </div>
          </Link>

          {/* Guide 2: Shorts */}
          <Link
            href="/youtube-shorts-downloader"
            className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-center flex flex-col items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-red-100/70 text-[#DC2626] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
                Guide 2
              </span>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#DC2626] transition-colors">
                How to download Shorts
              </h3>
            </div>
          </Link>

          {/* Guide 3: MP3 */}
          <Link
            href="/youtube-mp3-downloader"
            className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-center flex flex-col items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 text-gray-800 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              🎵
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
                Guide 3
              </span>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#DC2626] transition-colors">
                How to save MP3
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
