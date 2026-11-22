-- Fix C: 15 Hero workouts corrected to official CrossFit definitions (crossfit.com/benchmark/<slug>).
-- Generated; do not edit by hand. Not yet run.
do $$
declare n int;
begin
  -- luce
  update benchmark_workouts set
    scheme = '3 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '30–45 min',
    equipment = array['running','rings','weightedVest']::text[],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Run", "reps": "1 km", "tip": "Settle into a pace you can repeat three times. The vest makes the run feel longer than it is.", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"name": "Muscle-Ups", "reps": "10", "tip": "Ring or bar. Use small sets of 2 or 3 and step off before you miss a rep.", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"name": "Air Squats", "reps": "100", "tip": "Hip crease below the knee every rep. Break into sets of 20 to 25 before your legs force a long stop.", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}]'::jsonb,
    scoring_notes = 'Record your finish time. Wear the vest for the whole workout.',
    description = 'Luce honors U.S. Army Captain Ronald G. Luce, 27, of Company C, 2nd Battalion, 20th Special Forces Group, headquartered in Jackson, Mississippi. He died on Aug. 2, 2009, in Qole Gerdsar, Afghanistan, after his vehicle was struck by a command-wire improvised explosive device. He is survived by his wife, his daughter and his parents. CrossFit first posted the workout on July 5, 2010.

Wearing a weight vest (20 lb for men, 14 lb for women), you complete three rounds of a 1,000 m run, 10 muscle-ups and 100 air squats. That adds up to 3 km of running, 30 muscle-ups and 300 squats, all under load. The muscle-ups are the skill gate, and the vest makes every one heavier. The squats then pile up in the legs, so each run starts on tired legs and lungs.',
    tips = '["Wear the vest from the first step to the last rep", "Muscle-ups go in small sets from round one", "Treat the run as your reset before the bar or rings"]'::jsonb,
    coaching_tips = '["Run the first 1,000 m at a pace you could hold for all three rounds, not faster.", "Walk to the rings or bar, chalk up and start the muscle-ups with a plan, such as sets of 3, 3, 2, 2.", "Break the 100 squats early, for example 4 sets of 25 or 5 sets of 20, with short pauses.", "Keep your chest up on the squats so the vest does not pull you forward onto your toes.", "Expect round three to be the slowest and save some effort for the final muscle-ups."]'::jsonb,
    scaling_notes = 'Drop the vest or use a lighter one. Replace each muscle-up with 2 pull-ups and 2 ring or bar dips, or use jumping muscle-ups from a box. Shorten the run to 600–800 m and cut the squats to 50 per round if 100 would take you more than about four minutes.',
    faqs = '[{"question": "What is the Luce workout?", "answer": "Wearing a 20 lb vest (14 lb for women), complete 3 rounds for time of a 1,000 m run, 10 muscle-ups and 100 air squats."}, {"question": "How many total reps are in Luce?", "answer": "30 muscle-ups and 300 air squats, plus 3,000 m of running, all done wearing the vest."}, {"question": "Who was Luce?", "answer": "U.S. Army Captain Ronald G. Luce, 27, of Company C, 2nd Battalion, 20th Special Forces Group. He died on Aug. 2, 2009, in Qole Gerdsar, Afghanistan, when his vehicle was struck by an improvised explosive device."}, {"question": "Can I do Luce without a vest?", "answer": "Yes. Dropping the vest or using a lighter one is the first way to scale it. Note it with your score so you can compare later attempts."}]'::jsonb,
    updated_at = now()
  where slug = 'luce';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'luce'; end if;
  -- mcghee
  update benchmark_workouts set
    scheme = 'AMRAP 30',
    format = 'AMRAP 30',
    scoring_type = 'rounds_reps',
    duration_estimate = '30 min',
    equipment = array['barbell','box']::text[],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Deadlifts", "reps": "5", "tip": "Brace before each pull and keep the bar close. Reset at the floor once your back starts to round.", "rx_men": "275 lb", "rx_women": "185 lb"}, {"name": "Push-Ups", "reps": "13", "tip": "Chest to the floor and full lockout at the top. Break into small sets before you hit failure."}, {"name": "Box Jumps", "reps": "9", "tip": "Open your hips fully at the top and step down to save your legs.", "rx_men": "24 in", "rx_women": "20 in"}]'::jsonb,
    scoring_notes = 'Score is total rounds + reps in 30 minutes.',
    description = 'McGhee honors U.S. Army Cpl. Ryan C. McGhee, 21, who was killed in action on May 13, 2009, by small-arms fire during combat in central Iraq. He served with the 3rd Battalion, 75th Ranger Regiment, of Fort Benning, Georgia. It was his fourth deployment and his first to Iraq. He is survived by his father, his mother, his fiancee and his brother.

