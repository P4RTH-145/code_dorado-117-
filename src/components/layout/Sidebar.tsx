import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Bot,
  Terminal,
  HelpCircle,
  Wifi,
  Trophy,
  Settings,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
    color: 'hover:text-cyan-400'
  },
  {
    to: '/learn',
    label: 'Learn ENTC',
    icon: BookOpen,
    badge: '8 Topics',
    color: 'hover:text-blue-400'
  },
  {
    to: '/lab',
    label: 'Virtual Electronics Lab',
    icon: Cpu,
    badge: 'Simulators',
    color: 'hover:text-cyan-400'
  },
  {
    to: '/ai-tutor',
    label: 'AI Learning Assistant',
    icon: Bot,
    badge: 'AI Powered',
    color: 'hover:text-violet-400'
  },
  {
    to: '/coding',
    label: 'Coding Challenge Arena',
    icon: Terminal,
    badge: '5 Tasks',
    color: 'hover:text-emerald-400'
  },
  {
    to: '/quizzes',
    label: 'Quiz Zone & Mini-Games',
    icon: HelpCircle,
    badge: 'XP Boost',
    color: 'hover:text-amber-400'
  },
  {
    to: '/iot',
    label: 'IoT & Real-World Sims',
    icon: Wifi,
    badge: 'Live Telemetry',
    color: 'hover:text-teal-400'
  },
  {
    to: '/progress',
    label: 'Progress & Badges',
    icon: Trophy,
    badge: null,
    color: 'hover:text-yellow-400'
  },
  {
    to: '/settings',
    label: 'Profile & Settings',
    icon: Settings,
    badge: null,
    color: 'hover:text-slate-200'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { progress } = useApp();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-50 lg:z-30 w-72 h-screen lg:h-[calc(100vh-61px)] bg-slate-950/95 lg:bg-slate-950/60 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Header on mobile */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">ENTC Navigation</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              ✕
            </button>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-mono tracking-widest uppercase text-slate-300 font-semibold">
              Platform Modules
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/50 text-cyan-300 border border-cyan-800/60 shadow-lg shadow-cyan-950/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-900 text-slate-400 border border-slate-800 group-hover:border-cyan-800 group-hover:text-cyan-300 transition-colors">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Lab Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Interactive Lab</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Test logic gates, simulate circuits with real-time Ohm&apos;s law calculations, and test sensors.
            </p>
            <NavLink
              to="/lab"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group"
            >
              <span>Launch Simulator</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </NavLink>
          </div>
        </div>

        {/* Bottom student telemetry bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Completed Lessons</span>
            <span className="font-mono text-cyan-400 font-semibold">{progress.completedLessons.length} / 8</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (progress.completedLessons.length / 8) * 100)}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
