import React from 'react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { aboutPageSchema, organizationSchema } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return {
    title: 'About MediaFlow — Who runs MediaFlow',
    description:
      'The engineering principles, architecture philosophy, and maintainers behind MediaFlow: zero server buffering and direct CDN stream pass-through.',
    alternates: {
      canonical: 'https://mediaflow.app/about',
    },
    openGraph: {
      title: 'About MediaFlow — Who runs MediaFlow',
      description:
        'The engineering principles, architecture philosophy, and maintainers behind MediaFlow: zero server buffering and direct CDN stream pass-through.',
      url: 'https://mediaflow.app/about',
      type: 'website',
    },
  };
}

export default function AboutPage() {
  const jsonLdData = [aboutPageSchema(), organizationSchema()];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <JsonLd schema={jsonLdData} />

      <article className="space-y-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Who runs MediaFlow
        </h1>

        <div className="space-y-6 text-base sm:text-lg text-ink/90 leading-relaxed font-body">
          <p>
            MediaFlow was engineered by a distributed group of systems programmers who grew tired of the modern web’s bloated download tools. Traditional media tools require disk-heavy multi-minute queues, force invasive interstitial advertisements, and store unneeded copies of personal media on private servers. We built MediaFlow to prove that media extraction can be instantaneous, stateless, and respectful of user privacy.
          </p>

          <p>
            Our technical philosophy centers around line-speed endpoint resolution. Rather than ingesting gigabytes of video into intermediate storage, MediaFlow queries source platforms to extract verified CDN stream descriptors and passes them directly to your browser. By decoupling resolution from storage, we operate with a strict zero-retention guarantee: no video files ever touch our disks, cached metadata expires within three hours, and bandwidth remains reserved for verified personal fair use.
          </p>
        </div>

        <div className="pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-muted">
          <div>
            Source code &amp; issues:{' '}
            <a
              href="https://github.com/mediaflow-app"
              target="_blank"
              rel="noreferrer"
              className="text-ink underline hover:text-accent transition-colors"
            >
              github.com/mediaflow-app
            </a>
          </div>
          <div>
            Contact inquiries:{' '}
            <a
              href="mailto:team@mediaflow.app"
              className="text-ink underline hover:text-accent transition-colors"
            >
              team@mediaflow.app
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
