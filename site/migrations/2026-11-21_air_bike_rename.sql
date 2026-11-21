-- Q9: brand names to Air Bike (Rob chose the general name, 2026-10-05; run at the switch 2026-11-21).
-- RUN AT THE SWITCH (Phase 7), not before: the old site builds movement links from the
-- movement name, so renaming now would break its Daily WOD links. At the switch the names
-- and slugs change together and next.config.ts redirects the old /movements/assault-bike* addresses.
begin;

-- Assault Bike → Air Bike
update movements set name = $$Air Bike$$,
  description = $$The air bike (fan bike) uses both arms and legs at once, making it one of the hardest cardio tools there is. Brands include Assault Bike, Rogue Echo Bike and Schwinn AirDyne. Use it for long steady efforts or short max-effort sprints.$$,
  tips = to_jsonb(array[$$Push AND pull the handles — engage the upper body fully.$$, $$For sprints, build to max effort within the first few seconds.$$, $$For longer efforts, find a sustainable pace you can maintain.$$, $$Sit up tall — don't hunch forward.$$, $$Calories or RPM are your primary metrics.$$]::text[]),
  wod_tip = $$Push and pull the handles — full body output (calories)$$,
  scaling_options = $$[{"level":"beginner","movement":"Easy-pace bike (RPE 5-6)","notes":"Comfortable cadence, upright posture — 60-70 rpm"},{"level":"scaled","movement":"Moderate-pace air bike","notes":"70-80 rpm, consistent push-pull effort on handles"},{"level":"rx","movement":"Air bike","notes":"Aggressive push-pull, 80+ rpm — arms and legs working simultaneously"}]$$,
  common_faults = $$[{"mistake":"Only pedaling, ignoring the handles","fix":"Push and pull the handles while pedaling — the upper body generates significant additional power."},{"mistake":"Stopping completely between intervals","fix":"A slow spin (active recovery) between intervals is better than a dead stop — it keeps blood moving."},{"mistake":"Death grip on handles","fix":"Relax your grip — tight hands fatigue forearms fast and reduce push efficiency."},{"mistake":"Hunching forward","fix":"Stay tall or slight forward lean — collapsing forward reduces breathing capacity."}]$$,
  updated_at = now()
  , slug = 'air-bike'
where slug = 'assault-bike';

-- Assault Bike Calories → Air Bike Calories
update movements set name = $$Air Bike Calories$$,
  description = $$Air bike calories are a high-intensity conditioning format measuring total power output across both arms and legs simultaneously. The calorie metric rewards sustained effort and is a common format in CrossFit programming.$$,
  tips = to_jsonb(array[$$Drive with both arms and legs simultaneously — don't favor one over the other.$$, $$Find a sustainable RPM rather than going all out on rep one.$$, $$Tall posture: don't hunch — keep your chest up for maximum power transfer.$$, $$Use your pull as much as your push on the handles.$$, $$For short calorie targets, sprint from the start; for longer sets, pace and build.$$]::text[]),
  wod_tip = $$Push and pull the handles equally — arms are 30% of your power output$$,
  scaling_options = $$[{"level":"beginner","movement":"Air bike (reduced calorie target)","notes":"Drop to 50-60% of prescribed calories - maintain consistent effort throughout"},{"level":"scaled","movement":"Air bike calories (reduced target)","notes":"Reduce target by 30-40% - use a pace you can sustain for the full workout"},{"level":"rx","movement":"Air Bike Calories","notes":"Full calorie target - drive arms and legs equally and hold a consistent cadence"}]$$,
  common_faults = $$[{"mistake":"Using only legs and ignoring the arms","fix":"Drive the handlebars as hard as you push the pedals - arms contribute significantly to calorie output"},{"mistake":"Starting too fast","fix":"Bike calories spike effort quickly - find a sustainable cadence and hold it rather than blowing up early"},{"mistake":"Hunching forward","fix":"Sit tall with a slight forward lean - a collapsed chest reduces power output and makes breathing harder"},{"mistake":"Short pedal stroke","fix":"Full, powerful circles through the entire pedal stroke - chopping it short under fatigue loses output"}]$$,
  updated_at = now()
  , slug = 'air-bike-calories'
where slug = 'assault-bike-calories';

-- Assault Bike Intervals → Air Bike Intervals
update movements set name = $$Air Bike Intervals$$,
  description = $$Air bike intervals use structured work-to-rest periods to build aerobic capacity and anaerobic power. The bike's resistance-free flywheel means output is entirely effort-driven, making it honest and unforgiving.$$,
  tips = to_jsonb(array[$$Establish your target RPM for work periods and hold it consistently.$$, $$Drive through the whole pedal stroke — push and pull with both legs.$$, $$Arms and legs work together — match the rhythm for maximum efficiency.$$, $$Recover actively between intervals: slow pedaling rather than stopping.$$, $$Track calories or wattage per interval — consistency beats spiking and dying.$$]::text[]),
  wod_tip = $$Max effort each interval — lungs and legs both should be screaming$$,
  scaling_options = $$[{"level":"beginner","movement":"Air bike intervals (extended rest)","notes":"Start at 70% effort with equal work and rest periods - build up to true max effort"},{"level":"scaled","movement":"Air bike intervals (shorter work period)","notes":"Reduce the work interval by 5-10 seconds - maintain true maximum effort each round"},{"level":"rx","movement":"Air Bike Intervals","notes":"20-30 seconds all-out effort followed by full rest - maximum output on every single round"}]$$,
  common_faults = $$[{"mistake":"Not going truly all-out","fix":"Intervals only work if the work periods are maximum effort - if you can hold a conversation, you are not working hard enough"},{"mistake":"Inconsistent output across rounds","fix":"Note your calorie output in round 1 and try to match it every round - consistency is the goal of interval training"},{"mistake":"Stopping before the time is up","fix":"Keep pedaling even as power drops - the time interval completes the rep, not exhaustion"},{"mistake":"Excessive tension in the upper body","fix":"Relax the shoulders and neck - tension above the chest wastes energy that should go into the pedals"}]$$,
  updated_at = now()
  , slug = 'air-bike-intervals'
where slug = 'assault-bike-intervals';

-- Triple 3 FAQ: "An assault bike" → "An air bike"
update benchmark_workouts set faqs = replace(faqs::text, 'An assault bike', 'An air bike')::jsonb, updated_at = now() where slug = 'triple-3';

-- Echo Bike page: compare with air bikes in general, not one brand
update movements set description = $$Similar to other air bikes but more leg-dominant, the Echo Bike is a fan bike used frequently in CrossFit competition. Programmed for calories or watts.$$, updated_at = now() where slug = 'echo-bike';

commit;