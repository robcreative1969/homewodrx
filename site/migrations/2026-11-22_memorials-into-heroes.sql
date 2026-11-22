-- Memorials & Tributes had one workout (Hotshots 19), which is on CrossFit's official Hero list.
-- Fold it into Hero WODs (Rob, 2026-11-22). Old ?category=memorials links go to the Hero list.
do $$
declare n int;
begin
  update benchmark_workouts set category = 'hero', subcategory = coalesce(subcategory, 'memorial'), updated_at = now()
    where category = 'memorial';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'expected 1 memorial row, got %', n; end if;
end $$;
select category, count(*) from benchmark_workouts group by category order by category;
