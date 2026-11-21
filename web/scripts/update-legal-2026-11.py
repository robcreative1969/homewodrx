"""Brings the legal pages in line with the new site (drafted 2026-11-21, for Rob's approval
before the switch): cookie-free visit counting instead of Google/Vercel Analytics and the
cookie banner, no Sentry, no leaderboard, no affiliate links, accounts paused.
Run from web/: python3 scripts/update-legal-2026-11.py (safe to re-run; it checks each change)."""
import html, json, re

UPDATED = "November 21, 2026"

def load(slug):
    with open(f"content/legal/{slug}.json") as f:
        return json.load(f)

def save(d):
    d["sections"] = [{"id": m.group(1), "title": html.unescape(re.sub(r"<[^>]+>", "", m.group(2)).strip())}
                     for m in re.finditer(r'<div class="legal-section" id="([^"]+)">\s*<h2>(.*?)</h2>', d["bodyHtml"], re.S)]
    d["updated"] = UPDATED
    with open(f"content/legal/{d['slug']}.json", "w") as f:
        f.write(json.dumps(d, indent=2, ensure_ascii=False) + "\n")

def section(html, sid, new_inner):
    pat = re.compile(rf'(<div class="legal-section" id="{sid}">)(.*?)(</div>\s*(?=<div class="legal-section"|$))', re.S)
    assert pat.search(html), f"section {sid} not found"
    return pat.sub(lambda m: m.group(1) + "\n" + new_inner + "\n" + m.group(3), html, count=1)

def drop(html, sid):
    pat = re.compile(rf'<div class="legal-section" id="{sid}">.*?</div>\s*(?=<div class="legal-section"|$)', re.S)
    assert pat.search(html), f"section {sid} not found"
    return pat.sub("", html, count=1)

COUNTING = ("<p>To understand how the site is used, we count visits without cookies. For each page view we record the page address, the site you came from, "
            "your device type (phone, tablet or computer) and your country. To count each visitor once per day, we create an anonymous code from your IP address "
            "and browser that changes every day; we don't store your IP address, and the daily codes are deleted after two days, so visits can't be linked "
            "to you or to each other over time. We also record the words typed into the site's search box, so we can see what content people are looking for.</p>")

# ── Privacy Policy ───────────────────────────────────────────────────────────
p = load("privacy")
h = p["bodyHtml"]
h = section(h, "collect", """      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, including:</p>
      <ul>
        <li>Email address — if you sign up for the Daily 20 email or new blog posts</li>
        <li>Messages — feedback or support requests you send via the Contact page, processed through our form provider, Web3Forms</li>
        <li>Account information and workout data — if you created an account on the previous version of the site, your email address, display name and logged results are still stored. New sign-ups are paused for now.</li>
      </ul>
      """ + COUNTING + """
      <p>When you sign up for email, Cloudflare Turnstile collects limited device and browser signals to confirm you're not a bot. Videos are embedded from YouTube in privacy-enhanced mode and only load, and contact YouTube, when you press play.</p>""")
h = section(h, "use", """      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve the site and its features</li>
        <li>Send the emails you signed up for</li>
        <li>Respond to your feedback and support requests</li>
        <li>Understand how the site is used so we can make it better</li>
        <li>Detect and prevent bot sign-ups and abuse</li>
      </ul>""")
h = section(h, "basis", """      <h2>Legal Basis for Processing</h2>
      <p>If you're located in the EEA, UK, or another jurisdiction with similar requirements, we process your personal data on the following legal bases under the GDPR:</p>
      <ul>
        <li><strong>Consent</strong> — sending the emails you signed up for. You can unsubscribe at any time from the link in every email.</li>
        <li><strong>Contract</strong> — keeping the account information and workout data of members who created an account.</li>
        <li><strong>Legitimate interests</strong> — cookie-free visit counting and bot protection (Cloudflare Turnstile), to understand and secure the site. We've limited the data collected to what's needed for those purposes.</li>
        <li><strong>Legal obligation</strong> — where we're required to disclose information to comply with the law.</li>
      </ul>""")
h = section(h, "sharing", """      <h2>Information Sharing</h2>
      <p>We do not sell, trade, or rent your personal information. We share information only with the service providers who help us run the site, each acting as a data processor under their own privacy policy and terms:</p>
      <ul>
        <li><strong>Supabase</strong> — database, email sign-ups and visit counts</li>
        <li><strong>Resend</strong> — sending email (the Daily 20, announcements, account emails)</li>
        <li><strong>Vercel</strong> — website hosting</li>
        <li><strong>Web3Forms</strong> — processes Contact page submissions and relays them to us by email</li>
        <li><strong>Cloudflare</strong> — Turnstile bot protection on email sign-up</li>
        <li><strong>YouTube</strong> — embedded videos, only after you press play</li>
      </ul>
      <p>We may also disclose information if required by law or to protect the rights and safety of our users.</p>""")
