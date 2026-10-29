import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  Award, 
  BookOpen, 
  Cpu, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Play, 
  Clock, 
  Code2, 
  HelpCircle,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  StudentStats, 
  StudentProfile, 
  Achievement, 
  RecentActivity 
} from '../types';
import { 
  defaultWeeklyActivity, 
  defaultSubjectProgress 
} from '../data/defaultState';
import { lessonsData } from '../data/lessonsData';

interface DashboardProps {
  stats: StudentStats;
  profile: StudentProfile;
  achievements: Achievement[];
  recentActivity: RecentActivity[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  profile,
  achievements,
  recentActivity
}) => {
  const unlockedBadgesCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Welcome & Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1427] via-[#0E1A36] to-[#0A1224] border border-cyan-500/20 p-6 lg:p-8 shadow-xl shadow-cyan-950/20">
        {/* Decorative Circuit Glow Overlay */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Welcome Back to the Innovation Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {profile.name} 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your hardware telemetry is operational. You are on a <span className="text-amber-400 font-bold">{stats.streakDays}-day streak</span>! Ready to experiment in the Virtual Circuit Lab or solve today's embedded firmware challenge?
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/virtual-lab"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Lab</span>
            </Link>

            <Link
              to="/ai-tutor"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all hover:scale-102 active:scale-98"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Tutor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total XP */}
        <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 hover:border-cyan-500/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning XP</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{stats.xp.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">Level {stats.level}</span> Engineer
          </p>
        </div>

        {/* Lessons Completed */}
        <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 hover:border-blue-500/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lessons Done</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{stats.lessonsCompleted}</div>
          <p className="text-xs text-slate-400 mt-1">Across 8 ENTC branches</p>
        </div>

        {/* Average Quiz Score */}
        <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{stats.averageQuizScore}%</div>
          <p className="text-xs text-slate-400 mt-1">{stats.quizzesCompleted} quizzes evaluated</p>
        </div>

        {/* Virtual Lab Experiments */}
        <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 hover:border-violet-500/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experiments</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{stats.experimentsCompleted}</div>
          <p className="text-xs text-slate-400 mt-1">Logic & IoT simulators</p>
        </div>
      </div>

      {/* 3. Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Weekly Learning Activity</h2>
              <p className="text-xs text-slate-400">XP points earned over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-300">XP Velocity</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultWeeklyActivity}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '12px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#00F0FF" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#xpGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-wise Progress Chart */}
        <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Curriculum Progress</h2>
              <Link to="/learn" className="text-xs text-cyan-400 hover:underline">View All</Link>
            </div>
            <p className="text-xs text-slate-400 mb-4">Subject completion rates</p>

            <div className="space-y-4">
              {defaultSubjectProgress.map((subject) => (
                <div key={subject.code} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate max-w-[170px]">{subject.subject}</span>
                    <span className="text-slate-400 font-mono font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Degree Track</span>
            <span className="text-cyan-400 font-bold font-mono">48.2% Completed</span>
          </div>
        </div>
      </div>

      {/* 4. Daily Challenge & Recommended Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Engineering Challenge Card */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#101935] via-[#0E152B] to-[#0A0F1F] border border-amber-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-24 h-24 text-amber-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>Daily Challenge</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              Toggle LED State with Bitwise XOR
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Write a safe microcontroller firmware function that toggles a GPIO output pin state without conditional branching.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">+50 XP</span>
              <span>• Beginner</span>
              <span>• 5 mins</span>
            </div>

            <div className="pt-2">
              <Link
                to="/coding"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Solve in Arena</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Lessons */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recommended Engineering Lessons</h2>
              <p className="text-xs text-slate-400">Tailored to your current semester study schedule</p>
            </div>
            <Link to="/learn" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              <span>All Lessons</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lessonsData.slice(0, 2).map((lesson) => (
              <div 
                key={lesson.id}
                className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                      {lesson.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes}m
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {lesson.overview}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                  <Link
                    to="/learn"
                    className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  >
                    <span>Study</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity & Badges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 shadow-lg">
          <h2 className="text-base font-bold text-white mb-1">Recent Student Activity</h2>
          <p className="text-xs text-slate-400 mb-4">Latest experiments, quizzes, and firmware commits</p>

          <div className="divide-y divide-slate-800/60">
            {recentActivity.slice(0, 4).map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 shrink-0">
                    {act.category === 'coding' && <Code2 className="w-4 h-4" />}
                    {act.category === 'lesson' && <BookOpen className="w-4 h-4" />}
                    {act.category === 'circuit' && <Cpu className="w-4 h-4" />}
                    {act.category === 'quiz' && <HelpCircle className="w-4 h-4" />}
                    {act.category === 'iot' && <Radio className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{act.title}</p>
                    <p className="text-xs text-slate-500">{act.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    +{act.xpEarned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Preview */}
        <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-white">Engineering Badges</h2>
              <span className="text-xs font-mono text-cyan-400">{unlockedBadgesCount}/{achievements.length} Unlocked</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Milestones earned through simulation mastery</p>

            <div className="grid grid-cols-3 gap-3">
              {achievements.slice(0, 6).map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                    badge.unlocked 
                      ? 'bg-slate-900/60 border-cyan-500/30 text-cyan-300' 
                      : 'bg-slate-900/20 border-slate-800/60 text-slate-600 opacity-60'
                  }`}
                  title={badge.description}
                >
                  <div className={`p-2 rounded-lg mb-1.5 ${
                    badge.unlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-600'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold line-clamp-1">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 text-center">
            <Link 
              to="/progress"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
            >
              <span>View Full Achievements Tree</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
