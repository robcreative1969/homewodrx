-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-22 in the same format as new-movements-1.sql,
-- following CONTENT-GUIDE.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Three new movement pages for movements used in the Hero workouts Horton, Kev and Kevin. Each insert skips a slug that already exists.
-- None of these are in auto-generated workouts yet: daily_wod_eligible, warmup_eligible and tabata_suitable are false.
begin;
-- Guard: stop (and change nothing) if a column type is not what this script assumes.
-- Types were read from the live rows through the public API (arrays, JSON text, jsonb); the
-- public key cannot read information_schema, so this check runs at insert time instead.
do $guard$
declare
  bad text;
begin
  select string_agg(want.t || '.' || want.col || ' is ' || coalesce(c.data_type, 'missing'), '; ') into bad
  from (values
    ('movements','name','text'),
    ('movements','slug','text'),
    ('movements','category','text'),
    ('movements','equipment_category','text'),
    ('movements','tags','ARRAY'),
    ('movements','muscles','text'),
    ('movements','description','text'),
    ('movements','tips','jsonb'),
    ('movements','scaling_options','text'),
    ('movements','common_faults','text'),
    ('movements','youtube_url','text'),
    ('movements','equipment','ARRAY'),
    ('movements','daily_wod_eligible','boolean'),
    ('movements','timed','boolean'),
    ('movements','beginner_reps','jsonb'),
    ('movements','intermediate_reps','jsonb'),
    ('movements','advanced_reps','jsonb'),
    ('movements','wod_tip','text'),
    ('movements','muscle_groups','ARRAY'),
    ('movements','warmup_eligible','boolean'),
    ('movements','movement_pattern','text'),
    ('movements','tabata_suitable','boolean'),
    ('movements','machine_id','uuid')
  ) as want(t, col, typ)
  left join information_schema.columns c
    on c.table_schema = 'public' and c.table_name = want.t and c.column_name = want.col
  where c.data_type is distinct from want.typ;
  if bad is not null then
    raise exception 'Column types differ from what this script assumes: %', bad;
  end if;
end
$guard$;

