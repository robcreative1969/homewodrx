-- HomeWODRx data cleanup, approved by Rob 2026-11-20 (Claude made the open calls at his request).
-- Matches review/data-cleanup-draft.md item by item. Built from snapshots taken 2026-10-05.
-- Every update targets one row by slug. Text uses dollar quoting ($$...$$).
-- jsonb values are written out in full rather than patched.

begin;

-- Guard: stop (and change nothing) if a column type is not what this script assumes.
do $guard$
declare
  bad text;
begin
  select string_agg(c.table_name || '.' || c.column_name || ' is ' || c.data_type, '; ') into bad
  from information_schema.columns c
  join (values
    ('benchmark_workouts','tips','ARRAY'), ('benchmark_workouts','coaching_tips','ARRAY'),
    ('benchmark_workouts','faqs','jsonb'), ('benchmark_workouts','movements','jsonb'),
    ('movements','beginner_reps','jsonb'), ('movements','intermediate_reps','jsonb'), ('movements','advanced_reps','jsonb'),
    ('movements','common_faults','text'), ('movements','daily_wod_eligible','boolean'),
    ('stretches','focus','ARRAY')
  ) as want(t, col, typ) on c.table_name = want.t and c.column_name = want.col
  where c.table_schema = 'public' and c.data_type <> want.typ;
  if bad is not null then
    raise exception 'Column types differ from what this script assumes: %', bad;
  end if;
end
$guard$;


-- ═══ Item 1: Fran: four different targets on one page ═══

-- Item 1: Fran
update public.benchmark_workouts set
  coaching_tips = array[
    $$Break thrusters early — sets of 7-7-7 or 8-7-6 beat going unbroken and blowing up.$$,
    $$Cycle the barbell directly from the front squat bottom position into the push press — no pause at the rack.$$,
    $$On the pull-up bar, butterfly or kipping is fastest. If you only have strict, reduce reps.$$,
    $$Breathe out on the press. The thruster is a full exhale at the top.$$
  ]::text[],
  faqs = $$[
    {
      "answer": "Fran is a classic benchmark workout consisting of 21-15-9 reps of thrusters (95/65 lb) and pull-ups, done as fast as possible. It is one of the most widely used fitness tests in the world and a staple of functional fitness programs.",
      "question": "What is Fran in fitness?"
    },
    {
      "answer": "Sub-3 min is elite. Sub-5 min is strong. Sub-8 min is a solid benchmark.",
      "question": "What is a good Fran time?"
    },
    {
      "answer": "Rx weight for Fran is 95 lb (43 kg) for men and 65 lb (29 kg) for women on the barbell thrusters. Beginners typically scale to 45–65 lb for men or 35–45 lb for women.",
      "question": "How heavy is Fran?"
    },
    {
      "answer": "Scale Fran by reducing the barbell weight, switching to jumping pull-ups or ring rows, or reducing the rep scheme to 15-10-5. The key is to maintain intensity — you should be moving near-continuously throughout.",
      "question": "How do I scale Fran?"
    },
    {
      "answer": "Fran became famous because it combines two fundamental movements — a squat-to-press (thruster) and a pull — into the most potent short-duration test of total-body fitness. It is painful, simple to score, and endlessly comparable across athletes.",
      "question": "Why is Fran so famous?"
    }
  ]$$::jsonb,
  scaling_notes = $$Beginners: Use a PVC pipe or empty barbell (15–35 lb) for thrusters. Sub ring rows or jumping pull-ups for kipping pull-ups. Reduce reps to 15-10-5 if needed. Scale so you can move continuously.$$,
  updated_at = now()
where slug = 'fran';

-- ═══ Item 2: Murph: wrong rank in the About text; targets and time cap disagree ═══

-- Item 2: Murph
update public.benchmark_workouts set
  description = $$Murph is the most honored benchmark in CrossFit, named after Medal of Honor recipient Navy Lieutenant Michael Murphy. A mile run, 100 pull-ups, 200 push-ups, 300 air squats, another mile run. Partition as needed. Often done with a 20 lb vest (14 lb for women).$$,
  scoring_notes = $$Your score is your finish time. Sub-35 min is elite. Most athletes finish in 40–60 min.$$,
  faqs = $$[
    {
      "answer": "Murph is a hero workout consisting of a 1-mile run, 100 pull-ups, 200 push-ups, 300 air squats, and another 1-mile run — all done wearing a 20 lb weight vest (Rx). It is named after Navy Lieutenant Michael Murphy, who was killed in action in Afghanistan in 2005.",
      "question": "What is the Murph workout?"
    },
    {
      "answer": "Sub-35 min is elite. Most athletes finish in 40–60 min.",
      "question": "How long does Murph take?"
    },
    {
      "answer": "The Rx standard calls for a 20 lb weight vest, but it is common and perfectly acceptable to do Murph without a vest, especially for beginners or athletes focusing on completing the full volume.",
      "question": "Do you have to wear a vest for Murph?"
    },
    {
      "answer": "Yes. The most popular partition is 20 rounds of 5 pull-ups, 10 push-ups, and 15 air squats. You can also do 10 rounds of 10/20/30. Partitioning makes the workout more manageable and often leads to faster times.",
      "question": "Can you partition Murph?"
    },
    {
      "answer": "Murph is traditionally performed on Memorial Day in the United States, as a tribute to fallen service members. It has been called the Memorial Day Murph and is done by hundreds of thousands of athletes worldwide each year.",
      "question": "When is Murph traditionally done?"
    },
    {
      "answer": "Scale Murph by removing the weight vest, reducing to a half Murph (half reps + one mile total), substituting ring rows for pull-ups, or doing knee push-ups. The goal is to finish safely with good form.",
      "question": "How do I scale Murph?"
    }
  ]$$::jsonb,
  scaling_notes = $$Beginners: Wear a lighter vest (10 lb) or none at all. Break the pull-ups and push-ups into small sets from round one — do not go to failure early. Sub ring rows for pull-ups if needed. Run at a pace you can sustain for the full mile.$$,
  duration_estimate = $$40–60 min$$,
  updated_at = now()
where slug = 'murph';

-- ═══ Item 3: Open 12.1: equipment, score targets, and "cannot be scaled" ═══

-- Item 3: Open 12.1
update public.benchmark_workouts set
  scoring_notes = $$Your score is total burpees. 130+ reps is elite. 100+ reps is excellent.$$,
  faqs = $$[
    {
      "answer": "130+ reps is elite. 100+ reps is excellent. In 2012, the top scores exceeded 140 reps. A consistent 15 reps per minute yields 105 reps across 7 minutes.",
      "question": "What is a good score for Open 12.1?"
    },
    {
      "answer": "Chest must contact the ground on every rep. The athlete then stands and jumps to touch a target 6 inches above their standing reach with both hands. Two-foot jump required.",
      "question": "What is the burpee standard in Open 12.1?"
    },
    {
      "answer": "Total burpees completed in 7 minutes. Each completed rep (chest to ground + jump to target) counts as one rep.",
      "question": "How is Open 12.1 scored?"
    }
  ]$$::jsonb,
  scaling_notes = $$Athletes with mobility limitations can substitute standard burpees (without the 6-inch jump target). Keep the full 7 minutes.$$,
  updated_at = now()
where slug = 'open-12-1';

-- ═══ Item 4: Coe: scheme label says 21-15-9 ═══

