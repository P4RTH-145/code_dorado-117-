import React from 'react';
import { CodingArena } from '../components/coding/CodingArena';

export const CodingArenaPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Hands-on Embedded Coding
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Coding Challenge Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice essential embedded algorithms including non-blocking LED state timers, switch software debounce, relay hysteresis, universal logic gate calculators, and ADC sensor scaling.
          </p>
        </div>
      </div>

      <CodingArena />
    </div>
  );
};
