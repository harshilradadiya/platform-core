'use client';

import React, { useEffect } from 'react';
import { Search, Clipboard, Music, Youtube, Image as PinterestIcon, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPasteAction?: () => void;
  onSelectMode?: (mode: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onPasteAction = () => {},
  onSelectMode = () => {},
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden bg-zinc-900/95">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Actions</span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 space-y-1">
          <button
            type="button"
            onClick={() => {
              onPasteAction();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/80 text-left transition-colors text-zinc-200 text-sm font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Clipboard className="w-4 h-4 text-red-500" />
              <span>Paste URL from Clipboard</span>
            </div>
            <kbd className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-400">⌘V</kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectMode('youtube');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/80 text-left transition-colors text-zinc-200 text-sm font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Switch to YouTube / Shorts Mode</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectMode('pinterest');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/80 text-left transition-colors text-zinc-200 text-sm font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <PinterestIcon className="w-4 h-4 text-red-400" />
              <span>Switch to Pinterest Pins Mode</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectMode('mp3');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/80 text-left transition-colors text-zinc-200 text-sm font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Music className="w-4 h-4 text-emerald-400" />
              <span>Switch to High-Fi MP3 Extractor</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export { CommandPalette };
