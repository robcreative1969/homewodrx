-- HomeWODRx site metrics: cookie-free page views and site searches.
-- Approved by Rob 2026-11-20 ("yes" to adding cookie-free tracking to the live site).
--
-- Privacy by design:
--   * No cookies, no IP addresses, no user ids stored.
--   * A visitor is counted with a one-day hash of (IP + browser + a random salt for that
--     day). Salts older than two days are deleted, so old hashes can't be linked or reversed.
--   * Visitors can only add events through log_site_event(); nobody but an admin can read them.

begin;

create table if not exists public.site_events (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),
  kind        text not null check (kind in ('view', 'search')),
  host        text not null,
  path        text not null,
  referrer    text,              -- referring site's host only, e.g. google.com
  device      text check (device in ('mobile', 'tablet', 'desktop')),
  country     text,              -- two-letter code when the network provides it
  visitor     text,              -- one-day hash, see above
  query       text,              -- site searches only
  results     integer            -- site searches only
);
create index if not exists site_events_at_idx on public.site_events (at desc);
create index if not exists site_events_kind_at_idx on public.site_events (kind, at desc);

alter table public.site_events enable row level security;
drop policy if exists site_events_admin_read on public.site_events;
create policy site_events_admin_read on public.site_events for select using (public.is_admin());
-- No insert/update/delete policies: writes only go through log_site_event().

create table if not exists public.site_event_salts (
  day  date primary key,
  salt text not null default replace(gen_random_uuid()::text, '-', '')
);
alter table public.site_event_salts enable row level security;
-- No policies at all: only the function below (running as its owner) can use the salts.

create or replace function public.log_site_event(
  p_kind text, p_host text, p_path text, p_referrer text default null,
  p_device text default null, p_query text default null, p_results integer default null
) returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  hdr   json := coalesce(nullif(current_setting('request.headers', true), '')::json, '{}'::json);
  ua    text := left(coalesce(hdr->>'user-agent', ''), 400);
  ip    text := split_part(coalesce(hdr->>'x-forwarded-for', hdr->>'x-real-ip', ''), ',', 1);
  s     text;
  ref   text;
begin
  -- Ignore bots and anything malformed.
  if ua = '' or ua ~* '(bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python)' then return; end if;
  if p_kind not in ('view', 'search') then return; end if;
  if p_host is null or p_host !~ '^[a-z0-9.-]{3,80}$' then return; end if;
  if p_path is null or left(p_path, 1) <> '/' or length(p_path) > 300 then return; end if;

  insert into public.site_event_salts (day) values (current_date) on conflict (day) do nothing;
  delete from public.site_event_salts where day < current_date - 1;
  select salt into s from public.site_event_salts where day = current_date;

  ref := lower(substring(coalesce(p_referrer, '') from '^https?://(?:www\.)?([^/:?#]+)'));
  if ref = p_host or ref = '' or ref = replace(p_host, 'www.', '') then ref := null; end if;

  insert into public.site_events (kind, host, path, referrer, device, country, visitor, query, results)
  values (
    p_kind,
    p_host,
    split_part(split_part(p_path, '?', 1), '#', 1),
    left(ref, 120),
    case when p_device in ('mobile', 'tablet', 'desktop') then p_device end,
    nullif(upper(left(coalesce(hdr->>'cf-ipcountry', ''), 2)), ''),
    case when ip <> '' then left(md5(s || ip || ua), 16) end,
    case when p_kind = 'search' then left(lower(trim(p_query)), 100) end,
    case when p_kind = 'search' then greatest(0, least(p_results, 100000)) end
  );
end;
$$;

revoke all on function public.log_site_event(text, text, text, text, text, text, integer) from public;
grant execute on function public.log_site_event(text, text, text, text, text, text, integer) to anon, authenticated;

commit;
