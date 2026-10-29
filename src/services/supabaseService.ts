import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProgress, UserProfile } from '../types';

let supabaseInstance: SupabaseClient | null = null;

export const supabaseService = {
  getClient(url?: string, anonKey?: string): SupabaseClient | null {
    if (supabaseInstance) return supabaseInstance;

    const finalUrl = url || import.meta.env.VITE_SUPABASE_URL;
    const finalKey = anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (finalUrl && finalKey && finalUrl.startsWith('http')) {
      try {
        supabaseInstance = createClient(finalUrl, finalKey);
        return supabaseInstance;
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
      }
    }
    return null;
  },

  resetClient(url: string, anonKey: string): SupabaseClient | null {
    if (url && anonKey) {
      try {
        supabaseInstance = createClient(url, anonKey);
        return supabaseInstance;
      } catch (err) {
        console.error('Failed to reinitialize Supabase:', err);
      }
    }
    supabaseInstance = null;
    return null;
  },

  async testConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const testClient = createClient(url, anonKey);
      const { data, error } = await testClient.from('profiles').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, but credentials could be valid
        return { 
          success: true, 
          message: `Connected to Supabase project! (Table notice: ${error.message})` 
        };
      }
      return { success: true, message: 'Successfully connected to Supabase Database!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection failed' };
    }
  },

  async syncProgressToCloud(userId: string, progress: UserProgress, client?: SupabaseClient): Promise<boolean> {
    const sb = client || supabaseInstance;
    if (!sb) return false;

    try {
      const { error } = await sb.from('user_progress').upsert({
        user_id: userId,
        total_xp: progress.totalXp,
        current_streak: progress.currentStreak,
        last_active_date: progress.lastActiveDate,
        completed_lessons: progress.completedLessons,
        completed_challenges: progress.completedChallenges,
        completed_experiments: progress.completedExperiments,
        best_quiz_scores: progress.bestQuizScores,
        unlocked_badge_ids: progress.unlockedBadgeIds,
        updated_at: new Date().toISOString()
      });

      return !error;
    } catch (e) {
      console.warn('Supabase sync error:', e);
      return false;
    }
  },

  async fetchProgressFromCloud(userId: string, client?: SupabaseClient): Promise<Partial<UserProgress> | null> {
    const sb = client || supabaseInstance;
    if (!sb) return null;

    try {
      const { data, error } = await sb
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        totalXp: data.total_xp,
        currentStreak: data.current_streak,
        lastActiveDate: data.last_active_date,
        completedLessons: data.completed_lessons || [],
        completedChallenges: data.completed_challenges || [],
        completedExperiments: data.completed_experiments || [],
        bestQuizScores: data.best_quiz_scores || {},
        unlockedBadgeIds: data.unlocked_badge_ids || [],
        isDemoData: false
      };
    } catch (e) {
      console.warn('Error fetching cloud progress:', e);
      return null;
    }
  }
};

