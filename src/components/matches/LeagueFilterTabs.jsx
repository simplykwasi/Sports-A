// League selector shown above the match list.
import LeagueCrest from '../ui/LeagueCrest'

function LeagueFilterTabs({ leagues, activeLeague, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {leagues.map((league) => (
        <button
          key={league}
          type="button"
          onClick={() => onSelect(league)}
          className={[
            'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition',
            league === activeLeague
              ? 'bg-brand-400 text-ink-950'
              : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
          ].join(' ')}
        >
          {league !== 'All leagues' && league !== 'Live' && (
            <div className="flex-shrink-0">
              <LeagueCrest league={league} size="sm" />
            </div>
          )}
          {league}
        </button>
      ))}
    </div>
  )
}

export default LeagueFilterTabs
