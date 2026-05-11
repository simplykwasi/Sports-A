import { Radio, Zap } from 'lucide-react';

function Header({ activeFilter, onFilterChange }) {
  const isLive = activeFilter === 'Live';

  return (
    <header className="bg-slate-950 border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Sports Predictor</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onFilterChange(isLive ? 'All' : 'Live')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isLive
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            Live Now
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;