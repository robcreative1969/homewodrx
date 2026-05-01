// ============================================================================
// SHARED FOOTER + FEEDBACK WIDGET
// ============================================================================
// Injects the site-wide footer and floating feedback button into every page.
// Add <script src="/js/footer.js"></script> near </body> on any page.
// Login, signup, and other auth-only pages should NOT include this script.

(function () {
  function injectFooter() {
    // Remove any existing <footer> elements first
    document.querySelectorAll('footer').forEach(function (el) { el.remove(); });

    var footer = document.createElement('footer');
    footer.innerHTML = `
      <style>
        .hwrx-footer {
          background: #111;
          color: #ccc;
          padding: 48px 24px 28px;
          margin-top: 56px;
          font-family: inherit;
        }
        .hwrx-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.3fr repeat(4, 1fr);
          gap: 32px;
          margin-bottom: 40px;
        }
        @media (max-width: 900px) { .hwrx-footer-inner { grid-template-columns: 1fr 1fr 1fr; } }
        @media (max-width: 600px) { .hwrx-footer-inner { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 400px) { .hwrx-footer-inner { grid-template-columns: 1fr; } }
        .hwrx-footer-logo {
          display: block;
          height: 34px;
          width: auto;
          margin-bottom: 12px;
        }
        .hwrx-footer-brand p {
          font-size: .82rem;
          line-height: 1.65;
          color: #888;
          max-width: 220px;
          margin: 0;
        }
        .hwrx-footer-col h4 {
          font-size: .78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #fff;
          margin: 0 0 14px;
        }
        .hwrx-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .hwrx-footer-col li a {
          font-size: .82rem;
          color: #888;
          text-decoration: none;
          transition: color .15s;
        }
        .hwrx-footer-col li a:hover { color: var(--or, #C41212); }
        .hwrx-footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          border-top: 1px solid #222;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hwrx-footer-bottom p {
          font-size: .75rem;
          color: #555;
          margin: 0;
        }
        .hwrx-footer-bottom a {
          color: #555;
          text-decoration: none;
          transition: color .15s;
        }
        .hwrx-footer-bottom a:hover { color: var(--or, #C41212); }
        .hwrx-footer-disclosure {
          max-width: 1200px;
          margin: 0 auto 16px;
          font-size: .72rem;
          color: #444;
          line-height: 1.5;
        }
      </style>

      <div class="hwrx-footer">
        <div class="hwrx-footer-inner">

          <!-- Brand -->
          <div class="hwrx-footer-brand">
            <img src="/HomeWODRx-logo-white-red-black-strip-040626.png" alt="HomeWODrx" class="hwrx-footer-logo">
            <p>The training platform for functional fitness athletes — at the box, the health club, or at home.</p>
          </div>

          <!-- Workouts -->
          <div class="hwrx-footer-col">
            <h4>Workouts</h4>
            <ul>
              <li><a href="/workouts.html">The Girls</a></li>
              <li><a href="/workouts.html">Hero WODs</a></li>
              <li><a href="/workouts.html">Open WODs</a></li>
              <li><a href="/workouts.html">Games WODs</a></li>
              <li><a href="/workouts.html">Partner WODs</a></li>
            </ul>
          </div>

          <!-- Train -->
          <div class="hwrx-footer-col">
            <h4>Train</h4>
            <ul>
              <li><a href="/daily-wod.html">The Daily 20</a></li>
              <li><a href="/wodbuilder.html">Smart WOD Builder</a></li>
              <li><a href="/timer.html">WOD Timer</a></li>
              <li><a href="/movements.html">Movement Library</a></li>
            </ul>
          </div>

          <!-- Stretch & Mobility -->
          <div class="hwrx-footer-col">
            <h4>Stretch &amp; Mobility</h4>
            <ul>
              <li><a href="/stretchbuilder.html">The Daily 10</a></li>
              <li><a href="/stretchbuilder.html">Smart Stretch Builder</a></li>
              <li><a href="/stretch-routines.html">Hip &amp; Lower Body</a></li>
              <li><a href="/stretch-routines.html">Shoulders &amp; Thoracic</a></li>
              <li><a href="/stretch-routines.html">Recovery Routines</a></li>
            </ul>
          </div>

          <!-- More -->
          <div class="hwrx-footer-col">
            <h4>More</h4>
            <ul>
              <li><a href="/blog.html">Blog &amp; Articles</a></li>
              <li><a href="/shop.html">Gear Shop</a></li>
              <li><a href="/profile.html">My Profile</a></li>
              <li><a href="/contact.html">Contact</a></li>
              <li><a href="/privacy.html">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <!-- Amazon disclosure -->
        <div class="hwrx-footer-disclosure">
          As an Amazon Associate, HomeWODrx earns from qualifying purchases. Product links on this site may earn us a small commission at no extra cost to you.
        </div>

        <!-- Bottom strip -->
        <div class="hwrx-footer-bottom">
          <p>&copy; 2026 HomeWODrx &middot; Built for athletes, by athletes.</p>
          <p>
            <a href="/privacy.html">Privacy</a> &middot;
            <a href="/terms.html">Terms</a> &middot;
            <a href="/cookies.html">Cookies</a>
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(footer);
  }

  // ============================================================================
  // FLOATING FEEDBACK WIDGET
  // ============================================================================
  function injectFeedbackWidget() {
    // Don't inject on the contact page itself
    if (window.location.pathname === '/contact' || window.location.pathname === '/contact.html') return;

    var WEB3FORMS_KEY = '0c5922a1-0b41-4297-b766-ebdba008bf15'; // Web3Forms — notifies robcreative@gmail.com

    var style = document.createElement('style');
    style.textContent = `
      #fb-fab {
        position: fixed; bottom: 24px; right: 24px; z-index: 9998;
        background: var(--or, #C41212); color: #fff;
        border: none; border-radius: 50px; padding: 12px 18px;
        font-size: 13px; font-weight: 800; cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        display: flex; align-items: center; gap: 7px;
        transition: transform 0.15s, opacity 0.15s;
        font-family: inherit;
      }
      #fb-fab:hover { transform: translateY(-2px); opacity: 0.92; }
      #fb-overlay {
        display: none; position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.55); align-items: flex-end; justify-content: center;
        padding-bottom: 88px; padding-left: 16px; padding-right: 16px;
      }
      #fb-overlay.open { display: flex; }
      #fb-modal {
        background: var(--white, #fff); border: 1.5px solid var(--border, #e5e5e5);
        border-radius: 16px; padding: 24px; width: 100%; max-width: 400px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.5); animation: fbSlideUp 0.2s ease;
      }
      @keyframes fbSlideUp {
        from { transform: translateY(24px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      #fb-modal h3 { font-size: 17px; font-weight: 800; margin: 0 0 4px; color: var(--text, #1a1a1a); }
      #fb-modal .fb-sub { font-size: 13px; color: var(--muted, #666); margin-bottom: 16px; }
      .fb-types { display: flex; gap: 8px; margin-bottom: 14px; }
      .fb-type-chip {
        flex: 1; border: 1.5px solid var(--border, #e5e5e5);
        background: var(--bg, #f3f3f3); border-radius: 8px;
        padding: 8px 4px; cursor: pointer; text-align: center;
        font-size: 12px; font-weight: 700; color: var(--text, #1a1a1a);
        transition: border-color 0.12s, background 0.12s; font-family: inherit;
      }
      .fb-type-chip:hover { border-color: var(--or, #C41212); }
      .fb-type-chip.fb-active {
        border-color: var(--or, #C41212);
        background: rgba(196,18,18,0.1);
      }
      .fb-type-chip .fb-chip-icon { display: flex; justify-content: center; margin-bottom: 3px; }
      .fb-type-chip .fb-chip-icon svg { width: 16px; height: 16px; stroke: currentColor; }
      #fb-textarea {
        width: 100%; box-sizing: border-box;
        background: var(--bg, #f3f3f3); border: 1.5px solid var(--border, #e5e5e5);
        border-radius: 10px; padding: 10px 12px;
        font-size: 13px; color: var(--text, #1a1a1a); font-family: inherit;
        resize: none; outline: none; min-height: 90px;
        transition: border-color 0.15s; margin-bottom: 10px;
      }
      #fb-textarea:focus { border-color: var(--or, #C41212); }
      #fb-email-input {
        width: 100%; box-sizing: border-box;
        background: var(--bg, #f3f3f3); border: 1.5px solid var(--border, #e5e5e5);
        border-radius: 10px; padding: 9px 12px;
        font-size: 13px; color: var(--text, #1a1a1a); font-family: inherit;
        outline: none; transition: border-color 0.15s; margin-bottom: 14px;
      }
      #fb-email-input:focus { border-color: var(--or, #C41212); }
      #fb-email-input::placeholder, #fb-textarea::placeholder { color: var(--muted, #666); }
      .fb-actions { display: flex; gap: 10px; align-items: center; }
      #fb-send-btn {
        flex: 1; background: var(--or, #C41212); color: #fff; border: none;
        border-radius: 9px; padding: 11px; font-size: 13px; font-weight: 800;
        cursor: pointer; font-family: inherit; transition: opacity 0.15s;
      }
      #fb-send-btn:hover { opacity: 0.88; }
      #fb-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      #fb-cancel-btn {
        background: none; border: 1.5px solid var(--border, #e5e5e5);
        color: var(--muted, #666); border-radius: 9px; padding: 11px 16px;
        font-size: 13px; cursor: pointer; font-family: inherit;
      }
      #fb-cancel-btn:hover { border-color: var(--muted, #666); }
      #fb-err { display:none; font-size:12px; color:var(--or,#C41212); margin-bottom:10px; }
      #fb-success {
        display:none; text-align:center; padding: 8px 0;
      }
      #fb-success .fb-ok-icon { margin-bottom:8px; display:flex; justify-content:center; }
      #fb-success .fb-ok-icon svg { width:36px; height:36px; stroke:#16a34a; }
      #fb-success p { font-size:14px; color:var(--text,#1a1a1a); font-weight:700; margin:0 0 4px; }
      #fb-success small { font-size:12px; color:var(--muted,#666); }

      @media (orientation: landscape) and (max-height: 500px) {
        #fb-overlay {
          align-items: center;
          padding-bottom: 0;
          padding-top: 8px;
          padding-left: 16px;
          padding-right: 16px;
        }
        #fb-modal {
          padding: 14px 16px;
          max-height: 92vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        #fb-modal h3 { font-size: 14px; margin-bottom: 2px; }
        #fb-modal .fb-sub { font-size: 11px; margin-bottom: 8px; }
        .fb-types { gap: 6px; margin-bottom: 8px; }
        .fb-type-chip { padding: 5px 4px; font-size: 11px; }
        .fb-type-chip .fb-chip-icon svg { width: 13px; height: 13px; }
        #fb-textarea { min-height: 52px; padding: 7px 10px; margin-bottom: 6px; font-size: 12px; }
        #fb-email-input { padding: 6px 10px; margin-bottom: 8px; font-size: 12px; }
        #fb-send-btn { padding: 8px; font-size: 12px; }
        #fb-cancel-btn { padding: 8px 12px; font-size: 12px; }
      }
    `;
    document.head.appendChild(style);

    // FAB button
    var fab = document.createElement('button');
    fab.id = 'fb-fab';
    fab.setAttribute('aria-label', 'Send feedback');
    fab.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Feedback';
    document.body.appendChild(fab);

    // Overlay + modal
    var overlay = document.createElement('div');
    overlay.id = 'fb-overlay';
    overlay.innerHTML = `
      <div id="fb-modal" role="dialog" aria-modal="true" aria-label="Send feedback">
        <h3>Send Feedback</h3>
        <p class="fb-sub">Spotted a bug? Got an idea? We read everything.</p>

        <div class="fb-types">
          <button class="fb-type-chip fb-active" data-type="general">
            <span class="fb-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>General
          </button>
          <button class="fb-type-chip" data-type="bug">
            <span class="fb-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 4-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17 17c2.3.1 4 1.9 4 4"/></svg></span>Bug
          </button>
          <button class="fb-type-chip" data-type="feature">
            <span class="fb-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span>Idea
          </button>
        </div>

        <textarea id="fb-textarea" placeholder="Describe the bug, idea, or question…"></textarea>
        <input id="fb-email-input" type="text" placeholder="Your email (optional — for follow-up)" autocomplete="email">

        <div id="fb-err"></div>

        <div class="fb-actions">
          <button id="fb-cancel-btn">Cancel</button>
          <button id="fb-send-btn">Send</button>
        </div>

        <div id="fb-success">
          <div class="fb-ok-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>
          <p>Thanks — message received!</p>
          <small>Your feedback helps make HomeWODrx better.</small>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // State
    var currentType = 'general';

    // Type chips
    overlay.querySelectorAll('.fb-type-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        overlay.querySelectorAll('.fb-type-chip').forEach(function(c) { c.classList.remove('fb-active'); });
        chip.classList.add('fb-active');
        currentType = chip.dataset.type;
      });
    });

    function openWidget() {
      overlay.classList.add('open');
      document.getElementById('fb-textarea').focus();
    }
    function closeWidget() {
      overlay.classList.remove('open');
      // Reset form
      document.getElementById('fb-textarea').value = '';
      document.getElementById('fb-email-input').value = '';
      document.getElementById('fb-err').style.display = 'none';
      document.getElementById('fb-success').style.display = 'none';
      document.querySelector('.fb-types').style.display = '';
      document.getElementById('fb-textarea').style.display = '';
      document.getElementById('fb-email-input').style.display = '';
      document.getElementById('fb-err').style.display = 'none';
      document.querySelector('.fb-actions').style.display = '';
      overlay.querySelectorAll('.fb-type-chip').forEach(function(c) { c.classList.remove('fb-active'); });
      overlay.querySelector('[data-type="general"]').classList.add('fb-active');
      currentType = 'general';
    }

    fab.addEventListener('click', openWidget);
    document.getElementById('fb-cancel-btn').addEventListener('click', closeWidget);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeWidget();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeWidget();
    });

    document.getElementById('fb-send-btn').addEventListener('click', async function() {
      var message = document.getElementById('fb-textarea').value.trim();
      var email   = document.getElementById('fb-email-input').value.trim();
      var errEl   = document.getElementById('fb-err');
      var sendBtn = document.getElementById('fb-send-btn');

      errEl.style.display = 'none';

      if (!message) {
        errEl.textContent = 'Please enter a message.';
        errEl.style.display = 'block';
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';

      var payload = {
        type: currentType,
        message: message,
        email: email || null,
        page_url: window.location.href
      };

      var ok = false;

      // Save to Supabase
      try {
        if (window.supabaseClient) {
          var result = await window.supabaseClient.from('feedback').insert(payload);
          if (!result.error) ok = true;
        } else if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
          var sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
          var result2 = await sbClient.from('feedback').insert(payload);
          if (!result2.error) ok = true;
        }
      } catch (err) {
        console.warn('Supabase feedback insert:', err);
      }

      // Also send via Web3Forms for email notification
      try {
        var w3fPayload = {
          access_key: WEB3FORMS_KEY,
          subject: '[HomeWODrx] New ' + currentType + ' submission',
          from_name: 'HomeWODrx Feedback',
          type: currentType,
          message: message,
          page_url: window.location.href
        };
        if (email) w3fPayload.replyto = email;
        var res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(w3fPayload)
        });
        if (res.ok) ok = true;
      } catch (err) {
        console.warn('Web3Forms submit:', err);
      }

      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';

      if (ok) {
        document.querySelector('.fb-types').style.display = 'none';
        document.getElementById('fb-textarea').style.display = 'none';
        document.getElementById('fb-email-input').style.display = 'none';
        document.querySelector('.fb-actions').style.display = 'none';
        document.getElementById('fb-success').style.display = 'block';
        // Auto-close after 2.5s
        setTimeout(closeWidget, 2500);
      } else {
        errEl.textContent = 'Something went wrong — please try again.';
        errEl.style.display = 'block';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
