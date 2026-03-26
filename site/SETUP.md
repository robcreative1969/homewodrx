# HomeWODrx — Setup Guide

**Zero code required.** Follow these steps in order and your site will be live in under 30 minutes.

---

## What You'll Set Up

1. **Supabase** — your free database and user auth system
2. **Config file** — paste your Supabase credentials in one place
3. **Netlify** — drag-and-drop to publish your site for free
4. **DNS** — point homewodrx.com to Netlify

---

## Step 1: Create Your Supabase Account

1. Go to **https://supabase.com** and click **Start your project**
2. Sign in with GitHub (free) or create an account with email
3. Click **New project**
4. Fill in:
   - **Name**: HomeWODrx (or anything you like)
   - **Database Password**: choose a strong password — save it somewhere safe
   - **Region**: pick the closest to you (e.g. US East)
5. Click **Create new project** — takes about 2 minutes to spin up

---

## Step 2: Run the Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `schema.sql` from this folder
4. Copy the entire contents and paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: *"Success. No rows returned."* for each statement

This creates all the tables, security policies, and default configuration.

---

## Step 3: Get Your API Keys

1. In Supabase, go to **Settings** (gear icon) → **API**
2. You'll see two things you need:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — a long string starting with `eyJhbGciO...`
3. Copy both of these — you'll need them in Step 4

---

## Step 4: Update the Config File

1. Open the file `js/config.js` in this folder (use TextEdit, Notepad, or any text editor)
2. Find these three lines at the top:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const ADMIN_PASSWORD = 'choose_a_strong_password';
```

3. Replace the values:
   - `YOUR_SUPABASE_URL` → your Project URL from Step 3
   - `YOUR_SUPABASE_ANON_KEY` → your anon public key from Step 3
   - `choose_a_strong_password` → a password you'll use to access `/admin.html`

4. Example of what it should look like after:
```javascript
const SUPABASE_URL = 'https://abcdefgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const ADMIN_PASSWORD = 'MySecureAdminPass2026!';
```

5. Save the file

---

## Step 5: Deploy to Netlify

1. Go to **https://netlify.com** and create a free account (sign in with GitHub or email)
2. From your Netlify dashboard, click **Add new site** → **Deploy manually**
3. You'll see a big drag-and-drop box that says "Drag and drop your site output folder here"
4. **Select the entire site folder** (the folder containing `index.html`, `js/`, `css/`, etc.) and drag it onto that box
5. Netlify will deploy your site in about 30 seconds
6. You'll get a random URL like `https://random-name-123.netlify.app` — your site is live!

> **Tip:** To update the site later, just drag-and-drop the folder again. Netlify replaces the old version.

---

## Step 6: Add a Custom Domain (homewodrx.com)

1. In Netlify, go to **Site settings** → **Domain management** → **Add a domain**
2. Type `homewodrx.com` and click **Verify**
3. Netlify will show you DNS records to add — you'll need two:
   - An **A record** pointing to Netlify's IP (e.g. `75.2.60.5`)
   - A **CNAME record** for `www` pointing to your Netlify subdomain

4. Go to wherever you registered your domain (GoDaddy, Namecheap, Cloudflare, etc.)
5. Find the **DNS settings** or **DNS management** section
6. Add the records Netlify told you to add
7. DNS changes take 15 minutes to 48 hours to propagate — usually under an hour

> **Note:** Netlify provides free SSL (https://) automatically once DNS is set up.

---

## Step 7: Set Your First Featured WOD

1. Go to `https://homewodrx.com/admin.html`
2. Enter the admin password you set in Step 4
3. Click the **Featured WOD** tab
4. Select today's date and choose a named benchmark (e.g. "Cindy")
5. Click **Set Featured WOD**

That's it — the homepage will now show your featured workout.

---

## Step 8: Configure the Daily WOD (Optional)

The Daily WOD generates automatically — you don't need to do anything. But if you want to customize it:

1. Go to `/admin.html` → **WOD Config** tab
2. You can change:
   - **Equipment**: what gear the daily WOD assumes athletes have
   - **Difficulty by day**: e.g. easy on Sundays, hard on Fridays
   - **Body focus by day**: e.g. legs on Tuesday, upper body on Wednesday
   - **Format by day**: AMRAP, EMOM, For Time, or Circuit
   - **Duration range**: min and max minutes per day
3. Click **Save Config**

Future Daily WODs will use your settings. Past dates keep their original auto-generated workouts (deterministic).

---

## Your Site Structure

```
homewodrx.com/              → Homepage (index.html)
homewodrx.com/workouts.html → Browse all workouts
homewodrx.com/workouts/fran → Named benchmark pages (clean URL via redirect)
homewodrx.com/generator.html → AI workout generator + community
homewodrx.com/leaderboard.html → Global leaderboard
homewodrx.com/profile.html  → Athlete profiles
homewodrx.com/u/username    → Public profile URL (clean URL via redirect)
homewodrx.com/admin.html    → Admin panel (password protected)
```

---

## Managing Your Site (No Developer Needed)

### Adding results / testing
Sign up for an account on your own site and start logging workouts. Your first users can sign up at `/generator.html`.

### Managing database content
1. Go to **https://supabase.com** → your project
2. Click **Table Editor** in the sidebar
3. You can view, edit, and delete data like a spreadsheet:
   - `profiles` — user accounts
   - `workouts` — user-created workouts
   - `results` — all logged workout results
   - `featured` — scheduled featured WODs
   - `daily_wods` — manual WOD overrides
   - `daily_wod_config` — daily WOD settings

### Changing featured workouts
Use `/admin.html` → **Featured WOD** tab. No database access needed.

### Overriding the Daily WOD
Use `/admin.html` → **Daily WOD** tab → **Manual Override**.

---

## Troubleshooting

**Site shows "demo mode" or data isn't saving:**
- Check that `js/config.js` has your real Supabase URL and key (not `YOUR_SUPABASE_URL`)
- Make sure you ran the full `schema.sql` in Supabase's SQL editor

**Sign up or login not working:**
- In Supabase, go to **Authentication** → **Providers** and make sure **Email** is enabled
- Check **Authentication** → **Settings** — if "Confirm email" is on, users need to verify their email before logging in. You can disable this for testing.

**Clean URLs (/workouts/fran) not working:**
- Make sure `netlify.toml` is included in the folder you uploaded to Netlify
- The file must be at the root of your upload (same level as `index.html`)

**Admin panel password not working:**
- Double-check `js/config.js` — the `ADMIN_PASSWORD` value must match exactly (case-sensitive)

**Domain not resolving:**
- DNS changes can take up to 48 hours. Use https://dnschecker.org to check propagation.

---

## Optional: Email Authentication Settings

By default Supabase requires email confirmation. To allow instant sign-in during testing:

1. Supabase → **Authentication** → **Settings**
2. Toggle off **Enable email confirmations**
3. Users can now sign in immediately after registering

Re-enable email confirmations before launch for better security.

---

## Cost Summary

| Service | Cost |
|---------|------|
| Supabase | Free (up to 500MB storage, 50,000 monthly active users) |
| Netlify | Free (100GB bandwidth/month, unlimited deploys) |
| Domain (homewodrx.com) | ~$12/year (already owned) |
| SSL Certificate | Free (via Netlify) |
| **Total** | **~$12/year** |

---

*Questions? The admin panel at `/admin.html` has everything you need for day-to-day management. For database issues, Supabase's Table Editor at supabase.com is your spreadsheet-style control panel.*
