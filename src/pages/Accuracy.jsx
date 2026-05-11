import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { PredictionEngine } from '../utils/predictionEngine';

function Accuracy() {
  const navigate = useNavigate();
  const [accuracyData, setAccuracyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAccuracy() {
      try {
        setLoading(true);
        const data = await PredictionEngine.fetchAccuracy();
        setAccuracyData(data);
      } catch (err) {
        setError(err.message || 'Unable to load accuracy history.');
        setAccuracyData({ hitRate: 0, hitCount: 0, totalMatches: 0, details: [] });
      } finally {
        setLoading(false);
      }
    }

    loadAccuracy();
  }, []);

  const renderResult = (result) => {
    if (result) {
      return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
    return <XCircle className="w-5 h-5 text-rose-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-emerald-500 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mt-8 rounded-[32px] border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Yesterday</p>
              <h1 className="text-5xl font-extrabold text-white">
                {accuracyData ? `${accuracyData.hitRate}% Win Rate` : 'Loading...'}
              </h1>
              <p className="mt-3 text-slate-400">Yesterday's top league fixtures and prediction performance.</p>
            </div>
            <div className="rounded-3xl bg-slate-950 border border-slate-800 px-6 py-4 text-right">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Hit Rate</p>
              <p className="mt-2 text-3xl font-semibold text-white">{accuracyData ? `${accuracyData.hitRate}%` : '—'}</p>
              <p className="mt-1 text-slate-400 text-sm">{accuracyData ? `${accuracyData.hitCount}/${accuracyData.totalMatches} predictions` : 'Loading data'}</p>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-4">
            {loading ? (
              <div className="text-slate-300">Loading yesterday's analysis...</div>
            ) : error ? (
              <div className="text-rose-400">{error}</div>
            ) : accuracyData?.details.length > 0 ? (
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 pr-6">Match</th>
                    <th className="py-3 pr-6">Final Score</th>
                    <th className="py-3 pr-6">Pre-match</th>
                    <th className="py-3 pr-6">Live prediction</th>
                    <th className="py-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {accuracyData.details.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900 transition-colors">
                      <td className="py-4 pr-6 text-white font-medium">{item.homeTeam} vs {item.awayTeam}</td>
                      <td className="py-4 pr-6">{item.finalScore}</td>
                      <td className="py-4 pr-6 text-slate-200">{item.preMatchPrediction}</td>
                      <td className="py-4 pr-6 text-slate-200">{item.livePrediction}</td>
                      <td className="py-4">{renderResult(item.result)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-6 text-slate-400">No accuracy details are available for yesterday's fixtures.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accuracy;