The workout is a 30-minute AMRAP of 5 deadlifts (275 lb / 185 lb), 13 push-ups and 9 box jumps (24 in / 20 in). The deadlifts are heavy but only five per round, so the challenge is keeping good position on every rep for half an hour. Push-ups wear down quickly, and the box jumps keep your heart rate high. Steady, repeatable rounds win.',
    tips = '["Pick a round pace you can hold for 30 minutes", "Push-ups break first, so split them early", "Step down from the box every rep"]'::jsonb,
    coaching_tips = '["Set up the same way on every deadlift: feet under the bar, brace, then pull.", "Do the deadlifts as singles or doubles with a reset once fatigue builds, rather than bouncing the bar.", "Split the push-ups from the start, for example 7 and 6, so they do not turn into singles late.", "Step down from the box to protect your Achilles tendons over hundreds of jumps.", "Check the clock every 5 minutes and aim to finish about the same number of rounds in each block."]'::jsonb,
    scaling_notes = 'Lower the deadlift to a weight you could lift 10 times fresh, often 185 lb / 125 lb or lighter. Do push-ups with hands on a box or bench. Use a lower box or step-ups if jumping is not an option.',
    faqs = '[{"question": "What is the McGhee workout?", "answer": "As many rounds as possible in 30 minutes of 5 deadlifts (275 lb / 185 lb), 13 push-ups and 9 box jumps (24 in / 20 in)."}, {"question": "How many reps are in one round of McGhee?", "answer": "27 reps: 5 deadlifts, 13 push-ups and 9 box jumps."}, {"question": "Who was McGhee?", "answer": "U.S. Army Cpl. Ryan C. McGhee, 21, of the 3rd Battalion, 75th Ranger Regiment. He was killed in action on May 13, 2009, in central Iraq."}, {"question": "How do I score McGhee?", "answer": "Count the full rounds you finish in 30 minutes, then add any extra reps from the round you were on when time ran out."}]'::jsonb,
    updated_at = now()
  where slug = 'mcghee';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'mcghee'; end if;
  -- moore
  update benchmark_workouts set
    scheme = 'AMRAP 20',
    format = 'AMRAP 20',
    scoring_type = 'rounds_reps',
    duration_estimate = '20 min',
    equipment = array['rope','running','bodyweight']::text[],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Rope Climbs", "reps": "1", "tip": "Lock your feet on the rope and stand up with your legs. Climb to 15 ft and come down under control.", "rx_men": "15 ft", "rx_women": "15 ft"}, {"name": "Run", "reps": "400 m", "tip": "Run hard enough to keep moving but arrive at the wall able to press."}, {"name": "Handstand Push-Ups", "reps": "Max reps", "tip": "Do as many as you can, then move on. Stop a rep or two before failure to save later rounds."}]'::jsonb,
    scoring_notes = 'Score is total rounds completed plus total handstand push-ups.',
    description = 'Moore honors Officer David S. Moore, 29, of the Indianapolis Metropolitan Police Department. He died on Jan. 26, 2011, from gunshot wounds suffered on Jan. 23, 2011, when he stopped a stolen vehicle and the driver opened fire. He is survived by his mother, his father and his sister. CrossFit first posted the workout on April 28, 2011.

For 20 minutes, you repeat 1 rope climb to 15 ft, a 400 m run and a set of handstand push-ups for as many reps as you can. The score has two parts: rounds completed and total handstand push-ups. That makes pacing a real decision: push the max sets too far and your shoulders fail on the rope, hold back and you leave reps behind.',
    tips = '["Your score is rounds plus total handstand push-ups", "Stop each max set just short of failure", "Use your legs on the rope to save your arms"]'::jsonb,
    coaching_tips = '["Use a foot lock on every rope climb so your shoulders stay fresh for pressing.", "Run the 400 m at a steady pace that lets you start pressing within a few seconds of arriving.", "End each handstand push-up set one or two reps before failure, as missed reps cost time and count for nothing.", "Count your handstand push-ups out loud or keep a tally on a whiteboard after each round.", "Use the final round to empty the tank on the last handstand push-up set."]'::jsonb,
    scaling_notes = 'Replace rope climbs with 3 rope pulls from lying to standing or 5 strict pull-ups. Use pike push-ups on a box or seated dumbbell presses for the handstand push-ups, and score the reps the same way. Shorten the run to 200 m if 400 m takes more than about 2:30.',
    faqs = '[{"question": "What is the Moore workout?", "answer": "As many rounds as possible in 20 minutes of 1 rope climb to 15 ft, a 400 m run and max-rep handstand push-ups."}, {"question": "How is Moore scored?", "answer": "Your score is the number of rounds completed plus the total number of handstand push-ups you did across all rounds."}, {"question": "Who was Moore?", "answer": "Officer David S. Moore, 29, of the Indianapolis Metropolitan Police Department, who died on Jan. 26, 2011, after being shot during a traffic stop of a stolen vehicle."}, {"question": "How do I scale Moore if I cannot do handstand push-ups?", "answer": "Use pike push-ups on a box or seated dumbbell presses for max reps, and count them the same way as handstand push-ups."}]'::jsonb,
    updated_at = now()
  where slug = 'moore';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'moore'; end if;
  -- nick
  update benchmark_workouts set
    scheme = '12 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '20–35 min',
    equipment = array['dumbbells']::text[],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Dumbbell Hang Squat Cleans", "reps": "10", "tip": "Start with the dumbbells at your thighs, then jump and drop into a full front squat. Stand all the way up each rep.", "rx_men": "45 lb", "rx_women": "30 lb"}, {"name": "Handstand Push-Ups", "reps": "6", "tip": "Done with your hands on the dumbbells for extra depth. Set the dumbbells shoulder-width and parallel so they cannot roll."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Nick honors U.S. Army Spc. Nicholas P. Steinbacher, 22, of La Crescenta, California. He was assigned to the 2nd Battalion, 5th Cavalry Regiment, 1st Brigade, 1st Cavalry Division, based in Fort Hood, Texas. He died on Dec. 10, 2006, of injuries suffered when insurgents attacked his Humvee with an improvised explosive device in Baghdad, Iraq. He is survived by his parents and his brothers.

