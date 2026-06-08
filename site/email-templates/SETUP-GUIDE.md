# HomeWODrx Email Setup — 3 Steps

## Step 1 — Set up Resend (5 min)

1. Go to **[resend.com](https://resend.com)** and create a free account (3,000 emails/month free)
2. Click **Domains → Add Domain** → enter `homewodrx.com`
3. Resend gives you 2–3 DNS records to add. Go to **Vercel → your project → Domains → homewodrx.com → Manage DNS** and paste them in
4. Back in Resend, click **Verify** (can take a few minutes)
5. Go to **API Keys → Create API Key** → name it `homewodrx` → copy the key

---

## Step 2 — Get a Supabase Personal Access Token (1 min)

1. Go to **[supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)**
2. Click **Generate new token** → name it `homewodrx-email` → copy it

---

## Step 3 — Run the deploy script (1 min)

1. Open `deploy-emails.js` in a text editor
2. Paste your tokens into the two fields at the top of the CONFIG section:
   ```
   supabaseToken: 'paste-your-supabase-token-here',
   resendApiKey:  'paste-your-resend-api-key-here',
   ```
3. Open Terminal, navigate to this folder, and run:
   ```
   node deploy-emails.js
   ```
4. You should see ✅ confirmation that all 4 templates and SMTP were applied

---

## Done!

Test it by signing up with a new email at homewodrx.com — the confirmation email should arrive from `noreply@homewodrx.com` with full HomeWODrx branding.

**The 4 templates deployed:**
- ✉️ Confirm signup
- 🔑 Password reset
- ⚡ Magic link login
- 📧 Email address change
