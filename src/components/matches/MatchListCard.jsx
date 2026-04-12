import { Link } from 'react-router-dom'

import TeamCrest from '../ui/TeamCrest'

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
function MatchListCard({ match }) {
  return (
    <Link
      to={`/matches/${match.id}`}
      className="glass-panel block w-full p-4 text-left transition hover:border-brand-300/40 hover:bg-brand-400/8 md:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
            {match.league}
          </p>
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
    </Link>
  )
}

export default MatchListCard