The workout is 12 rounds for time of 10 dumbbell hang squat cleans (45 lb / 30 lb dumbbells) and 6 handstand push-ups with your hands on the dumbbells. That is 120 cleans and 72 deficit handstand push-ups. The cleans tax your legs and grip, and pressing from the dumbbells adds range to every push-up, so your shoulders fade fast.',
    tips = '["Press from the same dumbbells you clean", "Break the handstand push-ups before failure", "Stand fully at the top of every clean"]'::jsonb,
    coaching_tips = '["Keep the dumbbells close on the clean and land in a full squat with elbows high.", "Set the dumbbells in the same spot each round so the handstand setup takes seconds.", "Break the 6 handstand push-ups into 3 and 3 or 2, 2, 2 once a set starts to slow.", "Lower under control on each push-up so your head does not crash between the handles.", "Aim for even rounds; 12 rounds punishes a fast start more than a steady one."]'::jsonb,
    scaling_notes = 'Use lighter dumbbells, such as 35 lb / 20 lb. Do the handstand push-ups from the floor with an abmat, or replace them with pike push-ups on a box. Cut to 8 rounds if 12 would take much longer than 35 minutes.',
    faqs = '[{"question": "What is the Nick workout?", "answer": "12 rounds for time of 10 dumbbell hang squat cleans (45 lb / 30 lb) and 6 handstand push-ups on dumbbells."}, {"question": "How many total reps are in Nick?", "answer": "120 dumbbell hang squat cleans and 72 handstand push-ups on dumbbells."}, {"question": "What does handstand push-ups on dumbbells mean?", "answer": "You grip the dumbbell handles instead of placing your hands on the floor, so your head can go below hand level. The extra range makes each rep harder."}, {"question": "Who was Nick?", "answer": "U.S. Army Spc. Nicholas P. Steinbacher, 22, of the 1st Cavalry Division, who died on Dec. 10, 2006, after an improvised explosive device attack in Baghdad, Iraq."}]'::jsonb,
    updated_at = now()
  where slug = 'nick';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'nick'; end if;
  -- nutts
  update benchmark_workouts set
    scheme = 'Chipper For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '35–55 min',
    equipment = array['barbell','box','pullUpBar','wallBall','jumpRope','running']::text[],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Handstand Push-Ups", "reps": "10", "tip": "Fresh shoulders, so move through these in one or two sets."}, {"name": "Deadlifts", "reps": "15", "tip": "Heavy. Use small sets of 3 to 5 with a reset at the floor.", "rx_men": "250 lb", "rx_women": "175 lb"}, {"name": "Box Jumps", "reps": "25", "tip": "A tall box. Step down every rep and take short pauses before your jumps get sloppy.", "rx_men": "30 in", "rx_women": "24 in"}, {"name": "Pull-Ups", "reps": "50", "tip": "Break into sets of 10 or fewer from the start."}, {"name": "Wall Balls", "reps": "100", "tip": "The long grind. Use sets of 10 to 20 with short, planned breaks.", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}, {"name": "Double-Unders", "reps": "200", "tip": "Relaxed shoulders and small wrist turns. Rest your calves with short pauses, not trips."}, {"name": "Run", "reps": "400 m", "tip": "Carry the plate however you like: hugged to the chest or held overhead.", "rx_men": "45 lb plate", "rx_women": "25 lb plate"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Nutts honors Canadian Armed Forces Lt. Andrew Richard Nuttall, 30, of the 1st Battalion Princess Patricia''s Canadian Light Infantry, based in Edmonton, Alberta. He was killed on Dec. 23, 2009, by an improvised explosive device during a joint foot patrol near the village of Nakhonay in Panjwaii District, Afghanistan. He is survived by his parents.

Nutts is a long chipper done once through, for time: 10 handstand push-ups, 15 deadlifts (250 lb / 175 lb), 25 box jumps (30 in / 24 in), 50 pull-ups, 100 wall balls (20 lb to 10 ft / 14 lb to 9 ft), 200 double-unders and a 400 m run carrying a plate (45 lb / 25 lb). Each station hits a different weakness, and the 100 wall balls and 200 double-unders come when your legs and lungs are already worn down.',
    tips = '["Move through the gymnastics while you are fresh", "Plan your wall ball sets before you start", "Carry the plate the way that feels steadiest"]'::jsonb,
    coaching_tips = '["Get through the handstand push-ups in one or two sets, then take a breath before the heavy deadlifts.", "Do the deadlifts in sets of 3 to 5 with a full reset so your back stays flat.", "Step down from the 30 in or 24 in box on every rep to save your legs and Achilles tendons.", "Break the 100 wall balls into planned sets, such as 5 sets of 20 or 10 sets of 10, and stick to it.", "On the plate run, switch between a hug and an overhead hold when your arms or lungs need a change."]'::jsonb,
    scaling_notes = 'Use pike push-ups for the handstand push-ups, lighter deadlifts (such as 185 lb / 125 lb), a 24 in / 20 in box, banded pull-ups or ring rows, a lighter ball or lower target, and 100 single-unders in place of the double-unders. Run with a lighter plate or none. Halving the wall balls and double-unders keeps the workout near its intended length for newer athletes.',
    faqs = '[{"question": "What is the Nutts workout?", "answer": "For time: 10 handstand push-ups, 15 deadlifts (250 lb / 175 lb), 25 box jumps (30 in / 24 in), 50 pull-ups, 100 wall balls (20 lb to 10 ft / 14 lb to 9 ft), 200 double-unders and a 400 m run with a plate (45 lb / 25 lb)."}, {"question": "How many reps are in Nutts?", "answer": "400 reps across six stations, followed by a 400 m plate run."}, {"question": "Who was Nutts?", "answer": "Canadian Armed Forces Lt. Andrew Richard Nuttall, 30, of the 1st Battalion Princess Patricia''s Canadian Light Infantry, killed by an improvised explosive device in Panjwaii District, Afghanistan, on Dec. 23, 2009."}, {"question": "How should I carry the plate on the run?", "answer": "Any way you like. Most athletes hug it to the chest and switch to an overhead or one-side hold when their arms tire."}]'::jsonb,
    updated_at = now()
  where slug = 'nutts';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'nutts'; end if;
  -- santora
  update benchmark_workouts set
    scheme = '3 Rounds For Reps',
    format = 'Circuit',
    scoring_type = 'total_reps',
    duration_estimate = '17 min',
    equipment = array['barbell','running']::text[],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Squat Cleans", "reps": "1 min", "tip": "Smooth singles at a steady rhythm. Catch in a full front squat and stand up tall.", "rx_men": "155 lb", "rx_women": "105 lb"}, {"name": "Shuttle Sprints", "reps": "1 min", "tip": "Mark two lines 20 ft apart. Out and back counts as 1 rep. Stay low on the turns."}, {"name": "Deadlifts", "reps": "1 min", "tip": "Load a second bar so you are ready to go. Keep your back flat and the bar close.", "rx_men": "245 lb", "rx_women": "165 lb"}, {"name": "Burpees", "reps": "1 min", "tip": "Chest to the floor and a small jump at the top. Move at a pace you can keep for the full minute."}, {"name": "Jerks", "reps": "1 min", "tip": "Any jerk style. Lock out overhead with your feet together before you lower the bar.", "rx_men": "155 lb", "rx_women": "105 lb"}, {"name": "Rest", "reps": "1 min", "isRest": true, "tip": "Rest 1 minute between rounds. Walk to the clean bar and get ready."}]'::jsonb,
    scoring_notes = 'Score is total reps across all 15 stations. Each 20-ft out-and-back shuttle counts as 1 rep.',
    description = 'Santora honors U.S. Army Sgt. Jason A. Santora, of Farmingville, New York, assigned to the 3rd Battalion, 75th Ranger Regiment, based out of Fort Benning, Georgia. He died in Logar Province, Afghanistan, on April 23, 2010, from wounds sustained during a firefight with insurgents. He is survived by his parents and his sister. CrossFit first posted the workout on Nov. 24, 2011.

