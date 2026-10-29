import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Clock, 
  Award, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  ChevronRight, 
  Gamepad2, 
  CheckCircle2, 
  Filter, 
  Trophy,
  Zap
} from 'lucide-react';
import { quizzesData } from '../data/quizzesData';
import { QuizQuestion, GateType } from '../types';
import { storageService, triggerConfetti } from '../services/storageService';

interface QuizZoneProps {
  onQuizCompleted: (subject: string, score: number, total: number, xp: number) => void;
}

export const QuizZone: React.FC<QuizZoneProps> = ({ onQuizCompleted }) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'minigame'>('assessment');

  // --- Quiz Assessment State ---
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('entc_best_quiz_score') || '0', 10);
  });

  // Filtered Questions
  const filteredQuestions: QuizQuestion[] = quizzesData.filter(q => {
    const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchSubject && matchDiff;
  });

  const activeQuestion = filteredQuestions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (!isTimed || quizFinished || filteredQuestions.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimed, quizFinished, filteredQuestions]);

  const handleSelectAnswer = (optionIdx: number) => {
    if (quizFinished) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    let correctCount = 0;
    filteredQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / filteredQuestions.length) * 100);
    if (percent > bestScore) {
      setBestScore(percent);
      localStorage.setItem('entc_best_quiz_score', percent.toString());
    }

    const xpEarned = correctCount * 25;
    onQuizCompleted(selectedSubject, correctCount, filteredQuestions.length, xpEarned);
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setQuizFinished(false);
    setTimeLeft(300);
  };

  // --- Logic Gate Mini-Game State ---
  const miniGates: GateType[] = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'];
  const [mgGate, setMgGate] = useState<GateType>('XOR');
  const [mgA, setMgA] = useState<number>(1);
  const [mgB, setMgB] = useState<number>(0);
  const [mgGuess, setMgGuess] = useState<number | null>(null);
  const [mgRevealed, setMgRevealed] = useState<boolean>(false);
  const [mgStreak, setMgStreak] = useState<number>(0);
  const [mgHighStreak, setMgHighStreak] = useState<number>(0);

  const calculateMgActual = (): number => {
    switch (mgGate) {
      case 'AND': return (mgA && mgB) ? 1 : 0;
      case 'OR': return (mgA || mgB) ? 1 : 0;
      case 'NAND': return !(mgA && mgB) ? 1 : 0;
      case 'NOR': return !(mgA || mgB) ? 1 : 0;
      case 'XOR': return (mgA !== mgB) ? 1 : 0;
      case 'XNOR': return (mgA === mgB) ? 1 : 0;
      default: return 0;
    }
  };

  const handleMgSubmitGuess = (guess: number) => {
    if (mgRevealed) return;
    setMgGuess(guess);
    setMgRevealed(true);

    const actual = calculateMgActual();
    if (guess === actual) {
      const newStreak = mgStreak + 1;
      setMgStreak(newStreak);
      if (newStreak > mgHighStreak) setMgHighStreak(newStreak);
      storageService.addXP(25, `Predicted ${mgGate} output correctly`, 'quiz');
      triggerConfetti();
    } else {
      setMgStreak(0);
    }
  };

  const handleMgNextRound = () => {
    const randomGate = miniGates[Math.floor(Math.random() * miniGates.length)];
    const randomA = Math.random() > 0.5 ? 1 : 0;
    const randomB = Math.random() > 0.5 ? 1 : 0;
    setMgGate(randomGate);
    setMgA(randomA);
    setMgB(randomB);
    setMgGuess(null);
    setMgRevealed(false);
  };

  // Subjects for filter
  const subjects = ['All', 'Digital Electronics', 'Communication Systems', 'Embedded Systems', 'Sensors & Instrumentation', 'Signal Processing'];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-[#0B101E] border border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'assessment'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Curriculum Assessments ({quizzesData.length} Questions)</span>
        </button>

        <button
          onClick={() => setActiveTab('minigame')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'minigame'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Logic Gate Output Predictor Mini-Game</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CURRICULUM QUIZ ASSESSMENT                         */}
      {/* ========================================================= */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {/* Quiz Controls & Filters Bar */}
          <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Subject:</span>
              </span>
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSubject(s);
                    handleRestartQuiz();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedSubject === s 
                      ? 'bg-cyan-500 text-slate-950 font-bold' 
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Timed Mode Toggle & Best Score */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Best: {bestScore}%</span>
              </div>

              <button
                onClick={() => setIsTimed(!isTimed)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isTimed 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{isTimed ? `Timer: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : 'Untimed'}</span>
              </button>
            </div>
          </div>

          {!quizFinished && activeQuestion ? (
            /* Active Question Card */
            <div className="p-6 sm:p-8 rounded-xl bg-[#0B101E] border border-slate-800 space-y-6 shadow-xl">
              {/* Progress & Meta */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                    Question {currentIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    • {activeQuestion.subject}
                  </span>
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  activeQuestion.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {activeQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {activeQuestion.question}
              </h2>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentIndex] === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-xs shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {userAnswers[currentIndex] !== undefined ? 'Answer Selected' : 'Select an option to proceed'}
                </span>

                <button
                  onClick={handleNextQuestion}
                  disabled={userAnswers[currentIndex] === undefined}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-40"
                >
                  <span>{currentIndex === filteredQuestions.length - 1 ? 'Submit & Grade Quiz' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : quizFinished ? (
            /* Quiz Completed Results & Review Panel */
            <div className="p-8 rounded-xl bg-[#0B101E] border border-slate-800 text-center space-y-6 shadow-xl">
              {(() => {
                let correct = 0;
                filteredQuestions.forEach((q, idx) => {
                  if (userAnswers[idx] === q.correctIndex) correct += 1;
                });
                const percentage = Math.round((correct / filteredQuestions.length) * 100);

                return (
                  <>
                    <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-2">
                      <Award className="w-12 h-12" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Assessment Complete!</h2>
                      <p className="text-sm text-slate-400">Here is your verified evaluation score</p>
                    </div>

                    <div className="flex justify-center gap-8 py-4">
                      <div>
                        <div className="text-4xl font-extrabold text-cyan-400 font-mono">{percentage}%</div>
                        <span className="text-xs text-slate-400">Score</span>
                      </div>
                      <div>
                        <div className="text-4xl font-extrabold text-emerald-400 font-mono">{correct} / {filteredQuestions.length}</div>
                        <span className="text-xs text-slate-400">Correct Answers</span>
                      </div>
                      <div>
                        <div className="text-4xl font-extrabold text-amber-400 font-mono">+{correct * 25}</div>
                        <span className="text-xs text-slate-400">XP Awarded</span>
                      </div>
                    </div>

                    {/* Detailed Review Section */}
                    <div className="text-left mt-8 space-y-4 pt-6 border-t border-slate-800">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Question Review & Technical Explanations
                      </h3>

                      <div className="space-y-3">
                        {filteredQuestions.map((q, idx) => {
                          const userAns = userAnswers[idx];
                          const isCorrect = userAns === q.correctIndex;

                          return (
                            <div key={q.id} className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-white">
                                  {idx + 1}. {q.question}
                                </span>
                                {isCorrect ? (
                                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 shrink-0">
                                    <Check className="w-4 h-4" /> Correct
                                  </span>
                                ) : (
                                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 shrink-0">
                                    <X className="w-4 h-4" /> Incorrect
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-slate-300">
                                <span className="text-slate-400">Correct Answer: </span>
                                <span className="text-emerald-400 font-semibold">{q.options[q.correctIndex]}</span>
                              </div>

                              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                                <span className="font-bold text-cyan-400">Technical Note: </span>
                                {q.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleRestartQuiz}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Assessment</span>
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-[#0B101E] border border-slate-800 text-slate-400">
              No questions found for the selected subject filter.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LOGIC GATE MINI-GAME                               */}
      {/* ========================================================= */}
      {activeTab === 'minigame' && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#0B101E] border border-slate-800 space-y-6 shadow-xl max-w-2xl mx-auto text-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Logic Gate Fast Predictor</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Can you guess the output?</h2>
            <p className="text-xs text-slate-400">Predict before revealing the electronic gate state</p>
          </div>

          {/* Current Streak Counter */}
          <div className="flex justify-center gap-6 py-2">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Current Streak</span>
              <div className="text-xl font-bold font-mono text-cyan-400">🔥 {mgStreak}</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Best Record</span>
              <div className="text-xl font-bold font-mono text-amber-400">🏆 {mgHighStreak}</div>
            </div>
          </div>

          {/* Gate Card Display */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-[#0A1224] to-slate-950 border border-cyan-500/30 space-y-4">
            <div className="text-sm font-bold text-slate-400 uppercase font-mono">
              GATE TYPE: <span className="text-cyan-400 text-xl font-extrabold">{mgGate}</span>
            </div>

            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <span className="text-xs text-slate-400 font-mono">IN A</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-300">{mgA}</div>
              </div>

              <div className="text-2xl text-slate-600 font-bold">+</div>

              <div className="text-center">
                <span className="text-xs text-slate-400 font-mono">IN B</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-300">{mgB}</div>
              </div>
            </div>

            {/* Revealed Result or Question Mark */}
            <div className="py-2">
              {mgRevealed ? (
                <div className="space-y-2">
                  <div className={`text-4xl font-extrabold font-mono ${
                    mgGuess === calculateMgActual() ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    OUTPUT: {calculateMgActual()}
                  </div>
                  <div className="text-xs font-semibold">
                    {mgGuess === calculateMgActual() ? '🎉 Correct! +25 XP' : '❌ Incorrect prediction'}
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-bold text-slate-600 font-mono">?</div>
              )}
            </div>
          </div>

          {/* Prediction Choice Buttons */}
          {!mgRevealed ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleMgSubmitGuess(0)}
                className="py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono font-extrabold text-lg transition-all active:scale-95"
              >
                PREDICT 0 (LOW)
              </button>
              <button
                onClick={() => handleMgSubmitGuess(1)}
                className="py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-lg shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                PREDICT 1 (HIGH)
              </button>
            </div>
          ) : (
            <button
              onClick={handleMgNextRound}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Next Round →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
