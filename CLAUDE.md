# HomeWODRx

Rob's fitness training site, homewodrx.com. Personal project, separate accounts from
Carl Bloom Associates: its own Vercel and its own Supabase project (`irtppmztpcakanhefljs`).
Do not use CBA's Vercel or Supabase for anything here.

## How changes go live

1. `git pull` before starting.
2. Edit files in `site/` (that folder is what Vercel publishes).
3. Commit, then `git push`.
4. Vercel publishes automatically from GitHub (`robcreative1969/homewodrx`):
   - a push to `main` goes **live** on homewodrx.com
   - a push to any other branch gets a **preview** link and leaves the live site alone

Work that is not ready goes on a branch, never on `main`. Commits are made as
robcreative1969 <rob@carlbloom.com> (set in this repo's git config).

## The rebuild (`web/`)

The new site is being built in `web/` (Next.js, TypeScript, Tailwind) while `site/` keeps
serving homewodrx.com. Read [REBUILD-PLAN.md](REBUILD-PLAN.md) first; follow
[STYLE-GUIDE.md](STYLE-GUIDE.md) and [CONTENT-GUIDE.md](CONTENT-GUIDE.md).

- `web/` deploys from its own Vercel project to a preview address and is marked
  noindex until `SITE_INDEXABLE=1` is set at the switch.
- Colors come only from the tokens in `web/src/app/globals.css` (light and dark). Check every
  screen in both themes.
- Before pushing: `npm run build`, `npx tsc --noEmit` and `npm run lint` in `web/`.
- Database changes are migration files in `site/migrations/` (later `web/supabase/`),
  shown to Rob before they run in his Supabase SQL editor.

## Security

Security is a priority every day. The fixes of October 4, 2026 are in
`site/migrations/2026-10-04_*.sql`: profiles are private (others read them through
`get_public_profile`), results and lifts follow each athlete's privacy setting, admin and
companion access and featuring are protected by triggers, and Supabase's CAPTCHA
(Turnstile) is on, so every sign-up, log-in and password reset must send a token
(`getCaptchaToken()` in `site/js/db.js`).

## Content rules

- The brand is spelled **HomeWODRx**, everywhere.
