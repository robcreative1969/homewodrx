-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-22 in the same format as new-movements-2.sql,
-- following CONTENT-GUIDE.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Four new movement pages for movements used in the Hero workouts Meadows, Weston, Partner Weston, Tumilson and Stephen. Each insert skips a slug that already exists.
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

-- ═══ Inverted Hang Lowers ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Inverted Hang Lowers$$ as name,
  $$inverted-hang-lowers$$ as slug,
  $$gymnastics$$ as category,
  $$rings$$ as equipment_category,
  array[$$core$$, $$pull$$]::text[] as tags,
  $$Lats, shoulders, core, biceps, forearms$$ as muscles,
  $$Inverted hang lowers are a gymnastics movement on the rings. You start upside down in an inverted hang, with your body straight and your feet pointing at the ceiling, then lower yourself slowly to a hang, keeping your body and arms straight the whole way. It builds straight-arm pulling strength in your lats and shoulders and a strong, tight trunk. The Hero workout Meadows uses 25 of these lowers, done slowly.$$ as description,
  to_jsonb(array[$$Set the rings high enough that you can hang with straight arms and your feet clear of the floor.$$, $$To get upside down, tuck your knees to your chest and roll back until your hips are over your hands, then straighten your body.$$, $$Squeeze your glutes and brace your trunk so your body stays in one straight line.$$, $$Keep your arms locked straight and press down on the rings as you lower your feet away from the ceiling.$$, $$Take several seconds to lower to a hang, then tuck and roll back up for the next rep.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Tuck lowers or ring rows","notes":"Lower from an inverted hang with your knees tucked to your chest, or do ring rows to build pulling strength first."},{"level":"scaled","movement":"Single-leg or straddle lowers, or fewer reps","notes":"Keep one knee tucked, or open your legs wide, to shorten the lever; or cut the reps."},{"level":"rx","movement":"Inverted hang lowers","notes":"Slow lowers with a straight body and straight arms; 25 in Meadows."}]$$ as scaling_options,
  $$[{"mistake":"Bending your arms","fix":"Lock your elbows and press down on the rings. If your arms bend, use a tuck or straddle until you can keep them straight."},{"mistake":"Piking or arching","fix":"Squeeze your glutes and brace your trunk so your hips stay in line with your shoulders and feet."},{"mistake":"Dropping fast","fix":"Lower slowly and under control. The slow lower is the point of the movement."},{"mistake":"Going straight to full lowers","fix":"Build up with tuck lowers. If you have a shoulder injury, check with a doctor or physical therapist before training upside down on the rings."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=87U18D1dOqI$$ as youtube_url,
  array[$$gymnastic rings$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$back$$, $$shoulders$$, $$core$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$gymnastics$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$inverted-hang-lowers$$);

-- ═══ Waiter's Walk ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Waiter's Walk$$ as name,
  $$waiters-walk$$ as slug,
  $$dumbbell$$ as category,
  $$dumbbells$$ as equipment_category,
  array[$$overhead$$]::text[] as tags,
  $$Shoulders, triceps, upper back, core, grip$$ as muscles,
  $$The waiter's walk is a one-arm overhead carry. You hold one dumbbell (or a kettlebell) overhead in one hand, with your arm locked and the weight stacked over your shoulder, and walk a set distance. It builds shoulder stability and works your trunk hard to keep you upright against the uneven load. The Hero workout Weston uses 50 meters with the right arm and 50 meters with the left each round, with a 45 lb / 30 lb dumbbell; Partner Weston uses the same carries at 45 lb / 35 lb.$$ as description,
  to_jsonb(array[$$Press or push the dumbbell overhead and lock your elbow before you start walking.$$, $$Stack the weight over your shoulder, with your arm beside your ear and your biceps close to your head.$$, $$Brace your trunk and keep your ribs down so you do not lean back or to the side.$$, $$Walk with short, steady steps and keep your eyes forward.$$, $$Lower the weight to your shoulder under control before you switch arms.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Waiter's walk with a light dumbbell","notes":"Learn the locked, stacked arm with a light weight over a short distance."},{"level":"scaled","movement":"Lighter dumbbell or shorter sections","notes":"Use a lighter dumbbell, or set it down and switch arms more often. If you cannot hold weight overhead comfortably, carry it in the front rack or at your side."},{"level":"rx","movement":"Waiter's walk","notes":"One dumbbell overhead, 50 meters each arm; 45 lb / 30 lb in Weston, 45 lb / 35 lb in Partner Weston."}]$$ as scaling_options,
  $$[{"mistake":"Bent elbow","fix":"Lock your arm straight. A bent elbow makes the triceps do the work and the weight wobbles."},{"mistake":"Weight drifting forward","fix":"Keep the dumbbell over your shoulder and the middle of your foot, with your arm beside your ear."},{"mistake":"Leaning back or to the side","fix":"Brace your trunk and keep your ribs down so your body stays tall and straight."},{"mistake":"Dropping the weight from overhead","fix":"Bring it down to your shoulder under control before you set it down or switch arms."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=Fv2ymK5bwHs$$ as youtube_url,
  array[$$dumbbell$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$shoulders$$, $$arms$$, $$core$$, $$back$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$carry$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$waiters-walk$$);

-- ═══ Dumbbell Burpee Deadlifts ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Dumbbell Burpee Deadlifts$$ as name,
  $$dumbbell-burpee-deadlifts$$ as slug,
  $$fullbody$$ as category,
  $$dumbbells$$ as equipment_category,
  array[$$full$$, $$cardio$$]::text[] as tags,
  $$Glutes, hamstrings, quadriceps, lower back, chest, shoulders, triceps, core, grip$$ as muscles,
  $$The dumbbell burpee deadlift combines a burpee and a deadlift with a pair of dumbbells. You put your hands on the dumbbells, jump or step back to a plank, lower your chest to the floor, push back up, jump your feet in and stand up, deadlifting the dumbbells. It works your legs, hips, back, chest and arms in every rep. The Hero workout Tumilson uses 11 per round for 8 rounds, with 60 lb / 45 lb dumbbells. CrossFit gives no written standard for this movement, so this page describes the common version.$$ as description,
  to_jsonb(array[$$Stand with the dumbbells just outside your feet, handles parallel to each other.$$, $$Hinge or squat down, grip the handles and jump or step back to a plank with your hands still on the dumbbells.$$, $$Lower your chest to the floor, then push back up to the plank.$$, $$Jump your feet in close to the dumbbells, with your back flat.$$, $$Stand up tall, deadlifting the dumbbells, with your arms straight and the weights at your sides.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Step-back burpees and dumbbell deadlifts","notes":"Step back and in instead of jumping, and skip the chest to the floor or use light dumbbells."},{"level":"scaled","movement":"Lighter dumbbells or fewer reps","notes":"Use dumbbells you can keep a flat back with for every rep, or cut the reps per round."},{"level":"rx","movement":"Dumbbell burpee deadlifts","notes":"Chest to the floor and stand tall each rep; 11 per round with 60 lb / 45 lb dumbbells in Tumilson."}]$$ as scaling_options,
  $$[{"mistake":"Rounding your back on the lift","fix":"Jump your feet in close, set a flat back, then stand up with your legs and hips."},{"mistake":"Hands slipping off the handles","fix":"Use hex dumbbells that cannot roll, and grip the middle of each handle."},{"mistake":"Sagging hips in the plank","fix":"Brace your trunk so your body stays in one line as you lower your chest."},{"mistake":"Not standing all the way up","fix":"Finish each rep with your hips and knees fully straight."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=rV4jqEwBs64$$ as youtube_url,
  array[$$dumbbells$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$glutes$$, $$hamstrings$$, $$quads$$, $$back$$, $$core$$, $$chest$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$fullbody$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$dumbbell-burpee-deadlifts$$);

-- ═══ Stiff-Legged Deadlifts ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Stiff-Legged Deadlifts$$ as name,
  $$stiff-legged-deadlifts$$ as slug,
  $$barbell$$ as category,
  $$barbell$$ as equipment_category,
  array[$$lower$$, $$legs-glutes$$]::text[] as tags,
  $$Hamstrings, glutes, lower back, grip$$ as muscles,
  $$The stiff-legged deadlift is a barbell deadlift with your knees nearly straight. You keep a slight, fixed bend in your knees, hinge at the hips with a flat back and lift the bar from the floor, setting it back down on the floor every rep. It puts more of the work on your hamstrings than a regular deadlift, where your knees bend more. It is not the same as a Romanian deadlift, which starts from standing and lowers the bar only as far as your hamstrings allow, without touching the floor. The Hero workout Stephen uses it in a 30-25-20-15-10-5 rep scheme with 95 lb / 65 lb.$$ as description,
  to_jsonb(array[$$Stand with your feet about hip width apart and the bar over the middle of your feet.$$, $$Soften your knees slightly and keep that bend the same for the whole rep.$$, $$Push your hips back and keep your back flat as you reach down to grip the bar just outside your legs.$$, $$Brace your trunk, then stand up by driving your hips forward, keeping the bar close to your legs.$$, $$Lower the bar the same way, hips back and back flat, until it touches the floor.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Romanian deadlift (bodyweight) or a light bar","notes":"Learn the hip hinge with no weight, or with an empty or light bar."},{"level":"scaled","movement":"Lighter bar, or bar raised on plates","notes":"Use less weight, or set the bar on plates or blocks if you cannot reach the floor with a flat back."},{"level":"rx","movement":"Stiff-legged deadlifts","notes":"Bar from the floor each rep with soft, fixed knees; 95 lb / 65 lb in Stephen."}]$$ as scaling_options,
  $$[{"mistake":"Rounding your back to reach the floor","fix":"Stop where your back stays flat. Raise the bar on plates until you have the hamstring range to reach the floor."},{"mistake":"Locking your knees","fix":"Keep a slight bend in your knees. Fully locked knees strain the backs of your knees and your lower back."},{"mistake":"Turning it into a regular deadlift","fix":"Keep your knee bend fixed. If your knees bend more as you go down, the hamstrings do less of the work."},{"mistake":"Bar drifting away from your legs","fix":"Keep the bar close to your legs all the way down and up."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=q3mVYFBaLq4$$ as youtube_url,
  array[$$barbell$$, $$bumper plates$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$hamstrings$$, $$glutes$$, $$back$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$stiff-legged-deadlifts$$);

do $check$
begin
  if (select count(*) from public.movements where slug in ($$inverted-hang-lowers$$, $$waiters-walk$$, $$dumbbell-burpee-deadlifts$$, $$stiff-legged-deadlifts$$)) <> 4 then
    raise exception 'Not all 4 movements are present';
  end if;
end
$check$;

commit;

select slug, name, youtube_url from public.movements
where slug in ($$inverted-hang-lowers$$, $$waiters-walk$$, $$dumbbell-burpee-deadlifts$$, $$stiff-legged-deadlifts$$)
order by slug;
