import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  Zap, 
  Filter,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizzesData';
import { QuizQuestion, SubjectCategory, DifficultyLevel } from '../../types';
import { useApp } from '../../context/AppContext';

export const QuizPlayer: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isTimed, setIsTimed] = useState<boolean>(true);

  // Active quiz session state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30 seconds per question

  const { recordQuizScore, progress, customQuizzes } = useApp();

  const allQuestions = [...QUIZ_QUESTIONS, ...(customQuizzes || [])];

  // Filter questions based on selection
  const filteredPool = allQuestions.filter((q) => {
    if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const startQuiz = () => {
    const questions = filteredPool.length > 0 ? filteredPool : allQuestions;
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setTimeLeft(30);
  };

  useEffect(() => {
    startQuiz();
  }, [selectedSubject, selectedDifficulty]);

  // Timer countdown
  useEffect(() => {
    if (!isTimed || quizFinished || isAnswerSubmitted) return;

    if (timeLeft <= 0) {
      // Auto-submit incorrect when timer runs out
      handleSubmitAnswer(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimed, timeLeft, isAnswerSubmitted, quizFinished]);

  const currentQuestion = activeQuestions[currentIndex];

  const handleSubmitAnswer = (chosenIndex: number) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setSelectedOption(chosenIndex);
    setIsAnswerSubmitted(true);

    const isCorrect = chosenIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: chosenIndex,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
    } else {
      // Finished Quiz
      setQuizFinished(true);
      const finalScore = score + (selectedOption === currentQuestion.correctIndex ? 0 : 0);
      const totalXp = finalScore * 25;
      const quizId = `quiz-${selectedSubject}-${selectedDifficulty}`;
      recordQuizScore(
        quizId,
        `${selectedSubject === 'all' ? 'All Subjects' : selectedSubject} Quiz`,
        score,
        activeQuestions.length,
        totalXp
      );
    }
  };

  const scorePercentage = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Controls & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-4 w-4 text-cyan-400" />
            <span>Filter Subject:</span>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All ENTC Subjects ({QUIZ_QUESTIONS.length})</option>
            <option value="digital-electronics">Digital Electronics</option>
            <option value="communication-systems">Communication Systems</option>
            <option value="microcontrollers">Microcontrollers & Embedded</option>
            <option value="sensors-instrumentation">Sensors & Instrumentation</option>
            <option value="signal-processing">Digital Signal Processing</option>
            <option value="iot">Internet of Things (IoT)</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Timed Mode Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
            <input
              type="checkbox"
              checked={isTimed}
              onChange={(e) => setIsTimed(e.target.checked)}
              className="accent-cyan-400 h-4 w-4 rounded"
            />
            <span className="flex items-center gap-1">
              <Timer className="h-4 w-4 text-cyan-400" />
              Timed Mode (30s)
            </span>
          </label>

          <button
            onClick={startQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Main Quiz Presentation */}
      {!quizFinished && currentQuestion ? (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          {/* Progress Bar & Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>
              Question <strong className="text-white">{currentIndex + 1}</strong> of{' '}
              <strong className="text-white">{activeQuestions.length}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                {currentQuestion.subjectLabel}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Timed countdown indicator bar */}
          {isTimed && !isAnswerSubmitted && (
            <div className="mb-4 flex items-center justify-between text-xs font-mono">
              <span className={`font-bold flex items-center gap-1.5 ${timeLeft <= 8 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                <Timer className="h-4 w-4" />
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s remaining
              </span>
              <span className="text-[10px] text-slate-400">Time limit per question</span>
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;

              let btnClass = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold';
                } else {
                  btnClass = 'bg-slate-950/60 border-slate-900 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswerSubmitted && handleSubmitAnswer(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && (
                    <div>
                      {isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                      {isSelected && !isCorrectAnswer && <XCircle className="h-5 w-5 text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* In-Depth Explanation Card on Answer */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Engineering Explanation:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              Score: <strong className="text-cyan-400">{score}</strong> / {currentIndex + (isAnswerSubmitted ? 1 : 0)}
            </div>

            {isAnswerSubmitted && (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
              >
                <span>{currentIndex + 1 < activeQuestions.length ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Screen */
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-8 shadow-2xl text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30">
            <Award className="h-10 w-10" />
          </div>

          <h3 className="text-2xl font-black text-white mb-1">Quiz Completed!</h3>
          <p className="text-xs text-slate-400 mb-6">
            Review your final mastery metrics and incorrect answers below.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Final Score</div>
              <div className="text-2xl font-mono font-bold text-white">
                {score} / {activeQuestions.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Accuracy</div>
              <div className={`text-2xl font-mono font-bold ${scorePercentage >= 80 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {scorePercentage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">XP Earned</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                +{score * 25} XP
              </div>
            </div>
          </div>

          {/* Incorrect Answers Review Section */}
          {userAnswers.filter(a => !a.isCorrect).length > 0 && (
            <div className="text-left mb-8 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-rose-400" />
                Review of Incorrect Questions:
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {userAnswers.filter(a => !a.isCorrect).map((ans, idx) => {
                  const q = activeQuestions.find(item => item.id === ans.questionId);
                  if (!q) return null;
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-200 mb-1">{q.question}</div>
                      <div className="text-rose-400 text-[11px] mb-1">
                        Your Answer: {ans.selectedIndex >= 0 ? q.options[ans.selectedIndex] : 'Time Expired'}
                      </div>
                      <div className="text-emerald-400 text-[11px] mb-1 font-semibold">
                        Correct Answer: {q.options[q.correctIndex]}
                      </div>
                      <p className="text-slate-400 text-[11px] italic mt-1">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={startQuiz}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

