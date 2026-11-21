import Link from "next/link";
import { signOut } from "@/app/admin/actions";

// The admin's sections. Items without a page yet are listed so the plan is visible,
// but only built ones link anywhere.
const SECTIONS: { href: string; label: string; ready: boolean }[] = [
  { href: "/admin", label: "Dashboard", ready: true },
  { href: "/admin/content", label: "Content", ready: true },
  { href: "/admin/daily", label: "Daily 20", ready: false },
  { href: "/admin/email", label: "Email", ready: false },
  { href: "/admin/members", label: "Members", ready: false },
  { href: "/admin/feedback", label: "Feedback", ready: false },
];

export function AdminNav({ current }: { current: string }) {
  return (
    <nav aria-label="Admin" className="flex flex-wrap items-center gap-2">
      {SECTIONS.map((s) =>
        s.ready ? (
          <Link
            key={s.href}
            href={s.href}
            aria-current={current === s.href ? "page" : undefined}
            className="flex min-h-10 items-center rounded-full border-[1.5px] border-chip-line px-3.5 text-sm font-semibold text-ink no-underline aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-ground"
          >
            {s.label}
          </Link>
        ) : (
          <span key={s.href} className="flex min-h-10 items-center rounded-full border-[1.5px] border-dashed border-line px-3.5 text-sm font-semibold text-ink-3" title="Coming next">
            {s.label}
          </span>
        ),
      )}
      <form action={signOut} className="ml-auto">
        <button type="submit" className="min-h-10 rounded-full px-3.5 text-sm font-semibold text-ink-2">Log out</button>
      </form>
    </nav>
  );
}
