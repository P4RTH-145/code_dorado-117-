import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Cpu, 
  Bot, 
  Code2, 
  HelpCircle, 
  Wifi, 
  Award, 
  Settings,
  ChevronRight,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLevelInfo } from '../../data/badgesData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { progress } = useApp();
  const levelInfo = getLevelInfo(progress.totalXp);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/learn', label: 'Learn ENTC', icon: BookOpen, badge: `${progress.completedLessons.length} done` },
    { to: '/lab', label: 'Virtual Electronics Lab', icon: Cpu, badge: 'Interactive' },
    { to: '/ai-tutor', label: 'AI Learning Assistant', icon: Bot, badge: 'AI' },
    { to: '/coding', label: 'Coding Arena', icon: Code2, badge: `${progress.completedChallenges.length}/5` },
    { to: '/quizzes', label: 'Quiz Zone & Games', icon: HelpCircle, badge: 'XP' },
    { to: '/iot', label: 'IoT Simulations', icon: Wifi, badge: '3 Scenarios' },
    { to: '/progress', label: 'Progress & Badges', icon: Award, badge: `${progress.unlockedBadgeIds.length} badges` },
    { to: '/settings', label: 'Profile & Settings', icon: Settings, badge: null }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Lab Branding Header (inside drawer on mobile) */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">ENTC NAVIGATOR</span>
              <p className="text-[10px] text-slate-400">Smart Lab Control Deck</p>
            </div>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mx-4 my-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200">Level {levelInfo.level} Progress</span>
            <span className="font-mono text-cyan-400 font-bold">{levelInfo.progressInLevel}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-500 rounded-full"
              style={{ width: `${levelInfo.progressInLevel}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>{levelInfo.name}</span>
            <span>{levelInfo.xpToNext} XP to next</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100 hover:border hover:border-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{link.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {link.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Lab Telemetry Status Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Lab Engine
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">v2.6.4</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive circuits, code sandbox & telemetry active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