Santora is three rounds of five 1-minute stations: squat cleans (155 lb / 105 lb), 20-ft shuttle sprints, deadlifts (245 lb / 165 lb), burpees and jerks (155 lb / 105 lb), with 1 minute of rest between rounds. You score total reps. Like Fight Gone Bad, it rewards working the whole minute, but the barbell loads here are much heavier, so every clean and jerk is a real lift.',
    tips = '["Your score is total reps, so keep moving each minute", "Load the deadlift bar before you start", "Out and back on the shuttle is 1 rep"]'::jsonb,
    coaching_tips = '["Set up two barbells, one for cleans and jerks and one for deadlifts, so no time goes to changing plates.", "Pick a clean pace you can hold for 60 seconds, such as one rep every 6 to 8 seconds, rather than racing early reps.", "Turn on the shuttle with a low, wide stance and touch the line with your foot or hand each time.", "On burpees and jerks, keep moving at a steady rhythm; short pauses cost more reps than slower reps.", "Use the minute of rest to breathe and walk to the clean bar so you start the next round on time."]'::jsonb,
    scaling_notes = 'Lower the barbell loads so you could do about 8 to 10 reps in a minute when fresh, such as 95 lb / 65 lb for cleans and jerks and 155 lb / 105 lb for deadlifts. Use power cleans in place of squat cleans, and step back out of the burpee if a jump back is too much. Count reps the same way.',
    faqs = '[{"question": "What is the Santora workout?", "answer": "3 rounds for reps of 1 minute each of squat cleans (155 lb / 105 lb), 20-ft shuttle sprints, deadlifts (245 lb / 165 lb), burpees and jerks (155 lb / 105 lb), resting 1 minute between rounds."}, {"question": "How is Santora scored?", "answer": "Your score is the total reps across all 15 stations. On the shuttle sprints, 20 ft out and 20 ft back counts as 1 rep."}, {"question": "How long does Santora take?", "answer": "17 minutes: three rounds of 5 minutes of work, with 1 minute of rest after rounds one and two."}, {"question": "Who was Santora?", "answer": "U.S. Army Sgt. Jason A. Santora, of the 3rd Battalion, 75th Ranger Regiment, who died in Logar Province, Afghanistan, on April 23, 2010."}]'::jsonb,
    updated_at = now()
  where slug = 'santora';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'santora'; end if;
  -- wittman
  update benchmark_workouts set
    scheme = '7 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '20–35 min',
    equipment = array['kettlebell','barbell','box']::text[],
    difficulty = 'intermediate',
    body_focus = 'full-body',
    movements = '[{"name": "Kettlebell Swings", "reps": "15", "tip": "Drive with your hips and finish with the bell overhead.", "rx_men": "53 lb", "rx_women": "35 lb"}, {"name": "Power Cleans", "reps": "15", "tip": "Quick touch-and-go reps early, then fast singles once your grip and back tire.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Box Jumps", "reps": "15", "tip": "Stand tall at the top and step down to save your legs.", "rx_men": "24 in", "rx_women": "20 in"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Wittman honors U.S. Army Sgt. Jeremiah Wittman, 26, of Darby, Montana, assigned to the 1st Battalion, 12th Infantry Regiment, 4th Brigade Combat Team, 4th Infantry Division, based out of Fort Carson, Colorado. He was killed on Feb. 13, 2010, when insurgents attacked his unit with a roadside bomb in Zhari Province, Afghanistan. He is survived by his daughters, his wife, his siblings and his parents.

The workout is 7 rounds for time of 15 kettlebell swings (53 lb / 35 lb), 15 power cleans (95 lb / 65 lb) and 15 box jumps (24 in / 20 in). That is 315 reps, all moderate loads, and all driven by the hips. Swings and cleans both load the grip and lower back, so the challenge is holding the same pace from round one to round seven.',
    tips = '["Hold the same pace across all seven rounds", "Swings and cleans both tax your grip", "Step down from the box every rep"]'::jsonb,
    coaching_tips = '["Do the kettlebell swings unbroken if you can, with a strong hip snap so your arms only guide the bell.", "Cycle the power cleans touch-and-go early, then switch to quick singles before your back position slips.", "Shake out your hands on the walk from the bar to the box.", "Step down from the box to save your Achilles tendons over 105 jumps.", "Note your first round time and use it as the target for each round after."]'::jsonb,
    scaling_notes = 'Use a lighter kettlebell (35 lb / 26 lb) and a lighter barbell (65 lb / 45 lb). Swing to eye level if overhead swings bother your shoulders. Use a 20 in / 16 in box or step-ups. Cut to 5 rounds if 7 would take more than about 35 minutes.',
    faqs = '[{"question": "What is the Wittman workout?", "answer": "7 rounds for time of 15 kettlebell swings (53 lb / 35 lb), 15 power cleans (95 lb / 65 lb) and 15 box jumps (24 in / 20 in)."}, {"question": "How many total reps are in Wittman?", "answer": "315 reps: 105 kettlebell swings, 105 power cleans and 105 box jumps."}, {"question": "Who was Wittman?", "answer": "U.S. Army Sgt. Jeremiah Wittman, 26, of Darby, Montana, of the 4th Infantry Division. He was killed on Feb. 13, 2010, in Zhari Province, Afghanistan."}, {"question": "Are the kettlebell swings Russian or American?", "answer": "CrossFit swings finish overhead (American). Swinging to eye level is a fine way to scale if overhead swings bother your shoulders."}]'::jsonb,
    updated_at = now()
  where slug = 'wittman';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'wittman'; end if;
  -- tommy-v
  update benchmark_workouts set
    scheme = 'For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '20–40 min',
    equipment = array['barbell','rope']::text[],
    difficulty = 'advanced',
    body_focus = 'upper-body',
    movements = '[{"name": "Thrusters", "reps": "21", "tip": "Front squat to full depth and drive the bar overhead in one move. Break into sets of 7 or so.", "rx_men": "115 lb", "rx_women": "75 lb"}, {"name": "Rope Climbs", "reps": "12", "tip": "Lock your feet and stand up the rope with your legs. 15 ft every climb.", "rx_men": "15 ft", "rx_women": "15 ft"}, {"name": "Thrusters", "reps": "15", "tip": "Your arms are tired from the rope. Use your legs to drive the bar.", "rx_men": "115 lb", "rx_women": "75 lb"}, {"name": "Rope Climbs", "reps": "9", "tip": "Short rests between climbs beat missing a climb halfway up.", "rx_men": "15 ft", "rx_women": "15 ft"}, {"name": "Thrusters", "reps": "9", "tip": "Aim for one or two sets.", "rx_men": "115 lb", "rx_women": "75 lb"}, {"name": "Rope Climbs", "reps": "6", "tip": "The finish. Come down under control every time.", "rx_men": "15 ft", "rx_women": "15 ft"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Tommy V honors Senior Chief Petty Officer Thomas J. Valentine, 37, of Ham Lake, Minnesota, who died in a training accident in Arizona on Feb. 13, 2008. He is survived by his wife, his son and his daughter. CrossFit first posted the workout on March 12, 2008.

