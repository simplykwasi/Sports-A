import axios from 'axios'
import { supabase } from '../lib/supabaseClient'

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io'
const LIVE_STATUSES = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE']

const sportsApiClient = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
  timeout: 12000,
})

function getSportsApiKey() {
  return import.meta.env.VITE_SPORTS_API_KEY
}

function createSportsApiError(error) {
  const status = error.response?.status
  const apiErrors = error.response?.data?.errors
  const message =
    status === 429
      ? 'API-Football rate limit reached. Showing cached Supabase data.'
      : error.response?.data?.message || error.message || 'Unable to fetch API-Football data.'

  return {
    message,
    status,
    rateLimited: status === 429 || Boolean(apiErrors?.requests),
    details: apiErrors,
  }
}

export function mapApiFootballFixture(apiFixture) {
  const fixture = apiFixture.fixture ?? {}
  const league = apiFixture.league ?? {}
  const teams = apiFixture.teams ?? {}
  const goals = apiFixture.goals ?? {}
  const status = fixture.status ?? {}

  return {
    id: fixture.id,
    league_id: league.id ?? null,
    league_name: league.name ?? null,
    season: league.season ?? null,
    home_team_id: teams.home?.id ?? null,
    home_team_name: teams.home?.name ?? 'Home',
    away_team_id: teams.away?.id ?? null,
    away_team_name: teams.away?.name ?? 'Away',
    elapsed: status.elapsed ?? null,
    status_short: status.short ?? null,
    status_long: status.long ?? null,
    home_score: goals.home ?? null,
    away_score: goals.away ?? null,
    kickoff_time: fixture.date ?? null,
    last_api_sync_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    raw_payload: apiFixture,
  }
}

export async function fetchLiveFixturesFromApiFootball() {
  const apiKey = getSportsApiKey()

  if (!apiKey) {
    throw {
      message: 'Missing VITE_SPORTS_API_KEY. Showing cached Supabase data.',
      status: null,
      rateLimited: false,
    }
  }

  try {
    const { data } = await sportsApiClient.get('/fixtures', {
      params: { live: 'all' },
      headers: {
        'x-apisports-key': apiKey,
      },
    })

    return Array.isArray(data?.response) ? data.response : []
  } catch (error) {
    throw createSportsApiError(error)
  }
}

export async function fetchCachedMatchesFromSupabase() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .in('status_short', LIVE_STATUSES)
    .order('kickoff_time', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function syncLiveFixturesToSupabase() {
  try {
    const fixtures = await fetchLiveFixturesFromApiFootball()
    const rows = fixtures.map(mapApiFootballFixture).filter((row) => row.id)

    if (rows.length === 0) {
      return {
        data: await fetchCachedMatchesFromSupabase(),
        source: 'cache',
        synced: 0,
        error: null,
      }
    }

    const { data, error } = await supabase
      .from('matches')
      .upsert(rows, { onConflict: 'id' })
      .select()

    if (error) {
      throw error
    }

    return {
      data: data ?? rows,
      source: 'api',
      synced: rows.length,
      error: null,
    }
  } catch (error) {
    const cachedData = await fetchCachedMatchesFromSupabase().catch(() => [])

    return {
      data: cachedData,
      source: 'cache',
      synced: 0,
      error,
    }
  }
}
