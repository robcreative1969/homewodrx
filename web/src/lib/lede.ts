// Splits a long intro into a short lead (shown beside the video on desktop) and the rest
// (shown in its own card below), so the top of the page stays light.
export function splitLede(text: string | null | undefined, max = 180): { lede: string; rest: string } {
  const t = (text ?? "").trim();
  if (t.length <= max + 60) return { lede: t, rest: "" };
  const sentences = t.split(/(?<=[.!?])\s+/);
  let lede = sentences[0];
  let i = 1;
  while (i < sentences.length && lede.length + 1 + sentences[i].length <= max) lede += " " + sentences[i++];
  return { lede, rest: sentences.slice(i).join(" ") };
}
