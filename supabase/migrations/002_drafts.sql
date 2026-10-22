-- Day 5: every generation is kept, starting with the analysis of the writer's take.
create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  take text not null,
  channels text[] not null default '{}',
  max_words int,
  analysis jsonb,
  created_at timestamptz not null default now()
);
alter table public.drafts enable row level security;
create policy "own drafts read" on public.drafts for select using (auth.uid() = user_id);
create policy "own drafts insert" on public.drafts for insert with check (auth.uid() = user_id);
create index if not exists drafts_user_created on public.drafts (user_id, created_at desc);
