// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================
// Inject shared nav bar into every page. Call Nav.init() on page load.

const Nav = {
  async init(activePage = '') {
    // Load Supabase first if not already loaded
    await this.ensureSupabase();

    const currentUser = await db.getUser();
    const navHtml = this.render(activePage, currentUser);

    // Inject nav at the top of the page
    const navElement = document.createElement('nav');
    navElement.innerHTML = navHtml;
    document.body.insertBefore(navElement, document.body.firstChild);

    // Attach event listeners
    this.attachEventListeners();
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

  render(activePage, currentUser) {
    const navLinks = [
      { text: 'Home', href: '/', page: 'home' },
      { text: 'Workouts', href: '/workouts.html', page: 'workouts' },
      { text: 'Generator', href: '/generator.html', page: 'generator' },
      { text: 'Leaderboard', href: '/leaderboard.html', page: 'leaderboard' }
    ];

    const additionalLinks = currentUser ? [
      { text: 'My WODs', href: '/myworkouts.html', page: 'myworkouts' },
      { text: 'Profile', href: `/profile.html?user=${currentUser.email?.split('@')[0] || 'me'}`, page: 'profile' }
    ] : [];

    const allLinks = [...navLinks, ...additionalLinks];

    const linksHtml = allLinks
      .map(link => {
        const isActive = activePage === link.page ? 'active' : '';
        return `<a href="${link.href}" class="nav-link ${isActive}">${link.text}</a>`;
      })
      .join('');

    const authHtml = currentUser
      ? `<div class="nav-auth-user">
           <span class="text-muted">${currentUser.email?.split('@')[0] || 'User'}</span>
           <div class="avatar" style="background-color: ${this.getAvatarColor(currentUser.id)}">${(currentUser.email?.charAt(0) || 'U').toUpperCase()}</div>
           <button class="btn btn-secondary btn-small" id="nav-logout">Logout</button>
         </div>`
      : `<div class="nav-auth">
           <a href="/login.html" class="btn btn-secondary btn-small">Login</a>
           <a href="/signup.html" class="btn btn-primary btn-small">Sign Up</a>
         </div>`;

    return `
      <div class="nav-container">
        <a href="/" class="nav-logo">
          <span>⚡</span> HomeWODrx
        </a>
        <div class="nav-links">
          ${linksHtml}
        </div>
        <div class="nav-auth">
          ${authHtml}
        </div>
      </div>
    `;
  },

  getAvatarColor(userId) {
    const colors = ['#E8530A', '#FF6B35', '#FF8C42', '#FFA500', '#FFB84D'];
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
