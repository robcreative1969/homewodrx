// ============================================================================
// SHARED FOOTER + FEEDBACK WIDGET
// ============================================================================
// Injects the site-wide footer and floating feedback button into every page.
// Add <script src="/js/footer.js"></script> near </body> on any page.

(function () {
  function injectFooter() {
    // Remove any existing <footer> elements first
    document.querySelectorAll('footer').forEach(function (el) { el.remove(); });

    var footer = document.createElement('footer');
    footer.style.cssText = 'border-top:1px solid var(--bd);padding:40px 20px;margin-top:40px';
    footer.innerHTML = `
      <div style="max-width:1080px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:32px">
        <div>
          <img src="/HomeWODRx-logo-white-red-black-strip-040626.png" alt="HomeWODrx" style="height:30px;width:auto;display:block;margin-bottom:12px">
          <p style="font-size:13px;color:var(--mu);line-height:1.7">The complete platform for home and garage gym athletes.</p>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Workouts</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <a href="/workouts" style="color:var(--tx);font-size:13px;text-decoration:none">Named Benchmarks</a>
            <a href="/generator" style="color:var(--tx);font-size:13px;text-decoration:none">WOD Generator</a>
            <a href="/daily-wod" style="color:var(--tx);font-size:13px;text-decoration:none">Daily WOD</a>
            <a href="/movements" style="color:var(--tx);font-size:13px;text-decoration:none">Movement Library</a>
            <a href="/shop" style="color:var(--tx);font-size:13px;text-decoration:none">Gear Shop</a>
          </div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Community</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <a href="/contact" style="color:var(--tx);font-size:13px;text-decoration:none">Contact &amp; Feedback</a>
          </div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Account</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <a href="/signup" style="color:var(--tx);font-size:13px;text-decoration:none">Sign Up Free</a>
            <a href="/login" style="color:var(--tx);font-size:13px;text-decoration:none">Log In</a>
            <a href="/admin" style="color:var(--mu);font-size:12px;text-decoration:none">Admin</a>
          </div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Legal</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <a href="/privacy" style="color:var(--tx);font-size:13px;text-decoration:none">Privacy Policy</a>
            <a href="/terms" style="color:var(--tx);font-size:13px;text-decoration:none">Terms of Service</a>
            <a href="/disclaimer" style="color:var(--tx);font-size:13px;text-decoration:none">Fitness Disclaimer</a>
            <a href="/cookies" style="color:var(--tx);font-size:13px;text-decoration:none">Cookie Notice</a>
          </div>
        </div>
      </div>
      <div style="max-width:1080px;margin:24px auto 0;padding-top:20px;border-top:1px solid var(--bd);text-align:center">
        <p style="font-size:11px;color:var(--mu);margin-bottom:8px">
          As an Amazon Associate, HomeWODrx earns from qualifying purchases.
          Product links on this site may earn us a small commission at no extra cost to you.
        </p>
        <p style="font-size:12px;color:var(--mu);margin:0">
          &copy; 2026 HomeWODrx &middot; Built for athletes, by athletes.
        </p>
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
        background: var(--bg, #0f0f0f); border: 1.5px solid var(--bd, #2a2a2a);
        border-radius: 16px; padding: 24px; width: 100%; max-width: 400px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.5); animation: fbSlideUp 0.2s ease;
      }
      @keyframes fbSlideUp {
        from { transform: translateY(24px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      #fb-modal h3 { font-size: 17px; font-weight: 800; margin: 0 0 4px; color: var(--tx, #f0f0f0); }
      #fb-modal .fb-sub { font-size: 13px; color: var(--mu, #888); margin-bottom: 16px; }
      .fb-types { display: flex; gap: 8px; margin-bottom: 14px; }
      .fb-type-chip {
        flex: 1; border: 1.5px solid var(--bd, #2a2a2a);
        background: var(--card, #1a1a1a); border-radius: 8px;
        padding: 8px 4px; cursor: pointer; text-align: center;
        font-size: 12px; font-weight: 700; color: var(--tx, #f0f0f0);
        transition: border-color 0.12s, background 0.12s; font-family: inherit;
      }
      .fb-type-chip:hover { border-color: var(--or, #C41212); }
      .fb-type-chip.fb-active {
        border-color: var(--or, #C41212);
        background: rgba(196,18,18,0.1);
      }
      .fb-type-chip .fb-chip-icon { font-size: 16px; display: block; margin-bottom: 3px; }
      #fb-textarea {
        width: 100%; box-sizing: border-box;
        background: var(--card, #1a1a1a); border: 1.5px solid var(--bd, #2a2a2a);
        border-radius: 10px; padding: 10px 12px;
        font-size: 13px; color: var(--tx, #f0f0f0); font-family: inherit;
        resize: none; outline: none; min-height: 90px;
        transition: border-color 0.15s; margin-bottom: 10px;
      }
      #fb-textarea:focus { border-color: var(--or, #C41212); }
      #fb-email-input {
        width: 100%; box-sizing: border-box;
        background: var(--card, #1a1a1a); border: 1.5px solid var(--bd, #2a2a2a);
        border-radius: 10px; padding: 9px 12px;
        font-size: 13px; color: var(--tx, #f0f0f0); font-family: inherit;
        outline: none; transition: border-color 0.15s; margin-bottom: 14px;
      }
      #fb-email-input:focus { border-color: var(--or, #C41212); }
      #fb-email-input::placeholder, #fb-textarea::placeholder { color: var(--mu, #666); }
      .fb-actions { display: flex; gap: 10px; align-items: center; }
      #fb-send-btn {
        flex: 1; background: var(--or, #C41212); color: #fff; border: none;
        border-radius: 9px; padding: 11px; font-size: 13px; font-weight: 800;
        cursor: pointer; font-family: inherit; transition: opacity 0.15s;
      }
      #fb-send-btn:hover { opacity: 0.88; }
      #fb-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      #fb-cancel-btn {
        background: none; border: 1.5px solid var(--bd, #2a2a2a);
        color: var(--mu, #888); border-radius: 9px; padding: 11px 16px;
        font-size: 13px; cursor: pointer; font-family: inherit;
      }
      #fb-cancel-btn:hover { border-color: var(--mu, #888); }
      #fb-err { display:none; font-size:12px; color:var(--or,#C41212); margin-bottom:10px; }
      #fb-success {
        display:none; text-align:center; padding: 8px 0;
      }
      #fb-success .fb-ok-icon { font-size:32px; margin-bottom:8px; }
      #fb-success p { font-size:14px; color:var(--tx,#f0f0f0); font-weight:700; margin:0 0 4px; }
      #fb-success small { font-size:12px; color:var(--mu,#888); }

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
        .fb-type-chip .fb-chip-icon { font-size: 13px; margin-bottom: 1px; }
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
            <span class="fb-chip-icon">💬</span>General
          </button>
          <button class="fb-type-chip" data-type="bug">
            <span class="fb-chip-icon">🐛</span>Bug
          </button>
          <button class="fb-type-chip" data-type="feature">
            <span class="fb-chip-icon">💡</span>Idea
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
          <div class="fb-ok-icon">🎉</div>
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
    document.addEventListener('DOMContentLoaded', injectFeedbackWidget);
  } else {
    injectFooter();
    injectFeedbackWidget();
  }
})();
