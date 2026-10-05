import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12">
      <p className="m-0 font-mono text-sm font-bold text-accent-text">404</p>
      <h1 className="m-0 text-[32px] leading-tight font-extrabold tracking-tight">We can&apos;t find that page</h1>
      <p className="m-0 text-ink-2">It may have moved or been renamed. Try one of these instead:</p>
      <ul className="m-0 flex flex-wrap gap-2 p-0">
        {[
          ["/workouts", "Workouts"],
          ["/movements", "Movements"],
          ["/stretches", "Stretches"],
          ["/search", "Search"],
        ].map(([href, label]) => (
          <li key={href} className="list-none">
            <Link href={href} className="flex min-h-11 items-center rounded-full border-[1.5px] border-chip-line bg-surface px-4 text-sm font-semibold text-ink no-underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