h = section(h, "retention", """      <h2>Data Retention</h2>
      <p>We keep your email address for as long as you stay subscribed. Unsubscribing stops the emails; to have your address deleted entirely, contact us.</p>
      <p>Members' account information and workout data are kept for as long as the account exists; contact us to have an account deleted. We keep records we're required to keep for legal, security, or fraud-prevention purposes only as long as necessary for those purposes.</p>
      <p>Contact form messages are retained as long as needed to respond to and resolve your inquiry. Visit counts are kept as totals; the daily visitor codes behind them are deleted after two days.</p>""")
h = section(h, "cookies", """      <h2>Cookies</h2>
      <p>The site doesn't use analytics or advertising cookies. The only cookie is an essential login cookie for the site's administrator. Your light or dark display choice is saved in your own browser and never sent to us. See our <a href="/cookies">Cookie Policy</a>.</p>""")
h = h.replace("To exercise any of these rights, contact us via the <a href=\"/contact\">Contact page</a> and we will respond within 30 days. You can also delete your account at any time from your Profile settings, or manage your cookie consent from the <a href=\"/cookies\">Cookie Policy</a> page.",
              "To exercise any of these rights, contact us via the <a href=\"/contact\">Contact page</a> and we will respond within 30 days. You can unsubscribe from emails at any time using the link in every email.")
h = h.replace("<li><strong>Withdraw consent</strong> at any time for anything we process based on consent (e.g. analytics cookies), without affecting the lawfulness of processing before withdrawal</li>",
              "<li><strong>Withdraw consent</strong> at any time for anything we process based on consent (e.g. emails you signed up for), without affecting the lawfulness of processing before withdrawal</li>")
assert "Profile settings" not in h and "Google Analytics" not in h and "Sentry" not in h and "leaderboard" not in h, "privacy: old wording left"
p["bodyHtml"] = h
save(p)

# ── Cookie Policy ────────────────────────────────────────────────────────────
c = load("cookies")
h = c["bodyHtml"]
h = section(h, [s["id"] for s in c["sections"]][1], """      <h2>Cookies We Use</h2>
      <p>HomeWODRx doesn't use analytics, advertising or tracking cookies, so there's no cookie banner.</p>
      <ul>
        <li><strong>Essential cookie</strong> — a login cookie for the site's administrator only. Visitors don't receive it.</li>
      </ul>
      <p>Two related things that aren't cookies: your light or dark display choice is saved in your own browser's storage and never sent to us, and we count visits without cookies (see the <a href="/privacy">Privacy Policy</a>). Embedded YouTube videos use YouTube's privacy-enhanced mode and only load when you press play; once playing, YouTube's own policies apply.</p>""")
h = section(h, [s["id"] for s in c["sections"]][2], """      <h2>Controlling Cookies</h2>
      <p>You can view and delete cookies at any time in your browser settings. Because the site sets no cookies for visitors, blocking cookies doesn't change how it works for you.</p>""")
assert "Google Analytics" not in h and "banner asks" not in h, "cookies: old wording left"
c["bodyHtml"] = h
save(c)

# ── Terms of Service ─────────────────────────────────────────────────────────
t = load("terms")
h = t["bodyHtml"]
h = drop(h, [s["id"] for s in t["sections"] if s["title"] == "Affiliate Links"][0])
h = h.replace("<li>You must be 13 years of age or older to create an account</li>", "<li>You must be 13 years of age or older to create an account or sign up for email</li>")
h = h.replace("When you log workout results or submit feedback, you grant us", "When you submit feedback or other content, you grant us")
h = h.replace("You may delete your account at any time from your Profile settings.", "You may ask us to delete your account at any time through the Contact page.")
assert "affiliate" not in h.lower() and "Profile settings" not in h, "terms: old wording left"
t["bodyHtml"] = h
save(t)

# ── Disclaimer ───────────────────────────────────────────────────────────────
d = load("disclaimer")
h = d["bodyHtml"]
aff = [s["id"] for s in d["sections"] if s["title"].startswith("Affiliate")][0]
h = section(h, aff, """      <h2>Product Recommendations</h2>
      <p>Product recommendations on the Gear page and in blog posts reflect our honest assessment, but we are not responsible for the quality, safety, or performance of any third-party products. Always read product instructions and use equipment safely. We don't currently earn commission on product links.</p>""")
assert "affiliate program" not in h.lower(), "disclaimer: old wording left"
d["bodyHtml"] = h
save(d)

print("updated:", ", ".join(x["slug"] for x in (p, c, t, d)))