For time, you complete 21 thrusters, 12 rope climbs, 15 thrusters, 9 rope climbs, 9 thrusters and 6 rope climbs, with thrusters at 115 lb / 75 lb and a 15 ft rope. That is 45 thrusters and 27 rope climbs. The thrusters drain your legs and lungs, and 27 rope climbs is a lot of pulling, so your grip and arms set the pace by the second set of climbs.',
    tips = '["Use your legs on every rope climb", "Plan your thruster sets before you start", "Grip, not lungs, usually decides your time"]'::jsonb,
    coaching_tips = '["Break the 21 thrusters into sets you can repeat, such as 8, 7, 6, rather than going unbroken and resting long.", "Use a foot lock or S-wrap on the rope so your legs do most of the work.", "Come down the rope hand under hand rather than sliding, to protect your hands for later climbs.", "Take short, planned rests between rope climbs, such as 10 to 15 seconds, before your grip forces a long one.", "Shake out your hands and chalk up on the way to the bar."]'::jsonb,
    scaling_notes = 'Use a lighter barbell, such as 95 lb / 65 lb or 75 lb / 55 lb. Replace each rope climb with 3 rope pulls from lying to standing, climb to a lower mark, or do 3 strict pull-ups. Halving the rope climbs to 6, 5 and 3 keeps the workout moving for newer athletes.',
    faqs = '[{"question": "What is the Tommy V workout?", "answer": "For time: 21 thrusters, 12 rope climbs, 15 thrusters, 9 rope climbs, 9 thrusters and 6 rope climbs. Thrusters are 115 lb / 75 lb and the rope is 15 ft."}, {"question": "How many reps are in Tommy V?", "answer": "45 thrusters and 27 rope climbs."}, {"question": "Who was Tommy V?", "answer": "Senior Chief Petty Officer Thomas J. Valentine, 37, of Ham Lake, Minnesota, who died in a training accident in Arizona on Feb. 13, 2008."}, {"question": "How do I scale the rope climbs?", "answer": "Lie on the floor under the rope and pull yourself to standing 3 times for each climb, or climb to a lower mark. Strict pull-ups also work."}]'::jsonb,
    updated_at = now()
  where slug = 'tommy-v';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'tommy-v'; end if;
  -- murph
  update benchmark_workouts set
    movements = '[{"tip": "Steady pace", "name": "1 Mile Run", "reps": "1", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Partition any way; 5–10 at a time is common", "name": "Pull-Ups", "reps": "100", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Partition any way", "name": "Push-Ups", "reps": "200", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Full depth; partition as needed", "name": "Air Squats", "reps": "300", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Pace similar to first mile", "name": "1 Mile Run", "reps": "1", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}]'::jsonb,
    description = 'Murph is the most honored benchmark in CrossFit, named after Medal of Honor recipient Navy Lieutenant Michael Murphy. A mile run, 100 pull-ups, 200 push-ups, 300 air squats, another mile run. Partition as needed. If you have a 20 lb vest (14 lb for women) or body armor, wear it.',
    faqs = '[{"answer": "Murph is a hero workout consisting of a 1-mile run, 100 pull-ups, 200 push-ups, 300 air squats, and another 1-mile run. If you have a 20 lb vest (14 lb for women) or body armor, you wear it. It is named after Navy Lieutenant Michael Murphy, who was killed in action in Afghanistan in 2005.", "question": "What is the Murph workout?"}, {"answer": "Sub-35 min is elite. Most athletes finish in 40–60 min.", "question": "How long does Murph take?"}, {"answer": "CrossFit says to wear a 20 lb vest (14 lb for women) or body armor if you have one. Doing Murph without a vest is common and fine, especially for beginners or athletes focused on finishing the full volume.", "question": "Do you have to wear a vest for Murph?"}, {"answer": "Yes. The most popular partition is 20 rounds of 5 pull-ups, 10 push-ups, and 15 air squats. You can also do 10 rounds of 10/20/30. Partitioning makes the workout more manageable and often leads to faster times.", "question": "Can you partition Murph?"}, {"answer": "Murph is traditionally performed on Memorial Day in the United States, as a tribute to fallen service members. It has been called the Memorial Day Murph and is done by hundreds of thousands of athletes worldwide each year.", "question": "When is Murph traditionally done?"}, {"answer": "Scale Murph by removing the weight vest, reducing to a half Murph (half reps + one mile total), substituting ring rows for pull-ups, or doing knee push-ups. The goal is to finish safely with good form.", "question": "How do I scale Murph?"}]'::jsonb,
    updated_at = now()
  where slug = 'murph';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'murph'; end if;
  -- mccluskey
  update benchmark_workouts set
    equipment = array['rings','pullUpBar','weightedVest']::text[],
    movements = '[{"tip": "String together early — kip efficiently and lock out each rep; ring or bar muscle-ups both allowed", "name": "Muscle-Ups", "reps": "9", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Consistent rhythm; time your jump to catch the bar and use the momentum — 45 total across three rounds", "name": "Burpee Pull-Ups", "reps": "15", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Kip or butterfly; break before failure — grip is the limiting factor with 63 total pull-ups plus 27 muscle-ups in this workout", "name": "Pull-Ups", "reps": "21", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}, {"tip": "Use the run to recover arm and grip before the next round; do not sprint if it means walking into the muscle-ups", "name": "Run", "reps": "800m", "rx_men": "20 lb vest", "rx_women": "14 lb vest"}]'::jsonb,
    description = 'McCluskey honors U.S. Army Sergeant Jason McCluskey, 26, of McAlester, Oklahoma, killed in action in Zarghun Shahr, Afghanistan, on November 4, 2010. Sgt. McCluskey was assigned to the 27th Engineer Battalion, 20th Engineer Brigade, XVIII Airborne Corps, based out of Fort Bragg, North Carolina. He is survived by his son and his mother.

