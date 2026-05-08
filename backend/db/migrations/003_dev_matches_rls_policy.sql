-- Development-only policy for browser-triggered match sync.
-- Replace this with a service-role Edge Function or server job before production.

alter table matches enable row level security;

drop policy if exists "dev read matches" on matches;
drop policy if exists "dev insert matches" on matches;
drop policy if exists "dev update matches" on matches;

create policy "dev read matches"
  on matches
  for select
  to anon, authenticated
  using (true);

create policy "dev insert matches"
  on matches
  for insert
  to anon, authenticated
  with check (true);

create policy "dev update matches"
  on matches
  for update
  to anon, authenticated
  using (true)
  with check (true);
