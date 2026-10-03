'use client';

import React, { useState } from 'react';
import { UrlForm } from '@/components/downloader/UrlForm';
import { MediaDisplay } from '@/components/downloader/MediaDisplay';
import { resolveMedia, ApiClientError } from '@/lib/api-client';
import { ResolveResponse } from '@/types/api';

export function LandingFormWrapper() {
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  const handleResolve = async (targetUrl: string) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await resolveMedia(cleanUrl);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to resolve media. Please check that the URL is public and valid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Clean Utility Form */}
      <UrlForm
        onResolve={handleResolve}
        isLoading={isLoading}
        error={error}
        placeholder="Paste video or audio URL..."
      />

      {/* Sample link for fast evaluation */}
      {!data && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => handleResolve(sampleUrl)}
            className="text-xs text-gray-500 hover:text-gray-900 underline transition-colors"
          >
            Or test with a sample URL
          </button>
        </div>
      )}

      {/* Result Card: "Your Download is Ready" */}
      {data && (
        <div className="w-full mt-8 animate-in fade-in zoom-in-95 duration-200">
          <MediaDisplay
            data={data}
            onReset={() => {
              setData(null);
              setError(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
