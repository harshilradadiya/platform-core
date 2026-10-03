import React from 'react';
import type { Metadata } from 'next';
import { ShortsDownloaderClient } from '@/components/downloader/ShortsDownloaderClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { softwareAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'YouTube Shorts Downloader — Free 1080p No Watermark | MediaFlow',
  description:
    'Download YouTube Shorts vertical 9:16 videos in original 1080p Full HD without watermarks. Free, fast, private — runs in your mobile & desktop browser.',
  alternates: {
    canonical: 'https://mediaflow.app/youtube-shorts-downloader',
  },
  openGraph: {
    title: 'YouTube Shorts Downloader — Free 1080p No Watermark | MediaFlow',
    description:
      'Download YouTube Shorts vertical 9:16 videos in original 1080p Full HD without watermarks. Free, fast, private — runs in your mobile & desktop browser.',
    url: 'https://mediaflow.app/youtube-shorts-downloader',
    type: 'website',
  },
};

const SHORTS_FAQS = [
  {
    question: 'How do I download a YouTube Shorts video?',
    answer:
      'Open the Short on YouTube, tap Share → Copy link. Paste the URL into the input box above and select your preferred MP4 resolution to save it directly.',
  },
  {
    question: 'Are there watermarks on downloaded Shorts?',
    answer:
      'No. MediaFlow extracts the native, uncompressed source stream directly from the content distribution network without adding watermarks, banners, or logos.',
  },
  {
    question: 'What resolution are YouTube Shorts downloaded in?',
    answer:
      'Shorts are typically encoded in 1080×1920 (Full HD vertical 9:16) or 720×1280. MediaFlow mirrors the highest quality exposed by YouTube.',
  },
  {
    question: 'Can I extract audio or music from a Short?',
    answer:
      'Yes. You can choose the MP3 / M4A audio extraction option to save background music or voiceovers from any public Short.',
  },
  {
    question: 'Does this work on iPhone and Android phones?',
    answer:
      'Yes. Simply use Safari on iOS or Chrome on Android. Downloaded videos save directly into your Photos or Downloads folder.',
  },
];

export default function YouTubeShortsDownloaderPage() {
  const jsonLdData = [
    softwareAppSchema(),
    faqSchema(SHORTS_FAQS),
    breadcrumbSchema([
      { name: 'Home', url: 'https://mediaflow.app' },
      { name: 'Shorts Downloader', url: 'https://mediaflow.app/youtube-shorts-downloader' },
    ]),
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <JsonLd schema={jsonLdData} />
      <ShortsDownloaderClient />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <FaqAccordion
          items={SHORTS_FAQS}
          title="Shorts Downloader FAQ"
          subtitle="Common questions regarding vertical video extraction and watermark policies."
        />
      </div>
    </div>
  );
}
