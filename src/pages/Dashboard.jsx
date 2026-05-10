import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Star } from 'lucide-react';
import Header from '../components/Header';
import MatchRow from '../components/MatchRow';
import MatchDetails from '../components/MatchDetails';
import { fetchDailyMatches } from '../utils/api';
import { PredictionEngine } from '../utils/predictionEngine';

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [valueBets, setValueBets] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const rawMatches = await fetchDailyMatches();
      const enrichedMatches = rawMatches.map((match) => {
        const prediction = PredictionEngine.analyzeMatch(match);
        return {
          ...match,
          prediction,
          isValueBet: prediction ? PredictionEngine.isValueBet(prediction, match.odds) : false,
        };
      });

      const topValueBets = enrichedMatches
        .filter((match) => match.isValueBet)
        .sort((a, b) => b.prediction.confidence - a.prediction.confidence)
        .slice(0, 5);

      setMatches(enrichedMatches);
      setValueBets(topValueBets);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load live matches.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    if (!matches.some((match) => match.status === 'live')) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadData(false);
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [matches, loadData]);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedMatch(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
          <div className="text-white text-sm">Fetching today's live matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {error ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 mb-6 text-slate-100">
            <div className="font-semibold">Unable to load live data</div>
            <p className="text-sm text-slate-200">{error}</p>
          </div>
        ) : null}

        <motion.section
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
                <motion.div
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
                        <div className="text-xs text-slate-500">{bet.league}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-emerald-500 font-bold">{bet.prediction?.type || 'Prediction'}</div>
                        <div className="text-xs text-slate-400">{bet.prediction?.confidence}% confidence</div>
                      </div>
                      <div className="text-lg font-bold text-emerald-500">{bet.odds}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-400">
                No high value bets detected in the selected leagues right now.
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
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
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <MatchRow match={match} onClick={handleMatchClick} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <MatchDetails
        match={selectedMatch}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}

export default Dashboard;
