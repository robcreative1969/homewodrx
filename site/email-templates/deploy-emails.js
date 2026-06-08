#!/usr/bin/env node
/**
 * HomeWODrx — Email Template + SMTP Deployer
 * ============================================
 * Pushes all 4 branded email templates AND configures Resend SMTP
 * to your Supabase project in one shot.
 *
 * USAGE:
 *   1. Fill in your credentials in the CONFIG section below
 *   2. Run:  node deploy-emails.js
 *
 * REQUIREMENTS:
 *   - Node.js 18+ (uses built-in fetch)
 *   - A Supabase Personal Access Token (not the service role key)
 *     → Get one at: https://supabase.com/dashboard/account/tokens
 *   - A Resend API key (after setting up Resend with your domain)
 *     → Get one at: https://resend.com/api-keys
 */

const fs = require('fs');
const path = require('path');

// ============================================================
//  CONFIG — Fill these in before running
// ============================================================
const CONFIG = {
  // Supabase Personal Access Token
  // → https://supabase.com/dashboard/account/tokens
  supabaseToken: 'sbp_v0_ea086a3e5ff7d5f6229dac4e9652922e3883d43f',

  // Your Resend API key
  // → https://resend.com/api-keys
  resendApiKey: 're_H1gzhPDL_C5HNBWdyp42jL1rdBHft1HGG',

  // Sender details
  senderEmail: 'noreply@homewodrx.com',
  senderName: 'HomeWODrx',
};
// ============================================================

const PROJECT_REF = 'irtppmztpcakanhefljs';
const API_BASE = 'https://api.supabase.com/v1';
const TEMPLATES_DIR = path.dirname(__filename);

function readTemplate(filename) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, filename), 'utf8');
}

async function deploy() {
  // Validate config
  if (CONFIG.supabaseToken === 'YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN') {
    console.error('❌  Please set your Supabase Personal Access Token in the CONFIG section.');
    process.exit(1);
  }
  if (CONFIG.resendApiKey === 'YOUR_RESEND_API_KEY') {
    console.error('❌  Please set your Resend API key in the CONFIG section.');
    process.exit(1);
  }

  console.log('🚀  HomeWODrx Email Deployer\n');

  // Read all templates
  console.log('📂  Reading templates...');
  const templates = {
    confirmSignup: readTemplate('confirm-signup.html'),
    passwordReset: readTemplate('password-reset.html'),
    magicLink:     readTemplate('magic-link.html'),
    emailChange:   readTemplate('email-change.html'),
  };
  console.log('    ✓ confirm-signup.html');
  console.log('    ✓ password-reset.html');
  console.log('    ✓ magic-link.html');
  console.log('    ✓ email-change.html\n');

  // Build the auth config payload
  const authConfig = {
    // SMTP settings (Resend)
    smtp_admin_email:  CONFIG.senderEmail,
    smtp_host:         'smtp.resend.com',
    smtp_port:         '465',
    smtp_user:         'resend',
    smtp_pass:         CONFIG.resendApiKey,
    smtp_sender_name:  CONFIG.senderName,

    // Email subjects
    mailer_subjects_confirmation: 'Confirm your HomeWODrx account',
    mailer_subjects_recovery:     'Reset your HomeWODrx password',
    mailer_subjects_magic_link:   'Your HomeWODrx login link',
    mailer_subjects_email_change: 'Confirm your new email — HomeWODrx',

    // Email templates
    mailer_templates_confirmation_content: templates.confirmSignup,
    mailer_templates_recovery_content:     templates.passwordReset,
    mailer_templates_magic_link_content:   templates.magicLink,
    mailer_templates_email_change_content: templates.emailChange,
  };

  // Push to Supabase
  console.log('📡  Pushing config to Supabase...');
  const response = await fetch(
    `${API_BASE}/projects/${PROJECT_REF}/config/auth`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CONFIG.supabaseToken}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(authConfig),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error(`\n❌  Supabase API error (${response.status}):\n${body}`);
    console.error('\nCommon issues:');
    console.error('  • Wrong token type — use a Personal Access Token, not service role key');
    console.error('  • Token may have expired — generate a new one at supabase.com/dashboard/account/tokens');
    process.exit(1);
  }

  const result = await response.json();

  console.log('\n✅  All done! Here\'s what was configured:\n');
  console.log('  SMTP');
  console.log(`    Host:   smtp.resend.com:465`);
  console.log(`    From:   ${CONFIG.senderName} <${CONFIG.senderEmail}>`);
  console.log('');
  console.log('  Email Templates');
  console.log('    ✓ Confirm signup   → "Confirm your HomeWODrx account"');
  console.log('    ✓ Password reset   → "Reset your HomeWODrx password"');
  console.log('    ✓ Magic link       → "Your HomeWODrx login link"');
  console.log('    ✓ Email change     → "Confirm your new email — HomeWODrx"');
  console.log('');
  console.log('🎉  Your signup emails now come from noreply@homewodrx.com with full branding.');
  console.log('    Test it by triggering a signup at https://homewodrx.com');
}

deploy().catch(err => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
