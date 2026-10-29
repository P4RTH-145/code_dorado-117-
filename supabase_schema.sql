-- ================================================================
-- ENTC Innovate Lab — PostgreSQL / Supabase Database Schema
-- ================================================================

-- 1. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  roll_number TEXT,
  institution TEXT,
  semester TEXT,
  branch TEXT,
  target_role TEXT,
  avatar_seed TEXT DEFAULT 'aarav',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Learning Progress & XP Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 1 NOT NULL,
  last_active_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_challenges TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_experiments TEXT[] DEFAULT ARRAY[]::TEXT[],
  best_quiz_scores JSONB DEFAULT '{}'::JSONB,
  unlocked_badge_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Quiz Attempts & Exam Audit Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activity Audit Stream Table
CREATE TABLE IF NOT EXISTS public.activity_stream (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_stream ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read/write for self-contained student demo
CREATE POLICY "Allow public read/write profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow public read/write progress" ON public.user_progress FOR ALL USING (true);
CREATE POLICY "Allow public read/write attempts" ON public.quiz_attempts FOR ALL USING (true);
CREATE POLICY "Allow public read/write activity" ON public.activity_stream FOR ALL USING (true);
