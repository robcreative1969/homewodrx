-- Let a signed-in athlete permanently delete their own account, October 4, 2026.
-- Deleting the auth user cascades to profiles, workouts, results, lift_prs,
-- planned_workouts and companion_usage (all ON DELETE CASCADE). The email list
-- has no link to accounts, so the athlete's address is removed from it here.
-- The profile photo is removed by the settings page before this is called.

create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  em text;
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  select email into em from auth.users where id = uid;
  if em is not null then
    delete from public.email_subscribers where lower(email) = lower(em);
  end if;
  delete from auth.users where id = uid;
end $$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- The settings page lists the athlete's own photo folder so it can remove the
-- files before the account goes. Same folder rule as the existing avatar policies.
drop policy if exists avatars_owner_select on storage.objects;
create policy avatars_owner_select on storage.objects
  for select to authenticated
  using ((bucket_id = 'avatars') and ((storage.foldername(name))[1] = (auth.uid())::text));
