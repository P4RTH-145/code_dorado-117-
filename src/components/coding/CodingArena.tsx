import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Lightbulb, 
  Sparkles, 
  Award, 
  Code2, 
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { CODING_CHALLENGES } from '../../data/challengesData';
import { CodingChallenge } from '../../types';
import { codeRunnerService, ExecutionReport } from '../../services/codeRunnerService';
import { useApp } from '../../context/AppContext';

export const CodingArena: React.FC = () => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(CODING_CHALLENGES[0].id);
  const [code, setCode] = useState<string>(CODING_CHALLENGES[0].starterCode);
  const [report, setReport] = useState<ExecutionReport | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { solveChallenge, progress } = useApp();

  const challenge = CODING_CHALLENGES.find(c => c.id === selectedChallengeId) || CODING_CHALLENGES[0];
  const isCompleted = progress.completedChallenges.includes(challenge.id);

  const handleSelectChallenge = (c: CodingChallenge) => {
    setSelectedChallengeId(c.id);
    setCode(c.starterCode);
    setReport(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setReport(null);

    setTimeout(() => {
      const result = codeRunnerService.evaluateChallenge(challenge, code);
      setReport(result);
      setIsRunning(false);

      if (result.success) {
        solveChallenge(challenge.id, challenge.title, challenge.xpReward);
      }
    }, 400);
  };

  const handleResetCode = () => {
    setCode(challenge.starterCode);
    setReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Challenges Horizontal Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CODING_CHALLENGES.map((ch, idx) => {
          const isDone = progress.completedChallenges.includes(ch.id);
          const isSelected = ch.id === challenge.id;

          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  Level {idx + 1}
                </span>
                {isDone && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Solved
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-white truncate">{ch.title}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>{ch.difficulty}</span>
                <span className="text-amber-400 font-mono">+{ch.xpReward} XP</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Coding Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement & Instructions */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                {challenge.category}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Reward: {challenge.xpReward} XP
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {challenge.description}
            </p>

            {/* Problem Statement Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 mb-4">
              <div className="font-bold text-slate-200">Problem Specifications:</div>
              <div className="whitespace-pre-line leading-relaxed text-slate-300 font-sans">
                {challenge.problemStatement}
              </div>
            </div>

            {/* Test Case Inputs Preview */}
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-300 mb-2">Test Scenarios Preview:</div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {challenge.testCases.slice(0, 3).map((tc, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">{tc.inputDescription}</span>
                    <span className="text-cyan-400 font-bold">Expects: {JSON.stringify(tc.expected)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints & Solution Toggle */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{showSolution ? 'Hide Solution' : 'Reveal Solution'}</span>
                </button>
              </div>

              {showHint && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in">
                  <strong className="block mb-1 text-amber-300">Engineering Hint:</strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {challenge.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {showSolution && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 animate-in fade-in overflow-x-auto">
                  <pre>{challenge.solutionCode}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Code Editor & Evaluation Terminal */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden flex flex-col flex-1">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>embedded_firmware.js</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Reset code to template"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>{isRunning ? 'Evaluating...' : 'Run & Submit Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor Textarea with Syntax aesthetic */}
            <div className="relative flex-1 min-h-[300px] bg-slate-950 p-4 font-mono text-xs sm:text-sm text-cyan-100">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[280px] bg-transparent outline-none resize-none font-mono text-xs sm:text-sm text-cyan-200 leading-relaxed"
                placeholder="// Write your embedded logic function here..."
              />
            </div>

            {/* Test Execution & Output Results Console */}
            <div className="border-t border-slate-800 bg-slate-900/90 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span>Evaluation Console</span>
                </div>
                {report && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Executed in {report.executionTimeMs} ms
                  </span>
                )}
              </div>

              {!report && (
                <div className="text-xs text-slate-400 font-mono py-2">
                  Click <strong className="text-cyan-400">Run & Submit Code</strong> to execute your function against the verification test suite.
                </div>
              )}

              {report && (
                <div className="space-y-3">
                  {/* Summary Bar */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    report.success
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {report.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <span>
                        {report.success
                          ? `ALL TESTS PASSED! (+${challenge.xpReward} XP Awarded)`
                          : `FAILED: ${report.passedCount}/${report.totalCount} Test Cases Passed`}
                      </span>
                    </div>
                  </div>

                  {/* Individual Test Cases Results */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px]">
                    {report.testResults.map((tr) => (
                      <div
                        key={tr.index}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          tr.passed
                            ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                            : 'bg-rose-950/30 border-rose-800 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {tr.passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-rose-400" />
                          )}
                          <span>{tr.inputDescription}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400">Actual: </span>
                          <span className={tr.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {JSON.stringify(tr.actual)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {report.errorMessage && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs">
                      {report.errorMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