-- Item 4: Coe
update public.benchmark_workouts set
  scheme = $$1-2-3...10 For Time$$,
  faqs = $$[
    {
      "answer": "Sub-12 min is strong. Most athletes finish in 12–20 minutes depending on ring dip proficiency.",
      "question": "What is a good time for Coe?"
    },
    {
      "answer": "55 ring dips + 55 thrusters = 110 total reps across the 1-10 ascending ladder.",
      "question": "How many total reps are in Coe?"
    },
    {
      "answer": "95 lb for men, 65 lb for women — the same weight as Fran.",
      "question": "What weight are the thrusters in Coe?"
    },
    {
      "answer": "The early rounds feel easy, which tempts athletes to go faster than is sustainable. By rounds 8-10, the cumulative shoulder and tricep demand from ring dips and thrusters becomes very significant.",
      "question": "Why is the ascending ladder format challenging?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'coe';

-- ═══ Item 5: Kalsu: stored as a 15-minute AMRAP ═══

-- Item 5: Kalsu
-- Decided by Claude (2026-11-20): Kalsu honors Army 1LT Bob Kalsu, so it moves to Hero WODs (subcategory football kept).
update public.benchmark_workouts set
  category = $$hero$$,
  format = $$For Time$$,
  scheme = $$100 Thrusters For Time$$,
  scoring_type = $$time$$,
  duration_estimate = $$20–35 min$$,
  description = $$Kalsu is 100 thrusters for time with a burpee penalty. Start with 5 burpees, then at the top of every minute do 5 burpees before going back to the thrusters. The workout ends when you reach 100 thrusters.$$,
  movements = $$[
    {
      "tip": "Chest to deck; full jump",
      "name": "Burpees",
      "reps": "5 at the top of every minute"
    },
    {
      "tip": "Quick sets",
      "name": "Thrusters",
      "reps": "100 total",
      "rx_men": "135 lb",
      "rx_women": "95 lb"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is your finish time. Sub-20 min is elite. 25–35 min is solid.$$,
  tips = array[
    $$Do the 5 burpees at the top of every minute, then get straight back to the bar$$,
    $$Pace the thrusters early — the burpees cost more as you tire$$,
    $$The workout ends at 100 thrusters$$
  ]::text[],
  updated_at = now()
where slug = 'kalsu';

-- ═══ Item 6: Nasty Girls: filed under Competition ═══

-- Item 6: Nasty Girls
-- Decided by Claude (Rob asked for best judgement, 2026-11-20): the Score line had no
-- target, so it takes the tips' figure (sub-10 elite) with the FAQ's 15-minute line as "strong".
update public.benchmark_workouts set
  category = $$classic_benchmark$$,
  scoring_notes = $$Your score is your finish time. Sub-10 min is elite. Sub-15 min is strong.$$,
  tips = array[
    $$The muscle-ups are the limiting factor — break them from round 1 rather than failing$$,
    $$50 air squats before muscle-ups will hollow out your legs quickly$$
  ]::text[],
  faqs = $$[
  {
    "answer": "Sub-10 min is elite. Sub-15 min is strong. The muscle-up volume is the primary time driver.",
    "question": "What is a good time for Nasty Girls?"
  },
  {
    "answer": "The workout was named after the original video from 2005 featuring Nicole Carroll, Annie Sakamoto, and Eva Twardokens performing it. The 'Nasty Girls' name refers to the athletes in that legendary video, which helped establish CrossFit's reputation for producing high-level female athletes.",
    "question": "Why is it called Nasty Girls?"
  },
  {
    "answer": "3 rounds for time of 50 air squats, 7 muscle-ups, and 10 hang power cleans (135/95 lb).",
    "question": "What movements are in Nasty Girls?"
  }
]$$::jsonb,
  updated_at = now()
where slug = 'nasty-girls';

-- ═══ Item 7: Standing Quad Stretch: focus says hamstrings ═══

-- Item 7: Standing Quad Stretch
update public.stretches set
  focus = array[
    $$quads$$,
    $$hips$$,
    $$full$$
  ]::text[],
  updated_at = now()
where slug = 'standing-quad-stretch';

-- Item 7: PNF Quad Stretch
update public.stretches set
  focus = array[
    $$quads$$,
    $$hips$$
  ]::text[],
  updated_at = now()
where slug = 'pnf-quad-stretch';

-- ═══ Item 8: Cat-Cow and Deep Squat Hold: modality swapped ═══

-- Item 8: Cat-Cow Stretch
update public.stretches set
  modality = $$dynamic$$,
  hold_beginner = null,
  hold_intermediate = null,
  hold_advanced = null,
  updated_at = now()
where slug = 'cat-cow-stretch';

-- Item 8: Deep Squat Hold
update public.stretches set
  modality = $$static$$,
  updated_at = now()
where slug = 'deep-squat-hold';

-- ═══ Item 9: Pull-Ups: chest cue on the pull-up page ═══

-- Item 9: Pull-Ups
update public.movements set
  common_faults = $$[{"mistake":"Partial range of motion","fix":"Start from a full dead hang — arms fully extended before each rep. Chin must fully clear the bar at the top."},{"mistake":"Losing tension at the bottom","fix":"Stay active in the shoulders at the bottom — slight shrug prevents the shoulder from being yanked open."},{"mistake":"Kipping without the strength base","fix":"Build strict pull-up capacity first — kipping without base strength creates shoulder injury risk."},{"mistake":"Neck cranking forward","fix":"Keep your neck neutral and pull your body up until your chin clears the bar. Do not crane your chin forward to reach it."}]$$,
  updated_at = now()
where slug = 'pull-ups';

-- ═══ Item 10: Duplicate movements ═══

-- Item 10: Dumbbell Goblet Squat
update public.movements set
  daily_wod_eligible = false,
  updated_at = now()
where slug = 'dumbbell-goblet-squat';

-- Item 10: Dumbbell Romanian Deadlift
update public.movements set
  daily_wod_eligible = false,
  updated_at = now()
where slug = 'dumbbell-romanian-deadlift';

-- Item 10: Dumbbell Push Press
update public.movements set
  daily_wod_eligible = false,
  updated_at = now()
where slug = 'dumbbell-push-press';

-- Item 10: Dumbbell Thruster
update public.movements set
  daily_wod_eligible = false,
  updated_at = now()
where slug = 'dumbbell-thruster';

-- ═══ Item 11: WOD Builder movements with no rep ranges: new values for you to approve ═══

-- Item 11: Overhead Slam
update public.movements set
  beginner_reps = $$[6,8]$$::jsonb,
  intermediate_reps = $$[10,12]$$::jsonb,
  advanced_reps = $$[12,15]$$::jsonb,
  updated_at = now()
where slug = 'overhead-slam';

-- Item 11: Bear Hug Ball Carry
update public.movements set
  beginner_reps = $$[3,4]$$::jsonb,
  intermediate_reps = $$[4,5]$$::jsonb,
  advanced_reps = $$[5,6]$$::jsonb,
  updated_at = now()
where slug = 'bear-hug-ball-carry';

-- Item 11: Row for Calories
update public.movements set
  beginner_reps = $$[10]$$::jsonb,
  intermediate_reps = $$[15]$$::jsonb,
  advanced_reps = $$[20]$$::jsonb,
  updated_at = now()
where slug = 'row-for-calories';

-- Item 11: Rowing
update public.movements set
  beginner_reps = $$["500m"]$$::jsonb,
  intermediate_reps = $$["1000m"]$$::jsonb,
  advanced_reps = $$["2000m"]$$::jsonb,
  updated_at = now()
where slug = 'rowing';

-- Item 11: DB Clean-and-Press
update public.movements set
  beginner_reps = $$[6,8]$$::jsonb,
  intermediate_reps = $$[8,10]$$::jsonb,
  advanced_reps = $$[10,12]$$::jsonb,
  updated_at = now()
where slug = 'db-clean-and-press';

-- Item 11 (optional, only if you keep the three duplicates in the WOD Builder instead of item 10):
-- update public.movements set beginner_reps = '[6,8]'::jsonb,   intermediate_reps = '[10,12]'::jsonb, advanced_reps = '[15,20]'::jsonb, updated_at = now() where slug = 'dumbbell-push-press';
-- update public.movements set beginner_reps = '[12,15]'::jsonb, intermediate_reps = '[15,20]'::jsonb, advanced_reps = '[20,25]'::jsonb, updated_at = now() where slug = 'dumbbell-goblet-squat';
-- update public.movements set beginner_reps = '[10,12]'::jsonb, intermediate_reps = '[12,15]'::jsonb, advanced_reps = '[15,20]'::jsonb, updated_at = now() where slug = 'dumbbell-romanian-deadlift';

-- ═══ Item 12: Escape codes stored as text ═══

-- Item 12: Tricep Dips
update public.movements set
  wod_tip = $$Use chair — straight legs = harder$$,
  updated_at = now()
where slug = 'tricep-dips';

-- Item 12: Box Jumps
update public.movements set
  wod_tip = $$Land in athletic stance — stand fully$$,
  updated_at = now()
where slug = 'box-jumps';

-- Item 12: Air Squats
update public.movements set
  description = $$The air squat is the foundation of all CrossFit squatting movements — essential for form before adding weight.$$,
  updated_at = now()
where slug = 'air-squats';

-- ═══ Item 13: Brand and naming sweep (report only, no SQL) ═══
-- Report only, no SQL.

-- ═══ Item 14: Contradiction scan: targets that disagree with the Score line ═══

-- Item 14 (14a)

-- Item 14 (14a): Linda
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Linda (also called 'The Three Bars of Death') is a descending rep scheme from 10 to 1 across three barbell movements loaded relative to the athlete's bodyweight.",
      "question": "What is Linda?"
    },
    {
      "answer": "Deadlift = 1.5× bodyweight, bench press = 1× bodyweight, squat clean = 0.75× bodyweight. Round to the nearest 5 pounds.",
      "question": "How do I calculate Linda weights?"
    },
    {
      "answer": "Under 20 min is strong. Linda significantly favors heavier lifters because the loads scale with bodyweight.",
      "question": "What is a good Linda time?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'linda';

-- Item 14 (14a): Karen
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Karen is 150 wall ball shots for time at 20 lb (9 kg) to a 10-foot target for men and 14 lb (6 kg) to a 9-foot target for women. It is one of the simplest and most demanding of the Girl WODs — pure wall ball volume.",
      "question": "What is the Karen workout?"
    },
    {
      "answer": "Under 10 min is strong.",
      "question": "What is a good Karen time?"
    },
    {
      "answer": "Rx is a 20 lb (9 kg) ball for men and 14 lb (6 kg) for women. Beginners typically scale to a 10–14 lb ball for men or 8–10 lb for women. The priority is maintaining the squat-to-throw movement pattern, not hitting a specific weight.",
      "question": "What weight wall ball should I use for Karen?"
    },
    {
      "answer": "Common strategies: 5 sets of 30, 10 sets of 15, or 30-20-20-20-20-20-20 reps. The key is to start your breaks before your muscles fail — stopping at 25 and resting 5 seconds beats failing at 35 and resting 20.",
      "question": "How do I break up 150 wall balls?"
    },
    {
      "answer": "You need a wall ball (20/14 lb) and a wall with a target at 10 feet (men) or 9 feet (women). A high-ceilinged garage, a gym wall, or an outdoor wall with a target mark all work.",
      "question": "What equipment do I need for Karen?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'karen';

-- Item 14 (14a): Isabel
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-3 min is elite.",
      "question": "What is a good Isabel time?"
    },
    {
      "answer": "Power snatches are typically faster at this load. Both are acceptable — use whichever is more technically consistent for you.",
      "question": "Power snatch or squat snatch for Isabel?"
    },
    {
      "answer": "Both — you need enough snatch efficiency and strength to move the bar safely, but Isabel is primarily a conditioning piece at the Rx load.",
      "question": "Is Isabel a strength test or conditioning test?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'isabel';

-- Item 14 (14a): Mary
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "10+ rounds is very strong.",
      "question": "What is a good Mary score?"
    },
    {
      "answer": "Box pistols (using a box for depth), assisted pistols (holding the rig), or Bulgarian split squats. The goal is single-leg loading and balance.",
      "question": "What are good pistol substitutions in Mary?"
    },
    {
      "answer": "Mary is significantly more skill-intensive (HSPUs, pistols) while Cindy is more accessible. Mary rewards gymnastics strength; Cindy rewards aerobic efficiency and movement consistency.",
      "question": "How does Mary compare to Cindy?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'mary';

-- Item 14 (14a): Nancy
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Under 20 min is strong.",
      "question": "What is a good Nancy time?"
    },
    {
      "answer": "Front squats are a common mobility scale. True Rx requires the barbell held overhead with locked-out elbows throughout the squat.",
      "question": "Can I front squat instead of OHS in Nancy?"
    },
    {
      "answer": "The OHS demands active shoulder and hip mobility on top of aerobic fatigue from running. Mobility limitations make it disproportionately difficult for many athletes compared to other Girl WODs.",
      "question": "Why is Nancy considered so hard?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'nancy';

-- Item 14 (14a): Amanda
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-12 min is strong.",
      "question": "What is a good Amanda time?"
    },
    {
      "answer": "2 pull-ups + 2 ring dips per muscle-up is standard. This preserves the pressing and pulling stimulus across the descending rep scheme.",
      "question": "What is the best muscle-up scale for Amanda?"
    },
    {
      "answer": "Squat snatches are Rx. Power snatches are a widely accepted scale, especially at heavier loads or for athletes still building squat snatch technique.",
      "question": "Can I use power snatches in Amanda?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'amanda';

-- Item 14 (14a): Jackie
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Under 12 min is strong. Jackie heavily favors rowing and gymnastics efficiency.",
      "question": "What is a good Jackie time?"
    },
    {
      "answer": "Around 85–90% effort. You want a strong row but need to cycle thrusters immediately after stepping off the erg.",
      "question": "How hard should I row in Jackie?"
    },
    {
      "answer": "The light weight (45/35#) is intentional — after 1000m of rowing, even an empty bar becomes challenging. The volume of 50 reps is the stimulus, not the load.",
      "question": "Why is the thruster weight so light in Jackie?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'jackie';

-- Item 14 (14a): Elizabeth
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Under 10 min is strong. Sub-8 min is elite.",
      "question": "What is a good Elizabeth time?"
    },
    {
      "answer": "Squat cleans are Rx, but power cleans are commonly accepted in scaled versions. Rx athletes should squat below parallel.",
      "question": "Can I do power cleans instead of squat cleans?"
    },
    {
      "answer": "Bar dips, box dips, or banded ring dips are standard scales. Push-ups can work for beginners but shift the stimulus away from the intended pressing pattern.",
      "question": "What substitutes work for ring dips?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'elizabeth';

-- Item 14 (14a): Diane
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Under 8 min is strong. Sub-5 min is elite.",
      "question": "What is a good Diane time?"
    },
    {
      "answer": "Deadlifts fatigue grip, core, and bracing muscles. HSPUs then demand full overhead pressing strength on top of that — the combination creates a brutal shoulder stimulus.",
      "question": "Why are HSPUs so hard after deadlifts?"
    },
    {
      "answer": "Yes — conventional, sumo, or any stance that allows full hip extension and a safe spine position is acceptable.",
      "question": "Can I use any deadlift stance in Diane?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'diane';

-- Item 14 (14a): Grace
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Grace is 30 clean & jerks for time at 135 lb (61 kg) for men and 95 lb (43 kg) for women. It is one of the simplest and most brutal benchmark workouts — a pure test of barbell cycling speed and overhead strength endurance.",
      "question": "What is the Grace workout?"
    },
    {
      "answer": "Sub-4 min is elite. Sub-6 min is strong.",
      "question": "What is a good Grace time?"
    },
    {
      "answer": "Rx weight for Grace is 135 lb (61 kg) for men and 95 lb (43 kg) for women. This is a moderately heavy barbell weight — athletes should be able to complete at least 5–10 unbroken reps at Rx to attempt it as prescribed.",
      "question": "How heavy is Grace?"
    },
    {
      "answer": "Grace uses clean & jerks while Isabel uses snatches, both for 30 reps. Isabel is generally considered harder because the snatch is more technically demanding and limits heavier loading for most athletes.",
      "question": "What is the difference between Grace and Isabel?"
    },
    {
      "answer": "Yes. Dumbbell clean & jerks at 50/35 lb each are a common scaled option. This is especially useful for home workouts where a barbell is not available.",
      "question": "Can I do Grace with dumbbells?"
    }
  ]$$::jsonb,
  coaching_tips = array[
    $$Grace is all about cycling speed. The clean & jerk should be smooth and continuous — no long pauses at the rack.$$,
    $$A squat clean is slower than a power clean for most athletes. Stick to power clean + push jerk for speed.$$,
    $$Big unbroken sets early (15+ reps) followed by smaller sets is the dominant strategy for competitive athletes.$$,
    $$Chalk your hands and use a hook grip to protect your pull.$$
  ]::text[],
  updated_at = now()
where slug = 'grace';

-- Item 14 (14a): Angie
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Under 20 min is elite. Under 30 min is strong.",
      "question": "What is a good Angie time?"
    },
    {
      "answer": "Yes — Angie is sequential. Complete all 100 pull-ups before starting push-ups, and so on. Mixing movements is not Rx.",
      "question": "Must I complete all reps of each movement before moving on?"
    },
    {
      "answer": "Yes — kipping and butterfly pull-ups are standard. Strict pull-ups are more impressive but will cost you significant time over 100 reps.",
      "question": "Can I kip in Angie?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'angie';

-- Item 14 (14a): Cindy
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Cindy is a 20-minute AMRAP (as many rounds as possible) of 5 pull-ups, 10 push-ups, and 15 air squats. It is one of the original Girl WODs and a foundational test of gymnastics endurance and bodyweight fitness.",
      "question": "What is the Cindy workout?"
    },
    {
      "answer": "20+ rounds is very strong.",
      "question": "What is a good Cindy score?"
    },
    {
      "answer": "Scale Cindy by substituting jumping pull-ups or ring rows for pull-ups, doing knee push-ups instead of full push-ups, or reducing the rep scheme. The priority is to keep moving through all 20 minutes.",
      "question": "How do I scale Cindy?"
    },
    {
      "answer": "Yes — Cindy is one of the most beginner-friendly benchmark workouts because it uses only bodyweight movements and no equipment beyond a pull-up bar. Scaling options make it accessible at any fitness level.",
      "question": "Is Cindy good for beginners?"
    },
    {
      "answer": "Cindy only requires a pull-up bar. No barbell or weights needed, making it an ideal at-home or travel workout.",
      "question": "What equipment do you need for Cindy?"
    }
  ]$$::jsonb,
  tips = array[
    $$Pace to start—you'll want to sprint at the end$$,
    $$Stay consistent in your pull-up sets$$
  ]::text[],
  scaling_notes = $$Beginners: Start with jumping pull-ups or ring rows instead of kipping pull-ups, and do knee push-ups as needed. Focus on maintaining movement through all 20 minutes — even if rounds are slow.$$,
  updated_at = now()
