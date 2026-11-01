-- Day 6: keep the written draft (with its yours/Straddle tags) next to the take it came from.
alter table public.drafts add column if not exists draft jsonb;
alter table public.drafts add column if not exists model text;
create policy "own drafts update" on public.drafts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
