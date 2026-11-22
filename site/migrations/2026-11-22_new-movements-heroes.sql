-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-22 from the 2026-11-20 movement insert script,
-- review/movements-batch-1.md and CONTENT-GUIDE.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Thirteen new movement pages for movements used in Hero workouts. Each insert skips a slug that already exists.
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

-- ═══ Triple-Unders ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Triple-Unders$$ as name,
  $$triple-unders$$ as slug,
  $$cardio$$ as category,
  $$jumprope$$ as equipment_category,
  array[$$cardio$$]::text[] as tags,
  $$Calves, shoulders, forearms, core$$ as muscles,
  $$A triple-under is a jump rope skill where the rope passes under your feet three times in a single jump. It takes a higher jump than a double-under and much faster wrists. Triple-unders appear in a few CrossFit workouts, including the Hero workout Cameron, and they are a step up once double-unders feel easy.$$ as description,
  to_jsonb(array[$$Get double-unders smooth and consistent before you train triples.$$, $$Use a light speed rope sized so the handles reach about your armpits when you stand on the middle.$$, $$Jump a little higher than for doubles, with your legs mostly straight and a slight pike.$$, $$Keep your elbows close to your sides and spin the rope with your wrists, not your arms.$$, $$Stay tall and land softly on the balls of your feet between jumps.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Double-unders","notes":"Build to sets of 20 or more unbroken double-unders before trying triples."},{"level":"scaled","movement":"Singles and doubles with triple attempts","notes":"Do a few singles, then one big jump for a triple; or replace each triple-under with two double-unders."},{"level":"rx","movement":"Triple-unders","notes":"The rope passes under your feet three times in one jump; 25 reps in Cameron."}]$$ as scaling_options,
  $$[{"mistake":"Spinning the rope with the arms","fix":"Keep your elbows in and let your wrists do the work. Big arm circles slow the rope down."},{"mistake":"Not jumping high enough","fix":"Jump a little higher than for doubles and keep your body tall so the rope has time for three passes."},{"mistake":"Kicking the feet back","fix":"Keep your legs close to straight, with a slight pike forward. Bent knees and donkey kicks catch the rope."},{"mistake":"Chasing long sets too early","fix":"Practice singles of one triple at a time, then link two or three. Short sets build rhythm faster than repeated trips."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=OSMvoZnh_ng$$ as youtube_url,
  array[$$jump rope$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$calves$$, $$shoulders$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$triple-unders$$);

-- ═══ Bar Hang ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Bar Hang$$ as name,
  $$bar-hang$$ as slug,
  $$gymnastics$$ as category,
  $$pullupbar$$ as equipment_category,
  '{}'::text[] as tags,
  $$Forearms and grip, lats, shoulders, upper back$$ as muscles,
  $$The bar hang, also called a dead hang, is hanging from a pull-up bar with straight arms for as long as you can. Your feet stay off the floor and your grip holds your whole body weight. It builds grip strength and comfort on the bar for pull-ups and toes-to-bar. In the Hero workout Coffland, you hang for a total of 6 minutes and do a run and push-ups every time you drop.$$ as description,
  to_jsonb(array[$$Grip the bar with your hands about shoulder-width apart and your thumbs wrapped around it.$$, $$Keep your arms straight and let your body hang still, without swinging.$$, $$Pull your shoulders slightly down away from your ears so you are not hanging loose in the joint.$$, $$Keep your legs together and your ribs down so your body stays in one straight line.$$, $$Breathe steadily, and come down before your grip gives out so you can land under control.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Feet-assisted hang","notes":"Hang from a low bar or rings with your feet on the floor or a box, taking some weight off your hands."},{"level":"scaled","movement":"Bar hang (short sets)","notes":"Hang for 15–30 seconds at a time and rest between sets to build the total time."},{"level":"rx","movement":"Bar hang","notes":"Feet off the floor, straight arms; Coffland asks for 6 minutes of total hang time."}]$$ as scaling_options,
  $$[{"mistake":"Swinging","fix":"Keep your legs together and your body tight. A swinging body tires your grip faster."},{"mistake":"Shoulders up by the ears","fix":"Gently pull your shoulders down, keeping your arms straight."},{"mistake":"Thumbs not wrapped around the bar","fix":"Wrap your thumbs around the bar for a secure grip."},{"mistake":"Dropping from the bar when the grip fails","fix":"Come down while you still have control, so you land on your feet instead of falling."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=3CEmHJXbNpc$$ as youtube_url,
  array[$$pull-up bar$$]::text[] as equipment,
  false as daily_wod_eligible,
  true as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$arms$$, $$back$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$bar-hang$$);

-- ═══ Forward Rolls ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Forward Rolls$$ as name,
  $$forward-rolls$$ as slug,
  $$gymnastics$$ as category,
  $$bodyweight$$ as equipment_category,
  '{}'::text[] as tags,
  $$Core, hip flexors, shoulders, neck$$ as muscles,
  $$A forward roll is a basic gymnastics skill. From a squat, you put your hands on the floor, tuck your chin to your chest and roll forward over your rounded back, finishing back on your feet. It builds body awareness and comfort being upside down. Forward rolls appear in the Hero workout Adrian, mixed with wall climbs, toes-to-bar and box jumps.$$ as description,
  to_jsonb(array[$$Practice on a mat or other soft surface with clear space in front of you.$$, $$Start in a squat with your hands on the floor just in front of your feet.$$, $$Tuck your chin to your chest so the back of your head and shoulders touch the floor, not the top of your head.$$, $$Stay rounded and tucked as you roll, keeping your knees close to your chest.$$, $$Reach your arms forward at the end to help you come up onto your feet.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Rocking in a tuck","notes":"Sit in a tight tuck holding your shins and rock back and forth along your rounded back."},{"level":"scaled","movement":"Downhill forward roll","notes":"Roll down a wedge mat or folded mat so gravity helps you over."},{"level":"rx","movement":"Forward roll","notes":"From a squat, roll over your rounded back and finish on your feet without using your hands to stand."}]$$ as scaling_options,
  $$[{"mistake":"Rolling onto the top of the head","fix":"Tuck your chin all the way to your chest so you roll onto your upper back."},{"mistake":"Opening up during the roll","fix":"Keep your knees pulled in. A flat back stops the roll and makes it bumpy."},{"mistake":"Pushing up with the hands at the end","fix":"Reach your arms forward and keep your heels close to your hips so you can stand straight up."},{"mistake":"Rolling off to one side","fix":"Place both hands evenly and push off both feet together."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=t4iEaeevvIY$$ as youtube_url,
  '{}'::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$gymnastics$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$forward-rolls$$);

-- ═══ Front Rack Hold ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Front Rack Hold$$ as name,
  $$front-rack-hold$$ as slug,
  $$barbell$$ as category,
  $$barbell$$ as equipment_category,
  '{}'::text[] as tags,
  $$Upper back, shoulders, core, quadriceps$$ as muscles,
  $$The front rack hold is standing still with a loaded barbell resting on the front of your shoulders, the same position you catch a clean in. Your elbows point forward, your fingertips stay on the bar and your trunk stays braced so the bar does not pull you forward. It builds upper back and core strength for front squats and cleans. In the partner Hero workout City 100, one partner holds the bar in the front rack while the other works.$$ as description,
  to_jsonb(array[$$Take the bar from a rack or clean it to your shoulders, with your hands just outside shoulder-width.$$, $$Lift your elbows so the bar rests on your shoulders, not on your wrists.$$, $$Keep a loose fingertip grip and let your shoulders carry the load.$$, $$Brace your trunk, stand tall and keep your ribs down so you do not lean back.$$, $$Breathe in short breaths behind the brace, and set the bar down before your elbows drop.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Empty bar front rack hold","notes":"Hold an empty bar or PVC pipe to learn the elbows-up position."},{"level":"scaled","movement":"Front rack hold (lighter)","notes":"Use a lighter load you can hold with your elbows up for the full time."},{"level":"rx","movement":"Front rack hold","notes":"155 lb / 105 lb in City 100; bar on the shoulders, elbows up, standing tall."}]$$ as scaling_options,
  $$[{"mistake":"Elbows dropping","fix":"Keep lifting your elbows. When they sink, the bar rolls forward onto your wrists and pulls your chest down."},{"mistake":"Leaning back","fix":"Brace your trunk and keep your ribs down. Leaning back shifts the load onto your lower back."},{"mistake":"Death grip on the bar","fix":"Hold the bar lightly with your fingertips and let your shoulders do the work."},{"mistake":"Holding past good position","fix":"Set the bar down and reset when your elbows start to drop, rather than letting it slide off."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=Fw3Tc7ysmBg$$ as youtube_url,
  array[$$barbell$$, $$bumper plates$$]::text[] as equipment,
  false as daily_wod_eligible,
  true as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$back$$, $$shoulders$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$carry$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$front-rack-hold$$);

-- ═══ Kettlebell Front-Rack Carry ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Kettlebell Front-Rack Carry$$ as name,
  $$kettlebell-front-rack-carry$$ as slug,
  $$kettlebell$$ as category,
  $$kettlebell$$ as equipment_category,
  '{}'::text[] as tags,
  $$Core, upper back, shoulders, biceps$$ as muscles,
  $$The kettlebell front-rack carry is walking while holding one or two kettlebells in the front rack position, resting against your chest and upper arms with your wrists straight. The load in front of you makes your trunk work hard to keep you tall. The Hero workout Daniel Ray uses a double-kettlebell front-rack carry of 75 feet each round.$$ as description,
  to_jsonb(array[$$Clean the kettlebells to the rack so they rest between your forearm and upper arm, with your wrists straight.$$, $$Keep your elbows tucked in close to your ribs.$$, $$Brace your trunk and stand tall, without leaning back.$$, $$Walk with short, steady steps and keep your eyes forward.$$, $$Breathe behind the brace rather than holding your breath for the whole carry.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Single kettlebell front-rack carry","notes":"Carry one light kettlebell in the rack and switch sides at the halfway mark."},{"level":"scaled","movement":"Double kettlebell front-rack carry (lighter)","notes":"Use two lighter kettlebells and break the distance into shorter sections."},{"level":"rx","movement":"Double kettlebell front-rack carry","notes":"53 lb / 35 lb kettlebells in Daniel Ray; 75 feet each round."}]$$ as scaling_options,
  $$[{"mistake":"Leaning back","fix":"Brace your trunk and keep your ribs down. Stand tall under the bells instead of leaning away from them."},{"mistake":"Bent wrists","fix":"Keep your wrists straight so the bells rest on your forearms, not your hands."},{"mistake":"Elbows flaring out","fix":"Tuck your elbows in to your ribs so the bells stay close to your chest."},{"mistake":"Rushing with long strides","fix":"Use short, controlled steps so the bells don't bounce."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=zKHog8SWdM4$$ as youtube_url,
  array[$$kettlebell$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$core$$, $$back$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$carry$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$kettlebell-front-rack-carry$$);

-- ═══ Kettlebell Front-Rack Walking Lunges ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Kettlebell Front-Rack Walking Lunges$$ as name,
  $$kettlebell-front-rack-walking-lunges$$ as slug,
  $$kettlebell$$ as category,
  $$kettlebell$$ as equipment_category,
  array[$$lower$$]::text[] as tags,
  $$Quadriceps, glutes, hamstrings, core, upper back$$ as muscles,
  $$Kettlebell front-rack walking lunges are walking lunges done with one or two kettlebells held in the front rack position. Each step forward drops your back knee toward the floor, then you stand up and step through with the other leg. The weight in front keeps your torso upright and makes your trunk work. The Hero workout Daniel Ray uses a 25-foot double-kettlebell front-rack lunge each round.$$ as description,
  to_jsonb(array[$$Clean the kettlebells to the rack with your wrists straight and your elbows tucked in.$$, $$Take a long enough step that your front shin stays close to vertical.$$, $$Lower your back knee until it lightly touches or nearly touches the floor.$$, $$Keep your chest up and your trunk braced so the bells don't pull you forward.$$, $$Drive through your whole front foot to stand, then step through into the next lunge.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Walking lunges (no weight)","notes":"Learn the step length and depth with body weight only."},{"level":"scaled","movement":"Single kettlebell or goblet walking lunges","notes":"Hold one kettlebell in the rack or at your chest; switch sides halfway if racked."},{"level":"rx","movement":"Double kettlebell front-rack walking lunges","notes":"53 lb / 35 lb kettlebells in Daniel Ray; 25 feet each round."}]$$ as scaling_options,
  $$[{"mistake":"Back knee not reaching the floor","fix":"Lower until your back knee touches or nearly touches the floor on every step."},{"mistake":"Torso tipping forward","fix":"Keep your chest up and your elbows tucked so the bells stay over your middle."},{"mistake":"Front knee caving in","fix":"Keep your front knee tracking over your toes as you lower and stand."},{"mistake":"Short, choppy steps","fix":"Step long enough that you can drop straight down without your front heel lifting."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=tX-BTdm003k$$ as youtube_url,
  array[$$kettlebell$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$quads$$, $$glutes$$, $$hamstrings$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$kettlebell-front-rack-walking-lunges$$);

-- ═══ Kettlebell Overhead Carry ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Kettlebell Overhead Carry$$ as name,
  $$kettlebell-overhead-carry$$ as slug,
  $$kettlebell$$ as category,
  $$kettlebell$$ as equipment_category,
  array[$$overhead$$]::text[] as tags,
  $$Shoulders, triceps, upper back, core$$ as muscles,
  $$The kettlebell overhead carry is walking while holding one or two kettlebells locked out overhead. Your arms stay straight, the bells stay over your shoulders and your trunk stays braced so your back doesn't arch. It builds shoulder stability and trunk strength. The Hero workout Daniel Ray uses a 50-foot double-kettlebell overhead carry each round.$$ as description,
  to_jsonb(array[$$Clean and press or jerk the kettlebells overhead, then lock your elbows.$$, $$Stack the bells over your shoulders with your biceps close to your ears.$$, $$Brace your trunk and keep your ribs down so your lower back doesn't arch.$$, $$Keep your wrists straight with the handles across your palms.$$, $$Walk with short, steady steps and bring the bells down to the rack before your arms bend.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Single kettlebell overhead carry","notes":"Carry one light kettlebell overhead, with your free hand at your side, and switch arms halfway."},{"level":"scaled","movement":"Front-rack carry or lighter double overhead carry","notes":"Carry the bells in the front rack if overhead position is limited, or use two lighter bells."},{"level":"rx","movement":"Double kettlebell overhead carry","notes":"53 lb / 35 lb kettlebells in Daniel Ray; 50 feet each round."}]$$ as scaling_options,
  $$[{"mistake":"Bent elbows","fix":"Lock your arms out. If they start to bend, bring the bells down and reset."},{"mistake":"Arching the lower back","fix":"Brace your trunk and pull your ribs down so your body stays stacked under the bells."},{"mistake":"Bells drifting forward","fix":"Keep the bells over your shoulders, with your arms by your ears."},{"mistake":"Bent-back wrists","fix":"Set the handle low in your palm and keep your wrists straight."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=7JUe6YXSM3g$$ as youtube_url,
  array[$$kettlebell$$]::text[] as equipment,
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
where not exists (select 1 from public.movements where slug = $$kettlebell-overhead-carry$$);

-- ═══ Over-the-Shoulder Sandbag Cleans ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Over-the-Shoulder Sandbag Cleans$$ as name,
  $$over-the-shoulder-sandbag-cleans$$ as slug,
  $$fullbody$$ as category,
  $$bodyweight$$ as equipment_category,
  array[$$full$$]::text[] as tags,
  $$Glutes, hamstrings, back, core, quadriceps, shoulders$$ as muscles,
  $$An over-the-shoulder sandbag clean lifts a sandbag from the floor and throws it over one shoulder, so it lands behind you. You straddle the bag, grip it, lift it into your lap, then stand up hard and drive it over your shoulder with your hips. It works your whole back side and builds power for lifting awkward loads. The Hero workout Alec uses 25 of them with a 100 lb / 75 lb sandbag between two 1,000 m runs.$$ as description,
  to_jsonb(array[$$Stand with the bag between your feet and get a wide grip under or around it.$$, $$Hinge with a flat back and lift the bag onto your thighs, close to your body.$$, $$Hug the bag tight to your chest, then stand up fast and drive your hips forward.$$, $$Turn your head to one side and send the bag over that shoulder, letting it fall behind you.$$, $$Alternate shoulders, and turn around to face the bag before the next rep.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Sandbag ground-to-shoulder (light)","notes":"Lift a light sandbag to one shoulder and set it down in front to learn the lap and hip drive."},{"level":"scaled","movement":"Over-the-shoulder sandbag cleans (lighter)","notes":"Use a lighter bag, such as 50–70 lb / 35–50 lb, with the full over-the-shoulder finish."},{"level":"rx","movement":"Over-the-shoulder sandbag cleans","notes":"100 lb / 75 lb sandbag in Alec; the bag goes over one shoulder and lands behind you."}]$$ as scaling_options,
  $$[{"mistake":"Lifting with a rounded back from the floor","fix":"Hinge with a flat back to get the bag to your lap, then stand. The hips do the work, not the spine."},{"mistake":"Bag held away from the body","fix":"Hug the bag tight to your chest. A bag held out in front is much heavier."},{"mistake":"Pressing it over with the arms","fix":"Drive the bag up with a fast hip extension. Your arms only guide it."},{"mistake":"Always using the same shoulder","fix":"Alternate shoulders so one side doesn't do all the work."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=jDlyC1SH-Ao$$ as youtube_url,
  array[$$sandbag$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$glutes$$, $$hamstrings$$, $$back$$, $$core$$, $$quads$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$over-the-shoulder-sandbag-cleans$$);

-- ═══ Overhead Walk ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Overhead Walk$$ as name,
  $$overhead-walk$$ as slug,
  $$barbell$$ as category,
  $$barbell$$ as equipment_category,
  array[$$overhead$$]::text[] as tags,
  $$Shoulders, triceps, upper back, core$$ as muscles,
  $$The overhead walk is walking while holding a loaded barbell locked out overhead. Your grip is wide, your arms stay straight and the bar stays over the middle of your body as you take short, steady steps. It builds shoulder stability and trunk strength, and it is a carry, not a lunge. The Hero workout Paul uses a 20-yard overhead walk with 185 lb / 125 lb each round.$$ as description,
  to_jsonb(array[$$Get the bar overhead with a clean and jerk or a snatch, using a grip you can hold.$$, $$Lock your elbows and push the bar up, with your arms close to your ears.$$, $$Keep the bar over the middle of your feet, not in front of your head.$$, $$Brace your trunk and keep your ribs down so your lower back doesn't arch.$$, $$Walk with short, quick steps and look straight ahead.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"PVC or empty bar overhead walk","notes":"Learn the locked-out position and short steps with very light weight."},{"level":"scaled","movement":"Overhead walk (lighter) or dumbbell overhead carry","notes":"Use a load you can hold locked out for the whole distance, or carry dumbbells overhead."},{"level":"rx","movement":"Overhead walk","notes":"185 lb / 125 lb in Paul; 20 yards each round with the bar locked out overhead."}]$$ as scaling_options,
  $$[{"mistake":"Bent elbows","fix":"Keep pushing the bar up. If your arms soften, the bar drops and the load moves onto your back."},{"mistake":"Bar drifting forward","fix":"Keep the bar over the middle of your feet, with your head slightly through your arms."},{"mistake":"Arching the lower back","fix":"Brace your trunk and keep your ribs down so your body stays stacked under the bar."},{"mistake":"Long strides","fix":"Take short, quick steps so the bar doesn't sway from side to side."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=tfokMl2YBeE$$ as youtube_url,
  array[$$barbell$$, $$bumper plates$$]::text[] as equipment,
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
where not exists (select 1 from public.movements where slug = $$overhead-walk$$);

-- ═══ Burpee Bar Muscle-Ups ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Burpee Bar Muscle-Ups$$ as name,
  $$burpee-bar-muscle-ups$$ as slug,
  $$gymnastics$$ as category,
  $$pullupbar$$ as equipment_category,
  array[$$full$$]::text[] as tags,
  $$Lats, chest, shoulders, triceps, core$$ as muscles,
  $$A burpee bar muscle-up joins a burpee and a bar muscle-up. Facing the pull-up bar, you drop so your chest and thighs touch the floor, stand up, then jump to the bar and do a bar muscle-up, finishing with your arms locked above the bar. It is an advanced gymnastics movement that takes a solid bar muscle-up first. The Hero workout Barraza uses 6 per round.$$ as description,
  to_jsonb(array[$$Do the burpee facing the bar and close enough that you can jump straight up to it.$$, $$Jump to the bar and use the jump to start your kip.$$, $$Pull the bar to your hips, then lean your chest over the bar fast.$$, $$Press to locked arms on top of the bar to finish the rep.$$, $$Come down under control, then step back into the next burpee.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Burpee + jumping chest-to-bar pull-up","notes":"Do a burpee, then a jumping pull-up from a box or the floor, pulling your chest to the bar."},{"level":"scaled","movement":"Burpee + chest-to-bar pull-up or banded bar muscle-up","notes":"Keep the burpee and replace the muscle-up with a chest-to-bar pull-up, or use a band if you are close to a muscle-up."},{"level":"rx","movement":"Burpee bar muscle-ups","notes":"Chest and thighs to the floor, then jump to the bar and finish with locked arms above it; 6 per round in Barraza."}]$$ as scaling_options,
  $$[{"mistake":"Chest or thighs not touching the floor","fix":"Lower all the way down on every burpee."},{"mistake":"Pulling with bent arms too early","fix":"Use your hips to drive the bar toward you before you pull, so your arms stay fresh."},{"mistake":"Not finishing on top of the bar","fix":"Press until your arms are locked out above the bar. A partial press is a no-rep."},{"mistake":"Dropping off the bar","fix":"Lower yourself under control instead of falling from the top, so you land on your feet."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=iAUzkrTsCDk$$ as youtube_url,
  array[$$pull-up bar$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$back$$, $$chest$$, $$shoulders$$, $$arms$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$gymnastics$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$burpee-bar-muscle-ups$$);

-- ═══ Arm-Over-Arm Sled Pull ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Arm-Over-Arm Sled Pull$$ as name,
  $$arm-over-arm-sled-pull$$ as slug,
  $$fullbody$$ as category,
  $$bodyweight$$ as equipment_category,
  '{}'::text[] as tags,
  $$Lats, upper back, biceps, forearms and grip, core$$ as muscles,
  $$The arm-over-arm sled pull drags a weighted sled toward you by pulling a rope hand over hand. You stay in place, seated or standing, while each hand reaches out, grips the rope and pulls it in. It builds pulling strength, grip and a strong trunk. The Hero workout Fournier uses three 50-foot arm-over-arm sled pulls with a load that is challenging but lets you keep moving.$$ as description,
  to_jsonb(array[$$Attach a long rope to the sled and stretch it out to the full distance before you start.$$, $$Sit with your knees bent and feet braced, or stand in a stable split stance.$$, $$Reach out, grip the rope and pull it toward your hip, then reach with the other hand.$$, $$Keep your trunk braced and your back flat so your arms and back do the pulling.$$, $$Find a steady rhythm and keep the sled moving rather than yanking it.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Light sled pull or banded rows","notes":"Use an empty or very light sled, or do rows with a band to build the pulling pattern."},{"level":"scaled","movement":"Arm-over-arm sled pull (lighter)","notes":"Use a lighter load and shorter sections, such as 25 feet at a time."},{"level":"rx","movement":"Arm-over-arm sled pull","notes":"50 feet in Fournier; use a load that is challenging but doesn't need long rests."}]$$ as scaling_options,
  $$[{"mistake":"Rounding the back to pull","fix":"Keep your chest up and your trunk braced so your arms and upper back do the work."},{"mistake":"Short pulls","fix":"Reach out fully and pull the rope all the way to your hip with each hand."},{"mistake":"Jerking the rope","fix":"Use smooth, steady pulls. A sled that stops and starts takes more effort to move."},{"mistake":"Letting the rope pile up in your way","fix":"Pull the rope to one side as you go so you don't get tangled."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=J3iRU44n5gE$$ as youtube_url,
  array[$$sled$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$back$$, $$arms$$, $$shoulders$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$arm-over-arm-sled-pull$$);

-- ═══ Medicine Ball Run ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Medicine Ball Run$$ as name,
  $$medicine-ball-run$$ as slug,
  $$cardio$$ as category,
  $$running$$ as equipment_category,
  array[$$cardio$$]::text[] as tags,
  $$Quadriceps, hamstrings, calves, glutes, core, shoulders$$ as muscles,
  $$The medicine ball run is running while carrying a medicine ball. You can hold it any way you can keep it: hugged to your chest, on one shoulder or under one arm. The ball takes your arm swing away, so your trunk and shoulders work while your legs do the running. The Hero workout Gallant uses a 1-mile, 800 m and 400 m run with a 20 lb / 14 lb medicine ball.$$ as description,
  to_jsonb(array[$$Pick a hold you can keep, such as hugging the ball to your chest or carrying it on one shoulder.$$, $$Switch holds or shoulders when your arms tire, without stopping.$$, $$Keep your trunk braced and stand tall, without leaning back.$$, $$Take shorter, quicker steps than your normal running stride.$$, $$Start at a steady pace you can hold for the whole distance.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Run without the ball","notes":"Run the distance, or walk and run, with no ball."},{"level":"scaled","movement":"Medicine ball run (lighter ball or shorter distance)","notes":"Use a 10 lb / 6 lb ball or cut the distance."},{"level":"rx","movement":"Medicine ball run","notes":"20 lb / 14 lb ball in Gallant; any hold, and the ball stays with you for the whole run."}]$$ as scaling_options,
  $$[{"mistake":"Leaning back with the ball","fix":"Brace your trunk and keep your ribs down so you run tall."},{"mistake":"Holding the ball away from the body","fix":"Keep the ball tight to your chest or shoulder. The farther away it is, the heavier it feels."},{"mistake":"Long, bounding strides","fix":"Shorten your stride and keep your feet under you."},{"mistake":"Going out too fast","fix":"Start at a pace you can hold. The carry adds up over the distance."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=VO0beZuchKk$$ as youtube_url,
  array[$$medicine ball$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$quads$$, $$hamstrings$$, $$calves$$, $$glutes$$, $$core$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$medicine-ball-run$$);

-- ═══ Plate Run ═══
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Plate Run$$ as name,
  $$plate-run$$ as slug,
  $$cardio$$ as category,
  $$running$$ as equipment_category,
  array[$$cardio$$]::text[] as tags,
  $$Quadriceps, hamstrings, calves, glutes, core, shoulders, forearms$$ as muscles,
  $$The plate run is running while carrying a weight plate. Most people hug the plate to their chest or pinch it in front of the hips, and switch holds as their arms tire. The plate takes your arm swing away, so your grip, shoulders and trunk work while your legs do the running. The partner Hero workout Goose ends with a 400 m run in which both partners carry a plate, 45 lb / 25 lb.$$ as description,
  to_jsonb(array[$$Hug the plate to your chest, or hold it by the edges in front of your hips.$$, $$Change your hold when your grip tires instead of stopping.$$, $$Brace your trunk and stand tall, without leaning back.$$, $$Take shorter, quicker steps than your normal running stride.$$, $$Keep a steady pace you can hold for the whole distance.$$]::text[]) as tips,
  $$[{"level":"beginner","movement":"Run without the plate","notes":"Run the distance, or walk and run, with no plate."},{"level":"scaled","movement":"Plate run (lighter plate)","notes":"Use a 25 lb / 10 lb plate, or a shorter distance."},{"level":"rx","movement":"Plate run","notes":"45 lb / 25 lb plate in Goose; 400 m with the plate in your hands the whole way."}]$$ as scaling_options,
  $$[{"mistake":"Leaning back with the plate","fix":"Brace your trunk and keep your ribs down so you run tall."},{"mistake":"Holding the plate away from the body","fix":"Keep it close to your chest or hips. The farther away it is, the heavier it feels."},{"mistake":"Long, bounding strides","fix":"Shorten your stride and keep your feet under you."},{"mistake":"Death grip the whole way","fix":"Switch between a chest hug and a pinch grip to share the work between your arms and hands."}]$$ as common_faults,
  $$https://www.youtube.com/watch?v=uycjWMMDInY$$ as youtube_url,
  array[$$plates$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  null as wod_tip,
  array[$$quads$$, $$hamstrings$$, $$calves$$, $$glutes$$, $$core$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$monostructural$$ as movement_pattern,
  false as tabata_suitable,
  null as machine_id
where not exists (select 1 from public.movements where slug = $$plate-run$$);

do $check$
begin
  if (select count(*) from public.movements where slug in ($$triple-unders$$, $$bar-hang$$, $$forward-rolls$$, $$front-rack-hold$$, $$kettlebell-front-rack-carry$$, $$kettlebell-front-rack-walking-lunges$$, $$kettlebell-overhead-carry$$, $$over-the-shoulder-sandbag-cleans$$, $$overhead-walk$$, $$burpee-bar-muscle-ups$$, $$arm-over-arm-sled-pull$$, $$medicine-ball-run$$, $$plate-run$$)) <> 13 then
    raise exception 'Not all 13 movements are present';
  end if;
end
$check$;

commit;

select slug, name, youtube_url from public.movements
where slug in ($$triple-unders$$, $$bar-hang$$, $$forward-rolls$$, $$front-rack-hold$$, $$kettlebell-front-rack-carry$$, $$kettlebell-front-rack-walking-lunges$$, $$kettlebell-overhead-carry$$, $$over-the-shoulder-sandbag-cleans$$, $$overhead-walk$$, $$burpee-bar-muscle-ups$$, $$arm-over-arm-sled-pull$$, $$medicine-ball-run$$, $$plate-run$$)
order by slug;
