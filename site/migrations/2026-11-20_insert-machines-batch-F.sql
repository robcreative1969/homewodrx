-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/machines-batch-*.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Machines batch F: 5 machine pages and their movements. Each insert skips a slug that already exists.
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

-- ═══ Curved Treadmill (curved-treadmill) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Curved Treadmill$$,
  $$curved-treadmill$$,
  array[$$glutes$$, $$hamstrings$$, $$quads$$, $$calves$$]::text[],
  $$A curved treadmill has no motor. The running surface is shaped like a shallow U, and you power the belt yourself. Stand at the back and the belt stays still. Step forward up the curve and the belt starts to move. The farther forward you run, the faster it goes; drift back toward the middle to slow down. You set the speed with your body, not with buttons. Woodway Curve and Assault Runner are common examples.

Because you drive the belt, running on a curved treadmill feels harder than running at the same speed on a motorized one, and it pushes you onto the balls of your feet. It's useful when you can't run outside: you can do the run in a workout, like "400 m Run" or "1 Mile Run", or sprint intervals. Many gyms use it for short sprints because you can go from standing still to full speed and back without pressing anything.$$,
  $$There's very little to set. Check whether your model has a resistance setting, usually a lever or knob; start on the lowest one. Most models have a monitor that shows time, distance, speed and pace, and some show calories. Press start or just begin moving, depending on the model. Before you run, stand on the flat part at the back, hold the side rails, and walk slowly up the curve until the belt moves. Practice slowing down by drifting back. Then let go of the rails once you feel steady.$$,
  $$[{"mistake":"Running too far up the front","fix":"Running at the very front makes the belt run away from you. Stay near the middle of the curve, and move forward only as far as you need for your pace."},{"mistake":"Overstriding","fix":"Take shorter, quicker steps under your hips. Reaching far out in front on a curve feels awkward and puts stress on your shins."},{"mistake":"Holding the rails while running","fix":"Use the rails to get on and off and to learn the speed. Let go when you run, so your arms can swing and you stay balanced."},{"mistake":"Stopping dead","fix":"Drift back to slow down, then walk to a stop at the back. Stopping hard at speed can throw you off balance."}]$$::jsonb,
  $$Hold the side rails when you step on and off, and step on from the back. Walk before you jog, and jog before you sprint. Keep a clear space behind the treadmill. The belt keeps moving for a moment after you slow down, so wait until it stops before you step off. Curved treadmills work your calves and shins more than flat running, so build up over a few sessions. Hard sprints push your heart and breathing very high. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have an ankle, knee, hip or back injury, or shin pain, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=DJH44Myxnqs$$
where not exists (select 1 from public.machines where slug = $$curved-treadmill$$);

-- Movement: Curved Treadmill Run
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Curved Treadmill Run$$ as name,
  $$curved-treadmill-run$$ as slug,
  $$cardio$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$cardio$$]::text[] as tags,
  $$Glutes, hamstrings, quadriceps, calves$$ as muscles,
  $$A curved treadmill run is running on a non-motorized curved treadmill. You power the belt yourself: step forward up the curve to speed up and drift back toward the middle to slow down. It is often used for sprint intervals and as an indoor swap for runs in workouts.

