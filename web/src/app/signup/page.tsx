import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/account";
import { ACCOUNT_BENEFITS, AuthShell } from "@/components/account/ui";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Create a free account", robots: { index: false } };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const params = await searchParams;
  const next = safeNext(params.next);
  return (
    <AuthShell
      title="Create a free account"
      intro={
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {ACCOUNT_BENEFITS.map((b) => (
            <li key={b} className="flex gap-2.5">
              <span aria-hidden="true" className="font-bold text-accent-text">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      }
    >
      <SignupForm next={next} />
      <p className="m-0 text-center text-ink-2">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-accent-text">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
