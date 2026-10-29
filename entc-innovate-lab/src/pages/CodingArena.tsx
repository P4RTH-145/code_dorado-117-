import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Award, 
  Code2, 
  ChevronRight, 
  Lightbulb, 
  Play, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { CodeEditor } from '../components/common/CodeEditor';
import { challengesData } from '../data/challengesData';
import { CodingChallenge, TestCase } from '../types';
import { evaluateStudentCode, EvaluationResult } from '../services/codeEvaluator';

interface CodingArenaProps {
  completedChallenges: string[];
  onChallengeCompleted: (challengeId: string, title: string, points: number) => void;
}

export const CodingArena: React.FC<CodingArenaProps> = ({
  completedChallenges,
  onChallengeCompleted
}) => {
  const [activeChallenge, setActiveChallenge] = useState<CodingChallenge>(challengesData[0]);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [showSolution, setShowSolution] = useState(false);

  const isSolved = completedChallenges.includes(activeChallenge.id);

  const handleSelectChallenge = (c: CodingChallenge) => {
    setActiveChallenge(c);
    setEvalResult(null);
    setShowHintIndex(-1);
    setShowSolution(false);
  };

  const handleRunEvaluation = (submittedCode: string) => {
    setIsEvaluating(true);
    setTimeout(() => {
      const result = evaluateStudentCode(
        activeChallenge.functionName,
        submittedCode,
        activeChallenge.testCases
      );
      setEvalResult(result);
      setIsEvaluating(false);

      if (result.allPassed && !isSolved) {
        onChallengeCompleted(activeChallenge.id, activeChallenge.title, activeChallenge.points);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#0B101E] border border-slate-800 p-6 lg:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Firmware Challenge Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Embedded & Logic Algorithm Practice
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Write and test realistic embedded C / JavaScript routines for debouncing, sensor scaling, thermal thresholds, and hardware gates against automated verification suites.
          </p>
        </div>

        {/* Challenge Selection Carousel */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
          {challengesData.map((c) => {
            const done = completedChallenges.includes(c.id);
            const isSelected = activeChallenge.id === c.id;

            return (
              <button
                key={c.id}
                onClick={() => handleSelectChallenge(c)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-xs shadow-cyan-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    c.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {c.difficulty}
                  </span>
                  {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-xs font-bold line-clamp-1">{c.title}</span>
                <span className="text-[10px] font-mono text-cyan-400">+{c.points} XP</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column View: Problem & Tests vs Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement & Test Suite (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Problem Spec */}
          <div className="p-6 rounded-xl bg-[#0B101E] border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {activeChallenge.category}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{activeChallenge.title}</h2>
              </div>

              {isSolved ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                  +{activeChallenge.points} XP
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {activeChallenge.problemStatement}
            </p>

            {/* Hints Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Engineering Hints</span>
                </span>
                <button
                  onClick={() => setShowHintIndex(prev => Math.min(prev + 1, activeChallenge.hints.length - 1))}
                  className="text-xs text-cyan-400 hover:underline font-semibold"
                >
                  {showHintIndex < activeChallenge.hints.length - 1 ? 'Reveal Hint' : 'All Hints Shown'}
                </button>
              </div>

              {showHintIndex >= 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {activeChallenge.hints.slice(0, showHintIndex + 1).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-amber-400 font-bold">{i + 1}.</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  Click 'Reveal Hint' if you need a conceptual nudge.
                </p>
              )}
            </div>

            {/* Solution Explanation Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>{showSolution ? 'Hide Solution Notes' : 'View Theoretical Solution Notes'}</span>
              </button>

              {showSolution && (
                <div className="mt-2 p-3 rounded-lg bg-[#080D1A] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-bold">Approach: </span>
                  {activeChallenge.solutionExplanation}
                </div>
              )}
            </div>
          </div>

          {/* Test Case Execution Results Panel */}
          <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Verification Suite</span>
                {evalResult && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    evalResult.allPassed 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {evalResult.allPassed ? 'ALL TEST CASES PASSED' : 'SOME TESTS FAILED'}
                  </span>
                )}
              </h3>
            </div>

            {evalResult?.error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="font-mono">{evalResult.error}</span>
              </div>
            )}

            <div className="space-y-2">
              {(evalResult ? evalResult.testCases : activeChallenge.testCases).map((tc) => (
                <div
                  key={tc.id}
                  className={`p-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                    tc.passed === true
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : tc.passed === false
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tc.passed === true && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {tc.passed === false && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {tc.passed === undefined && <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />}
                    <div>
                      <span className="font-semibold text-slate-200">{tc.name}</span>
                      <div className="text-[10px] text-slate-500">
                        Input: {JSON.stringify(tc.input)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-300">
                      Expected: {JSON.stringify(tc.expected)}
                    </span>
                    {tc.actual !== undefined && (
                      <div className={`text-[10px] ${tc.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Actual: {JSON.stringify(tc.actual)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor Component (7 cols) */}
        <div className="lg:col-span-7 h-[540px]">
          <CodeEditor
            initialCode={activeChallenge.starterCode}
            onRun={handleRunEvaluation}
            isRunning={isEvaluating}
            language="javascript"
          />
        </div>
      </div>
    </div>
  );
};
