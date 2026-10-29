import { UserAccount, UserProgress, UserProfile } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_SAMPLE_PROGRESS, BLANK_USER_PROGRESS } from '../data/sampleStatsData';

const ACCOUNTS_STORAGE_KEY = 'entc_accounts_v2';
const CURRENT_USER_KEY = 'entc_current_user_v2';
const USER_PROGRESS_PREFIX = 'entc_progress_user_';

export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'admin-1',
    email: 'admin@entc.edu',
    password: 'admin123',
    role: 'admin',
    profile: {
      name: 'Dr. Rajesh Kulkarni (HOD & Admin)',
      email: 'admin@entc.edu',
      rollNumber: 'FAC-ENTC-001',
      institution: 'National Institute of Technology',
      semester: 'Faculty & Lab Director',
      branch: 'Electronics & Telecommunication',
      targetRole: 'Department Administrator & Curriculum Head',
      avatarSeed: 'admin'
    },
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'student-1',
    email: 'aarav@entc.edu',
    password: 'student123',
    role: 'student',
    profile: {
      name: 'Aarav Sharma',
      email: 'aarav@entc.edu',
      rollNumber: 'ENTC-2026-084',
      institution: 'National Institute of Technology',
      semester: '6th Semester (Junior Year)',
      branch: 'Electronics & Telecommunication',
      targetRole: 'Embedded Systems & Hardware Engineer',
      avatarSeed: 'aarav'
    },
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'student-2',
    email: 'sneha@entc.edu',
    password: 'student123',
    role: 'student',
    profile: {
      name: 'Sneha Patel',
      email: 'sneha@entc.edu',
      rollNumber: 'ENTC-2026-102',
      institution: 'National Institute of Technology',
      semester: '6th Semester (Junior Year)',
      branch: 'Electronics & Telecommunication',
      targetRole: 'IoT & Telecommunication Network Architect',
      avatarSeed: 'sneha'
    },
    createdAt: '2026-02-12T11:00:00Z'
  }
];

export const authService = {
  getAccounts(): UserAccount[] {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading accounts:', e);
    }
    // Initialize default accounts
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  },

  saveAccounts(accounts: UserAccount[]): void {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed saving accounts:', e);
    }
  },

  getCurrentUser(): UserAccount | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading current user:', e);
    }
    // Default to Student 1 (Aarav) so site is immediately playable
    const defaultUser = DEFAULT_ACCOUNTS[1];
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  },

  login(email: string, password: string): { success: boolean; user?: UserAccount; error?: string } {
    const accounts = this.getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.find(a => a.email.toLowerCase() === cleanEmail && a.password === password);

    if (found) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid email or password. Please verify credentials.' };
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  addStudent(studentData: {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    semester?: string;
    branch?: string;
    targetRole?: string;
  }): { success: boolean; student?: UserAccount; error?: string } {
    const accounts = this.getAccounts();
    const cleanEmail = studentData.email.trim().toLowerCase();

    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'A user account with this academic email already exists.' };
    }

    const newStudent: UserAccount = {
      id: 'student-' + Date.now(),
      email: cleanEmail,
      password: studentData.password || 'student123',
      role: 'student',
      profile: {
        name: studentData.name,
        email: cleanEmail,
        rollNumber: studentData.rollNumber || `ENTC-2026-${Math.floor(100 + Math.random() * 900)}`,
        institution: 'National Institute of Technology',
        semester: studentData.semester || '6th Semester (Junior Year)',
        branch: studentData.branch || 'Electronics & Telecommunication',
        targetRole: studentData.targetRole || 'Embedded Systems Engineer',
        avatarSeed: studentData.name.toLowerCase().replace(/\s+/g, '')
      },
      createdAt: new Date().toISOString()
    };

    const updated = [...accounts, newStudent];
    this.saveAccounts(updated);

    // Seed empty progress for new student
    this.saveUserProgress(newStudent.id, {
      ...BLANK_USER_PROGRESS,
      lastActiveDate: new Date().toISOString()
    });

    return { success: true, student: newStudent };
  },

  deleteStudent(studentId: string): boolean {
    const accounts = this.getAccounts();
    // Cannot delete default admin
    const filtered = accounts.filter(a => a.id !== studentId || a.role === 'admin');
    if (filtered.length !== accounts.length) {
      this.saveAccounts(filtered);
      localStorage.removeItem(USER_PROGRESS_PREFIX + studentId);
      return true;
    }
    return false;
  },

  getUserProgress(userId: string): UserProgress {
    try {
      const stored = localStorage.getItem(USER_PROGRESS_PREFIX + userId);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading progress for user:', userId, e);
    }
    // Return sample progress for Aarav (student-1), or blank for others
    if (userId === 'student-1') {
      return INITIAL_SAMPLE_PROGRESS;
    }
    if (userId === 'student-2') {
      return {
        ...INITIAL_SAMPLE_PROGRESS,
        totalXp: 180,
        currentStreak: 2,
        completedLessons: ['pulse-width-modulation-pwm'],
        completedChallenges: ['challenge-read-switch'],
        completedExperiments: ['sensor-light'],
        activityHistory: [
          {
            id: 'act-s2-1',
            timestamp: new Date().toISOString(),
            type: 'lesson',
            title: 'Completed Lesson',
            description: 'Pulse Width Modulation (PWM) mastered',
            xpEarned: 75
          }
        ]
      };
    }
    return BLANK_USER_PROGRESS;
  },

  saveUserProgress(userId: string, progress: UserProgress): void {
    try {
      localStorage.setItem(USER_PROGRESS_PREFIX + userId, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed saving user progress:', e);
    }
  }
};
