// ============================================================================
// ANALYTICS — Custom Event Tracking
// ============================================================================
// Wraps gtag() calls so every custom event is defined in one place.
// All functions are no-ops if GA4 hasn't loaded (dev/offline safety).
//
// Usage: Analytics.login(), Analytics.signup(), etc.
// Loaded by nav.js so it's available on every page.
// ============================================================================

const Analytics = {

  // Guard: silently skip if gtag isn't available
  _fire(eventName, params = {}) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params);
  },

  // ── Auth ──────────────────────────────────────────────────────────────────

  signup() {
    this._fire('sign_up', { method: 'email' });
  },

  login() {
    this._fire('login', { method: 'email' });
  },

  logout() {
    this._fire('logout');
  },

  // ── WOD Actions ──────────────────────────────────────────────────────────

  // Call after a result is successfully saved
  // workoutType: 'benchmark' | 'user_wod'
  // scoreType:   'time' | 'rounds' | 'reps' | 'load' | 'calories' | 'check'
  logResult(workoutSlug, workoutType, scoreType) {
    this._fire('log_result', {
      workout_slug: workoutSlug,
      workout_type: workoutType,
      score_type:   scoreType
    });
  },

  // Call when user shares a WOD
  // platform: 'x' | 'facebook' | 'whatsapp' | 'copy_link'
  share(workoutSlug, platform) {
    this._fire('share', {
      content_type:  'workout',
      item_id:       workoutSlug,
      share_platform: platform
    });
  },

  // Call when user prints a WOD
  print(workoutSlug) {
    this._fire('print_wod', {
      workout_slug: workoutSlug
    });
  },

  // ── Builder ───────────────────────────────────────────────────────────────

  // Call when a WOD is generated in Smart WOD Builder or Create Your Own
  // builderType: 'smart' | 'custom' | 'tabata'
  generateWod(builderType, format) {
    this._fire('generate_wod', {
      builder_type: builderType,
      wod_format:   format
    });
  },

  // ── Stretch Builder ───────────────────────────────────────────────────────

  // Call after a stretch session is successfully generated
  // focusAreas: array of focus IDs e.g. ['hips','hamstrings']
  // duration:   number in minutes
  generateStretch(focusAreas, duration) {
    this._fire('generate_stretch', {
      focus_areas: (focusAreas || []).join(','),
      duration_min: duration
    });
  },

  // ── Timer ─────────────────────────────────────────────────────────────────

  // Call when the user starts the countdown (about to do the workout)
  // format: 'AMRAP' | 'EMOM' | 'FORTIME' | 'TABATA' | 'CUSTOM' etc.
  timerStart(format, wodName) {
    this._fire('timer_start', {
      timer_format: format || 'unknown',
      wod_name:     wodName || null
    });
  },

  // Call when the timer reaches zero or user taps Done
  timerComplete(format, wodName, durationSecs) {
    this._fire('timer_complete', {
      timer_format:  format || 'unknown',
      wod_name:      wodName || null,
      duration_secs: durationSecs || null
    });
  },

  // ── Shop / Affiliate ──────────────────────────────────────────────────────

  // Call when user clicks a gear card (affiliate link)
  // productName: e.g. 'Olympic Barbell'
  // category:    e.g. 'barbells' | 'gymnastics' | 'supplements' etc.
  affiliateClick(productName, category) {
    this._fire('affiliate_click', {
      product_name:     productName,
      product_category: category
    });
  },

  // ── Companion ─────────────────────────────────────────────────────────────

  // Call when user sends a message to the AI companion
  companionMessage() {
    this._fire('companion_message');
  },

  // ── Search ────────────────────────────────────────────────────────────────

  // Call when a search is performed
  // Debounced in search.js — only fires after the user pauses typing
  search(query, resultsCount) {
    this._fire('search', {
      search_term:   query,
      results_count: resultsCount
    });
  }

};