-- ═══ Buddy Carry ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Buddy Carry$$ as name,
  $$buddy-carry$$ as slug,
  $$fullbody$$ as category,
  $$bodyweight$$ as equipment_category,
  '{}'::text[] as tags,
  $$Quadriceps, glutes, hamstrings, back, core, shoulders, grip$$ as muscles,
  $$A buddy carry is carrying a partner over a set distance. The two usual holds are the fireman's carry, with your partner draped across your shoulders, and the piggyback, with your partner on your back. It loads your legs, back, trunk and grip all at once. The partner Hero workout Horton uses a 50-yard buddy carry each round; with no partner, you carry a heavy sandbag instead.$$ as description,
  to_jsonb(array[$$Start with a partner close to your own size until you know how the carry feels.$$, $$For a piggyback, have your partner climb onto your back, then hook your arms under their knees.$$, $$For a fireman's carry, drape your partner across your upper back, wrap one arm around their leg and hold their wrist with that hand.$$, $$Brace your trunk and stand up with your legs, keeping your back flat.$$, $$Walk with short, steady steps and set your partner down feet first, under control.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Sandbag carry (light)","notes":"Hug a light sandbag to your chest to learn the brace and the short, steady steps."},{"level":"scaled","movement":"Heavy sandbag carry or shorter sections","notes":"Carry a heavy sandbag on your shoulder or hugged to your chest, the option Horton gives when you have no partner; or split the distance into shorter sections."},{"level":"rx","movement":"Buddy carry","notes":"Fireman's carry or piggyback; 50 yards each round in Horton."}]$$ as scaling_options,
  $$[{"mistake":"Lifting with a rounded back","fix":"Squat down with a flat back, then stand up with your legs."},{"mistake":"Holding your partner loosely","fix":"Lock your partner in tight to your body. A partner who slides around is harder to carry and easier to drop."},{"mistake":"Long strides","fix":"Take short, quick steps so you stay balanced under the load."},{"mistake":"Dropping your partner at the end","fix":"Agree on how you will set them down before you start, then lower them feet first."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=Dhf44j1yQnE$$ as youtube_url,
  '{}'::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$back$$, $$core$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$carry$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$buddy-carry$$);

-- ═══ Partner Barbell Carry ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Partner Barbell Carry$$ as name,
  $$partner-barbell-carry$$ as slug,
  $$barbell$$ as category,
  $$barbell$$ as equipment_category,
  '{}'::text[] as tags,
  $$Grip, forearms, upper back, shoulders, core, legs$$ as muscles,
  $$The partner barbell carry is two people carrying one loaded barbell together over a set distance. The hold isn't standardized. Two common options are one partner at each end holding the bar at their side like a suitcase, or both partners side by side with the bar in the front rack. Pick the hold you can both keep safely for the whole distance. The partner Hero workout Kev uses a 55-foot carry with its 315 lb / 205 lb deadlift barbell.$$ as description,
  to_jsonb(array[$$Before you lift, agree on the hold and on who calls the lift and the set-down.$$, $$For the suitcase hold, stand at your end facing the way you will walk, grip the bar just inside the plates and keep your feet clear of them.$$, $$For the front rack, take the bar from a rack together rather than cleaning a heavy bar as a pair.$$, $$Lift and lower on the same count, with flat backs, so neither partner takes the whole load.$$, $$Walk at the same pace with short steps, and set the bar down together on the call.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Partner carry with an empty or light bar","notes":"Practise the hold and the calls with a light bar before you add weight."},{"level":"scaled","movement":"Partner barbell carry (lighter) or farmers carry","notes":"Take plates off the bar, or have each partner carry a pair of dumbbells or kettlebells the same distance."},{"level":"rx","movement":"Partner barbell carry","notes":"315 lb / 205 lb barbell in Kev; 55 feet, with any hold you can both keep safely."}]$$ as scaling_options,
  $$[{"mistake":"Not lifting together","fix":"Use a count, such as \"three, two, one, up\", so both ends leave the floor at the same time."},{"mistake":"Rounding the back on the pickup","fix":"Hinge with a flat back and stand up with your legs, as in a deadlift."},{"mistake":"Walking out of step","fix":"Match your partner's pace. If one end rushes, the bar twists and swings."},{"mistake":"One partner letting go","fix":"Set the bar down together on the call. If one of you needs to stop, call it and you both lower the bar."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=axk8Qs_6S_s$$ as youtube_url,
  array[$$barbell$$, $$bumper plates$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$back$$, $$shoulders$$, $$core$$, $$arms$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$carry$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$partner-barbell-carry$$);

-- ═══ Hanging Hip Touches ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Hanging Hip Touches$$ as name,
  $$hanging-hip-touches$$ as slug,
  $$gymnastics$$ as category,
  $$pullupbar$$ as equipment_category,
  array[$$core$$, $$pull$$]::text[] as tags,
  $$Lats, obliques, abs, hip flexors, shoulders, forearms$$ as muscles,
  $$Hanging hip touches are a gymnastics movement on the pull-up bar. From a hang, you pull and turn your body so one hip touches the bar, then lower to a hang and touch the other hip on the next rep. It works your lats, grip and the muscles along the sides of your trunk. The Hero workout Kevin uses 32 hanging hip touches, alternating sides, in each of its 3 rounds.$$ as description,
  to_jsonb(array[$$Start from a still hang with your hands about shoulder width apart and your arms straight.$$, $$Pull down on the bar with your lats as you lift your knees and turn to one side.$$, $$Bring that hip up until it touches the bar.$$, $$Lower under control to a full hang before the next rep.$$, $$Alternate sides on every rep: one hip, then the other.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Hanging knee raises to the side","notes":"Hang from the bar and raise your knees toward one side, then the other."},{"level":"scaled","movement":"Hanging hip touches (bent knees or fewer reps)","notes":"Tuck your knees tight to make the turn easier, or cut the reps."},{"level":"rx","movement":"Hanging hip touches","notes":"One hip touches the bar each rep, alternating sides; 32 per round in Kevin."}]$$ as scaling_options,
  $$[{"mistake":"Swinging into each rep","fix":"Start each rep from a still hang. A big swing makes the turn hard to control."},{"mistake":"Stopping short of the bar","fix":"Pull until your hip actually touches the bar."},{"mistake":"Using the same side every rep","fix":"Alternate hips each rep so both sides do the same work."},{"mistake":"Dropping from the top","fix":"Lower yourself to a full hang under control instead of falling, which is easier on your shoulders."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=SJ3WqnnyvcQ$$ as youtube_url,
  array[$$pull-up bar$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$back$$, $$core$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$core$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$hanging-hip-touches$$);

do $check$
begin
  if (select count(*) from public.movements where slug in ($$buddy-carry$$, $$partner-barbell-carry$$, $$hanging-hip-touches$$)) <> 3 then
    raise exception 'Not all 3 movements are present';
  end if;
end
$check$;

commit;

select slug, name, youtube_url from public.movements
where slug in ($$buddy-carry$$, $$partner-barbell-carry$$, $$hanging-hip-touches$$)
order by slug;
