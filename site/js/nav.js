// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================
// Inject shared nav bar into every page. Pages opt in via:
//   <body data-nav-init="true" data-active-page="[section]">
//
// Active-page values and their parent category:
//   Workout:  workouts, workout, movements, movement, generator, timer, daily-wod
//   Stretch:  stretch, stretches, stretch-movement, stretch-routines, stretch-routine
//   Shop:     shop
//   Blog:     blog

const Nav = {

  async init(activePage = '') {
    // Render nav immediately — both auth states hidden to prevent flash
    document.body.insertAdjacentHTML('afterbegin', this.render(activePage));
    this.attachEventListeners();
    this.loadSearchScript();
    this.loadAnalytics();

    // Sync pre-check: if we know the user was logged in last visit, show
    // avatar placeholder instantly so there's no guest→avatar flash
    const cachedAuth   = localStorage.getItem('hwrx_authed');
    const cachedInitial= localStorage.getItem('hwrx_initial') || '?';
    const cachedName   = localStorage.getItem('hwrx_name')    || 'Athlete';
    const cachedHandle = localStorage.getItem('hwrx_handle')  || '@athlete';
    const cachedAvatar = localStorage.getItem('hwrx_avatar')  || '';
    if (cachedAuth === '1') {
      const $ = id => document.getElementById(id);
      if (cachedAvatar) {
        Nav._applyAvatarImg($('avatar-initials'),    cachedAvatar);
        Nav._applyAvatarImg($('avatar-initials-dd'), cachedAvatar);
      } else {
        if ($('avatar-initials'))    $('avatar-initials').textContent    = cachedInitial;
        if ($('avatar-initials-dd')) $('avatar-initials-dd').textContent = cachedInitial;
      }
      if ($('avatar-name-dd'))     $('avatar-name-dd').textContent     = cachedName;
      if ($('avatar-handle-dd'))   $('avatar-handle-dd').textContent   = cachedHandle;
      if ($('nav-auth'))           $('nav-auth').style.display         = 'flex';
    } else {
      // Show guest buttons right away — no session cached
      const guestEl = document.getElementById('nav-guest');
      if (guestEl) guestEl.style.display = 'flex';
    }

    // Async Supabase verify — corrects state if cache is stale
    // If db.js isn't loaded on this page, skip the verify entirely — don't
    // call updateAuth(null) which would clear the cache and flash guest state.
    if (typeof db === 'undefined') return;

    await this.ensureSupabase();
    const currentUser = await db.getUser();
    if (currentUser) db.updateLastSeen();

    let profileUsername = null;
    let avatarUrl = null;
    if (currentUser) {
      try {
        const profile = await db.getProfile(currentUser.id);
        profileUsername = profile?.username   || null;
        avatarUrl       = profile?.avatar_url || null;
      } catch (e) { /* fallback to email-based display name */ }
    }

    this.updateAuth(currentUser, profileUsername, avatarUrl);
  },

  loadSearchScript() {
    // Always ensure search-utils.js (shared utilities) loads before search.js
    // (the nav overlay). If it's already on the page via a static <script> tag,
    // window.SearchUtils will already exist — skip straight to the overlay.
    if (window.SearchUtils || document.querySelector('script[src="/js/search-utils.js"]')) {
      this._loadSearchOverlay();
    } else {
      const utils = document.createElement('script');
      utils.src = '/js/search-utils.js';
      utils.onload = () => this._loadSearchOverlay();
      document.head.appendChild(utils);
    }
  },

  _loadSearchOverlay() {
    // Guard against double-load during the CDN download window
    if (window.Search || document.querySelector('script[src="/js/search.js"]')) return;
    const script = document.createElement('script');
    script.src = '/js/search.js';
    document.head.appendChild(script);
  },

  loadAnalytics() {
    // Load analytics.js once — skip if already present or Analytics already defined
    if (window.Analytics || document.querySelector('script[src="/js/analytics.js"]')) return;
    const script = document.createElement('script');
    script.src = '/js/analytics.js';
    document.head.appendChild(script);
  },

  async ensureSupabase() {
    if (CONFIG.isConfigured()) {
      let attempts = 0;
      while (!window.supabase && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      // typeof guard: supabaseClient lives in db.js which may not be loaded on this page
      if (typeof supabaseClient !== 'undefined' && !supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(
          CONFIG.SUPABASE_URL,
          CONFIG.SUPABASE_ANON_KEY
        );
      }
    }
  },

  render(activePage) {
    const isWorkout  = ['workouts','workout','generator','wodbuilder','timer','daily-wod'].includes(activePage);
    const isMovement = ['movements','movement'].includes(activePage);
    const isStretch  = ['stretch','stretchbuilder','stretches','stretch-movement','stretch-routines','stretch-routine'].includes(activePage);
    const isShop     = activePage === 'shop';
    const isBlog     = activePage === 'blog';
    const isProfile  = ['profile','myworkouts','settings'].includes(activePage);

    const wA  = isWorkout  ? ' active' : '';
    const mA  = isMovement ? ' active' : '';
    const sA  = isStretch  ? ' active' : '';
    const shA = isShop     ? ' active' : '';
    const bA  = isBlog     ? ' active' : '';
    const pA  = isProfile  ? ' active' : '';

    return `<nav class="site-nav">
<div class="nav-inner">
  <a class="nav-logo" href="/">
    <img src="/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" class="nav-logo-img">
  </a>

  <div class="nav-items">
    <div class="nav-dd${wA}" id="dd-workout">
      <button class="nav-btn${wA}" onclick="toggleDD('dd-workout')">Train<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 8 10 12 6"/></svg></button>
      <div class="dd-panel dd-panel-wide">
        <div class="dd-cols">
          <div class="dd-col">
            <div class="dd-section-label">Get a Workout</div>
            <a href="/daily-wod.html" style="background:rgba(196,18,18,.06);border-radius:8px;"><div class="dl"><strong>The Daily 20</strong><small>Today's 20-min WOD — free &amp; ready</small></div></a>
            <a href="/wodbuilder.html"><div class="dl"><strong>Smart WOD Builder</strong><small>Customize to your goals</small></div></a>
            <div class="dd-div"></div>
            <a href="/timer.html"><div class="dl"><strong>WOD Timer</strong><small>AMRAP, EMOM, For Time &amp; more</small></div></a>
            <a href="/movements.html"><div class="dl"><strong>Movement Library</strong><small>200+ movements with demos</small></div></a>
          </div>
          <div class="dd-col dd-col-right">
            <div class="dd-section-label">Named Workouts</div>
            <a href="/workouts.html?cat=classic_benchmark"><div class="dl"><strong>Classic Benchmarks</strong><small>Fran, Grace, Helen &amp; more</small></div></a>
            <a href="/workouts.html?cat=hero"><div class="dl"><strong>Hero WODs</strong><small>Murph, DT, Manion &amp; more</small></div></a>
            <a href="/workouts.html?cat=competition"><div class="dl"><strong>Competition WODs</strong><small>Open, Games &amp; Qualifier</small></div></a>
            <a href="/workouts.html?cat=community"><div class="dl"><strong>Community WODs</strong><small>Partner &amp; community workouts</small></div></a>
          </div>
        </div>
        <div class="dd-div"></div>
        <a href="/workouts.html" class="dd-footer">Browse all workouts →</a>
      </div>
    </div>

    <div class="nav-dd${sA}" id="dd-stretch">
      <button class="nav-btn${sA}" onclick="toggleDD('dd-stretch')">Stretch<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 8 10 12 6"/></svg></button>
      <div class="dd-panel">
        <a href="/stretchbuilder.html"><div class="dl"><strong>Smart Stretch Builder</strong><small>Auto-build a recovery routine</small></div></a>
        <a href="/stretches.html"><div class="dl"><strong>Browse Stretches</strong><small>Full stretch movement library</small></div></a>
        <a href="/stretch-routines.html"><div class="dl"><strong>Stretch Routines</strong><small>Curated mobility programs</small></div></a>
      </div>
    </div>

    <div class="nav-dd${shA}" id="dd-shop">
      <button class="nav-btn${shA}" onclick="toggleDD('dd-shop')">Shop<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 8 10 12 6"/></svg></button>
      <div class="dd-panel">
        <a href="/shop.html#barbells"><div class="dl"><strong>Barbells &amp; Weights</strong></div></a>
        <a href="/shop.html#pullup"><div class="dl"><strong>Pull-up &amp; Gymnastics</strong></div></a>
        <a href="/shop.html#cardio"><div class="dl"><strong>Cardio &amp; Conditioning</strong></div></a>
        <a href="/shop.html#plyo"><div class="dl"><strong>Plyo &amp; Boxes</strong></div></a>
        <a href="/shop.html#accessories"><div class="dl"><strong>Accessories</strong></div></a>
        <div class="dd-div"></div>
        <a href="/shop.html" class="dd-footer">See All Gear →</a>
      </div>
    </div>

    <div class="nav-dd${bA}" id="dd-blog">
      <button class="nav-btn${bA}" onclick="toggleDD('dd-blog')">Blog<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 8 10 12 6"/></svg></button>
      <div class="dd-panel" style="min-width:300px">
        <a href="/blog/hero-wod-guide.html" class="dd-post"><span class="dd-post-tag">Training</span><span class="dd-post-title">The Complete Guide to Hero WODs — History, Strategy &amp; Top 10</span></a>
        <a href="/blog/best-home-gym-equipment.html" class="dd-post"><span class="dd-post-tag">Equipment</span><span class="dd-post-title">Best Home Gym Equipment for Functional Fitness (2026)</span></a>
        <a href="/blog/how-to-scale-wods.html" class="dd-post"><span class="dd-post-tag">Technique</span><span class="dd-post-title">How to Scale Any WOD Without Losing the Intent</span></a>
        <div class="dd-div"></div>
        <a href="/blog.html" class="dd-footer">All Posts →</a>
      </div>
    </div>
  </div>

  <button class="nav-hamburger" id="hamburger-btn" onclick="togHam()" aria-label="Open menu">
    <svg class="ham-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    <svg class="ham-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>

  <div class="nav-end">
    <a href="/search.html" class="nav-search-btn" title="Search">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </a>
    <!-- Guest state (hidden until auth check resolves) -->
    <div id="nav-guest" style="display:none;align-items:center;gap:8px;">
      <a href="/login.html" class="nav-btn" style="padding:8px 12px;">Log In</a>
      <a href="/signup.html" class="nav-cta" style="text-decoration:none;display:flex;align-items:center;">Sign Up Free</a>
    </div>
    <!-- Auth state (populated by Nav.updateAuth) -->
    <div id="nav-auth" style="display:none;align-items:center;gap:10px;">
      <div class="nav-dd" id="dd-avatar">
        <div class="nav-avatar" id="avatar-initials" onclick="toggleDD('dd-avatar')" title="Account">?</div>
        <div class="dd-panel dd-panel-right">
          <div class="avatar-dd-user">
            <div class="avatar-dd-initials" id="avatar-initials-dd">?</div>
            <div class="avatar-dd-info">
              <div class="avatar-dd-name" id="avatar-name-dd">Athlete</div>
              <div class="avatar-dd-handle" id="avatar-handle-dd">@athlete</div>
            </div>
          </div>
          <div class="dd-div"></div>
          <a href="/myworkouts.html">
            <div class="di"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            <div class="dl"><strong>My Workouts</strong><small>Training log &amp; history</small></div>
          </a>
          <a href="/profile.html">
            <div class="di"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div class="dl"><strong>My Profile</strong><small>Stats, PRs &amp; activity</small></div>
          </a>
          <a href="/settings.html">
            <div class="di"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
            <div class="dl"><strong>Settings</strong><small>Account &amp; notifications</small></div>
          </a>
          <div class="dd-div"></div>
          <a href="#" class="avatar-dd-logout" onclick="doSignOut(event)">
            <div class="di"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
            <div class="dl"><strong>Log Out</strong></div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
</nav>
<div class="ham-panel" id="ham-panel">
  <div class="ham-section">
    <div class="ham-section-title">Train</div>
    <div class="ham-links">
      <a href="/daily-wod.html" class="ham-link">The Daily 20</a>
      <a href="/wodbuilder.html" class="ham-link">Smart WOD Builder</a>
      <a href="/timer.html" class="ham-link">WOD Timer</a>
      <a href="/movements.html" class="ham-link">Movement Library</a>
      <a href="/workouts.html?cat=classic_benchmark" class="ham-link">Classic Benchmarks</a>
      <a href="/workouts.html?cat=hero" class="ham-link">Hero WODs</a>
      <a href="/workouts.html?cat=competition" class="ham-link">Competition WODs</a>
      <a href="/workouts.html?cat=community" class="ham-link">Community WODs</a>
      <a href="/workouts.html" class="ham-link">Browse All Workouts</a>
    </div>
  </div>
  <div class="ham-divider"></div>
  <div class="ham-section">
    <div class="ham-section-title">Stretch</div>
    <div class="ham-links">
      <a href="/stretchbuilder.html" class="ham-link">Smart Stretch Builder</a>
      <a href="/stretches.html" class="ham-link">Browse Stretches</a>
      <a href="/stretch-routines.html" class="ham-link">Stretch Routines</a>
    </div>
  </div>
  <div class="ham-divider"></div>
  <div class="ham-section">
    <div class="ham-section-title">Shop</div>
    <div class="ham-links">
      <a href="/shop.html" class="ham-link">All Gear</a>
    </div>
  </div>
  <div class="ham-divider"></div>
  <div class="ham-section">
    <div class="ham-section-title">Blog</div>
    <div class="ham-links">
      <a href="/blog.html" class="ham-link">All Posts</a>
    </div>
  </div>
  <div class="ham-divider"></div>
  <div class="ham-section">
    <div class="ham-links">
      <a href="/login.html" class="ham-link">Log In</a>
      <a href="/signup.html" class="ham-link" style="color:var(--or);font-weight:700;">Sign Up Free</a>
    </div>
  </div>
</div>

<div class="mobile-top-bar">
  <a href="/" class="nav-logo">
    <img src="/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" class="nav-logo-img" style="height:28px;">
  </a>
  <div style="display:flex;align-items:center;gap:4px;">
    <a href="/search.html" class="mob-top-btn" title="Search" aria-label="Search">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </a>
    <button class="mob-top-btn" id="mobile-hamburger-btn" onclick="togHam()" aria-label="Open menu">
      <svg class="ham-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      <svg class="ham-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="display:none;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
</div>

<nav class="mobile-tab-bar" role="navigation" aria-label="Mobile navigation">
  <div class="tab-items">

    <a href="/workouts.html" class="tab-item${wA}" aria-label="Train">
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
        <circle cx="12" cy="15.5" r="7"/>
        <path d="M9.2 11.5C8.8 8.2 9.6 3.5 12 3.5C14.4 3.5 15.2 8.2 14.8 11.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      Train
    </a>

    <a href="/movements.html" class="tab-item${mA}" aria-label="Movements">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="5" r="3"/>
        <path d="M6.5 8.5C4.5 10 3 12.5 3 15c0 2 1 3.5 3 4"/>
        <path d="M17.5 8.5C19.5 10 21 12.5 21 15c0 2-1 3.5-3 4"/>
        <path d="M9 21h6"/>
        <path d="M12 8v13"/>
      </svg>
      Movements
    </a>

    <a href="/stretches.html" class="tab-item${sA}" aria-label="Stretch">
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
        <circle cx="12" cy="3.5" r="2.5"/>
        <line x1="12" y1="6" x2="12" y2="16" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>
        <line x1="10" y1="9" x2="4" y2="4" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
        <line x1="14" y1="9" x2="20" y2="4" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
        <line x1="11" y1="16" x2="9" y2="22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <line x1="13" y1="16" x2="15" y2="22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </svg>
      Stretch
    </a>

    <a href="/profile.html" class="tab-item${pA}" aria-label="Profile">
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
        <circle cx="12" cy="7" r="4.5"/>
        <path d="M3 21c0-5 4-8.5 9-8.5S21 16 21 21H3z"/>
      </svg>
      Profile
    </a>

  </div>
</nav>

<a href="/contact.html" class="mob-feedback-btn" aria-label="Send feedback" title="Send feedback">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
</a>

<a href="/contact.html" class="desk-feedback-btn" aria-label="Send feedback">
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
  Feedback
</a>
`;
  },

  // Helper: swap a nav circle element to show a photo
  _applyAvatarImg(el, url) {
    if (!el || !url) return;
    el.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;" alt="">`;
    el.style.background = 'transparent';
    el.style.overflow   = 'hidden';
  },

  // Populate the injected nav with verified auth state
  updateAuth(currentUser, profileUsername, avatarUrl = null) {
    const $ = id => document.getElementById(id);

    if (!currentUser) {
      // Confirmed logged out — clear cache and show guest buttons
      localStorage.removeItem('hwrx_authed');
      localStorage.removeItem('hwrx_initial');
      localStorage.removeItem('hwrx_name');
      localStorage.removeItem('hwrx_handle');
      localStorage.removeItem('hwrx_avatar');
      if ($('nav-auth'))  $('nav-auth').style.display  = 'none';
      if ($('nav-guest')) {
        $('nav-guest').style.display = 'flex';
        // Point login link back to the current page so user returns after auth
        const loginLinks = $('nav-guest').querySelectorAll('a[href="/login.html"]');
        const dest = window.location.pathname + window.location.search + window.location.hash;
        if (dest !== '/' && dest !== '/index.html') {
          loginLinks.forEach(a => a.href = '/login.html?redirect=' + encodeURIComponent(dest));
        }
      }
      return;
    }

    // Logged in — build display values
    const displayName = profileUsername
      || currentUser.user_metadata?.full_name
      || currentUser.email?.split('@')[0]
      || 'Athlete';
    const initial = (displayName.charAt(0) || '?').toUpperCase();
    const handle  = '@' + (currentUser.email?.split('@')[0] || displayName.toLowerCase());

    // Update DOM — photo if available, otherwise initials
    if (avatarUrl) {
      this._applyAvatarImg($('avatar-initials'),    avatarUrl);
      this._applyAvatarImg($('avatar-initials-dd'), avatarUrl);
    } else {
      if ($('avatar-initials'))    $('avatar-initials').textContent    = initial;
      if ($('avatar-initials-dd')) $('avatar-initials-dd').textContent = initial;
    }
    if ($('avatar-name-dd'))     $('avatar-name-dd').textContent     = displayName;
    if ($('avatar-handle-dd'))   $('avatar-handle-dd').textContent   = handle;
    if ($('nav-guest'))          $('nav-guest').style.display        = 'none';
    if ($('nav-auth'))           $('nav-auth').style.display         = 'flex';

    // Cache for instant display on next page load
    localStorage.setItem('hwrx_authed',  '1');
    localStorage.setItem('hwrx_initial', initial);
    localStorage.setItem('hwrx_name',    displayName);
    localStorage.setItem('hwrx_handle',  handle);
    localStorage.setItem('hwrx_avatar',  avatarUrl || '');
  },

  getAvatarColor(userId) {
    const colors = ['#C41212', '#E03030', '#CC2222', '#A50F0F', '#D93A3A'];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  },

  attachEventListeners() {
    // Close any open dropdown or hamburger on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dd')) {
        document.querySelectorAll('.nav-dd.open').forEach(d => d.classList.remove('open'));
      }
      if (!e.target.closest('.nav-hamburger') && !e.target.closest('#mobile-hamburger-btn') && !e.target.closest('.ham-panel')) {
        document.getElementById('hamburger-btn')?.classList.remove('open');
        document.getElementById('ham-panel')?.classList.remove('open');
        const mobBtn = document.getElementById('mobile-hamburger-btn');
        if (mobBtn) {
          mobBtn.querySelector('.ham-icon-open').style.display  = 'block';
          mobBtn.querySelector('.ham-icon-close').style.display = 'none';
        }
      }
    });

    // Remove Sentry's default feedback widget from the DOM entirely on all devices.
    // Newer Sentry SDKs inject a <sentry-feedback> custom element, not div#sentry-feedback.
    const killSentry = () => {
      document.querySelectorAll('sentry-feedback, #sentry-feedback, [id*="sentry"][id*="feedback"]')
        .forEach(el => el.remove());
    };
    killSentry();
    // subtree:true catches insertion anywhere in the document, not just direct body children
    new MutationObserver(killSentry).observe(document.body, { childList: true, subtree: true });
    [300, 800, 2000, 4000].forEach(t => setTimeout(killSentry, t));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dd.open').forEach(d => d.classList.remove('open'));
        document.getElementById('hamburger-btn')?.classList.remove('open');
        document.getElementById('ham-panel')?.classList.remove('open');
        const mobBtn = document.getElementById('mobile-hamburger-btn');
        if (mobBtn) {
          mobBtn.querySelector('.ham-icon-open').style.display  = 'block';
          mobBtn.querySelector('.ham-icon-close').style.display = 'none';
        }
      }
    });
  }
};

