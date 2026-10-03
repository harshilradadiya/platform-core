import React from 'react';
import Link from 'next/link';

interface FooterProps {
  buildHash?: string;
}

export function Footer({ buildHash = '8f4c21a' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#09090B] text-[#A1A1AA] border-t border-[#27272A]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="text-xl font-bold text-[#FAFAFA] tracking-tight inline-block hover:text-red-400 transition-colors">
              FlowFetch
            </Link>
            <p className="text-sm text-[#A1A1AA] max-w-sm leading-relaxed">
              Production-grade media resolution utility. Direct CDN pass-through streaming with zero server-side disk buffering.
            </p>
            {/* System Badge */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18181B] border border-[#27272A] rounded-full text-xs font-mono text-emerald-400 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Engine v1.4.0 ({buildHash})</span>
              </div>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-4 font-mono">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/api-status" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  Troubleshooting
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-4 font-mono">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/terms" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  Terms &amp; DMCA
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Meta */}
          <div>
            <h4 className="text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-4 font-mono">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-8 border-t border-[#27272A] flex flex-col md:flex-row justify-between items-center text-xs text-[#71717A] gap-4">
          <p>© {currentYear} FlowFetch Platform Core. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-[#A1A1AA]">
            <span>0 files stored</span>
            <span>•</span>
            <span>3h Redis TTL</span>
            <span>•</span>
            <span>30 req/min Fair Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
