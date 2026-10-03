'use client';

import React, { useEffect } from 'react';

export interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans max-w-sm">
      {type === 'success' && (
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
      )}
      {type === 'error' && (
        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
      )}
      {type === 'info' && (
        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
      )}
      <p className="text-xs font-medium text-[#FAFAFA]">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto text-[#71717A] hover:text-[#FAFAFA] text-xs font-mono cursor-pointer transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

export { Toast };
