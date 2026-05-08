-- Cache table for API-Football live fixture snapshots.
-- The API fixture id is stored as the primary key so repeated polling updates
-- the same match row instead of creating duplicates.

create table if not exists matches (
  id bigint primary key,
  api_fixture_id bigint generated always as (id) stored,
  league_id int,
  league_name text,
  season int,
  home_team_id int,
  home_team_name text not null,
  away_team_id int,
  away_team_name text not null,
  elapsed int,
  status_short text,
  status_long text,
  home_score int,
  away_score int,
  kickoff_time timestamptz,
  last_api_sync_at timestamptz not null default now(),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_matches_status_short on matches(status_short);
create index if not exists idx_matches_kickoff_time on matches(kickoff_time);
