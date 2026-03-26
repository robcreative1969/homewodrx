// ============================================================================
// DAILY WOD ENGINE
// ============================================================================
// Generates a deterministic workout each day based on admin config.
// The same date always produces the same workout for every visitor.
// Admin can manually override via Supabase or the admin panel.

const DailyWOD = {

  // Default admin config (can be overridden in Supabase daily_wod_config table)
  defaultConfig: {
    // Equipment assumed available for daily WODs
    equipment: ['bodyweight'],
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
    // Duration range in minutes [min, max]
    durationByDay: {
      0: [15, 20],   // Sunday: shorter
      1: [20, 25],
      2: [20, 30],
      3: [20, 25],
      4: [20, 30],
      5: [25, 35],   // Friday: longer
      6: [20, 30]
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
    if (override) return { ...override, isManual: true, date: dateStr };

    // Get admin config
    const config = await this.getConfig();
    const dayOfWeek = new Date(dateStr + 'T12:00:00').getDay();
    const seed = this.getSeedForDate(dateStr);
    const rng = this.seededRng(seed);

    // Determine parameters for today
    const difficulty = config.difficultyByDay[dayOfWeek] || 'intermediate';
    const bodyFocus  = config.bodyFocusByDay[dayOfWeek]  || 'full-body';
    const format     = config.formatByDay[dayOfWeek]     || 'amrap';
    const durRange   = config.durationByDay[dayOfWeek]   || [20, 30];
    const duration   = durRange[0] + Math.floor(rng() * (durRange[1] - durRange[0] + 1));
    const equipment  = config.equipment || ['bodyweight'];

    // Build movement pool (reuse logic from generator)
    const pool = this._buildPool(equipment, difficulty, bodyFocus, rng);

    // Generate workout by format
    let workout;
    if (format === 'amrap')   workout = this._genAMRAP(pool, difficulty, duration, bodyFocus, rng);
    else if (format === 'emom')    workout = this._genEMOM(pool, difficulty, duration, bodyFocus, rng);
    else if (format === 'fortime') workout = this._genForTime(pool, difficulty, rng);
    else                           workout = this._genCircuit(pool, difficulty, duration, bodyFocus, rng);

    return {
      ...workout,
      date: dateStr,
      difficulty,
      bodyFocus,
      equipment,
      isManual: false,
      generatedAt: new Date().toISOString()
    };
  },

  // ── Movement pool builder ──────────────────────────────────────
  _buildPool(equipment, level, bodyFocus, rng) {
    // Use the same movement DB as the generator (MOVEMENT_DB must be loaded)
    if (typeof MOVEMENT_DB === 'undefined') return [];
    let moves = [...(MOVEMENT_DB.bodyweight || [])];
    equipment.forEach(eq => { if (eq !== 'bodyweight' && MOVEMENT_DB[eq]) moves.push(...MOVEMENT_DB[eq]); });
    if (level === 'beginner') moves = moves.filter(m => !/(muscle.up|snatch|toes.to.bar|double under|turkish)/i.test(m.name));
    if (level === 'intermediate') moves = moves.filter(m => !/(muscle.up)/i.test(m.name));

    // Body focus filter
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
    return result;
  },

  _genAMRAP(pool, level, duration, bodyFocus, rng) {
    const count = duration <= 15 ? 3 : duration <= 25 ? 4 : 5;
    const sel = this._balancedPick(pool, count, rng);
    return {
      title: `${duration}-Minute AMRAP`,
      format: 'AMRAP',
      description: `Complete as many rounds as possible in ${duration} minutes. Pace yourself — the goal is consistent rounds from start to finish.`,
      rows: sel.map(m => ({ movement: m.name, reps: String(this._getReps(m, level)), tip: m.tip })),
      scoring: 'Record total rounds + reps (e.g. "8 rounds + 12 reps").'
    };
  },

  _genEMOM(pool, level, duration, bodyFocus, rng) {
    const movCount = Math.min(4, Math.max(2, Math.floor(duration / 4)));
    const sel = this._balancedPick(pool, movCount, rng);
    return {
      title: `${duration}-Minute EMOM`,
      format: 'EMOM',
      description: `Every Minute On the Minute for ${duration} minutes. Complete the designated work at the top of each minute; rest whatever remains.`,
      rows: sel.map((m, i) => ({ movement: m.name, reps: `Min ${i+1} (repeat): ${this._getReps(m, level)} reps`, tip: m.tip })),
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
      title: `For Time — ${scheme.join('-')}`,
      format: 'For Time',
      description: `Complete all rounds for time using the ${scheme.join('-')} rep scheme. Push the pace.`,
      rows: sel.map(m => ({ movement: m.name, reps: scheme.join(' – ') + ' reps', tip: m.tip })),
      scoring: 'Record your finish time.'
    };
  },

  _genCircuit(pool, level, duration, bodyFocus, rng) {
    const movCount = duration <= 15 ? 4 : duration <= 30 ? 5 : 6;
    const rounds = duration <= 15 ? 3 : duration <= 30 ? 4 : 5;
    const sel = this._balancedPick(pool, movCount, rng);
    return {
      title: `${rounds}-Round Circuit`,
      format: 'Circuit',
      description: `Complete all ${movCount} movements back-to-back with minimal rest. Rest 60 seconds between rounds. ${rounds} rounds total.`,
      rows: sel.map(m => ({ movement: m.name, reps: String(this._getReps(m, level)), tip: m.tip })),
      scoring: 'Record total time and round splits.'
    };
  }
};
