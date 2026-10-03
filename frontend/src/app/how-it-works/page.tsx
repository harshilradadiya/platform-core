import React from 'react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { howToSchema, breadcrumbSchema } from '@/lib/schema';
import { HowToGuideClient } from '@/components/guides/HowToGuideClient';

export function generateMetadata(): Metadata {
  return {
    title: 'How to Download YouTube MP3 & Shorts Guide — iOS & Android | MediaFlow',
    description:
      'Detailed step-by-step download instructions for iPhone, iPad, Android, Mac, and Windows. Learn how to save videos and MP3 files with zero software installation.',
    alternates: {
      canonical: 'https://mediaflow.app/how-it-works',
    },
    openGraph: {
      title: 'How to Download YouTube MP3 & Shorts Guide — iOS & Android | MediaFlow',
      description:
        'Detailed step-by-step download instructions for iPhone, iPad, Android, Mac, and Windows.',
      url: 'https://mediaflow.app/how-it-works',
      type: 'website',
    },
  };
}

export default function HowItWorksPage() {
  const steps = [
    {
      name: 'Copy link',
      text: 'Copy the YouTube video or Shorts link from your browser address bar or mobile share sheet.',
    },
    {
      name: 'Paste URL & Choose Quality',
      text: 'Paste the link into MediaFlow and pick your desired MP4 video resolution or 320kbps MP3 audio.',
    },
    {
      name: 'Save to device',
      text: 'Directly download the media stream into your iOS Files/Photos app or Android Downloads folder.',
    },
  ];

  const jsonLdData = [
    howToSchema(steps),
    breadcrumbSchema([
      { name: 'Home', url: 'https://mediaflow.app' },
      { name: 'Guides', url: 'https://mediaflow.app/how-it-works' },
    ]),
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <JsonLd schema={jsonLdData} />
      <HowToGuideClient />
    </div>
  );
}
