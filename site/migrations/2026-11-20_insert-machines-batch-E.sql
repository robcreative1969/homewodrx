-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/machines-batch-*.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Machines batch E: 5 machine pages and their movements. Each insert skips a slug that already exists.
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

-- ═══ Landmine Station (landmine-station) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Landmine Station$$,
  $$landmine-station$$,
  array[$$shoulders$$, $$chest$$, $$back$$, $$core$$, $$quads$$, $$glutes$$]::text[],
  $$A landmine is a pivot that holds one end of a barbell. The other end is free, so when you lift it, the bar moves in an arc instead of a straight line. You load plates on the free end and hold the end of the bar or a handle. Many gyms have a landmine attachment on a rack, a plate-loaded post on the floor, or a corner slot in a platform.

The arc makes the landmine a friendly option for pressing and rowing. Pressing up and forward along the arc is often more comfortable for your shoulders than pressing straight overhead. You can also squat holding the end of the bar at your chest, and rotate side to side for your core. Bar length and the pivot style vary by gym, so check the placard or the attachment before you load it.$$,
  $$Make sure the pivot is secure: on a rack it should be locked in place, and a floor unit should be stable on the ground. Slide the end of the barbell fully into the sleeve. Start with the empty bar; it already gives you some load at the end. Add plates to the free end and use a collar. For presses and squats, hold the end of the bar at your chest, with your feet about hip width apart. For rows, stand over the bar, or beside it for single-arm rows, and use a handle if your gym has one.$$,
  $$[{"mistake":"Leaning back to press","fix":"Stay tall, brace your core and press the bar up and forward along the arc. If you have to lean back to finish, lighten the load."},{"mistake":"Rounding your back on rows","fix":"Hinge at your hips with a flat back before you pull. Lighten the load if your back starts to round."},{"mistake":"Pivot not secured","fix":"Check that the attachment is locked to the rack or floor before you load it. A loose pivot can shift or lift as you work."},{"mistake":"Rotating with your lower back","fix":"For rotation work, turn through your hips and feet, keep your arms long and move with control. Start with the empty bar."}]$$::jsonb,
  $$Check that the pivot is secure and the bar is fully in the sleeve before you add weight. Use a collar on the plates. Make sure you have clear space around you, since the free end of the bar moves through a wide arc. Lower the bar to the floor with control; don't drop it. Start light while you learn the arc. Muscle fatigue is normal; sharp pain in your shoulders, lower back or knees is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a shoulder, back or knee injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=9OW4SONxuGI$$
where not exists (select 1 from public.machines where slug = $$landmine-station$$);

-- Movement: Landmine Press
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Landmine Press$$ as name,
  $$landmine-press$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Deltoids, upper chest, triceps, core$$ as muscles,
  $$The landmine press is a press with one end of a barbell anchored in a landmine. Holding the free end at your shoulder, you press it up and forward along its arc until your arm is straight, then lower it back under control. The angled path is often more comfortable for your shoulders than pressing straight overhead.

