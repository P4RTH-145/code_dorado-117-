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
  Trash2,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, accounts, deleteStudent } = useApp();
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

  const hasDemoUsers = accounts.some(a => a.id === 'student-1' || a.id === 'student-2');

  const handleDeleteDemoUsers = () => {
    deleteStudent('student-1');
    deleteStudent('student-2');
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

        {/* Dynamic Accounts Quick Login Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Available Accounts ({accounts.length}):
            </span>
            {hasDemoUsers && (
              <button
                type="button"
                onClick={handleDeleteDemoUsers}
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                title="Delete default demo student accounts"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete Demo Users</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs max-h-60 overflow-y-auto pr-1">
            {accounts.map((acc) => {
              const isAdmin = acc.role === 'admin';

              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.password)}
                  className={`p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border text-left transition-all flex items-center justify-between group ${
                    isAdmin
                      ? 'border-purple-500/30 hover:border-purple-500'
                      : 'border-cyan-500/30 hover:border-cyan-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${
                      isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                        <span className="truncate max-w-[200px]">{acc.profile.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                          isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {acc.email} / {acc.password}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>
              );
            })}
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
