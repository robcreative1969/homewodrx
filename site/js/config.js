// ============================================================================
// HOMEWODRX CONFIG
// ============================================================================
// STEP 1: Sign up for free at https://supabase.com
// STEP 2: Create a new project
// STEP 3: Go to Settings > API and copy:
//        - Project URL (SUPABASE_URL)
//        - anon/public key (SUPABASE_ANON_KEY)
// STEP 4: Paste them below
// STEP 5: Admin access is now handled via Supabase Auth (no password in source code)

const SUPABASE_URL = 'https://irtppmztpcakanhefljs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydHBwbXp0cGNha2FuaGVmbGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDcxMTcsImV4cCI6MjA5MDEyMzExN30.MmuqyE12kFNJN62JElt6vYMzDJ0z-_SMgMwZRLB0rwg';

// Don't edit below this line
const CONFIG = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isConfigured: () => {
    return SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
           SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
  }
};
