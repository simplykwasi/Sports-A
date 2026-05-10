import { Clock, TrendingUp, Target } from 'lucide-react';

function MatchRow({ match, onClick }) {
  const isLive = match.status === 'live';
  const isValueBet = match.isValueBet;

  const getPredictionIcon = (type) => {
    switch (type) {
      case 'Over 2.5 Goals':
        return <Target className="w-4 h-4" />;
      case 'Under 2.5 Goals':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getPredictionColor = (type) => {
    if (isValueBet) return 'bg-emerald-500';
    return 'bg-blue-500';
  };

  return (
    <div
      onClick={() => onClick(match)}
      className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        {/* Time & Status */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isLive ? 'text-amber-500' : 'text-slate-400'
          }`}>
            <Clock className="w-4 h-4" />
            {match.time}
            {isLive && <span className="ml-1 text-xs">LIVE</span>}
          </div>

          {/* Teams */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-white font-medium">
              <span className="truncate">{match.homeTeam}</span>
              <span className="text-slate-500">vs</span>
              <span className="truncate">{match.awayTeam}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{match.league}</div>
          </div>
        </div>

        {/* Score (if live) */}
        {isLive && (
          <div className="flex items-center gap-2 text-lg font-bold text-white mx-4">
            <span className="text-amber-500">{match.homeScore}</span>
            <span className="text-slate-500">-</span>
            <span className="text-amber-500">{match.awayScore}</span>
          </div>
        )}

        {/* Prediction Badge */}
        {match.prediction && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium ${getPredictionColor(match.prediction.type)}`}>
            {getPredictionIcon(match.prediction.type)}
            <span className="hidden sm:inline">{match.prediction.type}</span>
            <span className="text-xs opacity-90">{match.prediction.confidence}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchRow;
