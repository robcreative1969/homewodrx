import type { Metadata } from "next";
import Link from "next/link";
import { LibrarySwitch } from "@/components/LibrarySwitch";
import { listMachines, muscleGroupLabels } from "@/lib/machines";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gym machines",
  description: "How to set up and use gym machines safely, with a video, common mistakes and the movements you can do on each one.",
  alternates: { canonical: "https://homewodrx.com/machines" },
};

export default async function MachinesPage() {
  const machines = await listMachines();
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
      <LibrarySwitch current="machines" />
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Machines</h1>
        <p className="m-0 text-ink-2">
          <span className="font-mono font-bold text-ink">{machines.length}</span>{" "}
          {machines.length === 1 ? "machine" : "machines"}, each with setup, common mistakes and a video
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {machines.map((m) => (
          <li key={m.slug}>
            <Link href={`/machines/${m.slug}`} className="flex h-full flex-col gap-0.5 rounded-2xl border border-line bg-surface px-4 py-3 text-ink no-underline">
              <span className="text-[17px] font-bold">{m.name}</span>
              <span className="text-sm text-ink-2">{muscleGroupLabels(m.muscle_groups).join(", ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
