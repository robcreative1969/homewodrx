-- Coe was written up as a 1-10 ladder of ring dips and thrusters. The official Hero WOD
-- (crossfit.com/benchmark/coe) is 10 rounds of 10 thrusters (95/65 lb) and 10 ring push-ups,
-- which is what the page's video shows. Rob spotted it 2026-11-22.
do $$
declare n int;
begin
  update benchmark_workouts set
    scheme = '10 Rounds For Time',
    duration_estimate = '8–20 min',
    description = 'Coe honors U.S. Army Sgt. Coe with 10 rounds of 10 thrusters and 10 ring push-ups. That adds up to 100 thrusters at 95/65 lb, the same weight as Fran, and 100 ring push-ups.

The two movements hit the same muscles from different angles. Thrusters tax the legs, lungs and shoulders, and ring push-ups make the chest, triceps and shoulders work while the rings move under you. Neither is hard for one round. The challenge is holding steady, repeatable sets for ten rounds while the pressing fatigue builds. Under 12 minutes is a strong time; most athletes finish in 12 to 20.',
    movements = '[{"name":"Thrusters","reps":"10","rx_men":"95 lb","rx_women":"65 lb","tip":"Drive from the squat; lock out overhead"},{"name":"Ring Push-Ups","reps":"10","tip":"Body in a straight line; rings to the chest"}]'::jsonb,
    scoring_notes = 'Record your finish time. Sub-8 min is elite. Sub-12 min is strong. Sub-16 min is a solid benchmark.',
    tips = '["Pick a thruster set you can repeat all 10 rounds","Break the ring push-ups early, before they fail","Move straight from the bar to the rings"]'::jsonb,
    scaling_notes = 'Reduce the thrusters to 65-75 lb for men and 45-55 lb for women, or use dumbbells. Scale ring push-ups by raising the rings (feet on the floor, body at an angle) or by doing push-ups on the floor. Keep all 10 rounds of 10 if you can; cut to 5 to 7 rounds for a shorter session.',
    coaching_tips = '["Thrusters: hit full depth, then drive hard so the bar floats overhead. Aim for the same set plan every round, for example 10 unbroken or 6 and 4.","Ring push-ups: keep a tight plank from head to heel and bring the rings to your chest at the bottom. Turn the hands out slightly at the top.","Split the ring push-ups before you reach failure. Short planned breaks are faster than long rests after a failed rep.","Do not rest at the bar. Walk straight from the thrusters to the rings, and take any recovery while setting up, not while standing still.","Rounds 4 to 7 decide the time. Keep them the same speed as rounds 1 to 3."]'::jsonb,
    faqs = '[{"question":"What is a good time for Coe?","answer":"Under 12 minutes is strong. Most athletes finish in 12 to 20 minutes, mostly depending on how well they hold up on the ring push-ups."},{"question":"How many total reps are in Coe?","answer":"200: 100 thrusters and 100 ring push-ups across 10 rounds."},{"question":"What weight are the thrusters in Coe?","answer":"95 lb for men and 65 lb for women, the same as Fran."},{"question":"What can I do if I do not have rings?","answer":"Use regular push-ups, or push-ups with your hands on two stable boxes or dumbbells so your chest can go below your hands."}]'::jsonb,
    updated_at = now()
  where slug = 'coe';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'expected 1 row, got %', n; end if;
end $$;
select slug, scheme, movements->0->>'name' as m1, movements->1->>'name' as m2 from benchmark_workouts where slug = 'coe';
