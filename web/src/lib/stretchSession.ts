// A stretch routine prepared for stretch mode (the follow-along timer). Built on the server
// from a ready-made routine or the Stretch Builder, then handed to the client component.

export type StretchStep = {
  name: string;
  slug?: string | null;
  /** Hold time per side; null for stretches done for reps or breaths (the athlete taps Next). */
  seconds: number | null;
  sides: boolean;
  /** What to do, as written: "45 seconds each side", "10 reps each direction". */
  dose: string;
  /** Rough seconds for a step without a hold time, for the total length. */
  estimate?: number;
  tip?: string | null;
};

export type StretchSession = {
  name: string;
  subtitle: string;
  steps: StretchStep[];
  backHref: string;
};

/** Reads a routine's written dose: "45 seconds each side" → 45 s, both sides. */
export function stepFromDose(name: string, slug: string | null | undefined, dose: string | undefined, tip?: string | null): StretchStep {
  const text = (dose ?? "").trim();
  const sides = /each side|each leg/i.test(text);
  const m = text.match(/^(\d+)\s*(seconds?|minutes?)\b/i);
  // "30 seconds × 2" and similar have more to them than a single hold: tap through those.
  const plain = m && !/[×x]\s*\d/.test(text);
  const seconds = plain ? Number(m[1]) * (/^min/i.test(m[2]) ? 60 : 1) : null;
  return { name, slug, seconds, sides, dose: text || "Hold", tip, estimate: seconds ? undefined : 45 };
}