Three rounds of 9 muscle-ups, 15 burpee pull-ups, 21 pull-ups, and an 800m run, wearing a 20 lb vest (14 lb for women) or body armor if you have one. It is a workout defined by relentless upper-body pulling volume. Each round demands 45 pulling reps before the run: 9 muscle-ups, 15 burpee pull-ups, and 21 pull-ups. Across three rounds that is 27 muscle-ups, 45 burpee pull-ups, and 63 pull-ups — among the highest gymnastics volume of any hero WOD. The 800m run between rounds provides cardiovascular demand while the arms partially recover. Athletes without muscle-ups will need to substitute early or the workout becomes dominated by failed attempts.',
    scaling_notes = 'Drop the vest or use a lighter one. Scale muscle-ups to 3 pull-ups + 3 ring dips per rep. Scale burpee pull-ups to regular burpees + jumping pull-ups. Scale pull-ups to banded pull-ups if needed. All three rounds and 800m runs should be maintained.',
    faqs = '[{"answer": "U.S. Army Sgt. Jason \"Mick\" McCluskey, 26, of McAlester, Oklahoma, assigned to the 27th Engineer Battalion, 20th Engineer Brigade, XVIII Airborne Corps. He was killed on Nov. 4, 2010, in Zarghun Shahr, Afghanistan.", "question": "Who was Jason McCluskey?"}, {"answer": "27 muscle-ups + 45 burpee pull-ups + 63 pull-ups = 135 upper-body pulling reps across three rounds.", "question": "What is the total gymnastics volume in McCluskey?"}, {"answer": "Sub-35 minutes is strong. Sub-30 minutes is advanced. The high gymnastics volume makes this a long workout for most athletes.", "question": "What is a good time for McCluskey?"}, {"answer": "Both are permitted. Use whichever style you are stronger in.", "question": "Can I use ring or bar muscle-ups in McCluskey?"}, {"question": "Do I need a vest for McCluskey?", "answer": "CrossFit says to wear a 20 lb vest or body armor if you have one (14 lb for women). Without a vest is a common and fine way to do it."}]'::jsonb,
    updated_at = now()
  where slug = 'mccluskey';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'mccluskey'; end if;
  -- moon
  update benchmark_workouts set
    movements = '[{"tip": "From the hang position; drive the hips, split the feet wide, lock out overhead before recovering to standing", "name": "Dumbbell Hang Split Snatches (Right Arm)", "reps": "10", "rx_men": "40 lb", "rx_women": "30 lb"}, {"tip": "Use your legs efficiently; a legless rope climb here will cost you in later rounds — lock feet on every ascent", "name": "Rope Climbs", "reps": "1"}, {"tip": "Match the right arm — do not let the non-dominant side cheat the split position or the lockout", "name": "Dumbbell Hang Split Snatches (Left Arm)", "reps": "10", "rx_men": "40 lb", "rx_women": "30 lb"}, {"tip": "14 rope climbs total across seven rounds; steady and efficient beats fast and sloppy", "name": "Rope Climbs", "reps": "1"}]'::jsonb,
    description = 'Moon honors U.S. Army Specialist Christopher Moon, 20, of Tucson, Arizona, assigned to the 2nd Battalion, 508th Parachute Infantry Regiment, 4th Brigade Combat Team, 82nd Airborne Division, based out of Fort Bragg, North Carolina. He died on July 13, 2010, from injuries sustained on July 6, 2010, in Arghandab, Afghanistan, when insurgents attacked his vehicle with an improvised explosive device. He is survived by his parents and his sister.

Seven rounds of 10 dumbbell hang split snatches with the right arm (40 lb / 30 lb dumbbell), 1 rope climb, 10 more split snatches (left arm), and 1 more rope climb — 70 hang split snatches per arm and 14 rope climbs across the workout. The hang split snatch is technically demanding: from the hang position, drive the hips and split the feet wide while receiving the dumbbell locked out overhead. The bilateral rope climbing interspersed between each arm''s snatches creates a shoulder and grip demand that accumulates steadily. Moon is one of the most technically refined hero WODs, rewarding movement precision over raw fitness.',
    coaching_tips = '["Hang split snatch: from above the knee, drive the hips explosively and split your feet front-to-back as the dumbbell reaches overhead. Full lockout before recovering to standing.", "Alternate lead feet on the split — right foot forward, left foot forward. This prevents hip imbalance across 70 reps per arm.", "Rope climbs: use your legs efficiently on every ascent. A legless rope climb costs unnecessary arm fatigue across 14 total climbs.", "The dumbbell weight (40 lb men / 30 lb women) should allow smooth technique. If form breaks down, the weight is too heavy.", "Seven rounds means pacing matters — do not sprint the snatches in round 1. Consistent technique across all seven rounds is faster than early sprinting and late grinding."]'::jsonb,
    faqs = '[{"answer": "U.S. Army Specialist Christopher Moon, 20, of Tucson, Arizona, of the 2nd Battalion, 508th Parachute Infantry Regiment, 82nd Airborne Division. He died on July 13, 2010, from injuries sustained on July 6 in Arghandab, Afghanistan.", "question": "Who was Christopher Moon?"}, {"answer": "A dumbbell snatch performed from the hang position (bar at mid-thigh) where you split your feet into a lunge position to receive the weight overhead, rather than a power snatch or squat snatch.", "question": "What is a hang split snatch?"}, {"answer": "Sub-30 minutes is strong. The technical nature of the split snatch and the rope climbing volume mean most athletes finish in 30-45 minutes.", "question": "What is a good time for Moon?"}, {"answer": "2 per round (one between right arm and left arm snatches, one after left arm) x 7 rounds = 14 total rope climbs.", "question": "How many total rope climbs are in Moon?"}]'::jsonb,
    updated_at = now()
  where slug = 'moon';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'moon'; end if;
  -- mr-joshua
  update benchmark_workouts set
    movements = '[{"tip": "Settle into a sustainable pace — 5 rounds is a grind; do not sprint the first run", "name": "Run", "reps": "400m"}, {"tip": "Use a controlled descent; 150 GHD sit-ups accumulate fast — break early to protect your midline", "name": "GHD Sit-Ups", "reps": "30"}, {"tip": "Heavy singles or touch-and-go — protect your back as fatigue deepens on later rounds", "name": "Deadlifts", "reps": "15", "rx_men": "250 lb", "rx_women": "175 lb"}]'::jsonb,
    description = 'Mr. Joshua honors U.S. Navy Special Warfare Operator 1st Class (SEAL) Joshua Thomas Harris, 36, who drowned during combat operations on Aug. 30, 2008, in Afghanistan. He is survived by his parents, his brother and his twin sister.

