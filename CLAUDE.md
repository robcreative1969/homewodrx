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

## Content rules

- The brand is spelled **HomeWODRx**, everywhere.
