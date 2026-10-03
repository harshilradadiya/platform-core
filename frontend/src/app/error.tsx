'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    const correlationId = error.digest || `err_${Date.now()}`;
    // Log structured failure with correlation ID placeholder
    console.error(`[MediaFlow Error][correlation_id=${correlationId}]`, error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          Something broke on our end.
        </h1>

        {error.digest && (
          <p className="font-mono text-xs text-muted">
            digest: <span className="text-ink">{error.digest}</span>
          </p>
        )}

        <div className="pt-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2 bg-signal text-white text-sm font-semibold rounded-input hover:opacity-95 transition-opacity"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
