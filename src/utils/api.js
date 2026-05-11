const API_HOST = 'v3.football.api-sports.io';
const BASE_URL = `https://${API_HOST}`;
const BACKEND_URL = "http://127.0.0.1:8000";

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

  return {
    id: fixture.id ?? `${league.name}-${teams.home?.name}-${teams.away?.name}-${fixture.timestamp}`,
    time: formatMatchTime(fixture.date),
    homeTeam: teams.home?.name ?? 'Home',
    awayTeam: teams.away?.name ?? 'Away',
    homeScore: goals.home ?? null,
    awayScore: goals.away ?? null,
    league: league.name ?? 'Unknown League',
    leagueName: league.name && league.country ? `${league.name} - ${league.country}` : league.name ?? 'Unknown League',
    status: statusShort,
    statusShort,
    odds: Number(item.odds?.home) || 1.85,
    rawPayload: item,
  };
}

function parseNumber(value) {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parsePercent(value) {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value).replace(/[^0-9]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeMatchStatus(status) {
  if (status === 'NS') return 'Upcoming';
  if (['1H', '2H', 'HT', 'ET', 'P'].includes(status)) return 'LIVE';
  if (status === 'FT') return 'Finished';
  return status || 'Upcoming';
}

function findStatValue(stats, keywords) {
  const stat = stats.find((item) => {
    const type = String(item.type ?? '').toLowerCase();
    return keywords.some((keyword) => type.includes(keyword));
  });
  return stat ? stat.value ?? stat.total ?? stat.home ?? stat.away ?? 0 : 0;
}

function makeRequest(url) {
  return fetch(url, {
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_SPORTS_API_KEY,
      'x-rapidapi-host': API_HOST,
      Accept: 'application/json',
    },
  });
}

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 5 seconds');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchDailyMatches() {
  const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_SPORTS_API_KEY. Add your API-Football key to .env');
  }

  const today = new Date().toISOString().slice(0, 10);
  const url = `${BASE_URL}/fixtures?date=${today}`;
  console.log('Fetching from:', url);
  console.log('API Key exists:', !!apiKey);
  const response = await makeRequest(url);

  if (!response.ok) {
    const body = await response.text();
    console.log('API response body:', body);
    throw new Error(`API-Football request failed (${response.status}): ${body}`);
  }

  const json = await response.json();
  console.log('API response data:', json);
  if (!Array.isArray(json.response)) {
    throw new Error('Unexpected API-Football response format');
  }

  return json.response.map(mapApiFootballMatch);
}

export async function fetchMatchDetails(matchId) {
  const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_SPORTS_API_KEY. Add your API-Football key to .env');
  }

  const url = `${BASE_URL}/fixtures?id=${encodeURIComponent(matchId)}`;
  console.log('Fetching from:', url);
  console.log('API Key exists:', !!apiKey);
  const response = await makeRequest(url);

  if (!response.ok) {
    console.log('API response status:', response.status);
    return null;
  }

  const json = await response.json();
  console.log('API response data:', json);
  if (!Array.isArray(json.response) || json.response.length === 0) {
    return null;
  }

  return mapApiFootballMatch(json.response[0]);
}

export async function fetchYesterdayFixtures() {
  const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_SPORTS_API_KEY. Add your API-Football key to .env");
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toISOString().slice(0, 10);
  const url = `${BASE_URL}/fixtures?date=${yesterdayFormatted}`;
  console.log('Fetching from:', url);
  console.log('API Key exists:', !!apiKey);
  const response = await makeRequest(url);

  if (!response.ok) {
    const body = await response.text();
    console.log('API response body:', body);
    throw new Error(`API-Football request failed (${response.status}): ${body}`);
  }

  const json = await response.json();
  console.log('API response data:', json);
  if (!Array.isArray(json.response)) {
    throw new Error('Unexpected API-Football response format');
  }

  return json.response
    .filter((item) => item.fixture?.status?.short === 'FT')
    .map(mapApiFootballMatch);
}

