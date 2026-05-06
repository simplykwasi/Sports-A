import { useEffect, useState, useCallback, useRef } from 'react';
import { supabaseQueries } from '../services/api.service';

/**
 * Custom hook for fetching and caching sports data (leagues, teams, matches)
 * Includes value bet detection logic
 */
export function useSportsData(options = {}) {
  const { leagueId = null, status = null, autoRefresh = false, refreshInterval = 30000 } = options;

  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [valueBets, setValueBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef({ leagues: null, teams: null, fixtures: null });

  /**
   * Detect value bets where AI probability > bookmaker implied probability by >= 5%
   */
  const detectValueBets = useCallback((fixturesWithPredictions) => {
    return fixturesWithPredictions
      .filter((fixture) => {
        if (!fixture.predictions) return false;

        const pred = fixture.predictions;
        const bookyProb = {
          home: pred.bookie_home_prob || 0,
          draw: pred.bookie_draw_prob || 0,
          away: pred.bookie_away_prob || 0,
        };

        const aiProb = {
          home: pred.predicted_home_prob || 0,
          draw: pred.predicted_draw_prob || 0,
          away: pred.predicted_away_prob || 0,
        };

        const deltas = {
          home: aiProb.home - bookyProb.home,
          draw: aiProb.draw - bookyProb.draw,
          away: aiProb.away - bookyProb.away,
        };

        return Object.values(deltas).some((delta) => Math.abs(delta) >= 0.05);
      })
      .map((fixture) => ({
        fixtureId: fixture.fixture_id,
        homeTeam: fixture.home_team,
        awayTeam: fixture.away_team,
        kickoff: fixture.kickoff_time,
        predictions: fixture.predictions,
        valueDelta: Math.max(
          Math.abs(fixture.predictions.predicted_home_prob - fixture.predictions.bookie_home_prob),
          Math.abs(fixture.predictions.predicted_draw_prob - fixture.predictions.bookie_draw_prob),
          Math.abs(fixture.predictions.predicted_away_prob - fixture.predictions.bookie_away_prob)
        ),
      }));
  }, []);

  /**
   * Fetch all data
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch leagues
      if (!cacheRef.current.leagues) {
        const leaguesData = await supabaseQueries.getLeagues();
        setLeagues(leaguesData);
        cacheRef.current.leagues = leaguesData;
      } else {
        setLeagues(cacheRef.current.leagues);
      }

      // Fetch teams
      if (!cacheRef.current.teams) {
        const teamsData = await supabaseQueries.getTeams(leagueId);
        setTeams(teamsData);
        cacheRef.current.teams = teamsData;
      } else {
        setTeams(cacheRef.current.teams);
      }

      // Fetch fixtures
      const filters = { leagueId, status, afterDate: new Date().toISOString() };
      const fixturesData = await supabaseQueries.getFixtures(filters);

      // Enrich with predictions
      const enriched = await Promise.all(
        fixturesData.map(async (fixture) => {
          const predictions = await supabaseQueries.getPredictions(fixture.fixture_id);
          return { ...fixture, predictions };
        })
      );

      setFixtures(enriched);
      cacheRef.current.fixtures = enriched;

      // Detect value bets
      const valueBetsDetected = detectValueBets(enriched);
      setValueBets(valueBetsDetected);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch sports data:', err);
    } finally {
      setLoading(false);
    }
  }, [leagueId, status, detectValueBets]);

  /**
   * Initial fetch and auto-refresh
   */
  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh, refreshInterval]);

  /**
   * Clear cache if league changes
   */
  useEffect(() => {
    if (leagueId !== null) {
      cacheRef.current.teams = null;
      cacheRef.current.fixtures = null;
    }
  }, [leagueId]);

  return {
    leagues,
    teams,
    fixtures,
    valueBets,
    loading,
    error,
    refetch: fetchData,
  };
}
