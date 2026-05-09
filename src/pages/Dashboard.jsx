import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Star } from 'lucide-react';
import Header from '../components/Header';
import MatchRow from '../components/MatchRow';
import MatchDetails from '../components/MatchDetails';
import { api } from '../utils/api';

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [valueBets, setValueBets] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [matchesData, valueBetsData] = await Promise.all([
        api.getTodaysMatches(),
        api.getTopValueBets()
      ]);
      setMatches(matchesData);
      setValueBets(valueBetsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Top Value Bets Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Star className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Top Value Bets Today</h2>
          </div>

          <div className="grid gap-3">
            {valueBets.map((bet, index) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleMatchClick(bet)}
                className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4 hover:from-emerald-500/20 hover:to-blue-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
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
                      <div className="text-emerald-500 font-bold">{bet.prediction.type}</div>
                      <div className="text-xs text-slate-400">{bet.prediction.confidence}% confidence</div>
                    </div>
                    <div className="text-lg font-bold text-emerald-500">{bet.odds}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* All Matches Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Today's Matches</h2>
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