'use client';

import React, { useState } from 'react';
import { UrlForm } from '@/components/downloader/UrlForm';
import { MediaDisplay } from '@/components/downloader/MediaDisplay';
import { PlatformConfig } from '@/lib/constants';
import { resolveMedia, ApiClientError } from '@/lib/api-client';
import { ResolveResponse } from '@/types/api';

interface PlatformDownloaderClientProps {
  platform: PlatformConfig;
}

export function PlatformDownloaderClient({ platform }: PlatformDownloaderClientProps) {
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await resolveMedia(url);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Failed to resolve media from ${platform.name}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatsSummary =
    platform.id === 'youtube'
      ? 'MP4, MP3, Shorts'
      : platform.id === 'pinterest'
      ? 'MP4, JPG'
      : 'MP4, MP3';

  return (
    <div className="w-full flex flex-col items-center">
      {/* 
        ABOVE THE FOLD: Fits comfortably within 720px viewport height without scroll.
      */}
      <section
        aria-label={`${platform.name} Downloader`}
        className="w-full max-w-3xl mx-auto pt-10 sm:pt-14 pb-12 px-4 sm:px-6 space-y-4"
      >
        <h1 className="font-display text-4xl sm:text-[48px] leading-[1.08] font-bold text-ink tracking-tight">
          {platform.name} Video Downloader
        </h1>

        <p className="font-body text-base sm:text-[18px] text-muted max-w-[52ch] leading-relaxed">
          Paste a {platform.name} link. Get {formatsSummary} — no uploads, no signup.
        </p>

        <div className="pt-2">
          <UrlForm
            onResolve={handleResolve}
            isLoading={isLoading}
            error={error}
            targetPlatform={platform.id}
            hideSamples={true}
          />
        </div>

        <p className="font-body text-[13px] text-muted">
          Tip: open the video → Share → Copy link
        </p>
      </section>

      {/* Result Display: Only renders when URL resolves */}
      {data && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mb-12">
          <MediaDisplay data={data} />
        </div>
      )}
    </div>
  );
}
