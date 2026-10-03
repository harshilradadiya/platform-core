'use client';

import React, { useState } from 'react';
import { Play, CheckCircle2, Terminal, ArrowRight, Shield } from 'lucide-react';

export default function ArchitectureSimulator() {
  const [stage, setStage] = useState<'idle' | 'testing' | 'verified'>('verified');

  const runSimulation = () => {
    setStage('testing');
    setTimeout(() => setStage('verified'), 600);
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[#EF4444]">
          Live Simulator
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA] mt-1">
          Real-Time Protocol Test
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto mt-1">
          Execute a simulated origin handshake to verify manifest response latencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left Step Explainer */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-red-500 font-bold">01 RECOGNIZE</span>
            <Shield className="w-4 h-4 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100">Link Parsing &amp; Stream Handshake</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Paste any public YouTube or Pinterest link. FlowFetch executes client-directed HEAD requests directly against upstream manifest endpoints to resolve media descriptors.
          </p>
          <button
            type="button"
            onClick={runSimulation}
            disabled={stage === 'testing'}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-red-500" />
            <span>{stage === 'testing' ? 'Handshaking...' : 'Re-Run Protocol Test'}</span>
          </button>
        </div>

        {/* Right Active Terminal Simulator */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-800 bg-black/60 font-mono text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Interactive Stage: Recognize</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Simulator
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 break-all">
              <span className="text-zinc-500">GET </span>
              https://youtube.com/watch?v=dQw4w9WgXcQ
            </div>

            {stage === 'testing' ? (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                Executing Manifest Handshake (~18ms)...
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>200 OK: Manifest Verified</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Ping: 16ms</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ArchitectureSimulator };
