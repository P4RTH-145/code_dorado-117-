import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Terminal, ShieldCheck, Heart, Radio, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs py-8 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-200 font-semibold text-sm">ENTC Innovate Lab</div>
            <div className="text-[11px] text-slate-300">
              Department of Electronics & Telecommunication Engineering
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
          <Link to="/learn" className="hover:text-cyan-400 transition-colors">Curriculum</Link>
          <Link to="/lab" className="hover:text-cyan-400 transition-colors">Simulations</Link>
          <Link to="/ai-tutor" className="hover:text-cyan-400 transition-colors">AI Assistant</Link>
          <Link to="/coding" className="hover:text-cyan-400 transition-colors">Code Arena</Link>
          <Link to="/quizzes" className="hover:text-cyan-400 transition-colors">Quizzes</Link>
          <Link to="/iot" className="hover:text-cyan-400 transition-colors">IoT Lab</Link>
          <Link to="/settings" className="hover:text-cyan-400 transition-colors">Settings</Link>
        </div>

        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Hardware Model v2.4
          </span>
          <span>•</span>
          <span>Real-time JS Simulations</span>
        </div>
      </div>
    </footer>
  );
};
