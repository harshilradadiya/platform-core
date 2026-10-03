import React from 'react';
import type { Metadata } from 'next';
import { Mp3DownloaderClient } from '@/components/downloader/Mp3DownloaderClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { softwareAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'YouTube MP3 Downloader — Free High-Quality Audio Extraction | MediaFlow',
  description:
    'Extract and download audio from YouTube videos in clean, high-bitrate MP3 format. Fast, free, private — works directly in your mobile and desktop browser.',
  alternates: {
    canonical: 'https://mediaflow.app/youtube-mp3-downloader',
  },
  openGraph: {
    title: 'YouTube MP3 Downloader — Free High-Quality Audio Extraction | MediaFlow',
    description:
      'Extract and download audio from YouTube videos in clean, high-bitrate MP3 format. Fast, free, private — works directly in your mobile and desktop browser.',
    url: 'https://mediaflow.app/youtube-mp3-downloader',
    type: 'website',
  },
};

const MP3_FAQS = [
  {
    question: 'How do I convert a YouTube video to MP3?',
    answer:
      'Copy the link of any YouTube video or podcast, paste it into the search box above, and choose the MP3 Audio option to download the sound track directly.',
  },
  {
    question: 'What bitrate is the extracted MP3 audio?',
    answer:
      'MediaFlow extracts the highest audio stream bitrate provided by the source, up to 160 kbps direct audio, preserving the original acoustic dynamics.',
  },
  {
    question: 'Can I download audio from long podcasts and lectures?',
    answer:
      'Yes. Streams of several hours are supported without server cutoffs because data pipes directly from upstream CDNs to your device.',
  },
  {
    question: 'Is it free to extract audio with MediaFlow?',
    answer:
      'Yes, 100% free with no monthly subscription, account registration, or desktop utility installations required.',
  },
  {
    question: 'Can I listen to downloaded audio files offline?',
    answer:
      'Yes. The downloaded MP3 files are stored locally on your device and can be played in any music player, car stereo, or offline audio app.',
  },
];

export default function YouTubeMp3DownloaderPage() {
  const jsonLdData = [
    softwareAppSchema(),
    faqSchema(MP3_FAQS),
    breadcrumbSchema([
      { name: 'Home', url: 'https://mediaflow.app' },
      { name: 'MP3 Downloader', url: 'https://mediaflow.app/youtube-mp3-downloader' },
    ]),
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <JsonLd schema={jsonLdData} />
      <Mp3DownloaderClient />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <FaqAccordion
          items={MP3_FAQS}
          title="YouTube MP3 Downloader FAQ"
          subtitle="Everything you need to know about bitrate quality and offline playback."
        />
      </div>
    </div>
  );
}
