import React, { useState, useEffect } from 'react';
import { fetchYesterdayFixtures } from '../utils/api';
import { PredictionEngine } from '../utils/predictionEngine';
import { Trophy } from 'lucide-react';

function AccuracyBanner() {
  const [accuracy, setAccuracy] = useState(null);
  const [totalBets, setTotalBets] = useState(0);
  const [hitBets, setHitBets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateAccuracy = async () => {
      try {
        setLoading(true);
        const yesterdayMatches = await fetchYesterdayFixtures();
        let hits = 0;
        let total = 0;

        for (const match of yesterdayMatches) {
          const prediction = PredictionEngine.analyzeMatch(match);

          if (prediction) {
            total++;
            const homeScore = match.homeScore;
            const awayScore = match.awayScore;
            const totalGoals = homeScore + awayScore;

            let isHit = false;
            switch (prediction.type) {
              case "Over 2.5 Goals":
                isHit = totalGoals > 2.5;
                break;
              case "Under 2.5 Goals":
                isHit = totalGoals < 2.5;
                break;
              case "Home Win":
                isHit = homeScore > awayScore;
                break;
              case "Away Win":
                isHit = awayScore > homeScore;
                break;
              case "Both Teams To Score":
                isHit = homeScore > 0 && awayScore > 0;
                break;
              default:
                // For any other prediction type, we might need more specific logic
                isHit = false; 
                break;
            }
            if (isHit) {
              hits++;
            }
          }
        }
        setTotalBets(total);
        setHitBets(hits);
        if (total > 0) {
          setAccuracy(Math.round((hits / total) * 100));
        } else {
          setAccuracy(0);
        }
      } catch (err) {
        console.error("Failed to fetch yesterday's fixtures or calculate accuracy:", err);
        setError("Failed to load yesterday's accuracy.");
      } finally {
        setLoading(false);
      }
    };

    calculateAccuracy();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 mb-6 text-slate-100">
        <div className="font-semibold">Error loading accuracy</div>
        <p className="text-sm text-slate-200">{error}</p>
      </div>
    );
  }

  if (totalBets === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 mb-6 text-slate-400 text-center">
        No finished matches from yesterday in top leagues to calculate accuracy.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 mb-6 flex items-center gap-3">
      <div className="p-2 bg-emerald-500/20 rounded-lg">
        <Trophy className="w-5 h-5 text-emerald-500" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Yesterday's Hit Rate: {accuracy}%</h2>
        <p className="text-sm text-slate-500">({hitBets}/{totalBets}) successful predictions from yesterday's top league matches.</p>
      </div>
    </div>
  );
}

export default AccuracyBanner;
