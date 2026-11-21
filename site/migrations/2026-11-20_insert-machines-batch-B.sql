-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/machines-batch-*.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Machines batch B: 5 machine pages and their movements. Each insert skips a slug that already exists.
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
    ('machines','name','text'),
    ('machines','slug','text'),
    ('machines','muscle_groups','ARRAY'),
    ('machines','overview','text'),
    ('machines','setup_notes','text'),
    ('machines','common_mistakes','jsonb'),
    ('machines','safety_notes','text'),
    ('machines','youtube_url','text'),
    ('movements','name','text'),
    ('movements','slug','text'),
    ('movements','category','text'),
    ('movements','equipment_category','text'),
    ('movements','tags','ARRAY'),
    ('movements','muscles','text'),
    ('movements','description','text'),
    ('movements','tips','ARRAY'),
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

-- ═══ GHD (Glute-Ham Developer) (ghd-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$GHD (Glute-Ham Developer)$$,
  $$ghd-machine$$,
  array[$$hamstrings$$, $$glutes$$, $$back$$, $$core$$]::text[],
  $$The GHD, short for glute-ham developer, is a padded frame with a hip or thigh pad in front and foot plates with ankle rollers behind. You lock your feet under the rollers and use the pad as a pivot. It is a staple in CrossFit boxes and strength gyms, and it does several jobs: GHD Sit-Ups for your core and hip flexors, hip and back extensions for your glutes, hamstrings and lower back, and the glute-ham raise for your hamstrings.

What you can do depends on how you set it. The distance between the pad and the foot plates changes which part of your body hangs off the pad, and most models let you move the foot plates in and out and up and down. Some frames are fixed and some fold. Check the placard on your machine for how its adjustments lock.$$,
  $$Set the foot plates before you get on. For back extensions and GHD Sit-Ups, set them so your hips sit just off the front edge of the pad. For the glute-ham raise, move them closer so the pad sits on your lower thighs, just above the knees. Lock the adjustment pins fully. Step onto the foot plates, hook your ankles under the rollers and lower yourself onto the pad. Your feet should feel snug, not loose. Start with a few slow, short-range reps on the movement you've set it for before you try a full range.$$,
  $$[{"mistake":"Wrong pad position for the movement","fix":"Hips just off the pad for back extensions and sit-ups, thighs on the pad for glute-ham raises. Reset the foot plates when you switch movements."},{"mistake":"Kicking the legs straight on GHD Sit-Ups","fix":"Don't snap your knees straight hard to come up. That puts a sudden load through your hip flexors and lower back. Start with a short range and build up over sessions."},{"mistake":"Overarching at the top of extensions","fix":"Rise until your body is in a straight line, then stop. Swinging up past straight bends your lower back hard and adds nothing."},{"mistake":"Falling through the glute-ham raise","fix":"Lower only as far as you can control. Use your hands on the floor or a band for help on the way up until you're stronger."}]$$::jsonb,
  $$Check every adjustment pin is fully in before you climb on. Make sure your ankles are snug under the rollers before you lean back or forward. Start with short ranges on your first sessions, especially GHD Sit-Ups: high volumes of them can cause severe muscle soreness, so add reps slowly over several weeks. Keep your hands free to catch yourself on the way down until you're used to the machine. Muscle fatigue is normal; sharp pain in your lower back, hips, hamstrings or knees is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a back, hip, knee or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=QdCzafAXJhY$$
where not exists (select 1 from public.machines where slug = $$ghd-machine$$);

-- Movement: GHD Hip and Back Extension
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$GHD Hip and Back Extension$$ as name,
  $$ghd-hip-and-back-extension$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, hamstrings, spinal erectors$$ as muscles,
  $$The GHD hip and back extension is done face down on the GHD with your hips just off the front of the pad and your ankles under the rollers. You lower your upper body toward the floor, then rise to a straight line: first your hips open, then your back extends. It trains your glutes, hamstrings and lower back together.

Options: for a hip extension only, keep your back flat and move just at the hips; for the full hip and back extension, let your back round slightly at the bottom and roll back up to straight.$$ as description,
  array[$$Set the foot plates so your hips sit just off the front of the pad.$$, $$Hook your ankles snugly under the rollers.$$, $$Lower with control until your hamstrings are stretched.$$, $$Rise until your body is in a straight line, then stop.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Short-range extensions","notes":"Move through half the range on your first sessions."},{"level":"rx","label":"Standard","movement":"GHD Hip and Back Extension","notes":"Full range, rise to straight, no swinging."},{"level":"advanced","label":"Advanced","movement":"Extension holding a plate at your chest","notes":"Add load only once the bodyweight version is smooth."}]$$ as scaling_options,
  $$[{"mistake":"Swinging up past straight","fix":"Stop when your body is in a straight line."},{"mistake":"Hips on the pad","fix":"Move the foot plates so your hips are just off the pad."}]$$ as common_faults,
  null as youtube_url,
  array[$$ghd$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Hips off the pad, rise to straight.$$ as wod_tip,
  array[$$glutes$$, $$hamstrings$$, $$back$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$ghd-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$ghd-hip-and-back-extension$$);

-- Movement: Glute-Ham Raise
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Glute-Ham Raise$$ as name,
  $$glute-ham-raise$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Hamstrings, glutes, calves (secondary)$$ as muscles,
  $$The glute-ham raise is a hard hamstring exercise on the GHD. With the pad on your lower thighs, just above the knees, and your feet pressed into the foot plate, you start upright on your knees and lower your body forward until it is level with the floor, keeping a straight line from knees to head. Then you curl yourself back up with your hamstrings.$$ as description,
  array[$$Set the foot plates so the pad sits just above your knees.$$, $$Keep a straight line from knees to head and squeeze your glutes.$$, $$Lower only as far as you can control.$$, $$Push your toes into the foot plate to curl back up.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Partial range with hands on the floor","notes":"Lower part way and push off the floor to come up."},{"level":"rx","label":"Standard","movement":"Glute-Ham Raise","notes":"Straight line from knees to head, full controlled range."},{"level":"advanced","label":"Advanced","movement":"Glute-ham raise with a slow lowering","notes":"Take 3 to 5 seconds on the way down."}]$$ as scaling_options,
  $$[{"mistake":"Bending at the hips","fix":"Squeeze your glutes to keep your hips straight."},{"mistake":"Dropping too fast","fix":"Lower only as far as you can control, and use your hands when you need to."}]$$ as common_faults,
  null as youtube_url,
  array[$$ghd$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Knees to head straight, lower slowly.$$ as wod_tip,
  array[$$hamstrings$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$ghd-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$glute-ham-raise$$);

-- Existing movement, now linked to this machine: ghd-sit-ups
update public.movements set machine_id = (select id from public.machines where slug = $$ghd-machine$$), updated_at = now()
where slug in ($$ghd-sit-ups$$) and machine_id is null;

-- ═══ Nordic Hamstring Bench (nordic-hamstring-bench) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Nordic Hamstring Bench$$,
  $$nordic-hamstring-bench$$,
  array[$$hamstrings$$]::text[],
  $$The Nordic hamstring bench is a padded kneeling bench with ankle rollers or straps at the back. It holds your feet down so you can do Nordic Hamstring Curls without a partner. You kneel on the pad, lock your ankles in, and lower your upper body toward the floor as slowly as you can, using your hamstrings as the brakes. Then you catch yourself with your hands and push back up, or pull back up if you're strong enough.

The lowering part is the main point of the exercise, and it is hard. Most people can only control part of the way down at first. Many benches are adjustable so the ankle hold fits different leg lengths, and some tilt or have a slanted pad to make it easier. Check the placard or instructions for your bench, since the adjustments differ by brand.$$,
  $$Set the ankle rollers or strap so they sit just above your ankles, at the back of your lower legs, and lock the adjustment. Kneel on the pad with your knees at or just behind its front edge; add extra padding under your knees if needed. Hook your ankles in and check they're snug. Kneel tall so your body is straight from knees to head, with your hips pushed forward. Keep your hands in front of your chest, ready to catch yourself. Do one slow, partial rep to check the setup before your first full set.$$,
  $$[{"mistake":"Bending at the hips","fix":"Keep a straight line from knees to head. If your hips fold back as you lower, your hamstrings get a break. Squeeze your glutes to stay straight."},{"mistake":"Dropping too fast","fix":"Lower as slowly as you can control. When you can't hold it any more, catch yourself with your hands. The slow part is what makes the exercise work."},{"mistake":"Doing too many too soon","fix":"Start with a few reps, a couple of times a week. This exercise causes a lot of soreness when it's new, so build up over several weeks."},{"mistake":"Loose ankle hold","fix":"Lock the rollers or strap snug against your lower legs before you start. If your feet lift, you can tip forward suddenly."}]$$::jsonb,
  $$Check the ankle hold is locked and snug before every set. Keep your hands up and ready so you can catch yourself on the floor. Pad your knees if the bench pad isn't enough. Build up slowly: the exercise causes strong soreness at first, so start with low reps and add a little each week. Muscle fatigue is normal; sharp pain in your hamstrings, knees or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a hamstring, knee, back or other injury, check with a doctor or physical therapist before using this bench.$$,
  $$https://www.youtube.com/watch?v=_e9vFU9-tkc$$
where not exists (select 1 from public.machines where slug = $$nordic-hamstring-bench$$);

-- Existing movement, now linked to this machine: nordic-hamstring-curls
update public.movements set machine_id = (select id from public.machines where slug = $$nordic-hamstring-bench$$), updated_at = now()
where slug in ($$nordic-hamstring-curls$$) and machine_id is null;

-- ═══ Leg Curl Machine (leg-curl-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Leg Curl Machine$$,
  $$leg-curl-machine$$,
  array[$$hamstrings$$]::text[],
  $$The leg curl machine works the hamstrings, the muscles on the back of your thighs. A padded roller sits against your lower legs, just above your heels, and you bend your knees to curl the pad toward you, then straighten your legs back out under control. Your calves help a little, but your hamstrings do most of the work.

There are two common versions. On the seated leg curl you sit upright with a thigh pad holding your legs down and curl the roller down and under you. On the lying leg curl you lie face down and curl the roller up toward your glutes. Both train the same muscles and suit beginners well, since the machine guides the path. Most are weight-stack machines, though some are plate-loaded. Check the placard on your machine for its adjustments.$$,
  $$Start with a light weight. On a seated model, adjust the back pad so your knees line up with the machine's pivot point, usually marked with a colored dot. Set the lower roller just above your heels, then lower the thigh pad until it sits snug on your thighs, just above your knees. On a lying model, lie face down with your knees just off the end of the bench and in line with the pivot, and set the roller just above your heels. Hold the handles. Do one slow test rep to check that the pad stays put and your knees move freely, then set your working weight.$$,
  $$[{"mistake":"Knees out of line with the pivot","fix":"Line your knees up with the machine's pivot point before you start. If they're off, the pad rolls up or down your legs and the movement feels awkward on your knees."},{"mistake":"Lifting your hips (lying version)","fix":"Keep your hips pressed into the bench. If your hips rise as you curl, your lower back takes over. Lighten the weight."},{"mistake":"Letting the weight drop back","fix":"Straighten your legs slowly on the way back. Letting the stack fall loses half the work and lets the plates crash."},{"mistake":"Using a short range","fix":"Curl as far as you comfortably can and return to nearly straight legs. If you can only move the pad a few inches, the weight is too heavy."}]$$::jsonb,
  $$Set the thigh pad or roller before you add weight, and make sure any adjustment pins are fully seated. Lower the weight under control and let the stack touch down gently before you get out. Start light while you learn the machine. Muscle fatigue and cramping in the hamstrings can happen; if a cramp hits, stop and let the weight down slowly. Sharp pain in your knees or the back of your thighs is not normal, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee, hamstring, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=YLJJJYOfSfc$$
where not exists (select 1 from public.machines where slug = $$leg-curl-machine$$);

-- Movement: Seated Leg Curl
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Seated Leg Curl$$ as name,
  $$seated-leg-curl$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Hamstrings, calves (secondary)$$ as muscles,
  $$The seated leg curl is done on a seated leg curl machine. With your knees lined up with the pivot, the thigh pad locking your legs down and the roller just above your heels, you bend your knees to pull the roller down and back, then return under control.

Options: work one leg at a time with a lighter weight to even out a weaker side.$$ as description,
  array[$$Line up your knees with the machine's pivot.$$, $$Lock the thigh pad snug above your knees.$$, $$Curl the roller down and back as far as you can.$$, $$Return slowly without letting the stack slam.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Seated leg curl with the lightest weight","notes":"Learn the range first."},{"level":"rx","label":"Standard","movement":"Seated Leg Curl","notes":"Full range, slow return."},{"level":"advanced","label":"Advanced","movement":"Single-leg seated leg curl","notes":"One leg at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Knees not lined up with the pivot","fix":"Adjust the back pad until they match."},{"mistake":"Letting the weight drop","fix":"Control the return on every rep."}]$$ as common_faults,
  null as youtube_url,
  array[$$leg curl machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Knees on the pivot, slow return.$$ as wod_tip,
  array[$$hamstrings$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$leg-curl-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$seated-leg-curl$$);

-- Movement: Lying Leg Curl
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Lying Leg Curl$$ as name,
  $$lying-leg-curl$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Hamstrings, calves (secondary)$$ as muscles,
  $$The lying leg curl is done face down on a lying leg curl machine. With your knees just off the edge of the pad and the roller just above your heels, you curl the roller toward your glutes, then lower it under control.

Options: work one leg at a time with a lighter weight to even out a weaker side.$$ as description,
  array[$$Lie with your knees just past the edge of the pad.$$, $$Set the roller just above your heels.$$, $$Keep your hips pressed into the pad.$$, $$Curl up, then lower slowly.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Lying leg curl with the lightest weight","notes":"Learn the range first."},{"level":"rx","label":"Standard","movement":"Lying Leg Curl","notes":"Hips down, full range, slow lowering."},{"level":"advanced","label":"Advanced","movement":"Single-leg lying leg curl","notes":"One leg at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Hips lifting off the pad","fix":"Keep your hips down. Lighten the weight if they rise."},{"mistake":"Short reps","fix":"Curl through the full range you can control."}]$$ as common_faults,
  null as youtube_url,
  array[$$leg curl machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Hips down, curl and lower slowly.$$ as wod_tip,
  array[$$hamstrings$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$leg-curl-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$lying-leg-curl$$);

-- ═══ Leg Extension Machine (leg-extension-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Leg Extension Machine$$,
  $$leg-extension-machine$$,
  array[$$quads$$]::text[],
  $$The leg extension machine works the quadriceps, the muscles on the front of your thighs. You sit upright with a padded roller in front of your lower legs, then straighten your knees to lift the pad, and bend them to lower it back down. Your hips stay still, so the quads do nearly all the work.

Because it is easy to learn and the load is simple to adjust, it suits beginners and works well as an add-on after squats or leg presses. You can use both legs or one at a time. Most models are weight-stack machines with an adjustable back pad and roller. Some also let you set where the movement starts. Check the placard on your machine for its adjustments.$$,
  $$Start with a light weight. Sit with your back flat against the back pad. Adjust the back pad so your knees line up with the machine's pivot point, usually marked with a colored dot. Set the roller so it sits on the front of your lower legs, just above your ankles. If your model has a range-of-motion setting, pick a starting angle that is comfortable for your knees. Hold the side handles to keep your hips on the seat. Do one slow test rep, then set your working weight.$$,
  $$[{"mistake":"Knees out of line with the pivot","fix":"Move the back pad until your knees line up with the pivot. If the roller slides up or down your shins as you lift, your setup is off."},{"mistake":"Swinging the weight up","fix":"Lift with a smooth push, not a kick. If you have to throw the weight up, it's too heavy."},{"mistake":"Hips lifting off the seat","fix":"Hold the handles and keep your hips down. If your hips rise as you lift, reduce the weight."},{"mistake":"Dropping the weight on the way down","fix":"Lower the pad under control. Letting it fall puts a jolt through your knees and loses part of the work."}]$$::jsonb,
  $$Set the roller and back pad before you add weight, and make sure any pins are fully seated. Lift and lower with control rather than speed. Start light; this machine puts load right on the knee, so build up the weight over time. Use only a pain-free range. Muscle fatigue and a burning feeling in your thighs are normal; sharp pain in or around your kneecap is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=ZdrskVXxQFs$$
where not exists (select 1 from public.machines where slug = $$leg-extension-machine$$);

-- Movement: Leg Extension
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Leg Extension$$ as name,
  $$leg-extension$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps$$ as muscles,
  $$The leg extension is done on a leg extension machine. Seated with your knees lined up with the pivot and the roller on the front of your lower shins, you straighten your legs to lift the roller, then lower it under control. It works your quads on their own.

Options: work one leg at a time with a lighter weight to even out a weaker side.$$ as description,
  array[$$Line up your knees with the machine's pivot.$$, $$Set the roller on your lower shins, just above your ankles.$$, $$Lift smoothly to straight legs, then lower slowly.$$, $$Use only a range that feels good on your knees.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Leg extension with the lightest weight","notes":"Build up slowly over several sessions."},{"level":"rx","label":"Standard","movement":"Leg Extension","notes":"Smooth lift to straight legs, slow lowering."},{"level":"advanced","label":"Advanced","movement":"Single-leg leg extension","notes":"One leg at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Kicking the weight up","fix":"Lift smoothly. Kicking uses momentum instead of your quads."},{"mistake":"Knees not lined up with the pivot","fix":"Adjust the back pad until they match."}]$$ as common_faults,
  null as youtube_url,
  array[$$leg extension machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Smooth up, slow down.$$ as wod_tip,
  array[$$quads$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$leg-extension-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$leg-extension$$);

-- ═══ Hip Abductor and Adductor Machine (hip-abductor-adductor-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Hip Abductor and Adductor Machine$$,
  $$hip-abductor-adductor-machine$$,
  array[$$glutes$$, $$inner-thighs$$]::text[],
  $$This machine trains the muscles on the outside and inside of your hips. You sit with your back against a pad and your legs resting against two padded arms. In the abductor setting the pads sit on the outside of your knees, and you push your legs apart, which works the outer hip and the side of your glutes. In the adductor setting the pads sit on the inside of your knees, and you squeeze your legs together, which works your inner thighs.

Many gyms have one machine that does both, switched by flipping or swapping the pads. Some gyms have two separate machines. Most are weight-stack machines with a lever that sets how wide your legs start. Check the placard on your machine for how to switch between the two settings and set the starting width.$$,
  $$Start with a light weight. Check which setting the machine is in: pads on the outside of your knees for abduction (pushing out), on the inside for adduction (squeezing in). Switch the pads if needed, following the placard. Sit back with your back flat against the pad and your feet on the foot rests. Use the start-width lever to set a comfortable starting position: for abduction, legs close together; for adduction, legs open only as wide as feels comfortable in your inner thighs. Hold the handles. Do one slow test rep, then set your working weight.$$,
  $$[{"mistake":"Setting the adductor start too wide","fix":"Start with your legs only as wide as feels comfortable. Forcing a big stretch at the start under load can strain your inner thighs. Widen the start over time if you want more range."},{"mistake":"Letting the pads snap back","fix":"Control the return on every rep. If the weight stack crashes, the load is too heavy or you're moving too fast."},{"mistake":"Rocking your upper body","fix":"Keep your back on the pad and your hips still. Leaning forward and back means you're using momentum instead of your hip muscles."},{"mistake":"Rushing through a short range","fix":"Move slowly through the full range you've set, and pause briefly at the end. A slower rep with less weight works the muscle better than fast, short reps."}]$$::jsonb,
  $$Switch the pads and set the start-width lever with no load on, and make sure the pads lock into place before you begin. Keep your hands clear of the pad arms and the pivot when you adjust them. Start light, especially on the adductor setting, since the inner thighs are easy to strain. Return the pads to the start position under control before you get out. Muscle fatigue and a burning feeling are normal; sharp pain in your groin, hips or knees is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a hip, groin, knee or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=fGnpM59aRtI$$
where not exists (select 1 from public.machines where slug = $$hip-abductor-adductor-machine$$);

-- Movement: Hip Abduction
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Hip Abduction$$ as name,
  $$hip-abduction$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Gluteus medius and minimus, outer hips$$ as muscles,
  $$Hip abduction is done on the hip abductor setting of the machine. Seated with the pads on the outside of your knees, you push your legs apart, then bring them back together under control. It trains the muscles on the outside of your hips.

Options: some people lean the torso slightly forward from the hips during the set; keep your back flat if you do.$$ as description,
  array[$$Set the pads on the outside of your knees.$$, $$Sit tall with your back against the pad.$$, $$Push out smoothly, pause, then return slowly.$$, $$Keep the weight from touching down between reps.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Hip abduction with the lightest weight","notes":"Learn the range first."},{"level":"rx","label":"Standard","movement":"Hip Abduction","notes":"Smooth reps, short pause at the widest point."},{"level":"advanced","label":"Advanced","movement":"Hip abduction with a 2-second hold","notes":"Hold the widest point for 2 seconds."}]$$ as scaling_options,
  $$[{"mistake":"Using momentum","fix":"Push out smoothly and return slowly."},{"mistake":"Rocking the torso","fix":"Stay still against the back pad. Lighten the weight if you rock."}]$$ as common_faults,
  null as youtube_url,
  array[$$hip abductor and adductor machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Push out, pause, return slowly.$$ as wod_tip,
  array[$$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$hip-abductor-adductor-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$hip-abduction$$);

-- Movement: Hip Adduction
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Hip Adduction$$ as name,
  $$hip-adduction$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Adductors (inner thighs)$$ as muscles,
  $$Hip adduction is done on the hip adductor setting of the machine. Seated with the pads on the inside of your knees, you squeeze your legs together, then let them open back out under control. It trains your inner thighs.$$ as description,
  array[$$Set the pads on the inside of your knees.$$, $$Choose a starting width that feels comfortable, not a deep stretch.$$, $$Squeeze your legs together smoothly.$$, $$Open back out slowly.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Hip adduction with the lightest weight","notes":"Start with a narrow width and a light load."},{"level":"rx","label":"Standard","movement":"Hip Adduction","notes":"Smooth squeeze, slow return."},{"level":"advanced","label":"Advanced","movement":"Hip adduction with a 2-second squeeze","notes":"Hold the closed position for 2 seconds."}]$$ as scaling_options,
  $$[{"mistake":"Starting too wide","fix":"Set a comfortable starting width. The inner thighs strain easily."},{"mistake":"Letting the legs snap open","fix":"Control the way out on every rep."}]$$ as common_faults,
  null as youtube_url,
  array[$$hip abductor and adductor machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Comfortable width, smooth squeeze.$$ as wod_tip,
  array[$$inner-thighs$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$hip-abductor-adductor-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$hip-adduction$$);

-- Check: every machine in this batch exists and every movement is attached to one of them.
do $check$
declare
  missing int;
begin
  select count(*) into missing from (values ($$ghd-machine$$), ($$nordic-hamstring-bench$$), ($$leg-curl-machine$$), ($$leg-extension-machine$$), ($$hip-abductor-adductor-machine$$)) as v(slug)
  where not exists (select 1 from public.machines m where m.slug = v.slug);
  if missing > 0 then raise exception '% machine(s) missing after insert', missing; end if;
  select count(*) into missing from public.movements mv
  where mv.slug in ($$ghd-hip-and-back-extension$$, $$glute-ham-raise$$, $$seated-leg-curl$$, $$lying-leg-curl$$, $$leg-extension$$, $$hip-abduction$$, $$hip-adduction$$, $$ghd-sit-ups$$, $$nordic-hamstring-curls$$)
    and (mv.machine_id is null or mv.machine_id not in (select id from public.machines where slug in ($$ghd-machine$$, $$nordic-hamstring-bench$$, $$leg-curl-machine$$, $$leg-extension-machine$$, $$hip-abductor-adductor-machine$$)));
  if missing > 0 then raise exception '% movement(s) not attached to this batch''s machines', missing; end if;
end
$check$;

commit;
