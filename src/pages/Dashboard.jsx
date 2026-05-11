import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MatchRow from '../components/MatchRow';
import AccuracyBanner from '../components/AccuracyBanner';
import { fetchPredictions } from '../utils/api';

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [valueBets, setValueBets] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setStatusMessage('Connecting to Python Server...');
    }
    setError(null);

    try {
      setStatusMessage('Fetching predictions...');
      const rawMatches = await fetchPredictions();
      const validatedMatches = Array.isArray(rawMatches) ? rawMatches : [];
      if (!Array.isArray(rawMatches)) {
        setMatches([]);
      }
      setStatusMessage('Parsing matches...');

      const enrichedMatches = validatedMatches.map((match) => ({
        ...match,
        isValueBet: (match.confidence || 0) > 75,
      }));

      const topValueBets = enrichedMatches
        .filter((match) => match.isValueBet)
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
        .slice(0, 5);

      setMatches(enrichedMatches);
      setValueBets(topValueBets);
      console.log('Matches state:', enrichedMatches);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load live matches.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
      setStatusMessage('');
    }
  }, []);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    if (!matches.some((match) => match.status === 'LIVE')) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadData(false);
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [matches, loadData]);

  const handleMatchClick = (match) => {
    navigate(`/match/${match.id}`);
  };

  const Motion = motion;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
          <div className="text-white text-sm">{statusMessage || 'Fetching today\'s live matches...'}</div>
        </div>
      </div>
    );
  }

  const liveStatuses = new Set(['LIVE']);
  const filteredMatches = matches.filter((match) => {
    if (activeFilter === 'Live') {
      return liveStatuses.has(match.status);
    }
    return true;
  });

  return (
    <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      <Header activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveFilter('All')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeFilter === 'All' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            All Matches
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('Live')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeFilter === 'Live' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Live Matches
          </button>
        </div>

        <AccuracyBanner onViewClick={() => navigate('/accuracy')} />

        {error ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 mb-6 text-slate-100">
            <div className="font-semibold">Unable to load live data</div>
            <p className="text-sm text-slate-200">{error}</p>
          </div>
        ) : null}

        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Star className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Value Bets Today</h2>
              <p className="text-sm text-slate-500">Auto-updated from current fixtures in top leagues.</p>
            </div>
          </div>

          <div className="grid gap-3">
            {valueBets.length > 0 ? (
              valueBets.map((bet, index) => (
                <Motion.div
                  key={bet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleMatchClick(bet)}
                  className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4 hover:from-emerald-500/20 hover:to-blue-500/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-400 font-mono">{bet.time}</div>
                      <div>
                        <div className="text-white font-medium">
                          {bet.homeTeam} vs {bet.awayTeam}
                        </div>
                        <div className="text-xs text-slate-500">{bet.leagueName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-emerald-500 font-bold">{bet.prediction || 'Prediction'}</div>
                        <div className="text-xs text-slate-400">{bet.confidence}% confidence</div>
                      </div>
                      <div className="text-lg font-bold text-emerald-500">{bet.odds}</div>
                    </div>
                  </div>
                </Motion.div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-400">
                No high value bets detected in the selected leagues right now.
              </div>
            )}
          </div>
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Today's Matches</h2>
              <p className="text-sm text-slate-500">Refreshing every 60 seconds while live fixtures are active.</p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match, index) => (
                <Motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <MatchRow match={match} onClick={handleMatchClick} />
                </Motion.div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-400 text-center">
                No {activeFilter === 'Live' ? 'live' : ''} matches to display.
              </div>
            )}
          </div>
        </Motion.section>
      </main>
    </Motion.div>
  );
}

export default Dashboard;
