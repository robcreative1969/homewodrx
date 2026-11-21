-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/machines-batch-*.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Machines batch A: 8 machine pages and their movements. Each insert skips a slug that already exists.
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

-- ═══ Belt Squat Machine (belt-squat-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Belt Squat Machine$$,
  $$belt-squat-machine$$,
  array[$$quads$$, $$glutes$$]::text[],
  $$The belt squat machine lets you squat with the load hanging from a belt around your hips instead of a bar on your back. You stand on a raised platform, clip the belt to a strap or chain, and squat down and up while the weight moves with your hips. Your legs do the work and your spine and shoulders stay out of it, which makes it a useful option when your back or shoulders don't tolerate a barbell, or when you want more leg work after your main lifts.

Designs vary a lot. Some models are plate-loaded on a lever arm, some use a weight stack and cable, and some have a lever or handle that takes the weight on and off for you. Most have handles in front so you can hold on for balance. Check the placard on your machine before your first set, because how you load, start and stop it depends on the model.$$,
  $$Start with the machine empty or very light. Put the belt on low, around your hips and upper glutes, not your waist; tighten it so it doesn't slide when you move. Step onto the platform and stand with the attachment point centered between your feet, so the strap hangs straight down. Adjust the strap or chain length so it is tight when you stand tall and the weight is just off its rest. Hold the handles, find your stance (most people use about shoulder width, toes turned out a little), then add weight once the movement feels steady.$$,
  $$[{"mistake":"Wearing the belt too high","fix":"Keep the belt low on your hips. If it rides up to your waist, it pulls on your lower back and slides around. Tighten it and reset it before each set."},{"mistake":"Standing off-center from the strap","fix":"Line the strap up between your feet so it hangs straight down. If it pulls forward or back, you'll tip, and the weight will swing."},{"mistake":"Pulling yourself down with the handles","fix":"Use the handles for balance only. Your legs should lower and raise the weight. If you need to yank on the handles, the weight is too heavy."},{"mistake":"Letting the knees cave in","fix":"Keep your knees tracking in line with your toes on the way down and up. Lighten the load if they drift inward."}]$$::jsonb,
  $$Learn your model's start and stop method before you load it: some lift the weight off a rest with a lever, others start with the weight hanging. Make sure the belt, strap and clips are in good shape and fully connected before every set. Lower the weight back onto its rest before you unclip or step off the platform. Start light on your first few sessions while you learn the path of the machine. Muscle fatigue is normal; sharp pain in your knees, hips or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee, hip, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=zNl73FGvTc0$$
where not exists (select 1 from public.machines where slug = $$belt-squat-machine$$);

-- Movement: Belt Squat
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Belt Squat$$ as name,
  $$belt-squat$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps, glutes, adductors (secondary)$$ as muscles,
  $$The belt squat is a squat with the load hanging from a belt around your hips. You stand on the machine's platform, squat down until your thighs are about level with the floor or as deep as you can control, and stand back up. Your legs do the work while your back and shoulders stay unloaded.

Options: a wider stance with toes turned out brings in more of your inner thighs; a narrower stance keeps more work on your quads.$$ as description,
  to_jsonb(array[$$Wear the belt low on your hips, not around your waist.$$, $$Stand with the strap hanging straight down between your feet.$$, $$Hold the handles for balance only.$$, $$Keep your knees in line with your toes on the way down and up.$$, $$Stand all the way up at the top of each rep.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Belt squat with the machine empty","notes":"Learn the stance and depth before you add weight."},{"level":"rx","label":"Standard","movement":"Belt Squat","notes":"Full depth you can control, knees tracking over your toes."},{"level":"advanced","label":"Advanced","movement":"Belt squat with a 3-second lowering","notes":"Slow the way down to add time under tension."}]$$ as scaling_options,
  $$[{"mistake":"Belt riding up to the waist","fix":"Set the belt low on your hips and tighten it so it stays put."},{"mistake":"Pulling on the handles","fix":"Use the handles for balance. If you need to pull, lighten the load."}]$$ as common_faults,
  null as youtube_url,
  array[$$belt squat machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Belt low on the hips, legs do the work.$$ as wod_tip,
  array[$$quads$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$belt-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$belt-squat$$);

-- Movement: Belt Squat March
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Belt Squat March$$ as name,
  $$belt-squat-march$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, quadriceps, hip flexors, core$$ as muscles,
  $$The belt squat march is done standing tall in the belt squat machine with the load on your hips. You lift one knee, set the foot back down, then lift the other, marching in place under control. It trains your hips and legs one side at a time and is often used for conditioning or as a lighter finisher.$$ as description,
  to_jsonb(array[$$Stand tall with the strap tight and the weight just off its rest.$$, $$Lift one knee to about hip height, then set the foot down softly.$$, $$Keep your hips level as you switch legs.$$, $$Hold the handles lightly for balance.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Slow march, no weight","notes":"Learn the rhythm with the machine empty."},{"level":"rx","label":"Standard","movement":"Belt Squat March","notes":"Steady marching for time or steps, hips level."},{"level":"advanced","label":"Advanced","movement":"Belt squat march with a heavier load","notes":"Add weight only while you can keep your torso still."}]$$ as scaling_options,
  $$[{"mistake":"Leaning side to side","fix":"Keep your torso upright and your hips level. Lighten the load if you sway."},{"mistake":"Stomping the feet down","fix":"Set each foot down softly so the weight doesn't bounce on the strap."}]$$ as common_faults,
  null as youtube_url,
  array[$$belt squat machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Stand tall, march under control.$$ as wod_tip,
  array[$$quads$$, $$glutes$$, $$core$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$belt-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$belt-squat-march$$);

-- Movement: Belt Squat Romanian Deadlift
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Belt Squat Romanian Deadlift$$ as name,
  $$belt-squat-romanian-deadlift$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Hamstrings, glutes, lower back (secondary)$$ as muscles,
  $$The belt squat Romanian deadlift is a hip hinge done in the belt squat machine. With the belt on your hips and a slight bend in your knees, you push your hips back until you feel a stretch in your hamstrings, then drive your hips forward to stand tall. It works your hamstrings and glutes without a bar in your hands. It needs a machine with room to hinge without the strap rubbing your legs.$$ as description,
  to_jsonb(array[$$Start standing tall with a soft bend in your knees.$$, $$Push your hips straight back and keep your back flat.$$, $$Stop when you feel a strong stretch in your hamstrings.$$, $$Squeeze your glutes to stand back up.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Hip hinge with no weight","notes":"Practice the hinge holding the handles, machine empty."},{"level":"rx","label":"Standard","movement":"Belt Squat Romanian Deadlift","notes":"Flat back, hips back to a hamstring stretch, stand tall."},{"level":"advanced","label":"Advanced","movement":"Belt squat RDL with a pause at the bottom","notes":"Hold the stretch for a second before you stand."}]$$ as scaling_options,
  $$[{"mistake":"Rounding the back","fix":"Keep your back flat and stop the hinge before it rounds."},{"mistake":"Turning it into a squat","fix":"Keep your knees only slightly bent. Your hips move back, not down."}]$$ as common_faults,
  null as youtube_url,
  array[$$belt squat machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Hips back, flat back, squeeze up.$$ as wod_tip,
  array[$$hamstrings$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$belt-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$belt-squat-romanian-deadlift$$);

-- ═══ Pendulum Squat (pendulum-squat-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Pendulum Squat$$,
  $$pendulum-squat-machine$$,
  array[$$quads$$, $$glutes$$]::text[],
  $$The pendulum squat is a plate-loaded machine where you stand on an angled platform with pads on your shoulders and your back against a pad. When you squat, the pads swing down and back along an arc, like a pendulum, instead of moving in a straight line. That arc lets you stay upright and bend your knees deeply, so the machine is mainly a quad builder, with your glutes working hard too.

Because the machine guides the path and supports your back, you can train your legs hard without balancing a bar. Most models have a safety lever that holds the pads in place when you get in and out, and some have adjustable depth stops. Machines vary by manufacturer, so check the placard on your machine for how the lever and stops work.$$,
  $$Load the machine empty or very light for your first sets. Step onto the platform and set your back flat against the back pad, with the shoulder pads snug on top of your shoulders. Place your feet about shoulder width apart on the middle of the platform. If your model has depth stops, set them before you start. Stand up slightly to take the weight, release the safety lever, and do one slow test rep to check that your feet stay flat and your back stays on the pad. Then add plates.$$,
  $$[{"mistake":"Letting your heels lift","fix":"Keep your whole foot flat on the platform. If your heels rise at the bottom, move your feet a little higher on the platform or shorten your range for now."},{"mistake":"Peeling your back off the pad","fix":"Keep your back and hips against the pad for the whole rep. If your lower back rounds off the pad at the bottom, stop a little higher."},{"mistake":"Bouncing out of the bottom","fix":"Lower the weight under control and drive up smoothly. Dropping fast into the bottom and bouncing puts a lot of stress on your knees."}]$$::jsonb,
  $$Find the safety lever before you load the machine, and know how to put it back on. Re-engage it at the end of your set before you step out. Add plates evenly and in the order your machine expects; on some models the carriage can move when it is loaded unevenly. Start light while you learn the arc. Muscle fatigue and a strong stretch in your thighs are normal; sharp pain in your knees, hips or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee, hip, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=BdcZWDiIwXA$$
where not exists (select 1 from public.machines where slug = $$pendulum-squat-machine$$);

-- Movement: Pendulum Squat
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Pendulum Squat$$ as name,
  $$pendulum-squat$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps, glutes$$ as muscles,
  $$The pendulum squat is a squat on the pendulum machine. With your back against the pad and the shoulder pads on top of your shoulders, you bend your knees and the pads swing down and back along an arc, then you drive back up. The arc lets you stay upright and squat deep, so it is mainly a quad exercise.

Options: feet lower on the platform put more work on your quads; feet higher bring in more glutes.$$ as description,
  to_jsonb(array[$$Set your back flat against the pad and the shoulder pads snug.$$, $$Place your feet about shoulder width apart in the middle of the platform.$$, $$Lower under control as deep as you can with your heels down.$$, $$Drive up smoothly through your whole foot.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Pendulum squat with the machine empty","notes":"Learn the arc and your depth first."},{"level":"rx","label":"Standard","movement":"Pendulum Squat","notes":"Deep, controlled reps with heels down and back on the pad."},{"level":"advanced","label":"Advanced","movement":"Pendulum squat with a pause at the bottom","notes":"Pause for a second, then drive up without bouncing."}]$$ as scaling_options,
  $$[{"mistake":"Heels lifting","fix":"Move your feet a little higher on the platform or shorten the range."},{"mistake":"Bouncing out of the bottom","fix":"Lower under control and drive up smoothly."}]$$ as common_faults,
  null as youtube_url,
  array[$$pendulum squat$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Back on the pad, heels down, deep and controlled.$$ as wod_tip,
  array[$$quads$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$pendulum-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$pendulum-squat$$);

-- Movement: Pendulum Reverse Lunge
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Pendulum Reverse Lunge$$ as name,
  $$pendulum-reverse-lunge$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, quadriceps$$ as muscles,
  $$The pendulum reverse lunge works one leg at a time on the pendulum machine. You keep your working foot on the platform and step the other leg back, then lower and drive up with the front leg as the pads follow the arc. Not every pendulum machine suits it, so check that your model has room to step back safely.$$ as description,
  to_jsonb(array[$$Start light; one leg does all the work.$$, $$Keep your working foot flat in the middle of the platform.$$, $$Step the other leg back far enough to lower without your heel lifting.$$, $$Finish all reps on one side, then switch.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Pendulum squat","notes":"Build strength on the two-leg version first."},{"level":"rx","label":"Standard","movement":"Pendulum Reverse Lunge","notes":"Controlled reps, working heel down, even reps each side."},{"level":"advanced","label":"Advanced","movement":"Pendulum reverse lunge with a slow lowering","notes":"Take 3 seconds on the way down."}]$$ as scaling_options,
  $$[{"mistake":"Pushing off the back leg","fix":"Keep most of your weight on the front foot. The back leg is for balance."},{"mistake":"Uneven reps","fix":"Do the same reps and weight on each side."}]$$ as common_faults,
  null as youtube_url,
  array[$$pendulum squat$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Front leg works, back leg balances.$$ as wod_tip,
  array[$$quads$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$pendulum-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$pendulum-reverse-lunge$$);

-- Movement: Pendulum Calf Raise
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Pendulum Calf Raise$$ as name,
  $$pendulum-calf-raise$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Calves (gastrocnemius, soleus)$$ as muscles,
  $$The pendulum calf raise uses the pendulum machine to load a calf raise. Standing with your legs nearly straight and the balls of your feet on the edge of the platform, you lower your heels, then rise onto your toes. Not every model suits it. Keep a soft bend in your knees and the balls of your feet fully on the platform; they can slip off the edge. Keep the safety lever within reach the whole set.$$ as description,
  to_jsonb(array[$$Engage the machine with your legs nearly straight, not locked.$$, $$Put only the balls of your feet on the platform edge.$$, $$Lower your heels slowly, then rise as high as you can.$$, $$Keep the safety lever within reach.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Bodyweight calf raise on a step","notes":"Learn the full range first."},{"level":"rx","label":"Standard","movement":"Pendulum Calf Raise","notes":"Full range, slow lowering, soft knees."},{"level":"advanced","label":"Advanced","movement":"Pendulum calf raise with a pause at the top","notes":"Hold the top for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Locking the knees","fix":"Keep a soft bend so your knees aren't holding the load."},{"mistake":"Feet sliding off the edge","fix":"Reset your feet between sets and keep the balls of your feet firmly on the platform."}]$$ as common_faults,
  null as youtube_url,
  array[$$pendulum squat$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Soft knees, full range, safety lever in reach.$$ as wod_tip,
  array[$$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$pendulum-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$pendulum-calf-raise$$);

-- ═══ Hack Squat Machine (hack-squat-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Hack Squat Machine$$,
  $$hack-squat-machine$$,
  array[$$quads$$, $$glutes$$]::text[],
  $$The hack squat machine is an angled sled that runs on fixed rails. You stand on a platform with your back against a pad and the shoulder pads on top of your shoulders, then squat down and up as the sled slides along the rails. The fixed path and back support mean you don't have to balance the load, so you can focus on your legs. It works your quads most, with your glutes helping.

Most hack squats are plate-loaded, with safety handles near your hands that lock the sled at the top. Some models also have adjustable safety stops lower on the rails. Where you place your feet on the platform changes the feel: lower puts more work on your quads, higher brings in more glutes. Check the placard on your machine for how its locks and stops work.$$,
  $$Before you add plates, step in and set your back flat against the pad with the shoulder pads snug. Put your feet about shoulder width apart in the middle of the platform. If your model has lower safety stops, set them just below the depth you plan to reach. Push up slightly, release the safety handles, and do a slow test rep with no weight. Check that your heels stay down and your hips stay on the pad. Then load the plates evenly on both sides.$$,
  $$[{"mistake":"Hips sliding off the pad at the bottom","fix":"Keep your hips and lower back pressed into the pad. If they roll forward at the bottom, stop a little higher or move your feet slightly up the platform."},{"mistake":"Heels lifting off the platform","fix":"Push through your whole foot. If your heels rise, your feet are probably too low; move them up a little."},{"mistake":"Slamming the knees into lockout","fix":"Stand up to nearly straight legs with control. Snapping your knees straight under a heavy load adds stress to the joint and takes tension off your legs."},{"mistake":"Loading too much too soon","fix":"The sled carries part of the weight, so the numbers can look bigger than your squat. Go by control and depth, not the plate count."}]$$::jsonb,
  $$Know where the safety handles are and how to lock them before you load the machine. Re-engage them at the end of every set before you step out from under the pads. Load and unload plates evenly on both sides. Set the lower stops if your model has them. Start light while you learn the path of the sled. Muscle fatigue is normal; sharp pain in your knees, hips or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee, hip, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=hrciyIRwFzs$$
where not exists (select 1 from public.machines where slug = $$hack-squat-machine$$);

-- Movement: Hack Squat
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Hack Squat$$ as name,
  $$hack-squat$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps, glutes$$ as muscles,
  $$The hack squat is a squat on the hack squat machine's angled sled. With your back against the pad and the shoulder pads on your shoulders, you release the safety handles, lower until your thighs are about parallel or as deep as you can control, and press back up.

Options: feet lower on the platform put more work on your quads, feet higher bring in more glutes, and a narrower stance keeps the focus on your quads.$$ as description,
  to_jsonb(array[$$Set your back flat on the pad before you release the handles.$$, $$Keep your heels down and your hips on the pad.$$, $$Lower under control to the depth you can hold.$$, $$Stand to nearly straight legs without snapping your knees.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Hack squat with the sled empty","notes":"The empty sled is enough to learn the path."},{"level":"rx","label":"Standard","movement":"Hack Squat","notes":"Controlled depth, heels down, hips on the pad."},{"level":"advanced","label":"Advanced","movement":"Hack squat with a 3-second lowering","notes":"Slow the way down, then press up smoothly."}]$$ as scaling_options,
  $$[{"mistake":"Hips sliding off the pad","fix":"Stop a little higher or move your feet up the platform."},{"mistake":"Slamming into lockout","fix":"Stand to nearly straight and keep tension on your legs."}]$$ as common_faults,
  null as youtube_url,
  array[$$hack squat machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Back on the pad, heels down, smooth press.$$ as wod_tip,
  array[$$quads$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$hack-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$hack-squat$$);

-- Movement: Reverse Hack Squat
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Reverse Hack Squat$$ as name,
  $$reverse-hack-squat$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, quadriceps, hamstrings$$ as muscles,
  $$The reverse hack squat is done facing the pad of the hack squat machine, with your chest against it and the shoulder pads on your shoulders. You push your hips back and squat down, then drive up. Facing in lets you lean forward more, which brings in more of your glutes. It works on most hack squats, but some shoulder pads don't fit well this way, so test it with the sled empty.$$ as description,
  to_jsonb(array[$$Face the pad with your chest against it and the shoulder pads on your shoulders.$$, $$Set your feet about hip width apart.$$, $$Push your hips back as you lower.$$, $$Drive up through your whole foot.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Reverse hack squat with the sled empty","notes":"Check the pads fit before you load it."},{"level":"rx","label":"Standard","movement":"Reverse Hack Squat","notes":"Hips back, chest on the pad, controlled depth."},{"level":"advanced","label":"Advanced","movement":"Reverse hack squat with a pause at the bottom","notes":"Pause briefly, then drive up."}]$$ as scaling_options,
  $$[{"mistake":"Rounding the lower back","fix":"Stop the rep before your back rounds."},{"mistake":"Rising onto your toes","fix":"Keep your whole foot down and push through your heels."}]$$ as common_faults,
  null as youtube_url,
  array[$$hack squat machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Chest on the pad, hips back.$$ as wod_tip,
  array[$$glutes$$, $$quads$$, $$hamstrings$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$hack-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$reverse-hack-squat$$);

-- Movement: Hack Squat Calf Raise
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Hack Squat Calf Raise$$ as name,
  $$hack-squat-calf-raise$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Calves (gastrocnemius, soleus)$$ as muscles,
  $$The hack squat calf raise uses the hack squat sled to load a calf raise. With the shoulder pads on and your legs nearly straight, you stand with the balls of your feet near the bottom edge of the platform, lower your heels and rise onto your toes. Keep a soft bend in your knees and the balls of your feet fully on the platform; they can slip off the edge. On some models the sled can shift, so keep the safety handles within reach and start light.$$ as description,
  to_jsonb(array[$$Put only the balls of your feet on the platform edge.$$, $$Keep your knees soft, not locked.$$, $$Lower your heels slowly, then rise as high as you can.$$, $$Keep the safety handles within reach the whole set.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Bodyweight calf raise on a step","notes":"Learn the full range first."},{"level":"rx","label":"Standard","movement":"Hack Squat Calf Raise","notes":"Full range, slow lowering, soft knees."},{"level":"advanced","label":"Advanced","movement":"Hack squat calf raise with a pause at the top","notes":"Hold the top for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Locking the knees","fix":"Keep a soft bend so your knees aren't holding the load."},{"mistake":"Feet sliding off the edge","fix":"Reset your feet between sets and stop if they start to slide."}]$$ as common_faults,
  null as youtube_url,
  array[$$hack squat machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Soft knees, safety handles in reach.$$ as wod_tip,
  array[$$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$hack-squat-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$hack-squat-calf-raise$$);

-- ═══ 45-Degree Leg Press (45-degree-leg-press) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$45-Degree Leg Press$$,
  $$45-degree-leg-press$$,
  array[$$quads$$, $$glutes$$]::text[],
  $$The 45-degree leg press is a plate-loaded sled on angled rails. You sit in a reclined seat, put your feet on the sled's footplate, release the safety catches and press the sled up and away from you, then lower it back under control. Your back is supported the whole time, so you can work your legs hard without balancing a bar.

Where you put your feet changes the movement. Feet higher on the plate brings in more glutes and hamstrings, and feet lower puts more work on your quads. You can also press with one leg at a time. Most models have safety catches near the handles and a set of adjustable stops on the rails. Check the placard on your machine, since the release and stops differ by brand.$$,
  $$Start with the sled empty. Sit back so your lower back and hips are flat against the seat pad, and place your feet about shoulder width apart in the middle of the footplate. If the seat back adjusts, set it so you can reach a comfortable depth without your hips lifting off the pad. Set any lower safety stops. Press the sled up slightly, turn the safety handles out to release it, and do a slow test rep. When it feels steady, lock the catches, then load plates evenly on both sides.$$,
  $$[{"mistake":"Lowering until your hips roll off the seat","fix":"Go only as deep as you can while your lower back stays flat on the pad. If your tailbone curls up at the bottom, stop a little higher."},{"mistake":"Locking your knees hard at the top","fix":"Press to nearly straight legs and keep a soft bend. Snapping the knees straight under a heavy sled puts a lot of stress on the joint."},{"mistake":"Pushing on your knees with your hands","fix":"Keep your hands on the handles. Pushing on your knees means the weight is too heavy for the range you're using."},{"mistake":"Letting your knees cave in","fix":"Keep your knees in line with your toes as you lower and press. Reduce the weight if they drift inward."}]$$::jsonb,
  $$Never put any part of your body under the sled. Learn how the safety catches work before you load the machine, and lock them before you take your feet off the plate. Load and unload plates evenly, and strip the sled when you finish. Set the lower stops if your model has them. Keep your feet fully on the plate. Start light while you learn the range. Muscle fatigue is normal; sharp pain in your knees, hips or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a knee, hip, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=GutQSsdFxPE$$
where not exists (select 1 from public.machines where slug = $$45-degree-leg-press$$);

-- Movement: Leg Press
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Leg Press$$ as name,
  $$leg-press$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Quadriceps, glutes, hamstrings (secondary)$$ as muscles,
  $$The leg press is done in the 45-degree leg press. Sitting back with your feet on the footplate, you release the safety catches, lower the sled toward you under control, and press it back up. Your back is supported, so you can work your legs hard.

Options: feet higher on the plate bring in more glutes and hamstrings, feet lower put more work on your quads, and pressing with one leg at a time evens out a weaker side.$$ as description,
  to_jsonb(array[$$Keep your lower back and hips flat on the seat pad.$$, $$Place your feet about shoulder width apart in the middle of the plate.$$, $$Lower only as deep as you can with your hips down.$$, $$Press to nearly straight legs with a soft bend at the top.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Leg press with the sled empty","notes":"Learn the release and your depth first."},{"level":"rx","label":"Standard","movement":"Leg Press","notes":"Controlled depth, hips on the pad, soft knees at the top."},{"level":"advanced","label":"Advanced","movement":"Single-leg leg press","notes":"One leg at a time with a lighter load."}]$$ as scaling_options,
  $$[{"mistake":"Hips rolling off the seat","fix":"Stop a little higher so your lower back stays flat."},{"mistake":"Locking the knees","fix":"Keep a soft bend at the top of every rep."}]$$ as common_faults,
  null as youtube_url,
  array[$$45-degree leg press$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Hips down, soft knees at the top.$$ as wod_tip,
  array[$$quads$$, $$glutes$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$45-degree-leg-press$$) as machine_id
where not exists (select 1 from public.movements where slug = $$leg-press$$);

-- Movement: Leg Press Calf Raise
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Leg Press Calf Raise$$ as name,
  $$leg-press-calf-raise$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Calves (gastrocnemius, soleus)$$ as muscles,
  $$The leg press calf raise uses the leg press sled to load your calves. With your legs nearly straight and only the balls of your feet on the bottom edge of the footplate, you push the plate away by pointing your toes, then let it back under control. Keep a soft bend in your knees and the balls of your feet fully on the platform; they can slip off the edge. Keep the safety catches within reach and start light, since the sled can slip if your feet move.$$ as description,
  to_jsonb(array[$$Press the sled up and keep the safety catches within reach.$$, $$Put only the balls of your feet on the bottom edge of the plate.$$, $$Keep a soft bend in your knees.$$, $$Move through a full range slowly.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Bodyweight calf raise on a step","notes":"Learn the full range first."},{"level":"rx","label":"Standard","movement":"Leg Press Calf Raise","notes":"Full range, slow, soft knees, catches in reach."},{"level":"advanced","label":"Advanced","movement":"Leg press calf raise with a pause at the top","notes":"Hold the top for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Locking the knees","fix":"Keep a soft bend so the sled stays under control."},{"mistake":"Feet creeping up the plate","fix":"Stop, lock the catches and reset your feet."}]$$ as common_faults,
  null as youtube_url,
  array[$$45-degree leg press$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Soft knees, catches in reach.$$ as wod_tip,
  array[$$calves$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$squat$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$45-degree-leg-press$$) as machine_id
where not exists (select 1 from public.movements where slug = $$leg-press-calf-raise$$);

-- ═══ Reverse Hyper (reverse-hyper) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Reverse Hyper$$,
  $$reverse-hyper$$,
  array[$$glutes$$, $$hamstrings$$, $$back$$]::text[],
  $$The reverse hyper is a machine for your glutes, hamstrings and lower back. You lie face down on a padded platform with your hips at the edge and your legs hanging down. A strap around your lower legs connects to a swinging arm that holds the weight. You raise your legs up behind you by squeezing your glutes, then let them swing back down under control.

Unlike a Back Extension, where your upper body moves, here your torso stays still and your legs move. Many lifters use it as an accessory after squats and deadlifts. Designs vary: some use a pendulum arm, some a roller, and some fold away for home gyms. Check the placard on your machine for how to attach the strap and load it.$$,
  $$Start with no weight on the arm, or the lightest load. Lie face down with your hips right at the edge of the pad so your legs can hang freely. Hold the handles firmly. Put the strap around your lower legs, just above the ankles (some models use a roller pad instead). Your legs should hang straight down at the start. Do a few slow reps to learn the swing before you add any plates.$$,
  $$[{"mistake":"Swinging the legs up too high","fix":"Raise your legs until they are about in line with your torso, then lower them. Kicking much higher arches your lower back hard and gives you little extra."},{"mistake":"Letting the weight swing you","fix":"Control the arm on the way down. If it pulls your legs under the pad and yanks you forward, the weight is too heavy or you're swinging too fast."},{"mistake":"Hips too far onto the pad","fix":"Set your hips at the edge so they can move freely. If your hips are on the pad, your lower back does the work instead of your glutes."}]$$::jsonb,
  $$Start light; the swinging arm builds momentum quickly. Hold the handles the whole set. Let the arm come to a full stop before you take the strap off or climb off the machine. Check that the strap is secure before every set. Muscle fatigue is normal; sharp pain in your lower back or hips is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a back, hip or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=z4ziwnaw4r8$$
where not exists (select 1 from public.machines where slug = $$reverse-hyper$$);

-- Existing movement, now linked to this machine: reverse-hypers
update public.movements set machine_id = (select id from public.machines where slug = $$reverse-hyper$$), updated_at = now()
where slug in ($$reverse-hypers$$) and machine_id is null;

-- ═══ Hip Thrust Machine (hip-thrust-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Hip Thrust Machine$$,
  $$hip-thrust-machine$$,
  array[$$glutes$$, $$hamstrings$$]::text[],
  $$The hip thrust machine lets you do a Hip Thrust without setting up a barbell and bench. You sit with your upper back against a pad, a padded belt or lever arm across your hips, and your feet flat on a platform. You drive your hips up until your body is straight from shoulders to knees, then lower back down under control. Your glutes do most of the work, with your hamstrings helping.

Because the machine holds the load in place, you don't have to balance a bar or roll it over your legs, and changing the weight is quick. Designs vary. Some models are plate-loaded, some use a weight stack, and some use a belt instead of a pad. Some have an adjustable back pad or foot platform. Check the placard on your machine before your first set, because how you get in, load it and adjust it depends on the model.$$,
  $$Start with the machine empty or very light. Sit on the seat or floor platform and rest your upper back, just below your shoulder blades, against the back pad. Set the hip pad or belt across the crease of your hips, not on your stomach. Place your feet flat on the platform, about hip width apart. At the top of the rep your shins should be close to vertical; if they slant a lot, move your feet in or out. Do one slow test rep to check the pad stays in place, then add weight.$$,
  $$[{"mistake":"Arching your lower back at the top","fix":"Stop when your body is straight from shoulders to knees. Keep your ribs down and your chin slightly tucked. If you lean back into an arch, your lower back takes over from your glutes."},{"mistake":"Feet too close or too far","fix":"Aim for shins about vertical at the top. Feet too close and your quads take over; feet too far and you feel it mostly in your hamstrings."},{"mistake":"Pushing through your toes","fix":"Drive through your whole foot, with some weight in your heels. If your heels lift, move your feet a little closer."},{"mistake":"Rushing the reps","fix":"Pause for a moment at the top and lower under control. Bouncing the weight off the bottom takes the work away from your glutes."}]$$::jsonb,
  $$Learn how your model starts and stops before you load it. Set the pad or belt across your hips, not your stomach, and check any belt clips are fully closed. Load plates evenly on both sides. Lower the weight all the way down before you slide out of the machine. Start light while you learn the movement. Muscle fatigue is normal; sharp pain in your lower back, hips or knees is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a back, hip, knee or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=79rUx94O-q4$$
where not exists (select 1 from public.machines where slug = $$hip-thrust-machine$$);

-- Movement: Machine Hip Thrust
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Hip Thrust$$ as name,
  $$machine-hip-thrust$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, hamstrings (secondary)$$ as muscles,
  $$The machine hip thrust is a hip thrust done on a hip thrust machine. With your upper back on the pad, the hip pad or belt across your hips and your feet flat, you drive your hips up until your body is straight from shoulders to knees, then lower under control. The machine holds the load in place, so there is no bar to balance. The Hip Thrusts page covers the bodyweight version.$$ as description,
  to_jsonb(array[$$Set the pad or belt across the crease of your hips.$$, $$Place your feet so your shins are about vertical at the top.$$, $$Keep your ribs down and your chin slightly tucked.$$, $$Pause at the top, then lower under control.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Glute bridge on the floor","notes":"Learn the hip drive with no load."},{"level":"rx","label":"Standard","movement":"Machine Hip Thrust","notes":"Full hip extension, short pause at the top."},{"level":"advanced","label":"Advanced","movement":"Machine hip thrust with a 3-second hold","notes":"Hold the top for 3 seconds each rep."}]$$ as scaling_options,
  $$[{"mistake":"Arching the lower back at the top","fix":"Stop when your body is straight. Keep your ribs down."},{"mistake":"Bouncing off the bottom","fix":"Lower under control so your glutes keep working."}]$$ as common_faults,
  null as youtube_url,
  array[$$hip thrust machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Ribs down, squeeze and pause at the top.$$ as wod_tip,
  array[$$glutes$$, $$hamstrings$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$hip-thrust-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-hip-thrust$$);

-- ═══ Multi-Hip Machine (multi-hip-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Multi-Hip Machine$$,
  $$multi-hip-machine$$,
  array[$$glutes$$, $$hamstrings$$, $$inner-thighs$$]::text[],
  $$The multi-hip machine works your hips in four directions, one leg at a time. You stand on a platform next to a padded arm that swings around a pivot at hip height. With the pad against one leg, you can push that leg back (hip extension), out to the side (abduction), in across your body (adduction), or forward and up (hip flexion). Your other leg stays on the platform for balance while you hold the handles.

That makes it one machine for your glutes, outer hips, inner thighs and hip flexors. It is often used for balance and hip strength as well as glute training. Most models use a weight stack, and you rotate the arm and move the pad to change the exercise. Some have a platform that moves up and down so your hip lines up with the pivot. Check the placard on your machine for how to set the arm for each direction.$$,
  $$Pick the lightest weight to start. Stand on the platform and line up the hip of your working leg with the machine's pivot point; raise or lower the platform if your model allows it. Rotate the arm to the start position for the direction you want and place the pad just above your knee, on the side you'll push from (back of the thigh to push back, outside to push out, inside to pull in, front to lift up). Stand tall, hold the handles and do a slow test rep. Then set the weight. Repeat the setup for the other leg.$$,
  $$[{"mistake":"Hip not lined up with the pivot","fix":"Match the height of your hip joint to the machine's pivot. If they don't line up, the pad slides along your leg and the movement feels awkward."},{"mistake":"Leaning your body to move the leg","fix":"Keep your torso tall and still. If you lean forward, back or sideways to move the pad, the weight is too heavy."},{"mistake":"Swinging the leg","fix":"Move the pad slowly in both directions. Letting the weight swing back fast takes the work off your hips."},{"mistake":"Pushing past your range","fix":"Move only as far as you can without your lower back arching or your hips twisting. A small, controlled range is fine."}]$$::jsonb,
  $$Hold the handles the whole set, because you're standing on one leg. Set the arm and pad with the weight resting on the stack, not mid-rep. Keep your standing foot flat and centered on the platform. Let the weight settle back onto the stack before you step off or change direction. Start light, since each direction uses different muscles and some are much weaker than others. Muscle fatigue is normal; sharp pain in your hips, groin, knees or lower back is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a hip, knee, back or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=X8FlF2o0D6k$$
where not exists (select 1 from public.machines where slug = $$multi-hip-machine$$);

-- Movement: Four-Way Hip
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Four-Way Hip$$ as name,
  $$four-way-hip$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, hamstrings, adductors, hip flexors$$ as muscles,
  $$The four-way hip is done on the multi-hip machine, one leg at a time. With the pad against your working leg and your hip lined up with the pivot, you move that leg in one of four directions: back (hip extension), out to the side (abduction), in across your body (adduction) or forward and up (hip flexion).

Options: pick one direction or work through all four. Reset the arm and the pad for each direction, and do the same work on each leg.$$ as description,
  to_jsonb(array[$$Line up the hip of your working leg with the machine's pivot.$$, $$Set the pad just above your knee on the side you push from.$$, $$Stand tall and hold the handles the whole set.$$, $$Move slowly in both directions.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Four-way hip with the lightest weight","notes":"Learn each direction before you add load."},{"level":"rx","label":"Standard","movement":"Four-Way Hip","notes":"Controlled reps in each direction, torso still, both legs."},{"level":"advanced","label":"Advanced","movement":"Four-way hip with a pause at the end of the range","notes":"Hold for a second before you return."}]$$ as scaling_options,
  $$[{"mistake":"Leaning to move the leg","fix":"Keep your torso tall and still. Lighten the weight if you lean."},{"mistake":"Swinging the leg","fix":"Move the pad slowly both ways."}]$$ as common_faults,
  null as youtube_url,
  array[$$multi-hip machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Hip on the pivot, torso still.$$ as wod_tip,
  array[$$glutes$$, $$hamstrings$$, $$inner-thighs$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$multi-hip-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$four-way-hip$$);

-- ═══ Glute Kickback Machine (glute-kickback-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Glute Kickback Machine$$,
  $$glute-kickback-machine$$,
  array[$$glutes$$, $$hamstrings$$]::text[],
  $$The glute kickback machine trains one glute at a time. On most models you kneel or stand leaning forward on a pad, with your chest or forearms supported, and put one foot on a footplate or lever behind you. You push that leg back and up by squeezing your glute, then let it return under control. It is the machine version of a Donkey Kick, with weight added.

Designs vary more than most machines. Some have you kneel on all fours, some have you stand with your chest on a pad, and some use a lever arm with a roller pad against the back of your thigh. Most use a weight stack. Because each side works on its own, it is a useful way to even out a weaker side. Check the placard on your machine for how to set the pad and start position.$$,
  $$Start with the lightest weight. Set the chest pad or forearm pad so your back is flat and your hips are level when you're in position. Kneel or stand on the platform on your support leg and put your working foot on the footplate, or the roller behind your thigh, depending on the model. Hold the handles. Start with your working knee bent under your hip. Do one slow test rep, pushing back until your hip is straight, and check your back stays flat. Then set the weight. Repeat for the other side.$$,
  $$[{"mistake":"Arching your lower back to kick higher","fix":"Stop when your hip is straight, with your thigh about in line with your body. Kicking higher than that comes from your lower back, not your glute."},{"mistake":"Twisting your hips open","fix":"Keep both hips square to the floor. If your working hip rotates up and out, lighten the weight and shorten the range."},{"mistake":"Using momentum","fix":"Push back smoothly, pause briefly at the top, and return slowly. If you have to swing the leg, the weight is too heavy."}]$$::jsonb,
  $$Check the pads and footplate are locked in place before you start. Hold the handles the whole set. Keep your support knee or foot centered on its pad. Let the weight settle back onto the stack before you switch legs or climb off. Start light while you learn the path of the lever. Muscle fatigue is normal; sharp pain in your lower back, hips or knees is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a back, hip, knee or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=gR-3L0Uott8$$
where not exists (select 1 from public.machines where slug = $$glute-kickback-machine$$);

-- Movement: Machine Glute Kickback
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Glute Kickback$$ as name,
  $$machine-glute-kickback$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$lower$$]::text[] as tags,
  $$Glutes, hamstrings (secondary)$$ as muscles,
  $$The machine glute kickback trains one glute at a time. Supported on the machine's chest or forearm pad with your working foot on the footplate or the roller behind your thigh, you push the leg back until your hip is straight, then return under control. It is the machine version of a Donkey Kick.$$ as description,
  to_jsonb(array[$$Set the pads so your back is flat and your hips are level.$$, $$Start with your working knee bent under your hip.$$, $$Push back until your hip is straight, not higher.$$, $$Return slowly and keep both hips square to the floor.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Donkey kicks on the floor","notes":"Learn the movement with no load."},{"level":"rx","label":"Standard","movement":"Machine Glute Kickback","notes":"Hip straight at the top, back flat, both sides."},{"level":"advanced","label":"Advanced","movement":"Machine glute kickback with a pause at the top","notes":"Squeeze for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Arching the back to kick higher","fix":"Stop when your thigh is in line with your body."},{"mistake":"Twisting the hips open","fix":"Keep both hips square. Lighten the weight if you rotate."}]$$ as common_faults,
  null as youtube_url,
  array[$$glute kickback machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Back flat, hip straight, squeeze.$$ as wod_tip,
  array[$$glutes$$, $$hamstrings$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$hinge$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$glute-kickback-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-glute-kickback$$);

-- Check: every machine in this batch exists and every movement is attached to one of them.
do $check$
declare
  missing int;
begin
  select count(*) into missing from (values ($$belt-squat-machine$$), ($$pendulum-squat-machine$$), ($$hack-squat-machine$$), ($$45-degree-leg-press$$), ($$reverse-hyper$$), ($$hip-thrust-machine$$), ($$multi-hip-machine$$), ($$glute-kickback-machine$$)) as v(slug)
  where not exists (select 1 from public.machines m where m.slug = v.slug);
  if missing > 0 then raise exception '% machine(s) missing after insert', missing; end if;
  select count(*) into missing from public.movements mv
  where mv.slug in ($$belt-squat$$, $$belt-squat-march$$, $$belt-squat-romanian-deadlift$$, $$pendulum-squat$$, $$pendulum-reverse-lunge$$, $$pendulum-calf-raise$$, $$hack-squat$$, $$reverse-hack-squat$$, $$hack-squat-calf-raise$$, $$leg-press$$, $$leg-press-calf-raise$$, $$machine-hip-thrust$$, $$four-way-hip$$, $$machine-glute-kickback$$, $$reverse-hypers$$)
    and (mv.machine_id is null or mv.machine_id not in (select id from public.machines where slug in ($$belt-squat-machine$$, $$pendulum-squat-machine$$, $$hack-squat-machine$$, $$45-degree-leg-press$$, $$reverse-hyper$$, $$hip-thrust-machine$$, $$multi-hip-machine$$, $$glute-kickback-machine$$)));
  if missing > 0 then raise exception '% movement(s) not attached to this batch''s machines', missing; end if;
end
$check$;

commit;
