import { UserProgress, UserProfile, AppSettings, RecentActivity } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_SAMPLE_PROGRESS, BLANK_USER_PROGRESS } from '../data/sampleStatsData';
import { INITIAL_BADGES } from '../data/badgesData';

const PROGRESS_KEY = 'entc_lab_progress_v1';
const PROFILE_KEY = 'entc_lab_profile_v1';
const SETTINGS_KEY = 'entc_lab_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'midnight',
  geminiApiKey: '',
  aiModel: 'gemini-1.5-flash',
  soundEffects: true,
  autoSave: true,
  useLocalStorage: true
};

export const storageService = {
  loadProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not load progress from localStorage:', e);
    }
    return INITIAL_SAMPLE_PROGRESS;
  },

  saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  },

  resetProgress(toBlank: boolean = true): UserProgress {
    const fresh = toBlank ? { ...BLANK_USER_PROGRESS, lastActiveDate: new Date().toISOString() } : INITIAL_SAMPLE_PROGRESS;
    this.saveProgress(fresh);
    return fresh;
  },

  loadProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load profile:', e);
    }
    return INITIAL_USER_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  },

  loadSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Could not load settings:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  exportAllData(): string {
    const data = {
      progress: this.loadProgress(),
      profile: this.loadProfile(),
      settings: this.loadSettings(),
      exportedAt: new Date().toISOString(),
      app: 'ENTC Innovate Lab'
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.progress) this.saveProgress(parsed.progress);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.settings) this.saveSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON:', e);
      return false;
    }
  },

  checkAndAwardBadges(progress: UserProgress): { updatedProgress: UserProgress; newBadges: string[] } {
    const updated = { ...progress };
    const newBadges: string[] = [];

    // Badge 1: First Spark (1 lesson)
    if (updated.completedLessons.length >= 1 && !updated.unlockedBadgeIds.includes('first-spark')) {
      updated.unlockedBadgeIds.push('first-spark');
      newBadges.push('first-spark');
      updated.totalXp += 50;
      updated.badgeProgress['first-spark'] = 1;
    }

    // Badge 2: Logic Virtuoso (logic lesson + >=3 gate experiments)
    const gateExperiments = updated.completedExperiments.filter(e => e.startsWith('gate-'));
    updated.badgeProgress['logic-virtuoso'] = (updated.completedLessons.includes('logic-gates-truth-tables') ? 1 : 0) + Math.min(3, gateExperiments.length);
    if (updated.badgeProgress['logic-virtuoso'] >= 4 && !updated.unlockedBadgeIds.includes('logic-virtuoso')) {
      updated.unlockedBadgeIds.push('logic-virtuoso');
      newBadges.push('logic-virtuoso');
      updated.totalXp += 100;
    }

    // Badge 3: Embedded Hacker (3 coding challenges)
    updated.badgeProgress['code-hacker'] = updated.completedChallenges.length;
    if (updated.completedChallenges.length >= 3 && !updated.unlockedBadgeIds.includes('code-hacker')) {
      updated.unlockedBadgeIds.push('code-hacker');
      newBadges.push('code-hacker');
      updated.totalXp += 150;
    }

    // Badge 4: Quiz Champion (>=2 quizzes with >=80%)
    const highScores = Object.values(updated.bestQuizScores).filter(pct => pct >= 80).length;
    updated.badgeProgress['quiz-master'] = highScores;
    if (highScores >= 2 && !updated.unlockedBadgeIds.includes('quiz-master')) {
      updated.unlockedBadgeIds.push('quiz-master');
      newBadges.push('quiz-master');
      updated.totalXp += 120;
    }

    // Badge 5: IoT Pioneer (3 IoT scenarios)
    const iotExps = updated.completedExperiments.filter(e => e.startsWith('iot-')).length;
    updated.badgeProgress['iot-pioneer'] = iotExps;
    if (iotExps >= 3 && !updated.unlockedBadgeIds.includes('iot-pioneer')) {
      updated.unlockedBadgeIds.push('iot-pioneer');
      newBadges.push('iot-pioneer');
      updated.totalXp += 100;
    }

    // Badge 6: Streak Titan
    if (updated.currentStreak >= 3 && !updated.unlockedBadgeIds.includes('streak-titan')) {
      updated.unlockedBadgeIds.push('streak-titan');
      newBadges.push('streak-titan');
      updated.totalXp += 80;
    }

    return { updatedProgress: updated, newBadges };
  }
};

