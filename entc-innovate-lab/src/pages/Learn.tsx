import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Cpu, 
  Activity, 
  Radio, 
  Binary, 
  Gauge, 
  Waveform, 
  Wifi, 
  Award,
  Zap,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { categoriesData, lessonsData } from '../data/lessonsData';
import { Lesson, Category } from '../types';
import { storageService } from '../services/storageService';

interface LearnProps {
  completedLessons: string[];
  onLessonCompleted: (lessonId: string, title: string) => void;
}

export const Learn: React.FC<LearnProps> = ({ 
  completedLessons, 
  onLessonCompleted 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(lessonsData[0]);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredLessons = selectedCategory 
    ? lessonsData.filter(l => l.categoryId === selectedCategory) 
    : lessonsData;

  const currentLessonIndex = activeLesson ? lessonsData.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = currentLessonIndex > 0 ? lessonsData[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessonsData.length - 1 ? lessonsData[currentLessonIndex + 1] : null;

  const isCompleted = activeLesson ? completedLessons.includes(activeLesson.id) : false;

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = () => {
    if (activeLesson && !isCompleted) {
      onLessonCompleted(activeLesson.id, activeLesson.title);
    }
  };

  const handleQuizSubmit = () => {
    if (quizSelectedOption !== null) {
      setQuizSubmitted(true);
      if (activeLesson && quizSelectedOption === activeLesson.knowledgeCheck.correctIndex) {
        handleMarkComplete();
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="rounded-2xl bg-[#0B101E] border border-slate-800 p-6 lg:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            ENTC Structured Learning Modules
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Bridging fundamental electronics theory with hands-on mathematical derivations, schematic models, and industry applications.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === null 
                ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All 8 Branches
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column View: Lesson Reader vs Topic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Topic Navigator (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800">
            <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Curriculum Topics</span>
              <span className="text-xs text-cyan-400 font-mono">{filteredLessons.length} modules</span>
            </h2>

            <div className="space-y-2">
              {filteredLessons.map((lesson) => {
                const done = completedLessons.includes(lesson.id);
                const isSelected = activeLesson?.id === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 group ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/40 text-cyan-200'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {lesson.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.durationMinutes}m</span>
                        {done && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                        )}
                      </div>
                    </div>

                    <h4 className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'group-hover:text-cyan-300'}`}>
                      {lesson.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {lesson.overview}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Complete Interactive Lesson Reader (8 cols on lg) */}
        <div className="lg:col-span-8">
          {activeLesson ? (
            <div className="p-6 sm:p-8 rounded-xl bg-[#0B101E] border border-slate-800 space-y-8 shadow-xl">
              {/* Lesson Top Bar */}
              <div className="border-b border-slate-800 pb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    {activeLesson.difficulty} • {activeLesson.durationMinutes} Minutes
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed (+100 XP)</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleMarkComplete}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mark as Complete</span>
                    </button>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeLesson.overview}
                </p>
              </div>

              {/* Learning Objectives Box */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Key Learning Objectives</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Diagrams & Visual Models */}
              {activeLesson.diagramType === 'logic' && (
                <div className="p-5 rounded-xl bg-[#080D1A] border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Interactive Schematic: Elementary Logic Symbol
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">IEEE Std 91-1984 Symbol</span>
                  </div>

                  {/* SVG Circuit Diagram */}
                  <div className="flex justify-center p-6 bg-slate-950/70 rounded-lg">
                    <svg width="240" height="120" viewBox="0 0 240 120" className="text-cyan-400">
                      {/* Input A */}
                      <line x1="20" y1="40" x2="80" y2="40" stroke="#00F0FF" strokeWidth="3" />
                      <text x="5" y="44" fill="#E2E8F0" fontSize="14" fontFamily="monospace">A</text>
                      
                      {/* Input B */}
                      <line x1="20" y1="80" x2="80" y2="80" stroke="#00F0FF" strokeWidth="3" />
                      <text x="5" y="84" fill="#E2E8F0" fontSize="14" fontFamily="monospace">B</text>

                      {/* AND Gate Body */}
                      <path 
                        d="M 80 20 L 130 20 A 40 40 0 0 1 130 100 L 80 100 Z" 
                        fill="#0A152B" 
                        stroke="#00F0FF" 
                        strokeWidth="3" 
                      />

                      {/* Output Wire */}
                      <line x1="170" y1="60" x2="215" y2="60" stroke="#00F0FF" strokeWidth="3" />
                      <circle cx="215" cy="60" r="4" fill="#00F0FF" />
                      <text x="225" y="65" fill="#E2E8F0" fontSize="14" fontFamily="monospace">Y</text>
                    </svg>
                  </div>
                </div>
              )}

              {activeLesson.diagramType === 'pwm' && (
                <div className="p-5 rounded-xl bg-[#080D1A] border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Oscilloscope Trace: 50% vs 25% Duty Cycle Waveform
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">5.0V Peak / 1 kHz Carrier</span>
                  </div>

                  <div className="flex justify-center p-6 bg-slate-950/70 rounded-lg">
                    <svg width="300" height="100" viewBox="0 0 300 100">
                      {/* Grid lines */}
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                      {/* Square wave */}
                      <path 
                        d="M 10 80 L 10 20 L 70 20 L 70 80 L 130 80 L 130 20 L 190 20 L 190 80 L 250 80 L 250 20 L 290 20" 
                        fill="none" 
                        stroke="#00F0FF" 
                        strokeWidth="2.5" 
                      />
                      <text x="35" y="15" fill="#38BDF8" fontSize="11" fontFamily="monospace">T_ON</text>
                      <text x="95" y="94" fill="#94A3B8" fontSize="11" fontFamily="monospace">T_OFF</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Formulations & Equations */}
              {activeLesson.formulas && activeLesson.formulas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Fundamental Engineering Formulas</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeLesson.formulas.map((form, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-xs font-semibold text-slate-400">{form.label}</span>
                        <div className="text-base font-mono font-bold text-cyan-300 py-1">
                          {form.formula}
                        </div>
                        <p className="text-xs text-slate-400">{form.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Content Sections */}
              <div className="space-y-6">
                {activeLesson.contentSections.map((sec, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{sec.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pl-3.5 border-l border-slate-800">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Worked Engineering Example */}
              {activeLesson.workedExample && (
                <div className="p-5 rounded-xl bg-[#0E1528] border border-blue-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Worked Numerical Example</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg text-xs font-medium text-slate-200">
                    <span className="text-blue-300 font-bold">Problem: </span>
                    {activeLesson.workedExample.problem}
                  </div>
                  <div className="p-3 bg-[#080D1A] rounded-lg text-xs text-slate-300 font-mono whitespace-pre-line">
                    <span className="text-emerald-400 font-bold font-sans">Solution: </span>
                    {activeLesson.workedExample.solution}
                  </div>
                </div>
              )}

              {/* Practical Engineering Applications */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Real-World Industry Applications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activeLesson.practicalApplications.map((app, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge-Check Quiz Mini-Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#101935] to-[#0A0F1E] border border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Lesson Knowledge Check</h3>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                    +100 XP Upon Completion
                  </span>
                </div>

                <p className="text-sm text-slate-200 font-medium">
                  {activeLesson.knowledgeCheck.question}
                </p>

                <div className="space-y-2">
                  {activeLesson.knowledgeCheck.options.map((opt, i) => {
                    const isPicked = quizSelectedOption === i;
                    const isCorrect = i === activeLesson.knowledgeCheck.correctIndex;

                    let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                      } else if (isPicked && !isCorrect) {
                        optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      }
                    } else if (isPicked) {
                      optionStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-200';
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizSubmitted}
                        onClick={() => setQuizSelectedOption(i)}
                        className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        {quizSubmitted && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={quizSelectedOption === null}
                    className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-[#080D1A] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-cyan-400">Explanation: </span>
                    {activeLesson.knowledgeCheck.explanation}
                  </div>
                )}
              </div>

              {/* Prev / Next Lesson Navigation Footer */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                {prevLesson ? (
                  <button
                    onClick={() => handleSelectLesson(prevLesson)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: {prevLesson.title}</span>
                  </button>
                ) : <div />}

                {nextLesson && (
                  <button
                    onClick={() => handleSelectLesson(nextLesson)}
                    className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Next: {nextLesson.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-[#0B101E] border border-slate-800 text-slate-400">
              Select a lesson from the curriculum list to begin studying.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
