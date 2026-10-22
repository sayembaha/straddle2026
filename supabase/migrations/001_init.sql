-- Straddle day 3: invite codes, profiles, monthly draft counter.
create table if not exists public.invite_codes (
  code text primary key,
  redeemed_by uuid references auth.users(id),
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  draft_month text not null default to_char(now(), 'YYYY-MM'),
  drafts_used int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.invite_codes enable row level security;
alter table public.profiles enable row level security;

-- Users can read only their own profile. Codes are never readable from the browser.
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (auth.uid() = id);

-- Is this code real and unused? Callable before sign-in.
create or replace function public.check_invite(p_code text)
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from invite_codes where code = upper(trim(p_code)) and redeemed_by is null);
$$;

-- Redeem a code for the signed-in user. Seats are capped at 20 profiles.
create or replace function public.redeem_invite(p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); n int;
begin
  if uid is null then return 'not_signed_in'; end if;
  if exists (select 1 from profiles where id = uid) then return 'ok'; end if;
  select count(*) into n from profiles;
  if n >= 20 then return 'full'; end if;
  update invite_codes set redeemed_by = uid, redeemed_at = now()
    where code = upper(trim(p_code)) and redeemed_by is null;
  if not found then return 'invalid'; end if;
  insert into profiles (id, email) select uid, email from auth.users where id = uid;
  return 'ok';
end $$;

-- Count one draft against the 30 a month cap. Returns drafts left, or -1 if capped.
create or replace function public.use_draft()
returns int language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); m text := to_char(now(), 'YYYY-MM'); used int;
begin
  if uid is null then return -1; end if;
  update profiles set draft_month = m, drafts_used = 0 where id = uid and draft_month <> m;
  select drafts_used into used from profiles where id = uid;
  if used is null or used >= 30 then return -1; end if;
  update profiles set drafts_used = drafts_used + 1 where id = uid;
  return 30 - (used + 1);
end $$;

revoke all on function public.check_invite(text), public.redeem_invite(text), public.use_draft() from public;
grant execute on function public.check_invite(text) to anon, authenticated;
grant execute on function public.redeem_invite(text), public.use_draft() to authenticated;
