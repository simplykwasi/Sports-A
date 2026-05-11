import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { PredictionEngine } from '../utils/predictionEngine';

function AccuracyBanner({ onViewClick }) {
  const [accuracyData, setAccuracyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAccuracy = async () => {
      try {
        setLoading(true);
        const data = await PredictionEngine.fetchAccuracy();
        setAccuracyData(data);
      } catch (err) {
        console.error('Failed to load yesterday accuracy:', err);
        setError('Failed to load yesterday accuracy.');
      } finally {
        setLoading(false);
      }
    };

    loadAccuracy();
  }, []);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 mb-6 text-slate-100">
        <div className="font-semibold">Error loading accuracy</div>
        <p className="text-sm text-slate-200">{error}</p>
      </div>
    );
  }

  if (!accuracyData || accuracyData.totalMatches === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 mb-6 text-slate-400 text-center">
        No finished matches from yesterday in top leagues to calculate accuracy.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Trophy className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Yesterday's Hit Rate: {accuracyData.hitRate}%</h2>
          <p className="text-sm text-slate-500">({accuracyData.hitCount}/{accuracyData.totalMatches}) successful predictions</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onViewClick}
        className="inline-flex items-center justify-center rounded-full bg-slate-950 border border-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-500"
      >
        View
      </button>
    </div>
  );
}

export default AccuracyBanner;
