import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Flame, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Settings, 
  Sun, 
  Moon,
  LogOut,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLevelInfo } from '../../data/badgesData';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { progress, profile, settings, updateSettings, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const levelInfo = getLevelInfo(progress.totalXp);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'midnight' : 'light';
    updateSettings({ theme: nextTheme });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

        {/* Center: Live Data indicator & Role */}
        <div className="hidden md:flex items-center gap-2">
          {currentUser?.role === 'admin' ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-500/25 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              <span>Admin Portal (Add Students)</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Student Workspace</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Level Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-200 text-xs font-medium">
            <span className="text-cyan-400 font-bold">Lvl {levelInfo.level}</span>
            <span className="text-slate-400 text-[11px]">({levelInfo.name})</span>
          </div>
        </div>

        {/* Right: Gamification Badges, Theme, Account & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* User Profile / Switch */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to="/settings"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                title="Profile & Settings"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs text-white ring-2 ${
                  currentUser.role === 'admin' ? 'bg-purple-600 ring-purple-500/40' : 'bg-blue-600 ring-cyan-500/40'
                }`}>
                  {profile.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold leading-none truncate max-w-[120px]">{profile.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">{currentUser.role}</div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Sign Out / Switch Account"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
