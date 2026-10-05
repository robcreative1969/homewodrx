import { getDaily10, getDaily20, isDateString, todayEastern } from "@/lib/daily";

export const dynamic = "force-dynamic";

/**
 * The day's Daily 20 and Daily 10 as JSON (?date=YYYY-MM-DD, default today in US
 * Eastern time). Lets the daily email read the same workout the site shows instead of
 * keeping its own copy of the generator (REBUILD-PLAN.md, switch checklist).
 */
export async function GET(request: Request) {
  const asked = new URL(request.url).searchParams.get("date");
  const date = isDateString(asked) ? asked : todayEastern();
  const [wod, stretch] = await Promise.all([getDaily20(date), getDaily10(date)]);
  return Response.json(
    { date, daily20: wod, daily10: stretch },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
