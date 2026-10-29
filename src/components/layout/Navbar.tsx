import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Flame, 
  Menu, 
  X, 
  Sparkles, 
  ShieldAlert, 
  Settings, 
  Sun, 
  Moon,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLevelInfo } from '../../data/badgesData';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { progress, profile, settings, updateSettings } = useApp();
  const location = useLocation();
  const levelInfo = getLevelInfo(progress.totalXp);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'midnight' : 'light';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-cyan-100" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                ENTC <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Innovate Lab</span>
              </span>
              <p className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                Electronics & Telecom Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Data indicator */}
        <div className="hidden md:flex items-center gap-2">
          {progress.isDemoData ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Sample Demo Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Student Workspace</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Level Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-200 text-xs font-medium">
            <span className="text-cyan-400 font-bold">Lvl {levelInfo.level}</span>
            <span className="text-slate-400 text-[11px]">({levelInfo.name})</span>
          </div>
        </div>

        {/* Right: Gamification Badges, Theme & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Streak Counter */}
          <div 
            title={`${progress.currentStreak} Day Study Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold"
          >
            <Flame className="h-4 w-4 fill-orange-500 text-orange-500 animate-bounce" />
            <span>{progress.currentStreak}d</span>
          </div>

          {/* Total XP Pill */}
          <div 
            title="Total Learning Points (XP)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold"
          >
            <Zap className="h-4 w-4 fill-cyan-400 text-cyan-400" />
            <span>{progress.totalXp} XP</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
            title={`Switch to ${settings.theme === 'light' ? 'Dark' : 'Light'} theme`}
          >
            {settings.theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Student Profile Quick Link */}
          <Link
            to="/settings"
            className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-semibold text-xs text-white ring-2 ring-cyan-500/30">
              {profile.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold leading-none">{profile.name}</div>
              <div className="text-[10px] text-slate-400">{profile.branch}</div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
