-- Create the fixtures table
CREATE TABLE fixtures (
  id TEXT PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league_name TEXT,
  league_country TEXT,
  status TEXT,
  match_time TEXT,
  home_score INTEGER,
  away_score INTEGER,
  prediction TEXT,
  confidence INTEGER,
  odds DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on match_time for efficient queries
CREATE INDEX idx_fixtures_match_time ON fixtures(match_time);

-- Create an index on status for filtering live matches
CREATE INDEX idx_fixtures_status ON fixtures(status);

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anonymous read access
-- CREATE POLICY "Allow anonymous read access" ON fixtures
--   FOR SELECT
--   USING (true);
