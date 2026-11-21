-- New admin (Rob's yes, 2026-11-21): admins can read the email subscriber list and edit stretches.
-- is_admin() is the existing check (profiles.is_admin for the signed-in user).

begin;

drop policy if exists email_subscribers_admin_read on public.email_subscribers;
create policy email_subscribers_admin_read on public.email_subscribers
  for select using (public.is_admin());

drop policy if exists stretches_admin_update on public.stretches;
create policy stretches_admin_update on public.stretches
  for update using (public.is_admin()) with check (public.is_admin());

commit;
