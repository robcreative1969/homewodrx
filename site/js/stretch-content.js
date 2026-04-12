// ============================================================================
// STRETCH CONTENT — HomeWODrx
// Rich content for individual stretch pages at /stretches/:slug
// Keyed by slug (generated from stretch name via slugify)
//
// To add a YouTube video: set youtube to the 11-char video ID (e.g. 'dQw4w9WgXcQ')
// Run the slugify helper below to verify a stretch's slug:
//   slugify('Hip Flexor Stretch') → 'hip-flexor-stretch'
// ============================================================================

// slugify(name) mirrors the function in stretch-movement.html
// function slugify(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}

const STRETCH_CONTENT = {

  // ── STATIC ─────────────────────────────────────────────────────────────────

  'hip-flexor-stretch': {
    description: 'The hip flexor stretch targets the iliopsoas and rectus femoris — the deep muscles that connect your spine and pelvis to your thigh bone. Prolonged sitting shortens these muscles, leading to anterior pelvic tilt, limited squat depth, and nagging lower-back pain. For athletes, restoring hip flexor length is one of the highest-return mobility investments you can make.',
    cues: [
      'Start in a half-kneeling position: one knee on the floor, opposite foot flat in front of you, front shin vertical.',
      'Ensure your front knee is directly above your ankle — not caved in or pushed past the toes.',
      'Brace your core lightly and squeeze the glute of your back leg. This posterior pelvic tilt is what actually accesses the hip flexor.',
      'Gently drive your hips forward until you feel a deep stretch at the front of the rear hip. The stretch should live in the hip, not the lower back.',
      'To deepen: raise the arm on the same side as your kneeling leg overhead and lean slightly away from it.',
      'Breathe steadily throughout the hold, then release and switch sides.',
    ],
    youtube: 'hscXjknpoCs'
  },

  'seated-hamstring-stretch': {
    description: 'The seated hamstring stretch lengthens the biceps femoris, semimembranosus, and semitendinosus along the back of the thigh. Flexible hamstrings protect the lower back during deadlifts and Olympic lifts, and reduce the risk of strains during sprinting. The seated position provides a stable base that makes it easier to isolate the hamstrings without compensating through the lower back.',
    cues: [
      'Sit on the floor with both legs extended straight in front of you, feet flexed toward the ceiling.',
      'Sit tall on your sitting bones — avoid rounding your lower back by actively lengthening through the crown of your head.',
      'Hinge forward from the hips (not the waist) as if you are trying to lay your chest down your thighs.',
      'Reach your hands toward your feet or shins, whichever you can reach while maintaining a flat spine.',
      'Stop the forward lean at the point where your lower back starts to round — depth comes from hip mobility, not spinal flexion.',
      'Hold, breathing into the back of your thighs. Use each exhale to relax a little further into the stretch.',
    ],
    youtube: 'W2k8DMxK7zI'
  },

  'standing-quad-stretch': {
    description: 'The standing quad stretch targets the rectus femoris and the other muscles of the quadriceps group along the front of the thigh. Tight quads contribute to knee pain, hip impingement, and restricted squat depth. This is a quick, equipment-free stretch that can be done anywhere.',
    cues: [
      'Stand tall near a wall or rack for balance if needed. Shift your weight onto one foot.',
      'Bend your opposite knee and reach back to grab the top of your foot or ankle — not the toes.',
      'Pull your heel toward your glute while keeping your knees close together (the bent knee should stay in line with or behind the standing knee).',
      'Stand tall and avoid leaning forward at the hip — tuck your pelvis slightly to increase the stretch.',
      'If you cannot reach your foot, loop a resistance band around your ankle.',
      'Hold, then slowly lower the foot and switch sides.',
    ],
    youtube: '3bWWW81IbPI'
  },

  'pigeon-pose': {
    description: 'Pigeon pose is one of the most effective hip-opening stretches in any athlete\'s toolkit, targeting the piriformis, glutes, and hip external rotators. It directly addresses the hip tightness that builds up from squatting, running, and sitting. The pose appears in both static and yoga-inspired stretch sessions because of its unmatched ability to open the external hip.',
    cues: [
      'Start in a downward-facing dog or tabletop position. Bring your right knee forward toward your right wrist.',
      'Slide your right foot toward your left wrist, allowing your right shin to rest at an angle on the mat. The more parallel your shin is to the front of the mat, the deeper the stretch.',
      'Extend your left leg straight behind you with the top of the foot on the floor. Square your hips toward the mat as much as possible.',
      'Place a folded blanket or block under your right glute if your hip doesn\'t reach the floor — this protects the knee and makes the stretch accessible.',
      'You can stay upright on your hands or fold forward and rest on your forearms or forehead for a deeper release.',
      'Hold, breathing deeply into the outer hip, then carefully come back to hands and knees and switch sides.',
    ],
    youtube: '0_zPqA65Nok'
  },

  'figure-4-stretch': {
    description: 'The figure-4 stretch (also called the supine pigeon) targets the piriformis and glutes through the same hip external rotation as pigeon pose, but lying on your back — making it more accessible and easier on the knee. It is excellent for athletes who sit for long periods or who have experienced tight hips from heavy squatting.',
    cues: [
      'Lie on your back with both knees bent and feet flat on the floor.',
      'Cross your right ankle over your left thigh, just above the knee. Flex your right foot to protect the knee joint.',
      'Gently press your right knee away from your body to begin feeling the stretch in the right glute and outer hip.',
      'For a deeper stretch, lift your left foot off the floor, interlace your hands behind your left thigh, and draw it toward your chest.',
      'Keep your lower back flat on the floor and your head and shoulders relaxed. Do not strain your neck.',
      'Hold, then release and switch sides.',
    ],
    youtube: '6sx9hFoP1lg'
  },

  'butterfly-stretch': {
    description: 'The butterfly stretch opens the inner thighs, groin, and hip adductors, areas that often get neglected in standard lower-body training. Tight adductors limit squat width and depth, reduce hip rotation, and contribute to groin strains. This beginner-friendly stretch requires no equipment and is a staple of any comprehensive recovery routine.',
    cues: [
      'Sit on the floor with a tall spine. Bring the soles of your feet together in front of you and let your knees fall open to the sides.',
      'Draw your feet in toward your groin as close as is comfortable. Closer feet create a more intense inner-thigh stretch.',
      'Sit up tall — avoid rounding your lower back. Tilt your pelvis slightly forward to increase the stretch.',
      'Place your hands on your feet or ankles. You can use your elbows to gently press your knees toward the floor.',
      'Do not force your knees down — let gravity do the work as your hips relax over time.',
      'Hold while breathing steadily. Try to release a little deeper with each exhale.',
    ],
    youtube: 'B6tb4TncKhY'
  },

  'supine-hamstring-stretch': {
    description: 'The supine hamstring stretch uses gravity and the stability of the floor to isolate the hamstrings without the postural demands of the seated version. Looping a resistance band or towel around the foot allows precise control of the stretch intensity. This is particularly effective for post-workout recovery when the legs are fatigued.',
    cues: [
      'Lie on your back with both legs extended. Loop a resistance band, towel, or strap around the sole of one foot.',
      'Keeping the opposite leg flat on the floor (or bent if needed for lower back comfort), slowly raise the strapped leg toward the ceiling.',
      'Keep a slight bend in the raised knee — the stretch should be felt in the hamstring, not behind the knee joint itself.',
      'Hold the strap with both hands and gently pull the leg toward you until you feel a strong but tolerable stretch.',
      'Flex the foot (toes toward shin) to increase the stretch intensity, or point it to decrease.',
      'Hold, breathing steadily, then slowly lower the leg and switch sides.',
    ],
    youtube: null
  },

  'standing-calf-stretch': {
    description: 'The standing calf stretch targets the gastrocnemius, the large two-headed calf muscle most visible on the back of the lower leg. Tight calves restrict ankle dorsiflexion, directly limiting squat depth and loading mechanics. With the knee straight, this stretch focuses on the gastrocnemius rather than the deeper soleus.',
    cues: [
      'Stand facing a wall or rig. Place both hands on the wall for support.',
      'Step one foot back so it is about 2–3 feet behind you. Keep the back heel firmly planted on the floor.',
      'Keep the back knee straight throughout the stretch — a bent knee shifts the target to the soleus (see Soleus Stretch).',
      'Lean your body forward toward the wall by bending your front knee until you feel a firm stretch in the calf of the back leg.',
      'Keep your back foot pointing straight ahead (not flared out) for maximum stretch.',
      'Hold, then switch sides.',
    ],
    youtube: '5C24Pv4ahVg'
  },

  'soleus-stretch': {
    description: 'The soleus is the deep, flat calf muscle that lies beneath the gastrocnemius. It becomes the primary calf stretching target when the knee is bent, making this a distinct stretch from the standing calf stretch with a straight knee. The soleus plays a major role in running push-off and ankle stability, and tightness here is a common contributor to Achilles tendon issues.',
    cues: [
      'Stand facing a wall with both hands on it for support. Step one foot back, heel on the floor.',
      'Bend both your front and back knees slightly — the bend in the back knee is the key difference from the standard calf stretch.',
      'Keep the heel of the back foot pressed firmly into the floor.',
      'Gently lean forward until you feel the stretch low in the calf and just above the Achilles tendon of the back leg.',
      'Adjust the depth by bending the back knee more (deeper) or less (lighter).',
      'Hold, then switch sides.',
    ],
    youtube: null
  },

  'cross-body-shoulder-stretch': {
    description: 'The cross-body shoulder stretch targets the posterior deltoid and teres minor — the muscles on the back of the shoulder that often become tight from overhead pressing, bench pressing, and kipping movements. Restoring posterior shoulder mobility is important for healthy shoulder mechanics in any pressing or overhead sport.',
    cues: [
      'Stand or sit tall. Extend one arm straight across your body at shoulder height.',
      'Use your opposite hand to gently press the extended arm closer to your chest, just above the elbow.',
      'Keep the shoulder of the stretched arm pressed down — resist the urge to shrug it up toward your ear.',
      'Rotate your head gently away from the stretched arm to add a light neck component.',
      'You should feel the stretch in the back of the shoulder (posterior deltoid). If you feel it in the front of the shoulder, adjust the arm angle.',
      'Hold, then switch arms.',
    ],
    youtube: null
  },

  'doorway-chest-stretch': {
    description: 'The doorway chest stretch opens the pectoralis major and minor along with the anterior deltoid — the muscles that can become shortened from heavy bench pressing, overhead work, and the forward-rounded posture of desk work. Restoring chest flexibility improves overhead shoulder mobility and upright posture.',
    cues: [
      'Stand in a doorway. Place your forearm against one side of the door frame with your elbow at 90°.',
      'Position your elbow at shoulder height or slightly below. Higher elbow positions target the lower pectorals; lower positions target the upper pectorals.',
      'Gently step one foot forward through the doorway while rotating your chest away from the placed forearm.',
      'You should feel an opening across the front of your chest and the front of your shoulder. Avoid leaning forward — keep your torso upright.',
      'Adjust the arm height to find the spot that feels most restricted.',
      'Hold, then switch sides (or use both arms simultaneously if your doorway allows).',
    ],
    youtube: null
  },

  'overhead-tricep-stretch': {
    description: 'The overhead tricep stretch targets the long head of the triceps brachii as it crosses both the elbow and shoulder joints. Flexible triceps support overhead pressing mechanics and are especially relevant for athletes doing snatches, overhead squats, or handstand push-ups. The long head of the triceps is only fully stretched when the arm is raised overhead.',
    cues: [
      'Stand or sit tall. Raise one arm overhead, then bend at the elbow so your hand drops behind your head.',
      'Your elbow should point straight toward the ceiling, not flared out to the side.',
      'Use your opposite hand to gently press the raised elbow back and slightly across the center of your head.',
      'You should feel the stretch running down the back of your upper arm. Avoid pushing so hard that the arm crosses forward or the elbow drops.',
      'Keep your core braced to prevent excessive arching of the lower back.',
      'Hold, then switch arms.',
    ],
    youtube: 'mveTEZvyxIY'
  },

  'child-s-pose': {
    description: 'Child\'s pose is a foundational resting stretch that simultaneously opens the hips, lengthens the lower and mid back, and extends the lats. It is accessible to nearly all fitness levels and serves as both a gentle opener and a recovery position between intense efforts. Reaching hands to one side introduces a beneficial lateral bias that targets the oblique sling.',
    cues: [
      'Begin on all fours with your hands under your shoulders and knees under your hips.',
      'Bring your big toes together and widen your knees to about hip-width apart (or wider for a deeper hip stretch).',
      'Sit your hips back toward your heels as you walk your hands forward along the mat.',
      'Lower your forehead to the floor or a block. Let your arms extend fully and relax your shoulders.',
      'To bias the lats, walk both hands to one side and hold, then switch sides.',
      'Breathe deeply, allowing your lower back to release with each exhale. This is a passive, restorative stretch — no forcing.',
    ],
    youtube: 'eqVMAPM00DM'
  },

  'cat-cow-stretch': {
    description: 'Cat-Cow is a dynamic spinal mobility flow that moves the spine through flexion and extension in sync with the breath. It warms up the thoracic and lumbar vertebrae, activates the deep spinal erectors, and is one of the most effective ways to reduce early-morning back stiffness. It\'s a perfect primer before any lower body or pulling session.',
    cues: [
      'Begin on all fours with wrists under shoulders and knees under hips. Spine is neutral.',
      'Inhale: let your belly drop toward the floor as you lift your tailbone and gaze forward or slightly upward (Cow). Think long spine, not collapsed lumbar.',
      'Exhale: round your spine to the ceiling, tuck your tailbone, and draw your navel toward your spine (Cat). Your gaze drops to the floor.',
      'Move slowly and with control — the breath drives the movement. Avoid rushing through the range.',
      'Try to feel each vertebra moving sequentially, from tailbone to skull.',
      'Complete the prescribed reps, using the full breath to maximize spinal range of motion.',
    ],
    youtube: 'y39PrKY_4JM'
  },

  'seated-spinal-twist': {
    description: 'The seated spinal twist mobilizes the thoracic and lumbar vertebrae through rotation while also stretching the hip external rotators and glutes. Spinal rotation tends to be the first range of motion lost with age and inactivity, and restoring it pays dividends in overhead mechanics, running efficiency, and overall movement quality.',
    cues: [
      'Sit tall on the floor with both legs extended. Bend your right knee and cross it over your left leg, placing the right foot flat on the floor outside your left knee.',
      'Press the sole of your right foot firmly into the floor to anchor the position.',
      'On an inhale, grow tall through the crown of your head. On the exhale, rotate your torso to the right.',
      'Hook your left elbow on the outside of your right knee to deepen the twist. Use the elbow as a lever — don\'t force the rotation with your arm.',
      'Place your right hand on the floor behind your right hip to help support an upright spine.',
      'Hold the twist, breathing steadily. Try to lengthen on each inhale and rotate a little further on each exhale. Switch sides.',
    ],
    youtube: null
  },

  'standing-side-stretch': {
    description: 'The standing side stretch targets the quadratus lumborum, obliques, intercostals, and the lat on the reaching side. The lateral chain is often overlooked in standard mobility work, but tightness here restricts overhead reach and contributes to one-sided lower back pain. This is an excellent warm-up for any overhead or snatching session.',
    cues: [
      'Stand tall with feet hip-width apart. Raise one arm overhead, keeping the other arm relaxed at your side.',
      'On an exhale, reach the raised arm in a long arc overhead and to the opposite side. Think of making a rainbow with your arm, not collapsing at the waist.',
      'Let your opposite arm slide down the side of your leg toward your knee — do not pull on your head.',
      'Keep both feet grounded and avoid rotating your hips. The stretch should feel like a long opening from your hip to your fingertips.',
      'Gaze forward or slightly upward. Breathe into the ribs on the stretched side.',
      'Hold, then return to center and switch sides.',
    ],
    youtube: 'k_JxmsQQNpQ'
  },

  'sleeper-stretch': {
    description: 'The sleeper stretch is a targeted posterior shoulder capsule stretch that directly improves internal rotation range of motion at the glenohumeral joint. Limited internal rotation is one of the most common shoulder mobility restrictions in athletes who throw, press, or do high volumes of overhead work, and is strongly linked to rotator cuff impingement.',
    cues: [
      'Lie on your side with the target shoulder on the bottom. Your bottom arm is extended in front of you at shoulder height, perpendicular to your torso.',
      'Bend your bottom elbow to 90°, so your forearm points toward the ceiling.',
      'Stack your hips and keep your torso perpendicular to the floor — do not let your chest roll forward.',
      'Using your top hand, gently press your bottom wrist/forearm toward the floor (internally rotating the shoulder). Move slowly.',
      'Stop when you feel a firm stretch deep in the back of the bottom shoulder. Never force through pain.',
      'Hold, breathe steadily, then release and switch sides.',
    ],
    youtube: null
  },

  'lat-stretch-at-wall': {
    description: 'The lat stretch at a wall targets the latissimus dorsi — the broad back muscle that connects the pelvis to the upper arm. Tight lats restrict overhead pressing range of motion, limit bar path in snatches, and can contribute to rib flare and lumbar hyperextension overhead. This stretch is a must before any overhead or pulling session.',
    cues: [
      'Stand facing a squat rack, pull-up bar, or door frame. Extend one arm and grab the support at approximately hip to chest height.',
      'Step back and hinge at the hips until your torso is roughly parallel to the floor, arm extended above your head.',
      'Gently sit your hips back and away from the support, keeping your spine long. The lat of the outstretched arm should begin to lengthen.',
      'Try to rotate your armpit toward the floor to create more internal rotation and intensify the lat stretch.',
      'Avoid rounding your upper back — keep reaching long and breathing into the side of your torso.',
      'Hold, then switch sides.',
    ],
    youtube: 'eaetG6NgJFM'
  },

  // ── DYNAMIC ────────────────────────────────────────────────────────────────

  'leg-swings-front-to-back': {
    description: 'Front-to-back leg swings are a dynamic warm-up drill that mobilizes the hip through its sagittal plane range of motion, engaging the hip flexors, hamstrings, and glutes. The momentum-driven nature of the movement stimulates the nervous system and synovial fluid production in the hip joint without the tissue stress of static stretching, making this ideal immediately before training.',
    cues: [
      'Stand sideways to a wall or rig, with one hand resting lightly on it for balance. Place feet hip-width apart.',
      'Shift your weight onto the inside leg. Let the outer leg hang freely.',
      'Begin swinging the free leg forward and back in a relaxed, pendulum motion. Start with small swings and gradually increase amplitude over the first few reps.',
      'Allow the leg to swing as freely as possible — the momentum, not muscular contraction, should drive the movement to its full range.',
      'Keep your torso upright and your core lightly braced. Do not let your lower back rotate as the leg swings.',
      'Complete all reps on one side, then turn around and repeat on the other leg.',
    ],
    youtube: 'A2x0oG58nD8'
  },

  'leg-swings-side-to-side': {
    description: 'Side-to-side leg swings mobilize the hip in the frontal plane, targeting the adductors and abductors. This complements front-to-back swings to achieve full hip joint warm-up. This plane of motion is often neglected before training but is critical for lateral movements, box jumps, and wide-stance squatting.',
    cues: [
      'Stand facing a wall or rig with both hands resting on it. Feet hip-width apart, weight on both feet initially.',
      'Shift your weight onto one leg and let the other leg hang freely to the side.',
      'Swing the free leg across your midline (toward the opposite leg) and then out to the side in a smooth arc.',
      'Allow the leg to cross behind the standing leg slightly on the inward swing.',
      'Gradually increase the amplitude of the swing, but do not force range. The hip should remain in its socket.',
      'Keep your hips square to the wall throughout — do not let them rotate. Complete all reps on one side, then switch.',
    ],
    youtube: 'EKhwBoKMm-c'
  },

  'hip-circles': {
    description: 'Hip circles are a simple but effective dynamic warm-up that moves the femoral head through the full circumduction range of the hip socket. The movement primes the hip joint, activates the deep hip stabilizers, and helps identify any range-of-motion asymmetries before loading the hips under a barbell.',
    cues: [
      'Stand with feet hip-width apart and hands on your hips or outstretched for balance.',
      'Shift your weight onto one leg. Lift the opposite knee to hip height.',
      'Rotate the raised knee outward in a large, controlled circle — forward, out, back, and in. This is one rep.',
      'Keep your torso upright and stationary. The movement is entirely in the hip, not the spine.',
      'Complete half the reps circling in one direction, then reverse the circle direction for the remaining reps.',
      'Switch legs and repeat.',
    ],
    youtube: null
  },

  'arm-circles': {
    description: 'Arm circles warm up the glenohumeral joint through full circumduction, lubricating the shoulder with synovial fluid and activating the rotator cuff. Starting with small circles and progressing to large ones allows the shoulder to adapt progressively. This is a foundational warm-up before any pressing, pulling, or overhead session.',
    cues: [
      'Stand tall with feet hip-width apart and arms extended out to the sides at shoulder height, palms facing down.',
      'Begin making small forward circles with both arms simultaneously. Keep the arms fully extended.',
      'Gradually increase the circle size over the first several reps until you are making the largest circles possible.',
      'After completing the prescribed reps in the forward direction, reverse to backward circles.',
      'Keep your core braced and torso still — only the shoulders and arms move.',
      'You can also do single-arm circles to focus on one shoulder at a time.',
    ],
    youtube: 'YLypUVjZEj0'
  },

  'shoulder-pass-throughs': {
    description: 'Shoulder pass-throughs use a PVC pipe or broomstick to actively move the shoulders through a full overhead arc, stretching the pec minor, anterior deltoid, and internal rotators while activating the scapular stabilizers. This is a direct assessment and warm-up tool for overhead mobility, and the grip width required tells you a great deal about your current shoulder flexibility.',
    cues: [
      'Hold a PVC pipe or broomstick with a wide overhand grip — start with hands just outside shoulder-width and adjust from there.',
      'Stand tall with arms extended in front of you at hip height, palms facing your thighs.',
      'Keeping your arms straight, slowly lift the bar in an arc overhead and continue behind you until it touches the back of your thighs.',
      'If the movement is impossible or you feel impingement, widen your grip. Only work within your current range.',
      'Reverse the motion to bring the bar back to the front. This completes one rep.',
      'As mobility improves over weeks, gradually narrow your grip width.',
    ],
    youtube: 'rkb_lOtTx-U'
  },

  'thoracic-rotations': {
    description: 'Thoracic rotations on all fours specifically target the thoracic spine — the mid-back region that is often the most restricted area of the spine in athletes. Improving thoracic rotation directly impacts overhead mechanics, front rack position, and rotation in throwing or rowing motions. This drill is highly effective as a daily maintenance practice.',
    cues: [
      'Start on all fours with wrists under shoulders, knees under hips, and spine in a neutral position.',
      'Place one hand behind your head, elbow pointing to the side. Brace your core lightly.',
      'Begin by dropping that elbow toward the floor, rotating your thoracic spine downward. Your gaze follows the elbow.',
      'Reverse the rotation, sweeping the elbow up toward the ceiling as far as your thoracic spine allows. Follow the elbow with your eyes.',
      'The movement should come entirely from your mid-back — not your lower back, which should remain stable.',
      'Complete all reps on one side, then switch arms.',
    ],
    youtube: 'KDVVUKTi3qc'
  },

  'world-s-greatest-stretch': {
    description: 'The World\'s Greatest Stretch earns its name by combining a hip flexor stretch, thoracic rotation, hamstring stretch, and ankle mobilization all in a single flowing movement. It is arguably the single most efficient whole-body mobility drill available. A few reps on each side can meaningfully prepare the entire body for a complex training session.',
    cues: [
      'Begin in a pushup or high plank position. Step your right foot forward and place it outside your right hand, coming into a lunge.',
      'Lower your back knee to the floor if needed to find a stable position. Your front shin should be vertical.',
      'Drop your left (inside) forearm to the floor. Feel the hip opening in the right hip.',
      'Now rotate your right arm up toward the ceiling, following it with your eyes. Your chest opens to the right. Hold briefly.',
      'Return your right hand to the floor, then straighten your front leg slightly to load the hamstring if desired.',
      'Return to plank and step the left foot forward to repeat on the other side. This completes one rep per side.',
    ],
    youtube: null
  },

  'hip-90-90-transitions': {
    description: 'The 90/90 hip position places both hips into 90° of flexion simultaneously — one hip in external rotation, one in internal rotation — making it one of the most comprehensive hip mobility assessments and drills available. Transitioning between sides exposes and addresses asymmetries in hip rotation that can contribute to back pain and restricted movement patterns.',
    cues: [
      'Sit on the floor with both knees bent at 90°, one shin facing forward and one facing to the side. Both knees stay on the floor.',
      'The front leg is in external rotation (shin perpendicular to your torso), and the back leg is in internal rotation (shin parallel to your torso).',
      'Sit as tall as possible. Do not round into the lower back to achieve the position — use a folded blanket under your seat if needed.',
      'Hold the position for a breath or two, then "windshield-wiper" both knees to the opposite side in a smooth, controlled motion.',
      'If one transition is significantly harder, that hip direction is your restriction. Spend extra holds on that side.',
      'Build up transitions over time until the movement feels smooth and effortless in both directions.',
    ],
    youtube: '_I6vFSlcyPY'
  },

  'ankle-circles': {
    description: 'Ankle circles mobilize the talocrural and subtalar joints, improving the range of motion that translates directly to squat depth, jump mechanics, and running stride efficiency. Limited ankle dorsiflexion is one of the most common mobility restrictions athletes don\'t know they have, and regular ankle circles are a simple daily maintenance habit.',
    cues: [
      'Sit on a box or bench, or stand on one leg. Lift the target foot off the floor.',
      'Extend the ankle (point the toes) and begin drawing slow, deliberate circles in the largest range you can manage.',
      'Complete the prescribed reps clockwise, then switch to counterclockwise for the same number.',
      'Try to feel all segments of the circle — forward, out, back (dorsiflexion), and in.',
      'Go slowly and deliberately. Ankle circles are about range and control, not speed.',
      'Switch feet and repeat.',
    ],
    youtube: 'lwSExRmYENQ'
  },

  'spiderman-lunges': {
    description: 'The Spiderman lunge is a dynamic mobility drill from the plank position that deeply opens the hip flexors, groin, and thoracic spine. The movement pattern mirrors what happens at the hip during sprinting and changes of direction, making it an excellent sport-specific warm-up. The low, hip-opening position creates a substantial stretch that static lunge drills often miss.',
    cues: [
      'Begin in a high plank position with arms fully extended, hands under shoulders.',
      'Step your right foot forward to the outside of your right hand. Your right knee is tracking over your right foot.',
      'Lower your hips toward the floor and hold for 1–2 seconds, feeling the stretch in the left hip flexor and right groin.',
      'You can add a thoracic rotation here: rotate your right arm up toward the ceiling, then return to the plank.',
      'Return the right foot to the plank position and repeat with the left foot.',
      'Alternate sides for the prescribed number of reps.',
    ],
    youtube: 'wkaA1W6NvYA'
  },

  'inchworm-walk-out': {
    description: 'The inchworm walk-out is a full-body dynamic mobility and activation drill that flows through hip hinge mechanics, hamstring lengthening, shoulder activation, and core engagement. It serves as both a warm-up for the posterior chain and a light activation of the upper body, making it an efficient opener for any full-body session.',
    cues: [
      'Stand tall with feet hip-width apart. On an exhale, hinge at your hips and reach both hands toward the floor.',
      'Bend your knees only as much as needed to place your hands flat on the floor.',
      'Walk your hands forward, one step at a time, until you are in a high plank position. Keep your core tight and hips from sagging.',
      'Hold the plank briefly, then walk your hands back toward your feet.',
      'As your hands approach your feet, try to straighten your legs more than on the walk-out, pressing your heels toward the floor to load the hamstrings.',
      'Return to standing. This completes one rep.',
    ],
    youtube: null
  },

  'neck-rolls': {
    description: 'Neck rolls gently mobilize the cervical spine through flexion, extension, and lateral flexion — the ranges of motion most commonly restricted by prolonged desk posture and poor head position during loaded movements. Keeping the cervical spine mobile reduces tension headaches, shoulder tightness, and the forward-head posture that is endemic in modern life.',
    cues: [
      'Stand or sit tall with your shoulders relaxed and your spine neutral.',
      'Slowly tilt your right ear toward your right shoulder, pausing to breathe and allow the left side of your neck to lengthen.',
      'Continue the arc: slowly drop your chin toward your chest, feeling the back of the neck lengthen.',
      'Continue to the left side, tilting your left ear toward your left shoulder.',
      'Reverse the arc back to the right. Avoid rolling the head fully back — this can compress cervical joints.',
      'Move slowly and with full control. Never force range of motion in the neck.',
    ],
    youtube: null
  },

  'kang-squat': {
    description: 'The kang squat is an advanced dynamic mobility drill that combines a Romanian deadlift (good morning) with a deep squat in a single fluid sequence. It simultaneously trains hamstring flexibility, hip mobility, ankle dorsiflexion, and thoracic extension. The drill was popularized by powerlifting coach Greg Nuckols and is used as both a warm-up and a diagnostic tool for squat mechanics.',
    cues: [
      'Stand with feet hip- to shoulder-width apart, toes slightly turned out.',
      'Begin a good morning: hinge at the hips with a slight knee bend, keeping your back flat and chest up, until your torso is roughly parallel to the floor.',
      'Pause briefly at the bottom of the good morning to feel the hamstring load.',
      'From that hinge position, bend your knees and drop your hips down into a full squat, keeping your chest up and heels on the floor.',
      'Stand up from the squat position, then return through the good morning to standing. This is one rep.',
      'Move slowly and controlled. This is a mobility drill — do not rush or use momentum.',
    ],
    youtube: 'rn05vS47b6k'
  },

  'deep-squat-hold': {
    description: 'The deep squat hold is both a mobility drill and a diagnostic test: most adults with healthy hip, ankle, and knee mobility can easily sit in a deep squat for extended periods. Restoring this ancestral resting position improves hip flexion, ankle dorsiflexion, thoracic extension, and deep core activation simultaneously. Using a doorframe for counterbalance allows progressive depth increases without falling.',
    cues: [
      'Stand with feet shoulder-width apart, toes turned out 15–30°.',
      'Holding a doorframe, squat rack, or nothing (if mobile enough), lower into a full squat with hips below parallel.',
      'Keep your heels on the floor throughout. If heels rise, place small weight plates or books under them until ankle mobility improves.',
      'Keep your knees tracking over your toes and your chest up. Avoid rounding aggressively into the lower back.',
      'If using a counterbalance, you can reduce your reliance on it over time as your mobility increases.',
      'Breathe steadily and try to relax deeper into the position over the hold period.',
    ],
    youtube: 'wwMlpHh3qVw'
  },

  // ── PNF ────────────────────────────────────────────────────────────────────

  'pnf-hip-flexor-stretch': {
    description: 'PNF (Proprioceptive Neuromuscular Facilitation) hip flexor stretching uses the contract-relax method to achieve gains in hip flexor length that passive stretching alone cannot. By contracting the target muscle isometrically against resistance before relaxing into a deeper stretch, the nervous system is "tricked" into allowing a greater range of motion. This is one of the most effective evidence-based stretching protocols.',
    cues: [
      'Get into a half-kneeling lunge with your back knee on the floor and front foot flat. Adopt the same setup as the standard hip flexor stretch.',
      'Establish your comfortable end-range: drive hips forward with glute contracted until you feel a moderate stretch.',
      'Contract phase: Push your back knee gently into the floor as if trying to drag it forward while your hand resists at your thigh. Contract the hip flexor isometrically for 5 seconds. Breathe through it.',
      'Relax phase: Release the contraction completely and take a full breath.',
      'Deepen: Drive your hips forward another centimeter or two into the new, greater available range. The nervous system should allow more than before.',
      'Repeat the contract-relax cycle 2–3 times per side, working progressively deeper each time.',
    ],
    youtube: null
  },

  'pnf-hamstring-stretch': {
    description: 'PNF hamstring stretching is the gold standard for achieving rapid and lasting increases in hamstring flexibility. The contract-relax protocol temporarily inhibits the stretch reflex (autogenic inhibition), allowing the muscle to lengthen beyond its normal protected range. Research consistently shows PNF produces greater acute flexibility gains than static or dynamic stretching alone.',
    cues: [
      'Lie on your back. Raise one leg toward the ceiling and hold it with both hands behind the thigh or calf, near the limit of your comfortable range.',
      'Contract phase: Press your heel toward the floor (or toward your hands) as hard as you can for 5 seconds, as if trying to force your leg down against your own resistance. This contracts the hamstring.',
      'Relax: Release the contraction completely and take one breath.',
      'Deepen: Pull the leg closer to your chest than before, settling into the new available range.',
      'Hold the new range for 3 seconds, then begin the next contract phase.',
      'Complete 2–3 cycles per leg, aiming to access a new, greater range with each cycle.',
    ],
    youtube: null
  },

  'pnf-chest-stretch': {
    description: 'PNF chest stretching targets the pectoralis major and minor through the contract-relax method, producing superior gains in chest and anterior shoulder flexibility compared to standard doorway stretches. This is particularly valuable for athletes rebuilding overhead range of motion after heavy pressing programs.',
    cues: [
      'Stand in a doorway with both forearms against the frame at 90°, elbows at shoulder height.',
      'Step forward gently until you feel a moderate stretch across the chest. This is your starting point.',
      'Contract phase: Push both hands and forearms into the door frame as hard as possible for 5 seconds, as if trying to push the frame closed. The chest activates isometrically.',
      'Relax: Release the contraction, take a breath, and relax the chest completely.',
      'Deepen: Step slightly further through the door frame, opening the chest a little more than before.',
      'Repeat 2–3 cycles, stepping progressively further with each relax-and-deepen.',
    ],
    youtube: null
  },

  'pnf-quad-stretch': {
    description: 'PNF quad stretching applies contract-relax technique to the quadriceps, particularly the rectus femoris. The method allows athletes with very tight quads to make meaningful flexibility gains in a single session. This has direct applications for athletes working to improve their squat depth and knee health.',
    cues: [
      'Stand on one leg, holding a wall for balance. Pull the opposite heel toward your glute to your comfortable end range.',
      'Contract phase: Flex your raised quad hard — as if trying to extend (straighten) your bent knee against the resistance of your hand. Hold the contraction for 5 seconds. Do not actually allow the leg to straighten.',
      'Relax: Release the contraction completely. Take a breath.',
      'Deepen: Pull the heel closer to your glute than before. The quad should allow a greater range.',
      'Hold the new range for 3 seconds, then begin the next contract phase.',
      'Complete 2–3 cycles per leg.',
    ],
    youtube: null
  },

  'pnf-shoulder-stretch': {
    description: 'PNF shoulder stretching uses the contract-relax method to increase posterior shoulder and external rotator mobility beyond what standard cross-body stretches can achieve. It is especially effective for correcting the internal rotation restriction pattern (GIRD) common in overhead athletes.',
    cues: [
      'Stand and extend one arm across your body at shoulder height. Use the opposite hand above the elbow to pull the arm gently toward your chest until you feel a stretch in the back of the shoulder.',
      'Contract phase: Try to move your stretched arm away from your body (external rotation) against the resistance of your opposite hand for 5 seconds. The shoulder muscles activate isometrically.',
      'Relax: Release the contraction and breathe.',
      'Deepen: Use your hand to pull the arm closer to your chest, finding a new range.',
      'Hold 3 seconds, then repeat the contract phase.',
      'Complete 2–3 cycles per side.',
    ],
    youtube: null
  },

  'pnf-calf-stretch': {
    description: 'PNF calf stretching achieves greater gains in ankle dorsiflexion than static calf stretching alone. Since ankle dorsiflexion is directly linked to squat depth and running mechanics, this is a high-value protocol for athletes with ankle mobility as a limiting factor. The gastrocnemius and soleus are both targeted depending on knee position.',
    cues: [
      'Stand facing a wall with both hands on it and one foot behind you, heel on the floor. Find your comfortable end-range calf stretch.',
      'Contract phase: Press the ball of your back foot hard into the floor for 5 seconds, as if performing a standing calf raise against the floor. Resist the movement.',
      'Relax: Release the contraction completely. Take a breath.',
      'Deepen: Lean further into the wall, pressing the heel down and stretching the calf further than before.',
      'Hold 3 seconds, then repeat the contract phase.',
      'Complete 2–3 cycles per leg. For the soleus, keep a slight bend in the back knee.',
    ],
    youtube: null
  },

  'pnf-glute-stretch': {
    description: 'PNF glute stretching applies contract-relax technique to the figure-4 position, targeting the piriformis and hip external rotators. The glutes and external rotators are among the strongest muscles in the body, and PNF is particularly effective here because passive stretching alone is often insufficient to overcome the high resting tension in these muscles.',
    cues: [
      'Lie on your back in figure-4 position: right ankle crossed over left thigh, right knee pushed gently away.',
      'For a deeper starting point, lift your left foot off the floor and draw the left thigh toward your chest.',
      'Contract phase: Push your right knee away from your body against the resistance of your right hand or the floor for 5 seconds. The glute and external rotators activate.',
      'Relax: Release the contraction. Take a breath and relax the entire hip.',
      'Deepen: Gently press the right knee further from your body, or pull the left thigh a little closer to access a greater range.',
      'Complete 2–3 cycles per side.',
    ],
    youtube: null
  },

  // ── YOGA ──────────────────────────────────────────────────────────────────

  'downward-dog': {
    description: 'Downward-Facing Dog is a foundational yoga pose that simultaneously lengthens the hamstrings, calves, spine, and shoulders in one position. For athletes, it functions as a comprehensive posterior chain and shoulder opener that also builds the body-awareness needed for gymnastics and overhead movements. Pedaling the feet to alternate heel pressing is an effective way to warm up the calves dynamically before settling into a full hold.',
    cues: [
      'Start on all fours. Tuck your toes under and press through your hands to lift your hips toward the ceiling.',
      'Form an inverted "V" shape. Press your heels toward the floor — they do not need to touch, especially when tight.',
      'Straighten your arms and press the floor away from you, externally rotating the upper arms to broaden the upper back.',
      'Lengthen the spine: draw the navel in and up, creating space between each vertebra.',
      'Gaze toward your knees or navel. Relax your neck — it should be in line with your arms, not hanging down.',
      'Breathe steadily. To intensify the calf stretch, press one heel down while softening the opposite knee (pedaling).',
    ],
    youtube: 'j97SSGsnCAQ'
  },

  'low-lunge-crescent-pose': {
    description: 'The Low Lunge (Crescent Pose) is a deep hip flexor and quadricep opener that combines a lunge position with an upward arm reach. The overhead reach and slight backbend create traction along the entire front body, from the hip flexors to the pectorals. It\'s an accessible and elegant way to counteract the anterior tightness that accumulates from sitting and heavy squatting.',
    cues: [
      'Step your right foot forward into a lunge. Lower your left knee to the floor. Your right shin should be vertical.',
      'Press the top of your back foot into the floor to stabilize the rear leg.',
      'On an inhale, raise both arms overhead, reaching your fingers toward the ceiling.',
      'Gently tuck your pelvis under (posterior tilt) and squeeze your left glute to access the hip flexor stretch. Avoid dumping into your lower back.',
      'For a deeper stretch, allow a slight backbend through your thoracic spine and gaze upward.',
      'Hold while breathing steadily, then return hands to the floor and switch sides.',
    ],
    youtube: 'OfJl_jhJcWw'
  },

  'warrior-i': {
    description: 'Warrior I is a standing yoga posture that opens the hip flexors and chest while building hip strength and stability. The challenge of keeping the back heel grounded while opening the hip forces deep engagement of the hip abductors and glutes. It\'s a more demanding version of the low lunge that also builds ankle stability and lower body endurance.',
    cues: [
      'Step your right foot forward about 3–4 feet. Ground your left heel at a 45–60° angle from the front foot.',
      'Bend your right knee to 90°, front knee tracking over the front foot — not caving inward.',
      'Ground the left heel firmly. This is the key challenge in Warrior I.',
      'Square your hips toward the front of your mat as best you can, then raise both arms overhead.',
      'Draw your shoulder blades together and down, lifting through your chest.',
      'Hold, breathing steadily. Switch sides.',
    ],
    youtube: '5rT--p_cLOc'
  },

  'warrior-ii': {
    description: 'Warrior II opens the hips in a wide lateral stance, targeting the hip adductors, groin, and inner thighs while building endurance in the hip abductors and quadriceps of the bent leg. The arms-extended T-position engages the posterior deltoids and rotator cuff, making this a whole-body strength-and-stretch combination.',
    cues: [
      'Stand with your feet about 3–4 feet apart. Turn your right foot to face forward (90°) and your left foot slightly inward (about 15°).',
      'Bend your right knee to 90°, directly over your right ankle — not past your toes and not caving inward.',
      'Extend both arms out to the sides at shoulder height, parallel to the floor, palms facing down.',
      'Gaze over your front (right) fingertips. Keep your torso directly over your hips — do not lean forward or back.',
      'Sink deeper into the front knee while keeping the back leg straight and strong.',
      'Hold, breathing steadily, then straighten the front leg and switch to the left side.',
    ],
    youtube: '4Ejz7IgODlU'
  },

  'seated-forward-fold': {
    description: 'The seated forward fold (Paschimottanasana) offers a deep stretch along the entire posterior chain — hamstrings, calves, and spinal erectors — from a seated position that eliminates the balance demands of standing variations. The key to getting the most from this pose is hinging from the hips rather than rounding the spine, which targets the hamstrings and avoids compressing the lumbar discs.',
    cues: [
      'Sit on the floor with both legs extended in front of you and feet flexed (toes toward ceiling).',
      'Sit tall on your sitting bones. If your lower back rounds immediately, sit on a folded blanket to tilt your pelvis forward.',
      'Inhale and grow tall through your spine. On the exhale, hinge forward from your hips — not your waist.',
      'Reach for your shins, ankles, or the soles of your feet. A strap looped around your feet is helpful if you cannot reach.',
      'Each inhale creates length in the spine; each exhale deepens the forward fold slightly.',
      'Hold, keeping a flat back as long as possible. A gentle rounding at the end of range is acceptable.',
    ],
    youtube: null
  },

  'supine-spinal-twist': {
    description: 'The supine spinal twist (Supta Matsyendrasana) gently rotates the lumbar and thoracic spine while also stretching the outer hip and glutes of the crossed leg. Performed lying down, gravity assists the rotation without requiring active muscular effort, making it an excellent restorative choice at the end of a training session.',
    cues: [
      'Lie on your back with legs extended. Draw your right knee to your chest.',
      'Using your left hand, guide your right knee across your body to the left, letting it drop toward the floor.',
      'Extend your right arm out to the right at shoulder height, palm facing up.',
      'Turn your gaze gently to the right, in the opposite direction from your knee.',
      'Keep both shoulders in contact with the floor. Do not force the knee to the ground — let gravity do the work.',
      'Hold, breathing deeply into the twist with each exhale. Switch sides.',
    ],
    youtube: 'mKC3IeldPOc'
  },

  'happy-baby': {
    description: 'Happy Baby pose provides a restorative hip opener that gently stretches the inner groin, hip flexors, and lower back simultaneously. The gentle rocking motion massages the sacrum and lower spine, making this one of the best end-of-session recovery poses. Despite its name, it offers a surprisingly deep hip and groin stretch.',
    cues: [
      'Lie on your back. On an exhale, bend both knees and draw them toward your chest.',
      'Take hold of the outer edge of each foot (or ankle or calf if feet are not accessible).',
      'Open your knees wider than your torso and draw them down toward your armpits.',
      'Keep your sacrum (lower back) heavy and in contact with the floor. Do not let your tailbone lift.',
      'Flex both feet — soles face the ceiling, ankles over knees.',
      'Gently rock side to side to massage the lower back. Breathe deeply and relax into the pose.',
    ],
    youtube: null
  },

  'thread-the-needle': {
    description: 'Thread the Needle is an all-fours thoracic rotation stretch that gently mobilizes the mid-back and rear shoulder, targeting the rhomboids, rear deltoid, and thoracic rotators. Because the spine is supported and the movement is guided by gravity, it is an excellent choice for athletes with back sensitivity who need thoracic rotation work.',
    cues: [
      'Start on all fours with wrists under shoulders and knees under hips. Spine is neutral.',
      'Slide your right arm along the floor under your left arm, palm facing up, threading it through the gap.',
      'Allow your right shoulder and right cheek to rest on the floor. Your left arm stays extended for support.',
      'Your hips remain over your knees. The rotation is entirely in the upper body.',
      'For a deeper stretch, walk the left hand further forward to increase the thoracic rotation.',
      'Hold, breathe into the right shoulder and upper back, then slowly unthread and switch sides.',
    ],
    youtube: null
  },

  'lizard-pose': {
    description: 'Lizard Pose is a deep hip opener that targets the hip flexors, groin, and inner thigh of the front leg while also offering a hamstring stretch. The position of placing both hands inside the front foot creates a powerful stretch that is significantly deeper than a standard lunge. It\'s a staple preparatory pose for pigeon pose and deep squat mechanics.',
    cues: [
      'Begin in a downward dog or high plank. Step your right foot forward and place it to the outside of your right hand.',
      'Lower your back knee to the floor if needed. Your front shin should be vertical or slightly forward.',
      'Bring both hands to the floor inside your right foot. You can lower onto your forearms for a deeper stretch.',
      'Sink your hips toward the floor, pressing the right knee gently to the right to open the groin.',
      'Keep your back leg extended and press the top of the back foot into the floor for stability.',
      'Hold, breathing deeply into the inner groin and hip, then return to plank and switch sides.',
    ],
    youtube: '6mgjymhdyq' // casing uncertain — verify before finalizing
  },

  'bridge-pose': {
    description: 'Bridge Pose is a gentle but effective backbend that stretches the hip flexors, quadriceps, and chest while actively strengthening the glutes, hamstrings, and spinal erectors. It counteracts the sustained hip flexion and thoracic rounding of seated postures, making it an excellent corrective exercise and stretch for athletes and desk workers alike.',
    cues: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart. Place your arms at your sides, palms down.',
      'Press your feet firmly into the floor. On an inhale, lift your hips toward the ceiling by engaging your glutes and hamstrings.',
      'Interlace your hands beneath you and draw your shoulder blades together, pressing the outer edges of your shoulders into the floor.',
      'Your weight should be on your feet, shoulders, and upper back — not your neck.',
      'At the top, squeeze your glutes and feel the hip flexors lengthening.',
      'Hold for the prescribed time, then slowly lower your spine vertebra by vertebra back to the floor.',
    ],
    youtube: 'NnbvPeAIhmA'
  },

  'reclined-butterfly': {
    description: 'Reclined Butterfly (Supta Baddha Konasana) is a deeply restorative hip opener that gently releases the inner groin, hip adductors, and hip flexors while supported by the floor. Without the postural demands of the seated butterfly, the body can relax completely into the stretch, making it ideal for end-of-session recovery or stress relief.',
    cues: [
      'Lie on your back. Bring the soles of your feet together and allow your knees to fall open to the sides.',
      'Slide your feet closer to your groin for a more intense stretch, or further away for a gentler one.',
      'Place your hands on your belly, out to the sides, or rest them on your inner thighs (do not push the knees down).',
      'Let gravity do all the work. The inner groin and hip adductors will gradually release over the hold.',
      'Keep your lower back gently in contact with the floor.',
      'Breathe slowly and deeply. This is a fully restorative stretch — complete relaxation is the goal.',
    ],
    youtube: null
  },

  'puppy-pose': {
    description: 'Puppy Pose (Uttana Shishosana) is a hybrid between Child\'s Pose and Downward Dog that offers a powerful shoulder and thoracic spine opening. By keeping the hips over the knees while walking the hands forward, the chest melts toward the floor under the influence of gravity, creating a deep stretch in the lats, posterior shoulder, and mid-back that is hard to replicate with other exercises.',
    cues: [
      'Begin on all fours with wrists under shoulders and knees under hips.',
      'Walk your hands forward several inches while keeping your hips directly over your knees.',
      'Lower your chest and forehead toward the floor, letting your arms extend fully. The elbows do not touch the ground.',
      'You should feel a deep opening in the armpits (lats) and across the upper back and chest.',
      'Press your hands gently into the floor without pushing your chest away — the goal is surrender, not pushing.',
      'Hold while breathing into the chest and upper back, then slowly walk the hands back in.',
    ],
    youtube: null
  },

};
