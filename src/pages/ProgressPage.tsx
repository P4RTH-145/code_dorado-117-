import React, { useState } from 'react';
import { 
  Award, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Lock, 
  RotateCcw, 
  BookOpen, 
  Cpu, 
  Code2, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEVEL_TIERS, getLevelInfo } from '../data/badgesData';

export const ProgressPage: React.FC = () => {
  const { progress, badges, resetProgress } = useApp();
  const levelInfo = getLevelInfo(progress.totalXp);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const unlockedCount = badges.filter(b => progress.unlockedBadgeIds.includes(b.id)).length;

  const handleConfirmReset = () => {
    resetProgress(true);
    setShowResetModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Student Accomplishments & Gamification
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Progress, Streaks & Engineering Badges
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your journey from Novice Tinkerer to Master Telecom Architect. Earn badges, maintain daily study streaks, and verify complete mastery.
            </p>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Demo Progress</span>
          </button>
        </div>
      </div>

      {/* Level Status & Progression Tiers Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-violet-600 text-white font-black text-2xl shadow-xl shadow-cyan-500/25">
              {levelInfo.level}
            </div>
            <div>
              <div className="text-xs text-slate-400">Current Tier Status</div>
              <h2 className="text-xl font-bold text-white">{levelInfo.name}</h2>
              <div className="text-xs text-cyan-400 font-mono font-semibold">
                {progress.totalXp} Total XP Points
              </div>
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-xs text-slate-400">Next Milestone</div>
            <div className="text-sm font-semibold text-slate-200">
              {levelInfo.nextTier ? levelInfo.nextTier.name : 'Max Level Achieved'}
            </div>
            <div className="text-xs text-amber-400 font-mono">
              {levelInfo.xpToNext > 0 ? `${levelInfo.xpToNext} XP required to advance` : 'Master Rank'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{levelInfo.minXp} XP (Tier Floor)</span>
            <span className="text-cyan-400 font-bold">{levelInfo.progressInLevel}% of Level Complete</span>
            <span>{levelInfo.nextTier ? levelInfo.nextTier.minXp : levelInfo.minXp} XP (Next Tier)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressInLevel}%` }}
            />
          </div>
        </div>

        {/* Level Tiers Road Map */}
        <div className="pt-6 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            Engineering Mastery Ladder
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {LEVEL_TIERS.map((tier) => {
              const isPassed = progress.totalXp >= tier.minXp;
              const isCurrent = tier.level === levelInfo.level;

              return (
                <div
                  key={tier.level}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 scale-105'
                      : isPassed
                      ? 'bg-slate-950 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold mb-1">LVL {tier.level}</div>
                  <div className="text-xs font-bold truncate">{tier.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">{tier.minXp} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" />
              <span>Achievement Badges Showcase</span>
            </h3>
            <p className="text-xs text-slate-400">
              {unlockedCount} of {badges.length} Badges Unlocked
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/80 border-slate-800/80 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isUnlocked ? <Award className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{badge.xpValue} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{badge.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar towards badge unlock */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Criteria Progress</span>
                    <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {badge.currentProgress} / {badge.progressMax}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{
                        width: `${Math.min(100, (badge.currentProgress / badge.progressMax) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-3 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="text-base font-bold text-white">Reset Progress Confirmation</h4>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to reset all learning points, badge achievements, and test attempts? This will clear your local storage and set your workspace back to zero for a fresh demo.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20"
              >
                Yes, Reset All Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