Options: walk, jog or sprint, for time, for distance or in intervals.$$ as description,
  to_jsonb(array[$$Start at a walk while holding the side rails.$$, $$Move forward up the curve to speed up.$$, $$Drift back toward the middle to slow down.$$, $$Let go of the rails once you feel steady.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Curved treadmill walk","notes":"Learn to speed up and slow down at a walk."},{"level":"rx","label":"Standard","movement":"Curved Treadmill Run","notes":"Steady run for time or distance."},{"level":"advanced","label":"Advanced","movement":"Curved treadmill sprint intervals","notes":"Short sprints with full slow-down between them."}]$$ as scaling_options,
  $$[{"mistake":"Running too far up the front","fix":"Stay near the middle of the curve unless you are sprinting."},{"mistake":"Stopping suddenly","fix":"Drift back and slow down before you step off."}]$$ as common_faults,
  null as youtube_url,
  array[$$curved treadmill$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Forward to speed up, back to slow down.$$ as wod_tip,
  array[$$glutes$$, $$hamstrings$$, $$quads$$, $$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$curved-treadmill$$) as machine_id
where not exists (select 1 from public.movements where slug = $$curved-treadmill-run$$);

-- ═══ Stair Climber (stair-climber) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Stair Climber$$,
  $$stair-climber$$,
  array[$$glutes$$, $$quads$$, $$hamstrings$$, $$calves$$]::text[],
  $$A stair climber, or stepmill, is a short moving staircase. The steps turn like an escalator going down, and you climb to stay in place. You set the speed, and the machine keeps the steps moving at that pace. It works your glutes and legs with every step and gets your heart rate up without the impact of running. StairMaster is the best-known example. Some older machines called stair steppers use two pedals instead of real steps; this page covers the moving-stairs type.

In workouts, the stair climber usually shows up as time or floors: "Climb 10 Minutes" or "Climb 20 Floors", often as a warm-up, a steady cardio piece, or a swap for running. It's less common in timed CrossFit-style workouts, because you can't speed up beyond the setting you chose.$$,
  $$Before you step on, find the emergency stop button and learn where it is. On most models, you step onto the bottom step while the machine is stopped, then press start and pick a low speed level. The monitor usually shows time, speed level, steps per minute, floors climbed and calories, and many have preset programs. Some models have a safety clip you attach to your clothing that stops the machine if you fall back. Start slow, hold the side rails lightly for your first few minutes, then raise the speed in small steps.$$,
  $$[{"mistake":"Leaning on the rails","fix":"Hold the rails lightly for balance only. If you're hanging on them to keep up, slow the machine down. Leaning takes the work off your legs."},{"mistake":"Hunching over","fix":"Stand tall with your chest up and a slight forward lean from your hips. Keep your eyes forward, not on your feet."},{"mistake":"Only using your toes","fix":"Put your whole foot on each step and push through your heel and midfoot. Climbing on your toes tires your calves fast."},{"mistake":"Speed too high","fix":"If you're drifting down to the bottom step, the speed is too fast. Lower it until you can stay in the middle of the stairs."}]$$::jsonb,
  $$Know where the emergency stop is before you start. Step on and off only when the steps are stopped. Stay in the middle of the stairs; if you're drifting to the bottom, slow down. Keep your shoelaces tied and loose clothing away from the steps. Hold the rails lightly, and look forward. Muscle fatigue is normal; sharp pain in your knees, hips or ankles is not, so stop if you feel it. Long climbs push your heart and breathing up. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a knee, hip, ankle or back injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=8Y7yTrSJwWU$$
where not exists (select 1 from public.machines where slug = $$stair-climber$$);

-- Movement: Stair Climb
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Stair Climb$$ as name,
  $$stair-climb$$ as slug,
  $$cardio$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$cardio$$]::text[] as tags,
  $$Glutes, quadriceps, hamstrings, calves$$ as muscles,
  $$A stair climb is climbing on a stair climber, the moving staircase also called a stepmill. You set a speed and climb to stay in place. In workouts it usually appears as time or floors, often as a warm-up or a steady cardio piece.

Options: climb steady or in intervals, hold the rails lightly or climb hands-free, and, once you are steady, take every other step (advanced).$$ as description,
  to_jsonb(array[$$Find the emergency stop before you start.$$, $$Start at a low speed and hold the rails lightly.$$, $$Place your whole foot on each step.$$, $$Stand tall rather than leaning on the rails.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Stair climb at a low speed","notes":"Build up time at an easy pace."},{"level":"rx","label":"Standard","movement":"Stair Climb","notes":"Steady pace for time or floors, upright posture."},{"level":"advanced","label":"Advanced","movement":"Stair climb intervals","notes":"Alternate faster and easier periods."}]$$ as scaling_options,
  $$[{"mistake":"Leaning on the rails","fix":"Hold them lightly and stand tall. Lower the speed if you need to lean."},{"mistake":"Climbing on your toes","fix":"Put your whole foot on each step."}]$$ as common_faults,
  null as youtube_url,
  array[$$stair climber$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Stand tall, whole foot on each step.$$ as wod_tip,
  array[$$glutes$$, $$quads$$, $$hamstrings$$, $$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$stair-climber$$) as machine_id
where not exists (select 1 from public.movements where slug = $$stair-climb$$);

-- ═══ Vertical Climber (vertical-climber) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Vertical Climber$$,
  $$vertical-climber$$,
  array[$$glutes$$, $$quads$$, $$hamstrings$$, $$calves$$, $$back$$, $$shoulders$$, $$arms$$, $$core$$]::text[],
  $$A vertical climber copies the action of climbing a ladder or a rock wall. You stand on two pedals and hold two handles on a tall upright mast. As one foot pushes down, the opposite hand pulls down, and the other side rises. Your legs and arms work together, so it's a full-body machine. You stay upright the whole time, and your feet never leave the pedals, so there's no pounding like there is with running. VersaClimber is the best-known example.

On most models, you control the effort with how fast you climb and how long each stroke is. Long, slow strokes feel like a steep hike; short, fast ones feel like a sprint. Some models also have a resistance setting. In workouts, the vertical climber usually shows up as time, distance (feet climbed) or intervals: "Climb 1 Minute", "Climb 500 Feet", or 20 seconds hard, 40 seconds easy. It's a good swap for the rower or air bike when you want to stay upright.$$,
  $$Set the handle height first. On most models, the handles slide up and down the mast or come in a few positions. Stand on the pedals with your legs straight and reach up: set the handles so you can reach the top one without locking your elbow or rising onto your toes. Your model's placard or guide gives its recommended setting. Put your feet in the pedals and tighten the straps across the top of your feet. If your model has a resistance knob, start on a low setting. Then learn the monitor: most show time, feet climbed, steps or strokes per minute, and some show calories. Press start or just begin climbing, depending on the model. Begin with short, easy strokes until you get the rhythm, then lengthen them.$$,
  $$[{"mistake":"Using only your legs","fix":"Pull down with your hands as you push down with the opposite foot. If your arms just ride along, your legs do all the work and tire fast."},{"mistake":"Short, choppy strokes","fix":"Once you have the rhythm, use a long, full stroke. Very short, fast steps feel busy but cut out much of the work."},{"mistake":"Hunching or leaning back","fix":"Stand tall with your chest up and your hips under you. Leaning back pulls on your shoulders; hunching forward rounds your back."},{"mistake":"Same-side arm and leg","fix":"Move opposite arm and leg together, like climbing a real ladder: right foot down with left hand down. Slow down until the pattern feels natural."}]$$::jsonb,
  $$Check the foot straps are tight before you start, so your feet can't slip off the pedals. Make sure the handles are locked at the height you set. Get on and off slowly, with the pedals still, and hold the mast or frame while you step on. Start with short strokes and a slow pace while you learn the rhythm; it can feel awkward for the first few sessions. Keep loose clothing clear of the moving parts. Hard climbing intervals push your heart and breathing very high very quickly. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop and get help if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a shoulder, back, hip or knee injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=O57oycAvg-I$$
where not exists (select 1 from public.machines where slug = $$vertical-climber$$);

-- Movement: Vertical Climb
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Vertical Climb$$ as name,
  $$vertical-climb$$ as slug,
  $$cardio$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$cardio$$]::text[] as tags,
  $$Glutes, quadriceps, hamstrings, calves, lats, shoulders, arms, core$$ as muscles,
  $$A vertical climb is climbing on a vertical climber. As one foot pushes down, the opposite hand pulls down, and you keep a steady rhythm. You control the effort with how fast you climb and how long each stroke is.

Options: climb steady or in intervals, with long strokes or short fast ones, for time or feet climbed.$$ as description,
  to_jsonb(array[$$Start with short, easy strokes to find the rhythm.$$, $$Move your opposite hand and foot together.$$, $$Stay upright with your hips close to the machine.$$, $$Lengthen the strokes once the rhythm feels smooth.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Vertical climb with short, slow strokes","notes":"Build the rhythm first."},{"level":"rx","label":"Standard","movement":"Vertical Climb","notes":"Steady rhythm for time or feet climbed."},{"level":"advanced","label":"Advanced","movement":"Vertical climb intervals","notes":"Alternate fast and easy periods."}]$$ as scaling_options,
  $$[{"mistake":"Using only the arms","fix":"Push with your legs as much as you pull with your arms."},{"mistake":"Leaning back from the machine","fix":"Keep your hips close and your torso upright."}]$$ as common_faults,
  null as youtube_url,
  array[$$vertical climber$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Opposite hand and foot together.$$ as wod_tip,
  array[$$glutes$$, $$quads$$, $$back$$, $$shoulders$$, $$arms$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$vertical-climber$$) as machine_id
where not exists (select 1 from public.movements where slug = $$vertical-climb$$);

-- ═══ Ladder Climber (ladder-climber) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Ladder Climber$$,
  $$ladder-climber$$,
  array[$$glutes$$, $$quads$$, $$hamstrings$$, $$calves$$, $$back$$, $$shoulders$$, $$arms$$, $$core$$]::text[],
  $$A ladder climber is an endless ladder that moves down as you climb up it. The ladder is set at an angle, about like a steep stepladder, and the rungs turn on a loop. You climb hand over hand and foot over foot, and the rungs move under you so you stay in place. Many models use a belt around your waist, attached to a cord, and the machine speeds up when you climb higher and slows down when you drop back, so you set the pace with your body, not with buttons. Jacob's Ladder is the best-known example.

Because you pull with your arms and push with your legs, it's a full-body machine, and your core works to keep you steady. In workouts, the ladder climber usually shows up as time, distance (feet climbed) or intervals: "Climb 2 Minutes", "Climb 300 Feet", or short hard bursts with rest. It's tough from the first minute, so efforts tend to be short.$$,
  $$There's very little to set. If your model has a waist belt, put it on first and adjust its cord or strap. The belt controls the speed: climb higher and the ladder speeds up; drop back and it slows down. Check how your model starts and stops; most start when you begin climbing and slow to a stop when you drop back. Learn the monitor before you start: most show time, feet climbed and speed, and some show calories. Before you go hard, hold the rungs, climb slowly for a minute, and practice slowing down by dropping back a little.$$,
  $$[{"mistake":"Climbing too high","fix":"Climbing near the top makes the ladder run fast and can leave you scrambling. Stay in the middle, and move up only as far as you need for your pace."},{"mistake":"Using only your legs","fix":"Pull with your hands on every rung. Your arms share the work and keep you close to the ladder."},{"mistake":"Reaching too far","fix":"Take steady, medium-length steps and reaches. Very long reaches throw you off balance; very short ones feel frantic."},{"mistake":"Holding your breath","fix":"Keep breathing in a steady rhythm. It's easy to tense up on a ladder, which tires you out fast."}]$$::jsonb,
  $$Learn how your model starts, slows and stops before you climb. Make sure the waist belt is fastened and adjusted if your model has one. Step on and off only when the ladder is stopped. Start slowly, staying low on the ladder, while you get used to the speed. Keep your fingers clear of the frame where the rungs turn over at the top and bottom, and keep loose clothing and shoelaces away from the rungs. Hard climbing pushes your heart and breathing very high very quickly. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop and get help if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a shoulder, back, hip or knee injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=wsIrayNMmlo$$
where not exists (select 1 from public.machines where slug = $$ladder-climber$$);

-- Movement: Ladder Climb
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Ladder Climb$$ as name,
  $$ladder-climb$$ as slug,
  $$cardio$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$cardio$$]::text[] as tags,
  $$Glutes, quadriceps, hamstrings, calves, lats, shoulders, arms, core$$ as muscles,
  $$A ladder climb is climbing on a ladder climber, an angled ladder whose rungs move down as you climb. You climb hand over hand and foot over foot. On many models the machine speeds up when you climb higher and slows when you drop back. Efforts tend to be short because it is hard from the first minute.

Options: climb steady or in intervals, for time or feet climbed.$$ as description,
  to_jsonb(array[$$Start slowly and learn how your model speeds up and slows down.$$, $$Climb hand over hand and foot over foot.$$, $$Keep your body close to the ladder.$$, $$Drop back a little to slow down.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Slow ladder climb","notes":"Climb easy for a minute to learn the speed control."},{"level":"rx","label":"Standard","movement":"Ladder Climb","notes":"Steady climb for time or feet climbed."},{"level":"advanced","label":"Advanced","movement":"Ladder climb intervals","notes":"Short hard efforts with easy climbing between."}]$$ as scaling_options,
  $$[{"mistake":"Climbing too high too fast","fix":"Stay in the middle of the ladder until you know the speed control."},{"mistake":"Reaching too far","fix":"Take short steps and short reaches."}]$$ as common_faults,
  null as youtube_url,
  array[$$ladder climber$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Hand over hand, stay close.$$ as wod_tip,
  array[$$glutes$$, $$quads$$, $$back$$, $$shoulders$$, $$arms$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$ladder-climber$$) as machine_id
where not exists (select 1 from public.movements where slug = $$ladder-climb$$);

-- ═══ Sled (sled) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Sled$$,
  $$sled$$,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$calves$$, $$core$$, $$back$$, $$shoulders$$, $$arms$$]::text[],
  $$A sled is a weighted frame that slides along the floor. You load it with plates, then push it or drag it. There are two main kinds. A push sled, or prowler, has tall upright poles and often low handles too; you lean into it and drive it forward with your legs. A drag sled is a flat base that you pull with a rope, a strap or a harness, walking forward or backward. Many sleds work both ways. Prowler is a well-known brand name for the push type.

Sled work trains your legs hard, and there's very little to learn. In workouts, the sled usually shows up as distance with a set load: "Sled Push 20 m", "Sled Drag 2 × 25 m", or shuttles up and back. It's used for short, hard conditioning efforts and for heavy leg work.$$,
  $$Start with the surface. Sleds slide very differently on turf, rubber floor and concrete, so the same load can feel light on one and very heavy on another. Most sleds are made for turf; on concrete or rough ground they can wear down the floor, scrape, or grab and stop suddenly. Use the lane your gym sets aside for sleds. Then load it. Put plates on the posts evenly, with the heaviest at the bottom. Start with the empty sled or a light load and add weight once you know how it moves on that surface. For a push, choose the high handles (more upright, easier to learn) or the low handles (more forward lean, harder). For a drag, attach the rope or strap to the sled's hook or ring and check the clip is closed. There's no monitor. You'll track distance by the lane markings or a set number of lengths.$$,
  $$[{"mistake":"Standing too upright on the push","fix":"Lean into the sled with your arms fairly straight and your hips low. Your body should form a line from your hands to your back foot."},{"mistake":"Rounding your back","fix":"Keep your back flat and your core braced, especially on the low handles. If your back rounds, raise your hands or lighten the load."},{"mistake":"Long, slow steps","fix":"Take short, quick, powerful steps and push through the ball of your foot. Long reaching steps make you lose speed and balance."},{"mistake":"Pulling the drag with your arms","fix":"On a drag, keep your arms straight and walk it with your legs. If you're yanking the rope with your arms, the sled is too heavy."},{"mistake":"Loading too heavy too soon","fix":"If the sled stops or you can only shuffle, take weight off. Heavy loads are an option later; start with a load you can move at a steady pace."}]$$::jsonb,
  $$Check your lane is clear in front of and behind the sled, and that no one will walk across it. Push and drag only on the surface the sled is made for; a sled that grabs on concrete can stop dead and throw you forward. Load the plates evenly and make sure they sit flat on the posts. To stop safely, ease off over the last few steps rather than stopping dead, and keep your hands on the handles; don't let go and fall forward when the sled stops. On a drag, don't step on the rope or let it wrap around your hands or feet. Wear shoes with good grip. Hard sled efforts push your heart and breathing very high very quickly. Feeling out of breath is normal; chest pain, dizziness or feeling faint is not, so stop and get help if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a heart or breathing condition, check with a doctor before you try hard intervals. If you have a knee, back, hip, ankle or shoulder injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=QaTrePoCT4g$$
where not exists (select 1 from public.machines where slug = $$sled$$);

-- Movement: Sled Drag
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Sled Drag$$ as name,
  $$sled-drag$$ as slug,
  $$fullbody$$ as category,
  $$bodyweight$$ as equipment_category,
  array[$$cardio$$, $$full$$]::text[] as tags,
  $$Quadriceps, glutes, hamstrings, calves, upper back, arms$$ as muscles,
  $$A sled drag is pulling a loaded sled along the floor with a rope, strap or harness. You walk forward with the sled behind you, or walk backward facing it, taking steady steps and keeping the line tight.

Options: drag forward with a harness or strap, or walk backward holding the handles of a strap, which works your quads hard.$$ as description,
  to_jsonb(array[$$Clip the strap or rope to the sled's hook and check it's closed.$$, $$Lean slightly away from the sled and keep the line tight.$$, $$Take short, steady steps.$$, $$Drag in the lane your gym sets aside for sleds.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Sled drag with the empty sled","notes":"Learn how it moves on your floor first."},{"level":"rx","label":"Standard","movement":"Sled Drag","notes":"Steady steps, tight line, set distance."},{"level":"advanced","label":"Advanced","movement":"Backward sled drag","notes":"Walk backward facing the sled, short steps."}]$$ as scaling_options,
  $$[{"mistake":"Jerking the sled","fix":"Take up the slack before each step so the pull is smooth."},{"mistake":"Long, reaching steps","fix":"Keep steps short so your feet stay under you."}]$$ as common_faults,
  null as youtube_url,
  array[$$sled$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Tight line, short steady steps.$$ as wod_tip,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$calves$$, $$back$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$fullbody$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$sled$$) as machine_id
where not exists (select 1 from public.movements where slug = $$sled-drag$$);

-- Existing movement, now linked to this machine: sled-push
update public.movements set machine_id = (select id from public.machines where slug = $$sled$$), updated_at = now()
where slug in ($$sled-push$$) and machine_id is null;

-- Check: every machine in this batch exists and every movement is attached to one of them.
do $check$
declare
  missing int;
begin
  select count(*) into missing from (values ($$curved-treadmill$$), ($$stair-climber$$), ($$vertical-climber$$), ($$ladder-climber$$), ($$sled$$)) as v(slug)
  where not exists (select 1 from public.machines m where m.slug = v.slug);
  if missing > 0 then raise exception '% machine(s) missing after insert', missing; end if;
  select count(*) into missing from public.movements mv
  where mv.slug in ($$curved-treadmill-run$$, $$stair-climb$$, $$vertical-climb$$, $$ladder-climb$$, $$sled-drag$$, $$sled-push$$)
    and (mv.machine_id is null or mv.machine_id not in (select id from public.machines where slug in ($$curved-treadmill$$, $$stair-climber$$, $$vertical-climber$$, $$ladder-climber$$, $$sled$$)));
  if missing > 0 then raise exception '% movement(s) not attached to this batch''s machines', missing; end if;
end
$check$;

commit;
