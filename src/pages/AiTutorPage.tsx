import React from 'react';
import { TutorChat } from '../components/ai-tutor/TutorChat';

export const AiTutorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            24/7 AI Engineering Tutor
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Learning Assistant & Code Mentor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get instant, tailored explanations across electronics, telecommunications, DSP, and embedded systems. Switch personas between beginner analogies, step-by-step derivations, hardware troubleshooting, or embedded C++ code.
          </p>
        </div>
      </div>

      <TutorChat />
    </div>
  );
};

