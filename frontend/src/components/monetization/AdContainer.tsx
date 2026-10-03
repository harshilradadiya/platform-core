'use client';

import React from 'react';

export type AdSizeType = 'leaderboard' | 'rectangle' | 'mobile-banner';

interface AdContainerProps {
  size?: AdSizeType;
  slot?: AdSizeType; // Backwards compatibility alias
  className?: string;
  adSlotId?: string;
}

const DIMENSIONS: Record<AdSizeType, { width: number; height: number; aspect: string; label: string }> = {
  leaderboard: { width: 728, height: 90, aspect: '728 / 90', label: '728 × 90' },
  rectangle: { width: 300, height: 250, aspect: '300 / 250', label: '300 × 250' },
  'mobile-banner': { width: 320, height: 50, aspect: '320 / 50', label: '320 × 50' },
};

export function AdContainer({
  size,
  slot = 'leaderboard',
  className = '',
  adSlotId,
}: AdContainerProps) {
  const activeSize = size || slot;
  const config = DIMENSIONS[activeSize];
  const isDev = process.env.NODE_ENV !== 'production' || !adSlotId;

  return (
    <div
      className={`w-full flex items-center justify-center my-8 ${className}`}
      style={{
        aspectRatio: config.aspect,
        maxWidth: `${config.width}px`,
        maxHeight: `${config.height}px`,
        minHeight: `${config.height}px`,
      }}
    >
      {isDev ? (
        <div className="w-full h-full border border-dashed border-line rounded-input bg-paper/60 flex flex-col items-center justify-center text-center p-2 font-mono text-[11px] text-muted">
          <span>Ad · {config.label}</span>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: config.width, height: config.height }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={adSlotId}
        />
      )}
    </div>
  );
}
