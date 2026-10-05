import Link from "next/link";

// Phase 0 placeholder: shows the shared layout, type and colors in light and dark.
// Phase 2 replaces it with the real homepage from the mockups.
export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <section className="flex flex-col gap-3.5">
        <p className="m-0 font-mono text-xs uppercase tracking-widest text-ink-3">
          Preview of the rebuild
        </p>
        <h1 className="m-0 text-4xl font-extrabold leading-tight tracking-tight">
          Program your training. Then go do it.
        </h1>
        <p className="m-0 text-lg text-ink-2">
          Benchmark workouts, a WOD Builder and a weekly Planner, for training at the box, the
          health club, or at home.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="https://homewodrx.com/wodbuilder"
            className="flex h-14 items-center justify-center rounded-[14px] bg-accent px-6 text-[17px] font-bold text-accent-ink no-underline"
          >
            Build a workout
          </Link>
          <Link
            href="https://homewodrx.com/daily-wod"
            className="flex h-[50px] items-center justify-center rounded-[14px] border-[1.5px] border-ink bg-surface px-6 font-bold text-ink no-underline"
          >
            See today&apos;s Daily 20
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="m-0 text-lg font-bold">The library</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["204", "Workouts"],
            ["226", "Movements"],
            ["54", "Stretches"],
          ].map(([count, label]) => (
            <div key={label} className="flex flex-col rounded-[14px] border border-line bg-surface p-3">
              <span className="font-mono text-2xl font-bold">{count}</span>
              <span className="text-sm text-ink-2">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