where slug = 'cindy';

-- Item 14 (14a): Helen
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Helen is a classic benchmark workout consisting of 3 rounds for time of: a 400m run, 21 kettlebell swings (53/35 lb), and 12 pull-ups. It tests cardiovascular endurance, hip power, and grip strength.",
      "question": "What is the Helen workout?"
    },
    {
      "answer": "Under 15 min is strong.",
      "question": "What is a good Helen time?"
    },
    {
      "answer": "Rx weight for Helen is 53 lb (24 kg) for men and 35 lb (16 kg) for women. Beginners commonly scale to 35 lb (16 kg) for men or 26 lb (12 kg) for women.",
      "question": "How heavy is the kettlebell in Helen?"
    },
    {
      "answer": "Scale Helen by using a lighter kettlebell, substituting jumping pull-ups or ring rows for pull-ups, or shortening the run to 200m. Keep the 3-round structure if possible — the repeat effort is what makes Helen effective.",
      "question": "How do I scale Helen?"
    },
    {
      "answer": "Helen targets the posterior chain (glutes, hamstrings) through kettlebell swings, pulling muscles (lats, biceps) through pull-ups, and the entire cardiovascular system through the 400m runs.",
      "question": "What muscles does Helen work?"
    }
  ]$$::jsonb,
  coaching_tips = array[
    $$Control the run pace — it is tempting to sprint the 400m but you pay for it on the pull-ups.$$,
    $$On kettlebell swings, drive with your hips. Keep the bell close on the downswing and pop your hips at the top.$$,
    $$The pull-ups follow a demanding hip-hinge movement. Break them early into 2 sets rather than going to failure.$$,
    $$Each round should take roughly 3.5–4 minutes.$$,
    $$Chalk up for the pull-ups — your grip will be taxed from the kettlebell swings.$$
  ]::text[],
  scaling_notes = $$Beginners: Reduce the run to 200m, swap kettlebell swings to a lighter weight (35 lb men / 26 lb women), and substitute ring rows or jumping pull-ups for pull-ups.$$,
  updated_at = now()
