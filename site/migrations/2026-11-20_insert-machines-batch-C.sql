-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/machines-batch-*.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Machines batch C: 5 machine pages and their movements. Each insert skips a slug that already exists.
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

-- ═══ Seated Calf Raise Machine (seated-calf-raise-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Seated Calf Raise Machine$$,
  $$seated-calf-raise-machine$$,
  array[$$calves$$]::text[],
  $$The seated calf raise machine works your calves while you sit. You sit with the balls of your feet on a raised foot bar and a padded lever resting on top of your thighs, just above your knees. You lower your heels below the foot bar, then press up onto the balls of your feet to lift the pad, and lower back down under control.

Because your knees stay bent, this machine puts most of the work on the soleus, the deeper calf muscle under the larger gastrocnemius. That makes it a good partner to standing calf raises, which train the calf with your knees straight. Most models are plate-loaded, though some use a weight stack, and almost all have a safety lever that holds the pad in place. Check the placard on your machine for how its lever works.$$,
  $$Start with the machine empty or very light. Sit down and put the balls of your feet on the foot bar, about hip width apart, with your heels hanging off. Adjust the thigh pad so it sits snug on your lower thighs, just above your knees. Press up onto your toes a little to take the weight, then push the safety lever forward to release it. Do one slow test rep: lower your heels as far as is comfortable, then rise as high as you can. Put the safety lever back on before you add plates.$$,
  $$[{"mistake":"Bouncing at the bottom","fix":"Lower your heels slowly and pause for a moment at the bottom before you press up. Bouncing uses the spring in your Achilles tendon instead of your calf muscles."},{"mistake":"Cutting the range short","fix":"Lower your heels below the bar as far as is comfortable and rise as high as you can on each rep. Small, quick pulses with heavy weight do less work."},{"mistake":"Feet too far onto the bar","fix":"Keep only the balls of your feet on the bar. If your whole foot is on it, your heels can't drop and you lose most of the range."},{"mistake":"Pushing the pad up with your hands","fix":"Use the handles or the lever only to get set. If you need your hands to lift the weight, it's too heavy."}]$$::jsonb,
  $$Learn how the safety lever works before you load the machine, and put it back on at the end of every set before you take your feet off the bar. Load and unload plates evenly, and keep the balls of your feet firmly on the bar so they can't slip off. Start light and lower your heels only as far as is comfortable, especially in your first few sessions. Muscle fatigue and a burning feeling in your calves are normal; sharp pain in your Achilles tendon, ankles or knees is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a ankle, Achilles, knee or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=UoYD9G2zSMo$$
where not exists (select 1 from public.machines where slug = $$seated-calf-raise-machine$$);

-- Movement: Seated Calf Raise
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Seated Calf Raise$$ as name,
  $$seated-calf-raise$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Soleus, gastrocnemius (secondary)$$ as muscles,
  $$The seated calf raise is done on the seated calf raise machine. With the pad on your lower thighs and the balls of your feet on the foot bar, you release the safety lever, lower your heels, then press up onto the balls of your feet. With your knees bent, it works mostly the soleus, the deeper calf muscle.

Options: work one leg at a time with a lighter load to even out a weaker side.$$ as description,
  array[$$Set the pad snug on your lower thighs.$$, $$Keep the balls of your feet firmly on the bar.$$, $$Lower your heels as far as is comfortable.$$, $$Rise as high as you can, pause, then lower slowly.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Seated calf raise with no plates","notes":"Learn the range and the safety lever first."},{"level":"rx","label":"Standard","movement":"Seated Calf Raise","notes":"Full range, slow, short pause at the top."},{"level":"advanced","label":"Advanced","movement":"Single-leg seated calf raise","notes":"One leg at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Bouncing at the bottom","fix":"Lower slowly and pause before you rise."},{"mistake":"Cutting the range short","fix":"Use the full range that feels comfortable."}]$$ as common_faults,
  null as youtube_url,
  array[$$seated calf raise machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Slow down, pause, full rise.$$ as wod_tip,
  array[$$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$seated-calf-raise-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$seated-calf-raise$$);

-- ═══ Standing Calf Raise Machine (standing-calf-raise-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Standing Calf Raise Machine$$,
  $$standing-calf-raise-machine$$,
  array[$$calves$$]::text[],
  $$The standing calf raise machine works your calves with your legs straight. You stand under padded shoulder supports with the balls of your feet on a raised step and your heels hanging off. You lower your heels below the step, then rise up onto the balls of your feet to lift the load, and lower back down under control.

With your knees straight, this machine works both main calf muscles: the larger gastrocnemius you can see and the deeper soleus underneath. Pair it with the Seated Calf Raise, which puts more of the work on the soleus. Most models use a weight stack, though some are plate-loaded, and the shoulder pads adjust up and down for your height. Check the placard on your machine for how to adjust the pads.$$,
  $$Start with a light weight. Adjust the shoulder pads so that when you stand under them with your knees straight but not locked, the weight lifts just off its rest. Step onto the platform with the balls of your feet on the edge, about hip width apart, and your heels hanging off. Stand tall under the pads, hold the handles, and do one slow test rep: lower your heels as far as is comfortable, then rise as high as you can. Then set your working weight.$$,
  $$[{"mistake":"Bending your knees to move the weight","fix":"Keep your knees straight but soft for the whole set. If you dip your knees to push the weight up, your legs are doing a mini squat instead of a calf raise. Lighten the load."},{"mistake":"Bouncing at the bottom","fix":"Lower your heels slowly and pause for a moment at the bottom before you rise. Bouncing uses the spring in your Achilles tendon instead of your calf muscles."},{"mistake":"Cutting the range short","fix":"Lower your heels below the step as far as is comfortable and rise as high as you can. Quick half reps with heavy weight do less work."},{"mistake":"Rolling onto the outer edges of your feet","fix":"Press evenly through the balls of your feet, with most of the pressure under your big toe and second toe. Keep your ankles straight, not rolling outward."}]$$::jsonb,
  $$Set the shoulder pads for your height before you add weight. The load sits on your shoulders and runs through your spine, so start light and stand tall. Keep the balls of your feet firmly on the step so they can't slip off. When you finish, lower the weight back onto its rest before you step out from under the pads. Muscle fatigue and a burning feeling in your calves are normal; sharp pain in your Achilles tendon, ankles, knees or back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a ankle, Achilles, knee, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=GAQ-oohMhog$$
where not exists (select 1 from public.machines where slug = $$standing-calf-raise-machine$$);

-- Movement: Standing Calf Raise
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Standing Calf Raise$$ as name,
  $$standing-calf-raise$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Gastrocnemius, soleus$$ as muscles,
  $$The standing calf raise is done on the standing calf raise machine. With the shoulder pads on your shoulders and the balls of your feet on the step, you stand tall, lower your heels below the step, then rise onto your toes. With straight legs, it works both calf muscles.

Options: work one leg at a time with a lighter load to even out a weaker side.$$ as description,
  array[$$Set the shoulder pads for your height before you add weight.$$, $$Stand tall with a soft bend in your knees.$$, $$Keep the balls of your feet firmly on the step.$$, $$Lower slowly, then rise as high as you can.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Bodyweight calf raise on a step","notes":"Learn the full range first."},{"level":"rx","label":"Standard","movement":"Standing Calf Raise","notes":"Full range, slow, short pause at the top."},{"level":"advanced","label":"Advanced","movement":"Single-leg standing calf raise","notes":"One leg at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Bouncing at the bottom","fix":"Lower slowly and pause before you rise."},{"mistake":"Rolling onto the outer edges of your feet","fix":"Press evenly through the balls of your feet."}]$$ as common_faults,
  null as youtube_url,
  array[$$standing calf raise machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Stand tall, slow down, full rise.$$ as wod_tip,
  array[$$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$standing-calf-raise-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$standing-calf-raise$$);

-- ═══ Smith Machine (smith-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Smith Machine$$,
  $$smith-machine$$,
  array[$$quads$$, $$glutes$$, $$chest$$, $$shoulders$$]::text[],
  $$The Smith machine is a barbell fixed inside a frame. The bar slides up and down on rails, so it can only move along one path. Hooks on the bar let you rack it at almost any height: you turn your wrists to unhook it, and turn them back to hook it onto the slots in the frame. Because you don't have to balance the bar, it's a useful way to learn a movement, train alone, or push your legs or chest hard with less to think about.

The fixed path is also the trade-off. The bar moves where the rails go, so you set your body to fit the bar, not the other way around. Most models run straight up and down; some are angled a few degrees, and some let the bar move forward and back as well. Most have adjustable safety stops low on the frame. The bar itself may be counterbalanced, so it can feel lighter (or heavier) than a regular barbell. Check the placard on your machine for the bar's starting weight and how its hooks and stops work.$$,
  $$Start with the empty bar. Set the safety stops just below the lowest point of your movement: for a squat, a little below the bottom of your squat; for a bench press, just above your chest. Set the bar on a hook slot you can reach without standing on your toes or doing a half rep. For squats, step under the bar so it sits across your upper back, then place your feet slightly in front of the bar so you can sit back and down. For pressing, lie on a bench under the bar so it lines up with your mid chest. Practice unhooking and re-hooking the bar a few times before you add weight.$$,
  $$[{"mistake":"Not setting the safety stops","fix":"Set the stops before every session. They're your spotter. If you get stuck, you can lower the bar onto them and slide out."},{"mistake":"Feet directly under the bar for squats","fix":"Because the bar can't move forward or back, standing right under it can push your knees far forward. Step your feet a little in front of the bar until the squat feels balanced."},{"mistake":"Forgetting to hook the bar","fix":"At the end of a set, rotate the bar fully onto a slot and check it's caught before you let go. A half-hooked bar can drop."},{"mistake":"Loading it like a free barbell","fix":"The bar may weigh more or less than a regular barbell, and the guided path changes how heavy it feels. Find your working weight on this machine; don't copy your free-weight numbers."}]$$::jsonb,
  $$Learn how the hooks work before you load the bar: on most models you rotate your wrists to unhook and re-hook it. Set the safety stops at the right height for each movement. Load plates evenly and use collars if your gym has them. Check the bar is fully hooked before you step away or sit up. Start light while you learn the fixed path. Muscle fatigue is normal; sharp pain in your knees, hips, lower back or shoulders is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee, back or shoulder injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=ixKXJr1ltxM$$
where not exists (select 1 from public.machines where slug = $$smith-machine$$);

-- Movement: Smith Machine Squat
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Smith Machine Squat$$ as name,
  $$smith-machine-squat$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps, glutes, hamstrings (secondary)$$ as muscles,
  $$The Smith machine squat is a squat with the bar fixed on the Smith machine's rails. With the bar across your upper back and your feet slightly in front of it, you unhook the bar, squat down to a depth you can control, and stand back up, then hook it again.

Options: change foot position to shift the work, or split your stance for a split squat or reverse lunge.$$ as description,
  array[$$Set the safety stops just below your lowest point.$$, $$Place your feet slightly in front of the bar.$$, $$Rotate the bar off the hooks and brace before you lower.$$, $$Hook the bar fully at the end of the set.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Smith machine squat with the empty bar","notes":"Learn the path and the hooks first."},{"level":"rx","label":"Standard","movement":"Smith Machine Squat","notes":"Controlled depth, knees over toes, bar hooked at the end."},{"level":"advanced","label":"Advanced","movement":"Smith machine split squat","notes":"One leg forward, one back, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Feet directly under the bar","fix":"Step your feet a little forward until the squat feels balanced."},{"mistake":"Forgetting to hook the bar","fix":"Rotate the bar fully onto a slot and check it's caught."}]$$ as common_faults,
  null as youtube_url,
  array[$$smith machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Stops set, feet forward, hook it at the end.$$ as wod_tip,
  array[$$quads$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$smith-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$smith-machine-squat$$);

-- Movement: Smith Machine Bench Press
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Smith Machine Bench Press$$ as name,
  $$smith-machine-bench-press$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Pectorals, front deltoids, triceps$$ as muscles,
  $$The Smith machine bench press is a bench press with the bar on the Smith machine's rails. Lying on a bench under the bar, you unhook it, lower it to your mid-chest, and press it back up, then hook it again.

Options: set the bench to an incline to shift work toward your upper chest, or bring your grip in closer for more triceps.$$ as description,
  array[$$Set the bench so the bar lowers to your mid-chest.$$, $$Set the safety stops just above your chest.$$, $$Grip a little wider than shoulder width.$$, $$Lower under control and press up smoothly.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Smith machine bench press with the empty bar","notes":"Learn the path and the hooks first."},{"level":"rx","label":"Standard","movement":"Smith Machine Bench Press","notes":"Bar to mid-chest, elbows slightly tucked."},{"level":"advanced","label":"Advanced","movement":"Incline Smith machine bench press","notes":"Bench at a low incline, same controlled reps."}]$$ as scaling_options,
  $$[{"mistake":"Bench in the wrong spot","fix":"Move the bench so the bar lowers to your mid-chest, not your neck or stomach."},{"mistake":"Flaring the elbows wide","fix":"Keep your elbows slightly tucked toward your sides."}]$$ as common_faults,
  null as youtube_url,
  array[$$smith machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Bar to mid-chest, stops set.$$ as wod_tip,
  array[$$chest$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$smith-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$smith-machine-bench-press$$);

-- Movement: Smith Machine Hip Thrust
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Smith Machine Hip Thrust$$ as name,
  $$smith-machine-hip-thrust$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, hamstrings (secondary)$$ as muscles,
  $$The Smith machine hip thrust is a hip thrust with the Smith bar across your hips. With your upper back on a bench, a pad on the bar and your feet flat, you drive your hips up until your body is straight from shoulders to knees, then lower under control.

Options: for a glute bridge, lie on the floor instead of using the bench.$$ as description,
  array[$$Put a pad on the bar where it crosses your hips.$$, $$Set the safety stops so the bar can't come down past your start position.$$, $$Place your feet so your shins are about vertical at the top.$$, $$Pause at the top, then lower under control.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Glute bridge on the floor","notes":"Learn the hip drive with no load."},{"level":"rx","label":"Standard","movement":"Smith Machine Hip Thrust","notes":"Full hip extension, short pause at the top."},{"level":"advanced","label":"Advanced","movement":"Smith machine hip thrust with a 3-second hold","notes":"Hold the top for 3 seconds each rep."}]$$ as scaling_options,
  $$[{"mistake":"Arching the lower back at the top","fix":"Stop when your body is straight. Keep your ribs down."},{"mistake":"No pad on the bar","fix":"Use a bar pad so the load sits comfortably on your hips."}]$$ as common_faults,
  null as youtube_url,
  array[$$smith machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Pad on the bar, ribs down, squeeze.$$ as wod_tip,
  array[$$glutes$$, $$hamstrings$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$smith-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$smith-machine-hip-thrust$$);

-- ═══ Plate-Loaded Chest Press Machine (plate-loaded-chest-press-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Plate-Loaded Chest Press Machine$$,
  $$plate-loaded-chest-press-machine$$,
  array[$$chest$$, $$shoulders$$, $$arms$$]::text[],
  $$The plate-loaded chest press is a seated machine for your chest, the front of your shoulders and your triceps. You sit with your back against a pad, take the handles at about chest height, and press them forward until your arms are nearly straight, then bring them back under control. The handles move on lever arms, so the machine sets the path and you don't have to balance a bar.

Many models have independent arms, so each side moves on its own. That lets you press one arm at a time and keeps a stronger side from doing all the work. Some models press straight forward, some press slightly up (incline) or down (decline), and some have a foot bar that moves the handles forward to help you get into position. Check the placard on your machine before your first set, because the seat, handles and start position depend on the model.$$,
  $$Start with the arms empty or very light. Set the seat height so the handles line up with the middle of your chest, not your neck or your stomach. Sit with your back and head against the pad and your feet flat on the floor. If your model has a foot bar, use it to bring the handles forward, take hold of them, then let the bar go. Grip the handles with your wrists straight. Do one slow test rep to check that your shoulders stay back against the pad, then load plates evenly on both sides.$$,
  $$[{"mistake":"Seat set too high or too low","fix":"Line the handles up with the middle of your chest. Too high and your shoulders do more of the work and can feel pinched; too low and you push from your stomach."},{"mistake":"Shoulders rolling forward off the pad","fix":"Keep your shoulder blades back against the pad for the whole rep. If your shoulders lift and round forward at the end of the press, stop just short of that point."},{"mistake":"Letting the handles pull you too far back","fix":"Bring the handles back only as far as your shoulders feel comfortable. A deep stretch with a heavy load puts a lot of stress on the front of the shoulder."},{"mistake":"Arching off the seat to finish a rep","fix":"Keep your hips and back on the pad. If you have to lift your hips or arch hard to move the handles, the weight is too heavy."}]$$::jsonb,
  $$Learn how your model starts and stops before you load it, including the foot bar if it has one. Load and unload plates evenly, and on independent-arm models check that both arms are loaded the same. Return the handles to their rest under control before you let go. Start light while you learn the path of the handles. Muscle fatigue is normal; sharp pain in your shoulders, elbows or chest is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a shoulder, elbow or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=gswqJnwTaa0$$
where not exists (select 1 from public.machines where slug = $$plate-loaded-chest-press-machine$$);

-- Movement: Machine Chest Press
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Chest Press$$ as name,
  $$machine-chest-press$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Pectorals, front deltoids, triceps$$ as muscles,
  $$The machine chest press is done on a plate-loaded chest press. Seated or lying with your back on the pad and the handles at about mid-chest height, you press the handles forward until your arms are nearly straight, then return under control.

Options: on independent-arm models, press one arm at a time to even out a weaker side.$$ as description,
  array[$$Set the seat so the handles line up with your mid-chest.$$, $$Keep your back and head on the pad.$$, $$Press to nearly straight arms, then return slowly.$$, $$Keep your elbows slightly below your shoulders.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Machine chest press with no plates","notes":"Learn the path of the handles first."},{"level":"rx","label":"Standard","movement":"Machine Chest Press","notes":"Back on the pad, controlled press and return."},{"level":"advanced","label":"Advanced","movement":"Single-arm machine chest press","notes":"On independent-arm models, one arm at a time."}]$$ as scaling_options,
  $$[{"mistake":"Seat too high or too low","fix":"Set the handles at mid-chest before you load the machine."},{"mistake":"Shoulders rolling forward","fix":"Keep your shoulder blades back against the pad."}]$$ as common_faults,
  null as youtube_url,
  array[$$plate-loaded chest press machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Handles at mid-chest, back on the pad.$$ as wod_tip,
  array[$$chest$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$plate-loaded-chest-press-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-chest-press$$);

-- ═══ Plate-Loaded Row Machine (plate-loaded-row-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Plate-Loaded Row Machine$$,
  $$plate-loaded-row-machine$$,
  array[$$back$$, $$shoulders$$, $$arms$$]::text[],
  $$Plate-loaded row machines come in two common versions: the high row and the low row. On both, you sit facing the machine with your chest or thighs braced, take the handles in front of you and pull them back toward your body, then let them return under control. Your back does most of the work, with your rear shoulders and biceps helping.

On the high row, the handles start up and in front of you, and you pull down and back toward your chest, a bit like a lat pulldown mixed with a row. It works your lats and upper back. On the low row, the handles start at about chest or stomach height, and you pull straight back toward your stomach. It works your mid back and lats. Many models have independent arms, so you can row one side at a time. Some gyms have both machines, and some have one; designs vary, so check the placard on your machine.$$,
  $$Start with the arms empty or very light. Set the seat so you can just reach the handles with your arms straight and your shoulders stretched forward a little. If your model has a thigh pad (common on high rows), set it snug on top of your thighs. If it has a chest pad (common on low rows), set it so your chest stays on the pad and you can still reach the handles. Sit tall, grip the handles and do one slow test rep. Check that you can pull your elbows back without your chest leaving the pad or your hips lifting, then load plates evenly.$$,
  $$[{"mistake":"Pulling with your arms only","fix":"Start each rep by drawing your shoulder blades back and down, then pull your elbows back. Think of your hands as hooks and lead with your elbows."},{"mistake":"Leaning back to move the weight","fix":"Keep your torso still and your chest on the pad (or your hips on the seat). If you have to rock back to finish a rep, the weight is too heavy."},{"mistake":"Shrugging toward your ears","fix":"Keep your shoulders down and away from your ears as you pull. Shrugging moves the work to your upper traps and neck."},{"mistake":"Letting the handles yank you forward","fix":"Return the handles under control until your arms are straight and you feel a light stretch. Don't let the weight snap your shoulders forward at the end of the rep."}]$$::jsonb,
  $$Learn how your model starts and stops before you load it. Load and unload plates evenly, and on independent-arm models check that both arms are loaded the same. Set the thigh or chest pad before you add weight so you stay locked in place. Return the handles to their rest under control before you let go or stand up. Start light while you learn the path of the handles. Muscle fatigue is normal; sharp pain in your lower back, shoulders or elbows is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a back, shoulder, elbow or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=wWLSErG8qGk$$
where not exists (select 1 from public.machines where slug = $$plate-loaded-row-machine$$);

-- Movement: Machine High Row
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine High Row$$ as name,
  $$machine-high-row$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Latissimus dorsi, rhomboids, rear deltoids, biceps (secondary)$$ as muscles,
  $$The machine high row is done on a plate-loaded high row. Seated with your thighs under the pad, you reach up and forward to the handles and pull them down and back toward your sides, then return under control.

Options: on independent-arm models, row one arm at a time.$$ as description,
  array[$$Set the thigh pad snug so you stay seated.$$, $$Reach up to the handles with your chest tall.$$, $$Pull your elbows down and back toward your hips.$$, $$Return slowly to a full stretch.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Machine high row with no plates","notes":"Learn the path of the handles first."},{"level":"rx","label":"Standard","movement":"Machine High Row","notes":"Elbows down and back, slow return."},{"level":"advanced","label":"Advanced","movement":"Single-arm machine high row","notes":"On independent-arm models, one arm at a time."}]$$ as scaling_options,
  $$[{"mistake":"Leaning back to move the weight","fix":"Keep your torso still. Lighten the load if you rock."},{"mistake":"Pulling with the arms only","fix":"Start each rep by drawing your shoulder blades down."}]$$ as common_faults,
  null as youtube_url,
  array[$$plate-loaded row machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Elbows down and back.$$ as wod_tip,
  array[$$back$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$plate-loaded-row-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-high-row$$);

-- Movement: Machine Low Row
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Low Row$$ as name,
  $$machine-low-row$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Latissimus dorsi, rhomboids, rear deltoids, biceps (secondary)$$ as muscles,
  $$The machine low row is done on a plate-loaded low row. Seated with your chest against the pad, if your model has one, you pull the handles straight back toward your lower ribs, then return under control.

Options: on independent-arm models, row one arm at a time.$$ as description,
  array[$$Set the seat so the handles line up with your lower chest.$$, $$Keep your chest on the pad if your model has one.$$, $$Pull your elbows back past your sides.$$, $$Return slowly to a full stretch.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Machine low row with no plates","notes":"Learn the path of the handles first."},{"level":"rx","label":"Standard","movement":"Machine Low Row","notes":"Elbows back, squeeze, slow return."},{"level":"advanced","label":"Advanced","movement":"Single-arm machine low row","notes":"On independent-arm models, one arm at a time."}]$$ as scaling_options,
  $$[{"mistake":"Rounding the back at the stretch","fix":"Keep your chest tall as the handles go forward."},{"mistake":"Shrugging up","fix":"Keep your shoulders down as you pull."}]$$ as common_faults,
  null as youtube_url,
  array[$$plate-loaded row machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Chest tall, elbows back.$$ as wod_tip,
  array[$$back$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$plate-loaded-row-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-low-row$$);

-- Check: every machine in this batch exists and every movement is attached to one of them.
do $check$
declare
  missing int;
begin
  select count(*) into missing from (values ($$seated-calf-raise-machine$$), ($$standing-calf-raise-machine$$), ($$smith-machine$$), ($$plate-loaded-chest-press-machine$$), ($$plate-loaded-row-machine$$)) as v(slug)
  where not exists (select 1 from public.machines m where m.slug = v.slug);
  if missing > 0 then raise exception '% machine(s) missing after insert', missing; end if;
  select count(*) into missing from public.movements mv
  where mv.slug in ($$seated-calf-raise$$, $$standing-calf-raise$$, $$smith-machine-squat$$, $$smith-machine-bench-press$$, $$smith-machine-hip-thrust$$, $$machine-chest-press$$, $$machine-high-row$$, $$machine-low-row$$)
    and (mv.machine_id is null or mv.machine_id not in (select id from public.machines where slug in ($$seated-calf-raise-machine$$, $$standing-calf-raise-machine$$, $$smith-machine$$, $$plate-loaded-chest-press-machine$$, $$plate-loaded-row-machine$$)));
  if missing > 0 then raise exception '% movement(s) not attached to this batch''s machines', missing; end if;
end
$check$;

commit;
