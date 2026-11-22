-- Fix D: CrossFit Open / Games workouts corrected to official definitions.
-- Generated; do not run without review.
do $$
declare n int;
begin
  -- midline-march
  update benchmark_workouts set
    scheme = '3 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '12–20 min',
    equipment = array['ghd','barbell'],
    difficulty = 'advanced',
    body_focus = 'core',
    movements = '[{"name": "GHD Sit-Ups", "reps": "25", "tip": "Touch the floor behind you and sit all the way up; let your hips do the work so your abs last all three rounds."}, {"name": "Handstand Walk", "reps": "50 ft", "tip": "Short, quick hand steps with your eyes between your hands; a fall means restarting from where you came down."}, {"name": "Overhead Walking Lunges", "reps": "50 ft", "tip": "Lock the bar overhead with active shoulders and touch the back knee softly each step.", "rx_men": "155 lb", "rx_women": "115 lb"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Midline March was Event 11 at the 2014 CrossFit Games, held on the final Sunday at the StubHub Center in Carson, California. Athletes completed 3 rounds for time of 25 GHD sit-ups, a 50-ft handstand walk and a 50-ft overhead walking lunge at 155 lb for men and 115 lb for women. Rich Froning won the men''s event and Annie Thorisdottir won for the women.

The name says it all: every movement hammers the trunk. GHD sit-ups fatigue the abs and hip flexors, the handstand walk needs a tight, stacked body, and the heavy overhead lunge asks you to hold a barbell steady while your midline is already tired. Falling off the hands or dropping the bar costs time fast.',
    tips = '["Pace the GHD sit-ups; they make everything after them harder.", "Walk on your hands in short steps rather than lunging forward.", "Choose an overhead load you can carry 50 ft without dropping."]'::jsonb,
    coaching_tips = '["Break the GHD sit-ups into sets from the first round so your trunk still works for the handstand walk.", "Squeeze your glutes and ribs down in the handstand to keep your body in one straight line.", "Get the bar overhead with a push jerk and lock your elbows before the first lunge step.", "Take steady, even lunge steps and breathe at the top of each one.", "If you lose the handstand, reset quickly and kick back up instead of resting on the floor."]'::jsonb,
    scaling_notes = 'Swap GHD sit-ups for AbMat sit-ups or reduce to 15 per round. Replace the handstand walk with 5 wall walks or a 30-second handstand hold against a wall. Lighten the overhead lunge to 95 lb / 65 lb, or hold a plate or dumbbell overhead. Newer athletes can do 2 rounds.',
    faqs = '[{"question": "What is Midline March?", "answer": "A 2014 CrossFit Games event: 3 rounds for time of 25 GHD sit-ups, a 50-ft handstand walk and a 50-ft overhead walking lunge at 155 lb / 115 lb."}, {"question": "How many total reps are in Midline March?", "answer": "75 GHD sit-ups, 150 ft of handstand walking and 150 ft of overhead walking lunges across the 3 rounds."}, {"question": "Can I do Midline March without a GHD?", "answer": "Yes. Use AbMat sit-ups in place of GHD sit-ups. The workout still trains the midline hard."}]'::jsonb,
    updated_at = now()
  where slug = 'midline-march';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'midline-march'; end if;

  -- naughty-nancy
  update benchmark_workouts set
    scheme = '4 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '15–20 min',
    equipment = array['running','barbell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Run", "reps": "600 m", "tip": "At the Games this run went up and over a steep hill and through the stands; run hills or stairs if you have them."}, {"name": "Overhead Squats", "reps": "25", "tip": "Keep a wide grip and push up into the bar; break the set before your shoulders give out.", "rx_men": "140 lb", "rx_women": "95 lb"}]'::jsonb,
    scoring_notes = 'Record your finish time. At the 2013 Games the time cap was 20 minutes.',
    description = 'Naughty Nancy was an event at the 2013 CrossFit Games, a harder take on the classic Nancy benchmark (5 rounds of a 400 m run and 15 overhead squats at 95 lb / 65 lb). The Games version cut it to 4 rounds but made each one far tougher: a 600 m run up and over the steep hill at the end of the soccer stadium and through the stands, then 25 overhead squats at 140 lb for men and 95 lb for women, with a 20-minute cap.

The hill run leaves your legs and lungs burning just as you have to hold a heavy bar overhead in the bottom of a squat. Shoulder stability and steady breathing decide this one.',
    tips = '["Run the first 600 m at a pace you can repeat four times.", "Plan your overhead squat sets before you get to the bar.", "Use the walk back to the bar to bring your breathing down."]'::jsonb,
    coaching_tips = '["Shorten your stride and drive your arms on the uphill, then let gravity help on the way down.", "Get the bar overhead with a push jerk or snatch and lock it out before your first squat.", "Keep your chest up and push your knees out so the bar stays over the middle of your feet.", "Break the 25 overhead squats into planned sets, such as 10-8-7, rather than going until failure.", "Shake out your shoulders on the run so your arms are fresh for the next set."]'::jsonb,
    scaling_notes = 'Reduce the overhead squat to 95 lb / 65 lb or use a PVC pipe or empty bar, and cut the reps to 15 per round. Run 400 m on flat ground if you have no hill. If overhead squats are not yet safe for you, use front squats at a load you can move well.',
    faqs = '[{"question": "What is Naughty Nancy?", "answer": "A 2013 CrossFit Games event: 4 rounds for time of a 600 m hill run and 25 overhead squats at 140 lb / 95 lb, with a 20-minute cap."}, {"question": "How is Naughty Nancy different from Nancy?", "answer": "Nancy is 5 rounds of a 400 m run and 15 overhead squats at 95 lb / 65 lb. Naughty Nancy has fewer rounds but longer runs, more reps and heavier loads."}, {"question": "How many total reps are in Naughty Nancy?", "answer": "2,400 m of running and 100 overhead squats across the 4 rounds."}]'::jsonb,
    updated_at = now()
  where slug = 'naughty-nancy';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'naughty-nancy'; end if;

  -- the-separator
  update benchmark_workouts set
    scheme = 'For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '12–20 min',
    equipment = array['rings','barbell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Ring Handstand Push-Ups", "reps": "12 (men only)", "tip": "Men open with 12 reps. Women skip this set and start with the back squats."}, {"name": "Back Squats", "reps": "15", "tip": "Take the bar from the rack and keep your chest up out of the bottom.", "rx_men": "225 lb", "rx_women": "165 lb"}, {"name": "Burpees", "reps": "20", "tip": "Find a steady rhythm; these are your rest from the rings."}, {"name": "Ring Handstand Push-Ups", "reps": "9 men / 6 women", "tip": "Keep the rings close to your shoulders and press straight up."}, {"name": "Front Squats", "reps": "18", "tip": "Keep your elbows high so the bar stays on your shoulders.", "rx_men": "205 lb", "rx_women": "145 lb"}, {"name": "Burpees", "reps": "20", "tip": "Breathe on the way down and stand up tall each rep."}, {"name": "Ring Handstand Push-Ups", "reps": "6 men / 4 women", "tip": "Small sets or singles are fine; a no-rep costs more than a short rest."}, {"name": "Overhead Squats", "reps": "21", "tip": "Get the bar overhead and lock your arms before the first squat.", "rx_men": "185 lb", "rx_women": "125 lb"}, {"name": "Burpees", "reps": "20", "tip": "Men finish the workout here."}, {"name": "Ring Handstand Push-Ups", "reps": "2 (women only)", "tip": "Women finish with 2 ring handstand push-ups."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'The Separator was Event 9 at the 2016 CrossFit Games, held on Saturday night in the Tennis Stadium. It paired ring handstand push-ups with heavy squats and burpees. Men did 12-9-6 ring handstand push-ups, each set followed by squats (15 back squats at 225 lb, 18 front squats at 205 lb, 21 overhead squats at 185 lb) and 20 burpees. Women started with the squats (165 lb, 145 lb, 125 lb) and did 6-4-2 ring handstand push-ups after each set of burpees. Cole Sager and Kari Pearce won.

Ring handstand push-ups were new to most of the field, and many athletes got stuck on them. The name fit: the rings separated the athletes who had practiced them from those who had not.',
    tips = '["The ring handstand push-ups decide the event; practice them before you try it.", "Pick squat loads you can move in two or three sets.", "Treat the burpees as active rest, not a sprint."]'::jsonb,
    coaching_tips = '["Set the rings so you can kick up from a box or the floor, and turn the rings out slightly at the top of each press.", "Keep your head moving straight down between the rings and your body stacked over your hands.", "Break the squats early: for example 8-7 on the back squats and 6-6-6 on the front squats.", "Step up from the burpees with a steady rhythm so your heart rate is down before the next set of push-ups.", "Lock the overhead squat bar out hard and keep your weight in the middle of your feet."]'::jsonb,
    scaling_notes = 'Replace ring handstand push-ups with handstand push-ups against a wall, pike push-ups on a box, or dumbbell strict presses, and halve the reps if needed. Lower the squat loads to 135 lb / 95 lb or lighter, and use the same load for all three squat sets if that is easier to set up. Reduce burpees to 10 per set.',
    faqs = '[{"question": "What is The Separator?", "answer": "Event 9 of the 2016 CrossFit Games: ring handstand push-ups, back squats, front squats, overhead squats and burpees for time."}, {"question": "What are the loads for The Separator?", "answer": "Men: back squats 225 lb, front squats 205 lb, overhead squats 185 lb. Women: 165 lb, 145 lb and 125 lb."}, {"question": "How do the men''s and women''s versions differ?", "answer": "Men do 27 ring handstand push-ups (12-9-6), starting with them. Women do 12 (6-4-2), starting with the back squats and finishing on the rings. Both do 60 burpees."}]'::jsonb,
    updated_at = now()
  where slug = 'the-separator';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'the-separator'; end if;

  -- open-14-1
  update benchmark_workouts set
    scheme = 'AMRAP 10',
    format = 'AMRAP 10',
    scoring_type = 'rounds_reps',
    duration_estimate = '10 min',
    equipment = array['jumpRope','barbell'],
    difficulty = 'intermediate',
    body_focus = 'full-body',
    movements = '[{"name": "Double-Unders", "reps": "30", "tip": "Relax your wrists; a steady rhythm is faster than rushing and tripping."}, {"name": "Power Snatches", "reps": "15", "tip": "Pull the bar close and land in a quarter squat; quick singles work if touch-and-go falls apart.", "rx_men": "75 lb", "rx_women": "55 lb"}]'::jsonb,
    scoring_notes = 'Score is total rounds + reps in 10 minutes.',
    description = 'Open 14.1 opened the 2014 CrossFit Open with a repeat of Open 11.1: as many rounds as possible in 10 minutes of 30 double-unders and 15 power snatches at 75 lb for men and 55 lb for women. CrossFit brought it back so athletes could test themselves against their 2011 score.

The load is moderate, so the workout comes down to how well you skip under fatigue and how long you can hold on to the barbell. Tripped ropes and dropped bars cost seconds in every round, and those seconds add up fast in a 10-minute test.',
    tips = '["Scale double-unders to 60 single-unders if you cannot link them yet.", "Pick a snatch rhythm you can hold for all 10 minutes.", "Set the rope and bar close together to save transition time."]'::jsonb,
    coaching_tips = '["Stay tall on the double-unders with your hands by your hips and small, quick jumps.", "Break the snatches into sets you can repeat, such as 8-7 or 5-5-5, before your grip fades.", "Drop the rope and grab the bar right away; long transitions are the easiest time to lose.", "Breathe through your nose on the walk between stations to keep your heart rate in check."]'::jsonb,
    scaling_notes = 'Swap double-unders for 60 single-unders per round. Lower the power snatch to 45 lb / 35 lb or use a dumbbell. Keep the 10-minute AMRAP and score total rounds + reps.',
    faqs = '[{"question": "What weight is Open 14.1?", "answer": "75 lb for men and 55 lb for women on the power snatches."}, {"question": "Is Open 14.1 the same as 11.1?", "answer": "Yes. 14.1 repeated 11.1 exactly: 30 double-unders and 15 power snatches at 75 lb / 55 lb for 10 minutes."}, {"question": "How many reps are in one round of 14.1?", "answer": "45: 30 double-unders and 15 power snatches."}]'::jsonb,
    updated_at = now()
  where slug = 'open-14-1';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-14-1'; end if;

  -- open-14-2
  update benchmark_workouts set
    scheme = 'Every 3:00: 2 rounds, +2 reps each window',
    format = 'Other',
    scoring_type = 'total_reps',
    duration_estimate = '6–15 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Overhead Squats", "reps": "2 rounds of 10", "tip": "0:00–3:00 window: 2 rounds of 10 overhead squats and 10 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 10", "tip": "Finish both rounds before 3:00 to move on."}, {"name": "Overhead Squats", "reps": "2 rounds of 12", "tip": "3:00–6:00 window: 2 rounds of 12 overhead squats and 12 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 12", "tip": "Finish both rounds before 6:00 to move on."}, {"name": "Overhead Squats", "reps": "2 rounds of 14", "tip": "6:00–9:00 window: 2 rounds of 14 overhead squats and 14 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 14", "tip": "Finish both rounds before 9:00 to move on."}, {"name": "Overhead Squats", "reps": "2 rounds of 16", "tip": "9:00–12:00 window: 2 rounds of 16 overhead squats and 16 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 16", "tip": "Keep adding 2 reps to both movements every 3 minutes until you miss a window."}]'::jsonb,
    scoring_notes = 'Score is total reps completed. The workout ends when you do not finish both rounds inside a 3-minute window.',
    description = 'Open 14.2 was the second workout of the 2014 CrossFit Open. Every 3 minutes you complete 2 rounds of overhead squats (95 lb / 65 lb) and chest-to-bar pull-ups: 10 of each in the first window, 12 in the second, 14 in the third, adding 2 reps to both movements every window. Finish both rounds inside the window and you earn the next 3 minutes. Miss it and the workout ends.

The early windows feel easy, which is the trap. Each new window adds 8 reps while the time stays the same, so grip and shoulders fade quickly. Score is total reps completed.',
    tips = '["Move fast in the early windows to bank rest for later.", "Break the chest-to-bar pull-ups before your grip fails.", "Keep the bar close to the pull-up rig to save steps."]'::jsonb,
    coaching_tips = '["Finish the first windows with time to spare; the rest you earn there is what carries you into the later windows.", "Get the bar overhead with a power snatch or push jerk and lock out before the first squat.", "Split the chest-to-bar pull-ups into small sets, such as 5-5 or 6-4, from the start.", "Use the rest at the end of each window to shake out your grip and breathe.", "Know your target reps for each window before the clock starts so you never have to count in your head."]'::jsonb,
    scaling_notes = 'Lower the overhead squat to 65 lb / 45 lb, or use front squats if overhead squats are not yet safe. Swap chest-to-bar pull-ups for regular pull-ups, jumping pull-ups or ring rows. Keep the 3-minute windows and score total reps.',
    faqs = '[{"question": "How does Open 14.2 work?", "answer": "Every 3 minutes, do 2 rounds of overhead squats and chest-to-bar pull-ups: 10 reps each in the first window, then 12, then 14, adding 2 every window. Miss a window and you are done."}, {"question": "How many reps are in each window?", "answer": "40 in the first window (2 rounds of 10 + 10), 48 in the second, 56 in the third, then 8 more every window after that."}, {"question": "What weight is used?", "answer": "95 lb for men and 65 lb for women on the overhead squats."}, {"question": "Was 14.2 repeated?", "answer": "Yes. Open 15.2 was an exact repeat of 14.2."}]'::jsonb,
    updated_at = now()
  where slug = 'open-14-2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-14-2'; end if;

  -- open-15-2
  update benchmark_workouts set
    scheme = 'Every 3:00: 2 rounds, +2 reps each window',
    format = 'Other',
    scoring_type = 'total_reps',
    duration_estimate = '6–15 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Overhead Squats", "reps": "2 rounds of 10", "tip": "0:00–3:00 window: 2 rounds of 10 overhead squats and 10 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 10", "tip": "Finish both rounds before 3:00 to move on."}, {"name": "Overhead Squats", "reps": "2 rounds of 12", "tip": "3:00–6:00 window: 2 rounds of 12 overhead squats and 12 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 12", "tip": "Finish both rounds before 6:00 to move on."}, {"name": "Overhead Squats", "reps": "2 rounds of 14", "tip": "6:00–9:00 window: 2 rounds of 14 overhead squats and 14 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 14", "tip": "Finish both rounds before 9:00 to move on."}, {"name": "Overhead Squats", "reps": "2 rounds of 16", "tip": "9:00–12:00 window: 2 rounds of 16 overhead squats and 16 chest-to-bar pull-ups.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "2 rounds of 16", "tip": "Keep adding 2 reps to both movements every 3 minutes until you miss a window."}]'::jsonb,
    scoring_notes = 'Score is total reps completed. The workout ends when you do not finish both rounds inside a 3-minute window.',
    description = 'Open 15.2 was the second workout of the 2015 CrossFit Open and an exact repeat of Open 14.2. Every 3 minutes you complete 2 rounds of overhead squats (95 lb / 65 lb) and chest-to-bar pull-ups: 10 of each in the first window, 12 in the second, 14 in the third, adding 2 reps to both movements every window. Finish both rounds inside the window and you earn the next 3 minutes. Miss it and the workout ends.

Athletes used it to measure a year of progress against their 14.2 score. Each window adds 8 reps with no extra time, so grip and shoulder endurance decide how far you get. Score is total reps completed.',
    tips = '["Move fast in the early windows to bank rest for later.", "Break the chest-to-bar pull-ups before your grip fails.", "Keep the bar close to the pull-up rig to save steps."]'::jsonb,
    coaching_tips = '["Finish the first windows with time to spare; the rest you earn there is what carries you into the later windows.", "Get the bar overhead with a power snatch or push jerk and lock out before the first squat.", "Split the chest-to-bar pull-ups into small sets, such as 5-5 or 6-4, from the start.", "Use the rest at the end of each window to shake out your grip and breathe.", "Know your target reps for each window before the clock starts so you never have to count in your head."]'::jsonb,
    scaling_notes = 'Lower the overhead squat to 65 lb / 45 lb, or use front squats if overhead squats are not yet safe. Swap chest-to-bar pull-ups for regular pull-ups, jumping pull-ups or ring rows. Keep the 3-minute windows and score total reps.',
    faqs = '[{"question": "How does Open 15.2 work?", "answer": "Every 3 minutes, do 2 rounds of overhead squats and chest-to-bar pull-ups: 10 reps each in the first window, then 12, then 14, adding 2 every window. Miss a window and you are done."}, {"question": "How many reps are in each window?", "answer": "40 in the first window (2 rounds of 10 + 10), 48 in the second, 56 in the third, then 8 more every window after that."}, {"question": "What weight is used?", "answer": "95 lb for men and 65 lb for women on the overhead squats."}, {"question": "Is 15.2 the same as 14.2?", "answer": "Yes. 15.2 repeated 14.2 exactly, so you can compare your scores directly."}]'::jsonb,
    updated_at = now()
  where slug = 'open-15-2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-15-2'; end if;

  -- open-14-5
  update benchmark_workouts set
    scheme = '21-18-15-12-9-6-3 For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '10–25 min',
    equipment = array['barbell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Thrusters", "reps": "21-18-15-12-9-6-3", "tip": "Drive from your legs and let the bar move straight up from the front rack.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Bar-Facing Burpees", "reps": "21-18-15-12-9-6-3", "tip": "Face the bar, chest to the floor, then jump over it with both feet together."}]'::jsonb,
    scoring_notes = 'Record your finish time. There was no time cap.',
    description = 'Open 14.5 was the final workout of the 2014 CrossFit Open: 21-18-15-12-9-6-3 reps for time of thrusters at 95 lb for men and 65 lb for women, and bar-facing burpees. It had no time cap, so every athlete kept going until the last burpee. It was repeated exactly as Open 16.5.

With 84 thrusters and 84 burpees, it is a long, grinding test of lungs and legs. The thrusters get heavier as you tire, and the burpees never let your heart rate come down. Steady pacing beats a fast start every time.',
    tips = '["Pace the round of 21; the workout starts at 15.", "Step over the bar if jumping wastes energy.", "Do not stop moving on the burpees."]'::jsonb,
    coaching_tips = '["Break the early thruster sets into planned chunks, such as 8-7-6, before you are forced to.", "Keep your elbows up and catch each thruster in a full squat so the legs do the work.", "Fall into each burpee, then step or jump over the bar with both feet together.", "Rest with the bar on the floor, not on your shoulders, and pick it back up on a set count.", "From the round of 9 on, try to hold unbroken sets on both movements."]'::jsonb,
    scaling_notes = 'Lower the thruster to 65 lb / 45 lb or use dumbbells. Step over the bar instead of jumping, or do burpees without the jump. For a shorter version, use 15-12-9-6-3.',
    faqs = '[{"question": "How many reps are in Open 14.5?", "answer": "168 total: 84 thrusters and 84 bar-facing burpees."}, {"question": "What weight is Open 14.5?", "answer": "95 lb for men and 65 lb for women on the thrusters."}, {"question": "Is 14.5 the same as 16.5?", "answer": "Yes. Open 16.5 was an exact repeat of 14.5."}]'::jsonb,
    updated_at = now()
  where slug = 'open-14-5';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-14-5'; end if;

  -- open-15-4
  update benchmark_workouts set
    scheme = 'AMRAP 8',
    format = 'AMRAP 8',
    scoring_type = 'total_reps',
    duration_estimate = '8 min',
    equipment = array['barbell','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Handstand Push-Ups", "reps": "3-6-9-12-15-18-21...", "tip": "Add 3 reps every round. Kick up against a wall and press to full lockout."}, {"name": "Cleans", "reps": "3-3-3-6-6-6-9...", "tip": "Do the cleans after each set of handstand push-ups. The reps go up by 3 every third round.", "rx_men": "185 lb", "rx_women": "125 lb"}]'::jsonb,
    scoring_notes = 'Score is total reps completed in 8 minutes.',
    description = 'Open 15.4 was the fourth workout of the 2015 CrossFit Open: an 8-minute AMRAP of handstand push-ups and cleans at 185 lb for men and 125 lb for women. The handstand push-ups climb by 3 every round (3, 6, 9, 12 and on), while the cleans go 3-3-3, then 6-6-6, then 9-9-9.

The cleans are heavy enough to be singles for most athletes, and the handstand push-up sets keep growing until your shoulders give out. It is a short, hard test of upside-down pressing and pulling a heavy bar from the floor. Score is total reps.',
    tips = '["Do the cleans as fast singles from the start.", "Break the handstand push-ups before you hit failure.", "Set up your wall and bar close together."]'::jsonb,
    coaching_tips = '["Kick up, set your head on the mat between your hands and press straight up to lock out.", "Break handstand push-ups into small sets once they reach 9 or more; a failed rep costs far more than a short rest.", "Treat each clean as a single: set your back, pull hard and drop the bar under control.", "Keep the rest between cleans short and the same every time.", "Count your round out loud so you know when the cleans step up."]'::jsonb,
    scaling_notes = 'Lower the clean to 135 lb / 95 lb or lighter. Replace handstand push-ups with pike push-ups on a box, push-ups with feet raised, or dumbbell presses. Keep the 8-minute AMRAP and score total reps.',
    faqs = '[{"question": "How does the rep scheme work in Open 15.4?", "answer": "Handstand push-ups go up by 3 every round: 3, 6, 9, 12, 15 and so on. Cleans go 3-3-3, then 6-6-6, then 9-9-9."}, {"question": "What weight is Open 15.4?", "answer": "185 lb for men and 125 lb for women on the cleans."}, {"question": "Are the cleans power or squat cleans?", "answer": "Either. Any style of clean counts as long as you finish standing with the bar on your shoulders."}]'::jsonb,
    updated_at = now()
  where slug = 'open-15-4';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-15-4'; end if;

  -- open-16-1
  update benchmark_workouts set
    scheme = 'AMRAP 20',
    format = 'AMRAP 20',
    scoring_type = 'rounds_reps',
    duration_estimate = '20 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'intermediate',
    body_focus = 'full-body',
    movements = '[{"name": "Overhead Walking Lunges", "reps": "25 ft", "tip": "Lock the bar overhead and touch the back knee softly each step.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Burpees", "reps": "8", "tip": "Chest to the floor, then a jump and clap at the top."}, {"name": "Overhead Walking Lunges", "reps": "25 ft", "tip": "Get the bar back overhead quickly and lunge back.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "8", "tip": "Pull until your chest touches the bar; break into small sets early."}]'::jsonb,
    scoring_notes = 'Score is total rounds + reps in 20 minutes.',
    description = 'Open 16.1 was the first workout of the 2016 CrossFit Open: a 20-minute AMRAP of a 25-ft overhead walking lunge at 95 lb for men and 65 lb for women, 8 burpees, another 25-ft overhead walking lunge, and 8 chest-to-bar pull-ups.

Twenty minutes is a long time to keep a barbell overhead. The lunges tax your shoulders and legs, the burpees spike your heart rate, and the chest-to-bar pull-ups tire your grip just as you need to press the bar overhead again. A steady pace you can hold for the full 20 minutes wins this one.',
    tips = '["Choose one pace and hold it for all 20 minutes.", "Break the chest-to-bar pull-ups early.", "Get the bar overhead the same way every round."]'::jsonb,
    coaching_tips = '["Press the bar into a strong lockout with your biceps by your ears before the first lunge step.", "Take long, even lunge steps so 25 ft takes as few steps as possible.", "Step down and up on the burpees to save your legs for the lunges.", "Split the chest-to-bar pull-ups into 4-4 or 3-3-2 from the start.", "Use the walk between stations to breathe and shake out your arms."]'::jsonb,
    scaling_notes = 'Lower the barbell to 65 lb / 45 lb, or hold a plate or dumbbell overhead. Swap chest-to-bar pull-ups for regular pull-ups, jumping pull-ups or ring rows. Keep the 20-minute AMRAP and score total rounds + reps.',
    faqs = '[{"question": "What weight is Open 16.1?", "answer": "95 lb for men and 65 lb for women on the overhead walking lunges."}, {"question": "What is in one round of 16.1?", "answer": "A 25-ft overhead walking lunge, 8 burpees, another 25-ft overhead walking lunge and 8 chest-to-bar pull-ups."}, {"question": "How long is Open 16.1?", "answer": "20 minutes, as many rounds and reps as possible."}]'::jsonb,
    youtube_url = null,
    updated_at = now()
  where slug = 'open-16-1';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-16-1'; end if;

  -- open-16-2
  update benchmark_workouts set
    scheme = 'Rounds on a 4:00 clock, +4:00 per round, up to 20 min',
    format = 'Other',
    scoring_type = 'total_reps',
    duration_estimate = '4–20 min',
    equipment = array['pullUpBar','jumpRope','barbell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Toes-to-Bar", "reps": "25", "tip": "Round 1. Touch both feet to the bar between your hands."}, {"name": "Double-Unders", "reps": "50", "tip": "Stay tall with small, quick jumps."}, {"name": "Squat Cleans", "reps": "15", "tip": "Round 1: finish by 4:00 to earn 4 more minutes.", "rx_men": "135 lb", "rx_women": "85 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 2."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 2."}, {"name": "Squat Cleans", "reps": "13", "tip": "Round 2: finish by 8:00 to earn 4 more minutes.", "rx_men": "185 lb", "rx_women": "115 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 3."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 3."}, {"name": "Squat Cleans", "reps": "11", "tip": "Round 3: finish by 12:00 to earn 4 more minutes.", "rx_men": "225 lb", "rx_women": "145 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 4."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 4."}, {"name": "Squat Cleans", "reps": "9", "tip": "Round 4: finish by 16:00 to earn 4 more minutes.", "rx_men": "275 lb", "rx_women": "175 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 5."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 5."}, {"name": "Squat Cleans", "reps": "7", "tip": "Round 5: finish by 20:00 to complete the workout.", "rx_men": "315 lb", "rx_women": "205 lb"}]'::jsonb,
    scoring_notes = 'Score is total reps completed. Each round you finish in time earns 4 more minutes, up to 20 minutes.',
    description = 'Open 16.2 was the second workout of the 2016 CrossFit Open. Each round is 25 toes-to-bar, 50 double-unders and a set of squat cleans. You have 4 minutes to finish the first round, and each round you finish in time earns 4 more minutes, up to 20. The cleans drop in reps as the load climbs: 15 at 135 lb, 13 at 185 lb, 11 at 225 lb, 9 at 275 lb and 7 at 315 lb for men (85, 115, 145, 175 and 205 lb for women).

The gymnastics and skipping stay the same each round while the bar gets heavier, so every round asks for more strength on tired legs and grip. Score is total reps.',
    tips = '["Move fast on the toes-to-bar and double-unders to leave time for the cleans.", "Have every load ready before the clock starts.", "Clean the heavy bars as fast singles."]'::jsonb,
    coaching_tips = '["Break the toes-to-bar into planned sets, such as 10-8-7, so your grip is still there for the cleans.", "Keep the double-unders relaxed and unbroken if you can; tripping wastes the time you need later.", "Set your back before every clean and stand up hard out of the bottom of the squat.", "Know your deadline for each round and check the clock before you start the cleans.", "Load the next bar or have a partner change plates so you never waste time loading."]'::jsonb,
    scaling_notes = 'Lower each clean load by about a third, or use the same lighter load for every round. Swap toes-to-bar for knees-to-chest or hanging knee raises, and double-unders for 100 single-unders. Keep the 4-minute rounds and score total reps.',
    faqs = '[{"question": "How does Open 16.2 work?", "answer": "You have 4 minutes to finish 25 toes-to-bar, 50 double-unders and 15 squat cleans. Each round you finish in time earns 4 more minutes, up to 20 minutes."}, {"question": "What are the loads for Open 16.2?", "answer": "Men: 135, 185, 225, 275 and 315 lb. Women: 85, 115, 145, 175 and 205 lb. The clean reps go 15, 13, 11, 9 and 7."}, {"question": "How many total reps are in Open 16.2?", "answer": "430 if you finish all 5 rounds: 125 toes-to-bar, 250 double-unders and 55 squat cleans."}, {"question": "Was 16.2 repeated?", "answer": "Yes. Open 19.2 used the same rounds and loads, with an 8-minute start instead of 4."}]'::jsonb,
    updated_at = now()
  where slug = 'open-16-2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-16-2'; end if;

  -- open-19-2
  update benchmark_workouts set
    scheme = 'Rounds 1–2 by 8:00, +4:00 per round, up to 20 min',
    format = 'Other',
    scoring_type = 'total_reps',
    duration_estimate = '8–20 min',
    equipment = array['pullUpBar','jumpRope','barbell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Toes-to-Bar", "reps": "25", "tip": "Round 1. Touch both feet to the bar between your hands."}, {"name": "Double-Unders", "reps": "50", "tip": "Stay tall with small, quick jumps."}, {"name": "Squat Cleans", "reps": "15", "tip": "Round 1: rounds 1 and 2 must both be done by 8:00.", "rx_men": "135 lb", "rx_women": "85 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 2."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 2."}, {"name": "Squat Cleans", "reps": "13", "tip": "Round 2: finish by 8:00 to earn 4 more minutes.", "rx_men": "185 lb", "rx_women": "115 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 3."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 3."}, {"name": "Squat Cleans", "reps": "11", "tip": "Round 3: finish by 12:00 to earn 4 more minutes.", "rx_men": "225 lb", "rx_women": "145 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 4."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 4."}, {"name": "Squat Cleans", "reps": "9", "tip": "Round 4: finish by 16:00 to earn 4 more minutes.", "rx_men": "275 lb", "rx_women": "175 lb"}, {"name": "Toes-to-Bar", "reps": "25", "tip": "Round 5."}, {"name": "Double-Unders", "reps": "50", "tip": "Round 5."}, {"name": "Squat Cleans", "reps": "7", "tip": "Round 5: finish by 20:00 to complete the workout.", "rx_men": "315 lb", "rx_women": "205 lb"}]'::jsonb,
    scoring_notes = 'Score is total reps completed, or your finish time if you complete all 5 rounds. Finish rounds 1 and 2 by 8:00 to earn 4 more minutes, then 4 more for each round after that, up to 20 minutes.',
    description = 'Open 19.2 was the second workout of the 2019 CrossFit Open and a repeat of 16.2 with one change: you get 8 minutes to finish the first two rounds instead of 4 minutes for the first. Each round is 25 toes-to-bar, 50 double-unders and a set of squat cleans. The cleans drop in reps as the load climbs: 15 at 135 lb, 13 at 185 lb, 11 at 225 lb, 9 at 275 lb and 7 at 315 lb for men (85, 115, 145, 175 and 205 lb for women). Each round finished in time after that earns 4 more minutes, up to 20.

The longer start lets more athletes reach the heavier bars, where the workout really begins. Score is total reps, or finish time if you complete it.',
    tips = '["Use the 8-minute start to reach the heavier bars, not to rest.", "Have every load ready before the clock starts.", "Clean the heavy bars as fast singles."]'::jsonb,
    coaching_tips = '["Break the toes-to-bar into planned sets, such as 10-8-7, so your grip is still there for the cleans.", "Keep the double-unders relaxed and unbroken if you can; tripping wastes the time you need later.", "Set your back before every clean and stand up hard out of the bottom of the squat.", "Know your deadline for each round and check the clock before you start the cleans.", "Load the next bar or have a partner change plates so you never waste time loading."]'::jsonb,
    scaling_notes = 'Lower each clean load by about a third, or use the same lighter load for every round. Swap toes-to-bar for knees-to-chest or hanging knee raises, and double-unders for 100 single-unders. Keep the same time windows and score total reps.',
    faqs = '[{"question": "How does Open 19.2 work?", "answer": "You have 8 minutes to finish two rounds of 25 toes-to-bar, 50 double-unders and squat cleans (15 reps, then 13). Each round you finish in time after that earns 4 more minutes, up to 20."}, {"question": "What are the loads for Open 19.2?", "answer": "Men: 135, 185, 225, 275 and 315 lb. Women: 85, 115, 145, 175 and 205 lb. The clean reps go 15, 13, 11, 9 and 7."}, {"question": "How many total reps are in Open 19.2?", "answer": "430 if you finish all 5 rounds: 125 toes-to-bar, 250 double-unders and 55 squat cleans."}, {"question": "How is 19.2 different from 16.2?", "answer": "Same rounds and loads. 19.2 gives 8 minutes for the first two rounds; 16.2 gave 4 minutes for the first round."}]'::jsonb,
    updated_at = now()
  where slug = 'open-19-2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-19-2'; end if;

  -- open-17-2
  update benchmark_workouts set
    scheme = 'AMRAP 12',
    format = 'AMRAP 12',
    scoring_type = 'rounds_reps',
    duration_estimate = '12 min',
    equipment = array['dumbbells','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Dumbbell Walking Lunges", "reps": "50 ft", "tip": "Rounds 1–2 (then 5–6, 9–10 and so on). Hold both dumbbells at your shoulders.", "rx_men": "2 x 50 lb", "rx_women": "2 x 35 lb"}, {"name": "Toes-to-Bar", "reps": "16", "tip": "Rounds 1–2. Touch both feet to the bar between your hands."}, {"name": "Dumbbell Power Cleans", "reps": "8", "tip": "Rounds 1–2. Clean both dumbbells to your shoulders together.", "rx_men": "2 x 50 lb", "rx_women": "2 x 35 lb"}, {"name": "Dumbbell Walking Lunges", "reps": "50 ft", "tip": "Rounds 3–4 (then 7–8, 11–12 and so on).", "rx_men": "2 x 50 lb", "rx_women": "2 x 35 lb"}, {"name": "Bar Muscle-Ups", "reps": "16", "tip": "Rounds 3–4. Swap the toes-to-bar for bar muscle-ups."}, {"name": "Dumbbell Power Cleans", "reps": "8", "tip": "Rounds 3–4. Then go back to toes-to-bar for the next 2 rounds.", "rx_men": "2 x 50 lb", "rx_women": "2 x 35 lb"}]'::jsonb,
    scoring_notes = 'Score is total rounds + reps in 12 minutes.',
    description = 'Open 17.2 was the second workout of the 2017 CrossFit Open: a 12-minute AMRAP with two dumbbells at 50 lb for men and 35 lb for women. Do 2 rounds of a 50-ft dumbbell walking lunge, 16 toes-to-bar and 8 dumbbell power cleans, then 2 rounds of the same lunge and cleans with 16 bar muscle-ups in place of the toes-to-bar. Keep alternating every 2 rounds until time runs out.

The first two rounds feel manageable. The bar muscle-ups are where it gets hard: many athletes spent most of the workout on them. Grip and pulling endurance decide your score.',
    tips = '["Move quickly through rounds 1 and 2 to bank time for the muscle-ups.", "Break bar muscle-ups into small sets or singles early.", "Keep the dumbbells at your shoulders for the whole lunge."]'::jsonb,
    coaching_tips = '["Hold the dumbbells at your shoulders and keep your torso upright on the lunges.", "Split the toes-to-bar into planned sets, such as 8-8, to save grip for the muscle-ups.", "On the bar muscle-ups, kick hard, pull the bar to your hips and turn over the top.", "Take short, set rests between muscle-up sets rather than waiting to feel ready.", "Clean the dumbbells together with a hip drive, not an arm curl."]'::jsonb,
    scaling_notes = 'Lower the dumbbells to 35 lb / 20 lb. Swap toes-to-bar for hanging knee raises and bar muscle-ups for chest-to-bar or regular pull-ups. Keep the 12-minute AMRAP and score total rounds + reps.',
    faqs = '[{"question": "How does Open 17.2 work?", "answer": "2 rounds of 50-ft dumbbell walking lunges, 16 toes-to-bar and 8 dumbbell power cleans, then 2 rounds with 16 bar muscle-ups in place of the toes-to-bar. Alternate every 2 rounds for 12 minutes."}, {"question": "What weight is Open 17.2?", "answer": "Two dumbbells at 50 lb each for men and 35 lb each for women."}, {"question": "What makes 17.2 hard?", "answer": "The 16 bar muscle-ups in rounds 3 and 4. Many athletes spent most of the 12 minutes on them."}]'::jsonb,
    updated_at = now()
  where slug = 'open-17-2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-17-2'; end if;

  -- open-17-3
  update benchmark_workouts set
    scheme = 'For Time, sections 1–2 by 8:00, +4:00 per section, 24-min cap',
    format = 'For Time',
    scoring_type = 'total_reps',
    duration_estimate = '8–24 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Chest-to-Bar Pull-Ups", "reps": "3 rounds of 6", "tip": "Section 1: 3 rounds of 6 chest-to-bar pull-ups and 6 squat snatches."}, {"name": "Squat Snatches", "reps": "3 rounds of 6", "tip": "Section 1: sections 1 and 2 must both be done by 8:00.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "3 rounds of 7", "tip": "Section 2: 3 rounds of 7 chest-to-bar pull-ups and 5 squat snatches."}, {"name": "Squat Snatches", "reps": "3 rounds of 5", "tip": "Section 2: finish by 8:00 to earn 4 more minutes.", "rx_men": "135 lb", "rx_women": "95 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "3 rounds of 8", "tip": "Section 3: 3 rounds of 8 chest-to-bar pull-ups and 4 squat snatches."}, {"name": "Squat Snatches", "reps": "3 rounds of 4", "tip": "Section 3: finish by 12:00 to earn 4 more minutes.", "rx_men": "185 lb", "rx_women": "135 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "3 rounds of 9", "tip": "Section 4: 3 rounds of 9 chest-to-bar pull-ups and 3 squat snatches."}, {"name": "Squat Snatches", "reps": "3 rounds of 3", "tip": "Section 4: finish by 16:00 to earn 4 more minutes.", "rx_men": "225 lb", "rx_women": "155 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "3 rounds of 10", "tip": "Section 5: 3 rounds of 10 chest-to-bar pull-ups and 2 squat snatches."}, {"name": "Squat Snatches", "reps": "3 rounds of 2", "tip": "Section 5: finish by 20:00 to earn 4 more minutes.", "rx_men": "245 lb", "rx_women": "175 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "3 rounds of 11", "tip": "Section 6: 3 rounds of 11 chest-to-bar pull-ups and 1 squat snatch."}, {"name": "Squat Snatches", "reps": "3 rounds of 1", "tip": "Section 6: finish by 24:00 to complete the workout.", "rx_men": "265 lb", "rx_women": "185 lb"}]'::jsonb,
    scoring_notes = 'Score is total reps completed, or your finish time if you complete all 6 sections within 24 minutes.',
    description = 'Open 17.3 was the third workout of the 2017 CrossFit Open. Each section is 3 rounds of chest-to-bar pull-ups and squat snatches, with the pull-ups going up by one and the snatches going down by one as the bar gets heavier. Men snatch 95, 135, 185, 225, 245 and 265 lb; women snatch 65, 95, 135, 155, 175 and 185 lb. You have 8 minutes to finish the first two sections, and each section done in time earns 4 more minutes, up to 24.

The early loads are light, so speed matters. The later loads are near-maximal squat snatches for many athletes, done with tired grip from the pull-ups. Score is total reps.',
    tips = '["Move fast through the light sections to earn time for the heavy ones.", "Break the chest-to-bar pull-ups before your grip fails.", "Have every load ready before the clock starts."]'::jsonb,
    coaching_tips = '["Do the light snatches as quick touch-and-go reps or fast singles, whichever you can keep up.", "Split the pull-ups into small sets so your grip is fresh for the heavier bars.", "On the heavy snatches, set your back, stay over the bar longer and pull yourself under it.", "Rest before a heavy snatch attempt rather than rushing a miss.", "Know each section''s deadline and check the clock before you start the snatches."]'::jsonb,
    scaling_notes = 'Lower each snatch load by about half, or use power snatches or hang snatches at a lighter load. Swap chest-to-bar pull-ups for regular pull-ups, jumping pull-ups or ring rows. Keep the time windows and score total reps.',
    faqs = '[{"question": "How does Open 17.3 work?", "answer": "Each section is 3 rounds of chest-to-bar pull-ups and squat snatches. Finish the first two sections by 8:00 to earn 4 more minutes, then 4 more for each section after that, up to 24 minutes."}, {"question": "What are the loads for Open 17.3?", "answer": "Men: 95, 135, 185, 225, 245 and 265 lb. Women: 65, 95, 135, 155, 175 and 185 lb."}, {"question": "How many total reps are in Open 17.3?", "answer": "216 if you finish all 6 sections: 36 reps per section (3 rounds of pull-ups plus snatches)."}]'::jsonb,
    updated_at = now()
  where slug = 'open-17-3';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-17-3'; end if;

  -- open-18-3
  update benchmark_workouts set
    scheme = '2 Rounds For Time, 14-min cap',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '10–14 min',
    equipment = array['jumpRope','barbell','rings','dumbbells','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Double-Unders", "reps": "100", "tip": "Stay relaxed and break into sets before you trip."}, {"name": "Overhead Squats", "reps": "20", "tip": "Lock the bar overhead and keep your chest up.", "rx_men": "115 lb", "rx_women": "80 lb"}, {"name": "Double-Unders", "reps": "100", "tip": "Shake out your shoulders before you pick up the rope."}, {"name": "Ring Muscle-Ups", "reps": "12", "tip": "Kip with a strong hip drive and turn over the rings fast."}, {"name": "Double-Unders", "reps": "100", "tip": "Keep your hands low and by your hips."}, {"name": "Dumbbell Snatches", "reps": "20", "tip": "Alternate arms each rep and lock out overhead.", "rx_men": "50 lb", "rx_women": "35 lb"}, {"name": "Double-Unders", "reps": "100", "tip": "Breathe through each set."}, {"name": "Bar Muscle-Ups", "reps": "12", "tip": "Pull the bar to your hips and press out to lockout. Then start round 2."}]'::jsonb,
    scoring_notes = 'Record your finish time. If you do not finish within the 14-minute cap, your score is total reps completed.',
    description = 'Open 18.3 was the third workout of the 2018 CrossFit Open: 2 rounds for time of 100 double-unders, 20 overhead squats (115 lb / 80 lb), 100 double-unders, 12 ring muscle-ups, 100 double-unders, 20 alternating dumbbell snatches (50 lb / 35 lb), 100 double-unders and 12 bar muscle-ups, with a 14-minute cap.

It is a big gymnastics and skipping test. With 800 double-unders and 48 muscle-ups in total, it rewards skill and calm breathing more than strength. Many athletes spent most of the cap on the ring muscle-ups, so the score often came down to that one station.',
    tips = '["Keep the double-unders smooth; 800 of them add up.", "Break the muscle-ups into small sets early.", "Set up the rings, bar and dumbbell close together."]'::jsonb,
    coaching_tips = '["Split each 100 double-unders into sets you can hold without tripping, such as 50-50.", "Get the overhead squat bar up with a power snatch or push jerk and lock out before the first squat.", "Move between muscle-up sets on a set count rather than waiting until you feel ready.", "Alternate arms on the dumbbell snatches with one smooth pull from the floor.", "Know your plan for round 2 before you start, because your grip will be tired."]'::jsonb,
    scaling_notes = 'Swap double-unders for 200 single-unders per set or do 50 double-unders. Lower the overhead squat to 75 lb / 55 lb and the dumbbell to 35 lb / 20 lb. Replace ring muscle-ups and bar muscle-ups with chest-to-bar pull-ups, pull-ups or jumping pull-ups.',
    faqs = '[{"question": "How many reps are in Open 18.3?", "answer": "928 in total: 800 double-unders, 40 overhead squats, 24 ring muscle-ups, 40 dumbbell snatches and 24 bar muscle-ups."}, {"question": "What are the loads for Open 18.3?", "answer": "Overhead squats at 115 lb / 80 lb and a single dumbbell at 50 lb / 35 lb for the snatches."}, {"question": "Is there a time cap on Open 18.3?", "answer": "Yes, 14 minutes. If you do not finish, your score is total reps."}]'::jsonb,
    updated_at = now()
  where slug = 'open-18-3';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-18-3'; end if;

  -- open-19-5
  update benchmark_workouts set
    scheme = '33-27-21-15-9 For Time, 20-min cap',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '10–20 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Thrusters", "reps": "33-27-21-15-9", "tip": "Drive from your legs and keep your elbows up in the front rack.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Chest-to-Bar Pull-Ups", "reps": "33-27-21-15-9", "tip": "Pull until your chest touches the bar; break into small sets early."}]'::jsonb,
    scoring_notes = 'Record your finish time. If you do not finish within the 20-minute cap, your score is total reps completed.',
    description = 'Open 19.5 was the final workout of the 2019 CrossFit Open: 33-27-21-15-9 reps for time of thrusters at 95 lb for men and 65 lb for women, and chest-to-bar pull-ups, with a 20-minute cap.

It is built like Fran, but with more than twice the volume and chest-to-bar instead of regular pull-ups. With 105 thrusters and 105 chest-to-bar pull-ups, it tests how long you can keep moving a light barbell and pulling high with a tired grip. The round of 33 sets the tone, and smart pacing there pays off in the later rounds.',
    tips = '["Pace the round of 33; the workout is won in the rounds of 21 and 15.", "Break chest-to-bar pull-ups early and often.", "Rest with the bar on the floor, not on your shoulders."]'::jsonb,
    coaching_tips = '["Break the first thruster set into planned chunks, such as 12-11-10.", "Catch each thruster in a full squat so your legs drive the bar overhead.", "Do chest-to-bar pull-ups in small, quick sets from the start, before your grip fails.", "Keep transitions short: step to the bar or rig and start on a set count.", "From the round of 15 on, try to hold bigger sets on both movements."]'::jsonb,
    scaling_notes = 'Lower the thruster to 65 lb / 45 lb or use dumbbells. Swap chest-to-bar pull-ups for regular pull-ups, jumping pull-ups or ring rows. For a shorter version, use 21-15-9.',
    faqs = '[{"question": "How many reps are in Open 19.5?", "answer": "210 total: 105 thrusters and 105 chest-to-bar pull-ups."}, {"question": "What weight is Open 19.5?", "answer": "95 lb for men and 65 lb for women on the thrusters."}, {"question": "Is there a time cap on Open 19.5?", "answer": "Yes, 20 minutes. If you do not finish, your score is total reps."}]'::jsonb,
    updated_at = now()
  where slug = 'open-19-5';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-19-5'; end if;

  -- open-23-3
  update benchmark_workouts set
    scheme = 'For Time, 6:00 start, +3:00 per section, 12-min cap',
    format = 'For Time',
    scoring_type = 'total_reps',
    duration_estimate = '6–12 min',
    equipment = array['jumpRope','barbell','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Wall Walks", "reps": "5", "tip": "Walk your hands to the wall until your nose touches, then walk back to the floor."}, {"name": "Double-Unders", "reps": "50", "tip": "Stay tall with small, quick jumps."}, {"name": "Snatches", "reps": "15", "tip": "Power or squat snatch; finish these and the next 12 by 6:00.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Wall Walks", "reps": "5", "tip": "Same as the first set."}, {"name": "Double-Unders", "reps": "50", "tip": "Stay relaxed."}, {"name": "Snatches", "reps": "12", "tip": "Finish by 6:00 to earn 3 more minutes.", "rx_men": "135 lb", "rx_women": "95 lb"}, {"name": "Strict Handstand Push-Ups", "reps": "20", "tip": "No kip. Head touches the mat and arms lock out at the top."}, {"name": "Double-Unders", "reps": "50", "tip": "Shake out your shoulders before you skip."}, {"name": "Snatches", "reps": "9", "tip": "Finish by 9:00 to earn 3 more minutes.", "rx_men": "185 lb", "rx_women": "125 lb"}, {"name": "Strict Handstand Push-Ups", "reps": "20", "tip": "Small sets or singles are fine."}, {"name": "Double-Unders", "reps": "50", "tip": "Last set of skipping."}, {"name": "Snatches", "reps": "6", "tip": "Finish by 12:00 to complete the workout.", "rx_men": "225 lb", "rx_women": "155 lb"}]'::jsonb,
    scoring_notes = 'Score is total reps completed, or your finish time if you complete everything within 12 minutes.',
    description = 'Open 23.3 was the third workout of the 2023 CrossFit Open. You have 6 minutes for 5 wall walks, 50 double-unders and 15 snatches (95 lb / 65 lb), then 5 wall walks, 50 double-unders and 12 snatches (135 lb / 95 lb). Finish in time and you earn 3 more minutes for 20 strict handstand push-ups, 50 double-unders and 9 snatches (185 lb / 125 lb). Finish that and you get 3 more minutes for 20 strict handstand push-ups, 50 double-unders and 6 snatches (225 lb / 155 lb).

The barbell gets heavier as the gymnastics get harder, so strength and upside-down pressing both matter. Score is total reps.',
    tips = '["Move quickly through the first 6 minutes to earn the next sections.", "Have every load ready before the clock starts.", "Treat the heavy snatches as singles."]'::jsonb,
    coaching_tips = '["Walk your hands to the wall in steady steps and come down under control.", "Do the light snatches touch-and-go or as fast singles, whichever you can keep up.", "Break strict handstand push-ups into small sets before you reach failure.", "Set your back and stay over the bar longer on the heavy snatches.", "Know each deadline and check the clock before you start the snatches."]'::jsonb,
    scaling_notes = 'Swap wall walks for a plank walk-out or bear crawl, and strict handstand push-ups for pike push-ups or dumbbell presses. Lower each snatch load by about half, or use hang power snatches. Use 100 single-unders in place of 50 double-unders.',
    faqs = '[{"question": "How does Open 23.3 work?", "answer": "You have 6 minutes for the first two sections. Each section you finish in time after that earns 3 more minutes, up to 12 minutes."}, {"question": "What are the loads for Open 23.3?", "answer": "Men: 95, 135, 185 and 225 lb. Women: 65, 95, 125 and 155 lb."}, {"question": "How many total reps are in Open 23.3?", "answer": "292 if you finish: 10 wall walks, 200 double-unders, 40 strict handstand push-ups and 42 snatches."}]'::jsonb,
    updated_at = now()
  where slug = 'open-23-3';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-23-3'; end if;

  -- open-24-1
  update benchmark_workouts set
    scheme = '21-15-9 For Time, 15-min cap',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '8–15 min',
    equipment = array['dumbbells'],
    difficulty = 'intermediate',
    body_focus = 'full-body',
    movements = '[{"name": "Dumbbell Snatches", "reps": "21-15-9", "tip": "First arm only. Lock out overhead each rep.", "rx_men": "50 lb", "rx_women": "35 lb"}, {"name": "Lateral Burpees Over Dumbbell", "reps": "21-15-9", "tip": "Chest to the floor beside the dumbbell, then jump sideways over it."}, {"name": "Dumbbell Snatches", "reps": "21-15-9", "tip": "Switch to your other arm for this set.", "rx_men": "50 lb", "rx_women": "35 lb"}, {"name": "Lateral Burpees Over Dumbbell", "reps": "21-15-9", "tip": "Then move on to the next round: 15s, then 9s."}]'::jsonb,
    scoring_notes = 'Record your finish time. If you do not finish within the 15-minute cap, your score is total reps completed.',
    description = 'Open 24.1 was the first workout of the 2024 CrossFit Open: for time, with a 15-minute cap, using a single dumbbell at 50 lb for men and 35 lb for women. Do 21 dumbbell snatches with one arm, 21 lateral burpees over the dumbbell, 21 snatches with the other arm and 21 more burpees. Repeat with 15s, then 9s.

The dumbbell is moderate, so the workout comes down to breathing and pacing the 90 burpees. Splitting the snatches between arms spreads the grip and shoulder work, but there is nowhere to hide on the burpees.',
    tips = '["Start the 21s at a pace you can hold through the 9s.", "Keep the burpees steady; they decide the workout.", "Set the dumbbell where you can jump over it straight away."]'::jsonb,
    coaching_tips = '["Pull the dumbbell close to your body and punch it overhead in one move.", "Use your legs on every snatch so your arm does not tire early.", "Fall into each burpee and jump sideways over the dumbbell with both feet together.", "Breathe at the top of each burpee instead of resting on the floor."]'::jsonb,
    scaling_notes = 'Lower the dumbbell to 35 lb / 20 lb. Step over the dumbbell instead of jumping, or do burpees without the jump. For a shorter version, use 15-12-9.',
    faqs = '[{"question": "How many reps are in Open 24.1?", "answer": "180 total: 90 dumbbell snatches (45 per arm) and 90 lateral burpees over the dumbbell."}, {"question": "What weight is Open 24.1?", "answer": "A single dumbbell at 50 lb for men and 35 lb for women."}, {"question": "Is there a time cap on Open 24.1?", "answer": "Yes, 15 minutes. If you do not finish, your score is total reps."}]'::jsonb,
    updated_at = now()
  where slug = 'open-24-1';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'open-24-1'; end if;

end $$;

select slug, scheme from benchmark_workouts where slug in ('midline-march', 'naughty-nancy', 'the-separator', 'open-14-1', 'open-14-2', 'open-15-2', 'open-14-5', 'open-15-4', 'open-16-1', 'open-16-2', 'open-19-2', 'open-17-2', 'open-17-3', 'open-18-3', 'open-19-5', 'open-23-3', 'open-24-1') order by slug;
