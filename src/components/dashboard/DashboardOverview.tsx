import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  BookOpen, 
  HelpCircle, 
  Cpu, 
  Flame, 
  Award, 
  ArrowRight, 
  Bot, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { LESSONS_DATA } from '../../data/lessonsData';
import { CODING_CHALLENGES } from '../../data/challengesData';
import { getLevelInfo } from '../../data/badgesData';

export const DashboardOverview: React.FC = () => {
  const { progress, profile, badges, resetProgress } = useApp();
  const levelInfo = getLevelInfo(progress.totalXp);

  // Calculate Average Quiz Score
  const quizScores = Object.values(progress.bestQuizScores);
  const avgQuizScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((acc, v) => acc + v, 0) / quizScores.length)
    : 0;

  // Recommended next lessons (uncompleted first)
  const uncompletedLessons = LESSONS_DATA.filter(l => !progress.completedLessons.includes(l.id));
  const recommendedLessons = (uncompletedLessons.length > 0 ? uncompletedLessons : LESSONS_DATA).slice(0, 3);

  // Daily Engineering Challenge (pick first uncompleted coding challenge or challenge #1)
  const dailyChallenge = CODING_CHALLENGES.find(c => !progress.completedChallenges.includes(c.id)) || CODING_CHALLENGES[0];

  // Subject-wise progress data for chart
  const subjectProgressData = [
    { subject: 'Digital Logic', progress: progress.completedLessons.includes('logic-gates-truth-tables') ? 100 : 40 },
    { subject: 'Embedded / PWM', progress: progress.completedLessons.includes('pulse-width-modulation-pwm') ? 100 : 30 },
    { subject: 'Sensors / LM35', progress: progress.completedLessons.includes('temperature-sensors-microcontrollers') ? 100 : 25 },
    { subject: 'Analog Op-Amps', progress: progress.completedLessons.includes('op-amp-fundamentals') ? 100 : 20 },
    { subject: 'DSP / Fourier', progress: progress.completedLessons.includes('fourier-transform-dsp') ? 100 : 15 },
    { subject: 'IoT Telemetry', progress: progress.completedExperiments.some(e => e.startsWith('iot-')) ? 90 : 35 }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                {profile.branch}
              </span>
              <span className="text-xs text-slate-400">• {profile.semester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Continue your engineering journey. Experiment with virtual circuits, solve embedded coding challenges, and consult your personal AI tutor.
            </p>
          </div>

          {/* Quick Level Status Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-violet-600 text-white font-bold text-xl shadow-lg shadow-cyan-500/25">
              L{levelInfo.level}
            </div>
            <div>
              <div className="text-xs text-slate-400">Current Rank</div>
              <div className="text-sm font-bold text-white">{levelInfo.name}</div>
              <div className="text-xs text-cyan-400 font-mono font-semibold">{progress.totalXp} Total XP</div>
            </div>
          </div>
        </div>

        {/* Sample Data Notice if Demo Data active */}
        {progress.isDemoData && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Currently showing realistic <strong>Sample Student Data</strong>. Complete any lesson, quiz, or lab simulation to start logging your real live progress!
              </span>
            </div>
            <button
              onClick={() => resetProgress(true)}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-colors"
            >
              Start Fresh (Clear Sample Data)
            </button>
          </div>
        )}
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Points XP */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total XP</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300">{progress.totalXp}</div>
          <span className="text-[10px] text-slate-400 mt-1">Learning Points</span>
        </div>

        {/* Lessons Completed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Lessons Completed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {progress.completedLessons.length} <span className="text-xs text-slate-400 font-normal">/ {LESSONS_DATA.length}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Mastery Modules</span>
        </div>

        {/* Average Quiz Score */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Quiz Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <HelpCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300">
            {avgQuizScore}%
          </div>
          <span className="text-[10px] text-slate-400 mt-1">{progress.quizAttempts.length} Tests Attempted</span>
        </div>

        {/* Experiments Completed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Lab Experiments</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-violet-300">
            {progress.completedExperiments.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Simulations Verified</span>
        </div>

        {/* Current Learning Streak */}
        <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Active Streak</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="h-4 w-4 fill-orange-500" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-orange-400">
            {progress.currentStreak} <span className="text-xs text-slate-400 font-normal">days</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Study Consistency</span>
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/lab"
          className="group p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Virtual Electronics Lab
              </div>
              <div className="text-xs text-slate-400">Simulate Logic Gates & LED circuits</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/ai-tutor"
          className="group p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                AI Learning Assistant
              </div>
              <div className="text-xs text-slate-400">Ask questions, debug code & math</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/quizzes"
          className="group p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-violet-500/50 transition-all shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                Quiz Zone & Mini-Games
              </div>
              <div className="text-xs text-slate-400">Test knowledge & earn XP rewards</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity Trends Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                Weekly Learning Activity
              </h3>
              <p className="text-xs text-slate-400">Points & simulations completed over time</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
              PAST 7 DAYS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progress.weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#xpGrad)" name="XP Earned" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-Wise Mastery Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-400" />
                Subject-Wise Mastery
              </h3>
              <p className="text-xs text-slate-400">Progress across core disciplines</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Mastery']}
                />
                <Bar dataKey="progress" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Lessons & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Lessons */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                Recommended Next Lessons
              </h3>
              <p className="text-xs text-slate-400">Hand-picked modules based on your roadmap</p>
            </div>
            <Link to="/learn" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedLessons.map((lesson) => {
              const isDone = progress.completedLessons.includes(lesson.id);

              return (
                <Link
                  key={lesson.id}
                  to={`/learn/${lesson.id}`}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                        {lesson.difficulty}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1">
                      {lesson.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.durationMinutes} min
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Daily Engineering Challenge Card */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/70 border border-cyan-500/30 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                DAILY CHALLENGE
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                +{dailyChallenge.xpReward} XP
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {dailyChallenge.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {dailyChallenge.description}
            </p>
          </div>

          <Link
            to="/coding"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs text-center shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Code2 className="h-4 w-4" />
            <span>Launch Code Editor</span>
          </Link>
        </div>
      </div>

      {/* Recent Activities Timeline */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Recent Activity Log
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {progress.activityHistory.length} Activities Logged
          </span>
        </div>

        {progress.activityHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No activity logged yet. Complete a lesson or circuit simulation to start your timeline!
          </div>
        ) : (
          <div className="space-y-3">
            {progress.activityHistory.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    act.type === 'lesson' ? 'bg-blue-500/10 text-blue-400' :
                    act.type === 'coding' ? 'bg-cyan-500/10 text-cyan-400' :
                    act.type === 'quiz' ? 'bg-emerald-500/10 text-emerald-400' :
                    act.type === 'badge' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-violet-500/10 text-violet-400'
                  }`}>
                    {act.type === 'lesson' && <BookOpen className="h-4 w-4" />}
                    {act.type === 'coding' && <Code2 className="h-4 w-4" />}
                    {act.type === 'quiz' && <HelpCircle className="h-4 w-4" />}
                    {act.type === 'badge' && <Award className="h-4 w-4" />}
                    {act.type === 'lab' && <Cpu className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{act.title}</div>
                    <div className="text-[11px] text-slate-400">{act.description}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">+{act.xpEarned} XP</span>
                  <div className="text-[10px] text-slate-400">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

