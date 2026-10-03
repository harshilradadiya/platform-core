'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#09090B] border-b border-[#27272A] px-6">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-base text-[#FAFAFA] tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="w-3 h-3 bg-red-500 rounded-xs"></span>
          <span>FlowFetch</span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#A1A1AA]">
          <Link href="/youtube" className="hover:text-[#FAFAFA] transition-colors">
            YouTube
          </Link>
          <Link href="/pinterest" className="hover:text-[#FAFAFA] transition-colors">
            Pinterest
          </Link>
          <a
            href="http://127.0.0.1:8000/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FAFAFA] transition-colors"
          >
            API Docs
          </a>
          <Link href="/terms" className="hover:text-[#FAFAFA] transition-colors">
            Legal
          </Link>
        </nav>

        {/* Right: Version & GitHub */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#71717A]">
          <span className="bg-[#18181B] text-[#A1A1AA] px-2 py-0.5 rounded text-[11px] font-medium border border-[#27272A]">
            v1.4.0
          </span>
          <a
            href="https://github.com/hnmcollabagency-dev/youtube-downloder"
            target="_blank"
            rel="noreferrer"
            className="font-sans font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

export { Header };
