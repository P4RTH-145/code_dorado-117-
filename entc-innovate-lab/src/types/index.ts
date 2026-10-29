export type AIMode = 'beginner' | 'stepByStep' | 'troubleshoot' | 'coding';

export interface StudentProfile {
  name: string;
  email: string;
  rollNo: string;
  semester: string;
  department: string;
  college: string;
  avatarUrl: string;
  theme: 'dark' | 'light';
  apiKey?: string;
}

export interface StudentStats {
  xp: number;
  level: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  experimentsCompleted: number;
  streakDays: number;
  averageQuizScore: number;
  challengesSolved: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'lab' | 'quiz' | 'coding' | 'learning' | 'streak';
  xpReward: number;
}

export interface WeeklyActivity {
  day: string;
  xp: number;
  hours: number;
  experiments: number;
}

export interface SubjectProgress {
  subject: string;
  code: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  category: 'lesson' | 'quiz' | 'circuit' | 'coding' | 'iot';
  timestamp: string;
  xpEarned: number;
  status: 'completed' | 'in-progress';
}

export interface KnowledgeCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  categoryId: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  overview: string;
  objectives: string[];
  formulas?: { label: string; formula: string; description: string }[];
  workedExample?: { problem: string; solution: string };
  diagramType?: 'logic' | 'pwm' | 'sensor' | 'generic';
  contentSections: { title: string; body: string }[];
  practicalApplications: string[];
  knowledgeCheck: KnowledgeCheckQuestion;
  completed?: boolean;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessonCount: number;
  completedCount: number;
}

export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export interface TruthTableRow {
  inputs: number[];
  output: number;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AIMode;
  isDemo?: boolean;
}

export interface TestCase {
  id: number;
  name: string;
  input: any[];
  expected: any;
  actual?: any;
  passed?: boolean;
  log?: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  problemStatement: string;
  functionName: string;
  params: string[];
  starterCode: string;
  testCases: TestCase[];
  points: number;
  hints: string[];
  solutionExplanation: string;
  category: string;
  completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface IoTEvents {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  level: 'info' | 'warning' | 'alert' | 'success';
}
