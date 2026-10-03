import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          That link doesn’t resolve.
        </h1>
        <p className="text-base text-muted">
          Either the URL is wrong, or the source took it down.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="text-sm font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Back to resolver
          </Link>
        </div>
      </div>
    </div>
  );
}