The Mr. Joshua workout is a five-round couplet of a 400-meter run and barbell work — specifically 30 GHD sit-ups and 15 deadlifts at 250 pounds for men, 175 pounds for women. It is a pure test of metabolic conditioning paired with posterior-chain endurance under load.

The deadlift weight is the defining challenge. At 250 / 175 pounds, this is not a light touch-and-go workout — it demands real strength, and that load only gets heavier as the rounds accumulate. GHD sit-ups add lumbar fatigue on top of running and deadlifting, creating a perfect storm of lower-back stress by round three.

Pace the runs from the start. Going out hard on the first 400 meters and then collapsing on the deadlifts is a common mistake. Treat each run as a controlled effort — roughly 80% — so you can walk straight to the bar. For deadlifts, use touch-and-go in early rounds but switch to reset pulls as fatigue sets in. Never compromise your back position for speed.',
    faqs = '[{"answer": "Mr. Joshua honors U.S. Navy Special Warfare Operator 1st Class (SEAL) Joshua Thomas Harris, 36, who drowned during combat operations in Afghanistan on Aug. 30, 2008.", "question": "Who is Mr. Joshua named after?"}, {"answer": "Mr. Joshua is designed as a true test of strength-endurance. The 250 lb / 175 lb deadlift is meant to be challenging throughout all five rounds, forcing athletes to manage fatigue and maintain form under load.", "question": "Why is the deadlift weight so heavy?"}, {"answer": "Yes — substitute AbMat sit-ups if you don''t have GHD access or are not conditioned to high-volume GHD work. GHD sit-ups done without conditioning can cause severe DOMS.", "question": "Can I substitute GHD sit-ups?"}, {"answer": "The combination of running, GHD sit-ups, and heavy deadlifts all hammer the posterior chain and lower back. By round three, every movement compounds the fatigue of the others.", "question": "What makes Mr. Joshua so difficult?"}]'::jsonb,
    updated_at = now()
  where slug = 'mr-joshua';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'mr-joshua'; end if;
  -- roy
  update benchmark_workouts set
    movements = '[{"tip": "Keep hips loaded; do not round the lower back under fatigue", "name": "Deadlifts", "reps": "15", "rx_men": "225 lb", "rx_women": "155 lb"}, {"tip": "Step down to protect knees across 100 total reps; focus on quick rebounds", "name": "Box Jumps", "reps": "20", "rx_men": "24 in", "rx_women": "20 in"}, {"tip": "Break early — 10-8-7 or 5x5 — the 25 reps compounds fast in round 3+", "name": "Pull-Ups", "reps": "25"}]'::jsonb,
    description = 'Roy honors U.S. Marine Corps Sgt. Michael C. Roy, 25, of North Fort Myers, Florida, assigned to the 3rd Marine Special Operations Battalion, Marine Special Operations Advisor Group, Marine Corps Forces Special Operations Command at Camp Lejeune. He was killed in action on July 8, 2009, in Nimroz Province, Afghanistan, while supporting combat operations. He is survived by his wife and three children.

The Roy workout is five rounds of 15 deadlifts (225/155 pounds), 20 box jumps (24/20 inches), and 25 pull-ups. It is a landmark posterior-chain and gymnastics volume test — totaling 75 deadlifts, 100 box jumps, and 125 pull-ups across five rounds.

Roy is often compared to Murph in terms of sheer volume. The pull-up count alone — 125 reps — makes it one of the highest-volume pull-up workouts in the hero library. Combined with 75 heavy deadlifts, the lat and grip fatigue that develops across rounds three through five is profound.

The box jumps provide a cardio bridge between the barbell work and gymnastics, but they also contribute to leg fatigue that makes the deadlifts feel heavier as the workout progresses. Pacing deadlifts with a consistent rep scheme (sets of 5) across all five rounds is smarter than going big in round one and collapsing by round three. Similarly, pull-ups should be broken from the very first round — no hero sets, just steady work.',
    faqs = '[{"answer": "Roy honors U.S. Marine Corps Sgt. Michael C. Roy, 25, of the 3rd Marine Special Operations Battalion, killed in action on July 8, 2009, in Nimroz Province, Afghanistan.", "question": "Who is Roy named after?"}, {"answer": "Roy and Murph are both high-volume hero WODs. Roy features more pulling (125 pull-ups vs. 100) and adds heavy deadlifts, making it harder on the posterior chain. Murph is harder on the legs with 200 squats.", "question": "How does Roy compare to Murph in difficulty?"}, {"answer": "Roy totals 300 reps: 75 deadlifts, 100 box jumps, and 125 pull-ups across five rounds.", "question": "What is the total rep count in Roy?"}, {"answer": "A belt is permitted and may be useful in Roy given the high deadlift volume. However, prioritize position over speed — 225 lb for 75 reps requires consistent, safe mechanics throughout.", "question": "Should I use a belt for the deadlifts?"}]'::jsonb,
    updated_at = now()
  where slug = 'roy';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'roy'; end if;
  -- zeus
  update benchmark_workouts set
    movements = '[{"tip": "Big sets early; do not let the ball drop until round 2", "name": "Wall Balls", "reps": "30", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}, {"tip": "Drive elbows high; keep the bar close to the body", "name": "Sumo Deadlift High-Pulls", "reps": "30", "rx_men": "75 lb", "rx_women": "55 lb"}, {"tip": "Step down to protect knees across 90 reps total", "name": "Box Jumps", "reps": "30", "rx_men": "24 in", "rx_women": "20 in"}, {"tip": "Use the dip-drive aggressively; lock out overhead", "name": "Push Presses", "reps": "30", "rx_men": "75 lb", "rx_women": "55 lb"}, {"tip": "Hard and steady; do not sprint and blow up", "name": "Row", "reps": "30 cal"}, {"tip": "Full range; chest to deck every rep", "name": "Push-Ups", "reps": "30"}, {"tip": "Load to your bodyweight; go by feel if a precise BW load is not available", "name": "Back Squats", "reps": "10", "rx_men": "bodyweight", "rx_women": "bodyweight"}]'::jsonb,
    description = 'Zeus honors Specialist David E. Hickman, United States Army, of Greensboro, North Carolina, who was killed in action on November 14, 2011, in Baghdad, Iraq, at age 23. SPC Hickman was assigned to the 2nd Battalion, 325th Airborne Infantry Regiment, 2nd Brigade Combat Team, 82nd Airborne Division, Fort Bragg, North Carolina. He was the last American combat casualty of the Iraq War. He is survived by his wife, his parents and his brother.

