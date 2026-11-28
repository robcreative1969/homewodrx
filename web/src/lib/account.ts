// Small helpers shared by the account screens.

/**
 * Where to send someone after they sign in. Only a path on this site is allowed, so a
 * link like /login?next=https://evil.example can't bounce people to another site.
 */
export function safeNext(next: string | string[] | null | undefined, fallback = "/me"): string {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

/** Usernames: 3 to 24 letters, numbers, underscores, dots or hyphens. */
export const USERNAME_PATTERN = /^[A-Za-z0-9_.-]{3,24}$/;

/** Supabase is set to need 8+ characters with letters and digits. */
export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Use both letters and numbers.";
  return null;
}

/** Plain-language versions of the Supabase auth errors people actually hit. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match.";
  if (m.includes("email not confirmed")) return "Confirm your email first. Check your inbox for the link we sent.";
  if (m.includes("already registered") || m.includes("already been registered")) return "There's already an account with that email. Try logging in.";
  if (m.includes("signups not allowed for otp") || m.includes("user not found")) return "There's no account with that email yet. Create a free account instead.";
  if (m.includes("token has expired") || m.includes("otp") && m.includes("invalid")) return "That code didn't work or has expired. Send a new code and use the newest one.";
  if (m.includes("for security purposes")) return "Wait a minute before asking for another code.";
  if (m.includes("captcha")) return "The human check didn't go through. Try again.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many tries. Wait a minute, then try again.";
  if (m.includes("reauthentication")) return "For your security, log out and back in, then change your password.";
  if (m.includes("same as the old") || m.includes("should be different")) return "Choose a password you haven't used here before.";
  if (m.includes("weak") || m.includes("password should")) return "That password is too easy to guess. Use 8+ characters with letters and numbers.";
  return message;
}
