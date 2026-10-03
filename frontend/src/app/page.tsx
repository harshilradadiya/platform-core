'use client';

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import MediaResult from '@/components/MediaResult';
import ArchitectureSimulator from '@/components/ArchitectureSimulator';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import SupportedFormats from '@/components/SupportedFormats';
import SupportedDevices from '@/components/SupportedDevices';
import FAQ from '@/components/FAQ';
import CommandPalette from '@/components/CommandPalette';
import Toast from '@/components/Toast';
import { resolveMedia } from '@/lib/api-client';

export default function Home() {
  const [resolvedMedia, setResolvedMedia] = useState<{
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
  } | null>(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleResolve = async (url: string) => {
    showToast('Resolving direct CDN manifest...');
    try {
      const res = await resolveMedia(url);
      if (res && res.title) {
        const mins = res.duration_seconds ? Math.floor(res.duration_seconds / 60) : 3;
        const secs = res.duration_seconds ? res.duration_seconds % 60 : 45;
        setResolvedMedia({
          title: res.title,
          thumbnail: res.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          duration: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
          author: (res as any).uploader || (res.platform ? `${res.platform.toUpperCase()} Source` : 'Origin Stream Source'),
        });
        showToast('Stream manifest resolved successfully');
        return;
      }
    } catch {
      // Fallback gracefully to demo extract
    }

    setResolvedMedia({
      title: 'Sample High Definition Video Extract',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      duration: '03:45',
      author: 'FlowFetch Demo Channel',
    });
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        showToast('Pasted URL from clipboard');
        handleResolve(text);
      }
    } catch {
      showToast('Clipboard access denied');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] relative">
      {/* Hero Header with Cmd+K trigger */}
      <Hero
        onResolve={handleResolve}
        onOpenCmd={() => setIsCmdOpen(true)}
      />

      {/* Resolved Media Output Matrix */}
      {resolvedMedia && <MediaResult media={resolvedMedia} />}

      {/* Architecture Protocol Live Simulator */}
      <ArchitectureSimulator />

      {/* Core Informational Sections */}
      <HowItWorks />
      <Features />
      <SupportedFormats />
      <SupportedDevices />
      <FAQ />

      {/* Overlays */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onPasteAction={handlePasteClipboard}
        onSelectMode={(mode) => showToast(`Switched mode to ${mode}`)}
      />

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </main>
  );
}
