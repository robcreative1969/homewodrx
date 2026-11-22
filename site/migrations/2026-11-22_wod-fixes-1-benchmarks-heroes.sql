-- HomeWODRx: correct workouts to official CrossFit definitions (batch AB). Not yet run.
do $$
declare n int;
begin
  -- grettel
  update benchmark_workouts set
    scheme = '10 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '8–15 min',
    equipment = array['barbell'],
    difficulty = 'intermediate',
    body_focus = 'full-body',
    movements = '[{"name": "Clean & Jerks", "reps": "3", "tip": "Squat or power clean, then any jerk; quick singles keep the bar moving.", "rx_men": "135 lb", "rx_women": "95 lb"}, {"name": "Burpees Over the Bar", "reps": "3", "tip": "Jump over the bar with both feet together; face the bar on every rep."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Grettel is a CrossFit benchmark of 10 rounds for time: 3 clean and jerks at 135 lb / 95 lb and 3 burpees over the bar. That adds up to 30 clean and jerks and 30 burpees, done with one barbell and nothing else.

The low reps make every round look easy. The challenge is the pace. A clean and jerk at a moderate load and a burpee that drops you to the floor beside the bar both spike your heart rate, and there is no long set to hide in. You go straight from the burpees back to the bar for 10 rounds. Athletes who stay smooth on the barbell and keep their burpees steady finish well ahead of those who sprint the first rounds and slow to a walk.',
    tips = '["Treat each round as one steady effort", "Stay close to the bar on the burpees", "Breathe before each clean, not during"]'::jsonb,
    coaching_tips = '["Pick a pace you can repeat for all 10 rounds and hold it.", "Set up the same way on every clean and jerk so the reps feel automatic.", "Land each burpee parallel to the bar so you can jump straight over it.", "Step back to the bar right after the last burpee instead of resting on the floor.", "If the barbell slows you down, do quick singles rather than missing reps."]'::jsonb,
    scaling_notes = 'Lower the barbell to a weight you can move for quick singles in every round, such as 95 lb / 65 lb. Swap burpees over the bar for regular burpees, or step over the bar instead of jumping. Newer athletes can do a power clean and push press instead of the full clean and jerk. Keep all 10 rounds.',
    faqs = '[{"question": "What is the Grettel WOD?", "answer": "Grettel is 10 rounds for time of 3 clean and jerks (135 lb / 95 lb) and 3 burpees over the bar."}, {"question": "How many total reps are in Grettel?", "answer": "60 reps: 30 clean and jerks and 30 burpees over the bar."}, {"question": "What counts as a burpee over the bar?", "answer": "Chest and thighs touch the floor beside the bar, then you jump over the bar with both feet at the same time."}]'::jsonb,
    updated_at = now()
  where slug = 'grettel';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'grettel'; end if;

  -- lynn
  update benchmark_workouts set
    scheme = '5 Rounds For Max Reps',
    format = 'Max Effort',
    scoring_type = 'total_reps',
    duration_estimate = '15–25 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'intermediate',
    body_focus = 'upper-body',
    movements = '[{"name": "Bench Press", "reps": "Max reps", "tip": "Use a spotter or safety arms; full lockout and the bar touches the chest each rep.", "rx_men": "bodyweight", "rx_women": "bodyweight"}, {"name": "Pull-Ups", "reps": "Max reps", "tip": "Chin clears the bar on every rep; stop when you can no longer get your chin over."}]'::jsonb,
    scoring_notes = 'Score is total reps of bench press and pull-ups across all 5 rounds.',
    description = 'Lynn, officially listed by CrossFit as Lynne, is 5 rounds for max reps of bench press at bodyweight and pull-ups. There is no clock. In each round you do as many bench press reps as you can, then as many pull-ups as you can, and rest as needed. Your score is the total of every rep across all 5 rounds.

