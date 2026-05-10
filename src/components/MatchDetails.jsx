import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, Users, Calendar } from 'lucide-react';

function MatchDetails({ match, isOpen, onClose }) {
  if (!match) return null;

  const slideUpVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const getPredictionIcon = (type) => {
    switch (type) {
      case 'Over 2.5 Goals':
        return <Target className="w-5 h-5" />;
      case 'Under 2.5 Goals':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getPredictionColor = () => {
    if (match.isValueBet) return 'text-emerald-500';
    return 'text-blue-500';
  };

  const Motion = motion;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <Motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-2xl z-50 max-h-[80vh] overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {match.homeTeam} vs {match.awayTeam}
                  </h2>
                  <p className="text-slate-400 text-sm">{match.league} • {match.time}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Live Score */}
              {match.status === 'live' && (
                <div className="bg-slate-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-500">{match.homeScore}</div>
                      <div className="text-sm text-slate-400">{match.homeTeam}</div>
                    </div>
                    <div className="text-amber-500 font-bold">-</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-500">{match.awayScore}</div>
                      <div className="text-sm text-slate-400">{match.awayTeam}</div>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-slate-900 text-xs font-medium rounded-full">
                      LIVE
                    </span>
                  </div>
                </div>
              )}

              {/* Prediction */}
              {match.prediction && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${match.isValueBet ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                      <div className={getPredictionColor(match.prediction.type)}>
                        {getPredictionIcon(match.prediction.type)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{match.prediction.type}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getPredictionColor(match.prediction.type)}`}>
                          {match.prediction.confidence}% Confidence
                        </span>
                        {match.isValueBet && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-slate-900 text-xs font-medium rounded-full">
                            VALUE BET
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Analysis
                    </h4>
                    <div className="space-y-2">
                      {match.prediction.reasoning.map((reason, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-slate-300">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Form Placeholder */}
              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4" />
                  Recent Form
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">{match.homeTeam}</div>
                    <div className="flex gap-1 justify-center">
                      {['W', 'W', 'D', 'W', 'L'].map((result, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                            result === 'W' ? 'bg-green-500 text-white' :
                            result === 'D' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">{match.awayTeam}</div>
                    <div className="flex gap-1 justify-center">
                      {['L', 'W', 'W', 'D', 'W'].map((result, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                            result === 'W' ? 'bg-green-500 text-white' :
                            result === 'D' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MatchDetails;