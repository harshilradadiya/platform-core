'use client';

import React from 'react';

export type AffiliateProgram = 'nordvpn' | 'expressvpn' | 'pia';

interface AffiliateBannerProps {
  program?: AffiliateProgram;
  offerIndex?: number;
}

const OFFERS: Record<AffiliateProgram, {
  name: string;
  headline: string;
  oneLiner: string;
  cta: string;
  url: string;
}> = {
  nordvpn: {
    name: 'NordVPN',
    headline: 'Download privately without ISP throttling',
    oneLiner: 'Encrypt your connection and avoid local bandwidth restrictions on media streams.',
    cta: 'Get 74% off',
    url: 'https://nordvpn.com',
  },
  expressvpn: {
    name: 'ExpressVPN',
    headline: 'Ultra-fast servers for media resolution',
    oneLiner: 'Consistent throughput across 105 countries with RAM-only server security.',
    cta: 'Try ExpressVPN',
    url: 'https://expressvpn.com',
  },
  pia: {
    name: 'Private Internet Access',
    headline: 'Open-source privacy for frequent streamers',
    oneLiner: 'Strict no-logs policy proven in court, with uncapped transfer speeds.',
    cta: 'Explore PIA',
    url: 'https://privateinternetaccess.com',
  },
};

export function AffiliateBanner({ program = 'nordvpn', offerIndex }: AffiliateBannerProps) {
  const keys: AffiliateProgram[] = ['nordvpn', 'expressvpn', 'pia'];
  const activeKey = offerIndex !== undefined ? keys[offerIndex % keys.length] : program;
  const offer = OFFERS[activeKey] || OFFERS.nordvpn;

  const handleTrackClick = () => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: activeKey, timestamp: Date.now() }),
      }).catch(() => {});
    } catch {
      // Non-blocking telemetry stub
    }
  };

  return (
    <div className="w-full my-8 p-5 sm:p-6 bg-white border border-line rounded-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Subtle Security Icon */}
          <div className="p-2 border border-line rounded-input bg-paper text-ink shrink-0 mt-0.5 sm:mt-0">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0E1116"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                Partner
              </span>
              <span className="font-mono text-[11px] text-muted">·</span>
              <span className="font-mono text-[11px] text-ink font-medium">
                {offer.name}
              </span>
            </div>
            <h4 className="font-body text-sm sm:text-base font-semibold text-ink">
              {offer.headline}
            </h4>
            <p className="font-body text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
              {offer.oneLiner}
            </p>
          </div>
        </div>

        {/* CTA with rel="sponsored nofollow" */}
        <a
          href={offer.url}
          target="_blank"
          rel="sponsored nofollow"
          onClick={handleTrackClick}
          className="shrink-0 px-4 py-2 border border-line bg-paper hover:bg-white text-ink font-body text-xs font-semibold rounded-input transition-colors"
        >
          {offer.cta}
        </a>
      </div>
    </div>
  );
}
