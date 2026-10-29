import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StudentStats, StudentProfile } from '../../types';

interface LayoutProps {
  stats: StudentStats;
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const Layout: React.FC<LayoutProps> = ({ stats, profile, onUpdateProfile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = profile.theme === 'dark' ? 'light' : 'dark';
    onUpdateProfile({
      ...profile,
      theme: newTheme
    });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen ${profile.theme === 'dark' ? 'bg-[#070B14] text-slate-100' : 'bg-slate-50 text-slate-900'} bg-circuit-grid`}>
      {/* Sidebar navigation */}
      <Sidebar 
        stats={stats}
        profile={profile}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header 
          stats={stats}
          profile={profile}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