where slug = 'helen';

-- Item 14 (14a): Annie
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Annie is a classic benchmark workout of 50-40-30-20-10 reps of double-unders and sit-ups, done for time. It tests jump rope skill, coordination, and core endurance.",
      "question": "What is the Annie workout?"
    },
    {
      "answer": "Sub-8 min is very strong. Sub-12 min is a solid goal.",
      "question": "What is a good Annie time?"
    },
    {
      "answer": "The most common scale is single-unders at a 3:1 ratio (150-120-90-60-30) or attempting double-unders with a max of 2–3 tries per rep before moving on. You can also scale to 25-20-15-10-5 double-unders if you have the skill but limited volume.",
      "question": "How do I scale double-unders in Annie?"
    },
    {
      "answer": "An AbMat is not required but strongly recommended. It supports the lower back during sit-ups and allows a full range of motion. Without one, place your hands under your lower back for support.",
      "question": "Do I need an AbMat for Annie?"
    },
    {
      "answer": "Annie only requires a jump rope and an optional AbMat. It is one of the few benchmark workouts that can be done at home with minimal equipment.",
      "question": "What equipment do I need for Annie?"
    }
  ]$$::jsonb,
  coaching_tips = array[
    $$Do not rush the double-unders — a missed rep breaks rhythm and spikes your heart rate. Stay calm and controlled.$$,
    $$The sit-up sets are your recovery. Use them to control your breathing before the next jump rope set.$$,
    $$Big sets on double-unders are possible in early rounds. Break them at 25+ if needed in later rounds.$$,
    $$Jump rope grip matters: hold handles lightly with wrists, not arms, doing the spinning.$$
  ]::text[],
  updated_at = now()
where slug = 'annie';

