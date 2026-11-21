-- HomeWODRx: DRAFT FOR REVIEW. Nothing here has run. Built 2026-11-20 from live snapshots and review/machines-batch-*.md and FINAL-DECISIONS.md.
-- Run only after Rob says yes, as one transaction in the Supabase SQL editor.
-- Machines batch D: 5 machine pages and their movements. Each insert skips a slug that already exists.
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

-- ═══ Chest-Supported T-Bar Row Machine (chest-supported-t-bar-row-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Chest-Supported T-Bar Row Machine$$,
  $$chest-supported-t-bar-row-machine$$,
  array[$$back$$, $$shoulders$$, $$arms$$]::text[],
  $$The chest-supported T-bar row is a plate-loaded machine for your upper and mid back. You stand on a foot platform and lean your chest onto an angled pad, take the handles below you, and row the lever arm up toward your body, then lower it under control. Your lats, mid back and rear shoulders do the work, with your biceps helping.

The chest pad is the main point of the machine. With your chest supported, your lower back doesn't have to hold you in a bent-over position, so you can focus on your back muscles and keep your body still. Most models have more than one set of handles: a wide grip with palms down works more of your upper back, and a narrow or neutral grip (palms facing each other) brings your elbows closer to your sides. Some have an adjustable chest pad or foot platform. Check the placard on your machine for how it adjusts.$$,
  $$Start with the lever arm empty or very light. If the chest pad or foot platform adjusts, set it so your chest is on the pad and you can reach the handles with your arms straight. Step onto the platform, lean onto the pad with the top of the pad about at your upper chest, and keep your feet flat. Pick a grip, lift the arm off its rest if your model has one, and do one slow test rep. Check that your chest stays on the pad through the whole rep, then load plates.$$,
  $$[{"mistake":"Lifting your chest off the pad","fix":"Keep your chest on the pad the whole set. If you peel off it to heave the weight up, your lower back takes over and the weight is too heavy."},{"mistake":"Shortening the range","fix":"Let your arms straighten at the bottom and pull until your elbows pass your body at the top. Short, choppy reps leave out most of the work for your back."},{"mistake":"Shrugging the weight up","fix":"Keep your shoulders away from your ears. Pull your shoulder blades back and lead with your elbows instead of shrugging."},{"mistake":"Craning your neck to look up","fix":"Keep your head in line with your spine and look slightly down or ahead. Cranking your neck back puts strain on it for no benefit."}]$$::jsonb,
  $$Learn how your model starts and stops before you load it; some have a rest you lift the arm off, others start with the arm hanging. Load plates evenly and in the order your machine expects. Set the arm back on its rest, or lower it all the way, before you step off the platform. Keep your feet flat and fully on the platform. Start light while you learn the path of the lever arm. Muscle fatigue is normal; sharp pain in your lower back, shoulders or elbows is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a back, shoulder, elbow or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=aToycVISitY$$
where not exists (select 1 from public.machines where slug = $$chest-supported-t-bar-row-machine$$);

-- Movement: Chest-Supported T-Bar Row
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Chest-Supported T-Bar Row$$ as name,
  $$chest-supported-t-bar-row$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Rhomboids, middle trapezius, latissimus dorsi, rear deltoids, biceps (secondary)$$ as muscles,
  $$The chest-supported T-bar row is done on the T-bar row machine with your chest on the pad. Standing on the platform, you take the handles and pull the lever arm up toward your chest, then lower it under control. The pad supports your body, so your back can work without holding you up.

Options: a wide grip works more of your upper back; a narrow or neutral grip keeps your elbows closer to your sides.$$ as description,
  to_jsonb(array[$$Set your chest on the pad with your feet flat on the platform.$$, $$Pull your elbows back and squeeze your shoulder blades together.$$, $$Lower to a full stretch without lifting your chest off the pad.$$, $$Set the arm back on its rest at the end of the set.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"T-bar row with no plates","notes":"Learn the path of the lever first."},{"level":"rx","label":"Standard","movement":"Chest-Supported T-Bar Row","notes":"Chest on the pad, squeeze at the top, slow lowering."},{"level":"advanced","label":"Advanced","movement":"Chest-supported T-bar row with a pause at the top","notes":"Hold for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Lifting the chest off the pad","fix":"Keep your chest down. Lighten the load if you heave."},{"mistake":"Short pulls","fix":"Pull until your elbows pass your sides."}]$$ as common_faults,
  null as youtube_url,
  array[$$chest-supported t-bar row machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Chest on the pad, squeeze the shoulder blades.$$ as wod_tip,
  array[$$back$$, $$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$chest-supported-t-bar-row-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$chest-supported-t-bar-row$$);

-- ═══ Pec Deck Machine (pec-deck-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Pec Deck Machine$$,
  $$pec-deck-machine$$,
  array[$$chest$$, $$shoulders$$]::text[],
  $$The pec deck is a seated machine with two arms that swing around a pivot beside each shoulder. Most gym models work two ways. Facing out, with your back on the pad, you bring the handles together in front of your chest in a hugging motion. That is the Pec Fly, and it works your chest. Facing in, with your chest on the pad, you sweep the handles out and back. That is the Rear Delt Fly, and it works the back of your shoulders and your upper back.

Because the arms stay nearly straight, the pec deck isolates these muscles more than a press or row does, so you use much less weight. Most models use a weight stack. You change between the two exercises by adjusting the handles or arm start position, and many have a seat height adjustment. Some older designs use elbow pads instead of handles and only do the Pec Fly. Check the placard on your machine for how to switch the arms.$$,
  $$Pick the lightest weight to start. For the Pec Fly, sit with your back against the pad and set the seat so the handles are at about chest height. Set the arms so that when you hold the handles, your hands start just behind or level with your chest and you feel a light stretch, not a strain. For the Rear Delt Fly, sit facing the pad with your chest on it, set the arms to their front position, and set the seat so the handles are at about shoulder height. In both, keep a slight bend in your elbows. Do one slow test rep, then set the weight.$$,
  $$[{"mistake":"Starting with the arms set too far back","fix":"On the Pec Fly, set the start position so you feel a light stretch across your chest. Too far back loads the front of your shoulder hard at the start of every rep."},{"mistake":"Bending and straightening your elbows","fix":"Keep the same slight bend in your elbows for the whole rep. If your elbows bend more as you move, you've turned it into a press or row and the weight is probably too heavy."},{"mistake":"Shrugging on the rear delt fly","fix":"Keep your shoulders down and your neck relaxed. Think of moving your hands out wide, not up toward your ears."},{"mistake":"Using momentum","fix":"Move the handles smoothly and pause for a moment at the end of each rep. If you need to swing the weight, lighten it. Light weight and control work well here."}]$$::jsonb,
  $$Set the seat and arm start position before you choose a weight, and recheck them when you switch between the Pec Fly and Rear Delt Fly. Let the weight stack settle under control before you let go of the handles. Start light; small changes in weight feel big on this machine. Muscle fatigue is normal; sharp pain in your shoulders, elbows or chest is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a shoulder, elbow or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=ON8kg47QpOY$$
where not exists (select 1 from public.machines where slug = $$pec-deck-machine$$);

-- Movement: Pec Deck Fly
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Pec Deck Fly$$ as name,
  $$pec-deck-fly$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Pectorals, front deltoids$$ as muscles,
  $$The pec deck fly is done on the pec deck machine facing away from the stack. Seated with the handles or pads out to your sides at chest height, you bring them together in front of your chest in a wide arc, then open back out under control.$$ as description,
  to_jsonb(array[$$Set the seat so the handles are at chest height.$$, $$Start with your hands level with or just behind your chest.$$, $$Keep a slight bend in your elbows.$$, $$Bring the handles together, then open slowly.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Pec deck fly with the lightest weight","notes":"Learn the arc first."},{"level":"rx","label":"Standard","movement":"Pec Deck Fly","notes":"Wide arc, slight elbow bend, slow return."},{"level":"advanced","label":"Advanced","movement":"Pec deck fly with a pause in front of the chest","notes":"Squeeze for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Stretching too far back","fix":"Start with your hands level with or just behind your chest."},{"mistake":"Pressing instead of flying","fix":"Keep the elbow bend the same through the rep."}]$$ as common_faults,
  null as youtube_url,
  array[$$pec deck machine$$]::text[] as equipment,
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
  (select id from public.machines where slug = $$pec-deck-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$pec-deck-fly$$);

-- Movement: Machine Rear Delt Fly
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Rear Delt Fly$$ as name,
  $$machine-rear-delt-fly$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Rear deltoids, rhomboids, middle trapezius$$ as muscles,
  $$The machine rear delt fly is done on the pec deck machine facing the pad. Seated with your chest on the pad and the handles in front of you, you open your arms out and back in a wide arc, then return under control. It trains the back of your shoulders and upper back.$$ as description,
  to_jsonb(array[$$Face the pad and set the seat so the handles are at shoulder height.$$, $$Set the arms to the rear delt start position.$$, $$Keep a slight bend in your elbows.$$, $$Open out and back, then return slowly.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Rear delt fly with the lightest weight","notes":"Learn the arc first."},{"level":"rx","label":"Standard","movement":"Machine Rear Delt Fly","notes":"Wide arc, slight elbow bend, slow return."},{"level":"advanced","label":"Advanced","movement":"Machine rear delt fly with a pause at the back","notes":"Hold for a second each rep."}]$$ as scaling_options,
  $$[{"mistake":"Shrugging the shoulders","fix":"Keep your shoulders down and away from your ears."},{"mistake":"Using momentum","fix":"Lighten the weight and move slowly both ways."}]$$ as common_faults,
  null as youtube_url,
  array[$$pec deck machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Shoulders down, wide arc.$$ as wod_tip,
  array[$$shoulders$$, $$back$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$pec-deck-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-rear-delt-fly$$);

-- ═══ Assisted Pull-Up and Dip Machine (assisted-pull-up-dip-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Assisted Pull-Up and Dip Machine$$,
  $$assisted-pull-up-dip-machine$$,
  array[$$back$$, $$chest$$, $$shoulders$$, $$arms$$]::text[],
  $$The assisted pull-up and dip machine helps you do Pull-Ups, Chin-Ups and Dips with less than your full body weight. You kneel or stand on a padded platform that is attached to a weight stack. The stack pushes the platform up and takes some of your weight, so you can do full reps with good form while you build strength.

The key thing to know is that it works the opposite way to most machines. The more weight you select, the more help you get and the easier the rep is. Less weight on the stack means less help and a harder rep. The machine has pull-up handles at the top, often with wide, narrow and neutral grips, and dip handles lower down. Pull-ups work your lats and upper back with your biceps helping. Dips work your chest, the front of your shoulders and your triceps. Some models use a knee pad, some a standing platform, and some have a platform that folds away. Check the placard on your machine.$$,
  $$Pick a weight that gives you plenty of help for your first set; you can lower it from there. If the platform folds, fold it down. Step up onto the steps, take the pull-up or dip handles, then carefully put one knee (or both feet) on the platform, then the other. Start at the top position: arms straight with shoulders active for pull-ups, or arms straight and locked out over the dip handles. Do one slow test rep. If you can't do a full rep with control, add more weight to the stack for more help.$$,
  $$[{"mistake":"Adding weight to make it harder","fix":"This machine works in reverse. To make a rep harder, lower the weight on the stack. To make it easier, raise it."},{"mistake":"Getting on or off carelessly","fix":"Hold the handles firmly and use the steps every time. Put one knee or foot on the platform at a time, and step back down the same way at the end of the set. The platform can move suddenly if you shift off it."},{"mistake":"Cutting the range short","fix":"On pull-ups, start each rep from straight arms and pull until your chin clears the bar. On dips, lower until your upper arms are about level with the handles, or as far as your shoulders allow, then press back up. Add help if you can't reach the full range."},{"mistake":"Dropping fast into the bottom of a dip","fix":"Lower yourself under control. Dropping quickly lets your shoulders roll forward and stresses the front of the shoulder."}]$$::jsonb,
  $$Remember that more weight means more help. Hold the handles firmly as you get on and off, and keep one hand on the handles until both feet are back on the steps. Get on and off at the top of the movement, never from the bottom. Keep your hands, feet and clothing clear of the platform's moving parts. Start with more help than you think you need while you learn the machine. Muscle fatigue is normal; sharp pain in your shoulders, elbows or chest is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a shoulder, elbow, wrist or other injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=M8LVjTv3-t0$$
where not exists (select 1 from public.machines where slug = $$assisted-pull-up-dip-machine$$);

-- Movement: Assisted Pull-Ups
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Assisted Pull-Ups$$ as name,
  $$assisted-pull-ups$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Latissimus dorsi, biceps, rhomboids, rear deltoids$$ as muscles,
  $$Assisted pull-ups are done on the assisted pull-up machine, with a platform under your knees or feet that lifts part of your body weight. From a hang with your arms straight, you pull until your chin clears the handles, then lower under control. More weight on the stack means more help.

Options: palms facing you (chin-up grip) brings in more biceps, and neutral handles, on models that have them, are often easier on the shoulders.$$ as description,
  to_jsonb(array[$$Set the help and get on at the top of the movement.$$, $$Start each rep from straight arms.$$, $$Pull until your chin clears the handles.$$, $$Lower slowly back to straight arms.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Assisted pull-ups with a lot of help","notes":"Choose enough help to do every rep with full range."},{"level":"rx","label":"Standard","movement":"Assisted Pull-Ups","notes":"Chin over the handles, full lowering."},{"level":"advanced","label":"Advanced","movement":"Assisted pull-ups with less help","notes":"Lower the help a little at a time, working toward Pull-Ups."}]$$ as scaling_options,
  $$[{"mistake":"Half reps","fix":"Start from straight arms and finish with your chin over the handles."},{"mistake":"Dropping on the way down","fix":"Lower under control; that is half the work."}]$$ as common_faults,
  null as youtube_url,
  array[$$assisted pull-up and dip machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Straight arms to chin over.$$ as wod_tip,
  array[$$back$$, $$arms$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$assisted-pull-up-dip-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$assisted-pull-ups$$);

-- Movement: Assisted Dips
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Assisted Dips$$ as name,
  $$assisted-dips$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Triceps, pectorals, front deltoids$$ as muscles,
  $$Assisted dips are done on the dip handles of the assisted machine, with the platform lifting part of your body weight. From straight arms, you bend your elbows to lower until your upper arms are about level with the handles, or as far as your shoulders allow, then press back up. More weight on the stack means more help.$$ as description,
  to_jsonb(array[$$Set the help and get on at the top of the movement.$$, $$Keep your shoulders down and your chest up.$$, $$Lower until your upper arms are about level with the handles, or as far as is comfortable.$$, $$Press back up to straight arms.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Assisted dips with a lot of help","notes":"Choose enough help to do every rep with control."},{"level":"rx","label":"Standard","movement":"Assisted Dips","notes":"Controlled depth, full lockout."},{"level":"advanced","label":"Advanced","movement":"Assisted dips with less help","notes":"Lower the help a little at a time."}]$$ as scaling_options,
  $$[{"mistake":"Going too deep","fix":"Stop at a depth your shoulders tolerate."},{"mistake":"Shrugging up","fix":"Keep your shoulders down away from your ears."}]$$ as common_faults,
  null as youtube_url,
  array[$$assisted pull-up and dip machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Shoulders down, controlled depth.$$ as wod_tip,
  array[$$chest$$, $$arms$$, $$shoulders$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$assisted-pull-up-dip-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$assisted-dips$$);

-- ═══ Seated Shoulder Press Machine (shoulder-press-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Seated Shoulder Press Machine$$,
  $$shoulder-press-machine$$,
  array[$$shoulders$$, $$arms$$]::text[],
  $$The seated shoulder press machine lets you press weight overhead while you sit with your back supported. You hold two handles at about shoulder height and press them up, then lower them back under control. Your shoulders do most of the work, and the backs of your arms (triceps) help. Because the machine guides the path and supports your back, you don't need to balance the weight, which makes it a good option if you're new to overhead pressing or want to train your shoulders without a spotter.

Designs vary. Some use a weight stack, some are plate-loaded, and some have arms that move on their own so each side works separately. Many offer two grips: palms facing forward, or palms facing each other. Some have a foot pedal or lever that brings the handles down to a starting position for you. Check the placard on your machine for how to set the seat and start the movement.$$,
  $$Pick a light weight first. Adjust the seat so the handles sit at about shoulder height, or slightly below, when you sit down. Sit all the way back with your back flat against the pad and your feet flat on the floor. Take the grip that feels best on your shoulders. If your model has a foot pedal or a starting lever, use it to bring the handles into place. Do a slow test rep, then set your working weight.$$,
  $$[{"mistake":"Seat at the wrong height","fix":"Adjust the seat so the handles start at about shoulder height. If they start far above your shoulders, raise the seat. If you have to drop your elbows deep below the handles to start, that puts extra strain on the front of your shoulders."},{"mistake":"Arching your back off the pad","fix":"Keep your back and head on the pad and your core tight. If you arch to finish the press, the weight is too heavy."},{"mistake":"Letting the stack crash between reps","fix":"Lower the handles under control and stop just before the plates touch. Then press again."},{"mistake":"Shrugging toward your ears","fix":"Keep your shoulders down and away from your ears as you press. Press to nearly straight arms, without forcing the lockout."}]$$::jsonb,
  $$Set the seat before you add weight, and make sure any pins are fully seated. If your model has a foot pedal or lever, learn how it works before your first set. Lower the weight with control and let it come to rest before you let go of the handles. Start light while you learn the range. Muscle fatigue is normal; sharp pain in your shoulders, neck or elbows is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have a shoulder, neck or elbow injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=5NBA6-lIXuM$$
where not exists (select 1 from public.machines where slug = $$shoulder-press-machine$$);

-- Movement: Machine Shoulder Press
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Shoulder Press$$ as name,
  $$machine-shoulder-press$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$push$$]::text[] as tags,
  $$Deltoids, triceps, upper chest (secondary)$$ as muscles,
  $$The machine shoulder press is done seated on a shoulder press machine. With your back against the pad and the handles at about shoulder height, you press the handles up until your arms are nearly straight, then lower under control.

Options: use the palms-forward or palms-facing handles, and on independent-arm models press one arm at a time.$$ as description,
  to_jsonb(array[$$Set the seat so the handles start at about shoulder height.$$, $$Keep your back and head against the pad.$$, $$Press to nearly straight arms.$$, $$Lower slowly back to the start.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Machine shoulder press with the lightest weight","notes":"Learn the seat height and path first."},{"level":"rx","label":"Standard","movement":"Machine Shoulder Press","notes":"Back on the pad, controlled press and lowering."},{"level":"advanced","label":"Advanced","movement":"Single-arm machine shoulder press","notes":"On independent-arm models, one arm at a time."}]$$ as scaling_options,
  $$[{"mistake":"Arching the back","fix":"Keep your back on the pad. Lighten the weight if you arch."},{"mistake":"Seat too low","fix":"Raise the seat so the handles start at shoulder height."}]$$ as common_faults,
  null as youtube_url,
  array[$$seated shoulder press machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Back on the pad, press and lower slowly.$$ as wod_tip,
  array[$$shoulders$$, $$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$push$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$shoulder-press-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-shoulder-press$$);

-- ═══ Preacher Curl Machine (preacher-curl-machine) ═══
insert into public.machines (name, slug, muscle_groups, overview, setup_notes, common_mistakes, safety_notes, youtube_url)
select
  $$Preacher Curl Machine$$,
  $$preacher-curl-machine$$,
  array[$$arms$$]::text[],
  $$The preacher curl machine works your biceps, the muscles on the front of your upper arms. You sit with the backs of your upper arms resting on an angled pad, hold the handles, and curl them up toward your shoulders, then lower them back down. The pad keeps your upper arms still, so you can't swing your body to lift the weight. That makes it a simple way to focus on your biceps.

Some models use a weight stack with a cam, some are plate-loaded, and some have handles that move separately so each arm works on its own. Many have a pad that adjusts in height and handles you can grip palms up or palms facing each other. Check the placard on your machine for how to set the seat and pad.$$,
  $$Start light. Adjust the seat so your armpits sit near the top of the pad and the backs of your upper arms lie flat on it. Your elbows should line up with the machine's pivot point, which is usually marked with a dot or sticker. Hold the handles with your arms nearly straight, but not locked. Do a slow test rep to check that your upper arms stay on the pad the whole time.$$,
  $$[{"mistake":"Elbows not lined up with the pivot","fix":"Set the seat so your elbows line up with the pivot marker. If they're off, the handles pull at an odd angle and the movement feels awkward on your elbows."},{"mistake":"Dropping into the bottom","fix":"Lower the handles slowly and stop with a slight bend in your elbows. Dropping fast and snapping your arms straight stresses the elbow."},{"mistake":"Lifting your arms off the pad","fix":"Keep your upper arms on the pad. If your elbows lift or you lean back to curl, the weight is too heavy."}]$$::jsonb,
  $$Set the seat and pad before you add weight, and make sure any pins are fully seated. Lower the weight under control every rep, and avoid a hard, fast stretch at the bottom, since that is where the elbow is most at risk. Start light; your biceps are small muscles, and you'll need less weight than you might expect. Let the weight come to rest before you let go. Muscle fatigue and a burn in your upper arms are normal; sharp pain in your elbows, forearms or shoulders is not, so stop the set if you feel it. This guide is educational, not a substitute for in-person instruction; ask a staff member or trainer at your gym if you're ever unsure how to set up a machine. If you have an elbow, wrist or shoulder injury, check with a doctor or physical therapist before using this machine.$$,
  $$https://www.youtube.com/watch?v=7X7ZV4gdvXg$$
where not exists (select 1 from public.machines where slug = $$preacher-curl-machine$$);

-- Movement: Machine Preacher Curl
insert into public.movements (name, slug, category, equipment_category, tags, muscles, description, tips, scaling_options, common_faults, youtube_url, equipment, daily_wod_eligible, timed, beginner_reps, intermediate_reps, advanced_reps, wod_tip, muscle_groups, warmup_eligible, movement_pattern, tabata_suitable, machine_id)
select
  $$Machine Preacher Curl$$ as name,
  $$machine-preacher-curl$$ as slug,
  $$machine$$ as category,
  $$machine$$ as equipment_category,
  array[$$machine$$, $$pull$$]::text[] as tags,
  $$Biceps, brachialis$$ as muscles,
  $$The machine preacher curl is done with your upper arms resting on the machine's angled pad. With your elbows lined up with the pivot, you curl the handles up toward your shoulders, then lower under control without a fast, hard stretch at the bottom.

Options: curl one arm at a time, or use a palms-facing (hammer) grip on models with those handles.$$ as description,
  to_jsonb(array[$$Set the seat so your armpits sit near the top of the pad.$$, $$Line up your elbows with the machine's pivot.$$, $$Curl up smoothly and squeeze.$$, $$Lower slowly and stop just short of locking your elbows hard.$$]::text[]) as tips,
  $$[{"level":"beginner","label":"Beginner","movement":"Machine preacher curl with the lightest weight","notes":"Learn the setup first."},{"level":"rx","label":"Standard","movement":"Machine Preacher Curl","notes":"Elbows on the pivot, slow lowering."},{"level":"advanced","label":"Advanced","movement":"Single-arm machine preacher curl","notes":"One arm at a time, same reps each side."}]$$ as scaling_options,
  $$[{"mistake":"Dropping into the bottom","fix":"Lower slowly. The bottom is where the elbow is most at risk."},{"mistake":"Lifting the elbows off the pad","fix":"Keep your upper arms on the pad the whole rep."}]$$ as common_faults,
  null as youtube_url,
  array[$$preacher curl machine$$]::text[] as equipment,
  false as daily_wod_eligible,
  false as timed,
  null as beginner_reps,
  null as intermediate_reps,
  null as advanced_reps,
  $$Elbows on the pad, lower slowly.$$ as wod_tip,
  array[$$arms$$]::text[] as muscle_groups,
  false as warmup_eligible,
  $$pull$$ as movement_pattern,
  false as tabata_suitable,
  (select id from public.machines where slug = $$preacher-curl-machine$$) as machine_id
where not exists (select 1 from public.movements where slug = $$machine-preacher-curl$$);

-- Check: every machine in this batch exists and every movement is attached to one of them.
do $check$
declare
  missing int;
begin
  select count(*) into missing from (values ($$chest-supported-t-bar-row-machine$$), ($$pec-deck-machine$$), ($$assisted-pull-up-dip-machine$$), ($$shoulder-press-machine$$), ($$preacher-curl-machine$$)) as v(slug)
  where not exists (select 1 from public.machines m where m.slug = v.slug);
  if missing > 0 then raise exception '% machine(s) missing after insert', missing; end if;
  select count(*) into missing from public.movements mv
  where mv.slug in ($$chest-supported-t-bar-row$$, $$pec-deck-fly$$, $$machine-rear-delt-fly$$, $$assisted-pull-ups$$, $$assisted-dips$$, $$machine-shoulder-press$$, $$machine-preacher-curl$$)
    and (mv.machine_id is null or mv.machine_id not in (select id from public.machines where slug in ($$chest-supported-t-bar-row-machine$$, $$pec-deck-machine$$, $$assisted-pull-up-dip-machine$$, $$shoulder-press-machine$$, $$preacher-curl-machine$$)));
  if missing > 0 then raise exception '% movement(s) not attached to this batch''s machines', missing; end if;
end
$check$;

commit;
