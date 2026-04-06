// ============================================================================
// SHARED FOOTER
// ============================================================================
// Injects the site-wide footer into every page.
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
            <a href="/myworkouts" style="color:var(--tx);font-size:13px;text-decoration:none">Log a Result</a>
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
