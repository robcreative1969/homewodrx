# HomeWODRx rebuild plan

**Status: draft for Rob's review (October 4, 2026).** Nothing here changes the live site
until Rob approves the switch at the end.

Companion documents: [CONTENT-GUIDE.md](CONTENT-GUIDE.md) (wording),
[STYLE-GUIDE.md](STYLE-GUIDE.md) (look), [CLAUDE.md](CLAUDE.md) (how changes go live).

## 1. What we are building

A training library plus an advanced builder and planner:

- **Library** (free, brings in search traffic): workouts, movements, stretches and stretch
  routines, blog.
- **Daily** (free): The Daily 20 and The Daily 10, the WOD Timer and workout mode.
- **WOD Builder** (free): the basic builder.
- **Planner and advanced builder** (premium later): plans that mix workouts from every
  source; multi-week programs later.

Workout sources: CrossFit named workouts, builder-generated, DIY (private), shared by
athletes (public), AI-generated (if kept), and vetted coaches (later, only after traffic).

**Not building:** a leaderboard. Personal progress tracking replaces it.

## 2. Technology

| Part | Choice | Why |
|---|---|---|
| Site | Next.js (App Router) + TypeScript | Pages arrive fully built, so Google reads every workout; one shared layout instead of 30 copies |
| Styling | Tailwind CSS, with STYLE-GUIDE.md as the theme | Colors, fonts and spacing defined once |
| Data and accounts | **Keep** Rob's Supabase project | The database, accounts, security rules and edge functions all carry over |
| Hosting | **Keep** Rob's Vercel | Same push-to-publish workflow |

Same accounts as today; nothing moves to CBA's Vercel or Supabase.

## 3. How we keep the live site safe

- The new site is built in a new folder in the same GitHub repo (`web/`), while `site/`
  keeps serving homewodrx.com unchanged.
- A **second Vercel project** (for example `homewodrx-next`) builds `web/` to its own
  preview address. **Rob creates it** in his Vercel account (about five clicks; Claude walks
  through it), because it is an account setting.
- Every URL the site has today keeps working after the switch (or redirects), so search
  rankings carry over. A list of all 520 sitemap URLs is checked automatically before the
  switch.
- **The switch** is moving the homewodrx.com domain from the old Vercel project to the new
  one. **Undo** is moving it back, which takes a minute.

## 4. Data changes (Supabase)

Done as numbered migration files in the repo, shown to Rob before each runs, tested on the
preview first.

1. **One workouts model.** Today workouts live in three shapes (`benchmark_workouts`,
   `workouts`, copies inside `planned_workouts`). The rebuild uses one `workouts` table with
   a `source` (benchmark, builder, diy, shared, ai, coach), a visibility, and optional coach
   credit and video link. Movements inside a workout use one shape everywhere.
2. **The Planner points at workouts** instead of copying them, so a planned Fran is the real
   Fran, with its video, scaling and logging.
3. **Hard-coded data moves into the database** (warm-up and cool-down lists, weight
   defaults, leftover JavaScript copies of movements and stretches).
4. **Premium switch.** Who can use what is decided in one place on the server
   (an `entitlements` table written only by the server), with every feature open to everyone
   until Rob turns premium on. No payments until there is traffic.
5. **Moderation without approvals.** Shared workouts publish instantly; automatic checks,
   a Report button that hides a workout after reports, limits for brand-new accounts;
   "featured" stays Rob's choice; new shared workouts stay out of Google until they show
   real use.
6. **Content cleanup** from the content guide, done once in the data: one brand spelling,
   one name per category, contradicting figures removed, warm-ups matched to equipment.

The security fixes made on October 4 stay in force throughout.

## 5. Order of work

Each phase ends with a preview link for Rob to try. Phases 1 and 2 matter most for search
traffic, so they come first.

| Phase | What | Rob's part |
|---|---|---|
| 0. Foundation | `web/` folder, Next.js, style guide as the theme, shared header, footer and bottom bar, Supabase connection, automated checks | Create the second Vercel project |
| 1. Library | Workout pages (all 204), workouts list with filters, movement pages with demo videos, stretches and routines, blog, search, sitemap, Google video and workout data | Review a preview of a few pages |
| 2. Daily and training | Homepage, The Daily 20, The Daily 10, WOD Timer and workout mode | Try workout mode on a phone at the gym |
| 3. WOD Builder | One shared workout generator (today it is copied in three places), the builder screens, save and log | Confirm builder options (time choices) |
| 4. Accounts | Sign up, log in, profile, settings, My Workouts, logging results, delete account, the human check | Test sign-up with a throwaway account |
| 5. Planner | Weekly planner on the new workouts model, all sources, print and calendar export | Review |
| 6. Admin | Workout and movement editing, The Daily 20 overrides, athletes, broadcasts | Review |
| 7. Switch | URL check, final review, move the domain, watch for errors for a week | Approve the switch |

## 6. After the switch (only once traffic arrives)

Roughly in this order, each its own decision:

1. Personal progress tracking (benchmark retests, PRs, consistency).
2. Multi-week programs in the Planner.
3. Personal weights from logged maxes.
4. Premium on, with payments (Stripe).
5. The shared workout library for browsing.
6. AI coach that adjusts plans (if the AI source is kept).
7. Coach workouts and coach profiles.
8. Social media content (Higgsfield for visuals, real screen recordings of the builder).

## 7. Rob's decisions (October 4, 2026)

1. **WOD Builder time choices:** 10, 20, 30, 45 and 60 minutes.
2. **AI companion and AI-generated workouts:** kept in the rebuild, but hidden from the
   public until the premium offer launches (behind the premium switch; Rob and testers keep
   access).
3. **Dark theme:** site-wide. It follows the phone's light or dark setting, with a switch to
   override it. Built in from Phase 0 so every screen is designed and checked in both.
4. **Old pages:** drop the leaderboard (its URL redirects to the homepage). Also drop
   `generator.html` and `stretch.html`: they are the April versions of the builders, replaced
   by `/wodbuilder` and `/stretchbuilder`, and their URLs already redirect there.
