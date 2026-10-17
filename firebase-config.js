/**
 * StudySync Firebase Configuration
 * -------------------------------------------------------------
 * To allow students and admins to log in across ANY device:
 * 1. Open Firebase Console: https://console.firebase.google.com/
 * 2. Click "Add project" (e.g. "studysync")
 * 3. In the project dashboard, click the Web icon </> ("Add app")
 * 4. Copy the `firebaseConfig` keys into the object below
 * 5. In Firebase sidebar: Go to "Build" -> "Firestore Database" -> "Create database"
 *    -> Start in "Test mode" (allows read & write for development)
 * 
 * NOTE: You can also enter or paste your Firebase config directly in the website UI
 * by clicking the "Cloud Sync" badge in the top navigation or under Admin -> Cloud & Sync!
 */
window.STUDYSYNC_FIREBASE_CONFIG = {
  // Your Firebase API Key (starts with "AIzaSy...")
  apiKey: "",

  // Your Firebase Project ID (e.g. "studysync-project")
  projectId: "",

  // Your Firebase Auth Domain (e.g. "studysync-project.firebaseapp.com")
  authDomain: "",

  // Your Firebase Storage Bucket (e.g. "studysync-project.appspot.com")
  storageBucket: "",

  // Messaging Sender ID (optional)
  messagingSenderId: "",

  // App ID (e.g. "1:123456789:web:abcdef")
  appId: "",

  // Institute Identifier (Partitioning key for multi-tenant isolation)
  instituteId: "default-institute",

  // Department name
  department: "Computer Science and Engineering"
};

/**
 * Utility helper to set Firebase credentials programmatically or via console:
 * window.setStudySyncFirebase({ apiKey: "...", projectId: "..." })
 * OR paste the full config string / JSON from Firebase Console!
 */
window.setStudySyncFirebase = function(config, instituteId) {
  if (config) {
    if (typeof config === 'string') {
      try {
        config = JSON.parse(config);
      } catch (e) {
        // Try extracting keys from JS object string
        const apiKey = (config.match(/apiKey\s*:\s*["']([^"']+)["']/i) || [])[1];
        const projectId = (config.match(/projectId\s*:\s*["']([^"']+)["']/i) || [])[1];
        const authDomain = (config.match(/authDomain\s*:\s*["']([^"']+)["']/i) || [])[1];
        const storageBucket = (config.match(/storageBucket\s*:\s*["']([^"']+)["']/i) || [])[1];
        const appId = (config.match(/appId\s*:\s*["']([^"']+)["']/i) || [])[1];
        if (apiKey || projectId) {
          config = { apiKey, projectId, authDomain, storageBucket, appId };
        } else {
          console.error('Invalid Firebase config format');
          alert('Could not parse Firebase config. Please provide a valid JSON or JS object.');
          return;
        }
      }
    }
    localStorage.setItem('studysync_firebase_config', JSON.stringify(config));
    localStorage.setItem('studysync_cloud_provider', 'firebase');
  }
  if (instituteId) {
    localStorage.setItem('studysync_institute_id', instituteId.trim());
  }
  console.log('StudySync: Firebase credentials updated. Reloading...');
  window.location.reload();
};
