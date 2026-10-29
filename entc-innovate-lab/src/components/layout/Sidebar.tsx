import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Cpu, 
  Bot, 
  Terminal, 
  HelpCircle, 
  Radio, 
  Trophy, 
  Settings, 
  Flame, 
  Sparkles,
  Zap,
  X
} from 'lucide-react';
import { StudentStats, StudentProfile } from '../../types';

interface SidebarProps {
  stats: StudentStats;
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/learn', label: 'Learn ENTC', icon: BookOpen, badge: '8 Branches' },
  { path: '/virtual-lab', label: 'Virtual Electronics Lab', icon: Cpu, highlight: true },
  { path: '/ai-tutor', label: 'AI Learning Assistant', icon: Bot, badge: 'Tutor' },
  { path: '/coding', label: 'Coding Arena', icon: Terminal },
  { path: '/quizzes', label: 'Quiz Zone & Games', icon: HelpCircle },
  { path: '/iot', label: 'IoT & Real Simulations', icon: Radio },
  { path: '/progress', label: 'Progress & Badges', icon: Trophy },
  { path: '/settings', label: 'Profile & Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ stats, profile, isOpen, onClose }) => {
  const currentLevelXP = stats.xp % 500;
  const progressPercent = Math.min(100, Math.round((currentLevelXP / 500) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-[#0A0F1D] border-r border-slate-800/80
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-heading">ENTC Innovate</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Learning & Simulation</p>
            </div>
          </NavLink>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-transparent text-cyan-400 border border-cyan-500/30 shadow-xs shadow-cyan-500/10' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}
                  ${item.highlight && !isActive ? 'hover:border hover:border-blue-500/30' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span className="flex-1 truncate">{item.label}</span>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isActive 
                          ? 'bg-cyan-500/30 text-cyan-200' 
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Student Level & Profile Summary */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-500/30"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0A0F1D] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-bold text-cyan-400">Lv. {stats.level}</span>
                <span className="text-[10px] text-slate-400">• {stats.xp} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{stats.streakDays}d</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Next Level</span>
              <span className="text-slate-300 font-mono">{currentLevelXP} / 500 XP</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
