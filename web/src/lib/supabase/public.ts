import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Cache tag on every public library read. Saving in the admin clears it. */
export const LIBRARY_TAG = "library";

/**
 * Anonymous Supabase client for public library data (workouts, movements, stretches,
 * the Daily 20). It sends no cookies, and its reads are kept in Next's data cache for up
 * to an hour, so list pages don't go back to the database on every visit. The admin's
 * save actions call updateTag(LIBRARY_TAG), so edits show at once.
 */
export function publicClient() {
  return createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 3600, tags: [LIBRARY_TAG] } } as RequestInit),
    },
  });
}
