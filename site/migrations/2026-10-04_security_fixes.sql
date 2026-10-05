-- Security fixes, October 4, 2026
-- Run in three parts, in order. Part 2 must wait until the site code that uses
-- get_public_profile and username_exists is live, or public profile pages break.

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 1: additive (nothing existing changes behaviour)
-- ═══════════════════════════════════════════════════════════════════════════

-- Public profile: only the fields the public profile page shows, honouring
-- the owner's privacy setting. Birthday is reduced to an age.
create or replace function public.get_public_profile(p_username text)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  p public.profiles%rowtype;
  vis text;
begin
  select * into p from public.profiles where username = p_username;
  if not found then return null; end if;

  vis := coalesce(p.privacy_visibility, 'public');
  if p.id = auth.uid() then vis := 'public'; end if;

  if vis = 'private' or (vis = 'members' and auth.uid() is null) then
    return jsonb_build_object('id', p.id, 'username', p.username, 'privacy_visibility', vis);
  end if;

  return jsonb_build_object(
    'id', p.id, 'username', p.username,
    'first_name', p.first_name, 'last_name', p.last_name,
    'bio', p.bio, 'avatar_url', p.avatar_url, 'avatar_color', p.avatar_color,
    'city', p.city, 'country', p.country, 'gender', p.gender,
    'age_years', case when p.birthday is null then null
                      else date_part('year', age(p.birthday))::int end,
    'height_cm', p.height_cm, 'weight_kg', p.weight_kg, 'preferred_units', p.preferred_units,
    'experience_level', p.experience_level, 'primary_goal', p.primary_goal,
    'training_frequency', p.training_frequency, 'fitness_journey', p.fitness_journey,
    'goat', p.goat, 'favorite_wod', p.favorite_wod,
    'total_results', p.total_results, 'created_at', p.created_at,
    'privacy_visibility', vis,
    'privacy_history', coalesce(p.privacy_history, 'everyone')
  );
end $$;

-- "Forgot username" lookup on the login page: yes or no, nothing else.
create or replace function public.username_exists(p_username text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where lower(username) = lower(p_username));
$$;

-- Whether another person may see this athlete's results and lifts.
create or replace function public.profile_history_visible(p_user uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_user = auth.uid() or exists (
    select 1 from public.profiles p
    where p.id = p_user
      and coalesce(p.privacy_history, 'everyone') = 'everyone'
      and (coalesce(p.privacy_visibility, 'public') = 'public'
           or (p.privacy_visibility = 'members' and auth.uid() is not null))
  );
$$;

grant execute on function public.get_public_profile(text) to anon, authenticated;
grant execute on function public.username_exists(text) to anon, authenticated;
grant execute on function public.profile_history_visible(uuid) to anon, authenticated;

-- Website visitors cannot give themselves admin or AI companion access.
-- Runs as the caller so the dashboard, SQL editor and server functions are not blocked.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if current_user not in ('anon', 'authenticated') or public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.is_admin := false;
    new.companion_access := false;
  elsif new.is_admin is distinct from old.is_admin
     or new.companion_access is distinct from old.companion_access then
    raise exception 'Only admins can change admin or companion access';
  end if;
  return new;
end $$;

drop trigger if exists protect_profile_privileges_trigger on public.profiles;
create trigger protect_profile_privileges_trigger
  before insert or update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- Athletes cannot feature or approve their own shared workouts.
create or replace function public.protect_workout_curation()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if current_user not in ('anon', 'authenticated') or public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.is_featured := false;
    new.featured_type := null;
    new.is_approved := false;
  elsif new.is_featured is distinct from old.is_featured
     or new.featured_type is distinct from old.featured_type
     or new.is_approved is distinct from old.is_approved then
    raise exception 'Only admins can feature or approve workouts';
  end if;
  return new;
end $$;

drop trigger if exists protect_workout_curation_trigger on public.workouts;
create trigger protect_workout_curation_trigger
  before insert or update on public.workouts
  for each row execute function public.protect_workout_curation();

-- The Daily 10 cache can only be written by admins (visitors still read it;
-- the routine is generated the same way for everyone without the cache).
drop policy if exists service_insert_daily_stretches on public.daily_stretches;
drop policy if exists service_update_daily_stretches on public.daily_stretches;
create policy admin_insert_daily_stretches on public.daily_stretches
  for insert with check (public.is_admin());
create policy admin_update_daily_stretches on public.daily_stretches
  for update using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════
-- PART 2: close the open reads (only after the new site code is live)
-- ═══════════════════════════════════════════════════════════════════════════

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Admins can read all profiles" on public.profiles
  for select using (public.is_admin());
-- "Users can read own profile" stays.

drop policy if exists "Results are publicly readable" on public.results;
create policy "Results visible per owner privacy" on public.results
  for select using (public.profile_history_visible(user_id) or public.is_admin());

drop policy if exists lift_prs_select on public.lift_prs;
create policy lift_prs_select on public.lift_prs
  for select using (public.profile_history_visible(user_id) or public.is_admin());
