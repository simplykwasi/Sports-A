import { Link } from 'react-router-dom'

import LeagueCrest from '../ui/LeagueCrest'
import TeamCrest from '../ui/TeamCrest'

function TeamPill({ name, logoUrl }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-1"
          loading="lazy"
        />
      ) : (
        <TeamCrest team={{ name }} size="md" />
      )}
      <p className="truncate font-display text-base font-semibold text-white md:text-lg">{name}</p>
    </div>
  )
}

function MatchListCard({ match, poissonSummary }) {
  const homeName = match.home_team_name ?? match.home?.name ?? match.home ?? 'Home'
  const awayName = match.away_team_name ?? match.away?.name ?? match.away ?? 'Away'
  const homeLogoUrl = match.home_logo_url ?? match.raw_payload?.teams?.home?.logo ?? match.home?.logo
  const awayLogoUrl = match.away_logo_url ?? match.raw_payload?.teams?.away?.logo ?? match.away?.logo
  const league = match.league_name ?? match.league ?? 'League'
  const kickoff = match.kickoff_time
    ? new Date(match.kickoff_time).toLocaleString()
    : match.kickoff ?? 'Kickoff TBA'
  const venue = match.venue ?? 'Venue TBA'
  const statusShort = match.status_short ?? match.status ?? 'TBD'
  const hasScore = match.home_score != null || match.away_score != null
  const homeScore = match.home_score ?? 0
  const awayScore = match.away_score ?? 0

  return (
    <Link
      to={`/match/${match.id}`}
      className="block w-full rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-left shadow-lg shadow-black/10 transition hover:border-brand-300/40 hover:bg-slate-900 md:p-5"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              <LeagueCrest league={league} size="sm" />
            </div>
            <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
              {league}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {kickoff} - {venue}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] md:items-center">
          <TeamPill name={homeName} logoUrl={homeLogoUrl} />
          <div className="rounded-2xl border border-white/10 bg-ink-950 px-4 py-3 text-center">
            <p className="font-display text-2xl font-bold text-white">
              {hasScore ? `${homeScore} - ${awayScore}` : 'vs'}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              {statusShort}
            </p>
          </div>
          <TeamPill name={awayName} logoUrl={awayLogoUrl} />
          {match.elapsed != null ? (
            <span className="justify-self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 md:justify-self-end">
              {match.elapsed}'
            </span>
          ) : null}
        </div>
      </div>

      {poissonSummary ? (
        <div className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-300 md:text-sm">
          <p className="font-semibold text-brand-300">
            Poisson lambda {poissonSummary.lambdaHome.toFixed(2)}-{poissonSummary.lambdaAway.toFixed(2)}
          </p>
          <p className="mt-2 leading-relaxed text-slate-400">
            1X2:{' '}
            <span className="text-slate-200">
              Home {(poissonSummary.homeWin * 100).toFixed(1)}% - Draw{' '}
              {(poissonSummary.draw * 100).toFixed(1)}% - Away{' '}
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
