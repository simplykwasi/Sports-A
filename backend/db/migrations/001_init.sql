-- Supabase / PostgreSQL schema for Sports A analytics platform

create extension if not exists pgcrypto;

create table if not exists users (
  user_id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text,
  role text default 'user',
  created_at timestamptz not null default now()
);

create table if not exists leagues (
  league_id uuid primary key default gen_random_uuid(),
  external_league_id int unique,
  name text not null,
  country text,
  season text,
  tier int,
  logo_url text,
  provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teams (
  team_id uuid primary key default gen_random_uuid(),
  external_team_id int unique,
  league_id uuid references leagues(league_id) on delete set null,
  name text not null,
  short_name text,
  aliases jsonb default '[]',
  stadium_name text,
  city text,
  founded int,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists players (
  player_id uuid primary key default gen_random_uuid(),
  external_player_id int unique,
  team_id uuid references teams(team_id) on delete set null,
  league_id uuid references leagues(league_id) on delete set null,
  name text not null,
  position text,
  nationality text,
  date_of_birth date,
  height_cm int,
  weight_kg int,
  preferred_foot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fixtures (
  fixture_id uuid primary key default gen_random_uuid(),
  external_fixture_id int unique,
  league_id uuid references leagues(league_id) on delete cascade,
  home_team_id uuid references teams(team_id) on delete cascade,
  away_team_id uuid references teams(team_id) on delete cascade,
  season text,
  round text,
  kickoff_time timestamptz not null,
  status text,
  venue text,
  home_score int,
  away_score int,
  home_xg numeric(5,3),
  away_xg numeric(5,3),
  home_strength numeric(6,3),
  away_strength numeric(6,3),
  feature_snapshot jsonb,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists market_data (
  market_id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures(fixture_id) on delete cascade,
  provider text not null,
  market_type text not null,
  submarket text,
  market_time timestamptz not null default now(),
  home_odds numeric(10,4),
  draw_odds numeric(10,4),
  away_odds numeric(10,4),
  implied_home numeric(10,4),
  implied_draw numeric(10,4),
  implied_away numeric(10,4),
  liquidity numeric(12,2),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists predictions (
  prediction_id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures(fixture_id) on delete cascade,
  model_name text not null,
  model_version text,
  predicted_home_prob numeric(6,5) not null,
  predicted_draw_prob numeric(6,5) not null,
  predicted_away_prob numeric(6,5) not null,
  bookie_home_prob numeric(6,5),
  bookie_draw_prob numeric(6,5),
  bookie_away_prob numeric(6,5),
  confidence_score numeric(5,4),
  value_flag boolean default false,
  value_delta numeric(6,5),
  explanation text,
  created_at timestamptz not null default now()
);

create table if not exists live_events (
  event_id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures(fixture_id) on delete cascade,
  event_time timestamptz not null default now(),
  event_type text not null,
  team_id uuid references teams(team_id) on delete set null,
  player_id uuid references players(player_id) on delete set null,
  home_possession int,
  away_possession int,
  home_shots_on_target int,
  away_shots_on_target int,
  home_red_cards int,
  away_red_cards int,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_fixtures_league on fixtures(league_id);
create index if not exists idx_market_fixture on market_data(fixture_id);
create index if not exists idx_prediction_fixture on predictions(fixture_id);
create index if not exists idx_live_fixture on live_events(fixture_id);
