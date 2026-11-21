-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/movements-batch-1.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Nine new movement pages, plus the workout-tip wording they need. Each insert skips a slug that already exists.
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
    ('movements','machine_id','uuid'),
    ('benchmark_workouts','movements','jsonb'),
    ('benchmark_workouts','coaching_tips','jsonb'),
    ('benchmark_workouts','description','text')
  ) as want(t, col, typ)
  left join information_schema.columns c
    on c.table_schema = 'public' and c.table_name = want.t and c.column_name = want.col
  where c.data_type is distinct from want.typ;
  if bad is not null then
    raise exception 'Column types differ from what this script assumes: %', bad;
  end if;
end
$guard$;

-- ═══ Burpee Box Jump-Over ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Burpee Box Jump-Over$$ as name,
  $$burpee-box-jump-over$$ as slug,
  $$fullbody$$ as category,
  $$box$$ as equipment_category,
  array[$$full$$, $$cardio$$]::text[] as tags,
  $$Full body — chest, shoulders, quads, glutes, calves, core$$ as muscles,
  $$The burpee box jump-over joins a burpee and a jump over a box. Facing the box, you drop to the floor so your chest and thighs touch, stand back up, then jump off both feet onto the box or clear over it, landing on the far side. Turn around and repeat. It is a staple of CrossFit Open workouts, including 17.1 and 21.2, and it builds conditioning and leg power.$$ as description,
  array[$$Face the box for the burpee and get your chest and thighs to the floor every rep.$$, $$Stand up with your feet close to the box so the jump is short.$$, $$Take off with both feet at the same time.$$, $$Jump onto the box and step or hop off the far side, or clear it in one jump if you can do that safely.$$, $$Find a steady pace early, because the burpee spikes your heart rate fast.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Step-out burpee + box step-over","notes":"Step back into the plank and up again, then step up and over a low box."},{"level":"scaled","movement":"Burpee box step-over","notes":"Full burpee, then step up onto the box and step down the far side; use a 20 in / 16 in box."},{"level":"rx","movement":"Burpee box jump-over","notes":"Chest and thighs to the floor, then a two-foot jump onto or over a 24 in / 20 in box."}]$$ as scaling_options,
  $$[{"mistake":"Chest or thighs not touching the floor","fix":"Lower all the way down every rep. A burpee that stops short is a no-rep in competition."},{"mistake":"Stepping up instead of jumping","fix":"For Rx, both feet leave the floor together. If you need to step, use the scaled version."},{"mistake":"Standing too far from the box","fix":"Finish the burpee with your toes close to the box so the jump goes up, not out."},{"mistake":"Rebounding off the far side when tired","fix":"Step down off the box when your legs are fatigued. It is safer for your Achilles and costs little time."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=GLktGkmcvWE$$ as youtube_url,
  array[$$box$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[3,5]$$::jsonb as beginner_reps,
  $$[6,8]$$::jsonb as intermediate_reps,
  $$[10,15]$$::jsonb as advanced_reps,
  $$Chest to floor — two-foot jump over$$ as wod_tip,
  array[$$chest$$, $$shoulders$$, $$quads$$, $$glutes$$, $$calves$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$fullbody$$ as movement_pattern,
  true as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$burpee-box-jump-over$$);

-- ═══ Box Jump-Over ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Box Jump-Over$$ as name,
  $$box-jump-over$$ as slug,
  $$gymnastics$$ as category,
  $$box$$ as equipment_category,
  array[$$lower$$, $$cardio$$]::text[] as tags,
  $$Quadriceps, glutes, calves, hip flexors$$ as muscles,
  $$A box jump-over is a jump from one side of a box to the other. You take off with both feet, land on top of the box or clear it completely, and finish on the far side. Unlike a box jump, you don't have to stand tall on top of the box. It appears in CrossFit Open workouts such as 22.1 and builds leg power and conditioning.$$ as description,
  array[$$Stand close to the box with your feet about hip-width apart.$$, $$Swing your arms and take off with both feet at the same time.$$, $$Land softly on top of the box, then step or hop off the far side.$$, $$Turn around and set your feet before the next jump.$$, $$Step down instead of rebounding once your legs get tired.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Box step-over (low box)","notes":"Step up and over a 12–16 in box to learn the pattern."},{"level":"scaled","movement":"Box step-over","notes":"Step up and over a 20 in / 16 in box; no jump needed."},{"level":"rx","movement":"Box jump-over","notes":"Two-foot takeoff onto or over a 24 in / 20 in box, finishing on the far side."}]$$ as scaling_options,
  $$[{"mistake":"Taking off from one foot","fix":"Both feet leave the floor together. A one-foot takeoff is a step-up, not a jump."},{"mistake":"Standing too far from the box","fix":"Set up close so the jump goes up, not out."},{"mistake":"Rebounding off the floor when tired","fix":"Step down off the box and reset. Fast rebounds under fatigue are a common cause of Achilles injuries."},{"mistake":"Over-jumping the height","fix":"Jump just high enough to land on or clear the box. Extra height wastes energy."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=-Tz4BF2ne2A$$ as youtube_url,
  array[$$box$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[6,8]$$::jsonb as beginner_reps,
  $$[10,12]$$::jsonb as intermediate_reps,
  $$[12,15]$$::jsonb as advanced_reps,
  $$Two-foot takeoff — step down when tired$$ as wod_tip,
  array[$$quads$$, $$glutes$$, $$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  true as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$box-jump-over$$);

-- ═══ Floor Wipers ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Floor Wipers$$ as name,
  $$floor-wipers$$ as slug,
  $$core$$ as category,
  $$barbell$$ as equipment_category,
  array[$$core$$]::text[] as tags,
  $$Obliques, abs, hip flexors, shoulders$$ as muscles,
  $$Floor wipers are a core movement done lying on your back with a loaded barbell held at arm's length above your chest. Keeping your legs together, you lift your feet to touch one end of the bar, lower them back to center, then lift them to the other end. One touch on each side is one rep. The locked-out bar works your shoulders while your abs and obliques move your legs. This is a different movement from Windshield Wipers, where your arms are out on the floor and you lower your legs side to side.$$ as description,
  array[$$Press the bar up from your chest and keep your arms locked the whole set.$$, $$Keep your legs straight and together as you lift them.$$, $$Touch your feet to the plate or the end of the bar, then return to center.$$, $$Lower your legs with control instead of letting them drop.$$, $$Keep your shoulder blades on the floor so the bar stays still over your chest.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Floor wipers (no bar, bent knees)","notes":"Hold your arms straight up and lift bent knees side to side to learn the pattern."},{"level":"scaled","movement":"Floor wipers (light bar)","notes":"Use an empty bar or a light load; keep the arms locked and the legs straight."},{"level":"rx","movement":"Floor wipers","notes":"135 lb / 95 lb in Nutts and Midline March; feet touch each end of the bar for one rep."}]$$ as scaling_options,
  $$[{"mistake":"Bending the elbows","fix":"Keep your arms locked out. If the bar starts to drop toward your chest, rest it on your chest and press it back up before you continue."},{"mistake":"Bending the knees to reach the bar","fix":"Keep your legs straight. Bent knees shorten the lever and make each rep easier than the standard."},{"mistake":"Letting the legs crash to the floor","fix":"Lower your legs slowly through the middle. Dropping them puts a sudden load on your lower back."},{"mistake":"Rolling the shoulders off the floor","fix":"Keep your upper back pinned down so the bar doesn't tip toward the side your legs are moving to."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=f-k09kA8lC8$$ as youtube_url,
  array[$$barbell$$, $$bumper plates$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[6,8]$$::jsonb as beginner_reps,
  $$[10,12]$$::jsonb as intermediate_reps,
  $$[15,20]$$::jsonb as advanced_reps,
  $$Arms locked — feet touch each end of the bar$$ as wod_tip,
  array[$$core$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$core$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$floor-wipers$$);

-- ═══ Handstand Walk ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Handstand Walk$$ as name,
  $$handstand-walk$$ as slug,
  $$gymnastics$$ as category,
  $$bodyweight$$ as equipment_category,
  '{}'::text[] as tags,
  $$Shoulders, triceps, wrists, core, upper back$$ as muscles,
  $$The handstand walk is walking on your hands while upside down. You kick up into a freestanding handstand and move forward with small steps of your hands, keeping your body stacked and tight. CrossFit workouts such as Open 18.4, 19.3 and 20.3 measure it in feet, usually in short sections. It takes shoulder strength, balance and practice, and it builds on the Handstand Hold.$$ as description,
  array[$$Kick up with your hands shoulder-width apart and your fingers spread.$$, $$Squeeze your abs, glutes and legs so your body moves as one piece.$$, $$Shift your weight slightly forward, then take small, quick steps with your hands.$$, $$Keep your eyes on the floor a little ahead of your hands.$$, $$Practice coming down safely by stepping or cartwheeling out before you try for distance.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Wall walk or bear crawl","notes":"Build shoulder strength and comfort upside down before walking on your hands."},{"level":"scaled","movement":"Handstand walk practice (short distances)","notes":"Kick up and take 2–5 hand steps, then come down and reset."},{"level":"rx","movement":"Handstand walk","notes":"Freestanding handstand walk; only your hands touch the floor until the section is done."}]$$ as scaling_options,
  $$[{"mistake":"Arching the back","fix":"Squeeze your glutes and pull your ribs in. A banana-shaped body tips you over."},{"mistake":"Taking big steps","fix":"Keep hand steps small and quick. Big steps throw you off balance."},{"mistake":"Falling over the top","fix":"Learn to step or cartwheel out before training for distance, so a fall is controlled."},{"mistake":"Bending the elbows","fix":"Keep your arms locked and push the floor away through your shoulders."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=FdgJ9jZIT-Q$$ as youtube_url,
  '{}'::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$shoulders$$, $$arms$$, $$core$$, $$back$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$gymnastics$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$handstand-walk$$);

-- ═══ Hang Power Snatch ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Hang Power Snatch$$ as name,
  $$hang-power-snatch$$ as slug,
  $$olympic$$ as category,
  $$barbell$$ as equipment_category,
  '{}'::text[] as tags,
  $$Hamstrings, glutes, traps, shoulders, upper back$$ as muscles,
  $$The hang power snatch takes a barbell from just above the knees to overhead in one fast movement. You start standing with a wide grip, lower the bar to the hang position, then jump, shrug and pull yourself under the bar to catch it overhead with locked arms in a partial squat. Starting from the hang removes the pull from the floor, so it is a common way to learn the snatch and a frequent movement in CrossFit workouts such as Dietz.$$ as description,
  array[$$Use a wide grip so the bar sits in your hip crease when you stand tall.$$, $$Hinge back to just above the knees with your shoulders over the bar.$$, $$Jump hard and shrug, keeping the bar close to your body.$$, $$Pull yourself under fast and punch the bar up to locked arms.$$, $$Catch above parallel, then stand all the way up before the next rep.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"PVC or empty bar hang power snatch","notes":"Learn the hinge, jump and punch under with a PVC pipe or empty bar."},{"level":"scaled","movement":"Hang power snatch (lighter)","notes":"Use a load you can move with locked arms every rep."},{"level":"rx","movement":"Hang power snatch","notes":"75 lb / 55 lb in Dietz; start above the knee, catch above parallel with locked arms."}]$$ as scaling_options,
  $$[{"mistake":"Bending the arms early","fix":"Keep your arms long until your hips have fully opened. Pulling early with the arms slows the bar."},{"mistake":"Bar swinging away from the body","fix":"Keep the bar close as it passes your hips and chest. A looping bar pulls you forward."},{"mistake":"Catching with bent elbows","fix":"Punch up into locked arms. Pressing out a soft catch is a no-rep and strains the elbows and shoulders."},{"mistake":"Not hinging to a real hang","fix":"Push your hips back until the bar is just above the knees, so your legs and hips do the work."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=8AyTzORaBM8$$ as youtube_url,
  array[$$barbell$$, $$bumper plates$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$hamstrings$$, $$glutes$$, $$shoulders$$, $$back$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$olympic$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$hang-power-snatch$$);

-- ═══ Dumbbell Hang Clean and Jerk ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Dumbbell Hang Clean and Jerk$$ as name,
  $$dumbbell-hang-clean-and-jerk$$ as slug,
  $$dumbbell$$ as category,
  $$dumbbells$$ as equipment_category,
  array[$$full$$]::text[] as tags,
  $$Shoulders, traps, quads, glutes, hamstrings, core$$ as muscles,
  $$The dumbbell hang clean and jerk takes one dumbbell from the hang to your shoulder, then overhead. You start with the dumbbell at arm's length beside your leg, hinge slightly, then drive with your hips to clean it onto your shoulder. From there you send it overhead with a push press or a jerk until your arm is locked out. It appears in CrossFit Open 18.1, and Open 25.1 uses the same movement under the name dumbbell hang clean-to-overhead.$$ as description,
  array[$$Start with the dumbbell hanging at arm's length beside your thigh.$$, $$Hinge slightly, then drive with your hips and legs so the dumbbell floats up.$$, $$Pull your elbow up and around fast so the dumbbell lands on the front of your shoulder.$$, $$Dip and drive with your legs to send the dumbbell overhead.$$, $$Finish each rep standing tall with your arm locked and the dumbbell over your shoulder.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Dumbbell hang clean + strict press","notes":"Clean a light dumbbell to the shoulder, pause, then press it overhead."},{"level":"scaled","movement":"Dumbbell hang clean and jerk (lighter)","notes":"Use 35 lb / 20 lb; focus on hip drive and a fast elbow."},{"level":"rx","movement":"Dumbbell hang clean and jerk","notes":"50 lb / 35 lb in Open 18.1; any style overhead, finished with arm, hips and knees fully extended."}]$$ as scaling_options,
  $$[{"mistake":"Curling the dumbbell up","fix":"Let your hips and legs move the dumbbell. Your arm guides it to the shoulder."},{"mistake":"Swinging the dumbbell out in front","fix":"Keep it close to your body so it travels straight up your side."},{"mistake":"Pressing before the dumbbell is settled","fix":"Land the dumbbell on your shoulder, then dip and drive."},{"mistake":"Finishing with a bent arm or bent knees","fix":"Lock the arm and stand tall at the top. A soft finish is a no-rep."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=hTtXNkoqHyY$$ as youtube_url,
  array[$$dumbbell$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[6,8]$$::jsonb as beginner_reps,
  $$[10,12]$$::jsonb as intermediate_reps,
  $$[14,16]$$::jsonb as advanced_reps,
  $$Hips drive the clean — legs drive it overhead$$ as wod_tip,
  array[$$shoulders$$, $$quads$$, $$glutes$$, $$hamstrings$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$fullbody$$ as movement_pattern,
  true as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$dumbbell-hang-clean-and-jerk$$);

-- ═══ Lateral Burpee Over Dumbbell ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Lateral Burpee Over Dumbbell$$ as name,
  $$lateral-burpee-over-dumbbell$$ as slug,
  $$fullbody$$ as category,
  $$dumbbells$$ as equipment_category,
  array[$$full$$, $$cardio$$]::text[] as tags,
  $$Full body — chest, shoulders, quads, glutes, calves, core$$ as muscles,
  $$The lateral burpee over dumbbell is a burpee done beside a dumbbell lying on the floor, finished with a sideways jump over it. You stand side-on to the dumbbell, drop so your chest and thighs touch the floor, stand back up, then jump off both feet sideways over the dumbbell. The next burpee starts on the far side. It appears in CrossFit Open 25.1 and is a compact, low-equipment conditioning movement.$$ as description,
  array[$$Stand side-on to the dumbbell with your feet close to it.$$, $$Lower your chest and thighs to the floor every rep.$$, $$Jump your feet back under you, then jump sideways off both feet.$$, $$Clear the dumbbell with both feet and land ready for the next burpee.$$, $$Keep the jump small, because you only need to clear the dumbbell.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Step-out burpee + lateral step-over","notes":"Step back into the plank and up again, then step sideways over the dumbbell."},{"level":"scaled","movement":"Lateral burpee over dumbbell (step-over)","notes":"Full burpee, then step over the dumbbell one foot at a time."},{"level":"rx","movement":"Lateral burpee over dumbbell","notes":"Chest and thighs to the floor, then a two-foot sideways jump over the dumbbell."}]$$ as scaling_options,
  $$[{"mistake":"Chest or thighs not touching the floor","fix":"Lower all the way down every rep. A burpee that stops short is a no-rep."},{"mistake":"Jumping forward instead of sideways","fix":"Stay side-on to the dumbbell and jump sideways over it."},{"mistake":"One foot at a time over the dumbbell","fix":"For Rx, both feet leave the floor together."},{"mistake":"Landing on the dumbbell","fix":"Look at the dumbbell before each jump and give it enough clearance. It can roll under your foot."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=ZxFVFxMn6GY$$ as youtube_url,
  array[$$dumbbell$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[3,5]$$::jsonb as beginner_reps,
  $$[5,8]$$::jsonb as intermediate_reps,
  $$[10,15]$$::jsonb as advanced_reps,
  $$Chest to floor — small sideways jump, both feet$$ as wod_tip,
  array[$$chest$$, $$shoulders$$, $$quads$$, $$glutes$$, $$calves$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$fullbody$$ as movement_pattern,
  true as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$lateral-burpee-over-dumbbell$$);

-- ═══ Shoulder-to-Overhead ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Shoulder-to-Overhead$$ as name,
  $$shoulder-to-overhead$$ as slug,
  $$barbell$$ as category,
  $$barbell$$ as equipment_category,
  array[$$push$$, $$overhead$$]::text[] as tags,
  $$Shoulders, triceps, upper back, quads, glutes, core$$ as muscles,
  $$Shoulder-to-overhead means moving a barbell from your shoulders to locked out overhead, by any method you choose. A strict press, a push press, a push jerk or a split jerk all count. Each rep starts with the bar in the front rack on your shoulders and finishes with your arms locked, the bar over the middle of your body, and your hips and knees straight. Workouts such as CrossFit Open 13.2 use it so you can pick the fastest method for the weight. See the Overhead Press, Push Press, Push Jerks and Split Jerk pages for how to do each one.$$ as description,
  array[$$Start each rep with the bar resting on your shoulders and your elbows slightly in front of the bar.$$, $$Use the legs with a push press or jerk when the weight is heavy or the reps are high.$$, $$Move your head back out of the way, then push it through once the bar passes your face.$$, $$Lock your arms out with the bar over your shoulders, hips and mid-foot.$$, $$Stand tall with your feet back in line before you lower the bar.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Dumbbell push press","notes":"Learn the dip and drive with light dumbbells before using a barbell."},{"level":"scaled","movement":"Shoulder-to-overhead (lighter)","notes":"Use 75 lb / 55 lb, or a load you can move in sets of 5 or more."},{"level":"rx","movement":"Shoulder-to-overhead","notes":"115 lb / 75 lb in Open 13.2; any method, finished with arms, hips and knees fully extended."}]$$ as scaling_options,
  $$[{"mistake":"Arching the lower back to get under the bar","fix":"Brace your abs and squeeze your glutes. Use your legs (push press or jerk) instead of leaning back."},{"mistake":"Bar finishing in front of the face","fix":"Push your head through at the top so the bar ends over your shoulders and mid-foot."},{"mistake":"Not finishing the rep","fix":"Arms locked, hips and knees straight, and feet back in line. Lowering the bar early is a no-rep."},{"mistake":"Pressing strict when the weight is heavy","fix":"Strict pressing tires your shoulders fast. A dip and drive from the legs saves them for later rounds."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=MDE7fgut2Zs$$ as youtube_url,
  array[$$barbell$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[5,8]$$::jsonb as beginner_reps,
  $$[8,10]$$::jsonb as intermediate_reps,
  $$[10,12]$$::jsonb as advanced_reps,
  $$Any method counts — finish locked out, standing tall$$ as wod_tip,
  array[$$shoulders$$, $$arms$$, $$back$$, $$quads$$, $$glutes$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  true as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$shoulder-to-overhead$$);

-- ═══ Dumbbell Front Squat ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Dumbbell Front Squat$$ as name,
  $$dumbbell-front-squat$$ as slug,
  $$dumbbell$$ as category,
  $$dumbbells$$ as equipment_category,
  array[$$lower$$]::text[] as tags,
  $$Quadriceps, glutes, hamstrings, core, upper back$$ as muscles,
  $$The dumbbell front squat is a squat holding two dumbbells on the front of your shoulders. You stand with the dumbbells resting on your shoulders, squat until your hips drop below your knees, then stand all the way up. Holding the weight in front keeps your chest up and makes your legs and core work hard. CrossFit Open 18.2 uses it with two dumbbells, and it's a good home option when you don't have a barbell.$$ as description,
  array[$$Rest one end of each dumbbell on the front of your shoulders with your elbows pointing forward.$$, $$Stand with your feet about shoulder-width apart and your toes turned out a little.$$, $$Push your knees out over your toes as you squat.$$, $$Squat until your hip crease drops below the top of your knees.$$, $$Drive through your whole foot and stand all the way up, with hips and knees straight.$$]::text[] as tips,
  $$[{"level":"beginner","movement":"Air squat or goblet squat","notes":"Learn the depth and position with no weight or one dumbbell held at the chest."},{"level":"scaled","movement":"Dumbbell front squat (lighter)","notes":"Use 35 lb / 20 lb dumbbells; keep the depth below parallel."},{"level":"rx","movement":"Dumbbell front squat","notes":"50 lb / 35 lb dumbbells in Open 18.2; hips below knees, full extension at the top."}]$$ as scaling_options,
  $$[{"mistake":"Dropping the elbows","fix":"Keep your elbows pointing forward so the dumbbells stay on your shoulders and your chest stays up."},{"mistake":"Cutting depth","fix":"Your hip crease must pass below the top of your knees. Lighten the dumbbells if you can't reach it."},{"mistake":"Knees caving in","fix":"Push your knees out in line with your toes, on the way down and the way up."},{"mistake":"Not standing all the way up","fix":"Finish each rep with hips and knees straight before the next squat."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=B86Zj72LwzA$$ as youtube_url,
  array[$$dumbbells$$]::text[] as equipment,
  true as daily_wod_eligible,
  false as timed,
  $$[8,10]$$::jsonb as beginner_reps,
  $$[12,15]$$::jsonb as intermediate_reps,
  $$[15,20]$$::jsonb as advanced_reps,
  $$Elbows forward — hips below knees$$ as wod_tip,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  true as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$dumbbell-front-squat$$);

-- ═══ Workout wording: Burpee Box Jump-Overs are done facing the box, not lateral ═══
-- Open 17.1 and Open 21.2 told athletes to go "lateral". Each replace targets one exact phrase
-- and the check below stops the script if any phrase was not found.
update public.benchmark_workouts set
  movements = replace(movements::text, $$Lateral burpee over the box; step or jump down on the other side$$,
                      $$Burpee facing the box, then a two-foot jump onto or over it; step or jump down on the other side$$)::jsonb,
  coaching_tips = replace(coaching_tips::text,
    $$For burpee box jump-overs, stay lateral and use a consistent step-or-jump pattern. Pick one and do not switch mid-workout.$$,
    $$For burpee box jump-overs, face the box and use a consistent pattern: jump over, or jump on and step down. Pick one and do not switch mid-workout.$$)::jsonb,
  description = replace(description, $$the lateral movement and box clearance add up over five rounds$$,
                        $$the jump and box clearance add up over five rounds$$),
  updated_at = now()
where slug = 'open-17-1';

update public.benchmark_workouts set
  movements = replace(movements::text, $$Lateral burpee; step or jump down on the other side$$,
                      $$Burpee facing the box, then a two-foot jump onto or over it; step or jump down on the other side$$)::jsonb,
  updated_at = now()
where slug = 'open-21-2';

-- ═══ Workout wording: Floor Wipers count one touch on each side as one rep (matches Nutts) ═══
update public.benchmark_workouts set
  movements = replace(movements::text, $$touch plates to each side alternately$$, $$touch plates to each side = 1 rep$$)::jsonb,
  coaching_tips = replace(coaching_tips::text,
    $$The floor wiper leg swing should alternate sides each rep (left to right, right to left) — do not do all 50 to one side$$,
    $$The floor wiper leg swing alternates sides — one touch on the left and one on the right is 1 rep; do not do all 50 to one side$$)::jsonb,
  updated_at = now()
where slug = 'midline-march';

do $check$
begin
  if exists (select 1 from public.benchmark_workouts where slug in ('open-17-1','open-21-2')
             and (movements::text ilike '%lateral burpee%' or coaching_tips::text ilike '%stay lateral%'
                  or description ilike '%lateral movement%')) then
    raise exception 'A "lateral" phrase is still in Open 17.1 or 21.2';
  end if;
  if exists (select 1 from public.benchmark_workouts where slug = 'midline-march'
             and (movements::text ilike '%each side alternately%' or coaching_tips::text ilike '%alternate sides each rep%')) then
    raise exception 'Old floor wiper wording still in Midline March';
  end if;
  if (select count(*) from public.movements where slug in ($$burpee-box-jump-over$$, $$box-jump-over$$, $$floor-wipers$$, $$handstand-walk$$, $$hang-power-snatch$$, $$dumbbell-hang-clean-and-jerk$$, $$lateral-burpee-over-dumbbell$$, $$shoulder-to-overhead$$, $$dumbbell-front-squat$$)) <> 9 then
    raise exception 'Not all nine movements are present';
  end if;
end
$check$;

commit;
