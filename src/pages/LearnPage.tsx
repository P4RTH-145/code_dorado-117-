import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Sliders, 
  Filter,
  Cpu,
  Activity,
  Radio,
  Terminal,
  Thermometer,
  Wifi,
  Sparkles
} from 'lucide-react';
import { LESSONS_DATA, CATEGORIES_META } from '../data/lessonsData';
import { SubjectCategory, DifficultyLevel } from '../types';
import { useApp } from '../context/AppContext';

export const LearnPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { progress } = useApp();

  // Category Icon Resolver
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'digital-electronics': return Cpu;
      case 'analog-electronics': return Activity;
      case 'communication-systems': return Radio;
      case 'microcontrollers': return Terminal;
      case 'sensors-instrumentation': return Thermometer;
      case 'signal-processing': return Sliders;
      case 'iot': return Wifi;
      default: return Sparkles;
    }
  };

  const filteredLessons = LESSONS_DATA.filter((lesson) => {
    if (selectedCategory !== 'all' && lesson.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && lesson.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const completedCount = progress.completedLessons.length;
  const totalCount = LESSONS_DATA.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Curriculum & Mastery Modules
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Learn ENTC Engineering
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 8 structured disciplines spanning digital hardware, telecommunications, microcontrollers, and IoT. Each module contains derivations, worked examples, interactive circuit diagrams, and knowledge checks.
            </p>
          </div>

          {/* Overall Curriculum Progress Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">Curriculum Progress</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completedCount} of {totalCount} Completed</span>
              <span className="text-amber-400 font-mono">+{completedCount * 65} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Categories ({LESSONS_DATA.length})
        </button>

        {CATEGORIES_META.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons, formulas, PWM, gates..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-4 w-4 text-cyan-400" />
            <span>Difficulty:</span>
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Lessons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isDone = progress.completedLessons.includes(lesson.id);
          const Icon = getCategoryIcon(lesson.category);

          return (
            <div
              key={lesson.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg group ${
                isDone
                  ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <div className="p-6">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-cyan-400">
                    {lesson.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {lesson.difficulty}
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Lesson Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {lesson.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {lesson.description}
                </p>

                {/* Key Objectives Preview */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-300">Key Takeaways:</div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    {lesson.learningObjectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span className="line-clamp-1">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.durationMinutes} mins
                  </span>
                  <span className="text-amber-400 font-mono font-bold">
                    +{lesson.xpReward} XP
                  </span>
                </div>

                <Link
                  to={`/learn/${lesson.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  <span>{isDone ? 'Review' : 'Start Lesson'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

