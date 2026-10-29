import { UserProgress, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@entc.edu',
  rollNumber: 'ENTC-2026-084',
  institution: 'National Institute of Technology',
  semester: '6th Semester (Junior Year)',
  branch: 'Electronics & Telecommunication Engineering',
  targetRole: 'Embedded Systems & IoT Hardware Engineer',
  avatarSeed: 'aarav'
};

export const INITIAL_SAMPLE_PROGRESS: UserProgress = {
  totalXp: 380,
  currentStreak: 3,
  lastActiveDate: new Date().toISOString(),
  completedLessons: ['logic-gates-truth-tables'],
  completedChallenges: ['challenge-blink-led'],
  completedExperiments: ['gate-and', 'circuit-led'],
  quizAttempts: [
    {
      quizId: 'quiz-de-1',
      score: 1,
      total: 1,
      percentage: 100,
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      quizId: 'quiz-micro-1',
      score: 1,
      total: 1,
      percentage: 100,
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ],
  bestQuizScores: {
    'quiz-de-1': 100,
    'quiz-micro-1': 100
  },
  unlockedBadgeIds: ['first-spark'],
  badgeProgress: {
    'first-spark': 1,
    'logic-virtuoso': 2,
    'code-hacker': 1,
    'quiz-master': 1,
    'iot-pioneer': 1,
    'streak-titan': 3
  },
  activityHistory: [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      type: 'coding',
      title: 'Solved Challenge',
      description: 'Blink an LED State Toggle evaluated and passed all 4 test cases',
      xpEarned: 50
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      type: 'lab',
      title: 'Simulated Circuit',
      description: 'Tested Virtual LED Circuit with 5V DC Supply & 330Ω Current Limiter',
      xpEarned: 30
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      type: 'lesson',
      title: 'Completed Lesson',
      description: 'Logic Gates & Truth Tables completed with 100% quiz accuracy',
      xpEarned: 60
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      type: 'badge',
      title: 'Badge Unlocked',
      description: 'Awarded "First Spark" badge for completing first engineering module',
      xpEarned: 50
    }
  ],
  weeklyActivityData: [
    { day: 'Mon', lessons: 1, simulations: 2, quizzes: 1, xp: 90 },
    { day: 'Tue', lessons: 2, simulations: 1, quizzes: 0, xp: 120 },
    { day: 'Wed', lessons: 0, simulations: 3, quizzes: 2, xp: 85 },
    { day: 'Thu', lessons: 1, simulations: 2, quizzes: 1, xp: 110 },
    { day: 'Fri', lessons: 3, simulations: 4, quizzes: 2, xp: 180 },
    { day: 'Sat', lessons: 1, simulations: 1, quizzes: 1, xp: 70 },
    { day: 'Sun', lessons: 2, simulations: 3, quizzes: 2, xp: 140 }
  ],
  isDemoData: true // clearly labeled until user performs customized resets or fresh activity
};

export const BLANK_USER_PROGRESS: UserProgress = {
  totalXp: 0,
  currentStreak: 1,
  lastActiveDate: new Date().toISOString(),
  completedLessons: [],
  completedChallenges: [],
  completedExperiments: [],
  quizAttempts: [],
  bestQuizScores: {},
  unlockedBadgeIds: [],
  badgeProgress: {
    'first-spark': 0,
    'logic-virtuoso': 0,
    'code-hacker': 0,
    'quiz-master': 0,
    'iot-pioneer': 0,
    'streak-titan': 1
  },
  activityHistory: [],
  weeklyActivityData: [
    { day: 'Mon', lessons: 0, simulations: 0, quizzes: 0, xp: 0 },
    { day: 'Tue', lessons: 0, simulations: 0, quizzes: 0, xp: 0 },
    { day: 'Wed', lessons: 0, simulations: 0, quizzes: 0, xp: 0 },
    { day: 'Thu', lessons: 0, simulations: 0, quizzes: 0, xp: 0 },
    { day: 'Fri', lessons: 0, simulations: 0, quizzes: 0, xp: 0 },
    { day: 'Sat', lessons: 0, simulations: 0, quizzes: 0, xp: 0 },
    { day: 'Sun', lessons: 0, simulations: 0, quizzes: 0, xp: 0 }
  ],
  isDemoData: false
};

