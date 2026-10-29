import { Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first-spark',
    title: 'First Spark',
    description: 'Complete your first ENTC lesson',
    icon: 'Zap',
    category: 'learning',
    progressMax: 1,
    currentProgress: 0,
    xpValue: 50
  },
  {
    id: 'logic-virtuoso',
    title: 'Logic Virtuoso',
    description: 'Complete the Logic Gates lesson and simulate 3 distinct gates in the Virtual Lab',
    icon: 'Cpu',
    category: 'lab',
    progressMax: 4,
    currentProgress: 0,
    xpValue: 100
  },
  {
    id: 'code-hacker',
    title: 'Embedded Hacker',
    description: 'Successfully solve and submit 3 coding challenges in the Arena',
    icon: 'Terminal',
    category: 'coding',
    progressMax: 3,
    currentProgress: 0,
    xpValue: 150
  },
  {
    id: 'quiz-master',
    title: 'Quiz Champion',
    description: 'Score 80% or higher on at least 2 quizzes in the Quiz Zone',
    icon: 'Award',
    category: 'quiz',
    progressMax: 2,
    currentProgress: 0,
    xpValue: 120
  },
  {
    id: 'iot-pioneer',
    title: 'IoT Pioneer',
    description: 'Trigger and experiment with all 3 IoT real-world scenarios',
    icon: 'Wifi',
    category: 'lab',
    progressMax: 3,
    currentProgress: 0,
    xpValue: 100
  },
  {
    id: 'streak-titan',
    title: 'Streak Titan',
    description: 'Maintain a 3-day continuous active study streak',
    icon: 'Flame',
    category: 'streak',
    progressMax: 3,
    currentProgress: 1,
    xpValue: 80
  }
];

export const LEVEL_TIERS = [
  { level: 1, name: 'Novice Tinkerer', minXp: 0, maxXp: 150 },
  { level: 2, name: 'Circuit Apprentice', minXp: 150, maxXp: 350 },
  { level: 3, name: 'Silicon Explorer', minXp: 350, maxXp: 650 },
  { level: 4, name: 'Embedded Specialist', minXp: 650, maxXp: 1050 },
  { level: 5, name: 'Signal Maestro', minXp: 1050, maxXp: 1600 },
  { level: 6, name: 'Lead Hardware Engineer', minXp: 1600, maxXp: 2500 },
  { level: 7, name: 'Master Telecom Architect', minXp: 2500, maxXp: 99999 }
];

export function getLevelInfo(xp: number) {
  const currentTier = LEVEL_TIERS.slice().reverse().find(t => xp >= t.minXp) || LEVEL_TIERS[0];
  const nextTier = LEVEL_TIERS.find(t => t.level === currentTier.level + 1);
  const progressInLevel = nextTier 
    ? Math.min(100, Math.round(((xp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100))
    : 100;
  return {
    ...currentTier,
    nextTier,
    progressInLevel,
    xpToNext: nextTier ? nextTier.minXp - xp : 0
  };
}
