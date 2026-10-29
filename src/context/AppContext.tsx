import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, UserProfile, AppSettings, Badge, RecentActivity, UserAccount } from '../types';
import { storageService, DEFAULT_SETTINGS } from '../services/storageService';
import { authService } from '../services/authService';
import { INITIAL_BADGES } from '../data/badgesData';

interface AppContextType {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  progress: UserProgress;
  profile: UserProfile;
  settings: AppSettings;
  badges: Badge[];
  newBadgeUnlocked: Badge | null;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  switchAccount: (userId: string) => void;
  addStudent: (data: { name: string; email: string; password: string; rollNumber: string; branch?: string; semester?: string }) => { success: boolean; error?: string };
  deleteStudent: (id: string) => boolean;
  clearNewBadge: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  completeLesson: (lessonId: string, lessonTitle: string, xp: number) => void;
  recordQuizScore: (quizId: string, quizTitle: string, score: number, total: number, xp: number) => void;
  solveChallenge: (challengeId: string, challengeTitle: string, xp: number) => void;
  completeExperiment: (experimentId: string, experimentTitle: string, xp: number) => void;
  resetProgress: (toBlank?: boolean) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());
  const [accounts, setAccounts] = useState<UserAccount[]>(() => authService.getAccounts());
  const [progress, setProgress] = useState<UserProgress>(() => {
    const user = authService.getCurrentUser();
    return user ? authService.getUserProgress(user.id) : storageService.loadProgress();
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const user = authService.getCurrentUser();
    return user ? user.profile : storageService.loadProfile();
  });
  const [settings, setSettings] = useState<AppSettings>(() => storageService.loadSettings());
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge | null>(null);

  // Sync settings theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Save changes to current user's progress
  useEffect(() => {
    if (currentUser) {
      authService.saveUserProgress(currentUser.id, progress);
    }
    storageService.saveProgress(progress);
  }, [progress, currentUser]);

  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  const login = (email: string, pass: string) => {
    const res = authService.login(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setProfile(res.user.profile);
      setProgress(authService.getUserProgress(res.user.id));
      setAccounts(authService.getAccounts());
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const switchAccount = (userId: string) => {
    const all = authService.getAccounts();
    const target = all.find(a => a.id === userId);
    if (target) {
      localStorage.setItem('entc_current_user_v2', JSON.stringify(target));
      setCurrentUser(target);
      setProfile(target.profile);
      setProgress(authService.getUserProgress(target.id));
    }
  };

  const addStudent = (data: { name: string; email: string; password: string; rollNumber: string; branch?: string; semester?: string }) => {
    const res = authService.addStudent(data);
    if (res.success) {
      setAccounts(authService.getAccounts());
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const deleteStudent = (id: string) => {
    const ok = authService.deleteStudent(id);
    if (ok) {
      setAccounts(authService.getAccounts());
    }
    return ok;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B']
      });
    } catch {
      // safe fallback
    }
  };

  const notifyBadges = (newBadgeIds: string[]) => {
    if (newBadgeIds.length > 0) {
      const firstBadge = INITIAL_BADGES.find(b => b.id === newBadgeIds[0]);
      if (firstBadge) {
        setNewBadgeUnlocked(firstBadge);
        triggerConfetti();
      }
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const completeLesson = (lessonId: string, lessonTitle: string, xp: number) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;

      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'lesson',
        title: 'Completed Lesson',
        description: `Mastered ${lessonTitle}`,
        xpEarned: xp
      };

      const updated: UserProgress = {
        ...prev,
        isDemoData: false,
        totalXp: prev.totalXp + xp,
        completedLessons: [...prev.completedLessons, lessonId],
        activityHistory: [newActivity, ...prev.activityHistory].slice(0, 20)
      };

      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      notifyBadges(newBadges);
      triggerConfetti();
      return updatedProgress;
    });
  };

  const recordQuizScore = (quizId: string, quizTitle: string, score: number, total: number, xp: number) => {
    setProgress(prev => {
      const percentage = Math.round((score / total) * 100);
      const prevBest = prev.bestQuizScores[quizId] || 0;
      const isNewBest = percentage > prevBest;
      const awardedXp = isNewBest ? xp : Math.round(xp * 0.2);

      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'quiz',
        title: 'Quiz Completed',
        description: `${quizTitle}: ${score}/${total} (${percentage}%)`,
        xpEarned: awardedXp
      };

      const updated: UserProgress = {
        ...prev,
        isDemoData: false,
        totalXp: prev.totalXp + awardedXp,
        quizAttempts: [
          ...prev.quizAttempts,
          {
            quizId,
            score,
            total,
            percentage,
            timestamp: new Date().toISOString()
          }
        ],
        bestQuizScores: {
          ...prev.bestQuizScores,
          [quizId]: Math.max(prevBest, percentage)
        },
        activityHistory: [newActivity, ...prev.activityHistory].slice(0, 20)
      };

      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      notifyBadges(newBadges);
      if (percentage >= 80) triggerConfetti();
      return updatedProgress;
    });
  };

  const solveChallenge = (challengeId: string, challengeTitle: string, xp: number) => {
    setProgress(prev => {
      const alreadyDone = prev.completedChallenges.includes(challengeId);
      const earnedXp = alreadyDone ? 10 : xp;

      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'coding',
        title: 'Challenge Solved',
        description: `Passed all test cases for ${challengeTitle}`,
        xpEarned: earnedXp
      };

      const updated: UserProgress = {
        ...prev,
        isDemoData: false,
        totalXp: prev.totalXp + earnedXp,
        completedChallenges: alreadyDone ? prev.completedChallenges : [...prev.completedChallenges, challengeId],
        activityHistory: [newActivity, ...prev.activityHistory].slice(0, 20)
      };

      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      notifyBadges(newBadges);
      triggerConfetti();
      return updatedProgress;
    });
  };

  const completeExperiment = (experimentId: string, experimentTitle: string, xp: number) => {
    setProgress(prev => {
      const alreadyDone = prev.completedExperiments.includes(experimentId);
      const earnedXp = alreadyDone ? 5 : xp;

      const newActivity: RecentActivity = {
        id: 'act-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'lab',
        title: 'Experiment Completed',
        description: `Simulated & verified ${experimentTitle}`,
        xpEarned: earnedXp
      };

      const updated: UserProgress = {
        ...prev,
        isDemoData: false,
        totalXp: prev.totalXp + earnedXp,
        completedExperiments: alreadyDone ? prev.completedExperiments : [...prev.completedExperiments, experimentId],
        activityHistory: [newActivity, ...prev.activityHistory].slice(0, 20)
      };

      const { updatedProgress, newBadges } = storageService.checkAndAwardBadges(updated);
      notifyBadges(newBadges);
      return updatedProgress;
    });
  };

  const resetProgress = (toBlank: boolean = true) => {
    const fresh = storageService.resetProgress(toBlank);
    setProgress(fresh);
  };

  const clearNewBadge = () => {
    setNewBadgeUnlocked(null);
  };

  const badgesWithStatus: Badge[] = INITIAL_BADGES.map(b => {
    const isUnlocked = progress.unlockedBadgeIds.includes(b.id);
    const curr = progress.badgeProgress[b.id] || (isUnlocked ? b.progressMax : 0);
    return {
      ...b,
      currentProgress: Math.min(b.progressMax, curr),
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    };
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        accounts,
        progress,
        profile,
        settings,
        badges: badgesWithStatus,
        newBadgeUnlocked,
        login,
        logout,
        switchAccount,
        addStudent,
        deleteStudent,
        clearNewBadge,
        updateProfile,
        updateSettings,
        completeLesson,
        recordQuizScore,
        solveChallenge,
        completeExperiment,
        resetProgress,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
