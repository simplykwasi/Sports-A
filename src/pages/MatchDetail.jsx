import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity, BarChart3, Users } from 'lucide-react';
import { fetchMatchDetails, fetchMatchStatistics, fetchHeadToHead } from '../utils/api';
import { PredictionEngine } from '../utils/predictionEngine';

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [stats, setStats] = useState(null);
  const [h2h, setH2H] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMatch() {
      try {
        setLoading(true);
        const foundMatch = await fetchMatchDetails(id);
        if (!foundMatch) {
          throw new Error('Match not found.');
        }
        setMatch(foundMatch);

        const h2hId = `${foundMatch.homeTeam}-${foundMatch.awayTeam}`;
        const [predictionResult, statsResult, headToHeadResult] = await Promise.all([
          PredictionEngine.fetchPredictions([foundMatch]),
          fetchMatchStatistics(foundMatch.id),
          fetchHeadToHead(h2hId),
        ]);

        setPrediction(predictionResult[0] ?? null);
        setStats(statsResult);
        setH2H(headToHeadResult);
      } catch (err) {
        setError(err.message || 'Unable to load match details.');
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [id]);

  const getMomentumScore = () => {
    if (!stats) {
      return { home: 50, away: 50 };
    }

    const homeForce = (stats.possession.home * 0.35) + (stats.shots.home * 1.2);
    const awayForce = (stats.possession.away * 0.35) + (stats.shots.away * 1.2);
    const total = Math.max(homeForce + awayForce, 1);

    return {
      home: Math.round((homeForce / total) * 100),
      away: Math.round((awayForce / total) * 100),
    };
  };

  const momentum = getMomentumScore();

  const renderH2HRow = (item) => {
    const scoreText = `${item.homeScore} - ${item.awayScore}`;
    const result = item.result;
    const colorClass = result === 'W' ? 'text-emerald-300' : result === 'L' ? 'text-rose-400' : 'text-slate-400';

    return (
      <div key={`${item.date}-${item.home}-${item.away}`} className="grid grid-cols-[1.5fr_1fr_0.8fr] gap-3 text-sm items-center py-3 border-b border-slate-700 last:border-b-0">
        <div className="text-slate-400">{item.date}</div>
        <div className="text-white font-medium text-center">{item.home} {scoreText} {item.away}</div>
        <div className={`text-right font-semibold ${colorClass}`}>{result}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
        <div className="text-slate-300">Loading match deep dive...</div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center text-slate-300">{error || 'Unable to find the requested match.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-10">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-emerald-500 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <div className="mt-6 rounded-[32px] border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Deep Dive</p>
              <h1 className="text-4xl font-extrabold text-white">
                {match.homeTeam} <span className="text-emerald-300">vs</span> {match.awayTeam}
              </h1>
              <p className="mt-2 text-slate-400">{match.league} • {match.time} • {match.statusShort || 'Scheduled'}</p>
            </div>
            <div className="rounded-3xl bg-slate-950 border border-slate-800 px-6 py-4 text-right">
              <div className="text-sm text-slate-400">Recommended Bet</div>
              <div className="mt-2 text-2xl font-bold text-white">{prediction?.recommendedBet ?? 'Calculated Live'}</div>
              <div className="mt-1 text-sm text-slate-500">Confidence {prediction?.confidence ?? 0}%</div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Home edge</p>
              <p className="mt-3 text-3xl font-semibold text-white">{prediction ? `${prediction.homeProbability.toFixed(0)}%` : '—'}</p>
              <p className="mt-2 text-slate-400 text-sm">{match.homeTeam} probability</p>
            </div>
            <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Draw chance</p>
              <p className="mt-3 text-3xl font-semibold text-white">{prediction ? `${prediction.drawProbability.toFixed(0)}%` : '—'}</p>
              <p className="mt-2 text-slate-400 text-sm">Game equilibrium</p>
            </div>
            <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Away edge</p>
              <p className="mt-3 text-3xl font-semibold text-white">{prediction ? `${prediction.awayProbability.toFixed(0)}%` : '—'}</p>
              <p className="mt-2 text-slate-400 text-sm">{match.awayTeam} probability</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Live Momentum</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>{match.homeTeam}</span>
                    <span>{momentum.home}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${momentum.home}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>{match.awayTeam}</span>
                    <span>{momentum.away}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${momentum.away}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-400">
                  <div className="rounded-3xl bg-slate-900 p-3">
                    <p className="font-semibold text-white">Shots</p>
                    <p className="mt-2">{stats?.shots.home ?? 0} / {stats?.shots.away ?? 0}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-3">
                    <p className="font-semibold text-white">Possession</p>
                    <p className="mt-2">{stats?.possession.home ?? 0}% / {stats?.possession.away ?? 0}%</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Standings Edge</h2>
              </div>
              <div className="space-y-3 text-sm text-slate-400">
                <p>Home side is trending stronger in possession and finishing in the deeper third.</p>
                <p>Away team has displayed tighter defense, but may struggle to convert on the road.</p>
                <p>Our model favors the {prediction?.recommendedBet ?? 'top market'} with a lean toward higher-probability outcomes.</p>
              </div>
            </section>
          </div>

          <section className="mt-10 rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-5">
              <Users className="w-5 h-5 text-slate-200" />
              <h2 className="text-lg font-semibold text-white">Head-to-Head</h2>
            </div>
            {h2h.length > 0 ? (
              <div className="rounded-3xl bg-slate-900 p-4">
                {h2h.map(renderH2HRow)}
              </div>
            ) : (
              <div className="text-slate-400">No recent head-to-head history available.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default MatchDetail;
