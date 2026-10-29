import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  UserPlus,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, accounts } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 300);
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
    const res = login(quickEmail, quickPass);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25">
            <Cpu className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            ENTC Lab Portal Login
          </h2>
          <p className="text-xs text-slate-400">
            Role-Based Authentication for Students & Lab Administrators
          </p>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Pre-Configured Demo Accounts (1-Click Login):
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            {/* Admin Demo Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@entc.edu', 'admin123')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-purple-500/30 hover:border-purple-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                    <span>Admin: Dr. Rajesh Kulkarni</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">HOD</span>
                  </div>
                  <div className="text-[11px] text-slate-400">admin@entc.edu / admin123</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Student 1 Demo Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@entc.edu', 'student123')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                    <span>Student 1: Aarav Sharma</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Lvl 3</span>
                  </div>
                  <div className="text-[11px] text-slate-400">aarav@entc.edu / student123</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Student 2 Demo Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('sneha@entc.edu', 'student123')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-blue-500/30 hover:border-blue-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-blue-300 flex items-center gap-1.5">
                    <span>Student 2: Sneha Patel</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">Lvl 2</span>
                  </div>
                  <div className="text-[11px] text-slate-400">sneha@entc.edu / student123</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Academic Email:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@entc.edu or admin@entc.edu"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Password:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Key className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            </button>
          </form>

          {/* Student Enrollment Policy Notice */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed">
            <span className="font-semibold text-slate-300">Policy: </span>
            To maintain university academic integrity, only authorized <strong>Department Admins</strong> can enroll and provision new student accounts.
          </div>
        </div>
      </div>
    </div>
  );
};
