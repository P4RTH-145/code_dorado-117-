import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useApp } from '../../context/AppContext';
import { Award, Zap, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { newBadgeUnlocked, clearNewBadge } = useApp();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Badge Unlocked Celebration Toast / Modal */}
      {newBadgeUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-md w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 p-6 shadow-2xl shadow-cyan-500/20 text-center">
            <button
              onClick={clearNewBadge}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-violet-600 text-white shadow-lg shadow-cyan-500/30 animate-bounce">
              <Award className="h-10 w-10 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
              <Zap className="h-3.5 w-3.5" />
              ACHIEVEMENT UNLOCKED
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              {newBadgeUnlocked.title}
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              {newBadgeUnlocked.description}
            </p>

            <div className="flex items-center justify-center gap-2 mb-6 text-sm font-semibold text-cyan-400">
              <span>+{newBadgeUnlocked.xpValue} XP Awarded</span>
            </div>

            <button
              onClick={clearNewBadge}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-md shadow-cyan-500/25 transition-all"
            >
              Claim Badge & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

