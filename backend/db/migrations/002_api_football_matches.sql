-- Cache table for API-Football fixture snapshots.
-- API-Football fixture id is the primary key so repeated syncs update rows.

create table if not exists matches (
  id uuid primary key,
  status text,
  status_short text,
  status_long text,
  home_score int,
  away_score int,
  kickoff_time timestamptz
);

create index if not exists idx_matches_status_short on matches(status_short);
create index if not exists idx_matches_kickoff_time on matches(kickoff_time);
