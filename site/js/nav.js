// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================
// Inject shared nav bar into every page. Call Nav.init() on page load.

const Nav = {
  async init(activePage = '') {
    // Load Supabase first if not already loaded
    await this.ensureSupabase();

    const currentUser = await db.getUser();
    // Track last activity for online status
    if (currentUser) db.updateLastSeen();

    // Fetch actual username from profile (falls back to email prefix)
    let profileUsername = null;
    if (currentUser) {
      try {
        const profile = await db.getProfile(currentUser.id);
        profileUsername = profile?.username || null;
      } catch (e) { /* fallback to email-based username */ }
    }

    const navHtml = this.render(activePage, currentUser, profileUsername);

    // Inject nav at the top of the page
    const navElement = document.createElement('nav');
    navElement.innerHTML = navHtml;
    document.body.insertBefore(navElement, document.body.firstChild);

    // Attach event listeners
    this.attachEventListeners();

    // Load search module in background (non-blocking)
    this.loadSearchScript();
  },

  loadSearchScript() {
    // Guard against both: (a) already fully loaded, (b) script tag injected but
    // not yet executed — the window.Search check alone misses the download window,
    // which causes a second <script> tag to be appended and search.js to run twice,
    // triggering "Identifier 'Search' has already been declared".
    if (window.Search || document.querySelector('script[src="/js/search.js"]')) return;
    const script = document.createElement('script');
    script.src = '/js/search.js';
    // search.js self-inits on load; no callback needed
    document.head.appendChild(script);
  },

  async ensureSupabase() {
    // Wait for Supabase to load via CDN if config is set
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

  render(activePage, currentUser, profileUsername) {
    const navLinks = [
      { text: 'Workouts', href: '/workouts.html', page: 'workouts' },
      { text: 'Movements', href: '/movements.html', page: 'movements' },
      { text: 'Smart WOD Builder', href: '/generator.html', page: 'generator' },
      { text: 'Stretch', href: '/stretch.html', page: 'stretch' },
      { text: 'Shop', href: '/shop.html', page: 'shop' },
      { text: 'Blog', href: '/blog.html', page: 'blog' }
    ];

    // Profile lives in the dropdown — not a flat nav link
    const linksHtml = navLinks
      .map(link => {
        const isActive = activePage === link.page ? 'active' : '';
        return `<a href="${link.href}" class="nav-link ${isActive}">${link.text}</a>`;
      })
      .join('');

    const displayName = profileUsername || currentUser?.email?.split('@')[0] || 'User';
    const initial = (displayName.charAt(0) || 'U').toUpperCase();
    const avatarColor = currentUser ? this.getAvatarColor(currentUser.id) : '#C41212';

    const authHtml = currentUser
      ? `<div class="nav-user-dropdown" id="nav-user-dropdown">
           <button class="nav-user-btn" id="nav-user-btn" aria-haspopup="true" aria-expanded="false">
             <div class="avatar" style="background-color:${avatarColor}">${initial}</div>
             <span class="nav-username">${displayName}</span>
             <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
               <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
           </button>
           <div class="nav-dropdown-menu" id="nav-dropdown-menu" role="menu">
             <a href="/profile.html?user=${encodeURIComponent(displayName)}" class="nav-dropdown-item" role="menuitem">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
               Profile
             </a>
             <a href="/myworkouts.html" class="nav-dropdown-item" role="menuitem">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
               My Workouts
             </a>
             <div class="nav-dropdown-divider"></div>
             <button class="nav-dropdown-item danger" id="nav-logout" role="menuitem">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
               Sign Out
             </button>
           </div>
         </div>`
      : `<a href="/login.html" class="btn btn-secondary btn-small">Login</a>
         <a href="/signup.html" class="btn btn-primary btn-small">Sign Up</a>`;

    return `
      <div class="nav-container">
        <a href="/" class="nav-logo">
          <img src="/HomeWODRx-logo-white-red-black-strip-040626.png" alt="HomeWODrx" class="nav-logo-img">
        </a>
        <div class="nav-links">
          ${linksHtml}
        </div>
        <button id="nav-search-btn" aria-label="Search (/ or Ctrl+K)" title="Search (/ or Ctrl+K)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <div class="nav-auth">
          ${authHtml}
        </div>
      </div>
    `;
  },

  getAvatarColor(userId) {
    const colors = ['#C41212', '#E03030', '#CC2222', '#A50F0F', '#D93A3A'];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  },

  attachEventListeners() {
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await db.signOut();
        window.location.href = '/';
      });
    }

    // Username dropdown toggle
    const userBtn = document.getElementById('nav-user-btn');
    const dropdownMenu = document.getElementById('nav-dropdown-menu');
    if (userBtn && dropdownMenu) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains('open');
        dropdownMenu.classList.toggle('open', !isOpen);
        userBtn.classList.toggle('open', !isOpen);
        userBtn.setAttribute('aria-expanded', String(!isOpen));
      });
      // Close on outside click
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('open');
        userBtn.classList.remove('open');
        userBtn.setAttribute('aria-expanded', 'false');
      });
      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdownMenu.classList.contains('open')) {
          dropdownMenu.classList.remove('open');
          userBtn.classList.remove('open');
          userBtn.setAttribute('aria-expanded', 'false');
          userBtn.focus();
        }
      });
    }

    const searchBtn = document.getElementById('nav-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        // Search.open() is available once search.js finishes loading.
        // If clicked immediately on a slow connection, wait briefly.
        if (window.Search) {
          window.Search.open();
        } else {
          // Script still loading — open once ready
          const wait = setInterval(() => {
            if (window.Search) { clearInterval(wait); window.Search.open(); }
          }, 50);
        }
      });
    }
  }
};

// Auto-init nav on page load if script is included
document.addEventListener('DOMContentLoaded', async () => {
  // Only init if there's a nav-init attribute on body or script
  const shouldInit = document.body.getAttribute('data-nav-init') === 'true';
  if (shouldInit) {
    const activePage = document.body.getAttribute('data-active-page') || '';
    await Nav.init(activePage);
  }
});
