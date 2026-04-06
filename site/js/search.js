// ============================================================================
// SITE-WIDE SEARCH
// ============================================================================
// Provides an in-nav search overlay with instant results covering benchmark
// WODs, movements, and user-created workouts.
//
// Open via:  🔍 nav button  |  /  key  |  Ctrl+K / Cmd+K
// Close via: Esc  |  backdrop click  |  Ctrl+K
// Navigate:  ↑ ↓ arrow keys, Enter to open result
// ============================================================================

const Search = (() => {

  // ── State ──────────────────────────────────────────────────────────────────
  let _isOpen     = false;
  let _cache      = null;     // { benchmarks, movements, workouts }
  let _loading    = false;
  let _loadPromise = null;

  let _results    = [];       // flat array of hrefs matching render order
  let _focused    = -1;
  let _debounce   = null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function slugify(str) {
    return String(str).toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Collapse hyphens and spaces so "pushup" / "push-up" / "push up" all match
  function normalize(str) {
    return String(str).toLowerCase().replace(/[-\s]+/g, '');
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadScript(src) {
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = resolve; // fail silently — search still works without movements
      document.head.appendChild(s);
    });
  }

  // ── CSS injection ──────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('srch-styles')) return;
    const style = document.createElement('style');
    style.id = 'srch-styles';
    style.textContent = `
      /* ── Overlay backdrop ── */
      #srch-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(10, 10, 18, 0.82);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        align-items: flex-start;
        justify-content: center;
        padding-top: 72px;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      #srch-overlay.srch-open { display: flex; }

      /* ── Modal panel ── */
      #srch-modal {
        background: var(--dark-card, #1E1E2C);
        border: 1px solid rgba(196, 18, 18, 0.35);
        border-radius: 16px;
        width: 100%;
        max-width: 640px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.7);
        overflow: hidden;
        animation: srchSlideIn 140ms ease;
      }
      @keyframes srchSlideIn {
        from { opacity: 0; transform: translateY(-12px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }

      /* ── Input row ── */
      #srch-input-row {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.9rem 1.1rem;
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }
      #srch-input-row .srch-mag {
        font-size: 1.05rem;
        opacity: 0.45;
        flex-shrink: 0;
        line-height: 1;
      }
      #srch-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        font-size: 1rem;
        color: var(--text-primary, #EAEAF0);
        font-family: inherit;
        caret-color: var(--orange, #C41212);
      }
      #srch-input::placeholder { color: var(--text-muted, #888899); }
      #srch-esc-btn {
        background: none;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: var(--text-muted, #888899);
        font-size: 0.7rem;
        padding: 0.2rem 0.45rem;
        cursor: pointer;
        flex-shrink: 0;
        font-family: inherit;
        transition: border-color 120ms, color 120ms;
      }
      #srch-esc-btn:hover { border-color: var(--orange, #C41212); color: var(--text-primary, #EAEAF0); }

      /* ── Results list ── */
      #srch-results {
        max-height: 400px;
        overflow-y: auto;
        padding: 0.4rem 0;
        scrollbar-width: thin;
        scrollbar-color: rgba(196,18,18,0.3) transparent;
      }
      #srch-results::-webkit-scrollbar { width: 4px; }
      #srch-results::-webkit-scrollbar-thumb { background: rgba(196,18,18,0.3); border-radius: 2px; }

      .srch-section {
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-muted, #888899);
        padding: 0.55rem 1.1rem 0.2rem;
      }
      .srch-item {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.55rem 1.1rem;
        text-decoration: none;
        color: var(--text-primary, #EAEAF0);
        cursor: pointer;
        transition: background 100ms;
        outline: none;
      }
      .srch-item:hover,
      .srch-item.srch-focused {
        background: rgba(196, 18, 18, 0.1);
        color: var(--text-primary, #EAEAF0);
      }
      .srch-icon {
        width: 30px;
        height: 30px;
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        flex-shrink: 0;
      }
      .srch-icon-bm   { background: rgba(196, 18, 18, 0.15); }
      .srch-icon-mv   { background: rgba(80, 200, 120, 0.12); }
      .srch-icon-wod  { background: rgba(100, 160, 255, 0.12); }
      .srch-text { flex: 1; min-width: 0; }
      .srch-name {
        font-size: 0.92rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .srch-meta {
        font-size: 0.72rem;
        color: var(--text-muted, #888899);
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
      }
      .srch-badge {
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        background: rgba(196,18,18,0.12);
        color: var(--orange, #C41212);
        border-radius: 4px;
        padding: 0.15rem 0.4rem;
        flex-shrink: 0;
      }

      /* ── Empty state ── */
      #srch-empty {
        display: none;
        padding: 1.75rem;
        text-align: center;
        color: var(--text-muted, #888899);
        font-size: 0.9rem;
      }

      /* ── Footer hint bar ── */
      #srch-hint {
        display: flex;
        gap: 0.6rem;
        justify-content: space-between;
        align-items: center;
        padding: 0.45rem 1rem;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      #srch-advanced-link {
        font-size: 0.72rem;
        color: var(--orange, #C41212);
        text-decoration: none;
        opacity: 0.85;
        transition: opacity 120ms;
        white-space: nowrap;
      }
      #srch-advanced-link:hover { opacity: 1; text-decoration: underline; }
      .srch-hint-keys {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .srch-kbd {
        font-size: 0.65rem;
        color: var(--text-muted, #888899);
        background: rgba(255,255,255,0.05);
        border-radius: 4px;
        padding: 0.15rem 0.38rem;
        font-family: monospace;
        letter-spacing: 0.02em;
      }

      /* ── Nav search button ── */
      #nav-search-btn {
        background: none;
        border: 1px solid transparent;
        border-radius: 8px;
        color: var(--text-primary, #EAEAF0);
        font-size: 1rem;
        padding: 0.3rem 0.5rem;
        cursor: pointer;
        line-height: 1;
        transition: border-color 150ms, color 150ms, background 150ms;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      #nav-search-btn:hover {
        border-color: var(--orange, #C41212);
        color: var(--orange, #C41212);
        background: rgba(196,18,18,0.08);
      }
      #nav-search-btn .srch-shortcut-hint {
        font-size: 0.6rem;
        color: var(--text-muted, #888899);
        background: rgba(255,255,255,0.07);
        border-radius: 4px;
        padding: 0.1rem 0.3rem;
        font-family: monospace;
        line-height: 1.4;
      }
      @media (max-width: 768px) {
        #nav-search-btn .srch-shortcut-hint { display: none; }
        #srch-overlay { padding-top: 12px; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Build overlay DOM ──────────────────────────────────────────────────────
  function buildOverlay() {
    if (document.getElementById('srch-overlay')) return;

    const el = document.createElement('div');
    el.id = 'srch-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Site search');
    el.innerHTML = `
      <div id="srch-modal">
        <div id="srch-input-row">
          <span class="srch-mag" aria-hidden="true">🔍</span>
          <input id="srch-input"
                 type="search"
                 autocomplete="off"
                 spellcheck="false"
                 autocorrect="off"
                 placeholder="Search WODs, movements…"
                 aria-label="Search" />
          <button id="srch-esc-btn" aria-label="Close search">Esc</button>
        </div>
        <div id="srch-results" role="listbox" aria-label="Search results"></div>
        <div id="srch-empty">No results — try a movement name or WOD like "Fran" · <a id="srch-empty-link" href="/search" style="color:var(--orange,#C41212);">Advanced Search</a> for filters</div>
        <div id="srch-hint" aria-hidden="true">
          <a id="srch-advanced-link" href="/search">Advanced Search + Filters →</a>
          <div class="srch-hint-keys">
            <span class="srch-kbd">↑↓ navigate</span>
            <span class="srch-kbd">↵ open</span>
            <span class="srch-kbd">esc close</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    // Backdrop click
    el.addEventListener('click', e => { if (e.target === el) close(); });

    // Input events
    const input = el.querySelector('#srch-input');
    input.addEventListener('input', () => handleInput(input.value));
    input.addEventListener('keydown', handleKeydown);

    // Esc button
    el.querySelector('#srch-esc-btn').addEventListener('click', close);
  }

  // ── Data loading ───────────────────────────────────────────────────────────
  async function getData() {
    if (_cache) return _cache;
    if (_loadPromise) return _loadPromise;

    _loadPromise = (async () => {
      // 1. Benchmark WODs
      let benchmarks = [];
      try {
        benchmarks = (await db.getAllBenchmarks()) || [];
      } catch (_) {
        benchmarks = typeof BENCHMARKS !== 'undefined' ? BENCHMARKS : [];
      }

      // 2. Movements — flatten MOVEMENT_DB (load script if needed)
      let movements = [];
      if (typeof MOVEMENT_DB === 'undefined') {
        await loadScript('/js/movements.js');
      }
      if (typeof MOVEMENT_DB !== 'undefined') {
        const seen = new Set();
        Object.values(MOVEMENT_DB).forEach(cat => {
          cat.forEach(m => {
            if (m.name && !seen.has(m.name)) {
              seen.add(m.name);
              movements.push({
                name: m.name,
                slug: slugify(m.name),
                tags: m.tags || []
              });
            }
          });
        });
        movements.sort((a, b) => a.name.localeCompare(b.name));
      }

      // 3. User-created (public) workouts — exclude benchmarks
      let workouts = [];
      try {
        const raw = await db.getWorkouts({ isPublic: true, limit: 500 });
        workouts = (raw || []).filter(w => w.title && !w.benchmark_slug);
      } catch (_) {}

      _cache = { benchmarks, movements, workouts };
      return _cache;
    })();

    return _loadPromise;
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  function scoreMatch(text, q) {
    const t  = text.toLowerCase();
    const tn = normalize(text);
    const qn = normalize(q);

    if (t === q || tn === qn)               return 4;
    if (t.startsWith(q) || tn.startsWith(qn)) return 3;
    // All query words present anywhere (raw)
    const words = q.split(/\s+/);
    if (words.every(w => t.includes(w)))    return 2;
    // Substring match — raw or normalized (catches pushup ↔ push-up)
    if (t.includes(q) || tn.includes(qn))  return 1;
    return 0;
  }

  function filterSet(items, gettext, max = 5) {
    return items
      .map(item => ({ item, s: scoreMatch(gettext(item), _currentQuery) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, max)
      .map(x => x.item);
  }

  let _currentQuery = '';

  function applyFilter(q, data) {
    _currentQuery = q.trim().toLowerCase();
    if (!_currentQuery) return { benchmarks: [], movements: [], workouts: [] };
    return {
      benchmarks: filterSet(data.benchmarks, b =>
        (b.name || '') + ' ' + (b.category || '') + ' ' + (b.description || '')),
      movements:  filterSet(data.movements,  m =>
        (m.name || '') + ' ' + (m.tags || []).join(' ')),
      workouts:   filterSet(data.workouts,   w =>
        (w.title || '') + ' ' + (w.description || ''))
    };
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  function renderFiltered(filtered) {
    const resultsEl = document.getElementById('srch-results');
    const emptyEl   = document.getElementById('srch-empty');
    if (!resultsEl || !emptyEl) return;

    _results = [];
    _focused = -1;

    const { benchmarks, movements, workouts } = filtered;
    const total = benchmarks.length + movements.length + workouts.length;

    if (total === 0) {
      resultsEl.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';

    let html = '';

    if (benchmarks.length) {
      html += `<div class="srch-section">Benchmark WODs</div>`;
      benchmarks.forEach(b => {
        const href = `/workout.html?slug=${encodeURIComponent(b.slug)}`;
        const meta = b.category || 'Benchmark';
        _results.push(href);
        html += `
          <a href="${href}" class="srch-item" role="option" tabindex="-1">
            <div class="srch-icon srch-icon-bm" aria-hidden="true">⚡</div>
            <div class="srch-text">
              <div class="srch-name">${esc(b.name)}</div>
              <div class="srch-meta">${esc(meta)}</div>
            </div>
            <span class="srch-badge">WOD</span>
          </a>`;
      });
    }

    if (movements.length) {
      html += `<div class="srch-section">Movements</div>`;
      movements.forEach(m => {
        const href = `/movement.html?slug=${encodeURIComponent(m.slug)}`;
        const meta = (m.tags || []).slice(0, 3).join(', ');
        _results.push(href);
        html += `
          <a href="${href}" class="srch-item" role="option" tabindex="-1">
            <div class="srch-icon srch-icon-mv" aria-hidden="true">💪</div>
            <div class="srch-text">
              <div class="srch-name">${esc(m.name)}</div>
              <div class="srch-meta">${esc(meta)}</div>
            </div>
            <span class="srch-badge">Move</span>
          </a>`;
      });
    }

    if (workouts.length) {
      html += `<div class="srch-section">Community WODs</div>`;
      workouts.forEach(w => {
        const href = `/workout.html?id=${w.id}`;
        const meta = w.description
          ? w.description.replace(/<[^>]*>/g, '').slice(0, 70)
          : 'Community workout';
        _results.push(href);
        html += `
          <a href="${href}" class="srch-item" role="option" tabindex="-1">
            <div class="srch-icon srch-icon-wod" aria-hidden="true">🏋️</div>
            <div class="srch-text">
              <div class="srch-name">${esc(w.title)}</div>
              <div class="srch-meta">${esc(meta)}</div>
            </div>
            <span class="srch-badge">Custom</span>
          </a>`;
      });
    }

    resultsEl.innerHTML = html;

    // Keep the Advanced Search link in sync with the current query
    const advLink = document.getElementById('srch-advanced-link');
    const emptyLink = document.getElementById('srch-empty-link');
    const href = _currentQuery ? `/search?q=${encodeURIComponent(_currentQuery)}` : '/search';
    if (advLink) advLink.href = href;
    if (emptyLink) emptyLink.href = href;
  }

  // ── Keyboard focus management ──────────────────────────────────────────────
  function moveFocus(delta) {
    const items = document.querySelectorAll('#srch-results .srch-item');
    if (!items.length) return;
    if (_focused >= 0 && items[_focused]) {
      items[_focused].classList.remove('srch-focused');
    }
    _focused = Math.max(-1, Math.min(_focused + delta, items.length - 1));
    if (_focused >= 0 && items[_focused]) {
      items[_focused].classList.add('srch-focused');
      items[_focused].scrollIntoView({ block: 'nearest' });
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape')    { close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(+1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (_focused >= 0 && _results[_focused]) {
        window.location.href = _results[_focused];
      }
    }
  }

  // ── Input handler (debounced) ──────────────────────────────────────────────
  async function handleInput(value) {
    clearTimeout(_debounce);
    _debounce = setTimeout(async () => {
      const q = value.trim();
      if (!q) {
        renderFiltered({ benchmarks: [], movements: [], workouts: [] });
        return;
      }
      const data = await getData();
      renderFiltered(applyFilter(q, data));
    }, 70);
  }

  // ── Open / close ───────────────────────────────────────────────────────────
  function open() {
    if (_isOpen) return;
    _isOpen = true;
    document.getElementById('srch-overlay')?.classList.add('srch-open');
    const input = document.getElementById('srch-input');
    if (input) { input.value = ''; input.focus(); }
    document.getElementById('srch-results').innerHTML = '';
    document.getElementById('srch-empty').style.display = 'none';
    _results = [];
    _focused = -1;
    // Kick off data loading in background while user types
    getData();
  }

  function close() {
    if (!_isOpen) return;
    _isOpen = false;
    document.getElementById('srch-overlay')?.classList.remove('srch-open');
    clearTimeout(_debounce);
  }

  // ── Global keyboard shortcuts ──────────────────────────────────────────────
  function attachKeyboard() {
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName;
      const editable = tag === 'INPUT' || tag === 'TEXTAREA'
        || document.activeElement?.isContentEditable;

      // Esc always closes
      if (e.key === 'Escape' && _isOpen) { close(); return; }

      // Ctrl/Cmd+K toggles from anywhere
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        _isOpen ? close() : open();
        return;
      }

      // '/' opens from non-input contexts
      if (!_isOpen && !editable && e.key === '/') {
        e.preventDefault();
        open();
      }
    });
  }

  // ── Public init ────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    buildOverlay();
    attachKeyboard();
  }

  return { init, open, close };

})();

// Expose globally so nav.js can call Search.open() from its click handler.
// (const/let at the top level of a browser script do NOT attach to window —
//  only var does, so we assign explicitly.)
window.Search = Search;

// Auto-init after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Search.init());
} else {
  Search.init();
}