export async function fetchAccuracy() {
  const url = `${BACKEND_URL}/accuracy`;
  console.log('Full Backend URL:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Accuracy service failed (${response.status}): ${body}`);
    }
    const json = await response.json();
    if (json.status === 'error') {
      throw new Error('Prediction engine is warming up...');
    }
    const matches = json.data || [];
    return matches;
  } catch (error) {
    console.error('Connection Error Details:', error);
    throw error;
  }
}

export async function fetchPredictions() {
  const url = `${BACKEND_URL}/predictions`;
  console.log('Full Backend URL:', url);
  try {
    const response = await fetchWithTimeout(url, {}, 5000);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Prediction service failed (${response.status}): ${body}`);
    }
    const json = await response.json();
    if (json.status === 'error') {
      throw new Error('Prediction engine is warming up...');
    }
    const matches = json.data || [];
    return matches.map((match) => ({
      ...match,
      statusLabel: normalizeMatchStatus(match.status),
    }));
  } catch (error) {
    console.error('Connection Error Details:', error);
    throw error;
  }
}

export async function fetchMatchStatistics(fixtureId) {
  const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_SPORTS_API_KEY. Add your API-Football key to .env');
  }

  const url = `${BASE_URL}/fixtures/statistics?fixture=${encodeURIComponent(fixtureId)}`;
  console.log('Fetching from:', url);
  console.log('API Key exists:', !!apiKey);
  const response = await makeRequest(url);

  if (!response.ok) {
    console.log('API response status:', response.status);
    return {
      shots: { home: 0, away: 0 },
      possession: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
    };
  }

  const json = await response.json();
  console.log('API response data:', json);
  if (!Array.isArray(json.response) || json.response.length === 0) {
    return {
      shots: { home: 0, away: 0 },
      possession: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
    };
  }

  const [homeStats = {}, awayStats = {}] = json.response;
  const homeData = Array.isArray(homeStats.statistics) ? homeStats.statistics : [];
  const awayData = Array.isArray(awayStats.statistics) ? awayStats.statistics : [];

  return {
    shots: {
      home: parseNumber(findStatValue(homeData, ['shots', 'shots on goal', 'shoots'])),
      away: parseNumber(findStatValue(awayData, ['shots', 'shots on goal', 'shoots'])),
    },
    possession: {
      home: parsePercent(findStatValue(homeData, ['possession'])),
      away: parsePercent(findStatValue(awayData, ['possession'])),
    },
    corners: {
      home: parseNumber(findStatValue(homeData, ['corner', 'corners'])),
      away: parseNumber(findStatValue(awayData, ['corner', 'corners'])),
    },
  };
}

export async function fetchHeadToHead(h2hId) {
  const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_SPORTS_API_KEY. Add your API-Football key to .env');
  }

  const url = `${BASE_URL}/fixtures/headtohead?h2h=${encodeURIComponent(h2hId)}`;
  console.log('Fetching from:', url);
  console.log('API Key exists:', !!apiKey);
  const response = await makeRequest(url);

  if (!response.ok) {
    console.log('API response status:', response.status);
    return [];
  }

  const json = await response.json();
  console.log('API response data:', json);
  if (!Array.isArray(json.response)) {
    return [];
  }

  return json.response
    .sort((a, b) => (b.fixture?.timestamp || 0) - (a.fixture?.timestamp || 0))
    .slice(0, 5)
    .map((item) => ({
      date: item.fixture?.date ? item.fixture.date.slice(0, 10) : 'TBD',
      home: item.teams?.home?.name ?? 'Home',
      away: item.teams?.away?.name ?? 'Away',
      homeScore: item.goals?.home ?? 0,
      awayScore: item.goals?.away ?? 0,
      winner:
        item.goals?.home > item.goals?.away
          ? item.teams?.home?.name
          : item.goals?.away > item.goals?.home
            ? item.teams?.away?.name
            : 'Draw',
    }));
}
