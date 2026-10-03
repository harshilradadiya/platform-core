'use client';

import React, { useState } from 'react';
import { UrlForm } from '@/components/downloader/UrlForm';
import { MediaDisplay } from '@/components/downloader/MediaDisplay';
import { resolveMedia, ApiClientError } from '@/lib/api-client';
import { ResolveResponse } from '@/types/api';
import { Music, Copy, Smartphone, Sliders, Download, CheckCircle2 } from 'lucide-react';

export function Mp3DownloaderClient() {
  const [data, setData] = useState<ResolveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [selectedBitrate, setSelectedBitrate] = useState('320kbps');

  const bitrates = ['320kbps', '256kbps', '192kbps'];

  const steps = [
    {
      num: '1',
      title: 'Copy',
      desc: 'Copy the YouTube video or music link from your browser or mobile app.',
      icon: Smartphone,
    },
    {
      num: '2',
      title: 'Paste',
      desc: 'Paste the URL into the conversion box above to begin high-speed processing.',
      icon: Copy,
    },
    {
      num: '3',
      title: 'Select Bitrate',
      desc: 'Choose your desired audio quality (320kbps recommended for crystal clarity).',
      icon: Sliders,
    },
    {
      num: '4',
      title: 'Save',
      desc: 'Save the converted MP3 audio track directly to your device storage.',
      icon: Download,
    },
  ];

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
        setError('Failed to resolve MP3 audio.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Above the fold hero */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-sans">
          YouTube MP3 Downloader
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Extract high-quality audio in seconds
        </p>

        {/* MP3 Input Bar matching Design Board */}
        <div className="pt-4 max-w-2xl mx-auto space-y-3">
          <div className="relative flex items-center w-full">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-xs"
            />
            <div className="absolute right-3 text-red-500">
              <Music className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Convert to MP3 Button */}
            <button
              type="button"
              onClick={() => {
                if (inputUrl.trim()) handleResolve(inputUrl);
              }}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isLoading ? 'Converting...' : 'Convert to MP3'}
            </button>

            {/* Bitrate Selector Pills matching Design Board */}
            <div className="flex items-center gap-2">
              {bitrates.map((br) => (
                <button
                  key={br}
                  type="button"
                  onClick={() => setSelectedBitrate(br)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${selectedBitrate === br
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium text-left">{error}</p>
          )}
        </div>
      </section>

      {/* Result Card (when resolved) */}
      {data && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mb-12">
          <MediaDisplay data={data} onReset={() => setData(null)} />
        </div>
      )}

      {/* Step-by-Step Vertical Cards matching Design Board (Column 3) */}
      {!data && (
        <section className="w-full max-w-md mx-auto px-4 sm:px-6 mb-16 space-y-4">
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-start gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{step.num}.</span>
                      <span>{step.title}</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Trigger Button matching Design Board */}
          <button
            type="button"
            onClick={() => {
              if (inputUrl.trim()) {
                handleResolve(inputUrl);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors text-center"
          >
            Convert to MP3
          </button>
        </section>
      )}
    </div>
  );
}
