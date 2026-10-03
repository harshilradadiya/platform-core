'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DownloaderStateMachine } from '@/components/downloader/DownloaderStateMachine';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Zap, ShieldCheck, HardDrive, Command } from 'lucide-react';

export function HeroChoreography() {
  // Cursor spotlight state
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        // Capped displacement
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Global Command Palette Shortcut Ctrl+K / Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const headlineWords = ['Download', 'YouTube', '&', 'Pinterest', 'Media'];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Interactive Hero Ambient Spotlight (Disabled on mobile) */}
      {!isMobile && mousePos.x > 0 && (
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.04), transparent 80%)`,
          }}
        />
      )}

      {/* Hero Section Container */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#18181B] border border-[#27272A] rounded-full text-xs font-mono text-[#A1A1AA] mb-4 shadow-subtle"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"></span>
          <span>FlowFetch Core Engine v1.4</span>
          <span className="text-[#3F3F46]">|</span>
          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-1 text-[#FAFAFA] hover:text-[#EF4444] cursor-pointer"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>
        </motion.div>

        {/* Headline Word-by-Word Reveal with Blur Resolution */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FAFAFA] font-sans max-w-3xl mx-auto flex flex-wrap justify-center gap-x-3 gap-y-1.5">
          {headlineWords.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.25,
                delay: idx * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={word === '&' ? 'text-[#EF4444]' : ''}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle with Scale & Opacity reveal */}
        <motion.p
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3.5 text-base sm:text-lg text-[#A1A1AA] font-sans max-w-xl mx-auto"
        >
          Direct CDN stream resolution with zero server buffering.
        </motion.p>

        {/* Downloader State Machine Component */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <DownloaderStateMachine initialUrl={activeUrl} />
        </motion.div>

        {/* Trust Badges Stagger Reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="mt-6 pt-5 border-t border-[var(--border-default)] flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs font-mono text-[var(--text-secondary)]"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[var(--text-secondary)] font-medium">~18ms Manifest Ping</span>
          </span>
          <span className="text-[var(--border-default)] hidden sm:inline">|</span>
          <span className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="text-[var(--text-secondary)] font-medium">1080p MP4 / 320k MP3</span>
          </span>
          <span className="text-[var(--border-default)] hidden sm:inline">|</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[var(--text-secondary)] font-medium">100% Direct Pass-Through</span>
          </span>
        </motion.div>
      </section>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectSample={(sample) => {
          setActiveUrl(sample);
          setIsPaletteOpen(false);
        }}
      />
    </div>
  );
}
