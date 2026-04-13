// Compact match summary card used on overview pages.
import LeagueCrest from './LeagueCrest'

function MatchCard({ match }) {
  return (
    <article className="glass-panel p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <LeagueCrest league={match.league} size="sm" />
          </div>
          <span>{match.league}</span>
        </div>
        <span>{match.kickoff}</span>
      </div>
      <h3 className="font-display text-2xl font-semibold text-white">
        {match.home} vs {match.away}
      </h3>
      <dl className="mt-5 grid gap-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.22em] text-slate-400">Prediction</dt>
          <dd className="mt-2 text-base font-semibold text-white">{match.prediction}</dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-[0.22em] text-slate-400">Confidence</dt>
            <dd className="mt-2 font-display text-2xl font-bold text-brand-300">
              {match.confidence}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-[0.22em] text-slate-400">Value edge</dt>
            <dd className="mt-2 font-display text-2xl font-bold text-warning-400">
              {match.value}
            </dd>
          </div>
        </div>
      </dl>
    </article>
  )
}

export default MatchCard
