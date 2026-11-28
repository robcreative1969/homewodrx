-- Free accounts, step 2: logging, history and the consistency calendar.
-- DRAFT for Rob to review. Run it once in Supabase > SQL Editor. Safe to re-run.
--
-- What it does
--   1. Lets a result be "done" with no score (score is optional).
--   2. Lets a result be a free-form activity (a 3-mile run) with no workout attached.
--   3. Lets a result point at the Daily 20 (by date) or a WOD Builder workout (by title).
--   4. Makes results private: only the person who logged them can see or change them.
--      (Today the table says "publicly readable", which contradicts the private decision.)
--   5. Makes lift_prs private too. Anyone can read its 3 rows today (lift + weight + user id).

begin;

-- 1. Score optional --------------------------------------------------------------
alter table public.results alter column score_display drop not null;

-- 2 + 3. What a result can point at --------------------------------------------------
alter table public.results add column if not exists source text;            -- 'library' | 'daily20' | 'builder' | 'activity'
alter table public.results add column if not exists title text;             -- name shown in history ("Fran", "Run")
alter table public.results add column if not exists daily20_date date;      -- which Daily 20
alter table public.results add column if not exists activity_type text;     -- run, walk, bike, row, swim, hike, other
alter table public.results add column if not exists activity_name text;     -- for "other": "Pickleball"
alter table public.results add column if not exists distance_value numeric(8,2);
alter table public.results add column if not exists distance_unit text;
alter table public.results add column if not exists duration_seconds integer;
alter table public.results add column if not exists updated_at timestamptz default now();

-- Older rows (if any) came from the library or a user workout.
update public.results set source = case when benchmark_slug is not null then 'library' else 'builder' end
where source is null;
alter table public.results alter column source set not null;

-- Replace the old "must have a benchmark or a workout" rule with one that knows every kind.
alter table public.results drop constraint if exists result_has_source;
alter table public.results drop constraint if exists result_source_valid;
alter table public.results add constraint result_source_valid check (
  (source = 'library'  and benchmark_slug is not null) or
  (source = 'daily20'  and daily20_date is not null) or
  (source = 'builder'  and (workout_id is not null or title is not null)) or
  (source = 'activity' and activity_type is not null)
);
alter table public.results drop constraint if exists result_distance_unit;
alter table public.results add constraint result_distance_unit check (distance_unit is null or distance_unit in ('mi', 'km', 'm'));
alter table public.results drop constraint if exists result_sane_numbers;
alter table public.results add constraint result_sane_numbers check (
  (distance_value is null or (distance_value > 0 and distance_value < 100000)) and
  (duration_seconds is null or (duration_seconds > 0 and duration_seconds < 86400)) and
  (notes is null or length(notes) <= 1000) and
  (title is null or length(title) <= 120) and
  (activity_name is null or length(activity_name) <= 60)
);

-- The calendar and history read by person and date.
create index if not exists results_user_date_idx on public.results (user_id, date desc);

-- 4. Results are private ----------------------------------------------------------------
alter table public.results enable row level security;
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'results' loop
    execute format('drop policy %I on public.results', p.policyname);
  end loop;
end $$;
create policy "Read own results"   on public.results for select using (auth.uid() = user_id);
create policy "Add own results"    on public.results for insert with check (auth.uid() = user_id);
create policy "Change own results" on public.results for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own results" on public.results for delete using (auth.uid() = user_id);

-- 5. Lift PRs are private ----------------------------------------------------------------
alter table public.lift_prs enable row level security;
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'lift_prs' loop
    execute format('drop policy %I on public.lift_prs', p.policyname);
  end loop;
end $$;
create policy "Read own lift PRs"   on public.lift_prs for select using (auth.uid() = user_id);
create policy "Add own lift PRs"    on public.lift_prs for insert with check (auth.uid() = user_id);
create policy "Change own lift PRs" on public.lift_prs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own lift PRs" on public.lift_prs for delete using (auth.uid() = user_id);

commit;
