-- ============================================================================
-- HOMEWODRX.COM — SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Paste this entire file into the Supabase SQL Editor and click "Run"
-- Dashboard → SQL Editor → New query → paste → Run

-- ── USER PROFILES ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  username      text unique not null,
  bio           text,
  avatar_color  text default '#E8530A',
  total_results integer default 0,
  created_at    timestamptz default now()
);

-- ── USER-GENERATED WORKOUTS ──────────────────────────────────────────────────
create table if not exists public.workouts (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid references auth.users(id) on delete cascade not null,
  username            text not null,
  title               text not null,
  format              text not null,  -- 'AMRAP','EMOM','For Time','Circuit'
  duration            integer,
  level               text,           -- 'beginner','intermediate','advanced'
  body_focus          text,
  equipment           text[] default '{}',
  movements           jsonb default '[]',
  description         text,
  scoring             text,
  scoring_type        text default 'rounds_reps',  -- 'time','rounds_reps','total_reps'
  is_public           boolean default false,
  is_featured         boolean default false,
  featured_type       text,           -- 'manual','auto','nominated'
  nomination_pending  boolean default false,
  view_count          integer default 0,
  result_count        integer default 0,
  created_at          timestamptz default now()
);

-- ── RESULTS (benchmark + user-generated unified) ─────────────────────────────
create table if not exists public.results (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  username        text not null,
  benchmark_slug  text,               -- set for named benchmarks
  workout_id      uuid references workouts(id) on delete cascade,  -- set for user workouts
  score_display   text not null,      -- human-readable: "8 rounds + 12 reps" / "7:42"
  score_seconds   integer,            -- for time-based sorting (lower = better)
  score_rounds    numeric(8,2),       -- for AMRAP sorting (higher = better)
  score_reps      integer,            -- for total-rep scoring
  is_rx           boolean default true,
  notes           text,
  date            date default current_date,
  created_at      timestamptz default now(),
  -- Constraint: must have either benchmark_slug or workout_id
  constraint result_has_source check (benchmark_slug is not null or workout_id is not null)
);

-- ── FEATURED WORKOUTS (manually scheduled by admin) ─────────────────────────
create table if not exists public.featured (
  id              uuid default gen_random_uuid() primary key,
  feature_date    date not null unique,
  benchmark_slug  text,
  workout_id      uuid references workouts(id) on delete set null,
  featured_type   text default 'manual',  -- 'manual','auto'
  notes           text,
  created_at      timestamptz default now()
);

-- ── DAILY WOD (auto-generated, admin-controlled parameters) ─────────────────
create table if not exists public.daily_wods (
  id            uuid default gen_random_uuid() primary key,
  wod_date      date not null unique,
  workout_data  jsonb not null,   -- the generated workout JSON
  is_manual     boolean default false,
  created_at    timestamptz default now()
);

-- Admin config for Daily WOD auto-generation (single row, id=1)
create table if not exists public.daily_wod_config (
  id      integer primary key default 1,
  config  jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Insert default config
insert into public.daily_wod_config (id, config) values (1, '{
  "equipment": ["bodyweight"],
  "difficultyByDay": {"0":"beginner","1":"intermediate","2":"advanced","3":"intermediate","4":"advanced","5":"advanced","6":"intermediate"},
  "bodyFocusByDay": {"0":"core","1":"full-body","2":"lower-body","3":"upper-body","4":"cardio","5":"full-body","6":"legs-glutes"},
  "formatByDay": {"0":"circuit","1":"amrap","2":"fortime","3":"emom","4":"amrap","5":"fortime","6":"circuit"},
  "durationByDay": {"0":[15,20],"1":[20,25],"2":[20,30],"3":[20,25],"4":[20,30],"5":[25,35],"6":[20,30]}
}') on conflict (id) do nothing;

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.workouts    enable row level security;
alter table public.results     enable row level security;
alter table public.featured    enable row level security;
alter table public.daily_wods  enable row level security;
alter table public.daily_wod_config enable row level security;

-- Profiles
create policy "Profiles are publicly readable"
  on profiles for select using (true);
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Workouts
create policy "Public workouts are readable by anyone"
  on workouts for select using (is_public = true or auth.uid() = user_id);
create policy "Users can insert their own workouts"
  on workouts for insert with check (auth.uid() = user_id);
create policy "Users can update their own workouts"
  on workouts for update using (auth.uid() = user_id);
create policy "Users can delete their own workouts"
  on workouts for delete using (auth.uid() = user_id);

-- Results
create policy "Results are publicly readable"
  on results for select using (true);
create policy "Authenticated users can insert results"
  on results for insert with check (auth.uid() = user_id);
create policy "Users can delete their own results"
  on results for delete using (auth.uid() = user_id);

-- Featured & Daily WOD (public read)
create policy "Featured workouts are public"
  on featured for select using (true);
create policy "Daily WODs are public"
  on daily_wods for select using (true);
create policy "Daily WOD config is public"
  on daily_wod_config for select using (true);

-- ── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── USEFUL INDEXES ────────────────────────────────────────────────────────────
create index if not exists results_benchmark_slug_idx on results(benchmark_slug);
create index if not exists results_workout_id_idx     on results(workout_id);
create index if not exists results_user_id_idx        on results(user_id);
create index if not exists results_date_idx           on results(date desc);
create index if not exists workouts_user_id_idx       on workouts(user_id);
create index if not exists workouts_public_idx        on workouts(is_public) where is_public = true;
create index if not exists daily_wods_date_idx        on daily_wods(wod_date desc);
