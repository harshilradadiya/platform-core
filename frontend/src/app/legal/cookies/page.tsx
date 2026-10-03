import React from 'react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return {
    title: 'Cookies Policy — MediaFlow',
    description:
      'Detailed cookie policy for MediaFlow: what cookies we store, why they are required for analytics and monetization, and how to opt out.',
    alternates: {
      canonical: 'https://mediaflow.app/legal/cookies',
    },
    openGraph: {
      title: 'Cookies Policy — MediaFlow',
      description:
        'Detailed cookie policy for MediaFlow: what cookies we store, why they are required for analytics and monetization, and how to opt out.',
      url: 'https://mediaflow.app/legal/cookies',
      type: 'website',
    },
  };
}

export default function CookiesPolicyPage() {
  const jsonLdData = breadcrumbSchema([
    { name: 'Home', url: 'https://mediaflow.app' },
    { name: 'Legal', url: 'https://mediaflow.app/terms' },
    { name: 'Cookies', url: 'https://mediaflow.app/legal/cookies' },
  ]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <JsonLd schema={jsonLdData} />

      <article className="space-y-10">
        <header className="space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink tracking-tight">
            Cookies
          </h1>
          <p className="font-mono text-xs text-muted">
            Last modified: September 28, 2026
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            What we set
          </h2>
          <p className="text-base text-ink/90 leading-relaxed font-body">
            MediaFlow operates as a stateless media resolver. We do not use persistent authentication cookies to profile you or track user accounts. However, essential local state is stored directly in your browser:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-muted font-body">
            <li>
              <strong className="text-ink font-semibold">Local Storage Preferences:</strong> We store minimal functional preferences such as your interface layout states or dark/light display preferences. These never leave your local device.
            </li>
            <li>
              <strong className="text-ink font-semibold">Session Identifiers:</strong> Ephemeral session tokens may be generated temporarily in memory to rate-limit aggressive query bursts and maintain system stability.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            Why we use them (AdSense &amp; Analytics)
          </h2>
          <p className="text-base text-ink/90 leading-relaxed font-body">
            To sustain our high-throughput resolution infrastructure without charging user subscriptions, MediaFlow collaborates with third-party advertising networks (including Google AdSense) and anonymous telemetry providers:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-muted font-body">
            <li>
              <strong className="text-ink font-semibold">Advertising Partners (Google AdSense):</strong> Third-party vendors, including Google, use cookies to serve ads based on prior visits to this website or other websites. Google’s use of advertising cookies enables it and its partners to serve non-intrusive ads based on your visit history.
            </li>
            <li>
              <strong className="text-ink font-semibold">Aggregated Analytics:</strong> We collect non-personally identifiable telemetry (such as resolution latency and device browser type) to benchmark cache hit ratios and diagnose upstream platform breakages.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            How to opt out
          </h2>
          <p className="text-base text-ink/90 leading-relaxed font-body">
            You retain absolute sovereignty over what data third parties collect:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-muted font-body">
            <li>
              <strong className="text-ink font-semibold">Personalized Ad Opt-Out:</strong> You may opt out of personalized Google advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink underline hover:text-accent font-mono text-xs"
              >
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              <strong className="text-ink font-semibold">Industry-Wide Opt-Out:</strong> Alternatively, you can opt out of a third-party vendor’s use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noreferrer"
                className="text-ink underline hover:text-accent font-mono text-xs"
              >
                aboutads.info
              </a>
              .
            </li>
            <li>
              <strong className="text-ink font-semibold">Browser-Level Controls:</strong> You can configure your browser to reject all third-party cookies or alert you when a cookie is being sent. MediaFlow’s core resolution functions remain operational even if third-party cookies are blocked.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
