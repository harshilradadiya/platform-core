'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Youtube, Pin, FileText, Shield, Copy, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample?: (url: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectSample }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const commands = [
    {
      id: 'sample',
      title: 'Paste Test Sample URL',
      subtitle: 'Load Rick Astley 1080p sample link',
      icon: Copy,
      action: () => {
        if (onSelectSample) onSelectSample('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        onClose();
      },
    },
    {
      id: 'youtube',
      title: 'YouTube Downloader',
      subtitle: 'High-speed 1080p MP4 and 320k MP3 resolution',
      icon: Youtube,
      action: () => {
        router.push('/youtube');
        onClose();
      },
    },
    {
      id: 'pinterest',
      title: 'Pinterest Downloader',
      subtitle: 'Original resolution video and gif extraction',
      icon: Pin,
      action: () => {
        router.push('/pinterest');
        onClose();
      },
    },
    {
      id: 'api',
      title: 'API Documentation',
      subtitle: 'FastAPI OpenAPI specs and endpoints',
      icon: FileText,
      action: () => {
        window.open('http://127.0.0.1:8000/api/v1/docs', '_blank');
        onClose();
      },
    },
    {
      id: 'terms',
      title: 'Fair Use & Legal Terms',
      subtitle: 'Terms of service and DMCA policy',
      icon: Shield,
      action: () => {
        router.push('/terms');
        onClose();
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272A]">
              <Search className="w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands or destinations... (Esc to close)"
                className="w-full bg-transparent text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="text-[#71717A] hover:text-[#FAFAFA] p-1 text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Commands List */}
            <div className="p-2 max-h-80 overflow-y-auto divide-y divide-[#18181B]">
              {filtered.length > 0 ? (
                filtered.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={cmd.action}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#18181B] text-left transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#18181B] group-hover:bg-[#27272A] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] group-hover:text-[#FAFAFA] transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#FAFAFA]">{cmd.title}</p>
                        <p className="text-[11px] text-[#71717A] truncate">{cmd.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#71717A] border border-[#27272A] px-1.5 py-0.5 rounded">
                        ↵
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-[#71717A]">
                  No matching commands found.
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-[#09090B] border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#71717A] font-mono">
              <span>Navigation: Tab / Click</span>
              <span>FlowFetch Command Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
