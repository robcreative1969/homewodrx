-- Free accounts, step 3: "Your workouts" (saved workouts).
-- DRAFT for Rob to review. Run it once in Supabase > SQL Editor. Safe to re-run.
--
-- What it does
--   1. Adds a new table, saved_workouts. Each row is one workout someone saved:
--      a library workout (by its slug), The Daily 20 (by date), or a WOD Builder
--      workout (the workout itself plus the builder link, so it can be reopened).
--   2. Keeps it private: people can only see, add, rename and remove their own saves.
--      Nobody else can read them, admins included. Only the name of a WOD Builder save
--      can be changed; nothing else about a save can be edited.
--   3. Sanity limits: one save per workout per person, short titles and links,
--      a builder workout under 20 KB, and at most 500 saves per person.
--   4. Lets a logged WOD Builder workout remember its builder link (results.builder_query),
--      so History can link back to it. Older builder entries stay unlinked.
--
-- It doesn't touch the old public.workouts table (2 public workouts from the old site).

begin;

create table if not exists public.saved_workouts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind        text not null,      -- 'library' | 'daily20' | 'builder'
  ref         text not null,      -- library: slug; daily20: YYYY-MM-DD; builder: the builder link's query
  title       text not null,
  workout     jsonb,              -- builder only: title, format, minutes, rows and so on
  created_at  timestamptz not null default now(),
  constraint saved_kind_valid check (
    (kind = 'library' and ref ~ '^[a-z0-9-]{1,120}$' and workout is null) or
    (kind = 'daily20' and ref ~ '^\d{4}-\d{2}-\d{2}$' and workout is null) or
    (kind = 'builder' and length(ref) <= 500 and workout is not null and jsonb_typeof(workout) = 'object')
  ),
  constraint saved_sane_sizes check (
    length(title) between 1 and 120 and
    (workout is null or pg_column_size(workout) <= 20000)
  ),
  constraint saved_once unique (user_id, kind, ref)
);

create index if not exists saved_workouts_user_created_idx on public.saved_workouts (user_id, created_at desc);

-- At most 500 saves per person.
create or replace function public.saved_workouts_limit() returns trigger
language plpgsql set search_path = public as $$
begin
  if (select count(*) from public.saved_workouts where user_id = new.user_id) >= 500 then
    raise exception 'You can save up to 500 workouts.';
  end if;
  return new;
end $$;
drop trigger if exists saved_workouts_limit on public.saved_workouts;
create trigger saved_workouts_limit before insert on public.saved_workouts
  for each row execute function public.saved_workouts_limit();

-- History links for WOD Builder entries ---------------------------------------------------
alter table public.results add column if not exists builder_query text;
alter table public.results drop constraint if exists result_builder_query_length;
alter table public.results add constraint result_builder_query_length check (builder_query is null or length(builder_query) <= 500);

-- Private to each person ----------------------------------------------------------------
alter table public.saved_workouts enable row level security;
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'saved_workouts' loop
    execute format('drop policy %I on public.saved_workouts', p.policyname);
  end loop;
end $$;
create policy "Read own saves"   on public.saved_workouts for select to authenticated using (auth.uid() = user_id);
create policy "Add own saves"    on public.saved_workouts for insert to authenticated with check (auth.uid() = user_id);
create policy "Rename own builder saves" on public.saved_workouts for update to authenticated
  using (auth.uid() = user_id and kind = 'builder') with check (auth.uid() = user_id and kind = 'builder');
create policy "Remove own saves" on public.saved_workouts for delete to authenticated using (auth.uid() = user_id);

-- Signed-out visitors get nothing at all; signed-in people get only what the rules above allow.
revoke all on public.saved_workouts from anon;
revoke all on public.saved_workouts from authenticated;
grant select, insert, delete on public.saved_workouts to authenticated;
grant update (title) on public.saved_workouts to authenticated;  -- the name, and nothing else

commit;
