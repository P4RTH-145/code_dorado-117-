import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, UserProfile, AppSettings, RecentActivity } from '../types';
import { storageService } from '../services/storageService';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'xp';
  xpAmount?: number;
}

interface AppContextType {
  progress: UserProgress;
  profile: UserProfile;
  settings: AppSettings;
  toasts: ToastMessage[];
  addXp: (amount: number, reason: string) => void;
  completeLesson: (lessonId: string, xp: number) => void;
  recordExperiment: (expId: string, title: string, desc: string, xp?: number) => void;
  completeChallenge: (challengeId: string, xp: number) => void;
  recordQuizScore: (quizId: string, score: number, total: number, xp: number) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetProgress: (toBlank?: boolean) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  dismissToast: (id: string) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => storageService.loadProgress());
  const [profile, setProfile] = useState<UserProfile>(() => storageService.loadProfile());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.loadSettings());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light', 'theme-midnight');
    document.documentElement.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Persist on changes
  useEffect(() => {
    storageService.saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addXp = (amount: number, reason: string) => {
    setProgress(prev => {
      const updatedXp = prev.totalXp + amount;
      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'badge',
        title: 'Earned XP',
        description: reason,
        xpEarned: amount
      };
      const updated: UserProgress = {
        ...prev,
        totalXp: updatedXp,
        isDemoData: false,
        activityHistory: [newActivity, ...prev.activityHistory.slice(0, 19)]
      };
      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      if (newBadges.length > 0) {
        triggerConfetti();
        showToast({
          title: 'Achievement Unlocked!',
          message: `You earned the ${newBadges.join(', ')} badge!`,
          type: 'success'
        });
      }
      return updatedProgress;
    });

    showToast({
      title: `+${amount} XP Earned!`,
      message: reason,
      type: 'xp',
      xpAmount: amount
    });
  };

  const completeLesson = (lessonId: string, xp: number) => {
    if (progress.completedLessons.includes(lessonId)) {
      showToast({
        title: 'Lesson Already Completed',
        message: 'You have already earned XP for this lesson.',
        type: 'info'
      });
      return;
    }

    setProgress(prev => {
      const updatedLessons = [...prev.completedLessons, lessonId];
      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'lesson',
        title: 'Lesson Completed',
        description: `Completed module: ${lessonId}`,
        xpEarned: xp
      };
      const updated: UserProgress = {
        ...prev,
        totalXp: prev.totalXp + xp,
        completedLessons: updatedLessons,
        isDemoData: false,
        activityHistory: [newActivity, ...prev.activityHistory.slice(0, 19)]
      };
      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      if (newBadges.length > 0) {
        triggerConfetti();
        showToast({
          title: 'Achievement Unlocked!',
          message: `You earned a new badge!`,
          type: 'success'
        });
      }
      return updatedProgress;
    });

    triggerConfetti();
    showToast({
      title: 'Module Mastered!',
      message: `Earned +${xp} XP for completing lesson.`,
      type: 'xp',
      xpAmount: xp
    });
  };

  const recordExperiment = (expId: string, title: string, desc: string, xp: number = 25) => {
    const isFirstTime = !progress.completedExperiments.includes(expId);
    const xpToAdd = isFirstTime ? xp : 5;

    setProgress(prev => {
      const updatedExps = isFirstTime ? [...prev.completedExperiments, expId] : prev.completedExperiments;
      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'lab',
        title: title,
        description: desc,
        xpEarned: xpToAdd
      };
      const updated: UserProgress = {
        ...prev,
        totalXp: prev.totalXp + xpToAdd,
        completedExperiments: updatedExps,
        isDemoData: false,
        activityHistory: [newActivity, ...prev.activityHistory.slice(0, 19)]
      };
      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      if (newBadges.length > 0) {
        triggerConfetti();
        showToast({
          title: 'Achievement Unlocked!',
          message: `You unlocked the ${newBadges.join(', ')} badge!`,
          type: 'success'
        });
      }
      return updatedProgress;
    });

    showToast({
      title: isFirstTime ? 'Experiment Logged!' : 'Experiment Re-tested',
      message: `${title} (+${xpToAdd} XP)`,
      type: 'xp',
      xpAmount: xpToAdd
    });
  };

  const completeChallenge = (challengeId: string, xp: number) => {
    const isFirst = !progress.completedChallenges.includes(challengeId);
    const xpReward = isFirst ? xp : 10;

    setProgress(prev => {
      const updatedChallenges = isFirst ? [...prev.completedChallenges, challengeId] : prev.completedChallenges;
      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'coding',
        title: 'Challenge Solved',
        description: `Passed all test cases for ${challengeId}`,
        xpEarned: xpReward
      };
      const updated: UserProgress = {
        ...prev,
        totalXp: prev.totalXp + xpReward,
        completedChallenges: updatedChallenges,
        isDemoData: false,
        activityHistory: [newActivity, ...prev.activityHistory.slice(0, 19)]
      };
      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      if (newBadges.length > 0) {
        triggerConfetti();
        showToast({
          title: 'Achievement Unlocked!',
          message: `Badge unlocked!`,
          type: 'success'
        });
      }
      return updatedProgress;
    });

    triggerConfetti();
    showToast({
      title: 'Challenge Completed!',
      message: `+${xpReward} XP awarded for passing all test cases!`,
      type: 'xp',
      xpAmount: xpReward
    });
  };

  const recordQuizScore = (quizId: string, score: number, total: number, xp: number) => {
    const percentage = Math.round((score / total) * 100);
    setProgress(prev => {
      const previousBest = prev.bestQuizScores[quizId] || 0;
      const newBest = Math.max(previousBest, percentage);

      const attempt = {
        quizId,
        score,
        total,
        percentage,
        timestamp: new Date().toISOString()
      };

      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'quiz',
        title: 'Quiz Finished',
        description: `Scored ${score}/${total} (${percentage}%)`,
        xpEarned: xp
      };

      const updated: UserProgress = {
        ...prev,
        totalXp: prev.totalXp + xp,
        quizAttempts: [attempt, ...prev.quizAttempts],
        bestQuizScores: {
          ...prev.bestQuizScores,
          [quizId]: newBest
        },
        isDemoData: false,
        activityHistory: [newActivity, ...prev.activityHistory.slice(0, 19)]
      };

      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      if (newBadges.length > 0) {
        triggerConfetti();
        showToast({
          title: 'Achievement Unlocked!',
          message: `Quiz Champion badge earned!`,
          type: 'success'
        });
      }
      return updatedProgress;
    });

    if (percentage >= 80) triggerConfetti();
    showToast({
      title: 'Quiz Finished!',
      message: `Score: ${score}/${total} (${percentage}%) - +${xp} XP`,
      type: 'xp',
      xpAmount: xp
    });
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    showToast({ title: 'Profile Updated', message: 'Your settings have been saved.', type: 'success' });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast({ title: 'Preferences Saved', message: 'Configuration successfully updated.', type: 'info' });
  };

  const resetProgress = (toBlank: boolean = true) => {
    const fresh = storageService.resetProgress(toBlank);
    setProgress(fresh);
    showToast({
      title: 'Progress Reset',
      message: toBlank ? 'All progress cleared to clean slate.' : 'Restored initial sample data.',
      type: 'warning'
    });
  };

  const exportData = () => {
    return storageService.exportAllData();
  };

  const importData = (json: string) => {
    const success = storageService.importAllData(json);
    if (success) {
      setProgress(storageService.loadProgress());
      setProfile(storageService.loadProfile());
      setSettings(storageService.loadSettings());
      showToast({ title: 'Import Successful', message: 'Restored backup data.', type: 'success' });
      return true;
    } else {
      showToast({ title: 'Import Failed', message: 'Invalid JSON backup format.', type: 'warning' });
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        progress,
        profile,
        settings,
        toasts,
        addXp,
        completeLesson,
        recordExperiment,
        completeChallenge,
        recordQuizScore,
        updateProfile,
        updateSettings,
        resetProgress,
        exportData,
        importData,
        dismissToast,
        showToast,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
