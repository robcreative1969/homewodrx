// ============================================================================
// STRETCH DATABASE — HomeWODrx
// Powers the /stretch Smart Stretch Session Generator
// Modalities: static | dynamic | pnf | yoga
// Focus areas: full | hips | shoulders | hamstrings | back | chest | calves
// ============================================================================

const STRETCH_DB = {

  // ── STATIC STRETCHES (hold-based, 20–60 s) ──────────────────────────────
  static: [
    {
      name: "Hip Flexor Stretch",
      tip: "Drive hip forward, keep torso tall — feel it in the front of the rear hip",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Seated Hamstring Stretch",
      tip: "Hinge from the hips, not the lower back — keep a flat spine as you reach",
      hold: { b: 30, i: 40, a: 60 },
      sides: false,
      focus: ["hamstrings", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Standing Quad Stretch",
      tip: "Stand tall, pull ankle to glute, keep knees together",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["hamstrings", "hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Pigeon Pose",
      tip: "Square your hips to the floor — fold forward to deepen",
      hold: { b: 30, i: 45, a: 60 },
      sides: true,
      focus: ["hips", "full"],
      level: ["i","a"]
    },
    {
      name: "Figure-4 Stretch",
      tip: "Cross ankle over opposite knee, flex the foot, gently press the knee down",
      hold: { b: 30, i: 45, a: 60 },
      sides: true,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Butterfly Stretch",
      tip: "Sit tall, press knees toward the floor with your elbows",
      hold: { b: 30, i: 40, a: 60 },
      sides: false,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Supine Hamstring Stretch",
      tip: "Lie on back, loop a band or towel around the foot, keep both legs relatively straight",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["hamstrings", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Standing Calf Stretch",
      tip: "Press heel into floor, lean into wall — knee straight targets gastrocnemius",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["calves", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Soleus Stretch",
      tip: "Same as calf stretch but bend the rear knee — targets the deeper calf muscle",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["calves"],
      level: ["i","a"]
    },
    {
      name: "Cross-Body Shoulder Stretch",
      tip: "Pull arm across chest, keep shoulder down — don't shrug",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["shoulders", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Doorway Chest Stretch",
      tip: "Place forearm on door frame at 90°, step through and rotate chest away",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["chest", "shoulders"],
      level: ["b","i","a"]
    },
    {
      name: "Overhead Tricep Stretch",
      tip: "Raise one arm, bend at elbow, use other hand to gently press elbow back",
      hold: { b: 20, i: 30, a: 40 },
      sides: true,
      focus: ["shoulders"],
      level: ["b","i","a"]
    },
    {
      name: "Child's Pose",
      tip: "Sit back onto heels, arms extended — walk hands to one side for a lat bias",
      hold: { b: 30, i: 45, a: 60 },
      sides: false,
      focus: ["back", "shoulders", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Cat-Cow Stretch",
      tip: "Inhale to arch (cow), exhale to round (cat) — move slowly with your breath",
      hold: { b: 30, i: 40, a: 50 },
      sides: false,
      reps: { b: 8, i: 10, a: 12 },
      timedOrReps: "reps",
      focus: ["back", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Seated Spinal Twist",
      tip: "Sit tall, cross one leg, hook elbow on outside of knee and rotate",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["back", "hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Standing Side Stretch",
      tip: "Reach one arm overhead, lean to the side — feel the whole lateral chain open",
      hold: { b: 20, i: 30, a: 40 },
      sides: true,
      focus: ["back", "shoulders", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Sleeper Stretch",
      tip: "Lie on side, arm extended, use other hand to press wrist toward floor",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["shoulders"],
      level: ["i","a"]
    },
    {
      name: "Lat Stretch at Wall",
      tip: "Place hand on wall, step back and hinge at hip — let the lat lengthen",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["back", "shoulders"],
      level: ["b","i","a"]
    },
    {
      name: "Wrist Flexor Stretch",
      tip: "Extend arm forward palm up, use other hand to pull fingers back toward you",
      hold: { b: 20, i: 30, a: 40 },
      sides: true,
      focus: ["wrists", "shoulders"],
      level: ["b","i","a"]
    },
    {
      name: "Wrist Extensor Stretch",
      tip: "Extend arm forward palm facing away, use other hand to press fingers toward the floor",
      hold: { b: 20, i: 30, a: 40 },
      sides: true,
      focus: ["wrists", "shoulders"],
      level: ["b","i","a"]
    },
  ],

  // ── DYNAMIC / MOBILITY (movement-based) ─────────────────────────────────
  dynamic: [
    {
      name: "Leg Swings (Front to Back)",
      tip: "Hold a wall for balance, swing freely — let momentum do the work",
      reps: { b: 10, i: 12, a: 15 },
      sides: true,
      focus: ["hips", "hamstrings", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Leg Swings (Side to Side)",
      tip: "Face the wall, swing leg across midline and out — keep hips square",
      reps: { b: 10, i: 12, a: 15 },
      sides: true,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Hip Circles",
      tip: "Hands on hips, draw large slow circles — go both directions",
      reps: { b: 8, i: 10, a: 12 },
      sides: false,
      focus: ["hips", "back", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Arm Circles",
      tip: "Full range of motion — slow small circles progressing to large",
      reps: { b: 10, i: 12, a: 15 },
      sides: false,
      focus: ["shoulders", "chest", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Shoulder Pass-Throughs",
      tip: "Use a band or broomstick — wide grip, pass overhead and behind in one arc",
      reps: { b: 10, i: 12, a: 15 },
      sides: false,
      focus: ["shoulders", "chest", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Thoracic Rotations",
      tip: "On all fours, place hand behind head — rotate elbow to ceiling, then to floor",
      reps: { b: 8, i: 10, a: 12 },
      sides: true,
      focus: ["back", "shoulders", "full"],
      level: ["b","i","a"]
    },
    {
      name: "World's Greatest Stretch",
      tip: "Lunge forward, drop back knee, rotate arm to ceiling — it's all in one motion",
      reps: { b: 5, i: 6, a: 8 },
      sides: true,
      focus: ["full", "hips", "back", "shoulders"],
      level: ["i","a"]
    },
    {
      name: "Hip 90/90 Transitions",
      tip: "Sit with both knees bent at 90°, windshield-wiper knees side to side",
      reps: { b: 6, i: 8, a: 10 },
      sides: false,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Ankle Circles",
      tip: "Seated or standing — draw slow deliberate circles in each direction",
      reps: { b: 10, i: 12, a: 15 },
      sides: true,
      focus: ["calves", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Spiderman Lunges",
      tip: "From plank, step foot to outside of hand — lower the hip, hold briefly",
      reps: { b: 5, i: 6, a: 8 },
      sides: true,
      focus: ["hips", "hamstrings", "full"],
      level: ["i","a"]
    },
    {
      name: "Inchworm Walk-Out",
      tip: "Hinge at hips, walk hands out to plank, walk back — feel the hamstrings load",
      reps: { b: 6, i: 8, a: 10 },
      sides: false,
      focus: ["hamstrings", "back", "shoulders", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Neck Rolls",
      tip: "Slow and controlled — ear to shoulder each side, then front to back",
      reps: { b: 5, i: 6, a: 8 },
      sides: false,
      focus: ["back", "shoulders"],
      level: ["b","i","a"]
    },
    {
      name: "Kang Squat",
      tip: "Good morning to squat: hinge, pause, squat down, stand — reverse the pattern",
      reps: { b: 5, i: 6, a: 8 },
      sides: false,
      focus: ["hamstrings", "hips", "back", "full"],
      level: ["i","a"]
    },
    {
      name: "Deep Squat Hold",
      tip: "Feet shoulder-width, toes slightly out — use a doorframe if needed for balance",
      hold: { b: 30, i: 45, a: 60 },
      sides: false,
      focus: ["hips", "hamstrings", "calves", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Wrist Circles",
      tip: "Interlace fingers or rotate each wrist individually in full circles each direction",
      reps: { b: 10, i: 12, a: 15 },
      sides: false,
      focus: ["wrists"],
      level: ["b","i","a"]
    },
  ],

  // ── PNF / DEEP TISSUE (contract-relax) ──────────────────────────────────
  pnf: [
    {
      name: "PNF Hip Flexor Stretch",
      tip: "Lunge position — contract the hip flexor for 5s, then relax and sink deeper",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["hips", "full"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
    {
      name: "PNF Hamstring Stretch",
      tip: "Supine with leg raised — press heel into hands for 5s, relax and pull leg closer",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["hamstrings", "full"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
    {
      name: "PNF Chest Stretch",
      tip: "Doorway stretch — push hands into frame for 5s, release and open chest further",
      hold: { b: 25, i: 35, a: 45 },
      sides: false,
      focus: ["chest", "shoulders"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
    {
      name: "PNF Quad Stretch",
      tip: "Standing quad stretch — flex the quad hard for 5s, then relax and deepen",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["hamstrings", "hips"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
    {
      name: "PNF Shoulder Stretch",
      tip: "Cross-body position — try to move arm away for 5s, then deepen across the chest",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["shoulders", "chest"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
    {
      name: "PNF Calf Stretch",
      tip: "Wall calf stretch — push ball of foot into floor for 5s, then relax and lean in",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["calves"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
    {
      name: "PNF Glute Stretch",
      tip: "Figure-4 position — try to push knee away for 5s, relax and press it down",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["hips", "full"],
      level: ["i","a"],
      pnfNote: "Contract 5s → relax 3s → deepen stretch"
    },
  ],

  // ── YOGA-INSPIRED ────────────────────────────────────────────────────────
  yoga: [
    {
      name: "Downward Dog",
      tip: "Press heels toward the floor, pedal feet to warm up calves — long spine",
      hold: { b: 30, i: 45, a: 60 },
      sides: false,
      focus: ["hamstrings", "calves", "shoulders", "back", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Low Lunge (Crescent Pose)",
      tip: "Back knee on floor, reach arms overhead — open the hip flexor fully",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Warrior I",
      tip: "Front knee over ankle, back heel grounded, arms overhead — feel the full stretch",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["hips", "shoulders", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Warrior II",
      tip: "Hips open to the side, arms out like a T — gaze over front hand",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Seated Forward Fold",
      tip: "Hinge from the hips, reach for shins or feet — don't round the lower back",
      hold: { b: 30, i: 45, a: 60 },
      sides: false,
      focus: ["hamstrings", "back", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Supine Spinal Twist",
      tip: "Lying down, cross one knee over — look the opposite direction for a full twist",
      hold: { b: 30, i: 40, a: 60 },
      sides: true,
      focus: ["back", "hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Happy Baby",
      tip: "Lie on back, grab outer feet, pull knees toward armpits — rock gently",
      hold: { b: 30, i: 45, a: 60 },
      sides: false,
      focus: ["hips", "back", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Thread the Needle",
      tip: "On all fours, slide one arm under body — rest shoulder and cheek on the floor",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["back", "shoulders"],
      level: ["b","i","a"]
    },
    {
      name: "Lizard Pose",
      tip: "Low lunge with both hands inside front foot — sink the hips low",
      hold: { b: 25, i: 35, a: 45 },
      sides: true,
      focus: ["hips", "hamstrings", "full"],
      level: ["i","a"]
    },
    {
      name: "Bridge Pose",
      tip: "Lie on back, press feet into floor, lift hips — squeeze glutes at the top",
      hold: { b: 25, i: 35, a: 45 },
      sides: false,
      focus: ["back", "hips", "chest"],
      level: ["b","i","a"]
    },
    {
      name: "Reclined Butterfly",
      tip: "Lie on back, soles of feet together, let knees fall open — full relaxation",
      hold: { b: 30, i: 45, a: 60 },
      sides: false,
      focus: ["hips", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Puppy Pose",
      tip: "On all fours, walk hands forward, let chest melt toward the floor",
      hold: { b: 25, i: 35, a: 45 },
      sides: false,
      focus: ["back", "shoulders", "chest", "full"],
      level: ["b","i","a"]
    },
    {
      name: "Pigeon Pose",
      tip: "Front shin parallel to mat, sink the hips — fold forward for a deeper stretch",
      hold: { b: 30, i: 45, a: 60 },
      sides: true,
      focus: ["hips", "full"],
      level: ["i","a"]
    },
  ],
};

// Focus area metadata (label, icon, description)
const STRETCH_FOCUS = [
  { id: "full",        label: "Full Body",          icon: "🧘",  desc: "Head to toe" },
  { id: "hips",        label: "Hips & Glutes",      icon: "🦋",  desc: "Hip flexors, glutes, groin" },
  { id: "hamstrings",  label: "Hamstrings & Legs",  icon: "🦵",  desc: "Posterior chain & quads" },
  { id: "back",        label: "Back & Spine",        icon: "🔄",  desc: "Thoracic & lumbar" },
  { id: "shoulders",   label: "Shoulders & Neck",    icon: "💪",  desc: "Deltoids, traps, lats" },
  { id: "chest",       label: "Chest & Pecs",        icon: "🫁",  desc: "Pectorals, anterior shoulder" },
  { id: "calves",      label: "Calves & Ankles",     icon: "🦶",  desc: "Gastrocnemius, soleus, ankle" },
];

// Generate a stretch session based on user preferences
function generateStretchSession({ focusAreas, duration, modalities, level }) {
  // Collect all candidate stretches from selected modalities
  let pool = [];
  for (const mod of modalities) {
    const moves = STRETCH_DB[mod] || [];
    moves.forEach(m => {
      // Filter by focus area
      const matchesFocus = focusAreas.includes("full") ||
        m.focus.some(f => focusAreas.includes(f));
      // Filter by level
      const matchesLevel = m.level.includes(level);
      if (matchesFocus && matchesLevel) {
        pool.push({ ...m, modality: mod });
      }
    });
  }

  // Shuffle
  pool = pool.sort(() => Math.random() - 0.5);

  // Estimate time per stretch (in seconds)
  function estimateSeconds(stretch) {
    let secs = stretch.hold ? stretch.hold[level] : 0;
    if (stretch.timedOrReps === "reps") {
      secs = (stretch.reps[level] || 8) * 4; // ~4s per rep
    } else if (stretch.reps && !stretch.hold) {
      secs = (stretch.reps[level] || 10) * 3; // ~3s per rep for dynamic
    }
    if (stretch.sides) secs *= 2; // each side
    secs += 5; // transition time
    return secs;
  }

  // Select stretches to fill the target duration
  const targetSecs = duration * 60;
  const selected = [];
  let totalSecs = 0;

  // Ensure at least one from each modality if possible
  const modalityRep = {};
  for (const mod of modalities) {
    const found = pool.find(p => p.modality === mod && !selected.includes(p));
    if (found) {
      selected.push(found);
      modalityRep[mod] = true;
      totalSecs += estimateSeconds(found);
    }
  }

  // Fill remaining time
  for (const stretch of pool) {
    if (selected.includes(stretch)) continue;
    const est = estimateSeconds(stretch);
    if (totalSecs + est <= targetSecs + 60) { // allow slight overrun
      selected.push(stretch);
      totalSecs += est;
    }
    if (totalSecs >= targetSecs) break;
  }

  return { stretches: selected, estimatedMinutes: Math.round(totalSecs / 60) };
}