-- Item 14 (14a): Annie vs. The Ghost
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "15+ complete rounds is strong. Completing all 15 rounds (out of 15 rowing minutes and 15 burpee minutes) is the benchmark. Completing all 30 minutes with full rep counts is elite.",
      "question": "What is a good score for The Ghost?"
    },
    {
      "answer": "Score is total complete rounds — each minute where you complete all 20 reps (rowing or burpees) within the minute counts as one complete round. Maximum possible score is 30.",
      "question": "How is The Ghost workout scored?"
    },
    {
      "answer": "A 30-minute EMOM alternating between 20 calorie rows and 20 burpees. Odd minutes row, even minutes burpees (or vice versa). Sometimes called Annie vs. The Ghost after popular programming variations.",
      "question": "What is The Ghost workout?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'annie-vs-ghost';

-- Item 14 (14a): Bergeron Beep Test
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "15+ rounds is elite. 10+ rounds is a competitive baseline.",
      "question": "What is a good score for the Bergeron Beep Test?"
    },
    {
      "answer": "Ben Bergeron, head coach of CrossFit New England and coach of multiple CrossFit Games champions. He designed it as a repeatable aerobic capacity test for his athletes.",
      "question": "Who created the Bergeron Beep Test?"
    },
    {
      "answer": "75 lb thrusters for men, 55 lb thrusters for women. Pull-ups are bodyweight with no additional load. Burpees are standard (chest to ground, jump and clap overhead).",
      "question": "What is the weight for the Bergeron Beep Test?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is the number of complete rounds. 15+ rounds is elite. 10+ rounds is a competitive baseline. Most athletes are surprised how quickly the burpees compound.$$,
  updated_at = now()
where slug = 'bergeron-beep-test';

-- Item 14 (14a): Barbara
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Including the 3-minute rests, most athletes finish in 20–30 minutes.",
      "question": "How long does Barbara take?"
    },
    {
      "answer": "Yes — the rest is programmed into the workout. Skipping it changes the intended stimulus of repeatable effort across rounds.",
      "question": "Is the 3-minute rest mandatory?"
    },
    {
      "answer": "Under 25 min is strong.",
      "question": "What is a good Barbara score?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'barbara';

-- Item 14 (14a): Grettel
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-15 min is strong. Times vary enormously based on muscle-up cycling efficiency — athletes who can cycle 5+ reps per set consistently will finish far faster than those limited to singles.",
      "question": "What is a good time for Grettel?"
    },
    {
      "answer": "30 muscle-ups for time. Ring muscle-ups are standard unless otherwise specified. No additional movements, no weights.",
      "question": "What is the Grettel WOD?"
    },
    {
      "answer": "Yes — kipping muscle-ups are standard. Strict muscle-ups are also permitted. Kipping is significantly faster across 30 reps for most athletes.",
      "question": "Is kipping allowed in Grettel?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'grettel';

-- Item 14 (14a): Hope
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "300+ reps is strong. Score varies significantly based on chest-to-bar proficiency — athletes with strong C2B cycling will outscore stronger athletes who miss pull-up reps.",
      "question": "What is a good score for Hope?"
    },
    {
      "answer": "Total reps across all 12 work intervals (3 rounds × 4 stations × 1 minute each). Each completed power snatch, box jump, thruster, and chest-to-bar pull-up counts as one rep.",
      "question": "How is Hope scored?"
    },
    {
      "answer": "Both use a 1-minute station, max-rep format across 3 rounds. Hope uses 4 stations (power snatch, box jump, thruster, C2B pull-ups) with a 1-minute rest between rounds. Fight Gone Bad uses 5 stations with no rest between stations within a round.",
      "question": "How does Hope compare to Fight Gone Bad?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is total reps across all 12 stations. 300+ reps is strong.$$,
  updated_at = now()
where slug = 'hope';

-- Item 14 (14a): Lynn
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "20+ rounds is strong.",
      "question": "What is a good score for Lynn?"
    },
    {
      "answer": "Your own bodyweight — whatever you weigh on the day of the workout. There is no fixed barbell weight.",
      "question": "What weight do I use for the deadlift in Lynn?"
    },
    {
      "answer": "The bodyweight standard makes Lynn self-scaling — every athlete performs a deadlift that is exactly proportional to their size. It also makes comparing scores across different body weights more meaningful than a fixed weight would allow.",
      "question": "Why is the deadlift bodyweight in Lynn?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'lynn';

-- Item 14 (14a): Gwen
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-10 minutes is strong. The touch-and-go constraint makes times highly variable — a single restart in the set of 15 can add 2–3 minutes to your total.",
      "question": "What is a good time for Gwen?"
    },
    {
      "answer": "You restart that set from zero — no reps completed in that set count. This is the defining rule of Gwen and what makes it dramatically harder than a standard 15-12-9 clean and jerk workout.",
      "question": "What happens if I let go of the bar in Gwen?"
    },
    {
      "answer": "The bar may contact the floor between reps, but your hands must remain on the bar throughout the entire set. Bouncing the bar slightly off the floor and immediately pulling up counts. Releasing the bar for any reason — even briefly — means restarting the set.",
      "question": "What does touch-and-go mean in Gwen?"
    },
    {
      "answer": "Yes — both power clean and squat clean count as long as the bar starts from the floor and is cleaned to the shoulders, then jerked overhead. Most athletes use power clean for efficiency at this rep count.",
      "question": "Can I use a squat clean in Gwen?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'gwen';

-- Item 14 (14a): King Kong
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Deadlift: 455 lb (men) / 325 lb (women). Squat clean: 250 lb (men) / 175 lb (women). Muscle-ups are bodyweight on rings. Handstand push-ups are bodyweight.",
      "question": "What are the weights in King Kong?"
    },
    {
      "answer": "Sub-20 min is strong.",
      "question": "What is a good time for King Kong?"
    },
    {
      "answer": "It is widely considered among the hardest due to the extreme loading on the deadlift and squat clean. The combination of near-max strength movements in a workout context makes it accessible to only a small percentage of the functional fitness population.",
      "question": "Is King Kong the hardest CrossFit WOD?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'king-kong';

-- Item 14 (14a): Tabata Something Else
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "The traditional Tabata score method: record your lowest rep count for each movement across its 8 intervals, then sum those four numbers. Some gyms use total reps — confirm with your coach.",
      "question": "How is Tabata Something Else scored?"
    },
    {
      "answer": "200+ reps is strong.",
      "question": "What is a good Tabata Something Else score?"
    },
    {
      "answer": "Tabata refers to a specific interval format: 8 rounds of 20 seconds of work followed by 10 seconds of rest (4 minutes total per movement). It was developed by Dr. Izumi Tabata in 1996.",
      "question": "What does Tabata mean?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is total reps across all 32 intervals. 200+ reps is strong.$$,
  updated_at = now()
where slug = 'tabata-something-else';

-- Item 14 (14a): Macho Man
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "12+ rounds is elite. 10+ rounds is strong. Macho Man tends to run slightly more rounds than the Bergeron Beep Test for athletes with strong barbell cycling.",
      "question": "What is a good score for Macho Man?"
    },
    {
      "answer": "Technically there is no rule against resting in the front rack, but doing so shrinks your rest window per minute. The ideal is a smooth linked complex with no intentional pause between movements.",
      "question": "Can I rest between the clean, squat, and jerk in Macho Man?"
    },
    {
      "answer": "Ben Bergeron, head coach of CrossFit New England. It is a companion benchmark to the Bergeron Beep Test — together they test both aerobic capacity (Beep Test) and barbell cycling strength (Macho Man).",
      "question": "Who created Macho Man?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is the number of complete rounds. 12+ rounds is elite. 10+ rounds is strong.$$,
  updated_at = now()
where slug = 'macho-man';

-- Item 14 (14a): Fight Gone Bad
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Fight Gone Bad is a 3-round workout where you spend 1 minute at each of 5 stations — wall ball shots (20/14 lb), sumo deadlift high-pull (75/55 lb), box jump (20 inch), push press (75/55 lb), and rowing for calories — with 1 minute of rest between rounds. Your total rep count across all stations is your score.",
      "question": "What is Fight Gone Bad?"
    },
    {
      "answer": "300+ reps is strong.",
      "question": "What is a good Fight Gone Bad score?"
    },
    {
      "answer": "Fight Gone Bad is scored by total reps. Each rep at each station counts as one point, plus each calorie on the rower counts as one point. Your final score is the sum of all reps across all 3 rounds at all 5 stations.",
      "question": "How is Fight Gone Bad scored?"
    },
    {
      "answer": "The name comes from its origin as a simulation of a mixed martial arts fight — 3 rounds of effort with 1 minute of rest, mimicking a boxing/MMA round structure. It was reportedly named after an athlete described how it felt after finishing.",
      "question": "Why is it called Fight Gone Bad?"
    },
    {
      "answer": "Fight Gone Bad requires a wall ball, a barbell with bumpers, a plyo box (20 inches), and a rowing machine. It is a gym-based workout due to the rower requirement, though the rower can be substituted with a bike erg for a home version.",
      "question": "What equipment do I need for Fight Gone Bad?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is total reps across all 15 stations. 300+ reps is strong.$$,
  updated_at = now()
where slug = 'fight-gone-bad';

-- Item 14 (14a): Filthy Fifty
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Filthy Fifty is a benchmark chipper workout consisting of 50 reps each of: box jumps (24/20 inch), jumping pull-ups, kettlebell swings (35/26 lb), walking lunges, knees-to-elbows, push press (45/35 lb), back extensions, wall balls (20/14 lb), burpees, and double-unders — all done for time.",
      "question": "What is the Filthy Fifty workout?"
    },
    {
      "answer": "Sub-45 min is strong. Beginners should allow up to 60 minutes with scaling.",
      "question": "How long does Filthy Fifty take?"
    },
    {
      "answer": "A chipper is a workout where you do all the reps of one movement before moving on to the next. You work through the list from top to bottom, chipping away at each movement — hence the name. Filthy Fifty is one of the most famous chippers in functional fitness.",
      "question": "What is a chipper workout?"
    },
    {
      "answer": "Scale Filthy Fifty by reducing the rep count to 35 or 25 per movement for a lighter version, substituting jumping pull-ups for pull-ups, swapping single-unders for double-unders, and adjusting all barbell and kettlebell weights to maintain movement quality.",
      "question": "How do I scale Filthy Fifty?"
    },
    {
      "answer": "Filthy Fifty requires a plyo box, a pull-up bar, a kettlebell, a barbell with plates, a wall ball, and a jump rope. It is a full-gym workout — the variety of equipment is part of what makes it a comprehensive fitness test.",
      "question": "What equipment do I need for Filthy Fifty?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'filthy-fifty';

-- Item 14 (14a): Luce
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-20 min is strong.",
      "question": "What is a good time for Luce?"
    },
    {
      "answer": "135 lb for men, 95 lb for women — significantly heavier than most benchmark thrusters.",
      "question": "What weight are the thrusters in Luce?"
    },
    {
      "answer": "10 per round x 5 rounds = 50 total muscle-ups.",
      "question": "How many total muscle-ups are in Luce?"
    },
    {
      "answer": "Each movement pre-fatigues the muscles needed for the next. Muscle-ups tax the shoulders and arms; thrusters stress the legs and shoulders again; pull-ups continue the arm demand; HSPU require pressing when pressing capacity is nearly exhausted.",
      "question": "Why is the order of movements in Luce so challenging?"
    }
  ]$$::jsonb,
  description = $$Luce honors a fallen American hero through five rounds of 10 muscle-ups, 15 thrusters (135/95 lb), 15 pull-ups, and 15 handstand push-ups — one of the most demanding hero WODs in the library. The combination of gymnastics and heavy barbell cycling across five rounds tests every upper-body quality simultaneously.

