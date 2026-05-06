import dotenv from 'dotenv';
import { query } from '../db/client.js';
import { normalizeTeamName } from '../utils/aliasNormalizer.js';

dotenv.config();

const API_BASE = process.env.SPORTS_API_BASE;
const API_KEY = process.env.SPORTS_API_KEY;

function buildHeaders() {
  return {
    'x-apisports-key': API_KEY,
    'Content-Type': 'application/json',
  };
}

function calculateWeightedForm(recentMatches = []) {
  const MAX_RECENT = 10;
  const recent = recentMatches.slice(0, MAX_RECENT);
  const weights = recent.map((_, index) => Math.pow(0.85, index));
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);

  const score = recent.reduce((sum, match, index) => {
    const result = match.result === 'win' ? 1 : match.result === 'draw' ? 0.5 : 0;
    return sum + result * weights[index];
  }, 0);

  return totalWeight > 0 ? Number((score / totalWeight).toFixed(4)) : 0.5;
}

function computeTeamStrength({ form, xg, opponentStrength, location }) {
  const locationBonus = location === 'home' ? 0.08 : -0.04;
  return Number(Math.min(Math.max(0.15 + form * 0.5 + xg * 0.18 + opponentStrength * 0.12 + locationBonus, 0.18), 0.96).toFixed(4));
}

async function fetchApi(path) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sports API request failed: ${response.status} ${body}`);
  }
  return response.json();
}

class IngestionService {
  async ingestLeague(leagueExternalId, season = '2025') {
    const leagueData = await fetchApi(`/leagues?id=${leagueExternalId}&season=${season}`);
    if (!leagueData.response?.length) {
      throw new Error('League metadata not found');
    }

    const league = leagueData.response[0].league;
    const leagueResult = await query(
      `insert into leagues (external_league_id, name, country, season, tier, logo_url, provider)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (external_league_id) do update set name = excluded.name, country = excluded.country, season = excluded.season, tier = excluded.tier, logo_url = excluded.logo_url, updated_at = now()
       returning *`,
      [league.id, league.name, league.country, season, league.rank || 1, league.logo, 'api-football']
    );

    return leagueResult.rows[0];
  }

  async ingestTeams(leagueExternalId, season = '2025') {
    const raw = await fetchApi(`/teams?league=${leagueExternalId}&season=${season}`);
    const inserts = raw.response.map(async (entry) => {
      const normalized = normalizeTeamName(entry.team.name);
      await query(
        `insert into teams (external_team_id, league_id, name, short_name, aliases, stadium_name, city, logo_url)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (external_team_id) do update set name = excluded.name, short_name = excluded.short_name, aliases = excluded.aliases, stadium_name = excluded.stadium_name, city = excluded.city, logo_url = excluded.logo_url, updated_at = now()`,
        [entry.team.id, null, normalized, entry.team.name, JSON.stringify(entry.team.aliases || []), entry.venue?.name || null, entry.venue?.city || null, entry.team.logo]
      );
    });
    await Promise.all(inserts);
  }

  async ingestFixtures(leagueExternalId, season = '2025') {
    const fixturesData = await fetchApi(`/fixtures?league=${leagueExternalId}&season=${season}&next=60`);
    const fixtures = fixturesData.response || [];

    for (const fixture of fixtures) {
      const homeName = normalizeTeamName(fixture.teams.home.name);
      const awayName = normalizeTeamName(fixture.teams.away.name);
      const homeTeam = await this.ensureTeam(fixture.teams.home, homeName);
      const awayTeam = await this.ensureTeam(fixture.teams.away, awayName);
      const leagueRow = await query('select league_id from leagues where external_league_id = $1 limit 1', [leagueExternalId]);
      const leagueId = leagueRow.rows[0]?.league_id;
      const formHome = calculateWeightedForm(this.parseRecentResults(fixture.statistics?.homeForm || []));
      const formAway = calculateWeightedForm(this.parseRecentResults(fixture.statistics?.awayForm || []));
      const homeXg = Number((fixture.goals.home_xg || fixture.statistics?.homeXG || 1.05).toFixed(3));
      const awayXg = Number((fixture.goals.away_xg || fixture.statistics?.awayXG || 0.92).toFixed(3));
      const homeStrength = computeTeamStrength({ form: formHome, xg: homeXg, opponentStrength: formAway, location: 'home' });
      const awayStrength = computeTeamStrength({ form: formAway, xg: awayXg, opponentStrength: formHome, location: 'away' });

      await query(
        `insert into fixtures (external_fixture_id, league_id, home_team_id, away_team_id, season, round, kickoff_time, status, venue, home_score, away_score, home_xg, away_xg, home_strength, away_strength, feature_snapshot, raw_payload)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         on conflict (external_fixture_id) do update set league_id = excluded.league_id, home_team_id = excluded.home_team_id, away_team_id = excluded.away_team_id, round = excluded.round, kickoff_time = excluded.kickoff_time, status = excluded.status, venue = excluded.venue, home_score = excluded.home_score, away_score = excluded.away_score, home_xg = excluded.home_xg, away_xg = excluded.away_xg, home_strength = excluded.home_strength, away_strength = excluded.away_strength, feature_snapshot = excluded.feature_snapshot, raw_payload = excluded.raw_payload, updated_at = now()`,
        [
          fixture.fixture.id,
          leagueId,
          homeTeam.team_id,
          awayTeam.team_id,
          season,
          fixture.league.round || fixture.league.stage || null,
          fixture.fixture.date,
          fixture.fixture.status.short,
          fixture.fixture.venue.name || null,
          fixture.goals.home,
          fixture.goals.away,
          homeXg,
          awayXg,
          homeStrength,
          awayStrength,
          JSON.stringify({ formHome, formAway, recentMetrics: fixture.statistics || {} }),
          JSON.stringify(fixture),
        ]
      );
    }
  }

  async ensureTeam(teamPayload, normalizedName) {
    const existing = await query('select team_id from teams where external_team_id = $1 limit 1', [teamPayload.id]);
    if (existing.rows.length) {
      await query('update teams set name = $1, aliases = $2, updated_at = now() where team_id = $3', [normalizedName, JSON.stringify(teamPayload.aliases || []), existing.rows[0].team_id]);
      return existing.rows[0];
    }

    const result = await query(
      `insert into teams (external_team_id, name, short_name, aliases, logo_url)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [teamPayload.id, normalizedName, teamPayload.name, JSON.stringify(teamPayload.aliases || []), teamPayload.logo]
    );
    return result.rows[0];
  }

  parseRecentResults(rawResults = []) {
    return rawResults.map((item) => ({ result: item.result || 'draw' }));
  }
}

export default new IngestionService();
