export type SubjectCategory =
  | 'digital-electronics'
  | 'analog-electronics'
  | 'communication-systems'
  | 'microcontrollers'
  | 'sensors-instrumentation'
  | 'signal-processing'
  | 'iot'
  | 'ai-ml';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LessonContent {
  id: string;
  title: string;
  category: SubjectCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  description: string;
  learningObjectives: string[];
  conceptExplanation: string;
  formula?: {
    latex?: string;
    explanation: string;
  };
  visualDiagramType?: 'truth-table' | 'waveform-pwm' | 'sensor-pinout' | 'circuit-diagram';
  workedExample: {
    title: string;
    problem: string;
    solutionSteps: string[];
    result: string;
  };
  practicalApplications: string[];
  quickQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  subject: SubjectCategory;
  subjectLabel: string;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export interface CodingChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  description: string;
  problemStatement: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  explanation: string;
  xpReward: number;
  functionName: string;
  testCases: {
    inputDescription: string;
    args: any[];
    expected: any;
    explanation?: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'lab' | 'coding' | 'quiz' | 'streak';
  unlockedAt?: string;
  progressMax: number;
  currentProgress: number;
  xpValue: number;
}

export interface RecentActivity {
  id: string;
  timestamp: string;
  type: 'lesson' | 'quiz' | 'lab' | 'coding' | 'badge';
  title: string;
  description: string;
  xpEarned: number;
}

export interface UserProgress {
  totalXp: number;
  currentStreak: number;
  lastActiveDate: string;
  completedLessons: string[]; // lesson ids
  completedChallenges: string[]; // challenge ids
  completedExperiments: string[]; // experiment ids e.g. 'gate-and', 'circuit-led', 'sensor-lm35'
  quizAttempts: {
    quizId: string;
    score: number;
    total: number;
    percentage: number;
    timestamp: string;
  }[];
  bestQuizScores: Record<string, number>; // quizId -> best score
  unlockedBadgeIds: string[];
  badgeProgress: Record<string, number>;
  activityHistory: RecentActivity[];
  weeklyActivityData: { day: string; lessons: number; simulations: number; quizzes: number; xp: number }[];
  isDemoData: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  rollNumber: string;
  institution: string;
  semester: string;
  branch: string;
  targetRole: string;
  avatarSeed: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'midnight';
  geminiApiKey: string;
  aiModel: string;
  soundEffects: boolean;
  autoSave: boolean;
  useLocalStorage: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: 'beginner' | 'step-by-step' | 'troubleshoot' | 'coding';
  suggestedFollowUps?: string[];
  isDemoMode?: boolean;
}

