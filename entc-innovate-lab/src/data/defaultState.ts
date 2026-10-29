import { StudentProfile, StudentStats, Achievement, WeeklyActivity, SubjectProgress, RecentActivity } from '../types';

export const defaultProfile: StudentProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@entc.edu',
  rollNo: 'ENTC-2024-042',
  semester: '6th Semester (Third Year)',
  department: 'Electronics & Telecommunication Engineering',
  college: 'National Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  theme: 'dark'
};

export const defaultStats: StudentStats = {
  xp: 1450,
  level: 4,
  lessonsCompleted: 3,
  quizzesCompleted: 6,
  experimentsCompleted: 5,
  streakDays: 7,
  averageQuizScore: 88,
  challengesSolved: 2
};

export const defaultAchievements: Achievement[] = [
  {
    id: 'badge-first-gate',
    title: 'First Gate Master',
    description: 'Simulated and verified all 7 standard logic gates in the virtual laboratory.',
    icon: 'Cpu',
    unlocked: true,
    unlockedAt: '2 days ago',
    category: 'lab',
    xpReward: 100
  },
  {
    id: 'badge-circuit-wizard',
    title: 'Ohm’s Law Explorer',
    description: 'Constructed an active LED circuit and calculated current within 1% error.',
    icon: 'Zap',
    unlocked: true,
    unlockedAt: '3 days ago',
    category: 'lab',
    xpReward: 150
  },
  {
    id: 'badge-code-ninja',
    title: 'Firmware Hacker',
    description: 'Successfully submitted and passed all test cases for two embedded coding challenges.',
    icon: 'Terminal',
    unlocked: true,
    unlockedAt: 'Yesterday',
    category: 'coding',
    xpReward: 200
  },
  {
    id: 'badge-streak-keeper',
    title: '7-Day Spark',
    description: 'Maintained a consecutive 7-day engineering learning streak.',
    icon: 'Flame',
    unlocked: true,
    unlockedAt: 'Today',
    category: 'streak',
    xpReward: 250
  },
  {
    id: 'badge-quiz-ace',
    title: 'Signal Theorist',
    description: 'Score 90% or higher on the Communication Systems timed quiz.',
    icon: 'Award',
    unlocked: false,
    category: 'quiz',
    xpReward: 300
  },
  {
    id: 'badge-iot-pioneer',
    title: 'Smart City Architect',
    description: 'Run all 3 IoT real-world scenarios (Home, Temperature, Irrigation) with live threshold alerts.',
    icon: 'Radio',
    unlocked: false,
    category: 'lab',
    xpReward: 350
  }
];

export const defaultWeeklyActivity: WeeklyActivity[] = [
  { day: 'Mon', xp: 180, hours: 1.5, experiments: 1 },
  { day: 'Tue', xp: 240, hours: 2.2, experiments: 2 },
  { day: 'Wed', xp: 120, hours: 1.0, experiments: 0 },
  { day: 'Thu', xp: 320, hours: 3.1, experiments: 3 },
  { day: 'Fri', xp: 210, hours: 2.0, experiments: 1 },
  { day: 'Sat', xp: 290, hours: 2.8, experiments: 2 },
  { day: 'Sun', xp: 90, hours: 0.8, experiments: 1 }
];

export const defaultSubjectProgress: SubjectProgress[] = [
  { subject: 'Digital Electronics', code: 'EC301', progress: 68, totalLessons: 6, completedLessons: 4, color: '#00F0FF' },
  { subject: 'Embedded Systems', code: 'EC302', progress: 54, totalLessons: 7, completedLessons: 4, color: '#EC4899' },
  { subject: 'Sensors & Instrumentation', code: 'EC303', progress: 42, totalLessons: 5, completedLessons: 2, color: '#10B981' },
  { subject: 'Analog Circuits', code: 'EC304', progress: 35, totalLessons: 5, completedLessons: 2, color: '#3B82F6' },
  { subject: 'Communication Systems', code: 'EC305', progress: 20, totalLessons: 6, completedLessons: 1, color: '#8B5CF6' }
];

export const defaultRecentActivity: RecentActivity[] = [
  {
    id: 'act-1',
    title: 'Solved "Toggle LED State" Challenge',
    category: 'coding',
    timestamp: '15 mins ago',
    xpEarned: 50,
    status: 'completed'
  },
  {
    id: 'act-2',
    title: 'Completed "Logic Gates and Truth Tables"',
    category: 'lesson',
    timestamp: '2 hours ago',
    xpEarned: 100,
    status: 'completed'
  },
  {
    id: 'act-3',
    title: 'Simulated Ultrasonic Distance Sensor',
    category: 'circuit',
    timestamp: 'Yesterday',
    xpEarned: 75,
    status: 'completed'
  },
  {
    id: 'act-4',
    title: 'Took Digital Electronics Practice Quiz',
    category: 'quiz',
    timestamp: '2 days ago',
    xpEarned: 120,
    status: 'completed'
  }
];
