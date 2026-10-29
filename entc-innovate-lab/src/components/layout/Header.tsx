import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Flame, Sparkles, Bot, ShieldCheck, Sun, Moon } from 'lucide-react';
import { StudentStats, StudentProfile } from '../../types';
import { triggerConfetti } from '../../services/storageService';

interface HeaderProps {
  stats: StudentStats;
  profile: StudentProfile;
  onOpenMobileMenu: () => void;
  onToggleTheme: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Engineering Command Dashboard', subtitle: 'Real-time telemetry, learning trajectory & daily challenges' },
  '/learn': { title: 'Learn ENTC Library', subtitle: 'Curated modules spanning semiconductor physics to edge IoT' },
  '/virtual-lab': { title: 'Virtual Electronics Laboratory', subtitle: 'Interactive logic gates, circuit simulation & analog transducers' },
  '/ai-tutor': { title: 'AI Engineering Assistant', subtitle: 'Domain-focused guidance with beginner, step-by-step & debugging modes' },
  '/coding': { title: 'Coding Challenge Arena', subtitle: 'Safe embedded C/JS sandbox with automated test evaluation' },
  '/quizzes': { title: 'Quiz Zone & Logic Arena', subtitle: 'Timed multiple-choice assessments & interactive logic prediction games' },
  '/iot': { title: 'IoT & Real-World Simulations', subtitle: 'Smart home automation, thermal safety monitoring & precision irrigation' },
  '/progress': { title: 'Progress & Engineering Badges', subtitle: 'XP logs, skill tree trajectory, levels & verified achievements' },
  '/settings': { title: 'System & Profile Settings', subtitle: 'Student identity, theme configuration & AI LLM API credentials' }
};

export const Header: React.FC<HeaderProps> = ({ 
  stats, 
  profile, 
  onOpenMobileMenu,
  onToggleTheme
}) => {
  const location = useLocation();
  const current = pageTitles[location.pathname] || { 
    title: 'ENTC Innovate Lab', 
    subtitle: 'Smart Learning & Innovation Platform' 
  };

  const isDemoAI = !profile.apiKey;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070B14]/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm lg:text-base font-bold text-white tracking-tight flex items-center gap-2">
            {current.title}
          </h1>
          <p className="hidden md:block text-xs text-slate-400 font-normal">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Telemetry Pills */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Tutor Status Pill */}
        <Link 
          to="/ai-tutor"
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
            isDemoAI
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
          }`}
          title={isDemoAI ? 'Running in offline educational demo mode' : 'Connected to live external AI API'}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{isDemoAI ? 'AI Demo Mode' : 'AI Active'}</span>
        </Link>

        {/* Streak Pill */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-xs cursor-default"
          title={`${stats.streakDays} Day Learning Streak`}
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{stats.streakDays}d Streak</span>
        </div>

        {/* Total XP Pill */}
        <button 
          onClick={triggerConfetti}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-xs shadow-cyan-500/10"
          title="Click for celebratory fireworks!"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">{stats.xp.toLocaleString()} XP</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          title={`Switch to ${profile.theme === 'dark' ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle theme"
        >
          {profile.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Quick Profile Link */}
        <Link 
          to="/settings"
          className="flex items-center gap-2 pl-1 group"
          title="Profile & Settings"
        >
          <img 
            src={profile.avatarUrl} 
            alt={profile.name}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 group-hover:ring-cyan-500 transition-all"
          />
        </Link>
      </div>
    </header>
  );
};
