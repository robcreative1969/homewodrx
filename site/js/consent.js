// ============================================================================
// COOKIE CONSENT — gates Google Analytics + Vercel Analytics behind opt-in
// ============================================================================
// GDPR/ePrivacy requires non-essential tracking to stay off until a visitor
// affirmatively opts in — not just offer an opt-out afterward. This script
// replaces the old always-on gtag.js + Vercel Analytics <script> tags that
// used to sit directly in every page's <head>.
//
// - First visit: nothing loads. A banner asks Accept / Reject.
// - Accept -> choice saved, GA4 + Vercel Analytics load immediately.
// - Reject -> choice saved, nothing loads, banner doesn't return.
// - Essential cookies (Supabase login session) are NOT gated by this file —
//   they're required for the site to function and are out of scope here.
//
// Loaded via <script src="/js/consent.js"></script> in <head> on every page.
// To let a visitor change their mind later, call CookieConsent.openPreferences()
// (wired to a "Manage Cookie Preferences" button on /cookies.html).
// ============================================================================

(function () {
  var GA_MEASUREMENT_ID = 'G-HZM475VDN3';
  var CONSENT_KEY = 'hwrx_consent'; // 'granted' | 'denied'

  function getStored() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setStored(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* ignore */ }
  }

  function loadAnalytics() {
    if (window.__hwrxAnalyticsLoaded) return;
    window.__hwrxAnalyticsLoaded = true;

    // Google Analytics (GA4)
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(ga);

    // Vercel Analytics
    var va = document.createElement('script');
    va.defer = true;
    va.src = '/_vercel/insights/script.js';
    document.head.appendChild(va);
  }

  function injectStyles() {
    if (document.getElementById('cookie-banner-styles')) return;
    var style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent =
      '#cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;' +
      'max-width:560px;margin:0 auto;background:#fff;border:1.5px solid #e5e5e5;' +
      'border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.13);padding:18px 20px;' +
      'opacity:0;transform:translateY(12px);transition:opacity .25s ease,transform .25s ease;' +
      'font-family:"Barlow",system-ui,sans-serif;}' +
      '#cookie-banner.visible{opacity:1;transform:translateY(0);}' +
      '.cookie-banner-inner{display:flex;flex-direction:column;gap:14px;}' +
      '.cookie-banner-text{font-size:.85rem;color:#666;line-height:1.6;margin:0;}' +
      '.cookie-banner-text a{color:#C41212;text-decoration:underline;}' +
      '.cookie-banner-actions{display:flex;gap:10px;justify-content:flex-end;}' +
      '.cookie-btn{padding:9px 20px;border-radius:10px;font-size:.85rem;font-weight:700;' +
      'cursor:pointer;font-family:"Barlow",system-ui,sans-serif;border:1.5px solid #d0d0d0;' +
      'transition:background .15s,transform .1s,color .15s,border-color .15s;}' +
      '.cookie-btn-reject{background:#fff;color:#666;}' +
      '.cookie-btn-reject:hover{border-color:#C41212;color:#C41212;}' +
      '.cookie-btn-accept{background:#C41212;color:#fff;border-color:#C41212;}' +
      '.cookie-btn-accept:hover{background:#a00e0e;transform:translateY(-1px);}' +
      '@media (max-width:480px){#cookie-banner{left:10px;right:10px;bottom:10px;padding:16px;}' +
      '.cookie-banner-actions{justify-content:stretch;}.cookie-btn{flex:1;}}';
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    injectStyles();
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie preferences');
    el.innerHTML =
      '<div class="cookie-banner-inner">' +
      '<p class="cookie-banner-text">We use essential cookies to run the site, and — with your permission — analytics cookies to help us improve it. See our <a href="/cookies.html">Cookie Policy</a>.</p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" class="cookie-btn cookie-btn-reject" id="cookie-reject">Reject</button>' +
      '<button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>' +
      '</div></div>';
    document.body.appendChild(el);
    document.getElementById('cookie-accept').addEventListener('click', function () { accept(); });
    document.getElementById('cookie-reject').addEventListener('click', function () { reject(); });
    window.requestAnimationFrame(function () { el.classList.add('visible'); });
  }

  function hideBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) el.parentNode.removeChild(el);
  }

  function accept() {
    setStored('granted');
    hideBanner();
    loadAnalytics();
  }

  function reject() {
    setStored('denied');
    hideBanner();
  }

  function init() {
    var choice = getStored();
    if (choice === 'granted') {
      loadAnalytics();
    } else if (choice !== 'denied') {
      showBanner();
    }
    // choice === 'denied' -> do nothing, stay opted out
  }

  // Public API — used by the "Manage Cookie Preferences" button on /cookies.html
  window.CookieConsent = {
    accept: accept,
    reject: reject,
    openPreferences: showBanner,
    getChoice: getStored
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
