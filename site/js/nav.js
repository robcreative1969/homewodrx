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

    // Sync pre-check: if we know the user was logged in last visit, show
    // avatar placeholder instantly so there's no guest→avatar flash
    const cachedAuth = localStorage.getItem('hwrx_authed');
    const cachedInitial = localStorage.getItem('hwrx_initial') || '?';
    const cachedName    = localStorage.getItem('hwrx_name')    || 'Athlete';
    const cachedHandle  = localStorage.getItem('hwrx_handle')  || '@athlete';
    if (cachedAuth === '1') {
      const $ = id => document.getElementById(id);
      if ($('avatar-initials'))    $('avatar-initials').textContent    = cachedInitial;
      if ($('avatar-initials-dd')) $('avatar-initials-dd').textContent = cachedInitial;
      if ($('avatar-name-dd'))     $('avatar-name-dd').textContent     = cachedName;
      if ($('avatar-handle-dd'))   $('avatar-handle-dd').textContent   = cachedHandle;
      if ($('nav-auth'))           $('nav-auth').style.display         = 'flex';
    } else {
      // Show guest buttons right away — no session cached
      const guestEl = document.getElementById('nav-guest');
      if (guestEl) guestEl.style.display = 'flex';
    }

    // Async Supabase verify — corrects state if cache is stale
    await this.ensureSupabase();
    const currentUser = await db.getUser();
    if (currentUser) db.updateLastSeen();

    let profileUsername = null;
    if (currentUser) {
      try {
        const profile = await db.getProfile(currentUser.id);
        profileUsername = profile?.username || null;
      } catch (e) { /* fallback to email-based display name */ }
    }

    this.updateAuth(currentUser, profileUsername);
  },

  loadSearchScript() {
    // Guard against double-load during the CDN download window
    if (window.Search || document.querySelector('script[src="/js/search.js"]')) return;
    const script = document.createElement('script');
    script.src = '/js/search.js';
    document.head.appendChild(script);
  },

  async ensureSupabase() {
    if (CONFIG.isConfigured()) {
      let attempts = 0;
      while (!window.supabase && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(
          CONFIG.SUPABASE_URL,
          CONFIG.SUPABASE_ANON_KEY
        );
      }
    }
  },

  render(activePage) {
    const isWorkout = ['workouts','workout','movements','movement','generator','wodbuilder','timer','daily-wod'].includes(activePage);
    const isStretch = ['stretch','stretchbuilder','stretches','stretch-movement','stretch-routines','stretch-routine'].includes(activePage);
    const isShop    = activePage === 'shop';
    const isBlog    = activePage === 'blog';
    const isProfile = ['profile','myworkouts','settings'].includes(activePage);

    const wA  = isWorkout ? ' active' : '';
    const sA  = isStretch ? ' active' : '';
    const shA = isShop    ? ' active' : '';
    const bA  = isBlog    ? ' active' : '';
    const pA  = isProfile ? ' active' : '';

    return `<nav class="site-nav">
<div class="nav-inner">
  <a class="nav-logo" href="/">
    <img src="/HomeWODRx-logo-black-red-040626.png" alt="HomeWODrx" class="nav-logo-img">
  </a>

  <div class="nav-items">
    <div class="nav-dd${wA}" id="dd-workout">
      <button class="nav-btn${wA}" onclick="toggleDD('dd-workout')">Workout<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 8 10 12 6"/></svg></button>
      <div class="dd-panel dd-panel-wide">
        <div class="dd-cols">
          <div class="dd-col">
            <div class="dd-section-label">Browse by Category</div>
            <a href="/workouts.html?cat=girl"><div class="dl"><strong>The Girls</strong><small>Fran, Cindy, Annie &amp; classics</small></div></a>
            <a href="/workouts.html?cat=hero"><div class="dl"><strong>Hero WODs</strong><small>Murph, DT, Michael &amp; more</small></div></a>
            <a href="/workouts.html?cat=open"><div class="dl"><strong>Open WODs</strong><small>2011–2024 competition workouts</small></div></a>
            <a href="/workouts.html?cat=games"><div class="dl"><strong>Games WODs</strong><small>Elite-level competition</small></div></a>
            <a href="/workouts.html?cat=benchmark"><div class="dl"><strong>Benchmarks</strong><small>Track your progress over time</small></div></a>
            <a href="/workouts.html?cat=partner"><div class="dl"><strong>Partner WODs</strong><small>Team workouts for two</small></div></a>
          </div>
          <div class="dd-col dd-col-right">
            <div class="dd-section-label">Train</div>
            <a href="/daily-wod.html"><div class="dl"><strong>The Daily 20</strong><small>Today's free auto-generated WOD</small></div></a>
            <a href="/wodbuilder.html"><div class="dl"><strong>Smart WOD Builder</strong><small>Custom workout in seconds</small></div></a>
            <a href="/wodbuilder.html#create"><div class="dl"><strong>Create Your Own</strong><small>Build movement by movement</small></div></a>
            <div class="dd-div"></div>
            <a href="/timer.html"><div class="dl"><strong>WOD Timer</strong><small>AMRAP, EMOM, For Time &amp; more</small></div></a>
            <a href="/movements.html"><div class="dl"><strong>Movement Library</strong><small>200+ movements with demos</small></div></a>
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
    <div class="ham-section-title">Workout</div>
    <div class="ham-links">
      <a href="/workouts.html?cat=girl" class="ham-link">The Girls</a>
      <a href="/workouts.html?cat=hero" class="ham-link">Hero WODs</a>
      <a href="/workouts.html?cat=open" class="ham-link">Open WODs</a>
      <a href="/workouts.html?cat=games" class="ham-link">Games WODs</a>
      <a href="/workouts.html?cat=benchmark" class="ham-link">Benchmarks</a>
      <a href="/workouts.html?cat=partner" class="ham-link">Partner WODs</a>
      <a href="/daily-wod.html" class="ham-link">The Daily 20</a>
      <a href="/wodbuilder.html" class="ham-link">Smart WOD Builder</a>
      <a href="/wodbuilder.html#create" class="ham-link">Create Your Own</a>
      <a href="/timer.html" class="ham-link">WOD Timer</a>
      <a href="/movements.html" class="ham-link">Movement Library</a>
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

    <a href="/shop.html" class="tab-item${shA}" aria-label="Shop">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="9" width="14" height="13" rx="2" fill="currentColor"/>
        <path d="M9 9V6.5a3 3 0 0 1 6 0V9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt"/>
      </svg>
      Shop
    </a>

    <a href="/blog.html" class="tab-item${bA}" aria-label="Blog">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M18 3H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4l2 2 2-2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
        <line x1="8" y1="9" x2="16" y2="9" stroke="white" stroke-width="1.75" stroke-linecap="round"/>
        <line x1="8" y1="13" x2="13" y2="13" stroke="white" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
      Blog
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
`;
  },

  // Populate the injected nav with verified auth state
  updateAuth(currentUser, profileUsername) {
    const $ = id => document.getElementById(id);

    if (!currentUser) {
      // Confirmed logged out — clear cache and show guest buttons
      localStorage.removeItem('hwrx_authed');
      localStorage.removeItem('hwrx_initial');
      localStorage.removeItem('hwrx_name');
      localStorage.removeItem('hwrx_handle');
      if ($('nav-auth'))  $('nav-auth').style.display  = 'none';
      if ($('nav-guest')) $('nav-guest').style.display = 'flex';
      return;
    }

    // Logged in — build display values
    const displayName = profileUsername
      || currentUser.user_metadata?.full_name
      || currentUser.email?.split('@')[0]
      || 'Athlete';
    const initial = (displayName.charAt(0) || '?').toUpperCase();
    const handle  = '@' + (currentUser.email?.split('@')[0] || displayName.toLowerCase());

    // Update DOM
    if ($('avatar-initials'))    $('avatar-initials').textContent    = initial;
    if ($('avatar-initials-dd')) $('avatar-initials-dd').textContent = initial;
    if ($('avatar-name-dd'))     $('avatar-name-dd').textContent     = displayName;
    if ($('avatar-handle-dd'))   $('avatar-handle-dd').textContent   = handle;
    if ($('nav-guest'))          $('nav-guest').style.display        = 'none';
    if ($('nav-auth'))           $('nav-auth').style.display         = 'flex';

    // Cache for instant display on next page load
    localStorage.setItem('hwrx_authed',  '1');
    localStorage.setItem('hwrx_initial', initial);
    localStorage.setItem('hwrx_name',    displayName);
    localStorage.setItem('hwrx_handle',  handle);
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
  try { await db.signOut(); } catch (err) {}
  location.href = '/';
}
