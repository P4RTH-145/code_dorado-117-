import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Zap, 
  BookOpen, 
  Award,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export const AdminPage: React.FC = () => {
  const { currentUser, accounts, addStudent, deleteStudent, switchAccount } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('Electronics & Telecommunication');
  const [semester, setSemester] = useState('6th Semester (Junior Year)');
  const [targetRole, setTargetRole] = useState('Embedded Systems Engineer');

  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Access check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 max-w-md">
          Only authorized Department Administrators can access the Student Provisioning Portal and add new student accounts. Please sign in with an Admin account.
        </p>
      </div>
    );
  }

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    const res = addStudent({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      rollNumber: rollNumber.trim() || `ENTC-2026-${Math.floor(100 + Math.random() * 900)}`,
      branch,
      semester,
    });

    if (res.success) {
      setFormMsg({ type: 'success', text: `Student ${name} successfully enrolled and provisioned!` });
      setName('');
      setEmail('');
      setRollNumber('');
      setPassword('student123');
    } else {
      setFormMsg({ type: 'error', text: res.error || 'Failed to add student.' });
    }
  };

  const studentAccounts = accounts.filter(a => a.role === 'student');

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrative Control Deck
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Enrollment & Academic Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              As an authorized Lab Administrator, you have exclusive privilege to enroll, provision, and monitor student lab credentials and individual progress records.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Enrolled</div>
              <div className="text-2xl font-black font-mono text-purple-300">{studentAccounts.length} Students</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Add New Student Form */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <UserPlus className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Enroll New Student</h3>
            </div>

            {formMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                formMsg.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }`}>
                {formMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <span>{formMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Student Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Academic Email:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@entc.edu"
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Roll Number:
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="ENTC-2026-115"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Initial Password:
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Semester & Branch:
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Enroll & Create Student Account</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Enrolled Students Directory */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex-1">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Active Student Records</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">{studentAccounts.length} Active Accounts</span>
            </div>

            <div className="space-y-3">
              {studentAccounts.map((student) => {
                const sProgress = authService.getUserProgress(student.id);

                return (
                  <div
                    key={student.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-sm">
                        {student.profile.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{student.profile.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                            {student.profile.rollNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                          <span className="text-cyan-400 font-bold">{sProgress.totalXp} XP</span>
                          <span>{sProgress.completedLessons.length} Lessons</span>
                          <span>{sProgress.completedChallenges.length} Solved</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {/* Switch to this student session */}
                      <button
                        onClick={() => switchAccount(student.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition-colors"
                        title="Log in as this student to view workspace"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Switch</span>
                      </button>

                      {/* Delete student if not default student-1 */}
                      {student.id !== 'student-1' && student.id !== 'student-2' && (
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
