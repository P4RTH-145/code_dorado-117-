/**
 * StudySync Supabase Configuration
 * -------------------------------------------------------------
 * To allow students and admins to log in across ANY device:
 * 1. Open your Supabase project (https://supabase.com/dashboard)
 * 2. Go to: Project Settings -> API
 * 3. Copy your "Project URL" and paste below as supabaseUrl
 * 4. Copy your "anon / public" API Key and paste below as supabaseAnonKey
 * 
 * NOTE: You can also enter these directly in the website UI by clicking
 * the "Sync Status" badge in the top navigation or under Admin -> Cloud & Sync!
 */
function _cleanSbUrl(u){
  return (u || '').trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

window.cleanSupabaseUrl = _cleanSbUrl;

window.STUDYSYNC_CONFIG = {
  // Your Supabase project URL (automatically handles root URL or /rest/v1/)
  supabaseUrl: 'https://rezllumcjrlmhyacvdav.supabase.co',

  // Your Supabase public anonymous API key
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlemxsdW1janJsbWh5YWN2ZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMTczNDcsImV4cCI6MjEwNzc5MzM0N30.N7U3tRFNodB5O2f71DT0XZCZYnJTfe0KuICrBvNw2zk',

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
  if (url) localStorage.setItem('studysync_supabase_url', _cleanSbUrl(url));
  if (anonKey) localStorage.setItem('studysync_supabase_anon_key', anonKey.trim());
  if (instituteId) localStorage.setItem('studysync_institute_id', instituteId.trim());
  console.log('StudySync: Supabase credentials updated. Reloading...');
  window.location.reload();
};
