import { Link } from 'react-router-dom'

import TeamCrest from '../ui/TeamCrest'
import LeagueCrest from '../ui/LeagueCrest'

// Small team display used inside the match list card.
function TeamPill({ team }) {
  return (
    <div className="flex items-center gap-3">
      <TeamCrest team={team} size="md" />
      <p className="font-display text-lg font-semibold text-white">{team.name}</p>
    </div>
  )
}

// Clickable match card that routes to the full match details page.
function MatchListCard({ match, poissonSummary }) {
  return (
    <Link
      to={`/matches/${match.id}`}
      className="glass-panel block w-full p-4 text-left transition hover:border-brand-300/40 hover:bg-brand-400/8 md:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              <LeagueCrest league={match.league} size="sm" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
              {match.league}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {match.kickoff} · {match.venue}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <TeamPill team={match.home} />
          <p className="text-center font-display text-xl font-bold text-brand-300">vs</p>
          <TeamPill team={match.away} />
        </div>
      </div>

      {poissonSummary ? (
        <div className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-300 md:text-sm">
          <p className="font-semibold text-brand-300">Poisson · λ {poissonSummary.lambdaHome.toFixed(2)}–{poissonSummary.lambdaAway.toFixed(2)}</p>
          <p className="mt-2 leading-relaxed text-slate-400">
            1X2:{' '}
            <span className="text-slate-200">
              Home {(poissonSummary.homeWin * 100).toFixed(1)}% · Draw {(poissonSummary.draw * 100).toFixed(1)}% · Away{' '}
              {(poissonSummary.awayWin * 100).toFixed(1)}%
            </span>
          </p>
          {poissonSummary.valueHint ? (
            <p className="mt-2 font-medium text-warning-400">{poissonSummary.valueHint}</p>
          ) : null}
        </div>
      ) : null}
    </Link>
  )
}

export default MatchListCard
