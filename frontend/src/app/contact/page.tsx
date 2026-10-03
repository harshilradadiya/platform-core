import React from 'react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { contactPageSchema } from '@/lib/schema';
import { ContactClient } from './ContactClient';

export function generateMetadata(): Metadata {
  return {
    title: 'Contact Us / DMCA Takedown — MediaFlow',
    description:
      'Reach out for technical support, general assistance, or submit a formal DMCA copyright takedown request.',
    alternates: {
      canonical: 'https://mediaflow.app/contact',
    },
    openGraph: {
      title: 'Contact Us / DMCA Takedown — MediaFlow',
      description:
        'Reach out for technical support, general assistance, or submit a formal DMCA copyright takedown request.',
      url: 'https://mediaflow.app/contact',
      type: 'website',
    },
  };
}

export default function ContactPage() {
  const jsonLdData = contactPageSchema();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <JsonLd schema={jsonLdData} />

      {/* SnapYT Centered Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          Contact Us / DMCA Takedown
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Reach out for support or legal inquiries
        </p>
      </div>

      {/* Form Grid Matching SnapYT Screenshot */}
      <ContactClient />
    </div>
  );
}
