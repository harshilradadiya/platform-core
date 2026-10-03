import React from 'react';

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-pulse motion-reduce:animate-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* Left Col: Hero Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          {/* Headline placeholder */}
          <div className="h-12 sm:h-14 bg-line rounded-input w-4/5 max-w-xl" />
          <div className="h-12 sm:h-14 bg-line rounded-input w-3/5 max-w-md" />

          {/* Subtitle placeholder */}
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-line rounded-input w-full max-w-[50ch]" />
            <div className="h-4 bg-line rounded-input w-4/5 max-w-[42ch]" />
          </div>

          {/* Form input tray placeholder */}
          <div className="pt-4">
            <div className="h-14 bg-line/80 rounded-card w-full max-w-2xl border border-line" />
            <div className="h-3 bg-line/60 rounded-input w-64 mt-2.5" />
          </div>
        </div>

        {/* Right Col: Code preview placeholder */}
        <div className="lg:col-span-5">
          <div className="rounded-card border border-line bg-paper/60 p-5 space-y-3 h-72">
            <div className="flex justify-between border-b border-line pb-2">
              <div className="h-3 bg-line rounded-input w-24" />
              <div className="h-3 bg-line rounded-input w-16" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-line rounded-input w-32" />
              <div className="h-3 bg-line rounded-input w-48" />
              <div className="h-3 bg-line rounded-input w-40" />
              <div className="h-3 bg-line rounded-input w-56" />
              <div className="h-3 bg-line rounded-input w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Resolves today bar */}
      <div className="mt-14 pt-4 border-t border-line">
        <div className="h-3 bg-line/70 rounded-input w-36" />
      </div>
    </div>
  );
}
