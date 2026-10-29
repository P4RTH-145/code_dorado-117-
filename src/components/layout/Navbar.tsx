import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Cpu, 
  Bot,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLevelInfo } from '../../data/badgesData';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { progress, profile, settings, updateSettings } = useApp();
  const levelInfo = getLevelInfo(progress.totalXp);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'midnight' ? 'dark' : settings.theme === 'dark' ? 'light' : 'midnight';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Lab Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg lg:hidden transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  ENTC INNOVATE
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 rounded font-semibold">
                  Lab v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                Smart Electronics & Telecom Innovation Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Status & Fast Jump */}
        <div className="hidden xl:flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SIM ENGINE: ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">DSP / LOGIC READY</span>
          </div>

          <Link 
            to="/ai-tutor"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-950/60 border border-violet-800/60 text-violet-300 hover:bg-violet-900/60 hover:border-violet-600 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Tutor Active</span>
          </Link>
        </div>

        {/* Right: Gamification Badges, Streak, Level, User profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Streak pill */}
          <div 
            title={`${progress.currentStreak} day learning streak!`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-semibold cursor-default hover:border-amber-600/60 transition-colors"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            <span>{progress.currentStreak}d</span>
          </div>

          {/* XP pill */}
          <div 
            title={`Total Learning Points: ${progress.totalXp} XP`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 text-xs font-mono font-bold hover:border-cyan-500/60 transition-colors"
          >
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            <span>{progress.totalXp} <span className="text-[10px] text-cyan-400 font-sans">XP</span></span>
          </div>

          {/* Level badge */}
          <div className="hidden md:flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              <span>Lvl {levelInfo.level}</span>
            </div>
            <span className="text-[10px] text-slate-400 max-w-[110px] truncate">
              {levelInfo.name}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Current theme: ${settings.theme}. Click to switch.`}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Toggle Theme"
          >
            {settings.theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Profile mini avatar link */}
          <Link
            to="/settings"
            title={`${profile.name} - ${profile.branch}`}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-cyan-500 transition-all">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