The Zeus workout is three rounds for time of 30 wall balls (20/14 pounds), 30 sumo deadlift high-pulls (75/55 pounds), 30 box jumps (24/20 inches), 30 push presses (75/55 pounds), 30 calorie row, 30 push-ups, and 10 back squats at bodyweight. It is one of the longest and most comprehensive hero WODs in the CrossFit library, covering seven distinct movements with significant volume in each.

Zeus is a full-body endurance test. The barbell (75/55 lb) stays consistent across SDHPs and push presses, so athletes must be efficient — both movements tax the shoulders under significant cumulative volume. The calorie row provides the lone pure cardio break before the push-ups. The 10 back squats at bodyweight close each round — deceptively demanding when the entire body is already fatigued.

Pace every round. The first round will feel sustainable; by round two the entire posterior chain, shoulders, and lungs are working at capacity. There is no weak movement in Zeus — every station demands something.',
    coaching_tips = '["Wall balls: use a tall target (10 feet) and drive from the hips — let your legs generate the throw, not your arms.", "SDHPs and push presses share the same bar — transition quickly but rest briefly if needed between movements.", "Row at a controlled 85% effort — 30 calories is significant volume and going too hard here costs you on the push-ups.", "Back squats at bodyweight: set the bar on your back before you''re ready, not after — your legs need a moment to organize under load.", "In round three, commit to finishing each station before resting — breaking momentum between movements is your biggest time thief."]'::jsonb,
    scaling_notes = 'Scale wall ball weight to 14/10 lb. Scale SDHP and push press to 55 lb. Reduce box height to 16 inches. Scale push-ups to hands on a box or knees. Scale back squat to 50–75% of bodyweight. Reduce to 2 rounds if 3 rounds exceeds 60 minutes.',
    faqs = '[{"answer": "Zeus honors U.S. Army Specialist David E. Hickman, 82nd Airborne Division, killed in action on November 14, 2011, in Baghdad — the last American combat fatality of the Iraq War, at age 23.", "question": "Who is Zeus named after?"}, {"answer": "Load the barbell to your own bodyweight and perform 10 back squats. If you weigh 175 lb, you squat 175 lb. Scale to a comfortable working percentage of bodyweight if needed.", "question": "What does ''bodyweight back squat'' mean?"}, {"answer": "Zeus is one of the longest hero WODs. Most athletes take 50–80 minutes to complete three rounds. Scale aggressively to keep it under 60 minutes.", "question": "How long does Zeus take?"}, {"answer": "Each round has 160 reps outside the row (five stations of 30 plus 10 back squats), so 480 reps across three rounds, plus 90 calories on the rower.", "question": "What are the total reps in Zeus (excluding row)?"}]'::jsonb,
    updated_at = now()
  where slug = 'zeus';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'zeus'; end if;
  -- whitten
  update benchmark_workouts set
    movements = '[{"tip": "Hip drive", "name": "Kettlebell Swings", "reps": "22", "rx_men": "72 lb", "rx_women": "53 lb"}, {"tip": "Full extension", "name": "Box Jumps", "reps": "22", "rx_men": "24 in", "rx_women": "20 in"}, {"tip": "Consistent pace", "name": "Run", "reps": "400 m"}, {"tip": "Chest to deck; full jump", "name": "Burpees", "reps": "22"}, {"tip": "Full depth", "name": "Wall Balls", "reps": "22", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}]'::jsonb,
    description = 'Whitten is five rounds of 22 kettlebell swings (72 lb / 53 lb), 22 box jumps (24 in / 20 in), a 400 m run, 22 burpees and 22 wall balls (20 lb to 10 ft / 14 lb to 9 ft). A complete conditioning test.',
    scaling_notes = 'Scale KB to 53/35 lb. Scale box to 20/16" or step-ups. Scale wall balls to 14/10#. Reduce to 16 reps per movement if needed. Cap at 60 minutes.',
    faqs = '[{"question": "How many reps are in Whitten?", "answer": "440 reps (22 each of kettlebell swings, box jumps, burpees and wall balls, five times) plus 2,000 m of running."}, {"question": "Who was Whitten?", "answer": "U.S. Army Capt. Dan Whitten, 28, of Grimes, Iowa, of the 1st Battalion, 508th Parachute Infantry Regiment, 82nd Airborne Division. He died on Feb. 2, 2010, when enemy forces attacked his vehicle with an improvised explosive device in Zabul, Afghanistan."}, {"answer": "Sub-45 minutes is excellent. 50–60 minutes is solid for most athletes. The total volume is extremely high — focus on consistent rounds over individual rep speeds.", "question": "What is a good Whitten time?"}]'::jsonb,
    updated_at = now()
  where slug = 'whitten';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'whitten'; end if;
end $$;

select slug, scheme from benchmark_workouts where slug in ('luce', 'mccluskey', 'mcghee', 'moon', 'moore', 'mr-joshua', 'murph', 'nick', 'nutts', 'roy', 'santora', 'tommy-v', 'whitten', 'wittman', 'zeus') order by slug;
