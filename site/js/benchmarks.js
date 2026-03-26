// ============================================================================
// HOMEWODRX BENCHMARK WORKOUTS DATABASE
// ============================================================================
// All named CrossFit benchmarks: The Girls, Hero WODs, and Other Benchmarks

const BENCHMARKS = [
  // ===== THE GIRLS =====

  {
    slug: 'annie',
    name: 'Annie',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '8–15 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['jumpRope', 'pullUpBar'],
    scoring_type: 'time',
    description: 'Annie is a classic double-under and sit-up grinder. The pairing of two high-volume movements creates a balance between upper body control and core endurance. This workout teaches pacing and managing fatigue across different movement patterns.',
    movements: [
      { name: 'Double-Unders', reps: '50 – 40 – 30 – 20 – 10', tip: 'Consistent rhythm is key; practice your transition rope speed' },
      { name: 'Sit-Ups', reps: '50 – 40 – 30 – 20 – 10', tip: 'Full range of motion with feet anchored' }
    ],
    scoring_notes: 'Record your finish time. Sub-8 min is very strong. Sub-12 min is a solid goal.',
    tips: ['Break double-unders early rather than failing on singles', 'Pace your sit-ups—they add up fast', 'The jump rope transitions matter more than you think']
  },

  {
    slug: 'angie',
    name: 'Angie',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '20–40 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'time',
    description: 'Angie is the test of raw pulling and pushing power. 100 of each movement, done in order, with no rest. It separates the strong from the elite and teaches mental toughness when your shoulders are on fire.',
    movements: [
      { name: 'Pull-Ups', reps: '100', tip: 'Kipping is allowed—use it to manage fatigue' },
      { name: 'Push-Ups', reps: '100', tip: 'Controlled descent; avoid touching chest' },
      { name: 'Sit-Ups', reps: '100', tip: 'Full range of motion' },
      { name: 'Air Squats', reps: '100', tip: 'Below parallel every rep' }
    ],
    scoring_notes: 'Record your finish time. Under 20 min is elite. Under 30 min is strong.',
    tips: ['Pace yourself early—Angie is a marathon, not a sprint', 'Find a rhythm in each movement and stick to it', 'The last 20 reps of each movement are mental']
  },

  {
    slug: 'barbara',
    name: 'Barbara',
    category: 'girl',
    format: 'Circuit',
    duration_estimate: '20–30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'time',
    description: 'Barbara is five rounds of bodyweight gymnastics with 3 minutes of rest between rounds. The volume climbs through each round, testing both strength and conditioning. The 3-minute rest is deceptive—you\'ll realize you need every second.',
    movements: [
      { name: 'Pull-Ups', reps: '20', tip: 'Kipping or strict—whatever gets you through' },
      { name: 'Push-Ups', reps: '30', tip: 'Touch chest to deck each rep' },
      { name: 'Sit-Ups', reps: '40', tip: 'Full range of motion' },
      { name: 'Air Squats', reps: '50', tip: 'Below parallel' }
    ],
    scoring_notes: 'Record your finish time for all 5 rounds + rest. Under 25 min is strong.',
    tips: ['Don\'t go out hard in round 1', 'The last two rounds will humble you', 'Use the 3-minute rest wisely—stretch, breathe, reset']
  },

  {
    slug: 'chelsea',
    name: 'Chelsea',
    category: 'girl',
    format: 'EMOM',
    duration_estimate: '30 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'rounds_reps',
    description: 'Chelsea is a 30-minute EMOM where you perform the same three movements every minute. It tests aerobic capacity and the ability to maintain pace over time. Consistency is everything.',
    movements: [
      { name: 'Pull-Ups', reps: '5', tip: 'Unbroken sets throughout if possible' },
      { name: 'Push-Ups', reps: '10', tip: 'Chest to deck' },
      { name: 'Air Squats', reps: '15', tip: 'Below parallel' }
    ],
    scoring_notes: 'Score is total rounds completed in 30 minutes. 30 rounds = 5 rounds/minute is very strong.',
    tips: ['Aim for 20–25 seconds of work, rest the remainder', 'If you can\'t complete a round, that\'s your stopping point', 'Pacing, pacing, pacing']
  },

  {
    slug: 'cindy',
    name: 'Cindy',
    category: 'girl',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'rounds_reps',
    description: 'Cindy is one of the most iconic 20-minute AMRAPs in CrossFit. The simplicity is deceptive: pull-ups, push-ups, air squats. It rewards smart pacing and grit. Most people have a Cindy baseline they return to.',
    movements: [
      { name: 'Pull-Ups', reps: '5', tip: 'Kipping or strict' },
      { name: 'Push-Ups', reps: '10', tip: 'Chest to deck' },
      { name: 'Air Squats', reps: '15', tip: 'Below parallel' }
    ],
    scoring_notes: 'Score is total rounds + any additional reps. 20+ rounds is very strong.',
    tips: ['Pace to start—you\'ll want to sprint at the end', 'If you hit 20 rounds, you\'re elite', 'Stay consistent in your pull-up sets']
  },

  {
    slug: 'diane',
    name: 'Diane',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '4–12 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell', 'bodyweight'],
    scoring_type: 'time',
    description: 'Diane pairs heavy deadlifts with hspu, testing both lower body strength and pressing power. The decreasing reps allow for some redemption, but the heavy weight early makes this deceptively tough.',
    movements: [
      { name: 'Deadlifts', reps: '21 – 15 – 9', rx_men: '225 lb', rx_women: '155 lb', tip: 'Full extension at top; drive through heels' },
      { name: 'Handstand Push-Ups', reps: '21 – 15 – 9', tip: 'Full range of motion; chest to wall' }
    ],
    scoring_notes: 'Record your finish time. Under 8 min is strong. Sub-5 min is elite.',
    tips: ['The heavy deadlifts set the tone—pace accordingly', 'Break HSPUs early; fatigued ones are dangerous', 'The 9s are where you can make up time']
  },

  {
    slug: 'elizabeth',
    name: 'Elizabeth',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '8–15 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell', 'rings'],
    scoring_type: 'time',
    description: 'Elizabeth combines Olympic lifting with gymnastics. Squat cleans demand technical efficiency, while ring dips test pressing strength. The pairing is brutal and addictive.',
    movements: [
      { name: 'Squat Cleans', reps: '21 – 15 – 9', rx_men: '135 lb', rx_women: '95 lb', tip: 'Full squat bottom; drive through heels' },
      { name: 'Ring Dips', reps: '21 – 15 – 9', tip: 'Full range; deep bottom position' }
    ],
    scoring_notes: 'Record your finish time. Under 10 min is strong. Sub-8 min is elite.',
    tips: ['Light cleans to start; save energy for dips', 'Ring dips get harder as you fatigue—break early', 'The 9s are a momentum builder']
  },

  {
    slug: 'eva',
    name: 'Eva',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '25–40 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['kettlebell', 'pullUpBar', 'running'],
    scoring_type: 'time',
    description: 'Eva is a high-volume conditioning piece with running, kettlebell swings, and pull-ups across five rounds. The 800m runs bookend each round, making this a true test of aerobic capacity.',
    movements: [
      { name: '800m Run', reps: '5 rounds', tip: 'Consistent pace throughout' },
      { name: 'Kettlebell Swings', reps: '30', rx_men: '2 pood (70 lb)', rx_women: '1.5 pood (53 lb)', tip: 'Explosive hip drive' },
      { name: 'Pull-Ups', reps: '30', tip: 'Kipping or strict' }
    ],
    scoring_notes: 'Record your finish time. Strong finishes are 30–35 min.',
    tips: ['Pace your runs—save energy for the middle rounds', 'KB swings and pull-ups are where you recover', 'The final round will test your mental toughness']
  },

  {
    slug: 'fran',
    name: 'Fran',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '2–8 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'pullUpBar'],
    scoring_type: 'time',
    description: 'Fran is the gateway benchmark. One of the shortest and most intense benchmark workouts, it teaches you to move fast under fatigue. Fast Fran splits separate the good from the great.',
    movements: [
      { name: 'Thrusters', reps: '21 – 15 – 9', rx_men: '95 lb', rx_women: '65 lb', tip: 'One fluid motion: dip, drive, press' },
      { name: 'Pull-Ups', reps: '21 – 15 – 9', tip: 'Kipping is allowed and encouraged' }
    ],
    scoring_notes: 'Record your finish time. Sub-3 min is elite. Sub-5 min is strong. Sub-8 min is a solid benchmark.',
    tips: ['Thrusters are where speed matters most', 'Kip your pull-ups early, don\'t save energy for later', 'Go hard—Fran is short!']
  },

  {
    slug: 'grace',
    name: 'Grace',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '2–8 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell'],
    scoring_type: 'time',
    description: 'Grace is 30 clean and jerks for time. It\'s pure barbell, pure speed. This benchmark separates technical lifters from those learning the movement. A fast Grace is a sign of elite strength-endurance.',
    movements: [
      { name: 'Clean and Jerks', reps: '30', rx_men: '135 lb', rx_women: '95 lb', tip: 'Efficient hip drive; split or power jerk as needed' }
    ],
    scoring_notes: 'Record your finish time. Sub-4 min is elite. Sub-6 min is strong.',
    tips: ['Find your rhythm and don\'t break it', 'Power through the 10-20 rep range', 'The last 10 are mental']
  },

  {
    slug: 'helen',
    name: 'Helen',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '12–20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['kettlebell', 'pullUpBar', 'running'],
    scoring_type: 'time',
    description: 'Helen is three rounds of running, kettlebell swings, and pull-ups. The 400m run bookends each round, testing both speed and strength endurance.',
    movements: [
      { name: '400m Run', reps: '3 rounds', tip: 'Consistent pace' },
      { name: 'Kettlebell Swings', reps: '21', rx_men: '1.5 pood (53 lb)', rx_women: '1 pood (35 lb)', tip: 'Explosive hip drive' },
      { name: 'Pull-Ups', reps: '12', tip: 'Kipping or strict' }
    ],
    scoring_notes: 'Record your finish time. Under 15 min is strong.',
    tips: ['Don\'t go all-out on the first run', 'Use KB swings as recovery', 'The last round determines your score']
  },

  {
    slug: 'isabel',
    name: 'Isabel',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '2–6 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell'],
    scoring_type: 'time',
    description: 'Isabel is 30 snatches for time. Pure barbell speed. This one rewards technical efficiency and consistent loading across all 30 reps.',
    movements: [
      { name: 'Snatches', reps: '30', rx_men: '135 lb', rx_women: '95 lb', tip: 'One explosive movement; full extension' }
    ],
    scoring_notes: 'Record your finish time. Sub-3 min is elite.',
    tips: ['Find your rhythm early', 'Technical efficiency matters more than raw strength', 'The final 10 reps are where speed separates athletes']
  },

  {
    slug: 'jackie',
    name: 'Jackie',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '8–15 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['rower', 'barbell', 'pullUpBar'],
    scoring_type: 'time',
    description: 'Jackie is a potent mix of rowing, thrusters, and pull-ups. The demanding pacing of the row affects everything that follows.',
    movements: [
      { name: '1000m Row', reps: '1', tip: 'Pace for the whole workout' },
      { name: 'Thrusters', reps: '50', rx_men: '45 lb', rx_women: '35 lb', tip: 'Pace your sets' },
      { name: 'Pull-Ups', reps: '30', tip: 'Consistent rhythm' }
    ],
    scoring_notes: 'Record your finish time. Under 12 min is strong.',
    tips: ['Don\'t go all-out on the row', 'Use thrusters to recover from the row', 'The pull-ups will feel heavy after thrusters']
  },

  {
    slug: 'karen',
    name: 'Karen',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '6–15 min',
    difficulty: 'intermediate',
    body_focus: 'legs',
    equipment: ['wallBall'],
    scoring_type: 'time',
    description: 'Karen is 150 wall balls for time. It\'s a simple, brutal test of lower body power and cardiovascular capacity. The 10-foot target keeps every rep honest.',
    movements: [
      { name: 'Wall Balls', reps: '150', rx_men: '20 lb to 10 ft', rx_women: '14 lb to 9 ft', tip: 'Consistent pace; full depth squat' }
    ],
    scoring_notes: 'Record your finish time. Under 10 min is strong.',
    tips: ['Pace yourself in sets of 20–30', 'Catch the ball in the squat—don\'t waste time at the top', 'The last 30 will burn']
  },

  {
    slug: 'kelly',
    name: 'Kelly',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '15–30 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['running', 'box', 'wallBall'],
    scoring_type: 'time',
    description: 'Kelly is five rounds of running, box jumps, and wall balls. The combination tests speed, explosive power, and lower body endurance.',
    movements: [
      { name: '400m Run', reps: '5 rounds', tip: 'Consistent pace' },
      { name: 'Box Jumps', reps: '30', rx_men: '24 in', rx_women: '20 in', tip: 'Full extension; land softly' },
      { name: 'Wall Balls', reps: '30', rx_men: '20 lb', rx_women: '14 lb', tip: 'Full depth' }
    ],
    scoring_notes: 'Record your finish time. Under 20 min is strong.',
    tips: ['Don\'t go all-out on the first run', 'Box jumps are your fastest movement', 'Wall balls are where you\'ll feel the volume']
  },

  {
    slug: 'linda',
    name: 'Linda',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '15–30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell'],
    scoring_type: 'time',
    description: 'Linda pairs three heavy barbell movements in descending reps. It\'s the ultimate test of strength endurance and technical proficiency under fatigue.',
    movements: [
      { name: 'Deadlifts', reps: '10–9–8–7–6–5–4–3–2–1', rx_men: '1.5x BW', rx_women: '1x BW', tip: 'Full extension' },
      { name: 'Bench Press', reps: '10–9–8–7–6–5–4–3–2–1', rx_men: '1x BW', rx_women: '0.75x BW', tip: 'Full range; chest touch required' },
      { name: 'Squat Cleans', reps: '10–9–8–7–6–5–4–3–2–1', rx_men: '0.75x BW', rx_women: '0.5x BW', tip: 'Full squat' }
    ],
    scoring_notes: 'Record your finish time. Under 20 min is strong.',
    tips: ['Start with moderate loads—you have a lot of volume ahead', 'Transitions between movements matter', 'The last few reps of each round test your mental game']
  },

  {
    slug: 'mary',
    name: 'Mary',
    category: 'girl',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'rounds_reps',
    description: 'Mary is a 20-minute AMRAP featuring handstand push-ups, pistols, and pull-ups. It\'s incredibly demanding, combining pure strength with flexibility and balance.',
    movements: [
      { name: 'Handstand Push-Ups', reps: '5', tip: 'Full range; chest to wall' },
      { name: 'Pistol Squats', reps: '10', tip: 'Full depth; arm extended for balance' },
      { name: 'Pull-Ups', reps: '15', tip: 'Kipping or strict' }
    ],
    scoring_notes: 'Score is total rounds + additional reps. 10+ rounds is very strong.',
    tips: ['HSPUs will limit you early', 'Pistols require patience and control', 'Pull-ups are your fastest movement']
  },

  {
    slug: 'nancy',
    name: 'Nancy',
    category: 'girl',
    format: 'For Time',
    duration_estimate: '15–25 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'running'],
    scoring_type: 'time',
    description: 'Nancy is five rounds of running and overhead squats. The 400m runs bookend each round, ensuring you stay in an elevated state throughout.',
    movements: [
      { name: '400m Run', reps: '5 rounds', tip: 'Consistent pace' },
      { name: 'Overhead Squats', reps: '15', rx_men: '95 lb', rx_women: '65 lb', tip: 'Full depth; arms locked' }
    ],
    scoring_notes: 'Record your finish time. Under 20 min is strong.',
    tips: ['The OHS weight should be light enough to unbroken', 'Use OHS as recovery from the run', 'Pacing the runs determines your score']
  },

  {
    slug: 'nicole',
    name: 'Nicole',
    category: 'girl',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'running'],
    scoring_type: 'rounds_reps',
    description: 'Nicole is a 20-minute AMRAP alternating between 400m runs and max pull-ups. Your pull-up reps decline each round as fatigue accumulates. It teaches pacing and mental resilience.',
    movements: [
      { name: '400m Run', reps: 'each round', tip: 'Steady pace' },
      { name: 'Pull-Ups', reps: 'max reps', tip: 'Record reps each round as they decline' }
    ],
    scoring_notes: 'Score is total pull-ups completed across all rounds. Typically 50–100+ total.',
    tips: ['Pace your runs evenly', 'Document pull-up reps each round to see the decline', 'The last few rounds will be mentally tough']
  },

  // ===== HERO WODs =====

  {
    slug: 'murph',
    name: 'Murph',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '30–60 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight', 'vest'],
    scoring_type: 'time',
    description: 'Murph is the most honored benchmark in CrossFit, named after Medal of Honor recipient Corporal Murphy. A mile run, 100 pull-ups, 200 push-ups, 300 air squats, another mile run. Partition as needed. Often done with a 20 lb vest (14 lb for women).',
    movements: [
      { name: '1 Mile Run', reps: '1', tip: 'Steady pace' },
      { name: 'Pull-Ups', reps: '100', tip: 'Partition any way; 5–10 at a time is common' },
      { name: 'Push-Ups', reps: '200', tip: 'Partition any way' },
      { name: 'Air Squats', reps: '300', tip: 'Full depth; partition as needed' },
      { name: '1 Mile Run', reps: '1', tip: 'Pace similar to first mile' }
    ],
    scoring_notes: 'Record your finish time. Elite times are under 35 min. Most complete in 40–60 min.',
    tips: ['Partition the gymnastics—don\'t try to unbroken 100+ pull-ups', 'The second mile will be mentally brutal', 'Use equal partitions (10 PU, 20 PU, 30 SQ per round) for consistency']
  },

  {
    slug: 'dt',
    name: 'DT',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '15–30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell'],
    scoring_type: 'time',
    description: 'DT is five rounds of deadlifts, hang power cleans, and push jerks. Each round demands speed and technical proficiency with the barbell.',
    movements: [
      { name: 'Deadlifts', reps: '12', rx_men: '155 lb', rx_women: '105 lb', tip: 'Full extension; drive through heels' },
      { name: 'Hang Power Cleans', reps: '9', rx_men: '155 lb', rx_women: '105 lb', tip: 'Explosive hip drive' },
      { name: 'Push Jerks', reps: '6', rx_men: '155 lb', rx_women: '105 lb', tip: 'Aggressive dip and drive' }
    ],
    scoring_notes: 'Record your finish time. Sub-20 min is strong.',
    tips: ['Same weight for all three movements', 'The 5–3–2 rep scheme allows for speed', 'Transitions between movements matter']
  },

  {
    slug: 'danny',
    name: 'Danny',
    category: 'hero',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['box', 'barbell', 'pullUpBar'],
    scoring_type: 'rounds_reps',
    description: 'Danny is 20 minutes of box jumps, push press, and pull-ups. A true test of sustained power across different movement patterns.',
    movements: [
      { name: 'Box Jumps', reps: '30', rx_men: '24 in', rx_women: '20 in', tip: 'Full extension' },
      { name: 'Push Press', reps: '20', rx_men: '115 lb', rx_women: '75 lb', tip: 'Aggressive dip and drive' },
      { name: 'Pull-Ups', reps: '30', tip: 'Kipping or strict' }
    ],
    scoring_notes: 'Score is total rounds + additional reps. 10+ rounds is strong.',
    tips: ['Box jumps are fast—use them as your tempo setter', 'Push press weight should be manageable for 20 unbroken', 'Pull-ups are your recovery movement']
  },

  {
    slug: 'daniel',
    name: 'Daniel',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '20–35 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'barbell', 'running'],
    scoring_type: 'time',
    description: 'Daniel is a long triplet that tests overall fitness: pull-ups, running, thrusters, repeat. The movement variety and volume make this a true test.',
    movements: [
      { name: 'Pull-Ups', reps: '50', tip: 'Pace for the entire workout' },
      { name: '400m Run', reps: '1', tip: 'Steady pace' },
      { name: 'Thrusters', reps: '21', rx_men: '95 lb', rx_women: '65 lb', tip: 'Unbroken if possible' },
      { name: '800m Run', reps: '1', tip: 'Second run—pace matters' },
      { name: 'Thrusters', reps: '21', rx_men: '95 lb', rx_women: '65 lb', tip: 'Don\'t drop the bar' },
      { name: '400m Run', reps: '1', tip: 'Final sprint' },
      { name: 'Pull-Ups', reps: '50', tip: 'These will feel heavy' }
    ],
    scoring_notes: 'Record your finish time. Sub-25 min is strong.',
    tips: ['Front-load pull-ups when you\'re fresh', 'Pace the middle run carefully', 'The final 50 pull-ups are mental']
  },

  {
    slug: 'jt',
    name: 'JT',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '12–20 min',
    difficulty: 'advanced',
    body_focus: 'upper-body',
    equipment: ['bodyweight', 'rings'],
    scoring_type: 'time',
    description: 'JT is a gymnastics grinder: three rounds of handstand push-ups, ring dips, and push-ups in decreasing reps.',
    movements: [
      { name: 'Handstand Push-Ups', reps: '21 – 15 – 9', tip: 'Full range; chest to wall' },
      { name: 'Ring Dips', reps: '21 – 15 – 9', tip: 'Deep bottom; rings in tight' },
      { name: 'Push-Ups', reps: '21 – 15 – 9', tip: 'Chest to deck' }
    ],
    scoring_notes: 'Record your finish time. Sub-15 min is strong.',
    tips: ['HSPUs set the pace', 'Ring dips fatigue shoulders early', 'Push-ups are where you can make up time']
  },

  {
    slug: 'nate',
    name: 'Nate',
    category: 'hero',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['kettlebell', 'rings'],
    scoring_type: 'rounds_reps',
    description: 'Nate is a 20-minute AMRAP requiring high-level gymnastics and explosive strength. Muscle-ups and heavy kettlebell swings paired with handstand push-ups.',
    movements: [
      { name: 'Muscle-Ups', reps: '2', tip: 'Strict or kipping' },
      { name: 'Handstand Push-Ups', reps: '4', tip: 'Full range' },
      { name: 'Kettlebell Swings', reps: '8', rx_men: '2 pood (70 lb)', rx_women: '1.5 pood (53 lb)', tip: 'Explosive hip drive' }
    ],
    scoring_notes: 'Score is total rounds + additional reps. 5+ rounds is strong.',
    tips: ['Muscle-ups will limit your volume early', 'HSPU placement matters for consistency', 'KB swings are your fastest movement']
  },

  {
    slug: 'the_seven',
    name: 'The Seven',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '15–30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['bodyweight', 'barbell', 'kettlebell', 'pullUpBar'],
    scoring_type: 'time',
    description: 'The Seven is seven rounds of seven different movements, seven reps each. A comprehensive test of gymnastics, strength, and conditioning.',
    movements: [
      { name: 'Handstand Push-Ups', reps: '7 each round', tip: 'Full range' },
      { name: 'Thrusters', reps: '7 each round', rx_men: '135 lb', rx_women: '95 lb', tip: 'Explosive drive' },
      { name: 'Knees-to-Elbows', reps: '7 each round', tip: 'Full range; control the swing' },
      { name: 'Deadlifts', reps: '7 each round', rx_men: '245 lb', rx_women: '165 lb', tip: 'Full extension' },
      { name: 'Burpees', reps: '7 each round', tip: 'Chest to deck; full jump' },
      { name: 'Kettlebell Swings', reps: '7 each round', rx_men: '2 pood (70 lb)', rx_women: '1.5 pood (53 lb)', tip: 'Hip drive' },
      { name: 'Pull-Ups', reps: '7 each round', tip: 'Chin above bar' }
    ],
    scoring_notes: 'Record your finish time. Sub-20 min is strong.',
    tips: ['The opening HSPU sets the pace for each round', 'Seven heavy deadlifts will feel heavy as you fatigue', 'The last round is where grit matters']
  },

  {
    slug: 'badger',
    name: 'Badger',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '20–35 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'pullUpBar', 'running'],
    scoring_type: 'time',
    description: 'Badger is three rounds of squat cleans, pull-ups, and running. The combination tests strength, endurance, and the ability to recover between demanding rounds.',
    movements: [
      { name: 'Squat Cleans', reps: '30', rx_men: '95 lb', rx_women: '65 lb', tip: 'Full squat bottom' },
      { name: 'Pull-Ups', reps: '30', tip: 'Kipping or strict' },
      { name: '800m Run', reps: '3 rounds', tip: 'Steady pace' }
    ],
    scoring_notes: 'Record your finish time. Sub-25 min is strong.',
    tips: ['The squat cleans pace the workout', 'Pull-ups are your recovery', 'Save energy for the final run']
  },

  {
    slug: 'whitten',
    name: 'Whitten',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '20–35 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['kettlebell', 'box', 'wallBall'],
    scoring_type: 'time',
    description: 'Whitten is five rounds of kettlebell swings, box jumps, running, burpees, and wall balls. A complete conditioning test.',
    movements: [
      { name: 'Kettlebell Swings', reps: '22', rx_men: '1.5 pood (53 lb)', rx_women: '1 pood (35 lb)', tip: 'Hip drive' },
      { name: 'Box Jumps', reps: '22', rx_men: '24 in', rx_women: '20 in', tip: 'Full extension' },
      { name: '400m Run', reps: '5 rounds', tip: 'Consistent pace' },
      { name: 'Burpees', reps: '22', tip: 'Chest to deck; full jump' },
      { name: 'Wall Balls', reps: '22', rx_men: '20 lb', rx_women: '14 lb', tip: 'Full depth' }
    ],
    scoring_notes: 'Record your finish time. Sub-30 min is strong.',
    tips: ['The runs should be steady and repeatable', 'Burpees will test your will', 'Save some legs for the final wall balls']
  },

  {
    slug: 'tommy_v',
    name: 'Tommy V',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '12–20 min',
    difficulty: 'advanced',
    body_focus: 'upper-body',
    equipment: ['barbell', 'rope'],
    scoring_type: 'time',
    description: 'Tommy V pairs thrusters with rope climbs in a descending ladder. The rope climbs become increasingly difficult as fatigue sets in.',
    movements: [
      { name: 'Thrusters', reps: '21 – 15 – 9', rx_men: '115 lb', rx_women: '80 lb', tip: 'Aggressive drive' },
      { name: 'Rope Climbs', reps: '21 – 15 – 9', tip: '15 ft per climb' }
    ],
    scoring_notes: 'Record your finish time. Sub-15 min is strong.',
    tips: ['Rope climbs will slow you—practice the footlock', 'Light thrusters allow rope focus', 'The 9s are a momentum builder']
  },

  {
    slug: 'wittman',
    name: 'Wittman',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '20–35 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['kettlebell', 'pullUpBar', 'box'],
    scoring_type: 'time',
    description: 'Wittman is seven rounds of kettlebell swings, pull-ups, and box jumps. The seven-round structure demands consistency and pacing.',
    movements: [
      { name: 'Kettlebell Swings', reps: '15', rx_men: '1.5 pood (53 lb)', rx_women: '1 pood (35 lb)', tip: 'Hip drive' },
      { name: 'Pull-Ups', reps: '15', tip: 'Steady sets' },
      { name: 'Box Jumps', reps: '15', rx_men: '24 in', rx_women: '20 in', tip: 'Full extension' }
    ],
    scoring_notes: 'Record your finish time. Sub-25 min is strong.',
    tips: ['Consistency is key across all seven rounds', 'Pull-ups fatigue shoulders early', 'Box jumps should stay fast throughout']
  },

  {
    slug: 'ryan',
    name: 'Ryan',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '10–20 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['rings', 'bodyweight'],
    scoring_type: 'time',
    description: 'Ryan is five rounds of muscle-ups and burpees. Simple, brutal, and demands high-level gymnastics and cardiovascular fitness.',
    movements: [
      { name: 'Muscle-Ups', reps: '7', tip: 'Strict or kipping—find your rhythm' },
      { name: 'Burpees', reps: '21', tip: 'Chest to deck; full jump' }
    ],
    scoring_notes: 'Record your finish time. Sub-15 min is strong.',
    tips: ['Pace muscle-ups carefully', 'Burpees are your cardio', 'The final round will test your mental game']
  },

  {
    slug: 'brad',
    name: 'Brad',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '10–20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['running', 'pullUpBar', 'bodyweight'],
    scoring_type: 'time',
    description: 'Brad is ten rounds of 100m sprints, pull-ups, and burpees. Short sprints combined with gymnastics create an intense finisher.',
    movements: [
      { name: '100m Sprint', reps: '10 rounds', tip: 'All-out pace' },
      { name: 'Pull-Ups', reps: '10', tip: 'Fast sets' },
      { name: 'Burpees', reps: '10', tip: 'Chest to deck; full jump' }
    ],
    scoring_notes: 'Record your finish time. Sub-15 min is strong.',
    tips: ['The 100m sprints set the pace—go hard', 'Use pull-ups and burpees as recovery', 'The final round separates the fit from the tired']
  },

  {
    slug: 'bull',
    name: 'Bull',
    category: 'hero',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'box', 'kettlebell'],
    scoring_type: 'rounds_reps',
    description: 'Bull is 20 minutes of overhead squats, knees-to-elbows, box jumps, and kettlebell swings. A comprehensive test of strength, gymnastics, and conditioning.',
    movements: [
      { name: 'Overhead Squats', reps: '10', rx_men: '65 lb', rx_women: '45 lb', tip: 'Arms locked; full depth' },
      { name: 'Knees-to-Elbows', reps: '10', tip: 'Control the swing' },
      { name: 'Box Jumps', reps: '10', rx_men: '24 in', rx_women: '20 in', tip: 'Full extension' },
      { name: 'Kettlebell Swings', reps: '10', rx_men: '1.5 pood (53 lb)', rx_women: '1 pood (35 lb)', tip: 'Hip drive' }
    ],
    scoring_notes: 'Score is total rounds + additional reps. 8+ rounds is strong.',
    tips: ['OHS will limit your volume', 'Use faster movements for recovery', 'Pace is consistent across all rounds']
  },

  {
    slug: 'coe',
    name: 'Coe',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '8–15 min',
    difficulty: 'advanced',
    body_focus: 'upper-body',
    equipment: ['rings', 'barbell'],
    scoring_type: 'time',
    description: 'Coe is a 1-2-3-4-5-6-7-8-9-10 ladder of ring dips and thrusters. The volume accumulates quickly.',
    movements: [
      { name: 'Ring Dips', reps: '1–10 (ascending)', tip: 'Deep bottom; controlled pace' },
      { name: 'Thrusters', reps: '1–10 (ascending)', rx_men: '95 lb', rx_women: '65 lb', tip: 'Explosive drive' }
    ],
    scoring_notes: 'Record your finish time. Sub-12 min is strong.',
    tips: ['Ring dips get harder as you fatigue', 'Pace the thrusters for unbroken sets', 'The 8-9-10 rounds will burn']
  },

  {
    slug: 'blake',
    name: 'Blake',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '20–35 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['rower', 'rings', 'wallBall'],
    scoring_type: 'time',
    description: 'Blake is four rounds of rowing, burpee muscle-ups, and wall balls. Each round demands significant output.',
    movements: [
      { name: '1000m Row', reps: '4 rounds', tip: 'Consistent pace' },
      { name: 'Burpee Muscle-Ups', reps: '10', tip: 'Explosive power' },
      { name: 'Wall Balls', reps: '20', rx_men: '20 lb', rx_women: '14 lb', tip: 'Full depth' }
    ],
    scoring_notes: 'Record your finish time. Sub-30 min is strong.',
    tips: ['Row at a steady pace', 'Burpee MUs will slow you—practice the entry', 'Wall balls are where you recover']
  },

  {
    slug: 'michael',
    name: 'Michael',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '20–35 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['running', 'bodyweight'],
    scoring_type: 'time',
    description: 'Michael is three rounds of running, back extensions, and sit-ups. A true test of aerobic capacity and core endurance.',
    movements: [
      { name: '800m Run', reps: '3 rounds', tip: 'Steady pace' },
      { name: 'Back Extensions', reps: '50', tip: 'Full range; controlled pace' },
      { name: 'Sit-Ups', reps: '50', tip: 'Full range; feet anchored' }
    ],
    scoring_notes: 'Record your finish time. Sub-25 min is strong.',
    tips: ['Pace your runs evenly', 'Back extensions and sit-ups are recovery from running', 'The final round tests your will']
  },

  {
    slug: 'josh',
    name: 'Josh',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '10–20 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell', 'pullUpBar'],
    scoring_type: 'time',
    description: 'Josh is three rounds of overhead squats and pull-ups in a 21-15-9 format. Heavy OHS combined with gymnastics.',
    movements: [
      { name: 'Overhead Squats', reps: '21 – 15 – 9', rx_men: '95 lb', rx_women: '65 lb', tip: 'Full depth; arms locked' },
      { name: 'Pull-Ups', reps: '21 – 15 – 9', tip: 'Kipping or strict' }
    ],
    scoring_notes: 'Record your finish time. Sub-15 min is strong.',
    tips: ['OHS weight should be manageable for 21 unbroken', 'Pace pull-ups consistently', 'The 9s are a momentum builder']
  },

  {
    slug: 'luce',
    name: 'Luce',
    category: 'hero',
    format: 'For Time',
    duration_estimate: '15–30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['rings', 'barbell', 'pullUpBar'],
    scoring_type: 'time',
    description: 'Luce is three rounds of muscle-ups, thrusters, pull-ups, and handstand push-ups. A comprehensive test of advanced gymnastics and strength.',
    movements: [
      { name: 'Muscle-Ups', reps: '10', tip: 'Consistent pace' },
      { name: 'Thrusters', reps: '15', rx_men: '135 lb', rx_women: '95 lb', tip: 'Explosive drive' },
      { name: 'Pull-Ups', reps: '15', tip: 'Fast sets' },
      { name: 'Handstand Push-Ups', reps: '15', tip: 'Full range' }
    ],
    scoring_notes: 'Record your finish time. Sub-20 min is strong.',
    tips: ['Muscle-ups set the pace for each round', 'Thrusters are your recovery from MUs', 'HSPUs will test shoulders late']
  },

  {
    slug: 'spealler',
    name: 'Spealler',
    category: 'hero',
    format: 'AMRAP',
    duration_estimate: '10 min',
    difficulty: 'advanced',
    body_focus: 'upper-body',
    equipment: ['rope', 'bodyweight', 'kettlebell'],
    scoring_type: 'rounds_reps',
    description: 'Spealler is 10 minutes of rope climbs, handstand push-ups, and kettlebell swings. Short, intense, and demands high-level gymnastics.',
    movements: [
      { name: 'Rope Climbs', reps: '2', tip: '15 ft per climb' },
      { name: 'Handstand Push-Ups', reps: '4', tip: 'Full range' },
      { name: 'Kettlebell Swings', reps: '8', rx_men: '2 pood (70 lb)', rx_women: '1.5 pood (53 lb)', tip: 'Hip drive' }
    ],
    scoring_notes: 'Score is total rounds + additional reps. 5+ rounds is strong.',
    tips: ['Rope climbs are your limiter', 'HSPU consistency matters', 'KB swings are fast recovery']
  },

  // ===== OTHER BENCHMARKS =====

  {
    slug: 'fight_gone_bad',
    name: 'Fight Gone Bad',
    category: 'benchmark',
    format: 'Circuit',
    duration_estimate: '18 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['wallBall', 'barbell', 'box', 'rower'],
    scoring_type: 'total_reps',
    description: 'Fight Gone Bad is three rounds of five 1-minute stations with 1 minute rest between rounds. Each station demands maximum output. Total reps across all stations is your score.',
    movements: [
      { name: 'Wall Balls', reps: '1 min max', rx_men: '20 lb to 10 ft', rx_women: '14 lb to 9 ft', tip: 'Unbroken sets' },
      { name: 'Sumo Deadlift High Pulls', reps: '1 min max', rx_men: '75 lb', rx_women: '55 lb', tip: 'Explosive hip drive' },
      { name: 'Box Jumps', reps: '1 min max', rx_men: '20 in', rx_women: '20 in', tip: 'Quick feet' },
      { name: 'Push Press', reps: '1 min max', rx_men: '75 lb', rx_women: '55 lb', tip: 'Full extension' },
      { name: 'Row for Calories', reps: '1 min max', tip: 'Steady pace' }
    ],
    scoring_notes: 'Score is total reps across all 15 stations. 300+ is strong.',
    tips: ['Pace each station to hit 18–22 reps', 'The row is your recovery station', 'Consistency across stations matters more than any single peak']
  },

  {
    slug: 'filthy_fifty',
    name: 'Filthy Fifty',
    category: 'benchmark',
    format: 'For Time',
    duration_estimate: '35–60 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['box', 'pullUpBar', 'kettlebell', 'barbell', 'wallBall', 'jumpRope'],
    scoring_type: 'time',
    description: 'Filthy Fifty is 50 reps each of 10 different movements for time. The variety makes this an ultimate test of overall fitness.',
    movements: [
      { name: 'Box Jumps', reps: '50', rx_men: '24 in', rx_women: '20 in', tip: 'Fast feet' },
      { name: 'Jumping Pull-Ups', reps: '50', tip: 'Full range' },
      { name: 'Kettlebell Swings', reps: '50', rx_men: '1 pood (35 lb)', rx_women: '0.75 pood (26 lb)', tip: 'Hip drive' },
      { name: 'Walking Lunges', reps: '50', tip: 'Full range each leg' },
      { name: 'Knees-to-Elbows', reps: '50', tip: 'Control the swing' },
      { name: 'Push Press', reps: '50', rx_men: '45 lb', rx_women: '35 lb', tip: 'Full extension' },
      { name: 'Back Extensions', reps: '50', tip: 'Full range' },
      { name: 'Wall Balls', reps: '50', rx_men: '20 lb', rx_women: '14 lb', tip: 'Full depth' },
      { name: 'Burpees', reps: '50', tip: 'Chest to deck; full jump' },
      { name: 'Double-Unders', reps: '50', tip: 'Consistent rhythm' }
    ],
    scoring_notes: 'Record your finish time. Sub-45 min is strong.',
    tips: ['Break movements into manageable sets', 'Don\'t go all-out on the box jumps', 'The wall balls will test your resolve']
  },

  {
    slug: 'the_chief',
    name: 'The Chief',
    category: 'benchmark',
    format: 'Other',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'bodyweight'],
    scoring_type: 'rounds_reps',
    description: 'The Chief is 5 rounds of 3-minute AMRAPs with 1 minute rest between rounds. Each round tests max output on power cleans, push-ups, and air squats.',
    movements: [
      { name: 'Power Cleans', reps: '3 per AMRAP', rx_men: '135 lb', rx_women: '95 lb', tip: 'Explosive hip drive' },
      { name: 'Push-Ups', reps: '6 per AMRAP', tip: 'Chest to deck' },
      { name: 'Air Squats', reps: '9 per AMRAP', tip: 'Full depth' }
    ],
    scoring_notes: 'Score is total rounds completed across all 5 AMRAPs. 10+ rounds is strong.',
    tips: ['Each round is a sprint—go hard', 'Pacing matters—you get another round next AMRAP', 'The final AMRAP separates the fit from the tired']
  },

  {
    slug: 'amanda',
    name: 'Amanda',
    category: 'benchmark',
    format: 'For Time',
    duration_estimate: '8–15 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['rings', 'barbell'],
    scoring_type: 'time',
    description: 'Amanda pairs muscle-ups with squat snatches in a 9-7-5 format. Heavy snatches combined with demanding gymnastics.',
    movements: [
      { name: 'Muscle-Ups', reps: '9 – 7 – 5', tip: 'Consistent pace' },
      { name: 'Squat Snatches', reps: '9 – 7 – 5', rx_men: '135 lb', rx_women: '95 lb', tip: 'Full squat bottom' }
    ],
    scoring_notes: 'Record your finish time. Sub-12 min is strong.',
    tips: ['Pace muscle-ups for sustainability', 'Snatch weight should allow unbroken sets', 'The 5s are a momentum builder']
  },

  {
    slug: 'randy',
    name: 'Randy',
    category: 'benchmark',
    format: 'For Time',
    duration_estimate: '5–12 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell'],
    scoring_type: 'time',
    description: 'Randy is 75 power snatches for time. One movement, high volume, tests strength endurance and speed.',
    movements: [
      { name: 'Power Snatches', reps: '75', rx_men: '75 lb', rx_women: '55 lb', tip: 'Explosive hip drive; one continuous motion' }
    ],
    scoring_notes: 'Record your finish time. Sub-8 min is strong.',
    tips: ['Light weight allows speed', 'Pace in sets of 10–15', 'The final 20 reps test your mental toughness']
  },

  {
    slug: 'king_kong',
    name: 'King Kong',
    category: 'benchmark',
    format: 'For Time',
    duration_estimate: '15–30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['barbell', 'rings'],
    scoring_type: 'time',
    description: 'King Kong is three rounds of one heavy deadlift, two muscle-ups, three squat cleans, and four handstand push-ups. Demanding volume with heavy weight.',
    movements: [
      { name: 'Deadlift', reps: '1', rx_men: '455 lb', rx_women: '325 lb', tip: 'Full extension' },
      { name: 'Muscle-Ups', reps: '2', tip: 'Strict or kipping' },
      { name: 'Squat Cleans', reps: '3', rx_men: '250 lb', rx_women: '175 lb', tip: 'Full squat' },
      { name: 'Handstand Push-Ups', reps: '4', tip: 'Full range' }
    ],
    scoring_notes: 'Record your finish time. Sub-20 min is strong.',
    tips: ['The heavy deadlift sets the tone', 'Muscle-ups will fatigue shoulders', 'HSPUs require focus and strength']
  },

  {
    slug: 'kalsu',
    name: 'Kalsu',
    category: 'benchmark',
    format: 'AMRAP',
    duration_estimate: '15 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'bodyweight'],
    scoring_type: 'total_reps',
    description: 'Kalsu is 15 minutes where, at the start of every minute, you must complete 5 thrusters, then max burpees for the remainder. Total reps (thrusters + burpees) is your score.',
    movements: [
      { name: 'Thrusters', reps: '5 per minute', rx_men: '135 lb', rx_women: '95 lb', tip: 'Quick sets' },
      { name: 'Burpees', reps: 'max per minute', tip: 'Chest to deck; full jump' }
    ],
    scoring_notes: 'Score is total reps (thrusters + burpees). 200+ is strong.',
    tips: ['The 5 thrusters must be unbroken', 'Max effort on burpees each minute', 'Pacing the thrusters allows more burpee time']
  },

  {
    slug: 'tabata_something_else',
    name: 'Tabata Something Else',
    category: 'benchmark',
    format: 'Other',
    duration_estimate: '16 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'total_reps',
    description: 'Tabata Something Else is 32 intervals (8 each) of 20 seconds work / 10 seconds rest cycling through pull-ups, push-ups, sit-ups, and air squats.',
    movements: [
      { name: 'Pull-Ups', reps: '8 intervals', tip: 'Max reps each interval' },
      { name: 'Push-Ups', reps: '8 intervals', tip: 'Full range' },
      { name: 'Sit-Ups', reps: '8 intervals', tip: 'Full range' },
      { name: 'Air Squats', reps: '8 intervals', tip: 'Full depth' }
    ],
    scoring_notes: 'Score is total reps across all 32 intervals. 200+ is strong.',
    tips: ['Go all-out each 20-second interval', 'The rest is your opportunity to recover', 'Total reps decline as fatigue accumulates']
  },

  {
    slug: 'annie_vs_ghost',
    name: 'Annie vs. The Ghost',
    category: 'benchmark',
    format: 'EMOM',
    duration_estimate: '30 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['rower', 'bodyweight'],
    scoring_type: 'rounds_reps',
    description: 'The Ghost is a 30-minute EMOM alternating between 20 calorie rows and 20 burpees each minute. A grinder that tests both aerobic capacity and mental toughness.',
    movements: [
      { name: 'Row for Calories', reps: '20 cal', tip: 'Steady pace' },
      { name: 'Burpees', reps: '20', tip: 'Chest to deck; full jump' }
    ],
    scoring_notes: 'Score is total rounds completed in 30 minutes. 15+ complete rounds is strong.',
    tips: ['Pace the rows to finish in 40–45 seconds', 'If you can\'t complete a round, that\'s your stopping point', 'Consistency matters more than any single peak']
  },

  {
    slug: 'hope',
    name: 'Hope',
    category: 'benchmark',
    format: 'Circuit',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'box', 'pullUpBar'],
    scoring_type: 'total_reps',
    description: 'Hope is 3 rounds of 4 different 1-minute max effort stations with 1 minute rest between rounds. Total reps across all stations is your score.',
    movements: [
      { name: 'Power Snatches', reps: '1 min max', rx_men: '75 lb', rx_women: '55 lb', tip: 'Explosive hip drive' },
      { name: 'Box Jumps', reps: '1 min max', rx_men: '24 in', rx_women: '20 in', tip: 'Quick feet' },
      { name: 'Thrusters', reps: '1 min max', rx_men: '75 lb', rx_women: '55 lb', tip: 'Explosive drive' },
      { name: 'Chest-to-Bar Pull-Ups', reps: '1 min max', tip: 'Chest above bar' }
    ],
    scoring_notes: 'Score is total reps across all 12 stations. 300+ is strong.',
    tips: ['Pace each station for 20–25 reps', 'Each movement has a different feel', 'Consistency across stations matters']
  },

  {
    slug: 'grettel',
    name: 'Grettel',
    category: 'benchmark',
    format: 'For Time',
    duration_estimate: '10–20 min',
    difficulty: 'advanced',
    body_focus: 'upper-body',
    equipment: ['rings'],
    scoring_type: 'time',
    description: 'Grettel is 30 muscle-ups for time. Pure gymnastics, pure difficulty. A true test of upper body strength and stamina.',
    movements: [
      { name: 'Muscle-Ups', reps: '30', tip: 'Strict or kipping; find your rhythm' }
    ],
    scoring_notes: 'Record your finish time. Sub-15 min is strong.',
    tips: ['Pace muscle-ups in sustainable sets', 'The 20–30 rep range is where grit matters', 'Consistent technique throughout is key']
  },

  {
    slug: 'lynn',
    name: 'Lynn',
    category: 'benchmark',
    format: 'AMRAP',
    duration_estimate: '20 min',
    difficulty: 'intermediate',
    body_focus: 'full-body',
    equipment: ['barbell', 'pullUpBar'],
    scoring_type: 'rounds_reps',
    description: 'Lynn is 20 minutes of bodyweight deadlifts and pull-ups. Heavy deadlifts combined with gymnastic pull-ups test strength endurance.',
    movements: [
      { name: 'Deadlifts', reps: '5', rx_men: 'bodyweight', rx_women: 'bodyweight', tip: 'Full extension' },
      { name: 'Pull-Ups', reps: '10', tip: 'Kipping or strict' }
    ],
    scoring_notes: 'Score is total rounds + additional reps. 20+ rounds is strong.',
    tips: ['Pace deadlifts early', 'Pull-ups are your recovery', 'Consistency matters across the entire 20 minutes']
  },

  {
    slug: 'chelsea_challenge',
    name: 'Chelsea Challenge',
    category: 'benchmark',
    format: 'EMOM',
    duration_estimate: '30 min',
    difficulty: 'advanced',
    body_focus: 'full-body',
    equipment: ['pullUpBar', 'bodyweight'],
    scoring_type: 'rounds_reps',
    description: 'Chelsea Challenge: Can you complete Chelsea? (EMOM 30 min: 5 pull-ups, 10 push-ups, 15 air squats). All 30 rounds unbroken?',
    movements: [
      { name: 'Pull-Ups', reps: '5 per round', tip: 'Kipping or strict' },
      { name: 'Push-Ups', reps: '10 per round', tip: 'Full range' },
      { name: 'Air Squats', reps: '15 per round', tip: 'Full depth' }
    ],
    scoring_notes: 'Score is rounds completed out of 30. All 30 rounds is elite.',
    tips: ['Aim for 20–25 seconds of work per round', 'Consistency is more important than speed', 'The final 5 rounds will test your mental game']
  },

  {
    slug: 'death_by_pullups',
    name: 'Death by Pull-Ups',
    category: 'benchmark',
    format: 'Other',
    duration_estimate: '5–15 min',
    difficulty: 'intermediate',
    body_focus: 'upper-body',
    equipment: ['pullUpBar'],
    scoring_type: 'rounds_reps',
    description: 'Death by Pull-Ups: EMOM, minute 1 do 1 pull-up, minute 2 do 2 pull-ups, minute 3 do 3, etc., until you fail to complete the reps within the minute.',
    movements: [
      { name: 'Pull-Ups', reps: '1, 2, 3, 4, ... until failure', tip: 'Kipping or strict; find your rhythm' }
    ],
    scoring_notes: 'Score is the minute you fail to complete. Lasting 10+ minutes is strong.',
    tips: ['Start conservatively', 'Break early to avoid failure', 'You\'ll hit a wall when single-digit numbers become impossible']
  }
];
