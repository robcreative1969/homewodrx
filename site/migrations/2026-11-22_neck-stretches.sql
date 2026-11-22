-- Neck stretches (Rob asked for a Neck area in the Stretch Builder, 2026-11-22).
-- Adds 5 stretches with focus 'neck' and tags the existing Neck Rolls as neck too.
-- Videos checked through YouTube oEmbed (embeddable) on 2026-11-22.
do $$
declare n int;
begin
  if exists (select 1 from stretches where slug in ('upper-trap-stretch','levator-scapulae-stretch','chin-tucks','neck-rotation-stretch','scalene-stretch')) then
    raise exception 'a neck stretch already exists; nothing changed';
  end if;

  insert into stretches (name, slug, modality, focus, level, sides, hold_beginner, hold_intermediate, hold_advanced, tip, youtube_url, description, cues) values
  ('Upper Trap Stretch', 'upper-trap-stretch', 'static', array['neck','shoulders'], array['b','i','a'], true, 30, 40, 60,
   'Hold the chair or tuck your hand behind your back so the shoulder can''t creep up',
   'https://www.youtube.com/watch?v=2uI_adZ1png',
   'The upper trapezius runs from the base of the skull across the top of the shoulder. It tightens with long hours at a desk, carrying bags, and shrugging through heavy pulls and overhead work, and it is often where neck tension and stiffness collect. This stretch lengthens the side of the neck while the shoulder stays anchored down.',
   array['Sit or stand tall with your shoulders relaxed.',
         'Hold the edge of the chair with your right hand, or reach it down and behind your back, to keep the right shoulder down.',
         'Tilt your left ear toward your left shoulder until you feel a stretch along the right side of your neck.',
         'For a little more, rest your left hand on the side of your head and let its weight add gentle pressure. Don''t pull.',
         'Breathe slowly and let the right shoulder sink further with each breath out.',
         'Come up slowly, then switch sides.']),

  ('Levator Scapulae Stretch', 'levator-scapulae-stretch', 'static', array['neck','shoulders'], array['b','i','a'], true, 30, 40, 60,
   'Look toward your armpit, not your knee, and keep the shoulder blade down',
   'https://www.youtube.com/watch?v=0_RO8NbdKBc',
   'The levator scapulae runs from the top of the neck down to the inside corner of the shoulder blade. It is the muscle behind the stiff spot at the back corner of the neck that many desk workers know well, and it works hard to hold the head up when posture drifts forward. Turning the head and looking down toward the armpit stretches it more directly than a plain side bend.',
   array['Sit or stand tall. Reach your right hand up and place it on your right shoulder blade, or hold the chair with it, to keep the shoulder down.',
         'Turn your head about 45 degrees to the left, so your nose points toward your left armpit.',
         'Gently drop your chin toward that armpit until you feel a stretch at the back right corner of your neck.',
         'For a little more, rest your left hand on the back of your head and let its weight add gentle pressure.',
         'Keep breathing and keep the right shoulder low.',
         'Come up slowly, then switch sides.']),

  ('Chin Tucks', 'chin-tucks', 'static', array['neck'], array['b','i','a'], false, null, null, null,
   'Slide the head straight back as if making a double chin; don''t nod down',
   'https://www.youtube.com/watch?v=ekJzJTnd43s',
   'Chin tucks gently stretch the base of the skull and train the deep neck muscles that hold the head over the shoulders. They are a simple fix for the forward head position that builds up from screens, driving and long sessions on a rower or bike, and they help you keep a neutral neck under the bar.',
   array['Sit or stand tall with your shoulders relaxed and your eyes looking straight ahead.',
         'Without tipping your head up or down, slide your chin straight back, as if making a double chin.',
         'You should feel a gentle stretch at the base of your skull and the back of your neck.',
         'Hold for 3 to 5 seconds, then relax forward to the start.',
         'Keep the movement small and smooth. Your eyes stay level the whole time.',
         'Repeat for the set number of reps.']),

  ('Neck Rotation Stretch', 'neck-rotation-stretch', 'static', array['neck'], array['b','i','a'], true, 20, 30, 40,
   'Turn from the neck only; keep the chest and shoulders facing forward',
   'https://www.youtube.com/watch?v=GOanspvMlZQ',
   'Turning the head is one of the first movements to stiffen after long hours facing a screen or the road. This stretch takes the neck slowly to the end of its turn and holds there, easing the muscles along the side and back of the neck and making it easier to look over your shoulder.',
   array['Sit or stand tall with your shoulders relaxed and your chest facing forward.',
         'Slowly turn your head to the right as far as is comfortable, keeping your chin level.',
         'Hold where you feel a gentle stretch. You can rest your fingertips on your chin to ease it a touch further.',
         'Keep your shoulders still and breathe slowly.',
         'Return to the middle slowly, then turn to the left.']),

  ('Scalene Stretch', 'scalene-stretch', 'static', array['neck'], array['b','i','a'], true, 20, 30, 45,
   'Gentle pressure only; ease off if you feel tingling down the arm',
   'https://www.youtube.com/watch?v=LQVfMP-d0A8',
   'The scalenes run down the front and sides of the neck to the top ribs. They help you breathe hard, which is why they tighten after conditioning work, and they also tighten with a forward head position. Stretching them eases the front of the neck, which the usual side stretches miss.',
   array['Sit or stand tall. Place both hands flat on your right collarbone, one on top of the other, and press gently down to anchor it.',
         'Tilt your head to the left, bringing your left ear toward your left shoulder.',
         'Slowly tip your chin up a little and turn it slightly away from the right side until you feel a stretch along the front right side of your neck.',
         'Hold and breathe slowly. Keep the pressure on the collarbone light.',
         'If you feel tingling or numbness in the arm, ease off.',
         'Come back to the middle slowly, then switch sides.']);
  get diagnostics n = row_count;
  if n <> 5 then raise exception 'expected 5 inserts, got %', n; end if;

  update stretches set focus = array['neck','shoulders','back'] where slug = 'neck-rolls';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'neck-rolls not found'; end if;
end $$;
select slug, focus, hold_intermediate from stretches where 'neck' = any(focus) order by slug;
