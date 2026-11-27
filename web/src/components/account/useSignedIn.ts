"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Whether this browser has a signed-in session, for the header and tab bar. Read in the
 * browser so every page can stay cached and the same for everyone. null = not known yet.
 * It only changes what links show; pages that need an account check on the server.
 */
export function useSignedIn(): boolean | null {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => sub.subscription.unsubscribe();
  }, []);
  return signedIn;
}
