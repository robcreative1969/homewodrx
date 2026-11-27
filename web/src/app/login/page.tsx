import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/account";
import { AuthShell, FormNote } from "@/components/account/ui";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

// Shown when an email link couldn't sign someone in (see /auth/callback).
const NOTICES = {
  link: "If you just confirmed your email, you're all set. Log in below.",
  reset: "That reset link has expired or was opened in a different browser. Ask for a new one from Forgot password.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const notice = params.notice === "reset" ? NOTICES.reset : params.notice === "link" ? NOTICES.link : null;
  return (
    <AuthShell title="Log in">
      {notice ? <FormNote>{notice}</FormNote> : null}
      <LoginForm next={next} />
      <p className="m-0 text-center text-ink-2">
        New here?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-accent-text">
          Create a free account
        </Link>
      </p>
    </AuthShell>
  );
}
