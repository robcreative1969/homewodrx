import Link from "next/link";

const SECTIONS = [
  { key: "workouts", href: "/workouts", label: "Workouts" },
  { key: "movements", href: "/movements", label: "Movements" },
  { key: "stretches", href: "/stretches", label: "Stretches" },
  { key: "routines", href: "/stretch-routines", label: "Routines" },
  { key: "machines", href: "/machines", label: "Machines" },
] as const;

/** Switches between the five parts of the library (the Library tab's sections). */
export function LibrarySwitch({ current }: { current: (typeof SECTIONS)[number]["key"] }) {
  return (
    <nav aria-label="Library sections">
      <ul className="m-0 grid list-none grid-cols-5 gap-1 rounded-xl bg-surface-muted p-1">
        {SECTIONS.map((s) => {
          const on = s.key === current;
          return (
            <li key={s.key}>
              <Link
                href={s.href}
                aria-current={on ? "page" : undefined}
                className={`flex h-11 items-center justify-center rounded-[9px] text-[11px] font-semibold tracking-tighter min-[360px]:text-[12px] min-[360px]:tracking-tight sm:text-[15px] sm:tracking-normal no-underline ${on ? "bg-ink text-ground" : "text-ink"}`}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
