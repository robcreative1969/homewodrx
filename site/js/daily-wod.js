// ============================================================================
// DAILY WOD ENGINE
// ============================================================================
// Generates a deterministic workout each day based on admin config.
// The same date always produces the same workout for every visitor.
// Admin can manually override via Supabase or the admin panel.

const DailyWOD = {

  // Cache for movement pool loaded from Supabase (null = not yet loaded)
  _movementCache: null,

  // Load eligible movements from Supabase, grouped by equipment_category.
  // Returns a MOVEMENT_DB-compatible object. Falls back to JS MOVEMENT_DB.
  async _loadMovements() {
    if (this._movementCache) return this._movementCache;

    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from('movements')
          .select('name, equipment_category, tags, beginner_reps, intermediate_reps, advanced_reps, wod_tip, timed')
          .eq('daily_wod_eligible', true);

        if (!error && data && data.length > 0) {
          // Group into MOVEMENT_DB format
          const db = {};
          data.forEach(m => {
            const cat = m.equipment_category || 'bodyweight';
            if (!db[cat]) db[cat] = [];
            db[cat].push({
              name: m.name,
              tip: m.wod_tip || '',
              b: m.beginner_reps,
              i: m.intermediate_reps,
              a: m.advanced_reps,
              tags: m.tags || [],
              timed: m.timed || false
            });
          });
          this._movementCache = db;
          return db;
        }
      }
    } catch (e) {
      console.warn('DailyWOD: Could not load movements from Supabase, using JS fallback.', e);
    }

    // Fallback to JS movement-db.js
    if (typeof MOVEMENT_DB !== 'undefined') {
      this._movementCache = MOVEMENT_DB;
      return MOVEMENT_DB;
    }
    return {};
  },

  // Default admin config (can be overridden in Supabase daily_wod_config table)
  defaultConfig: {
    // Equipment assumed available for daily WODs
    // Common home gym gear: bodyweight + kettlebell, dumbbells, pull-up bar, jump rope, resistance bands
    equipment: ['bodyweight', 'kettlebell', 'dumbbell', 'pullupbar', 'jumprope', 'resistancebands'],
    // Difficulty by day of week (0=Sun, 1=Mon, ..., 6=Sat)
    difficultyByDay: {
      0: 'beginner',      // Sunday: recovery/easy
      1: 'intermediate',  // Monday: moderate
      2: 'advanced',      // Tuesday: hard
      3: 'intermediate',  // Wednesday: moderate
      4: 'advanced',      // Thursday: hard
      5: 'advanced',      // Friday: go all out
      6: 'intermediate'   // Saturday: strong but accessible
    },
    // Body focus by day of week
    bodyFocusByDay: {
      0: 'core',          // Sunday: core and recovery
      1: 'full-body',     // Monday: full body
      2: 'lower-body',    // Tuesday: legs
      3: 'upper-body',    // Wednesday: upper body
      4: 'cardio',        // Thursday: conditioning
      5: 'full-body',     // Friday: full body
      6: 'legs-glutes'    // Saturday: posterior chain
    },
    // Format by day (or 'random')
    formatByDay: {
      0: 'circuit',
      1: 'amrap',
      2: 'fortime',
      3: 'emom',
      4: 'amrap',
      5: 'fortime',
      6: 'circuit'
    },
    // Duration range in minutes [min, max] — locked to 20 for The Daily 20
    durationByDay: {
      0: [20, 20],
      1: [20, 20],
      2: [20, 20],
      3: [20, 20],
      4: [20, 20],
      5: [20, 20],
      6: [20, 20]
    }
  },

  // Seeded random number generator (same seed = same sequence always)
  seededRng(seed) {
    let s = seed;
    return () => {
      s = (Math.imul(1664525, s) + 1013904223) | 0;
      return ((s >>> 0) / 4294967296);
    };
  },

  // Get integer seed from today's date
  getTodaySeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },

  // Get seed for any date string YYYY-MM-DD
  getSeedForDate(dateStr) {
    const [y, m, day] = dateStr.split('-').map(Number);
    return y * 10000 + m * 100 + day;
  },

  // Seeded pick from array
  seededPick(arr, rng, n = 1) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return n === 1 ? shuffled[0] : shuffled.slice(0, n);
  },

  // Get config (from Supabase if available, else defaults)
  async getConfig() {
    try {
      if (supabaseClient) {
        const { data } = await supabaseClient
          .from('daily_wod_config')
          .select('*')
          .single();
        if (data) return { ...this.defaultConfig, ...data.config };
      }
    } catch (e) { /* fall through to defaults */ }
    // Check localStorage for admin-saved config (demo mode)
    const saved = localStorage.getItem('daily_wod_config');
    if (saved) {
      try { return { ...this.defaultConfig, ...JSON.parse(saved) }; }
      catch (e) { /* use defaults */ }
    }
    return this.defaultConfig;
  },

  // Check if admin has manually set today's WOD in Supabase
  async getManualOverride(dateStr) {
    try {
      if (supabaseClient) {
        const { data } = await supabaseClient
          .from('daily_wods')
          .select('*')
          .eq('wod_date', dateStr)
          .single();
        if (data?.workout_data) return data.workout_data;
      }
    } catch (e) { /* no override */ }
    const key = `daily_wod_override_${dateStr}`;
    const saved = localStorage.getItem(key);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return null;
  },

  // Save a manual override for a specific date
  async saveOverride(dateStr, workoutData) {
    if (supabaseClient) {
      await supabaseClient.from('daily_wods').upsert({
        wod_date: dateStr,
        workout_data: workoutData,
        is_manual: true
      }, { onConflict: 'wod_date' });
    } else {
      localStorage.setItem(`daily_wod_override_${dateStr}`, JSON.stringify(workoutData));
    }
  },

  // Save admin config
  async saveConfig(config) {
    if (supabaseClient) {
      await supabaseClient.from('daily_wod_config').upsert({ id: 1, config }, { onConflict: 'id' });
    } else {
      localStorage.setItem('daily_wod_config', JSON.stringify(config));
    }
  },

  // Generate the workout for a given date
  async generate(dateStr) {
    dateStr = dateStr || new Date().toISOString().split('T')[0];

    // Check for manual override first
    const override = await this.getManualOverride(dateStr);
    if (override) return { ...override, duration: 20, isManual: true, date: dateStr };

    // Get admin config and movement pool in parallel
    const [config, movementDB] = await Promise.all([this.getConfig(), this._loadMovements()]);
    const dayOfWeek = new Date(dateStr + 'T12:00:00').getDay();
    const seed = this.getSeedForDate(dateStr);
    const rng = this.seededRng(seed);

    // Determine parameters for today
    const difficulty = config.difficultyByDay[dayOfWeek] || 'intermediate';
    const bodyFocus  = config.bodyFocusByDay[dayOfWeek]  || 'full-body';
    const format     = config.formatByDay[dayOfWeek]     || 'amrap';
    const duration   = 20; // The Daily 20 is always 20 minutes
    const equipment  = config.equipment || ['bodyweight'];

    // Build movement pool from Supabase data (with JS fallback)
    const pool = this._buildPool(equipment, difficulty, bodyFocus, rng, movementDB);

    // Generate workout by format
    let workout;
    if (format === 'amrap')   workout = this._genAMRAP(pool, difficulty, duration, bodyFocus, rng);
    else if (format === 'emom')    workout = this._genEMOM(pool, difficulty, duration, bodyFocus, rng);
    else if (format === 'fortime') workout = this._genForTime(pool, difficulty, rng);
    else                           workout = this._genCircuit(pool, difficulty, duration, bodyFocus, rng);

    // Derive actual equipment needed from selected movements (not the full config pool)
    const EQUIPMENT_LABELS = {
      bodyweight: 'Bodyweight',
      kettlebell: 'Kettlebell',
      dumbbell: 'Dumbbell',
      pullupbar: 'Pull-Up Bar',
      jumprope: 'Jump Rope',
      resistancebands: 'Resistance Bands',
      barbell: 'Barbell',
      box: 'Box',
      medicineball: 'Medicine Ball',
      rings: 'Rings',
      slamball: 'Slam Ball',
      running: 'Treadmill',
      rower: 'Rowing Machine',
      assaultbike: 'Assault Bike',
    };
    const usedEqKeys = [...new Set((workout.rows || []).map(r => r._eq).filter(Boolean))];
    const isBodyweightOnly = usedEqKeys.every(k => k === 'bodyweight');
    const usedEquipment = usedEqKeys
      .filter(k => k !== 'bodyweight')
      .map(k => EQUIPMENT_LABELS[k] || k);

    // Clean internal _eq tags from rows before returning
    if (workout.rows) workout.rows.forEach(r => delete r._eq);

    return {
      ...workout,
      date: dateStr,
      difficulty,
      bodyFocus,
      equipment: usedEquipment,
      isBodyweightOnly,
      duration,
      isManual: false,
      generatedAt: new Date().toISOString()
    };
  },

  // ── Movement pool builder ──────────────────────────────────────
  // movementDB: pre-loaded movement data (from _loadMovements()). Falls back to global MOVEMENT_DB.
  // 'dumbbell' in config maps to 'dumbbells' in the DB — normalized here.
  _buildPool(equipment, level, bodyFocus, rng, movementDB) {
    const mdb = movementDB || this._movementCache || (typeof MOVEMENT_DB !== 'undefined' ? MOVEMENT_DB : {});
    if (!mdb || Object.keys(mdb).length === 0) return [];
    let moves = (mdb.bodyweight || []).map(m => ({ ...m, _eq: 'bodyweight' }));
    equipment.forEach(eq => {
      const key = eq === 'dumbbell' ? 'dumbbells' : eq; // normalize singular→plural
      if (eq !== 'bodyweight' && mdb[key]) moves.push(...mdb[key].map(m => ({ ...m, _eq: eq })));
    });
    if (level === 'beginner') moves = moves.filter(m => !/(muscle.up|snatch|toes.to.bar|double under|turkish)/i.test(m.name));
    if (level === 'intermediate') moves = moves.filter(m => !/(muscle.up)/i.test(m.name));

    const BF_TAGS = {
      'full-body': null,
      'upper-body': ['push','pull'],
      'lower-body': ['lower','legs-glutes'],
      'core': ['core'],
      'push': ['push'],
      'pull': ['pull'],
      'legs-glutes': ['lower','legs-glutes'],
      'cardio': ['cardio','full'],
    };
    const tags = BF_TAGS[bodyFocus];
    if (tags) {
      const primary = moves.filter(m => m.tags && m.tags.some(t => tags.includes(t)));
      if (primary.length >= 3) moves = primary;
    }
    return moves;
  },

  _getReps(m, level) {
    const r = m[level === 'beginner' ? 'b' : level === 'intermediate' ? 'i' : 'a'];
    if (Array.isArray(r)) return r[0];
    return r;
  },

  _balancedPick(pool, count, rng) {
    const buckets = { lower:[], push:[], pull:[], core:[], full:[], other:[] };
    pool.forEach(m => {
      const t = m.tags || [];
      if (t.includes('full'))  buckets.full.push(m);
      else if (t.includes('lower')) buckets.lower.push(m);
      else if (t.includes('push'))  buckets.push.push(m);
      else if (t.includes('pull'))  buckets.pull.push(m);
      else if (t.includes('core'))  buckets.core.push(m);
      else buckets.other.push(m);
    });
    const order = count >= 5 ? ['lower','push','pull','core','full']
                : count === 4 ? ['lower','push','pull','core']
                : count === 3 ? ['lower','push','core']
                : ['lower','push'];
    const result = [];
    order.forEach(cat => {
      const bk = [...buckets[cat]];
      if (bk.length) {
        const idx = Math.floor(rng() * bk.length);
        result.push(bk.splice(idx, 1)[0]);
        buckets[cat] = bk;
      }
    });
    while (result.length < count) {
      const rem = Object.values(buckets).flat().filter(m => !result.includes(m));
      if (!rem.length) break;
      result.push(rem[Math.floor(rng() * rem.length)]);
    }

    // Guarantee at least one equipment movement when equipment is in the pool
    const hasEquipInResult = result.some(m => m._eq && m._eq !== 'bodyweight');
    const equipInPool = pool.filter(m => m._eq && m._eq !== 'bodyweight');
    if (!hasEquipInResult && equipInPool.length > 0) {
      // Pick a random equipment movement from the pool
      const eqPick = equipInPool[Math.floor(rng() * equipInPool.length)];
      // Find a bodyweight movement in result that shares a tag with the equipment pick,
      // so we maintain muscle-group balance when swapping
      const eqTags = eqPick.tags || [];
      let swapIdx = result.findIndex(m => m._eq === 'bodyweight' && m.tags && m.tags.some(t => eqTags.includes(t)));
      // If no tag overlap, swap the last bodyweight slot
      if (swapIdx === -1) swapIdx = result.length - 1;
      result[swapIdx] = eqPick;
    }

    return result;
  },

  _genAMRAP(pool, level, duration, bodyFocus, rng) {
    const count = duration <= 15 ? 3 : duration <= 25 ? 4 : 5;
    const sel = this._balancedPick(pool, count, rng);
    return {
      title: `Daily 20: AMRAP`,
      format: 'amrap',
      description: `Complete as many rounds as possible in ${duration} minutes. Pace yourself — the goal is consistent rounds from start to finish.`,
      rows: sel.map(m => ({ movement: m.name, reps: String(this._getReps(m, level)), tip: m.tip, _eq: m._eq })),
      scoring: 'Record total rounds + reps (e.g. "8 rounds + 12 reps").'
    };
  },

  _genEMOM(pool, level, duration, bodyFocus, rng) {
    const movCount = Math.min(4, Math.max(2, Math.floor(duration / 4)));
    const sel = this._balancedPick(pool, movCount, rng);
    return {
      title: `Daily 20: EMOM`,
      format: 'emom',
      description: `Every Minute On the Minute for ${duration} minutes. Complete the designated work at the top of each minute; rest whatever remains.`,
      rows: sel.map((m, i) => ({ movement: m.name, reps: `Min ${i+1} (repeat): ${this._getReps(m, level)} reps`, tip: m.tip, _eq: m._eq })),
      scoring: 'Track whether you finish each minute before the next starts.'
    };
  },

  _genForTime(pool, level, rng) {
    const schemes = {
      beginner: [15,12,9], intermediate: [21,15,9], advanced: [30,20,10]
    };
    const scheme = schemes[level];
    const sel = this._balancedPick(pool, 3, rng);
    return {
      title: `Daily 20: For Time`,
      format: 'fortime',
      timeCap: 20,
      description: `Complete all rounds for time using the ${scheme.join('-')} rep scheme. 20-minute time cap — if you hit the cap, record your reps completed.`,
      rows: sel.map(m => ({ movement: m.name, reps: scheme.join(' – ') + ' reps', tip: m.tip, _eq: m._eq })),
      scoring: 'Record your finish time. If you hit the 20-min cap, record rounds + reps completed.'
    };
  },

  _genCircuit(pool, level, duration, bodyFocus, rng) {
    const movCount = duration <= 15 ? 4 : duration <= 30 ? 5 : 6;
    const rounds = duration <= 15 ? 3 : duration <= 30 ? 4 : 5;
    const sel = this._balancedPick(pool, movCount, rng);
    return {
      title: `Daily 20: Circuit`,
      format: 'circuit',
      description: `Complete all ${movCount} movements back-to-back with minimal rest. Rest 60 seconds between rounds. ${rounds} rounds total.`,
      rows: sel.map(m => ({ movement: m.name, reps: String(this._getReps(m, level)), tip: m.tip, _eq: m._eq })),
      scoring: 'Record total time and round splits.'
    };
  }
};
