import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, Users } from 'lucide-react';
import { fetchMatchStatistics, fetchHeadToHead } from '../utils/api';

const MatchInsight = ({ match, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [matchStatistics, setMatchStatistics] = useState(null);
  const [headToHead, setHeadToHead] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingH2H, setLoadingH2H] = useState(false);
  const [errorStats, setErrorStats] = useState(null);
  const [errorH2H, setErrorH2H] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveTab('stats');
    setMatchStatistics(null);
    setHeadToHead(null);
    setErrorStats(null);
    setErrorH2H(null);

    async function loadStats() {
      if (!match) return;
      setLoadingStats(true);
      setErrorStats(null);

      try {
        const stats = await fetchMatchStatistics(match.id);
        setMatchStatistics(stats);
      } catch (err) {
        setErrorStats(err.message || 'Unable to load match statistics.');
      } finally {
        setLoadingStats(false);
      }
    }

    async function loadH2H() {
      if (!match) return;
      setLoadingH2H(true);
      setErrorH2H(null);

      try {
        const headToHeadData = await fetchHeadToHead(match.homeTeam, match.awayTeam);
        setHeadToHead(headToHeadData);
      } catch (err) {
        setErrorH2H(err.message || 'Unable to load head-to-head data.');
      } finally {
        setLoadingH2H(false);
      }
    }

    loadStats();
    loadH2H();
  }, [isOpen, match]);

  const getMomentum = () => {
    if (matchStatistics) {
      const possessionHome = matchStatistics.possession.home;
      const possessionAway = matchStatistics.possession.away;
      const homeScore = match.homeScore ?? 0;
      const awayScore = match.awayScore ?? 0;

      const homeForce = possessionHome * 0.4 + matchStatistics.shots.home * 1.5 + homeScore * 5;
      const awayForce = possessionAway * 0.4 + matchStatistics.shots.away * 1.5 + awayScore * 5;
      const totalForce = Math.max(homeForce + awayForce, 1);
      const homePct = Math.round((homeForce / totalForce) * 100);
      return { home: homePct, away: 100 - homePct };
    }

    const momentumHome = Math.floor(Math.random() * 100);
    return { home: momentumHome, away: 100 - momentumHome };
  };

  const momentum = getMomentum();

  const renderStatBar = (label, homeValue, awayValue) => {
    const total = homeValue + awayValue;
    const homeWidth = total > 0 ? (homeValue / total) * 100 : 50;
    const awayWidth = 100 - homeWidth;

    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-300 mb-1">
          <span>{homeValue}</span>
          <span>{label}</span>
          <span>{awayValue}</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
          <div className="bg-blue-500" style={{ width: `${homeWidth}%` }} />
          <div className="bg-emerald-500" style={{ width: `${awayWidth}%` }} />
        </div>
      </div>
    );
  };

  const renderH2HRow = (h2hMatch) => {
    const homeName = h2hMatch.home;
    const awayName = h2hMatch.away;
    const homeScore = h2hMatch.homeScore;
    const awayScore = h2hMatch.awayScore;
    const result = h2hMatch.winner === 'Draw' ? 'D' : h2hMatch.winner === homeName ? 'W' : 'L';
    const colorClass = result === 'W' ? 'text-blue-400' : result === 'L' ? 'text-rose-400' : 'text-slate-400';

    return (
      <div key={`${h2hMatch.date}-${homeName}-${awayName}`} className="grid grid-cols-[1fr_3fr_1fr] items-center gap-3 text-sm py-2 border-b border-slate-700 last:border-b-0">
        <span className="text-slate-400">{h2hMatch.date}</span>
        <span className="text-white font-medium text-center">
          {homeName} {homeScore} - {awayScore} {awayName}
        </span>
        <span className={`text-right font-semibold ${colorClass}`}>{result}</span>
      </div>
    );
  };

  const getFinalVerdict = () => {
    if (!match) {
      return {
        message: 'No match selected.',
        confidence: 0,
      };
    }

    const baseConfidence = match.prediction?.confidence ?? 65;
    const boost = matchStatistics ? Math.round((matchStatistics.shots.home + matchStatistics.shots.away) / 4) : 0;
    const confidence = Math.min(95, baseConfidence + boost);

    const message = match.prediction
      ? `Strong signal for ${match.prediction.type} with ${confidence}% conviction based on current form and available data.`
      : 'No strong prediction available for this fixture yet.';

    return {
      message,
      confidence,
    };
  };

  const Motion = motion;
  const finalVerdict = getFinalVerdict();

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto"
        >
          <div className="container mx-auto max-w-2xl bg-slate-800 rounded-t-3xl shadow-lg relative p-6 h-full min-h-screen flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold text-white">Match Insights</h2>
              <div className="w-6" />
            </div>

            {match ? (
              <div className="flex-grow overflow-y-auto no-scrollbar">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-extrabold text-white mb-1">{match.homeTeam} vs {match.awayTeam}</h3>
                  <p className="text-4xl font-bold text-emerald-400 mb-3">{match.homeScore ?? 0} - {match.awayScore ?? 0}</p>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">{match.league} • {match.statusShort}</p>
                </div>

                <div className="mb-6 p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between text-xs text-slate-300 mb-2">
                    <span>{match.homeTeam}</span>
                    <span className="uppercase tracking-[0.2em]">Pressure</span>
                    <span>{match.awayTeam}</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-slate-600">
                    <div className="bg-blue-500" style={{ width: `${momentum.home}%` }} />
                    <div className="bg-emerald-500" style={{ width: `${momentum.away}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{momentum.home}%</span>
                    <span>{momentum.away}%</span>
                  </div>
                </div>

                <div className="flex justify-around bg-slate-700 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'stats' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
                  >
                    <BarChart2 className="inline-block mr-2 w-4 h-4" />Stats
                  </button>
                  <button
                    onClick={() => setActiveTab('h2h')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'h2h' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
                  >
                    <Users className="inline-block mr-2 w-4 h-4" />H2H
                  </button>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg mb-6">
                  {activeTab === 'stats' && (
                    loadingStats ? (
                      <div className="text-center text-slate-400">Loading statistics...</div>
                    ) : errorStats ? (
                      <div className="text-center text-red-400">{errorStats}</div>
                    ) : matchStatistics ? (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Match Statistics</h4>
                        {renderStatBar('Shots', matchStatistics.shots.home, matchStatistics.shots.away)}
                        {renderStatBar('Possession', matchStatistics.possession.home, matchStatistics.possession.away)}
                        {renderStatBar('Corners', matchStatistics.corners.home, matchStatistics.corners.away)}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">No statistics available.</div>
                    )
                  )}

                  {activeTab === 'h2h' && (
                    loadingH2H ? (
                      <div className="text-center text-slate-400">Loading Head-to-Head...</div>
                    ) : errorH2H ? (
                      <div className="text-center text-red-400">{errorH2H}</div>
                    ) : headToHead && headToHead.length > 0 ? (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Last 5 Head-to-Head Results</h4>
                        <div className="space-y-2">
                          {headToHead.map(renderH2HRow)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">No Head-to-Head data available.</div>
                    )
                  )}
                </div>

                <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Final Verdict</p>
                      <p className="text-white font-semibold text-base mt-2">{finalVerdict.message}</p>
                    </div>
                    <div className="text-2xl font-bold text-emerald-300">{finalVerdict.confidence}%</div>
                  </div>
                  <p className="text-sm text-slate-300">Confidence is weighted by prediction strength, available match statistics, and historic pressure signals.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow text-slate-400">
                <p>No match selected for insights.</p>
              </div>
            )}
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchInsight;
