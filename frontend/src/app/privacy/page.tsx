import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Server, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — MediaFlow',
  description: 'Privacy policy, zero-storage commitment, and minimal data processing practices for MediaFlow.',
  alternates: {
    canonical: 'https://mediaflow.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Downloader</span>
      </Link>

      <div className="space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            Last Updated: September 2026 • Version 2.4
          </p>
        </div>

        {/* Blue Callout Summary matching Design Board (Row 2 Col 2) */}
        <div className="p-5 sm:p-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-sm leading-relaxed shadow-xs">
          The protection and sovereignty of your personal data is paramount. MediaFlow operates on a stateless, zero-retention architecture designed from the ground up to never log, store, or sell your personal downloading activity.
        </div>

        {/* Structured Sections matching Design Board */}
        <div className="space-y-6">
          {/* Legal Description */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              <span>Legal Description</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              MediaFlow operates exclusively as an autonomous web client utility. It provides a standardized interface for users to resolve and download publicly accessible media streams from online hosting platforms for personal, offline archival use in accordance with applicable copyright exemptions.
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Data Collection</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We practice true zero-retention data collection. We do not require accounts, usernames, email addresses, phone numbers, or payment methods. We do not catalog search queries, resolved video titles, or downloaded file contents. Transient operational logs (IP address for rate-limiting defence) are purged automatically within rolling 3-hour windows.
            </p>
          </div>

          {/* Browser Processing */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Browser Processing</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Media stream chunks are piped directly through client-side buffer streams to your device browser. No media files or audio streams are written to or buffered onto our physical server hard drives at any point during your session.
            </p>
          </div>

          {/* No Tracking */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-600" />
              <span>No Tracking</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We do not utilize invasive cross-site behavioral tracking scripts, browser fingerprinting methods, or persistent user profiling cookies. Your interactions with this tool remain completely private and self-contained.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
