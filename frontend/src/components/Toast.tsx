'use client';

import React from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="glass-card px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-2xl flex items-center gap-3">
        {type === 'success' ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-red-400 shrink-0" />
        )}
        <span className="text-xs font-medium text-zinc-100">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export { Toast };
