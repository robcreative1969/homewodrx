-- Audit against CrossFit's official definitions (2026-11-22, Rob's yes):
-- 1. Remove 10 workouts that are not real benchmarks (no official source anywhere).
--    Their addresses forward to the closest real workout (web/next.config.ts).
--    Checked first: no rows in results or featured point at them.
-- 2. Move partner and gym versions of classic workouts to a new "variation" category,
--    shown as "Variations" with a note that they are not official benchmarks.
do $$
declare n int;
begin
  delete from benchmark_workouts where slug in
    ('annie-vs-ghost','swim-fran','running-with-cindy','double-diane','chelsea-challenge',
     'spealler','dietz','hartman','winchester','lt-brad-clark');
  get diagnostics n = row_count;
  if n <> 10 then raise exception 'expected 10 deletes, got %', n; end if;

  update benchmark_workouts set category = 'variation', updated_at = now() where slug in
    ('badass-barbara','battle-buddy','couples-wod','deck-of-cards','death-by-burpees',
     'partner-cindy','partner-death-by-burpees','partner-fran','partner-helen','strict-cindy',
     'tag-team-fgb','bergeron-beep-test','manion-partner','partner-dt','partner-murph');
  get diagnostics n = row_count;
  if n <> 15 then raise exception 'expected 15 variation updates, got %', n; end if;
end $$;
select category, count(*) from benchmark_workouts group by category order by category;
