import type { ReactNode } from "react";

// Shared pieces for the account screens (sign up, log in, password, Me).

export const field = "h-12 w-full rounded-xl border-[1.5px] border-chip-line bg-surface px-3.5 text-base text-ink";
export const label = "text-sm font-semibold text-ink-2";
export const primaryButton =
  "flex h-12 w-full items-center justify-center rounded-xl bg-accent font-bold text-accent-ink no-underline disabled:opacity-60";
export const secondaryButton =
  "flex h-12 w-full items-center justify-center rounded-xl border-[1.5px] border-chip-line bg-surface font-bold text-ink no-underline disabled:opacity-60";

export function AuthShell({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 pt-6 pb-28">
      <h1 className="m-0 text-[28px] font-extrabold tracking-tight">{title}</h1>
      {intro ? <div className="m-0 text-ink-2">{intro}</div> : null}
      {children}
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="m-0 text-sm font-semibold text-accent-text">
      {children}
    </p>
  );
}

export function FormNote({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="m-0 rounded-xl border border-line bg-surface-muted p-3.5 text-[15px] text-ink">
      {children}
    </p>
  );
}

/** What a free account gives someone. Shown on the sign-up screen (Q16: explain the value). */
export const ACCOUNT_BENEFITS = [
  "Log your time or score on any workout",
  "See your past scores and your best",
  "Save workouts to come back to",
  "Keep your equipment and units, so the WOD Builder starts with your gear",
];
