-- "Full Body" had become a catch-all. Re-file 14 movements that don't load the whole body
-- (Rob, 2026-11-22). Category "push" is shown as "Upper Body" and covers pushing and pulling.
do $$
declare n int;
begin
  update movements set category = 'lower', updated_at = now() where category = 'fullbody' and slug in
    ('box-step-overs','box-jump-step-down','broad-jumps','tuck-jumps','skaters','sled-push','sled-drag');
  get diagnostics n = row_count; if n <> 7 then raise exception 'lower: expected 7, got %', n; end if;
  update movements set category = 'cardio', updated_at = now() where category = 'fullbody' and slug in
    ('high-knees','butt-kickers','jumping-jacks','sprint-25m','battle-ropes');
  get diagnostics n = row_count; if n <> 5 then raise exception 'cardio: expected 5, got %', n; end if;
  update movements set category = 'push', updated_at = now() where category = 'fullbody' and slug in
    ('inverted-rows','arm-over-arm-sled-pull');
  get diagnostics n = row_count; if n <> 2 then raise exception 'upper: expected 2, got %', n; end if;
end $$;
select name from movements where category = 'fullbody' order by name;