Options: press with one arm or both hands, standing, in a split stance or half-kneeling.$$ as description,
  array[$$Hold the end of the bar at the front of your shoulder.$$, $$Brace your core and squeeze your glutes.$$, $$Press up and forward to a straight arm.$$, $$Lower under control back to your shoulder.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Landmine press with the empty bar","notes":"Learn the arc first."},{"level":"rx","label":"Standard","movement":"Landmine Press","notes":"Braced torso, full press, controlled lowering."},{"level":"advanced","label":"Advanced","movement":"Half-kneeling landmine press","notes":"Kneel on one knee for more core work."}]$$ as scaling_options,
  $$[{"mistake":"Leaning back","fix":"Brace your core and keep your ribs down."},{"mistake":"Pressing straight up","fix":"Follow the bar's arc up and forward."}]$$ as common_faults,
  null as youtube_url,
  array[$$landmine$$, $$barbell$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Brace, press up and forward.$$ as wod_tip,
  array[$$shoulders$$, $$chest$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$landmine-station$$) as machine_id
where not exists (select 1 from public.movements where slug = $$landmine-press$$);

-- Movement: Landmine Row
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Landmine Row$$ as name,
  $$landmine-row$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Latissimus dorsi, rhomboids, rear deltoids, biceps (secondary)$$ as muscles,
  $$The landmine row is a row with one end of a barbell anchored in a landmine. Hinged forward with a flat back, you pull the free end toward your chest, then lower it under control.

Options: row with both hands using a handle under the bar (T-bar style), or with one arm.$$ as description,
  array[$$Hinge forward with a flat back and soft knees.$$, $$Pull your elbows back past your sides.$$, $$Keep your torso still.$$, $$Lower to a full stretch without rounding.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Landmine row with the empty bar","notes":"Learn the hinge and the pull first."},{"level":"rx","label":"Standard","movement":"Landmine Row","notes":"Flat back, full pull, slow lowering."},{"level":"advanced","label":"Advanced","movement":"Single-arm landmine row","notes":"One arm at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Rounding the back","fix":"Keep your chest up and your back flat."},{"mistake":"Jerking the weight up","fix":"Pull smoothly. Lighten the load if you heave."}]$$ as common_faults,
  null as youtube_url,
  array[$$landmine$$, $$barbell$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Flat back, elbows back.$$ as wod_tip,
  array[$$back$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$landmine-station$$) as machine_id
where not exists (select 1 from public.movements where slug = $$landmine-row$$);

-- Movement: Landmine Squat
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Landmine Squat$$ as name,
  $$landmine-squat$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps, glutes, core$$ as muscles,
  $$The landmine squat is a squat holding the free end of a landmine bar at your chest. Leaning slightly into the bar, you squat down between your feet and stand back up. Holding the weight in front helps you stay upright.

Options: step back into a reverse lunge while holding the bar.$$ as description,
  array[$$Hold the end of the bar at your chest with both hands.$$, $$Stand with your feet about shoulder width apart.$$, $$Squat down between your feet, chest up.$$, $$Stand all the way up.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Landmine squat with the empty bar","notes":"Learn the depth and position first."},{"level":"rx","label":"Standard","movement":"Landmine Squat","notes":"Chest up, full depth you can control."},{"level":"advanced","label":"Advanced","movement":"Landmine reverse lunge","notes":"Step back into a lunge, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Knees caving in","fix":"Push your knees out in line with your toes."},{"mistake":"Leaning too far into the bar","fix":"Stay mostly upright; the bar is a guide, not a crutch."}]$$ as common_faults,
  null as youtube_url,
  array[$$landmine$$, $$barbell$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Chest up, sit between your feet.$$ as wod_tip,
  array[$$quads$$, $$glutes$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$landmine-station$$) as machine_id
where not exists (select 1 from public.movements where slug = $$landmine-squat$$);

-- ═══ Cable Machine (cable-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Cable Machine$$,
  $$cable-machine$$,
  array[$$chest$$, $$back$$, $$shoulders$$, $$arms$$, $$core$$, $$glutes$$]::text[],
  $$A cable machine is a weight stack (or two) connected to a cable that runs through a pulley. You clip on a handle, rope or bar and pull against the cable from almost any angle. Because the pulley slides up and down a tall column, you can set it low, high or anywhere in between. That makes one machine useful for dozens of exercises: rows, chest flys, triceps pushdowns, curls, face pulls and core work.

Many gyms have a dual-pulley version, called a functional trainer or cable crossover, with a column on each side so you can work both arms at once. Single-column cable stations and lat-pulldown combos are common too. Cable machines feel smoother than free weights and keep tension on your muscles through the whole rep. Some models use a pulley ratio, so the number on the stack is not the same as the weight you feel. Check the placard on your machine for the ratio and how to move the pulley.$$,
  $$Pick a light weight first. Set the pulley height for your exercise: low for curls and rows from the floor, about chest height for presses and rows, high for pushdowns and face pulls. Pull the pop pin, slide the pulley to the hole you want, and let the pin click fully into place. Clip the attachment onto the carabiner and check that it's closed. Stand far enough away that the weight lifts slightly off the stack at the start of the rep. Set your feet in a stable stance, often staggered, before you begin.$$,
  $$[{"mistake":"Letting the stack crash","fix":"Return the handle with control and keep a little tension on the cable between reps. A crashing stack means you've lost control of the weight."},{"mistake":"Using your body to move the weight","fix":"Keep your torso steady and let the target muscles do the work. If you have to lean or swing, lighten the weight."},{"mistake":"Pulley pin not fully in","fix":"After you move the pulley, check the pin has clicked into the hole. Pull gently on the cable before you load it."},{"mistake":"Standing in a weak stance","fix":"A cable can pull you off balance. Use a staggered or wide stance, brace your core, and step closer if you're getting pulled forward."}]$$::jsonb,
  $$Check the cable and attachments before you start: look for frayed cable, cracked handles or a carabiner that doesn't close. Make sure the pulley and weight pins are fully seated. Return the weight to the stack slowly before you let go of the handle; letting go mid-rep can whip the handle back toward the machine. Keep your fingers clear of the stack and pulleys. Start light while you learn each exercise. Muscle fatigue is normal; sharp pain in your shoulders, elbows or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a shoulder, elbow, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=KmciXk2pzKk$$
where not exists (select 1 from public.machines where slug = $$cable-machine$$);

-- Movement: Cable Row
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Cable Row$$ as name,
  $$cable-row$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Latissimus dorsi, rhomboids, rear deltoids, biceps (secondary)$$ as muscles,
  $$The cable row is a row on a cable machine. Seated with your feet braced, or standing with the pulley at chest height, you pull the handle toward your lower ribs, then let it return under control.

Options: row seated or standing, with one arm, or with different handles such as a V-handle or a straight bar.$$ as description,
  array[$$Sit or stand tall with a slight bend in your knees.$$, $$Pull your elbows back past your sides.$$, $$Squeeze your shoulder blades together.$$, $$Return slowly to a full stretch.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Cable row with a light weight","notes":"Learn the pull first."},{"level":"rx","label":"Standard","movement":"Cable Row","notes":"Tall torso, full pull, slow return."},{"level":"advanced","label":"Advanced","movement":"Single-arm cable row","notes":"One arm at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Rocking back and forth","fix":"Keep your torso still. Lighten the weight if you rock."},{"mistake":"Shrugging up","fix":"Keep your shoulders down as you pull."}]$$ as common_faults,
  null as youtube_url,
  array[$$cable machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Sit tall, elbows back.$$ as wod_tip,
  array[$$back$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$cable-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$cable-row$$);

-- Movement: Cable Chest Fly
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Cable Chest Fly$$ as name,
  $$cable-chest-fly$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Pectorals, front deltoids$$ as muscles,
  $$The cable chest fly is done standing between the two pulleys of a cable machine. With a handle in each hand and a slight bend in your elbows, you bring your hands together in front of your chest in a wide arc, then open back out under control.

Options: set the pulleys high and pull down, or low and pull up, or work one arm at a time.$$ as description,
  array[$$Set both pulleys at the same height.$$, $$Step forward into a split stance for balance.$$, $$Keep a slight bend in your elbows.$$, $$Bring your hands together, then open slowly.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Cable chest fly with a light weight","notes":"Learn the arc first."},{"level":"rx","label":"Standard","movement":"Cable Chest Fly","notes":"Wide arc, slight elbow bend, slow return."},{"level":"advanced","label":"Advanced","movement":"Single-arm cable chest fly","notes":"One arm at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Stretching too far back","fix":"Open only until your hands are level with your chest."},{"mistake":"Bending the elbows more as you go","fix":"Keep the same elbow bend through the rep."}]$$ as common_faults,
  null as youtube_url,
  array[$$cable machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Slight elbow bend, wide arc.$$ as wod_tip,
  array[$$chest$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$cable-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$cable-chest-fly$$);

-- Movement: Cable Triceps Pushdown
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Cable Triceps Pushdown$$ as name,
  $$cable-triceps-pushdown$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Triceps$$ as muscles,
  $$The cable triceps pushdown is done facing a high pulley. With your elbows at your sides, you push the handle down until your arms are straight, then let it rise back under control.

Options: use a rope or a straight bar, or work one arm at a time.$$ as description,
  array[$$Set the pulley at the top of the column.$$, $$Keep your elbows pinned at your sides.$$, $$Push down until your arms are straight.$$, $$Let the handle rise slowly to about chest height.$$]::text[] as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Cable triceps pushdown with a light weight","notes":"Learn to keep your elbows still."},{"level":"rx","label":"Standard","movement":"Cable Triceps Pushdown","notes":"Elbows at your sides, full lockout, slow return."},{"level":"advanced","label":"Advanced","movement":"Single-arm cable triceps pushdown","notes":"One arm at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Elbows drifting forward","fix":"Pin your elbows at your sides. Lighten the weight if they move."},{"mistake":"Leaning over the handle","fix":"Stand tall so your arms do the work."}]$$ as common_faults,
  null as youtube_url,
  array[$$cable machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Elbows pinned, push to straight.$$ as wod_tip,
  array[$$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$cable-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$cable-triceps-pushdown$$);

-- ═══ Air Bike (air-bike) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Air Bike$$,
  $$air-bike$$,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$shoulders$$, $$arms$$]::text[],
  $$An air bike is a stationary bike with a big fan in place of a flywheel and handles that move with the pedals. As you pedal, you also push and pull the handles, so your legs and upper body work together. The fan is the resistance: the harder you pedal, the more air it pushes and the harder it gets. There are no levels to set. You can go easy for a warm-up or all-out for a sprint on the same machine. You'll also hear it called a fan bike, or by brand names like Assault Bike, Rogue Echo Bike or Schwinn Airdyne.

In workouts, the air bike usually shows up as calories or distance: "Bike 20 Calories", "Bike 1 Mile", or intervals like 20 seconds hard, 40 seconds easy. Calorie counts come from how hard you push, and they don't match from one brand to another, so compare your scores on the same model. Most models also have foot pegs, so you can pedal with your legs only, or rest your feet and push and pull with your arms only.$$,
  $$Set the seat height first. Sit on the bike with one pedal at the bottom: your knee should have a slight bend, not locked straight and not deeply bent. Most models let you slide the seat forward or back too; set it so you can push and pull the handles without your arms locking or your elbows hitting your body. Tighten each knob firmly. Then learn the monitor before you start: most show time, calories, distance, watts and RPM (pedal turns per minute). Many have preset programs for intervals or a target, such as a calorie or distance count. Press the button that starts a count from zero, or just start pedaling, depending on the model.$$,
  $$[{"mistake":"Going all-out from the first second","fix":"The fan pushes back harder the faster you go, so a flat-out start can leave you spent halfway through. Build into the effort over the first few seconds, and pace longer efforts."},{"mistake":"Using only your legs","fix":"Push and pull the handles with every pedal stroke. Your arms share the work, which takes some of the load off your legs."},{"mistake":"Seat too low","fix":"If your knees come up high and your hips rock, raise the seat until your knee keeps only a slight bend at the bottom of the stroke."},{"mistake":"Rocking your upper body","fix":"Brace your core and keep your chest steady. Twisting your shoulders side to side wastes effort and can strain your lower back."}]$$::jsonb,
  $$Keep your hands, feet and loose clothing clear of the fan and the moving handles. The handles keep moving while the pedals turn, so if you want to rest your arms, put your hands on the frame or your lap, not near the handle path. Ease off gradually at the end of a hard effort; the fan and handles take a few seconds to stop. Check the seat knobs are tight before you start. Hard air bike intervals push your heart and breathing very high very quickly. Feeling out of breath is normal; chest pain, dizziness, or feeling faint is not, so stop and get help if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a knee, hip, back or shoulder injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=Sg3Id7Lu8XU$$
where not exists (select 1 from public.machines where slug = $$air-bike$$);

-- Existing movement, now linked to this machine: assault-bike / air-bike
update public.movements set machine_id = (select id from public.machines where slug = $$air-bike$$), updated_at = now()
where slug in ($$assault-bike$$, $$air-bike$$) and machine_id is null;

-- Existing movement, now linked to this machine: assault-bike-calories / air-bike-calories
update public.movements set machine_id = (select id from public.machines where slug = $$air-bike$$), updated_at = now()
where slug in ($$assault-bike-calories$$, $$air-bike-calories$$) and machine_id is null;

-- Existing movement, now linked to this machine: assault-bike-intervals / air-bike-intervals
update public.movements set machine_id = (select id from public.machines where slug = $$air-bike$$), updated_at = now()
where slug in ($$assault-bike-intervals$$, $$air-bike-intervals$$) and machine_id is null;

-- Existing movement, now linked to this machine: echo-bike
update public.movements set machine_id = (select id from public.machines where slug = $$air-bike$$), updated_at = now()
where slug in ($$echo-bike$$) and machine_id is null;

-- ═══ Rowing Machine (rowing-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Rowing Machine$$,
  $$rowing-machine$$,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$back$$, $$arms$$, $$core$$]::text[],
  $$A rowing machine, or rower, copies the stroke of rowing a boat. You sit on a seat that slides along a rail, strap your feet in, and pull a handle attached to a chain or strap. Each stroke starts with your legs, then your body swings back, then your arms pull the handle to your lower ribs. Then you reverse it: arms, body, legs. Most of the power comes from your legs, so it's a full-body machine, not an arm workout.

Most gyms have an air rower, where the handle spins a fan inside a cage. Concept2 is the most common example. The harder you pull, the more resistance you feel. In workouts, the rower usually shows up as distance or calories: "Row 500 m", "1,000 m Row", "Row for Calories", or a 2,000 m test. Some models use water or magnets instead of a fan; the stroke is the same.$$,
  $$Sit on the seat and put your feet in the footrests. Adjust the footrest height so the strap goes across the widest part of your foot, then tighten the strap. On most models, a lower footrest feels better for taller people and a higher one for shorter people. Next, set the damper, the lever on the side of the fan cage. It changes how heavy each stroke feels, not how hard the workout is; you control that by how hard you pull. A middle setting is a good place to start. A higher damper is not a better workout. Then read the monitor: the big number is usually your pace, shown as time per 500 m, so a lower number means you're going faster. It also shows stroke rate (strokes per minute), distance, time, calories and watts. Choose a free session on the monitor, or set a distance, time or calorie target.$$,
  $$[{"mistake":"Pulling with your arms first","fix":"Push with your legs first. Keep your arms straight until your legs are almost flat, then lean back a little, then pull the handle in."},{"mistake":"Rushing back to the front","fix":"Pull hard, then come forward slowly. A common cue is one count to drive back and two counts to return."},{"mistake":"Damper on 10","fix":"A very high damper makes each stroke heavy and tires your back and legs fast. Start around the middle and let your pull set the effort."},{"mistake":"Rounding your back","fix":"Sit tall with your chest up. Hinge forward from your hips at the front of the stroke rather than slumping."},{"mistake":"Knees in the way of the handle","fix":"On the way back, get your arms past your knees before you bend them. On the drive, push your legs down before you pull."}]$$::jsonb,
  $$Check the foot straps are tight before you start, so your feet can't slip out mid-stroke. Keep the chain or strap straight and level. Hold the handle loosely, with your wrists flat. Bring the handle back to the hook or let it return slowly at the end; don't let go mid-stroke. Keep fingers and loose clothing away from the chain where it meets the fan housing. Hard rows push your heart and breathing very high. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop if you feel it. Pain in your lower back is not normal fatigue either. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a back, knee, hip or shoulder injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=4zWu1yuJ0_g$$
where not exists (select 1 from public.machines where slug = $$rowing-machine$$);

-- Existing movement, now linked to this machine: rowing
update public.movements set machine_id = (select id from public.machines where slug = $$rowing-machine$$), updated_at = now()
where slug in ($$rowing$$) and machine_id is null;

-- Existing movement, now linked to this machine: row-for-calories
update public.movements set machine_id = (select id from public.machines where slug = $$rowing-machine$$), updated_at = now()
where slug in ($$row-for-calories$$) and machine_id is null;

-- Existing movement, now linked to this machine: 500m-row
update public.movements set machine_id = (select id from public.machines where slug = $$rowing-machine$$), updated_at = now()
where slug in ($$500m-row$$) and machine_id is null;

-- Existing movement, now linked to this machine: 1000m-row
update public.movements set machine_id = (select id from public.machines where slug = $$rowing-machine$$), updated_at = now()
where slug in ($$1000m-row$$) and machine_id is null;

-- ═══ Ski Erg (ski-erg-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Ski Erg$$,
  $$ski-erg-machine$$,
  array[$$back$$, $$shoulders$$, $$arms$$, $$core$$, $$glutes$$]::text[],
  $$A ski erg copies the arm action of cross-country skiing. You stand facing a tall upright frame and hold two handles on cords. You pull both handles down and back, bending at your hips and knees as you pull, then stand tall again as the cords return. The cords spin a fan at the top, so the harder you pull, the more resistance you feel, just like an air rower. Concept2 SkiErg is the most common example.

The power comes from your whole body, not just your arms: your lats and core pull the handles down, and your hips hinge to add weight to each pull. In workouts it shows up much like the rower: "Ski 500 m", "Ski 15 Calories", or intervals. It's a good swap for rowing or running when you want an upper-body-heavy cardio piece.$$,
  $$Stand facing the machine, about a foot away, with your feet about hip width apart. Most models are used standing on the floor; some come with a floor stand. Set the damper on the fan housing. Like a rower, it changes how heavy each pull feels, not how hard the workout is. Start low to middle. Reach up and grab both handles. The monitor works like the rower's: pace per 500 m (a lower number is faster), stroke rate, distance, time, calories and watts. Choose a free session on the monitor, or set a distance, time or calorie target.$$,
  $$[{"mistake":"Pulling with only your arms","fix":"Start each pull with your lats and keep your arms fairly straight at first. Hinge at your hips and bend your knees a little as the handles come down."},{"mistake":"Squatting instead of hinging","fix":"Push your hips back as you pull, like a short bow. Your knees bend a little, but don't drop into a deep squat on every stroke."},{"mistake":"Finishing too high","fix":"Follow through until your hands pass your hips. Stopping at chest height cuts the stroke short."},{"mistake":"Rounding your back","fix":"Keep your chest up and your back long as you hinge. Brace your core on every pull."}]$$::jsonb,
  $$Check that the machine is stable on the floor or its stand before you start. Leave enough room behind you for your hips to move back. Keep your face and body clear of the handles as they come back up; let them rise under control rather than letting go at the top. Hold the handles loosely so you don't strain your grip. Hard intervals push your heart and breathing very high. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a shoulder, back or elbow injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=9Jqcxr8Iq5E$$
where not exists (select 1 from public.machines where slug = $$ski-erg-machine$$);

-- Existing movement, now linked to this machine: ski-erg
update public.movements set machine_id = (select id from public.machines where slug = $$ski-erg-machine$$), updated_at = now()
where slug in ($$ski-erg$$) and machine_id is null;

-- Check: every machine in this batch exists and every movement is attached to one of them.
do $check$
declare
  missing int;
begin
  select count(*) into missing from (values ($$landmine-station$$), ($$cable-machine$$), ($$air-bike$$), ($$rowing-machine$$), ($$ski-erg-machine$$)) as v(slug)
  where not exists (select 1 from public.machines m where m.slug = v.slug);
  if missing > 0 then raise exception '% machine(s) missing after insert', missing; end if;
  select count(*) into missing from public.movements mv
  where mv.slug in ($$landmine-press$$, $$landmine-row$$, $$landmine-squat$$, $$cable-row$$, $$cable-chest-fly$$, $$cable-triceps-pushdown$$, $$assault-bike$$, $$air-bike$$, $$assault-bike-calories$$, $$air-bike-calories$$, $$assault-bike-intervals$$, $$air-bike-intervals$$, $$echo-bike$$, $$rowing$$, $$row-for-calories$$, $$500m-row$$, $$1000m-row$$, $$ski-erg$$)
    and (mv.machine_id is null or mv.machine_id not in (select id from public.machines where slug in ($$landmine-station$$, $$cable-machine$$, $$air-bike$$, $$rowing-machine$$, $$ski-erg-machine$$)));
  if missing > 0 then raise exception '% movement(s) not attached to this batch''s machines', missing; end if;
end
$check$;

commit;