// Auto-init nav on page load for any page with data-nav-init="true"
document.addEventListener('DOMContentLoaded', async () => {
  const shouldInit = document.body.getAttribute('data-nav-init') === 'true';
  if (shouldInit) {
    const activePage = document.body.getAttribute('data-active-page') || '';
    await Nav.init(activePage);

    // Init companion widget if user is logged in (checks companion_access internally)
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) await Companion.maybeInit(session);
      }
    } catch (e) { /* non-fatal — companion widget is enhancement only */ }
  }
});

// ============================================================================
// GLOBAL NAV FUNCTIONS (referenced by inline onclick handlers in render())
// ============================================================================

function toggleDD(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.nav-dd').forEach(d => d.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

function togHam() {
  const btn    = document.getElementById('hamburger-btn');
  const mobBtn = document.getElementById('mobile-hamburger-btn');
  const panel  = document.getElementById('ham-panel');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (btn)    btn.classList.toggle('open', !isOpen);
  if (mobBtn) {
    mobBtn.querySelector('.ham-icon-open').style.display  = isOpen ? 'block' : 'none';
    mobBtn.querySelector('.ham-icon-close').style.display = isOpen ? 'none'  : 'block';
  }
  panel.classList.toggle('open', !isOpen);
}

async function doSignOut(e) {
  e.preventDefault();
  localStorage.removeItem('hwrx_authed');
  localStorage.removeItem('hwrx_initial');
  localStorage.removeItem('hwrx_name');
  localStorage.removeItem('hwrx_handle');
  localStorage.removeItem('hwrx_companion');
  sessionStorage.removeItem('hwrx_companion_chat');
  try { await db.signOut(); } catch (err) {}
  location.href = '/';
}

// ============================================================================
// COMPANION CHAT WIDGET
// Injected sitewide via nav.js — only for users with companion_access = true.
// Conversation persists within the browser session (sessionStorage).
// ============================================================================

const Companion = {
  FUNCTION_URL: 'https://irtppmztpcakanhefljs.supabase.co/functions/v1/companion-chat',
  STORAGE_KEY:  'hwrx_companion_chat',
  DRAFT_KEY:    'hwrx_companion_draft',
  ACCESS_KEY:   'hwrx_companion',
  _session: null,
  _open: false,
  _pendingWorkout: null,

  // ── Entry point ────────────────────────────────────────────────────
  async maybeInit(session) {
    // Fast path: cached access flag
    let hasAccess = localStorage.getItem(this.ACCESS_KEY) === '1';

    if (!hasAccess) {
      try {
        const { data } = await supabaseClient
          .from('profiles')
          .select('companion_access')
          .eq('id', session.user.id)
          .single();
        hasAccess = data?.companion_access === true;
        if (hasAccess) localStorage.setItem(this.ACCESS_KEY, '1');
      } catch (e) { /* non-fatal */ }
    }

    if (!hasAccess) return;

    this._session = session;
    this._inject();
  },

  // ── Inject HTML ────────────────────────────────────────────────────
  _inject() {
    // Guard: bail if widget already in the DOM (prevents double-injection
    // when maybeInit is called more than once in the same page load)
    if (document.getElementById('companion-panel')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <button id="companion-toggle" onclick="Companion.toggle()" title="Training Companion" aria-label="Open training companion">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <div id="companion-panel" role="dialog" aria-label="Training Companion">
        <div class="companion-header">
          <div class="companion-header-left">
            <div class="companion-avatar">RX</div>
            <div>
              <div class="companion-title">Training Companion</div>
              <div class="companion-sub">HomeWodRX</div>
            </div>
          </div>
          <button class="companion-close" onclick="Companion.toggle()" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="companion-messages" id="companion-messages"></div>

        <div class="companion-input-row">
          <textarea
            id="companion-input"
            placeholder="Ask anything about your training…"
            rows="1"
            maxlength="500"
            onkeydown="Companion.onKey(event)"
            oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,96)+'px';Companion._saveDraft(this.value)"
          ></textarea>
          <button id="companion-send" onclick="Companion.send()" aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    `);

    // ── Global Log Activity modal (used by companion action button) ────
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-overlay" id="companion-log-modal">
        <div class="modal" style="max-width:480px">
          <button class="modal-close" onclick="Companion._closeLogModal()">✕</button>
          <div class="modal-title">Log an Activity</div>
          <p class="modal-sub">Running, biking, rowing, hiking — any cardio session worth remembering.</p>
          <div class="modal-field">
            <label>Activity Type</label>
            <select id="cla-type">
              <option value="run">Run</option>
              <option value="bike_road">Bike — Road Ride</option>
              <option value="bike_trail">Bike — Trail Ride</option>
              <option value="row">Row</option>
              <option value="swim">Swim</option>
              <option value="hike">Hike</option>
              <option value="ski">Ski Erg</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="modal-field">
            <label>Date</label>
            <input type="date" id="cla-date">
          </div>
          <div style="display:flex;gap:12px">
            <div class="modal-field" style="flex:1">
              <label>Distance (optional)</label>
              <input type="text" id="cla-distance" placeholder="e.g. 5 mi or 8 km">
            </div>
            <div class="modal-field" style="flex:1">
              <label>Duration (optional)</label>
              <input type="text" id="cla-duration" placeholder="e.g. 42:30">
            </div>
          </div>
          <div class="modal-field">
            <label>Notes (optional)</label>
            <textarea rows="2" id="cla-notes" placeholder="How did it feel? Splits, route, conditions…"></textarea>
          </div>
          <div class="modal-err" id="cla-err"></div>
          <div class="modal-foot">
            <button class="btn-modal-cancel" onclick="Companion._closeLogModal()">Cancel</button>
            <button class="btn-modal-save" id="cla-save-btn" onclick="Companion._saveLogActivity()">Save Activity</button>
          </div>
        </div>
      </div>
    `);
    // Close on backdrop click
    document.getElementById('companion-log-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('companion-log-modal')) this._closeLogModal();
    });

    this._restoreHistory();

    // Close panel on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('companion-log-modal')?.classList.contains('open')) {
          this._closeLogModal();
        } else if (this._open) {
          this.toggle();
        }
      }
    });
  },

  // ── Open / close ───────────────────────────────────────────────────
  toggle() {
    this._open = !this._open;
    document.getElementById('companion-panel')?.classList.toggle('open', this._open);
    document.getElementById('companion-toggle')?.classList.toggle('active', this._open);
    if (this._open) {
      // Show intro message if history is empty
      const msgs = document.getElementById('companion-messages');
      if (msgs && msgs.children.length === 0) {
        this._appendMsg('assistant', "What's on your training agenda?");
        this._saveHistory();
      }
      this._scrollToBottom();
      setTimeout(() => {
        this._restoreDraft();
        document.getElementById('companion-input')?.focus();
      }, 150);
    }
  },

  // ── Keyboard: Enter sends, Shift+Enter newline ─────────────────────
  onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  },

  // ── Send message ───────────────────────────────────────────────────
  async send() {
    const input = document.getElementById('companion-input');
    const sendBtn = document.getElementById('companion-send');
    const message = input?.value.trim();
    if (!message) return;

    input.value = '';
    input.style.height = 'auto';
    if (sendBtn) sendBtn.disabled = true;
    this._saveDraft('');

    this._appendMsg('user', message);
    this._saveHistory();

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'companion-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.id = 'companion-typing';
    document.getElementById('companion-messages')?.appendChild(typing);
    this._scrollToBottom();

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const res = await fetch(this.FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message, history: this._getHistoryForAPI() }),
      });

      const json = await res.json();
      document.getElementById('companion-typing')?.remove();

      if (!res.ok) {
        const msg = json.message || json.error || 'Something went wrong. Try again.';
        this._appendMsg('assistant', msg);
      } else {
        this._appendMsg('assistant', json.reply);
        if (json.action?.type === 'log_activity') {
          this._appendAction(json.action);
        } else if (json.action?.type === 'generate_workout' && json.action.workout) {
          this._pendingWorkout = json.action.workout;
          this._appendWorkoutCard(json.action.workout);
        }
      }
    } catch (err) {
      document.getElementById('companion-typing')?.remove();
      this._appendMsg('assistant', 'Connection error. Check your network and try again.');
    }

    this._saveHistory();
    this._scrollToBottom();
    if (sendBtn) sendBtn.disabled = false;
    input?.focus();
  },

  // ── DOM helpers ────────────────────────────────────────────────────
  _appendMsg(role, text) {
    const el = document.createElement('div');
    el.className = `companion-msg ${role}`;
    el.textContent = text;
    document.getElementById('companion-messages')?.appendChild(el);
  },

  _appendAction(action) {
    const activityType = action.activity_type || 'other';
    const btn = document.createElement('button');
    btn.className = 'companion-action-btn';
    btn.textContent = '+ Log Activity';
    btn.onclick = () => {
      this._openLogModal(activityType);
    };
    document.getElementById('companion-messages')?.appendChild(btn);
  },

  _appendWorkoutCard(workout) {
    // Replace any previous workout card (iteration)
    document.getElementById('companion-workout-card')?.remove();

    var h = function(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    var title     = workout.title || 'Custom Workout';
    var scheme    = workout.scheme || workout.format || '';
    var durMin    = workout.duration_estimate;
    var movements = Array.isArray(workout.movements) ? workout.movements : [];

    var movLines = movements.slice(0, 5).map(function(m) {
      return '<div class="cwc-mov"><span class="cwc-reps">' + h(m.reps) + '</span> ' + h(m.name) + '</div>';
    }).join('');
    if (movements.length > 5) {
      movLines += '<div class="cwc-more">+' + (movements.length - 5) + ' more</div>';
    }

    var metaParts = [scheme, durMin ? durMin + ' min' : ''].filter(Boolean);
    var metaStr   = metaParts.join(' · ');

    var card = document.createElement('div');
    card.id = 'companion-workout-card';
    card.className = 'companion-workout-card';
    card.innerHTML =
      '<div class="cwc-title">' + h(title) + '</div>' +
      (metaStr ? '<div class="cwc-meta">' + h(metaStr) + '</div>' : '') +
      '<div class="cwc-movements">' + movLines + '</div>' +
      '<button class="cwc-create-btn" onclick="Companion._openGeneratedWorkout()">Create Workout →</button>';

    document.getElementById('companion-messages')?.appendChild(card);
    this._scrollToBottom();
  },

  _openGeneratedWorkout() {
    if (!this._pendingWorkout) return;
    try {
      sessionStorage.setItem('hwrx_ai_workout', JSON.stringify(this._pendingWorkout));
    } catch(e) {}
    window.location.href = '/workout.html?source=ai';
  },

  // ── Log Activity modal (global — works on any page) ───────────────
  _openLogModal(activityType) {
    const modal = document.getElementById('companion-log-modal');
    if (!modal) return;
    // Reset fields
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('cla-date').value = today;
    document.getElementById('cla-distance').value = '';
    document.getElementById('cla-duration').value = '';
    document.getElementById('cla-notes').value = '';
    const errEl = document.getElementById('cla-err');
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    const saveBtn = document.getElementById('cla-save-btn');
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Activity'; }
    // Pre-fill activity type
    const typeEl = document.getElementById('cla-type');
    if (typeEl && activityType) typeEl.value = activityType;
    modal.classList.add('open');
  },

  _closeLogModal() {
    document.getElementById('companion-log-modal')?.classList.remove('open');
  },

  async _saveLogActivity() {
    const saveBtn = document.getElementById('cla-save-btn');
    const errEl   = document.getElementById('cla-err');
    const type    = document.getElementById('cla-type')?.value || 'other';
    const date    = document.getElementById('cla-date')?.value;
    const dist    = document.getElementById('cla-distance')?.value.trim() || '';
    const dur     = document.getElementById('cla-duration')?.value.trim() || '';
    const notes   = document.getElementById('cla-notes')?.value.trim() || '';

    if (!date) {
      if (errEl) { errEl.textContent = 'Please select a date.'; errEl.style.display = 'block'; }
      return;
    }

    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }
    if (errEl) errEl.style.display = 'none';

    try {
      const session = this._session;
      if (!session) throw new Error('Not logged in');
      const user = session.user;
      const username = (user.user_metadata?.full_name) || (user.email?.split('@')[0]) || 'athlete';

      const labelMap = { run:'Run', bike:'Bike', row:'Row', swim:'Swim', hike:'Hike', ski:'Ski Erg', other:'Activity' };
      const label = labelMap[type] || 'Activity';
      const parts = [dist, dur].filter(Boolean);
      const scoreDisplay = label + (parts.length ? ' — ' + parts.join(' / ') : '');

      const { error } = await supabaseClient.from('results').insert({
        user_id:        user.id,
        username:       username,
        date:           date,
        workout_type:   'cardio',
        activity_type:  type,
        score_display:  scoreDisplay,
        is_rx:          false,
        benchmark_slug: null,
        notes:          notes || null,
      });

      if (error) throw error;

      this._closeLogModal();
    } catch (err) {
      if (errEl) { errEl.textContent = 'Save failed: ' + (err.message || 'Unknown error'); errEl.style.display = 'block'; }
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Activity'; }
    }
  },

  _scrollToBottom() {
    const msgs = document.getElementById('companion-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  },

  // ── Session storage ────────────────────────────────────────────────
  _saveHistory() {
    const msgs = document.getElementById('companion-messages');
    if (!msgs) return;
    const history = Array.from(msgs.querySelectorAll('.companion-msg')).map(el => ({
      role: el.classList.contains('user') ? 'user' : 'assistant',
      text: el.textContent,
    }));
    try { sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
  },

  _restoreHistory() {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const history = JSON.parse(raw);
      // Clear first — prevents doubling if _restoreHistory is somehow called twice
      const msgs = document.getElementById('companion-messages');
      if (msgs) msgs.innerHTML = '';
      history.forEach(({ role, text }) => this._appendMsg(role, text));
    } catch (e) {}
  },

  // Returns the last 20 stored messages formatted for the Claude API.
  // Excludes the canned opener ("What's on your training agenda?") since it's
  // not a real AI response. Caps at 20 messages (10 exchanges) to keep token
  // usage reasonable. The current user message is NOT included — it's sent
  // separately as the final entry in the Edge Function's messages array.
  _getHistoryForAPI() {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const stored = JSON.parse(raw); // [{role, text}, ...]
      // Drop the canned opener if it's the first message
      const filtered = (stored[0]?.role === 'assistant' &&
        stored[0]?.text?.includes("What's on your training agenda"))
        ? stored.slice(1)
        : stored;
      // Drop the last entry — it's the user message we just appended before send()
      const withoutCurrent = filtered.slice(0, -1);
      // Cap at last 20 messages and map to API format
      return withoutCurrent.slice(-20).map(({ role, text }) => ({
        role,
        content: text,
      }));
    } catch (e) {
      return [];
    }
  },

  _saveDraft(text) {
    try { sessionStorage.setItem(this.DRAFT_KEY, text); } catch (e) {}
  },

  _restoreDraft() {
    try {
      const draft = sessionStorage.getItem(this.DRAFT_KEY);
      if (!draft) return;
      const input = document.getElementById('companion-input');
      if (!input) return;
      input.value = draft;
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 96) + 'px';
    } catch (e) {}
  },
};
