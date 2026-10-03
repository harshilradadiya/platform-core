'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Layers, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function StickyHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Link Parsing & Stream Handshake',
      subtitle: 'Recognize',
      description:
        'Paste any public YouTube or Pinterest link. FlowFetch executes client-directed HEAD requests directly against upstream manifest endpoints to resolve media descriptors.',
      icon: Link2,
    },
    {
      number: '02',
      title: 'Format Matrix Negotiation',
      subtitle: 'Choose',
      description:
        'Select between native 1080p Full HD video streams, standard HD (720p), or standalone high-bitrate 320kbps MP3 audio with instant container extraction.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Direct Pass-Through Download',
      subtitle: 'Download',
      description:
        'Your browser fetches media chunks straight from origin CDNs. Zero intermediate server writes, zero disk storage, zero queues.',
      icon: Download,
    },
  ];

  return (
    <section id="how" aria-label="How FlowFetch Works" className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 my-16">
      <div className="text-center space-y-1.5 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-[#EF4444]">
          Architecture Protocol
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
          How FlowFetch Works
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto">
          Direct CDN stream extraction protocol without intermediate disk buffering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Step Triggers */}
        <div className="md:col-span-6 space-y-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={s.number}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[var(--bg-surface-alt)] border-[var(--brand-primary)] shadow-subtle'
                    : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-strong)] opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[var(--brand-primary)]">
                      {s.number}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {s.subtitle}
                    </span>
                  </div>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`} />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Morphing Viewport Card */}
        <div className="md:col-span-6 md:sticky md:top-24">
          <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl relative overflow-hidden min-h-[340px] flex flex-col justify-between">
            {/* Background Accent Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border-default)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A] text-xs font-mono text-[#71717A]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Interactive Stage: {steps[activeStep].subtitle}
                </span>
                <span>Active Simulator</span>
              </div>

              {/* Dynamic State Transitions */}
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 space-y-4 text-left"
                  >
                    <div className="p-3 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-[#EF4444]" />
                      <span className="text-xs font-mono text-[#FAFAFA] truncate">
                        https://youtube.com/watch?v=dQw4w9WgXcQ
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#09090B] border border-[#27272A] rounded-xl font-mono text-xs text-[#A1A1AA] space-y-1.5">
                      <p className="text-emerald-400 font-bold">➜ 200 OK: Manifest Verified</p>
                      <p>upstream: googlevideo.com CDN</p>
                      <p>handshake_latency: 14ms (HTTP/2)</p>
                      <p className="text-purple-400">buffer_policy: 0 bytes cached on server</p>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 space-y-2.5 text-left"
                  >
                    <div className="p-3 bg-[#18181B] border border-[#EF4444] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#FAFAFA]">1080p Full HD</span>
                        <span className="text-[#71717A] ml-2 font-mono">142 MB</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/60 text-[#EF4444] border border-red-900 font-mono">
                        Selected
                      </span>
                    </div>

                    <div className="p-3 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#FAFAFA]">720p Standard HD</span>
                        <span className="text-[#71717A] ml-2 font-mono">68 MB</span>
                      </div>
                      <span className="text-[10px] text-[#71717A] font-mono">MP4</span>
                    </div>

                    <div className="p-3 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#FAFAFA]">320kbps MP3 Audio</span>
                        <span className="text-[#71717A] ml-2 font-mono">8.4 MB</span>
                      </div>
                      <span className="text-[10px] text-[#71717A] font-mono">High-Fi</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 space-y-4 text-left"
                  >
                    <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Direct Stream Established</span>
                        </span>
                        <span className="font-mono text-[#FAFAFA]">100%</span>
                      </div>
                      <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-full"></div>
                      </div>
                      <p className="text-[11px] text-[#71717A] font-mono">
                        File dispatched directly to browser Downloads folder.
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#71717A] font-mono pt-1">
                      <span>Server Storage: 0 bytes</span>
                      <span className="text-emerald-400">Stream Closed</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Stepper Indicator */}
            <div className="relative z-10 pt-4 border-t border-[#27272A] flex items-center justify-between text-xs text-[#71717A]">
              <span>Step {activeStep + 1} of 3</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeStep === i ? 'bg-[#EF4444] w-5' : 'bg-[#27272A]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
