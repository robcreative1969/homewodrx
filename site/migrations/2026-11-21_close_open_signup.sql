-- Email sign-ups now only go through the "subscribe" Edge Function, which checks the
-- Turnstile human check first (Rob's yes, 2026-11-21). Remove the open public insert
-- that let bots add addresses directly. The function writes with the service role.
begin;
drop policy if exists allow_public_insert on public.email_subscribers;
commit;
