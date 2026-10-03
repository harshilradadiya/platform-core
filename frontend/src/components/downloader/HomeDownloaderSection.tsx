'use client';

import React, { useState } from 'react';
import { UrlForm } from '@/components/downloader/UrlForm';
import { MediaDisplay } from '@/components/downloader/MediaDisplay';
import { resolveMedia, ApiClientError } from '@/lib/api-client';
import { ResolveResponse } from '@/types/api';

export function HomeDownloaderSection() {
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
        setError('An unexpected error occurred while communicating with the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive URL Input Form */}
      <UrlForm onResolve={handleResolve} isLoading={isLoading} error={error} />

      {/* Result Display */}
      {data && <MediaDisplay data={data} />}
    </div>
  );
}
