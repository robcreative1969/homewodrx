// ============================================================================
// SEARCH UTILITIES  —  single source of truth for all search pages
// ============================================================================
// Exposes window.SearchUtils = { normStr, expandItemName, expandQuery }
//
// Add new acronyms or equipment aliases HERE once; every page (nav overlay,
// advanced search, movements listing, workouts listing) picks them up
// automatically because they all reference this shared module.
// ============================================================================

(function () {

  // ── CrossFit / functional-fitness acronyms → canonical search term ──────
  const ACRONYMS = {
    't2b':  'toes to bar',
    'ttb':  'toes to bar',
    'k2e':  'knees to elbows',
    'kte':  'knees to elbows',
    'hspu': 'handstand push ups',
    'hrpu': 'hand release push ups',
    'c2b':  'chest to bar pull ups',
    'ctb':  'chest to bar pull ups',
    'mu':   'muscle ups',
    'bmu':  'bar muscle ups',
    'rmu':  'ring muscle ups',
    'du':   'double unders',
    'dus':  'double unders',
    'su':   'single unders',
    'sus':  'single unders',
    'kbs':  'kettlebell swings',
    'rkbs': 'russian kettlebell swings',
    'akbs': 'american kettlebell swings',
    'ohs':  'overhead squat',
    's2oh': 'shoulder to overhead',
    'stoh': 'shoulder to overhead',
    'ghd':  'ghd sit ups',
    'wb':   'wall balls',
    'wbs':  'wall balls',
    'dl':   'deadlift',
    'pc':   'power clean',
    'hpc':  'hang power clean',
    'ps':   'power snatch',
    'hps':  'hang power snatch',
    'sn':   'snatch',
    'fs':   'front squat',
    'bs':   'back squat',
    'pp':   'push press',
    'pj':   'push jerk',
    'sj':   'split jerk',
    'cj':   'clean and jerk',
    'bj':   'box jumps',
    'bjs':  'box jumps',
    'rdl':  'romanian deadlift',
    'sdhp': 'sumo deadlift high pull',
    'rc':   'rope climbs',
  };

  // ── Collapse hyphens, spaces, apostrophes ────────────────────────────────
  // "push-up" / "pushup" / "push up" all normalise to "pushup"
  function normStr(s) {
    return String(s || '').toLowerCase().replace(/[-\s']+/g, '');
  }

  // ── Bidirectional equipment-prefix expansion ─────────────────────────────
  // Appends an alternate form to a name so stored abbreviations and full
  // words are treated as identical in every search context:
  //   "KB Press"           →  "kettlebell Press"
  //   "Kettlebell Swings"  →  "KB Swings"
  //   "DB Thrusters"       →  "dumbbell Thrusters"
  //   "MB Slams"           →  "medicine ball Slams"
  function expandItemName(name) {
    if (!name) return '';
    const low = name.toLowerCase();
    if (low.startsWith('kb '))            return 'kettlebell '    + name.slice(3);
    if (low.startsWith('db '))            return 'dumbbell '      + name.slice(3);
    if (low.startsWith('mb '))            return 'medicine ball ' + name.slice(3);
    if (low.startsWith('kettlebell '))    return 'KB '            + name.slice(11);
    if (low.startsWith('dumbbell '))      return 'DB '            + name.slice(9);
    if (low.startsWith('medicine ball ')) return 'MB '            + name.slice(13);
    return '';
  }

  // ── Expand acronym words in a user query string ──────────────────────────
  function expandQuery(q) {
    return String(q || '').trim().toLowerCase()
      .replace(/\bmed\s*ball\b/g, 'medicine ball')  // "medball" / "med ball" → "medicine ball"
      .split(/\s+/)
      .map(w => ACRONYMS[w] || w)
      .join(' ');
  }

  window.SearchUtils = { normStr, expandItemName, expandQuery };

})();
