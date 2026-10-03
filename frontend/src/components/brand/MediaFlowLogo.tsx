import React from 'react';

interface MediaFlowLogoProps {
  className?: string;
  size?: number;
}

export function MediaFlowLogo({ className = 'w-8 h-8', size }: MediaFlowLogoProps) {
  const pixelSize = size || 32;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ maxWidth: pixelSize, maxHeight: pixelSize, ...((size ? { width: size, height: size } : {})) }}
      aria-label="MediaFlow Logo"
    >
      <path d="M8 14h18a8 8 0 0 1 8 8v0a8 8 0 0 1-8 8H14" />
      <path d="m14 26-6 4 6 4" />
      <path d="M40 34H22a8 8 0 0 1-8-8v0a8 8 0 0 1 8-8h12" />
      <path d="m34 14 6 4-6 4" />
    </svg>
  );
}
