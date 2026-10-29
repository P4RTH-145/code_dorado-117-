import React from 'react';
import { Sparkles, Terminal, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/70 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">ENTC Innovate Lab</span>
            <span className="text-slate-400 mx-2">—</span>
            <span>AI-Powered Smart Learning & Innovation Platform</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link to="/learn" className="hover:text-cyan-400 transition-colors">Curriculum</Link>
          <Link to="/lab" className="hover:text-cyan-400 transition-colors">Virtual Circuits</Link>
          <Link to="/ai-tutor" className="hover:text-cyan-400 transition-colors">AI Assistant</Link>
          <Link to="/settings" className="hover:text-cyan-400 transition-colors">API & Settings</Link>
          <span className="flex items-center gap-1 text-slate-400">
            Built for Electronics & Telecommunication Engineers
          </span>
        </div>
      </div>
    </footer>
  );
};

