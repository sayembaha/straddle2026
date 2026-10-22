-- Run this in the Supabase SQL Editor to create invite codes. Edit the list, one code per row.
insert into public.invite_codes (code) values
  ('STRADDLE-ONE'), ('STRADDLE-TWO'), ('STRADDLE-THREE'), ('STRADDLE-FOUR'), ('STRADDLE-FIVE')
on conflict do nothing;
