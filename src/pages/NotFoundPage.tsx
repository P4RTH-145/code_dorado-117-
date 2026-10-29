import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-20 w-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
        <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      <h1 className="text-4xl font-black font-mono text-white">404</h1>
      <h2 className="text-xl font-bold text-slate-200">Engineering Module Not Found</h2>
      <p className="text-xs text-slate-400 max-w-md">
        The circuit node or route you attempted to access does not exist on this bus. Return to the main lab dashboard.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all mt-4"
      >
        <Home className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
