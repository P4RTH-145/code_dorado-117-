/**
 * StudySync Supabase Configuration
 * -------------------------------------------------------------
 * Replace the placeholders below with your Supabase project credentials.
 * You can find these in your Supabase project dashboard under:
 * Project Settings -> API -> Project URL & Project API Keys (anon / public).
 */
window.STUDYSYNC_CONFIG = {
  // Your Supabase project URL (e.g., 'https://xyzcompany.supabase.co')
  supabaseUrl: 'https://vugmwtqflbxtlxdptbxy.supabase.co',

  // Your Supabase public anonymous API key (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Z213dHFmbGJ4dGx4ZHB0Ynh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjE5NDEsImV4cCI6MjA1Nzc5Nzk0MX0.example_replace_with_actual_key',

  // Institute Identifier (Partitioning key for multi-tenant isolation)
  instituteId: 'default-institute',

  // Department name
  department: 'Computer Science and Engineering',

  // Realtime synchronization enabled
  realtimeEnabled: true
};

/**
 * Utility helper to set Supabase credentials programmatically or via console:
 * window.setStudySyncSupabase('https://xyz.supabase.co', 'your-anon-key')
 */
window.setStudySyncSupabase = function(url, anonKey, instituteId) {
  if (url) localStorage.setItem('studysync_supabase_url', url.trim());
  if (anonKey) localStorage.setItem('studysync_supabase_anon_key', anonKey.trim());
  if (instituteId) localStorage.setItem('studysync_institute_id', instituteId.trim());
  console.log('StudySync: Supabase credentials updated. Reloading...');
  window.location.reload();
};
