// ============================================================================
// DAILY STRETCH ENGINE
// ============================================================================
// Generates a deterministic 10-minute stretch routine each day.
// The same date always produces the same routine for every visitor.
// Mirrors the DailyWOD pattern — seeded RNG, Supabase source, JS fallback.

const DailyStretch = {

  _stretchCache: null,

  // Load all stretches from Supabase; fall back to STRETCH_DB if needed
  async _loadStretches() {
    if (this._stretchCache) return this._stretchCache;

    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        const { data, error } = await supabaseClient
          .from('stretches')
          .select('name, slug, modality, focus, level, sides, hold_beginner, hold_intermediate, hold_advanced, tip');

        if (!error && data && data.length > 0) {
          this._stretchCache = data;
          return data;
        }
      }
    } catch (e) {
      console.warn('DailyStretch: Could not load from Supabase, using JS fallback.', e);
    }

    // Flatten STRETCH_DB (JS fallback)
    if (typeof STRETCH_DB !== 'undefined') {
      const flat = [];
      Object.entries(STRETCH_DB).forEach(([modality, entries]) => {
        entries.forEach(s => {
          flat.push({
            name: s.name,
            slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            modality,
            focus: s.focus || [],
            level: s.level || ['b','i','a'],
            sides: s.sides || false,
            hold_beginner:     (s.hold && s.hold.b) || 30,
            hold_intermediate: (s.hold && s.hold.i) || 40,
            hold_advanced:     (s.hold && s.hold.a) || 60,
            tip: s.tip || ''
          });
        });
      });
      this._stretchCache = flat;
      return flat;
    }
    return [];
  },

  // Seeded RNG — same seed always produces the same sequence
  _seededRng(seed) {
    let s = seed;
    return () => {
      s = (Math.imul(1664525, s) + 1013904223) | 0;
      return ((s >>> 0) / 4294967296);
    };
  },

  _getTodaySeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },

  _getSeedForDate(dateStr) {
    const [y, m, day] = dateStr.split('-').map(Number);
    return y * 10000 + m * 100 + day;
  },

  // Seeded shuffle-pick
  _seededPick(arr, rng, n) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return n === 1 ? shuffled[0] : shuffled.slice(0, Math.min(n, shuffled.length));
  },

  // Focus theme by day of week (0 = Sunday)
  _focusByDay: {
    0: { focus: ['hips', 'full'],            label: 'Full Body Recovery',   modalities: ['static', 'yoga'] },
    1: { focus: ['hips', 'full'],            label: 'Hip & Lower Body',     modalities: ['static', 'dynamic'] },
    2: { focus: ['hamstrings', 'full'],      label: 'Hamstring & Posterior Chain', modalities: ['static', 'pnf'] },
    3: { focus: ['shoulders', 'chest', 'full'], label: 'Shoulder & Upper Back', modalities: ['static', 'dynamic', 'yoga'] },
    4: { focus: ['hips', 'back', 'full'],    label: 'Hip & Thoracic Reset', modalities: ['static', 'yoga'] },
    5: { focus: ['full'],                    label: 'Full Body Flush',      modalities: ['dynamic', 'static'] },
    6: { focus: ['hamstrings', 'hips', 'full'], label: 'Recovery & Mobility', modalities: ['static', 'yoga', 'pnf'] }
  },

  // Target ~10 minutes: build a list of stretches whose total hold time ≈ 600 seconds
  // sides=true stretches count double; target between 5–8 stretches
  _buildRoutine(stretches, dayOfWeek, rng) {
    const theme = this._focusByDay[dayOfWeek] || this._focusByDay[0];

    // Score each stretch by relevance to today's focus
    const focused = stretches.filter(s => {
      const f = s.focus || [];
      return theme.focus.some(tf => f.includes(tf));
    });
    const others = stretches.filter(s => !focused.includes(s));

    // Prefer focused; fill with others if needed
    const pool = focused.length >= 5 ? focused : [...focused, ...others];

    // Shuffle pool
    const shuffled = this._seededPick(pool, rng, pool.length);

    // Pick stretches until we hit ~10 minutes (600s), using intermediate hold times
    const selected = [];
    let totalSeconds = 0;
    const TARGET = 600;

    for (const s of shuffled) {
      if (selected.length >= 8) break;
      const hold = s.hold_intermediate || 40;
      const effective = s.sides ? hold * 2 : hold;
      if (totalSeconds + effective > TARGET + 120) break; // allow 2-min over
      selected.push(s);
      totalSeconds += effective;
      if (totalSeconds >= TARGET && selected.length >= 5) break;
    }

    // Always return at least 5 if pool allows
    if (selected.length < 5 && shuffled.length >= 5) {
      while (selected.length < 5 && selected.length < shuffled.length) {
        const next = shuffled[selected.length];
        if (!selected.includes(next)) selected.push(next);
      }
    }

    return { theme, selected, totalSeconds };
  },

  // Check for a cached routine in Supabase for this date
  async _getCached(dateStr) {
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        const { data } = await supabaseClient
          .from('daily_stretches')
          .select('stretch_data')
          .eq('stretch_date', dateStr)
          .single();
        if (data?.stretch_data) return data.stretch_data;
      }
    } catch (e) { /* no cache */ }
    return null;
  },

  // Cache the generated routine in Supabase so all visitors get the same result
  async _cache(dateStr, routineData) {
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        await supabaseClient
          .from('daily_stretches')
          .upsert({ stretch_date: dateStr, stretch_data: routineData }, { onConflict: 'stretch_date' });
      }
    } catch (e) { /* non-fatal */ }
  },

  // ── Main entry point ─────────────────────────────────────────────────────
  async generate(dateStr) {
    dateStr = dateStr || new Date().toISOString().split('T')[0];

    // Return cached version if it exists (saves Supabase reads on repeated page loads)
    const cached = await this._getCached(dateStr);
    if (cached) return cached;

    const stretches = await this._loadStretches();
    if (!stretches.length) return null;

    const dayOfWeek = new Date(dateStr + 'T12:00:00').getDay();
    const seed = this._getSeedForDate(dateStr);
    const rng = this._seededRng(seed);

    const { theme, selected, totalSeconds } = this._buildRoutine(stretches, dayOfWeek, rng);

    // Format rows for rendering
    const rows = selected.map(s => ({
      name: s.name,
      slug: s.slug,
      hold: s.hold_intermediate || 40,
      sides: s.sides || false,
      display: s.sides
        ? `${s.hold_intermediate || 40} sec / side`
        : `${s.hold_intermediate || 40} sec`,
      tip: s.tip || ''
    }));

    const totalMin = Math.round(totalSeconds / 60);

    const result = {
      date: dateStr,
      label: theme.label,
      rows,
      totalSeconds,
      totalMin,
      generatedAt: new Date().toISOString()
    };

    // Cache for subsequent visitors
    await this._cache(dateStr, result);

    return result;
  }
};