Because the bench press load is your own bodyweight, Lynn scales to every athlete. It is a test of pushing and pulling endurance. Each round starts with less in the tank than the last, so your rep counts will fall. How much you rest between sets is up to you, and resting enough to keep each set strong pays off in the final score.',
    tips = '["Rest long enough to give each set a real effort", "Have a spotter on every bench set", "Count every rep and write it down"]'::jsonb,
    coaching_tips = '["Set up the bench with a spotter or safety arms before you start, since every set goes close to failure.", "Keep your feet planted and shoulder blades pulled together so each press uses the same path.", "On pull-ups, count only reps where your chin clears the bar.", "Write down each set so you can add up your total at the end.", "Most athletes rest 2–3 minutes between movements so every set is a strong one."]'::jsonb,
    scaling_notes = 'Reduce the bench press to a percentage of bodyweight, such as 50–75%, or do push-ups for max reps. Scale pull-ups to banded pull-ups or ring rows and count those reps. Keep 5 rounds and the max-rep format so your score can be compared next time.',
    faqs = '[{"question": "What is the Lynn WOD?", "answer": "Lynn (officially Lynne) is 5 rounds for max reps of bench press at bodyweight and pull-ups, with rest as needed. Your score is total reps."}, {"question": "Is Lynn timed?", "answer": "No. There is no time limit. Rest as needed between sets and rounds."}, {"question": "How heavy is the bench press in Lynn?", "answer": "Your own bodyweight, for both men and women."}]'::jsonb,
    updated_at = now()
  where slug = 'lynn';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'lynn'; end if;

  -- gwen
  update benchmark_workouts set
    scheme = '15-12-9 For Load',
    format = 'For Load',
    scoring_type = 'weight',
    duration_estimate = '15–30 min',
    equipment = array['barbell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Clean & Jerks", "reps": "15-12-9", "tip": "Touch-and-go at the floor only: no re-grip and no dropping the bar. Use the same load for all three sets.", "rx_men": "Athlete''s choice", "rx_women": "Athlete''s choice"}, {"name": "Rest", "reps": "As needed", "tip": "Rest as long as you need between sets.", "isRest": true}]'::jsonb,
    scoring_notes = 'Score is the heaviest load you used for all three sets, with every set unbroken and touch-and-go.',
    description = 'Gwen is a CrossFit benchmark of clean and jerks in sets of 15, 12 and 9. Each set must be unbroken and touch-and-go at the floor. Even a re-grip off the floor is a foul, and you cannot dump the bar. You rest as needed between sets and use the same load for all three. Gwen is scored by load, not time.

That makes Gwen a test of planning as much as strength. Choose a weight that is too light and your score is low. Choose one that is too heavy and you will lose your grip or form inside the set of 15. The best scores come from athletes who know their cycling ability, pick a load they can hold for 15 straight reps, and stay calm through the whole set.',
    tips = '["Choose a load you can hold for 15 straight reps", "Rest fully between sets", "Keep the bar close and your grip set"]'::jsonb,
    coaching_tips = '["Pick a load you are confident you can cycle for 15 unbroken reps, because every set must use it.", "Lower the bar under control to touch the floor, then pull again without changing your grip.", "Rest as long as you need between sets; there is no clock.", "Use a hook grip if you have practiced it, since grip often fails before the legs do.", "If a set breaks, it does not count at that load. Rest, lower the load and try again on another day."]'::jsonb,
    scaling_notes = 'Use a lighter load you can move with good form for every rep, or split the movement into a power clean and push press. Newer athletes can do sets of 9-7-5 with the same touch-and-go rule, or allow a short pause at the floor while keeping the hands on the bar.',
    faqs = '[{"question": "Is Gwen scored by time?", "answer": "No. Gwen is scored by load. Rest as needed between sets, and your score is the weight you used for all three sets."}, {"question": "What counts as a foul in Gwen?", "answer": "Letting go of the bar, re-gripping off the floor, or dumping the bar from overhead. Each set must be unbroken and touch-and-go."}, {"question": "How much weight should I use for Gwen?", "answer": "There is no set load. Choose a weight you can clean and jerk for 15 unbroken, touch-and-go reps, then use it for the sets of 12 and 9."}, {"question": "How many reps are in Gwen?", "answer": "36 clean and jerks: sets of 15, 12 and 9."}]'::jsonb,
    updated_at = now()
  where slug = 'gwen';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'gwen'; end if;

  -- the-chief
  update benchmark_workouts set
    scheme = '5 x 3-Min AMRAP, 1 Min Rest',
    format = 'AMRAP',
    scoring_type = 'rounds_reps',
    duration_estimate = '19 min',
    equipment = array['barbell','bodyweight'],
    difficulty = 'intermediate',
    body_focus = 'full-body',
    movements = '[{"name": "Power Cleans", "reps": "3", "tip": "Explosive hip drive; catch the bar high and stand tall.", "rx_men": "135 lb", "rx_women": "95 lb"}, {"name": "Push-Ups", "reps": "6", "tip": "Chest touches the floor; lock out the arms at the top."}, {"name": "Air Squats", "reps": "9", "tip": "Hips below the knees; stand all the way up."}, {"name": "Rest", "reps": "1 min", "tip": "Rest 1 minute after each 3-minute AMRAP, then start the next one.", "isRest": true}]'::jsonb,
    scoring_notes = 'Score is total rounds across all 5 AMRAPs. 20+ rounds is strong.',
    description = 'The Chief is a CrossFit benchmark built from five 3-minute AMRAPs. In each one you complete as many rounds as you can of 3 power cleans at 135 lb / 95 lb, 6 push-ups and 9 air squats. Then you rest 1 minute and start again, for 5 cycles and 19 minutes in total.

The short work windows invite you to go fast, and the 1-minute rest is never quite enough. By the fourth and fifth AMRAP your legs, chest and lungs are all working hard. The Chief rewards athletes who move quickly on the barbell, keep their push-ups unbroken and pace the first cycle so the last one is just as strong.',
    tips = '["Pace the first AMRAP so the fifth matches it", "Rest fully in each 1-minute break", "Keep push-ups unbroken as long as you can"]'::jsonb,
    coaching_tips = '["Start each AMRAP with the bar already set up and your hands ready.", "Do the power cleans as quick singles or touch-and-go, whichever is faster for you.", "Break push-ups early, before they slow to a grind.", "Use the air squats to keep moving while your breathing settles.", "Count your rounds at the end of each AMRAP so you can add up the total."]'::jsonb,
    scaling_notes = 'Lower the power clean load to a weight you can move fast, such as 95 lb / 65 lb. Scale push-ups to knee push-ups or hands on a box. Keep all five 3-minute AMRAPs and the 1-minute rest.',
    faqs = '[{"question": "What is The Chief WOD?", "answer": "Five 3-minute AMRAPs of 3 power cleans (135 lb / 95 lb), 6 push-ups and 9 air squats, with 1 minute of rest after each AMRAP."}, {"question": "How is The Chief scored?", "answer": "Add up the rounds from all five AMRAPs. 20+ rounds is strong."}, {"question": "How long does The Chief take?", "answer": "19 minutes: five 3-minute AMRAPs and four 1-minute rests."}]'::jsonb,
    updated_at = now()
  where slug = 'the-chief';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'the-chief'; end if;

  -- arnie
  update benchmark_workouts set
    scheme = 'For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '25–45 min',
    equipment = array['kettlebell'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Turkish Get-Ups (Right Arm)", "reps": "21", "tip": "Move through each step with control and keep your eyes on the bell.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}, {"name": "Kettlebell Swings", "reps": "50", "tip": "Drive with the hips and let the arms guide the bell.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}, {"name": "Overhead Squats (Left Arm)", "reps": "21", "tip": "Lock the elbow and keep the bell stacked over your shoulder.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}, {"name": "Kettlebell Swings", "reps": "50", "tip": "Break into sets before your grip gives out.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}, {"name": "Overhead Squats (Right Arm)", "reps": "21", "tip": "Squat only as deep as you can keep the arm locked.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}, {"name": "Kettlebell Swings", "reps": "50", "tip": "Keep a flat back as fatigue builds.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}, {"name": "Turkish Get-Ups (Left Arm)", "reps": "21", "tip": "Slow and steady; every rep counts the same.", "rx_men": "2 pood (70 lb)", "rx_women": "1.5 pood (53 lb)"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Arnie honors Los Angeles County Firefighter Specialist Arnaldo "Arnie" Quinones, 34, who was killed in the line of duty on August 30, 2009, while protecting a fire camp during the Station Fire. He is survived by his wife, Lori, and daughter, Sophia Grace, who was born three weeks after his death.

The workout is one pass for time with a single kettlebell: 21 Turkish get-ups with the right arm, 50 swings, 21 overhead squats with the left arm, 50 swings, 21 overhead squats with the right arm, 50 swings and 21 Turkish get-ups with the left arm. The get-ups and one-arm squats demand shoulder stability and patience, and the 150 heavy swings drain the grip between them.',
    tips = '["Control beats speed on the get-ups", "Break the swings before your grip fails", "Rest with the bell on the floor, not overhead"]'::jsonb,
    coaching_tips = '["Learn each step of the Turkish get-up before you attempt 21 reps with a heavy bell.", "Keep the working arm locked and your eyes on the bell during get-ups and overhead squats.", "Break the 50 swings into planned sets, such as 20-15-15.", "Squat only as deep as you can with the bell stacked over your shoulder.", "Set the bell down safely whenever you need a rest; never let it drift overhead."]'::jsonb,
    scaling_notes = 'Use a lighter kettlebell, such as 1.5 pood (53 lb) for men or 1 pood (35 lb) for women, and choose a weight you can control overhead with one arm. Reduce get-ups and overhead squats to 11 per side, or swap the overhead squats for goblet squats. Keep the order of the movements.',
    faqs = '[{"question": "Who was Arnie?", "answer": "Los Angeles County Firefighter Specialist Arnaldo \"Arnie\" Quinones, 34, killed in the line of duty on August 30, 2009, during the Station Fire."}, {"question": "How many rounds is Arnie?", "answer": "One. Arnie is a single pass for time through all seven movements with one kettlebell."}, {"question": "How many total reps are in Arnie?", "answer": "234 reps: 42 Turkish get-ups, 42 single-arm overhead squats and 150 kettlebell swings."}]'::jsonb,
    updated_at = now()
  where slug = 'arnie';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'arnie'; end if;

  -- bradley
  update benchmark_workouts set
    scheme = '10 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '25–40 min',
    equipment = array['running','pullUpBar','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Sprint", "reps": "100 m", "tip": "Fast but controlled; you have 20 sprints in total."}, {"name": "Pull-Ups", "reps": "10", "tip": "Chin clears the bar on every rep."}, {"name": "Sprint", "reps": "100 m", "tip": "Hold the same speed as the first sprint of the round."}, {"name": "Burpees", "reps": "10", "tip": "Chest to the floor, then a small jump at the top."}, {"name": "Rest", "reps": "30 sec", "tip": "Rest 30 seconds after each round. The clock keeps running.", "isRest": true}]'::jsonb,
    scoring_notes = 'Record your finish time, including rest. Sub-30 min is strong.',
    description = 'Bradley honors U.S. Air Force Senior Airman Bradley R. Smith, 24, of Troy, Illinois, assigned to the 10th Air Support Operations Squadron at Fort Riley, Kansas. He was killed on January 3, 2010, by an improvised explosive device in Kandahar Province, Afghanistan. He is survived by his wife, Tiffany, his daughter, Chloe, his parents and his brother.

Each of the 10 rounds is a 100-meter sprint, 10 pull-ups, another 100-meter sprint and 10 burpees, followed by 30 seconds of rest. That is 20 sprints, 100 pull-ups and 100 burpees. The short rest keeps your heart rate high, and the sprints punish anyone who starts too fast.',
    tips = '["Run hard but repeatable sprints", "Use every second of the 30-second rest", "Break pull-ups early"]'::jsonb,
    coaching_tips = '["Sprint at a pace you could repeat 20 times, not all-out on the first one.", "Break the pull-ups into small sets, such as 5-5, before your grip fades.", "Keep burpees steady and step back up if jumping slows you down.", "Walk and breathe during the 30-second rest rather than standing still.", "Mark a clear 100-meter course before you start so every sprint is the same."]'::jsonb,
    scaling_notes = 'Shorten the sprints to 50 m, scale pull-ups to banded pull-ups or ring rows, and step back instead of jumping on the burpees. Newer athletes can do 5–6 rounds. Keep the 30-second rest after each round.',
    faqs = '[{"question": "Who was Bradley?", "answer": "U.S. Air Force Senior Airman Bradley R. Smith, 24, of Troy, Illinois, killed by an improvised explosive device in Kandahar Province, Afghanistan, on January 3, 2010."}, {"question": "Is there rest in Bradley?", "answer": "Yes. Rest 30 seconds after each round. The clock keeps running, so the rest counts in your time."}, {"question": "What is a good time for Bradley?", "answer": "Sub-30 min is strong."}, {"question": "How many total reps are in Bradley?", "answer": "20 sprints of 100 m (2,000 m), 100 pull-ups and 100 burpees."}]'::jsonb,
    updated_at = now()
  where slug = 'bradley';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'bradley'; end if;

  -- bull
  update benchmark_workouts set
    scheme = '2 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '35–60 min',
    equipment = array['jumpRope','barbell','pullUpBar','running'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Double-Unders", "reps": "200", "tip": "Stay relaxed and keep the jumps small."}, {"name": "Overhead Squats", "reps": "50", "tip": "Lock the arms and keep the bar over the middle of your feet.", "rx_men": "135 lb", "rx_women": "95 lb"}, {"name": "Pull-Ups", "reps": "50", "tip": "Chin clears the bar; plan sets before your grip fades."}, {"name": "Run", "reps": "1 mile", "tip": "Settle into a steady pace and use it to recover."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Bull honors U.S. Marine Corps Capt. Brandon "Bull" Barrett, 27, of Marion, Indiana, assigned to 1st Battalion, 6th Marine Regiment, 2nd Marine Division, based at Camp Lejeune, North Carolina. He was killed on May 5, 2010, while supporting combat operations in Helmand Province, Afghanistan.

Bull is 2 rounds for time of 200 double-unders, 50 overhead squats at 135 lb / 95 lb, 50 pull-ups and a 1-mile run. In total that is 400 double-unders, 100 overhead squats, 100 pull-ups and 2 miles of running. It is one of the longest Hero WODs. The overhead squats test shoulder strength and mobility, and the volume of every movement makes pacing essential.',
    tips = '["Pace round one so round two is possible", "Break overhead squats into planned sets", "Use the run to settle your breathing"]'::jsonb,
    coaching_tips = '["Break the double-unders into sets you can repeat, such as 50s, rather than tripping on long sets.", "Plan the 50 overhead squats as sets of 10 or fewer and rest with the bar on the floor.", "Keep pull-up sets short and steady to protect your grip for the second round.", "Run the first mile at a pace you can match on the second.", "Drink water before you start; Bull often takes close to an hour."]'::jsonb,
    scaling_notes = 'Scale double-unders to 400 single-unders, overhead squats to 75 lb / 55 lb or front squats, and pull-ups to banded pull-ups or ring rows. Newer athletes can do 1 round or halve the reps. Keep the order of the movements.',
    faqs = '[{"question": "Who was Bull?", "answer": "U.S. Marine Corps Capt. Brandon \"Bull\" Barrett, 27, of Marion, Indiana, killed in Helmand Province, Afghanistan, on May 5, 2010."}, {"question": "What is the Bull WOD?", "answer": "2 rounds for time of 200 double-unders, 50 overhead squats (135 lb / 95 lb), 50 pull-ups and a 1-mile run."}, {"question": "How many total reps are in Bull?", "answer": "400 double-unders, 100 overhead squats, 100 pull-ups and 2 miles of running."}]'::jsonb,
    updated_at = now()
  where slug = 'bull';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'bull'; end if;

  -- chad
  update benchmark_workouts set
    scheme = 'For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '45–90 min',
    equipment = array['box','weightedVest'],
    difficulty = 'advanced',
    body_focus = 'lower-body',
    movements = '[{"name": "Box Step-Ups", "reps": "1,000", "tip": "20-in box for men and women; stand all the way up on the box each rep and alternate legs.", "rx_men": "45 lb ruck", "rx_women": "35 lb ruck"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Chad honors Navy SEAL Senior Chief Chad Wilkinson, who died on October 29, 2018. Over more than 20 years of service and many deployments, he suffered several traumatic brain injuries and blast-wave injuries, and lived with post-traumatic stress. CrossFit lists the workout as CHAD1000x, and it is often done to raise awareness of veteran mental health. He is survived by his wife, Sara, and children, Kinsley and Hudson.

The workout is 1,000 box step-ups on a 20-inch box, wearing a 45 lb ruck for men or 35 lb for women. There is nothing else to it. The challenge is the length: staying steady, alternating legs and keeping good posture for an hour or more.',
    tips = '["Find a steady rhythm and hold it", "Alternate legs to share the work", "Count in blocks of 50 or 100"]'::jsonb,
    coaching_tips = '["Stand all the way up on the box with both feet before stepping down.", "Alternate your lead leg every rep or every set to share the load.", "Fit the ruck snugly so it does not bounce or pull you backward.", "Count in blocks, such as sets of 50, to keep your place.", "Have water within reach and sip during short breaks."]'::jsonb,
    scaling_notes = 'CrossFit''s intermediate version keeps 1,000 step-ups on a 20-in box with a 30 lb ruck for men and 20 lb for women. The beginner version is 500 step-ups on a 12-in box with no ruck. Choose the version that lets you keep good form all the way through.',
    faqs = '[{"question": "Who was Chad?", "answer": "Navy SEAL Senior Chief Chad Wilkinson, who died on October 29, 2018, after more than 20 years of service. CrossFit lists the workout as CHAD1000x."}, {"question": "What box height and ruck weight are used?", "answer": "A 20-inch box for everyone, with a 45 lb ruck for men and a 35 lb ruck for women."}, {"question": "Can I use a weight vest instead of a ruck?", "answer": "Yes. A weight vest of the same weight is a common substitute."}]'::jsonb,
    updated_at = now()
  where slug = 'chad';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'chad'; end if;

  -- forrest
  update benchmark_workouts set
    scheme = '3 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '25–40 min',
    equipment = array['pullUpBar','running','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "L Pull-Ups", "reps": "20", "tip": "Hold the legs straight out in front at hip height for the whole rep."}, {"name": "Toes-to-Bar", "reps": "30", "tip": "Toes touch the bar between the hands on every rep."}, {"name": "Burpees", "reps": "40", "tip": "Chest to the floor; find a steady rhythm."}, {"name": "Run", "reps": "800 m", "tip": "Steady pace; let your grip recover."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Forrest honors U.S. Drug Enforcement Administration Special Agent Forrest Nelson Leamon, 37, a member of the Foreign-deployed Advisory and Support Team (FAST) Echo. He was killed on October 26, 2009, when his helicopter crashed during a counternarcotics mission in western Afghanistan. He is survived by his wife, Ana, his son, Luke, his parents and his sister.

The workout is 3 rounds for time of 20 L pull-ups, 30 toes-to-bar, 40 burpees and an 800-meter run. The L pull-ups and toes-to-bar both hammer the core and grip, so the burpees and run arrive with tired abs and forearms. Over 3 rounds that adds up to 60 L pull-ups, 90 toes-to-bar, 120 burpees and 2,400 meters of running.',
    tips = '["Small sets on the bar from the start", "Keep burpees steady, not fast", "Use the run to recover your grip"]'::jsonb,
    coaching_tips = '["Keep L pull-up sets short, such as 4–5 reps, because the leg hold tires the core quickly.", "Rest briefly between the L pull-ups and toes-to-bar to give your grip a break.", "Break toes-to-bar before your swing gets out of control.", "Pick a burpee pace you can hold for all 40 reps.", "Run the 800 m at a steady effort and shake out your arms as you go."]'::jsonb,
    scaling_notes = 'Scale L pull-ups to regular pull-ups or banded pull-ups with bent knees, and toes-to-bar to hanging knee raises. Reduce burpees to 20–30 and the run to 400 m. Newer athletes can do 2 rounds.',
    faqs = '[{"question": "Who was Forrest?", "answer": "DEA Special Agent Forrest Nelson Leamon, 37, killed in a helicopter crash during a counternarcotics mission in western Afghanistan on October 26, 2009."}, {"question": "What is an L pull-up?", "answer": "A pull-up done while holding your legs straight out in front of you at hip height, so your body forms an L."}, {"question": "How many total reps are in Forrest?", "answer": "60 L pull-ups, 90 toes-to-bar, 120 burpees and 2,400 meters of running."}]'::jsonb,
    updated_at = now()
  where slug = 'forrest';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'forrest'; end if;

  -- holbrook
  update benchmark_workouts set
    scheme = '10 Rounds, Each For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '20–30 min',
    equipment = array['barbell','pullUpBar','running'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Thrusters", "reps": "5", "tip": "Full squat, then drive the bar overhead in one motion.", "rx_men": "115 lb", "rx_women": "75 lb"}, {"name": "Pull-Ups", "reps": "10", "tip": "Chin clears the bar on every rep."}, {"name": "Sprint", "reps": "100 m", "tip": "Fast effort; the rest is coming."}, {"name": "Rest", "reps": "1 min", "tip": "Rest 1 minute between rounds.", "isRest": true}]'::jsonb,
    scoring_notes = 'Time each round. Your score is the total of the 10 round times, not counting rest.',
    description = 'Holbrook honors U.S. Army Capt. Jason Holbrook, 28, of Burnet, Texas, assigned to 1st Battalion, 3rd Special Forces Group (Airborne), at Fort Bragg, North Carolina. He was killed on July 29, 2010, in Tsagay, Afghanistan, when insurgents attacked his vehicle with an improvised explosive device. He is survived by his wife, Heather, and his parents.

The workout is 10 rounds, each for time, of 5 thrusters at 115 lb / 75 lb, 10 pull-ups and a 100-meter sprint, with 1 minute of rest between rounds. Each round is short and fast. The rest lets you push hard every time, but the thrusters and pull-ups add up to 50 and 100 reps.',
    tips = '["Push each round hard", "Get back to the bar before the rest ends", "Keep the sprint course short and clear"]'::jsonb,
    coaching_tips = '["Do the 5 thrusters unbroken; the load is light enough for most athletes to move fast.", "Break pull-ups into two sets if a long set would slow you down.", "Set the barbell near your pull-up bar and the start of your sprint course.", "Use the 1-minute rest to walk, breathe and get ready for the next round.", "Write down each round time so you can add up your score."]'::jsonb,
    scaling_notes = 'Lower the thrusters to 75 lb / 55 lb, scale pull-ups to banded pull-ups or ring rows, and shorten the sprint to 50 m if needed. Keep 10 rounds and the 1-minute rest.',
    faqs = '[{"question": "Who was Holbrook?", "answer": "U.S. Army Capt. Jason Holbrook, 28, of Burnet, Texas, killed on July 29, 2010, in Tsagay, Afghanistan."}, {"question": "How is Holbrook scored?", "answer": "Each round is for time. Add the 10 round times together and leave out the rest periods."}, {"question": "How many total reps are in Holbrook?", "answer": "50 thrusters, 100 pull-ups and 1,000 meters of sprinting."}]'::jsonb,
    updated_at = now()
  where slug = 'holbrook';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'holbrook'; end if;

  -- holleyman
  update benchmark_workouts set
    scheme = '30 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '25–45 min',
    equipment = array['wallBall','barbell','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Wall Balls", "reps": "5", "tip": "Full squat and hit the target on every rep.", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}, {"name": "Handstand Push-Ups", "reps": "3", "tip": "Head touches the floor or mat; lock out the arms at the top."}, {"name": "Power Cleans", "reps": "1", "tip": "Heavy single; set up the same way every round.", "rx_men": "225 lb", "rx_women": "155 lb"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Holleyman honors U.S. Army Staff Sgt. Aaron N. Holleyman, 27, assigned to 1st Battalion, 5th Special Forces Group, at Fort Campbell, Kentucky. He was killed on August 30, 2004, when his military vehicle struck an improvised explosive device in Khutayiah, Iraq. He is survived by his daughters, Shelby and Erin, his son, Zachary, his parents and his siblings.

The workout is 30 rounds for time of 5 wall balls, 3 handstand push-ups and 1 power clean at 225 lb / 155 lb. That adds up to 150 wall balls, 90 handstand push-ups and 30 heavy power cleans. The single clean each round is heavy, and the handstand push-ups grow harder as the shoulders tire from the wall balls.',
    tips = '["Keep a steady rhythm for all 30 rounds", "Set up every clean carefully", "Break handstand push-ups early"]'::jsonb,
    coaching_tips = '["Treat the power clean as a careful heavy single, not a rushed rep.", "Place the wall ball, wall and barbell close together to keep transitions short.", "Keep wall ball sets unbroken; five reps should move quickly.", "Split the handstand push-ups into singles once your shoulders tire.", "Count rounds with chalk marks or a tally so you never lose your place."]'::jsonb,
    scaling_notes = 'Lower the power clean to a weight you can lift safely for 30 singles, such as 135 lb / 95 lb. Scale handstand push-ups to pike push-ups on a box or regular push-ups, and use a lighter wall ball or lower target. Newer athletes can do 15–20 rounds.',
    faqs = '[{"question": "Who was Holleyman?", "answer": "U.S. Army Staff Sgt. Aaron N. Holleyman, 27, of the 5th Special Forces Group, killed on August 30, 2004, in Khutayiah, Iraq."}, {"question": "What is the Holleyman WOD?", "answer": "30 rounds for time of 5 wall balls (20 lb to 10 ft / 14 lb to 9 ft), 3 handstand push-ups and 1 power clean (225 lb / 155 lb)."}, {"question": "How many total reps are in Holleyman?", "answer": "150 wall balls, 90 handstand push-ups and 30 power cleans."}]'::jsonb,
    updated_at = now()
  where slug = 'holleyman';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'holleyman'; end if;

  -- jared
  update benchmark_workouts set
    scheme = '4 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '40–60 min',
    equipment = array['running','pullUpBar','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Run", "reps": "800 m", "tip": "Steady pace; there are four of these."}, {"name": "Pull-Ups", "reps": "40", "tip": "Chin clears the bar; plan small sets from the start."}, {"name": "Push-Ups", "reps": "70", "tip": "Chest touches the floor; break before you reach failure."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Jared honors U.S. Army Master Sgt. Jared N. Van Aalst, 34, of Laconia, New Hampshire, assigned to the U.S. Army Special Operations Command at Fort Bragg, North Carolina. He died on August 4, 2010, in Kunduz Province, Afghanistan, of wounds suffered while his unit was conducting combat operations. He is survived by his wife, Katie, his daughters, Kaylie and Ava, and a son, Hugh Jared, born after his death.

The workout is 4 rounds for time of an 800-meter run, 40 pull-ups and 70 push-ups. That is 3,200 meters of running, 160 pull-ups and 280 push-ups. The push-ups usually decide the time, because the chest and arms fail long before the legs.',
    tips = '["Plan small sets from the very first round", "Run at a pace you can repeat", "Rest before failure on push-ups"]'::jsonb,
    coaching_tips = '["Break the 40 pull-ups into sets of 5–10 from the start.", "Split the 70 push-ups into many small sets, such as 10s, and rest briefly between them.", "Stop each push-up set a rep or two before failure to keep the reps moving.", "Run every 800 m at the same steady pace and use it to recover.", "Expect the third and fourth rounds to take longer and pace the first round with that in mind."]'::jsonb,
    scaling_notes = 'Halve the reps to 20 pull-ups and 35 push-ups, scale pull-ups to banded pull-ups or ring rows, and do push-ups on the knees or with hands on a box. Shorten the run to 400 m or do 2–3 rounds for newer athletes.',
    faqs = '[{"question": "Who was Jared?", "answer": "U.S. Army Master Sgt. Jared N. Van Aalst, 34, of Laconia, New Hampshire, who died on August 4, 2010, in Kunduz Province, Afghanistan."}, {"question": "What is the Jared WOD?", "answer": "4 rounds for time of an 800-meter run, 40 pull-ups and 70 push-ups."}, {"question": "How many total reps are in Jared?", "answer": "160 pull-ups, 280 push-ups and 3,200 meters of running."}]'::jsonb,
    updated_at = now()
  where slug = 'jared';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'jared'; end if;

  -- josh
  update benchmark_workouts set
    scheme = 'For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '12–20 min',
    equipment = array['barbell','pullUpBar'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Overhead Squats", "reps": "21", "tip": "Arms locked and the bar over the middle of your feet.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Pull-Ups", "reps": "42", "tip": "Chin clears the bar; plan sets from the start."}, {"name": "Overhead Squats", "reps": "15", "tip": "Get the bar overhead and squat right away.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Pull-Ups", "reps": "30", "tip": "Keep sets short and steady."}, {"name": "Overhead Squats", "reps": "9", "tip": "Last barbell set; stay tight.", "rx_men": "95 lb", "rx_women": "65 lb"}, {"name": "Pull-Ups", "reps": "18", "tip": "Last set; push to the finish."}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Josh honors U.S. Army Staff Sgt. Joshua Hager, 29, of Broomfield, Colorado, assigned to 1st Battalion, 9th Infantry Regiment, 2nd Brigade Combat Team, 2nd Infantry Division, at Fort Carson, Colorado. He was killed on February 22, 2007. He is survived by his wife, Heather, his son, Bayley, and his family.

The workout is for time: 21 overhead squats, 42 pull-ups, 15 overhead squats, 30 pull-ups, 9 overhead squats and 18 pull-ups, with the barbell at 95 lb / 65 lb. The pull-ups are always double the squats, so Josh has 90 pull-ups against 45 overhead squats. Grip and shoulder endurance decide the time.',
    tips = '["Pull-ups set the pace, so plan them", "Stay tight in the overhead squat", "Move quickly between the bar and the rig"]'::jsonb,
    coaching_tips = '["Break the 42 pull-ups into planned sets, such as 10-10-8-8-6, before your grip fails.", "Squat to full depth with the arms locked and the bar over the middle of your feet.", "Set the barbell close to the pull-up bar to keep transitions short.", "Keep overhead squat sets unbroken if you can; the load is moderate.", "Shake out your hands while you walk between movements."]'::jsonb,
    scaling_notes = 'Lower the overhead squats to 65 lb / 45 lb or a PVC pipe, or swap for front squats. Scale pull-ups to banded pull-ups or ring rows, or halve the pull-up reps to 21-15-9.',
    faqs = '[{"question": "Who was Josh?", "answer": "U.S. Army Staff Sgt. Joshua Hager, 29, of Broomfield, Colorado, killed on February 22, 2007."}, {"question": "What is the Josh WOD?", "answer": "For time: 21 overhead squats, 42 pull-ups, 15 overhead squats, 30 pull-ups, 9 overhead squats and 18 pull-ups (95 lb / 65 lb)."}, {"question": "How many total reps are in Josh?", "answer": "45 overhead squats and 90 pull-ups."}]'::jsonb,
    updated_at = now()
  where slug = 'josh';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'josh'; end if;

  -- jt
  update benchmark_workouts set
    scheme = '21-15-9 For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '12–20 min',
    equipment = array['rings','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'upper-body',
    movements = '[{"name": "Handstand Push-Ups", "reps": "21-15-9", "tip": "Head touches the floor or mat; lock out the arms at the top."}, {"name": "Ring Dips", "reps": "21-15-9", "tip": "Shoulders below the elbows at the bottom; lock out at the top."}, {"name": "Push-Ups", "reps": "21-15-9", "tip": "Chest touches the floor; keep the body in one straight line."}]'::jsonb,
    scoring_notes = 'Record your finish time. Sub-15 min is strong.',
    description = 'JT honors U.S. Navy Petty Officer 1st Class Jeff Taylor, 30, of Midway, West Virginia, who was killed on June 28, 2005, during combat operations near Asadabad, Afghanistan. He is survived by his wife, Erin, and his parents.

The workout is 21-15-9 reps for time of handstand push-ups, ring dips and push-ups. There is no pulling and no legs, just 135 reps of pressing. Every movement works the shoulders, chest and triceps, so fatigue builds quickly. The best times come from athletes who break their sets early and keep the rest between them short.',
    tips = '["Break sets before you reach failure", "Keep rests short and planned", "Stay tight on every push-up"]'::jsonb,
    coaching_tips = '["Break handstand push-ups into small sets from the start, such as 7-7-7 in the first round.", "Keep the rings close to your body on dips to protect your shoulders.", "Push-ups come when your triceps are already tired, so plan short sets.", "Rest for a few breaths between sets rather than waiting until you can do a long set.", "Keep your body in a straight line on push-ups; let the hips sag and the rep does not count."]'::jsonb,
    scaling_notes = 'Scale handstand push-ups to pike push-ups on a box or use an abmat to shorten the range. Swap ring dips for bench or bar dips with the feet on the floor, and do push-ups on the knees or hands on a box. You can also reduce the reps to 15-12-9.',
    faqs = '[{"question": "Who was JT?", "answer": "U.S. Navy Petty Officer 1st Class Jeff Taylor, 30, of Midway, West Virginia, killed on June 28, 2005, near Asadabad, Afghanistan."}, {"question": "How many rounds is JT?", "answer": "JT is a single 21-15-9 for time: 21 reps of each movement, then 15, then 9. There are no extra rounds."}, {"question": "How many total reps are in JT?", "answer": "135 reps: 45 handstand push-ups, 45 ring dips and 45 push-ups."}, {"question": "What is a good time for JT?", "answer": "Sub-15 min is strong."}]'::jsonb,
    updated_at = now()
  where slug = 'jt';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'jt'; end if;

  -- klepto
  update benchmark_workouts set
    scheme = '4 Rounds For Time',
    format = 'For Time',
    scoring_type = 'time',
    duration_estimate = '20–30 min',
    equipment = array['box','barbell','bodyweight'],
    difficulty = 'advanced',
    body_focus = 'full-body',
    movements = '[{"name": "Box Jumps", "reps": "27", "tip": "Stand all the way up on the box; step down to save your legs.", "rx_men": "24 in", "rx_women": "20 in"}, {"name": "Burpees", "reps": "20", "tip": "Chest to the floor; keep a steady rhythm."}, {"name": "Squat Cleans", "reps": "11", "tip": "Catch the bar in a full squat and stand all the way up.", "rx_men": "145 lb", "rx_women": "95 lb"}]'::jsonb,
    scoring_notes = 'Record your finish time.',
    description = 'Klepto honors U.S. Air Force Maj. David "Klepto" L. Brodeur, 34, of Auburn, Massachusetts, assigned to the 11th Air Force at Joint Base Elmendorf-Richardson, Alaska. He was killed on April 27, 2011, in Kabul, Afghanistan, by gunfire from an Afghan military trainee. He is survived by his wife, Susie, his daughter, Elizabeth, and his son, David.

The workout is 4 rounds for time of 27 box jumps, 20 burpees and 11 squat cleans at 145 lb / 95 lb. That is 108 box jumps, 80 burpees and 44 squat cleans. The jumps and burpees tire the legs and lungs just before the heavy cleans, so the barbell gets harder every round.',
    tips = '["Step down from the box to save your legs", "Steady burpees, not fast ones", "Quick singles on the cleans"]'::jsonb,
    coaching_tips = '["Step down from each box jump to protect your Achilles and keep your legs fresh for the cleans.", "Do the burpees at a pace you can hold for all 20 without stopping.", "Take the squat cleans as quick singles once the barbell feels heavy.", "Set up the barbell right next to the box to keep transitions short.", "Pace the first round so the fourth round is not much slower."]'::jsonb,
    scaling_notes = 'Lower the squat cleans to 115 lb / 75 lb or do power cleans, use a lower box or step-ups, and reduce the burpees to 10–15. Newer athletes can do 3 rounds.',
    faqs = '[{"question": "Who was Klepto?", "answer": "U.S. Air Force Maj. David \"Klepto\" L. Brodeur, 34, of Auburn, Massachusetts, killed in Kabul, Afghanistan, on April 27, 2011."}, {"question": "What is the Klepto WOD?", "answer": "4 rounds for time of 27 box jumps (24 in / 20 in), 20 burpees and 11 squat cleans (145 lb / 95 lb)."}, {"question": "How many total reps are in Klepto?", "answer": "108 box jumps, 80 burpees and 44 squat cleans."}]'::jsonb,
    updated_at = now()
  where slug = 'klepto';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'klepto'; end if;

  -- adam-brown
  update benchmark_workouts set
    movements = '[{"tip": "Near-maximal weight for most — singles from the start; protect the back", "name": "Deadlifts", "reps": "24", "rx_men": "295 lb", "rx_women": "195 lb"}, {"tip": "Step down every rep — protect your legs for the bench and cleans ahead", "name": "Box Jumps", "reps": "24", "rx_men": "24 in", "rx_women": "20 in"}, {"tip": "Unbroken if possible; breathe at the top of each rep", "name": "Wall Balls", "reps": "24", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}, {"tip": "Have a spotter — heavy bench press mid-WOD requires a safety plan", "name": "Bench Press", "reps": "24", "rx_men": "195 lb", "rx_women": "135 lb"}, {"tip": "Step down; legs are increasingly fatigued at this point in the chipper", "name": "Box Jumps", "reps": "24", "rx_men": "24 in", "rx_women": "20 in"}, {"tip": "Push through — these are the last big unloaded set before the cleans", "name": "Wall Balls", "reps": "24", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}, {"tip": "Power or squat — singles if needed; this is the final test of will", "name": "Cleans", "reps": "24", "rx_men": "145 lb", "rx_women": "95 lb"}]'::jsonb,
    description = 'AdamBrown honors Navy SEAL Chief Petty Officer Adam Brown, 36, of Hot Springs, Arkansas, killed in action in Kunar Province, Afghanistan, on March 17, 2010. Chief Brown''s story is one of the most extraordinary in special operations history — he overcame drug addiction, the loss of vision in one eye, the loss of fingers, and multiple severe injuries to earn his SEAL Trident and serve with SEAL Team 6. His perseverance is the spirit the workout demands.

Two rounds of a seven-movement chipper at punishing loads: 24 reps each of deadlifts (295 lb / 195 lb), box jumps, wall balls, bench press (195 lb / 135 lb), box jumps again, wall balls again, and cleans (145 lb / 95 lb). The deadlift and bench press weights are near-maximal for many athletes, making the workout as much a strength test as a conditioning one. No single movement is the problem — the combination of systemic fatigue, grip stress, and shoulder demand across 168 reps per round is the challenge. Requires a spotter for bench press.',
    coaching_tips = '["Deadlifts at 295 lb / 195 lb: singles from rep one for most athletes. Brace hard and reset between each rep. Do not rush the setup — a sloppy pull here telegraphs fatigue for everything that follows.", "Have a trusted spotter on bench press. This is not the workout to ego-lift — a missed rep mid-WOD is dangerous and kills momentum.", "Step down on every box jump set. At this volume and load, leg fatigue from jumping down compounds over two rounds.", "Wall balls (24 reps) should be your relative rest — breathe through these and try to go unbroken.", "Cleans at 145 lb / 95 lb close each round. Power clean for speed; quick singles if needed. This is your final movement — give everything."]'::jsonb,
    faqs = '[{"answer": "Chief Petty Officer Adam Brown was a Navy SEAL who overcame addiction, vision loss in one eye, and the loss of fingers to earn his SEAL Trident. He served with SEAL Team 6 and was killed in action in Afghanistan on March 17, 2010.", "question": "Who was Adam Brown?"}, {"answer": "Yes — bench press at 195 lb / 135 lb mid-workout absolutely requires a spotter. Do not attempt this workout without one.", "question": "Do I need a spotter for AdamBrown?"}, {"answer": "168 reps per round x 2 rounds = 336 total reps across all seven movements.", "question": "How many total reps are in AdamBrown?"}, {"answer": "Sub-30 minutes is strong. This is an extremely demanding hero WOD — finishing the workout at any time is a meaningful achievement.", "question": "What is a good time for AdamBrown?"}]'::jsonb,
    equipment = array['barbell','box','wallBall'],
    updated_at = now()
  where slug = 'adam-brown';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'adam-brown'; end if;

  -- blake
  update benchmark_workouts set
    movements = '[{"tip": "Lock the plate out overhead and keep your torso upright; small controlled steps beat rushing — 100 feet disappears when you stay composed", "name": "Overhead Walking Lunges", "reps": "100 ft", "rx_men": "45 lb plate", "rx_women": "25 lb plate"}, {"tip": "Step down to protect your Achilles and manage quad fatigue across 4 rounds; find a consistent rhythm rather than going all-out early", "name": "Box Jumps", "reps": "30", "rx_men": "24\"", "rx_women": "20\""}, {"tip": "Drive through your hips and keep the ball on target; sets of 10 work well when the legs are gassed from lunges", "name": "Wall Balls", "reps": "20", "rx_men": "20 lb to 10 ft", "rx_women": "14 lb to 9 ft"}, {"tip": "Tight midline — avoid excessive low-back arching; if you need to break, do it before failure rather than grinding out ugly reps", "name": "Handstand Push-Ups", "reps": "10"}]'::jsonb,
    description = 'Blake honors U.S. Navy Senior Chief Cryptologic Technician (Collection) David Blake McLendon, 30, of Thomasville, Georgia, assigned to Naval Special Warfare Group 2 Support Activity, killed in action on September 21, 2010, when the helicopter he was aboard crashed during combat operations in the Zabul province of Afghanistan. He is survived by his wife and children.

Four rounds of 100-foot overhead walking lunges (45 lb plate men / 25 lb plate women), 30 box jumps, 20 wall balls, and 10 handstand push-ups — a sustained power test that hits the shoulders from every angle. The overhead lunge demands shoulder stability and hip control for 100 feet; the box jumps load the legs; wall balls continue the shoulder and leg demand; HSPU finishes each round with a strict pressing movement. The accumulation of four rounds makes each station feel progressively harder. Sub-30 minutes is a strong performance.',
    faqs = '[{"answer": "A U.S. Navy Senior Chief killed in a helicopter crash during combat operations in Afghanistan on September 21, 2010. He served with Naval Special Warfare Group 2 Support Activity.", "question": "Who was David Blake McLendon?"}, {"answer": "Sub-30 min is strong.", "question": "What is a good time for Blake?"}, {"answer": "45 lb for men, 25 lb for women. The plate is held fully locked out overhead for all 100 feet each round.", "question": "What weight plate is used for overhead lunges in Blake?"}, {"answer": "10 per round x 4 rounds = 40 total handstand push-ups.", "question": "How many handstand push-ups are in Blake?"}]'::jsonb,
    scaling_notes = 'Scale the overhead lunge plate to 25 lb for men or 10-15 lb for women. Lower box height if needed (20-inch). Scale HSPU to pike push-ups from a box. Keep all four movements and all four rounds — reducing rounds changes the intent of the workout.',
    equipment = array['box','wallBall','bodyweight'],
    tips = '["Lock the plate out overhead on every step", "Step down from the box to save your legs", "Break HSPU before failure"]'::jsonb,
    updated_at = now()
  where slug = 'blake';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'blake'; end if;

  -- collin
  update benchmark_workouts set
    movements = '[{"tip": "Bear-hug or shoulder carry — the 400m carry is the longest sustained load in the WOD; pace it", "name": "Sandbag Carry", "reps": "400 m", "rx_men": "50 lb", "rx_women": "35 lb"}, {"tip": "Aggressive dip-drive; lock out overhead; upper body will be taxed from the carry", "name": "Push Presses", "reps": "12", "rx_men": "115 lb", "rx_women": "75 lb"}, {"tip": "Step down every rep; legs accumulate fatigue across six rounds of carries and jumps", "name": "Box Jumps", "reps": "12", "rx_men": "24 in", "rx_women": "20 in"}, {"tip": "Drive the hips; pull the elbows high and wide; cycle without breaking if grip allows", "name": "Sumo Deadlift High-Pulls", "reps": "12", "rx_men": "95 lb", "rx_women": "65 lb"}]'::jsonb,
    description = 'Collin honors Navy SEAL Chief Petty Officer Collin Thomas, 33, of St. Augustine, Florida, killed in action in Eastern Afghanistan on August 18, 2010. Chief Thomas served with SEAL Team 4 and is remembered for his leadership and professionalism. He is survived by his wife and children.

Six rounds of a 400m sandbag carry (50 lb / 35 lb), 12 push presses (115/75 lb), 12 box jumps, and 12 sumo deadlift high-pulls (95/65 lb). The 400m sandbag carry is the defining feature — bear-hugging or shouldering a sandbag for 400 meters six times means 2.4 km of loaded carrying total. The carry creates grip, shoulder, and postural fatigue that compounds every barbell movement that follows. SDHP and push press both demand pulling and pressing capacity from a compromised state. Collin tests grip endurance, shoulder stamina, and the mental discipline to keep moving through sustained discomfort.',
    scaling_notes = 'Scale the sandbag to 35 lb for men or 20-25 lb for women if the Rx bag is too heavy to keep good form. Scale push press to 95 lb men / 65 lb women. Scale SDHP to 75 lb men / 55 lb women. Reduce box height to 20 inches if needed. Keep all six rounds.',
    equipment = array['sandbag','barbell','box'],
    updated_at = now()
  where slug = 'collin';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'collin'; end if;

  -- jack
  update benchmark_workouts set
    movements = '[{"tip": "Use your legs to drive the bar — don''t muscle it", "name": "Push Presses", "reps": "10", "rx_men": "115 lb", "rx_women": "75 lb"}, {"tip": "Hip hinge, not a squat — explosive hip drive", "name": "Kettlebell Swings", "reps": "10", "rx_men": "1.5 pood (53 lb)", "rx_women": "1 pood (35 lb)"}, {"tip": "Step down each rep; a missed box late in the WOD is dangerous", "name": "Box Jumps", "reps": "10", "rx_men": "24\"", "rx_women": "20\""}]'::jsonb,
    scaling_notes = 'Scale push press to 95 lb / 55 lb. Scale KB to 35#. Scale box jumps to 20/16" or step-ups. All three movements should allow consistent unbroken sets of 10 throughout the 20 minutes.',
    updated_at = now()
  where slug = 'jack';
  get diagnostics n = row_count; if n <> 1 then raise exception 'slug % not updated', 'jack'; end if;

end $$;

select slug, scheme from benchmark_workouts where slug in ('grettel', 'lynn', 'gwen', 'the-chief', 'arnie', 'bradley', 'bull', 'chad', 'forrest', 'holbrook', 'holleyman', 'jared', 'josh', 'jt', 'klepto', 'adam-brown', 'blake', 'collin', 'jack') order by slug;
