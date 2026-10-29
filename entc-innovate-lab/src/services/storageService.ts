import confetti from 'canvas-confetti';
import { 
  StudentProfile, 
  StudentStats, 
  Achievement, 
  RecentActivity 
} from '../types';
import { 
  defaultProfile, 
  defaultStats, 
  defaultAchievements, 
  defaultRecentActivity 
} from '../data/defaultState';

const STORAGE_KEYS = {
  PROFILE: 'entc_student_profile',
  STATS: 'entc_student_stats',
  ACHIEVEMENTS: 'entc_achievements',
  RECENT_ACTIVITY: 'entc_recent_activity',
  COMPLETED_LESSONS: 'entc_completed_lessons',
  COMPLETED_CHALLENGES: 'entc_completed_challenges',
  QUIZ_HISTORY: 'entc_quiz_history'
};

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#3B82F6', '#8B5CF6', '#10B981']
    });
  } catch {
    // Graceful fallback
  }
}

export const storageService = {
  getProfile(): StudentProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return defaultProfile;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultProfile;
    }
  },

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getStats(): StudentStats {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return defaultStats;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultStats;
    }
  },

  saveStats(stats: StudentStats): void {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  getAchievements(): Achievement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) return defaultAchievements;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultAchievements;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  getRecentActivity(): RecentActivity[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY);
    if (!raw) return defaultRecentActivity;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultRecentActivity;
    }
  },

  addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>): void {
    const current = this.getRecentActivity();
    const newEntry: RecentActivity = {
      ...activity,
      id: 'act-' + Date.now(),
      timestamp: 'Just now'
    };
    const updated = [newEntry, ...current.slice(0, 7)];
    localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(updated));
  },

  getCompletedLessons(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    if (!raw) return ['lesson-logic-gates', 'lesson-pwm', 'lesson-temp-sensors'];
    try {
      return JSON.parse(raw);
    } catch {
      return ['lesson-logic-gates', 'lesson-pwm', 'lesson-temp-sensors'];
    }
  },

  completeLesson(lessonId: string, title: string): boolean {
    const completed = this.getCompletedLessons();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completed));
      
      this.addXP(100, `Completed Lesson: ${title}`, 'lesson');
      
      const stats = this.getStats();
      stats.lessonsCompleted += 1;
      this.saveStats(stats);
      triggerConfetti();
      return true;
    }
    return false;
  },

  getCompletedChallenges(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_CHALLENGES);
    if (!raw) return ['challenge-blink-led'];
    try {
      return JSON.parse(raw);
    } catch {
      return ['challenge-blink-led'];
    }
  },

  completeChallenge(challengeId: string, title: string, points: number): boolean {
    const completed = this.getCompletedChallenges();
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(STORAGE_KEYS.COMPROLLENGES || STORAGE_KEYS.COMPLETED_CHALLENGES, JSON.stringify(completed));

      this.addXP(points, `Solved Coding Challenge: ${title}`, 'coding');
      
      const stats = this.getStats();
      stats.challengesSolved += 1;
      this.saveStats(stats);
      triggerConfetti();
      return true;
    }
    return false;
  },

  recordQuizCompleted(subject: string, score: number, total: number, xpEarned: number): void {
    const percentage = Math.round((score / total) * 100);
    const stats = this.getStats();
    stats.quizzesCompleted += 1;
    // Update rolling average quiz score
    stats.averageQuizScore = Math.round(
      (stats.averageQuizScore * (stats.quizzesCompleted - 1) + percentage) / stats.quizzesCompleted
    );
    this.saveStats(stats);

    this.addXP(xpEarned, `Completed ${subject} Quiz (${percentage}%)`, 'quiz');
    if (percentage >= 80) {
      triggerConfetti();
    }
  },

  recordExperimentCompleted(experimentName: string): void {
    const stats = this.getStats();
    stats.experimentsCompleted += 1;
    this.saveStats(stats);
    this.addXP(75, `Ran Experiment: ${experimentName}`, 'circuit');
    triggerConfetti();
  },

  addXP(amount: number, reason: string, category: RecentActivity['category']): void {
    const stats = this.getStats();
    const oldLevel = stats.level;
    stats.xp += amount;
    
    // Level up calculation: every 500 XP is 1 level
    const newLevel = Math.floor(stats.xp / 500) + 1;
    if (newLevel > oldLevel) {
      stats.level = newLevel;
      triggerConfetti();
    }
    this.saveStats(stats);

    this.addRecentActivity({
      title: reason,
      category,
      xpEarned: amount,
      status: 'completed'
    });
  },

  resetAllProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.RECENT_ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  }
};
