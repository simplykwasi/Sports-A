import { supabase, withSupabaseErrorHandling } from '../lib/supabaseClient.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Fetch with JWT token attached
 */
async function fetchWithAuth(url, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API error ${response.status}`);
  }

  return response.json();
}

/**
 * Auth endpoints
 */
export const authAPI = {
  login: (email, password) =>
    withSupabaseErrorHandling(() =>
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    ),

  register: (email, password, displayName) =>
    withSupabaseErrorHandling(() =>
      fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      })
    ),

  refreshToken: (refreshToken) =>
    withSupabaseErrorHandling(() =>
      fetchWithAuth('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })
    ),
};

/**
 * Analytics endpoints
 */
export const analyticsAPI = {
  getDashboard: () =>
    withSupabaseErrorHandling(() => fetchWithAuth('/dashboard')),

  getValueBets: () =>
    withSupabaseErrorHandling(() => fetchWithAuth('/value-bets')),

  getPredictions: () =>
    withSupabaseErrorHandling(() => fetchWithAuth('/predictions')),

  getFixtureById: (fixtureId) =>
    withSupabaseErrorHandling(() => fetchWithAuth(`/fixtures/${fixtureId}`)),
};

/**
 * Live analysis endpoints
 */
export const liveAPI = {
  getLiveAnalysis: (fixtureId) =>
    withSupabaseErrorHandling(() => fetchWithAuth(`/live-analysis/${fixtureId}`), 5000),
};

/**
 * Direct Supabase query helpers (for frontend-only reads)
 */
export const supabaseQueries = {
  getLeagues: async () => {
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  getTeams: async (leagueId) => {
    const query = supabase.from('teams').select('*');
    if (leagueId) {
      query.eq('league_id', leagueId);
    }
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data;
  },

  getFixtures: async (filters = {}) => {
    let query = supabase.from('fixtures').select('*');
    if (filters.leagueId) {
      query = query.eq('league_id', filters.leagueId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.afterDate) {
      query = query.gte('kickoff_time', filters.afterDate);
    }
    const { data, error } = await query.order('kickoff_time', { ascending: true });
    if (error) throw error;
    return data;
  },

  getPredictions: async (fixtureId) => {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('fixture_id', fixtureId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  getMarketData: async (fixtureId) => {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('fixture_id', fixtureId)
      .order('market_time', { ascending: false });
    if (error) throw error;
    return data;
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select();
    if (error) throw error;
    return data;
  },
};
