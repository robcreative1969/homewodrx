-- ============================================================================
-- Daily WOD Digest — database setup (APPLIED 2026-06-07 via Supabase MCP)
-- Kept here for repo reference. Do not re-run blindly.
-- ============================================================================

-- 1. Recipients function (service-role only — anon/authenticated revoked)
create or replace function public.get_digest_recipients()
returns table(user_id uuid, email text, first_name text)
language sql
security definer
set search_path = public
as $$
  select p.id, u.email::text, p.first_name
  from public.profiles p
  join auth.users u on u.id = p.id
  where coalesce(p.notifications->>'daily', 'false') = 'true'
    and u.email is not null
    and u.deleted_at is null;
$$;

revoke execute on function public.get_digest_recipients() from public;
revoke execute on function public.get_digest_recipients() from anon;
revoke execute on function public.get_digest_recipients() from authenticated;

-- 2. Schedule: every day at 10:00 UTC (6:00 AM ET during DST)
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'daily-wod-digest',
  '0 10 * * *',
  $$
  select net.http_post(
    url     := 'https://irtppmztpcakanhefljs.supabase.co/functions/v1/daily-wod-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', '<DIGEST_CRON_SECRET — value in Supabase Edge Function secrets>'
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- To unschedule: select cron.unschedule('daily-wod-digest');
-- To change time: unschedule, then re-run cron.schedule with a new cron expression.