Ten muscle-ups open each round; 15 heavy thrusters immediately follow, taxing the shoulders and legs; 15 pull-ups continue the upper-body demand on pre-fatigued arms; 15 handstand push-ups close the round with pressing strength that will have diminished significantly from the muscle-up kipping and the overhead lockout in the thruster. Five rounds of this sequence requires both elite gymnastics capacity and heavy barbell proficiency. Most athletes who complete Luce take 25-35 minutes.$$,
  updated_at = now()
where slug = 'luce';

-- Item 14 (14a): Manion
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "USMC 1st Lt. Travis Manion, 26, killed in action in Iraq on April 29, 2007, while shielding his teammates. He received the Navy Cross posthumously. His motto 'If Not Me, Then Who...' is carried by veterans worldwide.",
      "question": "Who was Travis Manion?"
    },
    {
      "answer": "Travis Manion was 29 years old at the time of his death. Each squat set honors one year of his life.",
      "question": "Why 29 reps in Manion?"
    },
    {
      "answer": "Under 35 minutes is strong.",
      "question": "What is a good time for Manion?"
    },
    {
      "answer": "135 lb for men, 95 lb for women — the same weight across all 7 rounds.",
      "question": "What weight is the back squat in Manion?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'manion';

-- Item 14 (14a): Randy
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-8 min is strong.",
      "question": "What is a good Randy time?"
    },
    {
      "answer": "75# for men, 55# for women at Rx. If you cannot do 15 unbroken power snatches when fresh at that weight, scale down to preserve form across all 75 reps.",
      "question": "What weight should I use for Randy?"
    },
    {
      "answer": "Randy was named after Randy Simmons, a SWAT officer and Army veteran killed in the line of duty in 2008. It is a hero benchmark WOD honoring his service.",
      "question": "Who was Randy?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'randy';

-- Item 14 (14a): Daniel
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-25 min is strong.",
      "question": "What is a good time for Daniel?"
    },
    {
      "answer": "50 pull-ups → 400m run → 21 thrusters → 800m run → 21 thrusters → 400m run → 50 pull-ups.",
      "question": "What is the full order of movements in Daniel?"
    },
    {
      "answer": "95 lb for men, 65 lb for women — the standard Fran weight.",
      "question": "What weight are the thrusters in Daniel?"
    },
    {
      "answer": "They arrive after 42 thrusters and 1,600m of running, with hands already fatigued from the opening 50 pull-ups. The grip and shoulder demand at the end of this chipper is significantly harder than the start.",
      "question": "Why are the closing 50 pull-ups the hardest part?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'daniel';

-- Item 14 (14a): Erin
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Master Corporal Erin Melvin Doyle, 32, 1st Battalion Royal Canadian Regiment, killed in action in Kandahar, Afghanistan, on August 11, 2008.",
      "question": "Who was Erin Doyle?"
    },
    {
      "answer": "A clean performed with two dumbbells where you drop into a split (lunge) position to receive the weight at the top of the pull. One foot steps forward, one back, and both bells are cleaned simultaneously to the shoulders.",
      "question": "What is a dumbbell split clean?"
    },
    {
      "answer": "Sub-25 minutes is solid. The 105 split cleans and 105 pull-ups make this a grip-intensive workout with a typical finish time of 20-35 minutes.",
      "question": "What is a good time for Erin?"
    },
    {
      "answer": "40 lb each hand for men, 30 lb each hand for women.",
      "question": "What dumbbell weight is used in Erin?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'erin';

-- Item 14 (14a): Glen
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Glen Doherty was a former Navy SEAL and CIA security contractor killed in Benghazi, Libya, on September 11, 2012, while protecting the U.S. diplomatic mission. He was 42 years old.",
      "question": "Who was Glen Doherty?"
    },
    {
      "answer": "Sub-60 min is a solid goal. Finishing at any time is a meaningful achievement — this is one of the longer hero WODs.",
      "question": "What is a good time for Glen?"
    },
    {
      "answer": "30 clean-and-jerks (135/95 lb) → 1 mile run → 10 rope climbs (15 ft) → 1 mile run → 100 burpees.",
      "question": "What are all the movements in Glen?"
    },
    {
      "answer": "45-70 minutes for most athletes. The combination of 2 miles of running, 30 heavy C&Js, 10 rope climbs, and 100 burpees makes this one of the more time-consuming hero WODs.",
      "question": "How long does Glen typically take?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is your total time. Sub-60 min is a solid goal. Most athletes finish in 45–70 min.$$,
  updated_at = now()
where slug = 'glen';

-- Item 14 (14a): Abbate
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-40 minutes is strong. First-timers should aim to complete all runs and C&J sets without time pressure.",
      "question": "What is a good time for Abbate?"
    },
    {
      "answer": "155 lb for men, 105 lb for women — heavier than most hero WODs. Any style of clean and jerk is permitted.",
      "question": "How heavy are the clean-and-jerks in Abbate?"
    },
    {
      "answer": "1 mile + 800m + 1 mile = 2.8 miles total, interspersed with two sets of 21 clean-and-jerks.",
      "question": "What is the total distance run in Abbate?"
    },
    {
      "answer": "USMC Sergeant Matthew T. Abbate, 26, killed in action in Helmand Province, Afghanistan, on December 2, 2010. He was awarded the Silver Star for valor in combat.",
      "question": "Who is Abbate named after?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'abbate';

-- Item 14 (14a): Jared
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-30 minutes is a strong performance.",
      "question": "What is a good time for Jared?"
    },
    {
      "answer": "800m run → 5 rounds of (11 chest-to-bar pull-ups + 15 front squats at 95/65 lb) → 800m run.",
      "question": "What is the full movement order in Jared?"
    },
    {
      "answer": "11 per round x 5 rounds = 55 total chest-to-bar pull-ups.",
      "question": "How many total C2B pull-ups are in Jared?"
    },
    {
      "answer": "The closing 800m arrives after 55 C2B pull-ups and 75 front squats. The front squats create significant quad and hip fatigue, making running feel much heavier than the opening run.",
      "question": "Why is the closing run harder than the opening one?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'jared';

-- Item 14 (14a): Blake
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "A U.S. Navy Senior Chief killed in a helicopter crash during combat operations in Afghanistan on September 21, 2010. He served with Naval Special Warfare Group 2 Support Activity.",
      "question": "Who was David Blake McLendon?"
    },
    {
      "answer": "Sub-30 min is strong.",
      "question": "What is a good time for Blake?"
    },
    {
      "answer": "45 lb for men, 35 lb for women. The plate is held fully locked out overhead for all 100 feet each round.",
      "question": "What weight plate is used for overhead lunges in Blake?"
    },
    {
      "answer": "10 per round x 4 rounds = 40 total handstand push-ups.",
      "question": "How many handstand push-ups are in Blake?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'blake';

-- Item 14 (14a): Josh
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-15 min is strong. Overhead squat efficiency and pull-up stamina make the biggest difference in this workout.",
      "question": "What is a good Josh time?"
    },
    {
      "answer": "Front squats are a common mobility scale. True Rx requires the barbell held overhead throughout the squat.",
      "question": "Can I front squat instead of OHS in Josh?"
    },
    {
      "answer": "Josh was named after Army Sergeant Josh Whiting, who died in 2005. It is a memorial hero WOD honoring his service.",
      "question": "Who was Josh?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'josh';

-- Item 14 (14a): Klepto
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-25 minutes is strong.",
      "question": "What is a good time for Klepto?"
    },
    {
      "answer": "45 lb for men, 30 lb for women. Typically a dumbbell held between the feet or a dipping belt.",
      "question": "How much weight is added to pull-ups in Klepto?"
    },
    {
      "answer": "5 per round x 10 rounds = 50 total ring dips.",
      "question": "How many total ring dips are in Klepto?"
    },
    {
      "answer": "The 9 air squats provide a brief lower-body recovery movement between ring dips and the next round of pull-ups. They serve as active rest for the shoulders and arms.",
      "question": "Why are air squats included in an upper-body dominated workout?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'klepto';

-- Item 14 (14a): Rahoi
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Rahoi honors Staff Sergeant Aaron Rahoi, a paratrooper with the 82nd Airborne Division, killed in action on December 3, 2008, in Afghanistan, at age 23.",
      "question": "Who is Rahoi named after?"
    },
    {
      "answer": "A bar-facing burpee is performed facing the loaded barbell. You perform a burpee and then jump laterally over the bar at the top. The jump over the bar counts as the rep completion.",
      "question": "What is a bar-facing burpee?"
    },
    {
      "answer": "Rahoi is scalable for beginners with reduced thruster weight and box height. The 12-minute time cap makes it accessible — scale the movements so you can keep moving for the full duration.",
      "question": "Is Rahoi a good workout for beginners?"
    },
    {
      "answer": "6+ rounds is a strong performance. Track your round count at the 6-minute mark and aim to match that pace in the second half.",
      "question": "How many rounds should I aim for?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'rahoi';

-- Item 14 (14a): Spealler
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Spealler is named in honor of Chris Spealler, a longtime CrossFit Games athlete known for his technical virtuosity. The workout is also associated with honoring CPO Stephen Bass, KIA October 6, 2009.",
      "question": "Who is Spealler named after?"
    },
    {
      "answer": "The heavier kettlebell reflects the strength and intensity that Chris Spealler brought to his training. It increases the demand on the posterior chain relative to standard workouts.",
      "question": "Why is the kettlebell weight 70 lb?"
    },
    {
      "answer": "5+ rounds is strong. Each round is short but demands quality movement.",
      "question": "What is a good score for Spealler?"
    },
    {
      "answer": "Yes, with scaling. Reduce rope climbs and KB weight as needed. The 10-minute time domain makes it accessible when scaled appropriately.",
      "question": "Is Spealler suitable for intermediate athletes?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'spealler';

-- Item 14 (14a): JT
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-15 min is strong. JT is notoriously shoulder-intensive — any finish at Rx is impressive.",
      "question": "What is a good JT time?"
    },
    {
      "answer": "JT stacks three consecutive pressing movements for 135 total reps. Shoulder fatigue compounds quickly — most athletes hit a wall in the ring dips before halfway through.",
      "question": "Why is JT so difficult?"
    },
    {
      "answer": "JT was named after Petty Officer First Class Jeff Taylor, who died in service in 2006. It is a memorial hero WOD honoring his sacrifice.",
      "question": "Who was JT?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'jt';

-- Item 14 (14a): DT
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "DT is a hero workout consisting of 5 rounds for time of: 12 deadlifts, 9 hang power cleans, and 6 push jerks, all at 155 lb (70 kg) for men and 105 lb (48 kg) for women. It is named after Senior Airman Daniel Sanchez, killed in action in Afghanistan in 2007.",
      "question": "What is the DT workout?"
    },
    {
      "answer": "Sub-20 min is strong.",
      "question": "What is a good DT time?"
    },
    {
      "answer": "Rx weight for DT is 155 lb (70 kg) for men and 105 lb (48 kg) for women. This is a moderately heavy barbell weight that requires efficient cycling. Athletes should be comfortable with 15+ unbroken deadlifts at this weight before attempting Rx.",
      "question": "How heavy is DT?"
    },
    {
      "answer": "Yes, and ideally you should. DT is designed to be done touch-and-go: deadlifts flow into hang power cleans (bar stays above the knee), then into push jerks. Setting the bar down adds significant time over 5 rounds.",
      "question": "Can I do DT without setting the bar down?"
    },
    {
      "answer": "DT targets the posterior chain heavily (deadlifts and hang cleans: glutes, hamstrings, lower back), the traps and shoulders (clean and jerk), and the full body through the barbell cycling demand.",
      "question": "What muscles does DT work?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'dt';

-- Item 14 (14a): Michael
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-25 min is strong. Michael is deceptively high-volume for the posterior chain and core.",
      "question": "What is a good Michael time?"
    },
    {
      "answer": "Good mornings with a PVC or empty bar, supermans on the floor, or GHD back extensions. The goal is posterior chain endurance under fatigue.",
      "question": "What are good back extension substitutions?"
    },
    {
      "answer": "Michael was named after Navy Lieutenant Michael McGreevy, who died in 2005 during Operation Red Wings. It is a memorial hero WOD honoring his service.",
      "question": "Who was Michael?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'michael';

-- Item 14 (14a): McGhee
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "U.S. Army Staff Sergeant Robert J. McGhee, 30, killed in action in Afghanistan on September 29, 2009. He served with the 3rd Special Forces Group.",
      "question": "Who was Robert McGhee?"
    },
    {
      "answer": "30+ rounds is excellent. The sustained 30-minute format makes consistency more important than speed.",
      "question": "What is a good score for McGhee?"
    },
    {
      "answer": "No — McGhee requires only enough floor space for burpees and air squats. No barbell, no pull-up bar, no equipment needed.",
      "question": "Do I need any equipment for McGhee?"
    },
    {
      "answer": "30 rounds x (5 burpees + 10 air squats) = 150 burpees + 300 air squats = 450 total reps.",
      "question": "How many total reps are in a 30-round performance of McGhee?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'mcghee';

-- Item 14 (14a): Bradley
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "U.S. Air Force Senior Airman Bradley R. Smith, 24, killed by an IED in Kandahar Province, Afghanistan, on January 3, 2010. He is survived by his wife and daughter.",
      "question": "Who was Bradley R. Smith?"
    },
    {
      "answer": "Round 1: 100m sprint + 10 pull-ups. Round 2: 100m sprint + 10 burpees. Rounds 3, 5, 7, 9 are pull-ups; rounds 4, 6, 8, 10 are burpees. 30-second rest between each round.",
      "question": "How does the alternating structure work in Bradley?"
    },
    {
      "answer": "Sub-30 min is strong for most athletes.",
      "question": "What is a good time for Bradley?"
    },
    {
      "answer": "Yes — it is built into the workout structure. Do not skip it, and count it toward your total time.",
      "question": "Is the 30-second rest mandatory?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'bradley';

-- Item 14 (14a): Bull
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "8+ rounds is strong.",
      "question": "What is a good score for Bull?"
    },
    {
      "answer": "65 lb for men, 45 lb for women.",
      "question": "What weight is the overhead squat in Bull?"
    },
    {
      "answer": "1.5 pood (approximately 53 lb) for men, 1 pood (approximately 35 lb) for women.",
      "question": "What size kettlebell is used in Bull?"
    },
    {
      "answer": "10 OHS + 10 K2E + 10 box jumps + 10 KB swings = 40 reps per round.",
      "question": "How many total reps per round in Bull?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'bull';

-- Item 14 (14a): Hotshots 19
update public.benchmark_workouts set
  scoring_notes = $$Your score is your total time. Sub-45 min is exceptional. Most athletes finish in 45–65 min. This WOD is about honoring, not racing.$$,
  faqs = $$[
    {
      "answer": "Hotshots 19 honors the 19 members of the Granite Mountain Hotshots who were killed fighting the Yarnell Hill wildfire on June 30, 2013, near Prescott, Arizona — the deadliest wildfire incident for American firefighters since 9/11.",
      "question": "Who does Hotshots 19 honor?"
    },
    {
      "answer": "Each set of 19 power cleans directly represents the 19 fallen crew members of the Granite Mountain Hotshots. The rep scheme is intentional and meaningful.",
      "question": "Why 19 power cleans per round?"
    },
    {
      "answer": "Hotshots 19 is traditionally performed on or near June 30, the anniversary of the Yarnell Hill wildfire. Many CrossFit affiliates program it as a community memorial workout on that date.",
      "question": "When is Hotshots 19 traditionally performed?"
    },
    {
      "answer": "Most athletes finish in 45–65 min. With appropriate scaling, plan for approximately 45 minutes of sustained effort.",
      "question": "How long does Hotshots 19 take?"
    }
  ]$$::jsonb,
  updated_at = now()
where slug = 'hotshots-19';

-- Item 14 (14a): Eva
update public.benchmark_workouts set
  faqs = $$[
    {
      "answer": "Sub-35 min is strong.",
      "question": "What is a good Eva time?"
    },
    {
      "answer": "Rx is 70# for men, 53# for women. You should be able to do sets of 15+ when fresh. Scale if needed to maintain safe form over 150 total swings.",
      "question": "How heavy should the kettlebell be for Eva?"
    },
    {
      "answer": "Eva combines distance running, heavy KB swings, and high-rep pull-ups over 5 rounds. It tests aerobic endurance, grip strength, and gymnastics stamina — one of the most comprehensive Girl WODs.",
      "question": "What makes Eva different from other Girl WODs?"
    }
  ]$$::jsonb,
  scoring_notes = $$Your score is your finish time. Sub-35 min is strong.$$,
  updated_at = now()
where slug = 'eva';

-- Item 14 (14b), decided by Claude 2026-11-20 (Rob asked for best judgement):
-- the Score line was the outlier on these pages, so it now uses the page's own FAQ figures.

-- Item 14 (14b): kelly
update public.benchmark_workouts set
  scoring_notes = $$Your score is your finish time. Sub-30 min is elite. Sub-45 min is solid.$$,
  duration_estimate = $$30–45 min$$,
  updated_at = now()
where slug = 'kelly';

-- Item 14 (14b): danny
update public.benchmark_workouts set
  scoring_notes = $$Your score is total rounds + reps. 5+ rounds is elite. 4+ rounds is advanced. 3+ rounds is strong.$$,
  updated_at = now()
where slug = 'danny';

-- Item 14 (14b): nate
update public.benchmark_workouts set
  scoring_notes = $$Your score is total rounds + reps. 15+ rounds is elite. 10+ rounds is solid. 7+ rounds is good.$$,
  updated_at = now()
where slug = 'nate';

-- Item 14 (14b): the-chief
update public.benchmark_workouts set
  scoring_notes = $$Your score is total rounds across all 5 AMRAPs. 20+ rounds is excellent. 17+ rounds is solid.$$,
  updated_at = now()
where slug = 'the-chief';

-- Item 14 (14b): the-seven
update public.benchmark_workouts set
  scoring_notes = $$Your score is your finish time. Sub-35 min is elite. Sub-50 min is solid.$$,
  duration_estimate = $$35–50 min$$,
  updated_at = now()
where slug = 'the-seven';

-- Item 14 (14b): tommy-v
update public.benchmark_workouts set
  scoring_notes = $$Your score is your finish time. Sub-20 min is elite. Sub-35 min is solid.$$,
  duration_estimate = $$20–35 min$$,
  updated_at = now()
where slug = 'tommy-v';

-- Item 14 (14b): whitten
update public.benchmark_workouts set
  scoring_notes = $$Your score is your finish time. Sub-45 min is excellent. Sub-60 min is solid.$$,
  duration_estimate = $$45–60 min$$,
  updated_at = now()
where slug = 'whitten';

-- Item 14 (14b): badger
update public.benchmark_workouts set
  scoring_notes = $$Your score is your finish time. Sub-35 min is advanced. Sub-40 min is strong.$$,
  duration_estimate = $$35–45 min$$,
  updated_at = now()
where slug = 'badger';

-- ═══ Item 15: One standard format for score targets ═══

-- Item 15: Open 11.3
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 5 minutes. 20+ reps is elite. 10+ reps is excellent.$$,
  updated_at = now()
where slug = 'open-11-3';

-- Item 15: Open 13.4
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 7 minutes. 54+ reps is strong. 36+ reps is baseline. 36 reps completes the 9-rep round.$$,
  updated_at = now()
where slug = 'open-13-4';

-- Item 15: Open 15.4
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 8 minutes. 36+ reps is strong. 18+ reps is baseline. 18 reps completes the 6-rep round.$$,
  updated_at = now()
where slug = 'open-15-4';

-- Item 15: Open 12.4
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 12 minutes. 240+ reps is excellent. 150+ reps is solid. 150 reps completes the wall balls; 240 reps completes the double-unders.$$,
  updated_at = now()
where slug = 'open-12-4';

-- Item 15: Open 13.3
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 12 minutes. 240+ reps is elite. 240 reps gets you through the wall balls and double-unders to the muscle-ups.$$,
  updated_at = now()
where slug = 'open-13-3';

-- Item 15: Open 15.3
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 14 minutes. 157+ reps is strong. 157 reps is one full round.$$,
  updated_at = now()
where slug = 'open-15-3';

-- Item 15: Open 16.4
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 13 minutes. 110+ reps is solid. 110 reps completes the deadlifts and wall balls. Reaching the row is excellent.$$,
  updated_at = now()
where slug = 'open-16-4';

-- Item 15: Open 16.2
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps. 90+ reps is baseline. 90 reps completes the first window. Each additional window is a significant achievement.$$,
  updated_at = now()
where slug = 'open-16-2';

-- Item 15: Open 13.1
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps. 70+ reps is a strong baseline. 70 reps gets you through the first burpees and the 75 lb snatches.$$,
  updated_at = now()
where slug = 'open-13-1';

-- Item 15: Open 12.2
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 10 minutes. 30+ reps is baseline. 30 reps completes the 75/45 lb snatches. Reaching 135/75 lb is a strong performance for most athletes.$$,
  updated_at = now()
where slug = 'open-12-2';

-- Item 15: Open 14.4
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 14 minutes. 180+ reps is elite. 150+ reps is baseline. 150 reps gets you through the wall balls; 180 reps gets you to the muscle-ups.$$,
  updated_at = now()
where slug = 'open-14-4';

-- Item 15: Open 23.1
update public.benchmark_workouts set
  scoring_notes = $$Your score is total reps in 14 minutes. 180+ reps is elite. Most athletes score 60–150 reps. 180 reps gets you to the muscle-ups.$$,
  updated_at = now()
where slug = 'open-23-1';

-- Item 15: Chelsea
update public.benchmark_workouts set
  scoring_notes = $$Score is total rounds completed in 30 minutes. Completing all 30 rounds is very strong.$$,
  updated_at = now()
where slug = 'chelsea';

commit;
