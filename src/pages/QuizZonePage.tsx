import React, { useState } from 'react';
import { HelpCircle, Zap, Award } from 'lucide-react';
import { QuizPlayer } from '../components/quizzes/QuizPlayer';
import { LogicGateMiniGame } from '../components/quizzes/LogicGateMiniGame';
import { useApp } from '../context/AppContext';

export const QuizZonePage: React.FC = () => {
  const { customQuizzes } = useApp();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'minigame'>('quizzes');

  const totalQuestions = 16 + (customQuizzes?.length || 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Knowledge Evaluation & Gamification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Quiz Zone & Mini-Games
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Test your knowledge across digital systems, wireless communications, microcontrollers, and signal processing. Play the Gate Master prediction game to sharpen your intuition!
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quizzes'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Subject Mastery Quizzes ({totalQuestions} Questions)</span>
        </button>

        <button
          onClick={() => setActiveTab('minigame')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'minigame'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Gate Master Mini-Game (Prediction Challenge)</span>
        </button>
      </div>

      {activeTab === 'quizzes' ? <QuizPlayer /> : <LogicGateMiniGame />}
    </div>
  );
};

