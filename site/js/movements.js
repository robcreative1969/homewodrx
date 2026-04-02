// ============================================================================
// MOVEMENT DATABASE
// Used by the DailyWOD engine and WOD Generator.
// Each movement has:
//   name  - display name
//   tags  - categories: push, pull, lower, core, full, cardio
//   b     - beginner reps
//   i     - intermediate reps
//   a     - advanced reps
//   tip   - coaching cue (optional)
// =========================================================================

const MOVEMENT_DB = {

  bodyweight: [
    // ── PUSH ──────────────────────────────────────────────────────────────
    { name: 'Push-Ups',           tags: ['push'],          b: 10, i: 20, a: 30, tip: 'Keep a rigid plank; elbows at 45°.' },
    { name: 'Wide Push-Ups',      tags: ['push'],          b: 8,  i: 15, a: 25, tip: 'Hands wider than shoulder width.' },
    { name: 'Diamond Push-Ups',   tags: ['push'],          b: 6,  i: 12, a: 20, tip: 'Hands form a diamond under your chest.' },
    { name: 'Pike Push-Ups',      tags: ['push'],          b: 6,  i: 10, a: 15, tip: 'Hips high, drive head toward the floor.' },
    { name: 'Decline Push-Ups',   tags: ['push'],          b: 8,  i: 15, a: 25, tip: 'Feet elevated on a chair or box.' },
    { name: 'Hand-Release Push-Ups', tags: ['push'],       b: 8,  i: 15, a: 20, tip: 'Lift hands at the bottom of each rep.' },
    { name: 'Tricep Dips',        tags: ['push'],          b: 8,  i: 15, a: 25, tip: 'Use a chair; keep elbows close.' },

    // ── PULL ─────────────────────────────────────────────────────────────
    { name: 'Inverted Rows',      tags: ['pull'],          b: 8,  i: 12, a: 20, tip: 'Use a table edge; body straight.' },
    { name: 'Superman Hold',      tags: ['pull'],          b: 10, i: 15, a: 20, tip: 'Lift chest and legs simultaneously; squeeze glutes.' },
    { name: 'Prone Cobra',        tags: ['pull'],          b: 10, i: 15, a: 20, tip: 'Squeeze shoulder blades at the top.' },
    { name: 'Good Mornings',      tags: ['pull', 'lower'], b: 12, i: 15, a: 20, tip: 'Soft knee bend; hinge at hips.' },

    // ── LOWER ─────────────────────────────────────────────────────────────
    { name: 'Air Squats',         tags: ['lower'],         b: 15, i: 25, a: 40, tip: 'Break parallel; chest up, knees track toes.' },
    { name: 'Jump Squats',        tags: ['lower', 'cardio'], b: 8, i: 15, a: 25, tip: 'Land soft; absorb through hips and knees.' },
    { name: 'Reverse Lunges',     tags: ['lower'],         b: 10, i: 16, a: 24, tip: 'Step back; front shin stays vertical.' },
    { name: 'Walking Lunges',     tags: ['lower'],         b: 10, i: 20, a: 30, tip: 'Alternate legs; keep torso:epright.' },
    { name: 'Lateral Lunges',     tags: ['lower'],         b: 10, i: 16, a: 24, tip: 'Push hips back as you step wide.' },
    { name: 'Bulgarian Split Squats', tags: ['lower'],     b: 8,  i: 12, a: 20, tip: 'Rear foot elevated; front knee stays over toes.' },
    { name: 'Glute Bridges',      tags: ['lower', 'legs-glutes'], b: 15, i: 20, a: 30, tip: 'Drive hips up; squeeze glutes hard at top.' },
    { name: 'Single-Leg Glute Bridge', tags: ['lower', 'legs-glutes'], b: 10, i: 15, a: 20, tip: 'Non-working leg straight in the air.' },
    { name: 'Step-Ups',           tags: ['lower'],         b: 10, i: 16, a: 24, tip: 'Drive through heel of the elevated foot.' },
    { name: 'Wall Sit',           tags: ['lower'],         b: 30, i: 45, a: 60, tip: 'Thighs parallel; back flat against wall. (seconds)' },
    { name: 'Cossack Squats',     tags: ['lower'],         b: 8,  i: 12, a: 20, tip: 'Sit deep into one side; opposite leg straight.' },
    { name: 'Sumo Squats',        tags: ['lower', 'legs-glutes'], b: 15, i: 25, a: 35, tip: 'Wide stance; toes flared 45°.' },

    // ── CORE ──────────────────────────────────────────────────────────────
    { name: 'Sit-Ups',            tags: ['core'],          b: 15, i: 25, a: 40, tip: 'Anchor feet; full range of motion.' },
    { name: 'V-Ups',              tags: ['core'],          b: 10, i: 20, a: 30, tip: 'Lift legs and torso simultaneously; touch toes.' },
    { name: 'Hollow Holds',       tags: ['core'],          b: 20, i: 30, a: 45, tip: 'Lower back pressed flat; arms overhead. (seconds)' },
    { name: 'Plank Hold',         tags: ['core'],          b: 30, i: 45, a: 60, tip: 'Neutral spine; squeeze glutes and abs. (seconds)' },
    { name: 'Plank Shoulder Taps', tags: ['core'],         b: 10, i: 20, a: 30, tip: 'Resist hip rotation; slow and controlled.' },
    { name: 'Russian Twists',     tags: ['core'],          b: 20, i: 30, a: 40, tip: 'Feet off ground; rotate fully each side.' },
    { name: 'Bicycle Crunches',   tags: ['core'],          b: 20, i: 30, a: 40, tip: 'Opposite elbow to knee; full twist.' },
    { name: 'Flutter Kicks',      tags: ['core'],          b: 20, i: 30, a: 40, tip: 'Small controlled kicks; lower back flat. (reps each leg)' },
    { name: 'Dead Bug',           tags: ['core'],          b: 8,  i: 12, a: 16, tip: 'Press lower back into floor; slow and deliberate.' },
    { name: 'Mountain Climbers',  tags: ['core', 'cardio'], b: 20, i: 30, a: 40, tip: 'Drive knees to chest; keep hips level.' },
    { name: 'Superman Hold',      tags: ['core', 'pull'],  b: 10, i: 15, a: 20, tip: 'Hold 2 sec at top each rep.' },

    // ── FULL BODY ──────────────────────────────────────────────────────────
    { name: 'Burpees',            tags: ['full', 'cardio'], b: 8, i: 15, a: 25, tip: 'Chest to floor; jump and clap overhead.' },
    { name: 'Inchworms',          tags: ['full'],          b: 8,  i: 12, a: 16, tip: 'Walk hands out to plank; walk feet to hands.' },
    { name: 'Bear Crawls',        tags: ['full'],          b: 10, i: 15, a: 20, tip: '10m down and back. Knees hover 1 inch off ground.' },
    { name: 'Sprawls',            tags: ['full', 'cardio'], b: 10, i: 15, a: 20, tip: 'Burpee without the jump; focus on hip snap.' },
    { name: 'Squat Thrusts',      tags: ['full', 'cardio'], b: 10, i: 15, a: 20, tip: 'Jump feet to hands from plank; stand tall.' },
    { name: 'Up-Downs',           tags: ['full', 'cardio'], b: 8,  i: 12, a: 20, tip: 'Lower to plank; stand up fast. No push-up.' },

    // ── CARDIO ────────────────────────────────────────────────────────────
    { name: 'Jumping Jacks',      tags: ['cardio'],        b: 30, i: 50, a: 70, tip: 'Full arm extension overhead each rep.' },
    { name: 'High Knees',         tags: ['cardio'],        b: 20, i: 40, a: 60, tip: 'Drive knees to hip height; pump arms.' },
    { name: 'Butt Kickers',       tags: ['cardio', 'lower'], b: 20, i: 40, a: 60, tip: 'Kick heels to glutes; stay on the balls of your feet.' },
    { name: 'Box Jumps',          tags: ['cardio', 'lower'], b: 8, i: 15, a: 20, tip: 'Land softly with full hip extension at the top.' },
    { name: 'Broad Jumps',        tags: ['cardio', 'lower'], b: 6, i: 10, a: 15, tip: 'Swing arms; land in athletic stance.' },
    { name: 'Tuck Jumps',         tags: ['cardio', 'lower'], b: 8, i: 15, a: 20, tip: 'Drive knees to chest at peak; land soft.' },
    { name: 'Skaters',            tags: ['cardio', 'lower'], b: 10, i: 20, a: 30, tip: 'Lateral bounds; touch down with trailing hand.' },
    { name: 'Sprint (25m)',       tags: ['cardio'],         b: 4,  i: 6,  a: 8,  tip: 'All-out effort each rep. Walk back.' },
  ],

  // Additional equipment pools (extend as needed)
  kettlebell: [
    { name: 'KB Swings',          tags: ['full', 'lower'],  b: 15, i: 25, a: 30 },
    { name: 'KB Goblet Squats',   tags: ['lower'],           b: 12, i: 20, a: 30 },
    { name: 'KB Turkish Get-Up',  tags: ['full'],            b: 3,  i: 5,  a: 8  },
    { name: 'KB Clean & Press',   tags: ['full', 'push'],    b: 5,  i: 8,  a: 12 },
    { name: 'KB Rows',            tags: ['pull'],            b: 10, i: 15, a: 20 },
    { name: 'KB Deadlift',        tags: ['lower'],           b: 12, i: 20, a: 25 },
    { name: 'KB Figure 8',        tags: ['core', 'full'],   b: 10, i: 15, a: 20 },
    { name: 'KB Halo',            tags: ['core', 'push'],   b: 8,  i: 12, a: 16 },
  ],

  barbell: [
    { name: 'Back Squat',         tags: ['lower'],           b: 5,  i: 10, a: 15 },
    { name: 'Deadlift',           tags: ['lower', 'pull'],   b: 5,  i: 8,  a: 10 },
    { name: 'Overhead Press',     tags: ['push'],            b: 5,  i: 10, a: 12 },
    { name: 'Barbell Row',        tags: ['pull'],            b: 8,  i: 10, a: 15 },
    { name: 'Power Clean',        tags: ['full'],            b: 3,  i: 5,  a: 7  },
    { name: 'Thruster',           tags: ['full', 'push'],    b: 5,  i: 10, a: 15 },
    { name: 'Romanian Deadlift',  tags: ['lower', 'legs-glutes'], b: 8, i: 12, a: 15 },
  ],

  pullupbar: [
    { name: 'Pull-Ups',           tags: ['pull'],            b: 3,  i: 8,  a: 15 },
    { name: 'Chin-Ups',           tags: ['pull'],            b: 3,  i: 8,  a: 12 },
    { name: 'Hanging Knee Raises', tags: ['core'],           b: 8,  i: 15, a: 25 },
    { name: 'Toes-to-Bar',        tags: ['core'],            b: 5,  i: 10, a: 15 },
    { name: 'Hanging L-Hold',     tags: ['core'],            b: 15, i: 25, a: 40 },
    { name: 'Kipping Pull-Ups',   tags: ['pull'],            b: 5,  i: 10, a: 15 },
    { name: 'Muscle-Ups',         tags: ['full', 'pull'],    b: 1,  i: 3,  a: 5  },
  ],

  dumbbell: [
    { name: 'DB Dumbbell Thrusters', tags: ['full', 'push'], b: 8,  i: 15, a: 20 },
    { name: 'DB Bent-Over Row',   tags: ['pull'],            b: 10, i: 15, a: 20 },
    { name: 'DB Shoulder Press',  tags: ['push'],            b: 8,  i: 12, a: 15 },
    { name: 'DB Romanian Deadlift', tags: ['lower'],         b: 10, i: 15, a: 20 },
    { name: 'DB Lunges',          tags: ['lower'],           b: 10, i: 16, a: 24 },
    { name: 'DB Man Makers',      tags: ['full'],            b: 3,  i: 5,  a: 8  },
    { name: 'DB Renegade Row',    tags: ['pull', 'core'],    b: 6,  i: 10, a: 14 },
    { name: 'DB Lateral Raises',  tags: ['push'],            b: 10, i: 15, a: 20 },
  ],

  jumpropе: [
    { name: 'Single-Unders',      tags: ['cardio'],          b: 30, i: 50, a: 75 },
    { name: 'Double-Unders',      tags: ['cardio'],          b: 15, i: 30, a: 50 },
    { name: 'Jump Rope Intervals', tags: ['cardio'],         b: 30, i: 45, a: 60 },
  ]
};
