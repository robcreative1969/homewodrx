// A workout prepared for workout mode (the timer screen). Built on the server from a
// benchmark workout or The Daily 20, then handed to the client component.

export type SessionMode = "fortime" | "amrap" | "emom" | "tabata" | "circuit";

export type SessionRow = {
  name: string;
  /** Reps per round. One entry repeats every round; a ladder ("21-15-9") has one per round. */
  reps: string[];
  load?: string;
};

export type Session = {
  name: string;
  subtitle: string;
  mode: SessionMode;
  /** AMRAP and EMOM length, or a For Time cap, in minutes. */
  minutes: number | null;
  /** Rounds for For Time and Circuit workouts; null means count rounds without an end. */
  rounds: number | null;
  rows: SessionRow[];
  backHref: string;
};

export function modeFromFormat(format: string | null | undefined): SessionMode {
  const f = (format ?? "").toLowerCase();
  if (f.includes("amrap")) return "amrap";
  if (f.includes("emom")) return "emom";
  if (f.includes("tabata")) return "tabata";
  if (f.includes("circuit")) return "circuit";
  return "fortime";
}

/** "21 – 15 – 9" → ["21", "15", "9"]; "400m" → ["400m"]. */
export function repLadder(reps: string | null | undefined): string[] {
  if (!reps) return [""];
  const parts = reps.split(/\s*[–-]\s*/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 && parts.every((p) => /^\d+$/.test(p)) ? parts : [reps.trim()];
}

export function firstNumber(s: string | null | undefined): number | null {
  const m = (s ?? "").match(/\d+/);
  return m ? Number(m[0]) : null;
}

export function repsForRound(row: SessionRow, round: number) {
  return row.reps.length > 1 ? (row.reps[round - 1] ?? row.reps[row.reps.length - 1]) : row.reps[0];
}
