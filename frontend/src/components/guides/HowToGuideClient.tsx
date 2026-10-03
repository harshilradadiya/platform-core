'use client';

import React, { useState } from 'react';
import { Smartphone, Apple, Chrome, Copy, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HowToGuideClient() {
  const [device, setDevice] = useState<'ios' | 'android'>('ios');
  const [activeTab, setActiveTab] = useState<'video' | 'shorts' | 'mp3'>('mp3');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Subtitle matching Design Board */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          How to Download YouTube {activeTab.toUpperCase()} Guide
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Step-by-step instructions for iPhone, iPad, Android, and Desktop.
        </p>

        {/* Content Category Switcher */}
        <div className="pt-2 flex items-center justify-center gap-2">
          {(['mp3', 'video', 'shorts'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'mp3' ? 'MP3 Audio' : tab === 'video' ? 'MP4 Video' : 'Shorts'}
            </button>
          ))}
        </div>
      </div>

      {/* Device Selector Pills matching Design Board */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          type="button"
          onClick={() => setDevice('ios')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            device === 'ios'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>iOS (iPhone / iPad)</span>
        </button>

        <button
          type="button"
          onClick={() => setDevice('android')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            device === 'android'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Chrome className="w-4 h-4 text-emerald-500" />
          <span>Android (Chrome / Samsung)</span>
        </button>
      </div>

      {/* Step-by-Step Cards with Illustrated Phone Mockup Cards matching Design Board */}
      <div className="w-full max-w-4xl space-y-10">
        {/* Step 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">
              Step 1
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Copy Link on YouTube
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Open the YouTube {activeTab === 'shorts' ? 'Shorts' : 'video'} inside the app or mobile browser. Tap the <strong className="text-gray-800">Share</strong> arrow icon, then choose <strong className="text-gray-800">Copy link</strong> from the system share sheet.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 font-mono text-xs rounded-lg border border-blue-200">
                <Copy className="w-3.5 h-3.5" />
                <span>Link saved to clipboard</span>
              </span>
            </div>
          </div>

          {/* Illustrated Phone Screen 1 */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-64 bg-slate-900 rounded-2xl p-3 border-4 border-slate-700 shadow-lg flex flex-col justify-between text-white">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>9:41</span>
                <span>YouTube App</span>
              </div>
              <div className="p-3 bg-slate-800/90 rounded-xl space-y-2 border border-slate-700 text-center">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mx-auto text-white">
                  ▶
                </div>
                <div className="text-xs font-semibold">Share Video</div>
                <div className="py-1.5 bg-blue-600 text-white rounded font-bold text-[11px] flex items-center justify-center gap-1">
                  <Copy className="w-3 h-3" />
                  Copy Link
                </div>
              </div>
              <div className="text-[10px] text-center text-slate-400">
                {device === 'ios' ? 'iOS Share Sheet' : 'Android Share Menu'}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">
              Step 2
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Paste URL &amp; Choose Quality
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Open <strong className="text-gray-800">{device === 'ios' ? 'Safari' : 'Google Chrome'}</strong> and go to MediaFlow. Paste your link into the resolver input box and select your desired format ({activeTab === 'mp3' ? '320kbps MP3' : '1080p Full HD'}).
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 font-mono text-xs rounded-lg border border-gray-200">
                ⚡ Instant serverless conversion
              </span>
            </div>
          </div>

          {/* Illustrated Phone Screen 2 */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-64 bg-slate-900 rounded-2xl p-3 border-4 border-slate-700 shadow-lg flex flex-col justify-between text-white">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>{device === 'ios' ? 'Safari Browser' : 'Chrome Browser'}</span>
                <span>100%</span>
              </div>
              <div className="p-3 bg-slate-800/90 rounded-xl space-y-2 border border-slate-700 text-center">
                <div className="text-[10px] text-slate-300 truncate">https://www.youtube.com/...</div>
                <div className="py-1 bg-red-600 text-white rounded font-bold text-[11px]">
                  {activeTab === 'mp3' ? 'Convert to MP3' : 'Download MP4'}
                </div>
                <div className="flex justify-center gap-1 text-[9px]">
                  <span className="px-1.5 py-0.5 bg-blue-600 rounded text-white font-bold">320kbps</span>
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">1080p</span>
                </div>
              </div>
              <div className="text-[10px] text-center text-slate-400">Ready to save file</div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">
              Step 3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Save File to Device
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {device === 'ios'
                ? 'Tap the blue Download icon in Safari address bar. Your file will automatically be saved to the Files app / Downloads, or tap Share → Save Video to store directly in Photos.'
                : 'Chrome will display "File downloaded". Tap Open or find it in your My Files app under Downloads / Videos.'}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                <span>Try Downloader Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Illustrated Phone Screen 3 */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-64 bg-slate-900 rounded-2xl p-3 border-4 border-slate-700 shadow-lg flex flex-col justify-between text-white">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>{device === 'ios' ? 'Files App' : 'Downloads App'}</span>
                <span>Saved</span>
              </div>
              <div className="p-3 bg-emerald-950/80 rounded-xl space-y-2 border border-emerald-700 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                <div className="text-xs font-semibold text-emerald-200">Download Complete</div>
                <div className="text-[10px] text-emerald-300">Saved to {device === 'ios' ? 'Photos / Files' : 'Gallery / Downloads'}</div>
              </div>
              <div className="text-[10px] text-center text-slate-400">100% Free &amp; Offline Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
