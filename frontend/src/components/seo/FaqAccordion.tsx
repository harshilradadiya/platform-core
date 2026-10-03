'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export function FaqAccordion({
  items,
  title = 'Frequently asked questions',
  subtitle = 'Everything you need to know about our high-speed media resolution engine.',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full space-y-6">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight font-sans">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-[#A1A1AA] max-w-[60ch]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="border border-[#27272A] rounded-2xl bg-[#111113] divide-y divide-[#27272A] overflow-hidden shadow-subtle">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`transition-colors ${
                isOpen ? 'bg-[#18181B]/80' : 'hover:bg-[#18181B]/40'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-[#FAFAFA] text-sm sm:text-base">
                  {item.question}
                </span>
                <span className="shrink-0 text-[#71717A]">
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#EF4444]' : 'text-[#71717A]'
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-[#A1A1AA] text-sm sm:text-[15px] leading-relaxed border-t border-[#27272A]/80 animate-in fade-in-50 duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
