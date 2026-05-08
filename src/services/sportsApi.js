import axios from 'axios'
import { supabase } from '../lib/supabaseClient'

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io'
const MATCH_SELECT =
  'id,status,status_short,status_long,home_score,away_score,kickoff_time'

const sportsApiClient = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
  timeout: 12000,
})

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function apiFixtureIdToUuid(apiFixtureId) {
  const suffix = String(apiFixtureId ?? '').replace(/\D/g, '').padStart(12, '0').slice(-12)
  return `00000000-0000-4000-8000-${suffix}`
}

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
  const goals = apiFixture.goals ?? {}
  const status = fixture.status ?? {}
  const league = apiFixture.league ?? {}
  const teams = apiFixture.teams ?? {}

  return {
    external_fixture_id: fixture.id ?? null,
    status_short: status.short ?? null,
    status_long: status.long ?? null,
    status: status.long ?? status.short ?? null,
    home_score: goals.home ?? null,
    away_score: goals.away ?? null,
    kickoff_time: fixture.date ?? null,
    venue: fixture.venue?.name ?? null,
    raw_payload: apiFixture,
  }
}

export async function fetchFixturesFromApiFootball({ date = getTodayDate(), liveOnly = false } = {}) {
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
      params: liveOnly ? { live: 'all' } : { date },
      headers: {
        'x-apisports-key': apiKey,
      },
    })

    return Array.isArray(data?.response) ? data.response : []
  } catch (error) {
    throw createSportsApiError(error)
  }
}

export function fetchLiveFixturesFromApiFootball() {
  return fetchFixturesFromApiFootball({ liveOnly: true })
}

function enrichMatchesWithTeams(matches) {
  return matches.map((match) => ({
    ...match,
    home_team_name: match.home_team_name ?? 'Home',
    away_team_name: match.away_team_name ?? 'Away',
    home_logo_url: match.home_logo_url ?? null,
    away_logo_url: match.away_logo_url ?? null,
  }))
}

export async function fetchMatchesFromSupabase({ date = getTodayDate() } = {}) {
  let query = supabase
    .from('matches')
    .select(MATCH_SELECT)
    .order('kickoff_time', { ascending: true })

  if (date) {
    const dayStart = `${date}T00:00:00.000Z`
    const dayEnd = `${date}T23:59:59.999Z`
    query = query.gte('kickoff_time', dayStart).lte('kickoff_time', dayEnd)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return enrichMatchesWithTeams(data ?? [])
}

export function fetchCachedMatchesFromSupabase(options) {
  return fetchMatchesFromSupabase(options)
}

export async function fetchFixturesFromSupabase({ date = getTodayDate() } = {}) {
  const fixtureSelect = 'external_fixture_id,status,status_short,status_long,home_score,away_score,kickoff_time,venue,league_id,home_team_id,away_team_id'
  let query = supabase
    .from('fixtures')
    .select(fixtureSelect)
    .order('kickoff_time', { ascending: true })

  if (date) {
    const dayStart = `${date}T00:00:00.000Z`
    const dayEnd = `${date}T23:59:59.999Z`
    query = query.gte('kickoff_time', dayStart).lte('kickoff_time', dayEnd)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data ?? []
}

export async function syncFixturesToSupabase(options = {}) {
  try {
    const fixtures = await fetchFixturesFromApiFootball(options)
    const rows = fixtures.map(mapApiFootballFixture).filter((row) => row.external_fixture_id)

    if (rows.length === 0) {
      return {
        data: await fetchFixturesFromSupabase(options),
        source: 'cache',
        synced: 0,
        error: null,
      }
    }

    const { data, error } = await supabase
      .from('fixtures')
      .upsert(rows, { onConflict: 'external_fixture_id' })
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
    const cachedData = await fetchFixturesFromSupabase(options).catch(() => [])

    return {
      data: cachedData,
      source: 'cache',
      synced: 0,
      error,
    }
  }
}

export function syncLiveFixturesToSupabase() {
  return syncFixturesToSupabase({ date: getTodayDate() })
}

export function fetchMatches() {
  return syncFixturesToSupabase({ date: getTodayDate() })
}
