import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles,
  HelpCircle,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GateType } from '../circuit/LogicGateSimulator';

interface GateChallenge {
  gate: GateType;
  inputA: number;
  inputB: number;
  expectedOutput: number;
}

const ALL_GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

function calculateGateOutput(gate: GateType, a: number, b: number): number {
  switch (gate) {
    case 'AND': return a === 1 && b === 1 ? 1 : 0;
    case 'OR': return a === 1 || b === 1 ? 1 : 0;
    case 'NOT': return a === 1 ? 0 : 1;
    case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
    case 'NOR': return !(a === 1 || b === 1) ? 1 : 0;
    case 'XOR': return a !== b ? 1 : 0;
    case 'XNOR': return a === b ? 1 : 0;
    default: return 0;
  }
}

function generateRandomChallenge(): GateChallenge {
  const gate = ALL_GATES[Math.floor(Math.random() * ALL_GATES.length)];
  const inputA = Math.random() > 0.5 ? 1 : 0;
  const inputB = Math.random() > 0.5 ? 1 : 0;
  const expectedOutput = calculateGateOutput(gate, inputA, inputB);
  return { gate, inputA, inputB, expectedOutput };
}

export const LogicGateMiniGame: React.FC = () => {
  const [challenge, setChallenge] = useState<GateChallenge>(() => generateRandomChallenge());
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; predicted: number; expected: number } | null>(null);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const { completeExperiment, triggerConfetti } = useApp();

  const handlePredict = (predictedValue: number) => {
    const isCorrect = predictedValue === challenge.expectedOutput;
    setTotalAnswered(prev => prev + 1);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 10 * Math.max(1, Math.min(3, newStreak)));
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak % 5 === 0) {
        triggerConfetti();
        completeExperiment('game-streak-5', `Gate Master ${newStreak} Streak`, 40);
      }
    } else {
      setStreak(0);
    }

    setLastResult({
      isCorrect,
      predicted: predictedValue,
      expected: challenge.expectedOutput
    });

    // Prepare next question after brief feedback
    setTimeout(() => {
      setChallenge(generateRandomChallenge());
      setLastResult(null);
    }, 1200);
  };

  const handleReset = () => {
    setStreak(0);
    setScore(0);
    setTotalAnswered(0);
    setLastResult(null);
    setChallenge(generateRandomChallenge());
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-cyan-500/30 p-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Gate Master — Quick Prediction Mini-Game
            </h3>
            <p className="text-xs text-slate-400">
              Predict the digital output (0 or 1) before time expires!
            </p>
          </div>
        </div>

        {/* Streaks & Score Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
            <Flame className="h-4 w-4 fill-orange-500" />
            <span>Streak: {streak} (Best: {bestStreak})</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Award className="h-4 w-4 text-cyan-400" />
            <span>Score: {score}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center Challenge Arena */}
      <div className="py-8 flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          Solve the Logic Gate:
        </div>

        {/* Gate Name Badge */}
        <div className="text-4xl font-black font-mono tracking-tight text-white mb-6">
          {challenge.gate} GATE
        </div>

        {/* Inputs Display Cards */}
        <div className="flex items-center justify-center gap-6 mb-8 w-full">
          <div className="flex-1 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
            <span className="text-xs text-slate-400 mb-1">Input A</span>
            <span className={`text-3xl font-mono font-bold ${challenge.inputA === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
              {challenge.inputA}
            </span>
          </div>

          {challenge.gate !== 'NOT' && (
            <div className="flex-1 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">Input B</span>
              <span className={`text-3xl font-mono font-bold ${challenge.inputB === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
                {challenge.inputB}
              </span>
            </div>
          )}
        </div>

        {/* Feedback Alert if just answered */}
        {lastResult && (
          <div className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in zoom-in duration-200 ${
            lastResult.isCorrect
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}>
            {lastResult.isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>EXCELLENT! Correct output is {lastResult.expected} (+10 XP)</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>INCORRECT! Correct output was {lastResult.expected}</span>
              </>
            )}
          </div>
        )}

        {/* Binary Guess Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={() => handlePredict(0)}
            disabled={lastResult !== null}
            className="py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-500 text-slate-200 font-mono text-2xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            Predict 0
          </button>

          <button
            onClick={() => handlePredict(1)}
            disabled={lastResult !== null}
            className="py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-2xl font-bold transition-all shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            Predict 1
          </button>
        </div>
      </div>
    </div>
  );
};
