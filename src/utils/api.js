const API_HOST = 'v3.football.api-sports.io';
const BASE_URL = `https://${API_HOST}`;
const TOP_LEAGUES = new Set(['Premier League', 'La Liga', 'Bundesliga', 'Ghana Premier League']);

function formatMatchTime(dateString) {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mapApiFootballMatch(item) {
  const fixture = item.fixture ?? {};
  const goals = item.goals ?? {};
  const status = fixture.status ?? {};
  const teams = item.teams ?? {};
  const league = item.league ?? {};

  const statusShort = status.short ?? 'NS';
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(statusShort);

  return {
    id: fixture.id ?? `${league.name}-${teams.home?.name}-${teams.away?.name}-${fixture.timestamp}`,
    time: formatMatchTime(fixture.date),
    homeTeam: teams.home?.name ?? 'Home',
    awayTeam: teams.away?.name ?? 'Away',
    homeScore: goals.home ?? null,
    awayScore: goals.away ?? null,
    league: league.name ?? 'Unknown League',
    status: isLive ? 'live' : 'upcoming',
    statusShort,
    odds: Number(item.odds?.home) || 1.85,
    rawPayload: item,
  };
}

export async function fetchDailyMatches() {
  const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_SPORTS_API_KEY. Add your API-Football key to .env');
  }

  const today = new Date().toISOString().slice(0, 10);
  const url = `${BASE_URL}/fixtures?date=${today}`;

  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': API_HOST,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API-Football request failed (${response.status}): ${body}`);
  }

  const json = await response.json();
  if (!Array.isArray(json.response)) {
    throw new Error('Unexpected API-Football response format');
  }

  return json.response
    .filter((item) => TOP_LEAGUES.has(item.league?.name))
    .map(mapApiFootballMatch);
}

export async function getMatchDetails(matchId) {
  const matches = await fetchDailyMatches();
  return matches.find((match) => String(match.id) === String(matchId)) ?? null;
}
