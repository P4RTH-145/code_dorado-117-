import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Zap, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Calculator,
  Compass
} from 'lucide-react';
import { LESSONS_DATA } from '../data/lessonsData';
import { useApp } from '../context/AppContext';

export const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, completeLesson } = useApp();

  const lessonIndex = LESSONS_DATA.findIndex(l => l.id === lessonId);
  const lesson = LESSONS_DATA[lessonIndex] || LESSONS_DATA[0];

  const prevLesson = lessonIndex > 0 ? LESSONS_DATA[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < LESSONS_DATA.length - 1 ? LESSONS_DATA[lessonIndex + 1] : null;

  const isCompleted = progress.completedLessons.includes(lesson.id);

  // Quick Quiz State
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered) return;
    setQuizSelected(idx);
    setQuizAnswered(true);
  };

  const handleMarkCompleted = () => {
    completeLesson(lesson.id, lesson.title, lesson.xpReward);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/learn"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Curriculum</span>
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed</span>
            </span>
          ) : (
            <button
              onClick={handleMarkCompleted}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark as Completed (+{lesson.xpReward} XP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Lesson Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            {lesson.categoryLabel}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
            {lesson.difficulty}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {lesson.durationMinutes} mins
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold ml-auto">
            +{lesson.xpReward} XP
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          {lesson.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {lesson.description}
        </p>
      </div>

      {/* Learning Objectives Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Compass className="h-4 w-4 text-cyan-400" />
          <span>Core Learning Objectives</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.learningObjectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0">
                {i + 1}
              </span>
              <span className="leading-relaxed">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Explanation Section */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <span>Concept Explanation & Physics</span>
        </h3>

        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-4">
          {lesson.conceptExplanation}
        </div>

        {/* Formula Showcase Callout */}
        {lesson.formula && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-950 to-blue-950/40 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
              <Calculator className="h-4 w-4" />
              <span>Mathematical Formula & Definition:</span>
            </div>
            {lesson.formula.latex && (
              <div className="text-base font-mono font-bold text-cyan-200 py-1">
                {lesson.formula.latex}
              </div>
            )}
            <p className="text-xs text-slate-300 font-sans mt-1">
              {lesson.formula.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Worked Example Section */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>Worked Engineering Example: {lesson.workedExample.title}</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-1">
          <strong className="text-cyan-400 block mb-1">Problem Statement:</strong>
          <p className="leading-relaxed">{lesson.workedExample.problem}</p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-300">Step-by-Step Solution:</div>
          {lesson.workedExample.solutionSteps.map((step, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300 font-mono">
          Final Engineering Result: {lesson.workedExample.result}
        </div>
      </div>

      {/* Practical Applications */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span>Real-World Industrial Applications</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {lesson.practicalApplications.map((app, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
              <span>{app}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Short Knowledge Check Quiz */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Knowledge-Check Quiz</h3>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold">+20 XP</span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-4">
          {lesson.quickQuiz.question}
        </p>

        <div className="space-y-2.5 mb-4">
          {lesson.quickQuiz.options.map((opt, idx) => {
            const isSelected = quizSelected === idx;
            const isCorrect = idx === lesson.quickQuiz.correctIndex;

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
            if (quizAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(idx)}
                disabled={quizAnswered}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {quizAnswered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {quizAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 animate-in fade-in">
            <strong className="text-cyan-400 block">Explanation:</strong>
            <p>{lesson.quickQuiz.explanation}</p>
          </div>
        )}
      </div>

      {/* Bottom Prev / Next Navigation Row */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {prevLesson ? (
          <Link
            to={`/learn/${prevLesson.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev: {prevLesson.title}</span>
          </Link>
        ) : <div />}

        {!isCompleted && (
          <button
            onClick={handleMarkCompleted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
          >
            Complete Lesson (+{lesson.xpReward} XP)
          </button>
        )}

        {nextLesson ? (
          <Link
            to={`/learn/${nextLesson.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
          >
            <span>Next: {nextLesson.title}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};
