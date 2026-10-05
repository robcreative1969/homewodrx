import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Anonymous Supabase client for public library data (workouts, movements, stretches).
 * It sends no cookies, so pages using it can be built ahead of time and cached.
 */
export function publicClient() {
  return createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
