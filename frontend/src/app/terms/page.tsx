import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — MediaFlow',
  description: 'Terms of service, DMCA provisions, acceptable use policies, and copyright limitations for MediaFlow.',
  alternates: {
    canonical: 'https://mediaflow.app/terms',
  },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Terms of Service govern our permissions and provisions for media stream resolution and personal user usage.
          </p>
        </div>

        {/* Structured Sections matching Design Board */}
        <div className="space-y-6">
          {/* Acceptable Use */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Acceptable Use</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              You agree to utilize MediaFlow strictly in compliance with all relevant international and regional copyright statutes. You may only convert, resolve, and archive media streams for which you own the copyright, have acquired express written license, or where the content is designated under Creative Commons or the public domain.
            </p>
          </div>

          {/* Limitations of Liability */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Limitations of Liability</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              MediaFlow is provided strictly on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Under no circumstances shall the operators or infrastructure hosts be held liable for any damages, upstream network timeouts, format incompatibilities, or misuse arising from the operation of this utility.
            </p>
          </div>

          {/* Copyright Notice (DMCA) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Copyright Notice (DMCA)</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We respect the intellectual property of authors and creators worldwide. If you believe your copyrighted work is being accessed through this scraper contrary to statutory terms, you may submit a formal takedown request via our{' '}
              <Link href="/contact" className="text-red-600 underline font-semibold hover:text-red-700">
                Contact &amp; DMCA page
              </Link>{' '}
              for immediate protocol domain exemption.
            </p>
          </div>

          {/* Personal Use Only Box matching Design Board */}
          <div className="p-6 bg-slate-900 text-white rounded-xl shadow-sm space-y-2 border-2 border-slate-700">
            <h3 className="text-sm font-bold tracking-wider uppercase text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Personal Use Only Notice</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
              THIS SERVICE IS STRICTLY DESIGNED AND OFFERED FOR NON-COMMERCIAL, PRIVATE ARCHIVAL AND FAIR USE CONVERSION ONLY. DOWNLOADING COPYRIGHTED MEDIA FOR REDISTRIBUTION, COMMERCIAL RESALE, PUBLIC BROADCASTING, OR ANY PROHIBITED USE WITHOUT EXPLICIT PERMISSION FROM RIGHTS HOLDERS IS STRICTLY FORBIDDEN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
