import { Link, Navigate, useParams } from 'react-router-dom'

import PageHero from '../components/ui/PageHero'
import TeamCrest from '../components/ui/TeamCrest'
import LeagueCrest from '../components/ui/LeagueCrest'
import { liveMatchDetailsById, matchDetailsById, matchListings, todaysMatches } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'

function TeamHeader({ team, side }) {
  return (
    <div
      className={[
        'flex items-center gap-2 sm:gap-3',
        side === 'right' ? 'justify-end text-right' : 'justify-start',
      ].join(' ')}
    >
      {side === 'right' ? (
        <>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-white sm:text-xl md:text-2xl">
              {team.name}
            </p>
            <p className="text-xs text-slate-300 sm:text-sm">{team.shortName}</p>
          </div>
          <TeamCrest team={team} size="lg" />
        </>
      ) : (
        <>
          <TeamCrest team={team} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-white sm:text-xl md:text-2xl">
              {team.name}
            </p>
            <p className="text-xs text-slate-300 sm:text-sm">{team.shortName}</p>
          </div>
        </>
      )}
    </div>
  )
}

function SectionLabel({ title, helper }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">{title}</p>
      {helper ? <p className="text-xs text-slate-400 sm:text-sm">{helper}</p> : null}
    </div>
  )
}

function getFallbackMatchDetails(match) {
  return {
    headline: `Preview of ${match.home.name} vs ${match.away.name}`,
    recommendedBet: 'Review the matchup first',
    confidence: 'Preview available',
    homeForm: ['Recent form unavailable'],
    awayForm: ['Recent form unavailable'],
    stats: [
      { label: 'Home team', value: `${match.home.name} vs ` },
      { label: 'Away team', value: `${match.away.name} vs ` },
      { label: 'Kickoff', value: match.kickoff || 'TBA' },
    ],
    standings: [
      { team: match.home.name, points: '-', form: 'N/A' },
      { team: match.away.name, points: '-', form: 'N/A' },
    ],
    teamDetails: [
      { title: match.home.name, body: 'Team-level data not available for this preview.' },
      { title: match.away.name, body: 'Team-level data not available for this preview.' },
    ],
    odds: [],
    valueBets: [],
    overUnder: [],
    livePrediction: {
      headline: 'No live prediction available for this fixture.',
      recommendedBet: 'Monitor the match for updates',
      confidence: 'N/A',
    },
  }
}

function LiveMatchDetails({ match, details, hasAccount }) {
  const statRows = details.stats.map((stat) => ({
    label: stat.label,
    leftValue: stat.home,
    rightValue: stat.away,
  }))

  return (
    <section className="border border-white/10 bg-white/4 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
      {/* Edit the live match header here. */}
      <div className="border-b border-white/10 pb-5 sm:pb-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Live {details.minute}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
              {details.matchType}
            </span>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            {details.venue} • Referee: {details.referee}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
          <TeamHeader team={match.home} side="left" />
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-brand-300 sm:text-4xl">
              {details.score.home} - {details.score.away}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400 sm:text-sm">
              Current score
            </p>
          </div>
          <TeamHeader team={match.away} side="right" />
        </div>
      </div>

      {/* Edit scorers and event timeline here. */}
      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Goals" helper="Players who scored" />
        <div className="grid gap-3 sm:grid-cols-2">
          {details.scorers.map((item) => (
            <div key={`${item.minute}-${item.player}`} className="border border-white/8 bg-slate-950/40 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-300">{item.minute}</p>
              <p className="mt-2 font-semibold text-white">{item.player}</p>
              <p className="text-sm text-slate-300">{item.team}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Timeline" helper="Live match events" />
        <div className="grid gap-3">
          {details.timeline.map((item) => (
            <div
              key={`${item.minute}-${item.type}-${item.team}`}
              className="grid grid-cols-[auto_1fr] gap-3 border-b border-white/6 py-3"
            >
              <p className="font-display text-sm font-bold text-brand-300 sm:text-base">{item.minute}</p>
              <div>
                <p className="text-sm font-semibold text-white">
                  {item.type} • {item.team}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit match info, lineups, and live statistics here. */}
      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Match info" helper="Competition and venue details" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-white/8 bg-slate-950/40 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Match type</p>
            <p className="mt-2 font-semibold text-white">{details.matchType}</p>
          </div>
          <div className="border border-white/8 bg-slate-950/40 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">League</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="shrink-0">
                <LeagueCrest league={match.league} size="sm" />
              </div>
              <p className="font-semibold text-white">{match.league}</p>
            </div>
          </div>
          <div className="border border-white/8 bg-slate-950/40 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Location</p>
            <p className="mt-2 font-semibold text-white">{details.venue}</p>
          </div>
          <div className="border border-white/8 bg-slate-950/40 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Referee</p>
            <p className="mt-2 font-semibold text-white">{details.referee}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Lineups and formation" helper="Starting teams" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              {match.home.name} • {details.homeTeam.formation}
            </p>
            <div className="mt-3 grid gap-2">
              {details.homeTeam.lineup.map((player) => (
                <div key={player} className="border-b border-white/6 py-2 text-sm text-slate-200">
                  {player}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300 xl:text-right">
              {match.away.name} • {details.awayTeam.formation}
            </p>
            <div className="mt-3 grid gap-2">
              {details.awayTeam.lineup.map((player) => (
                <div
                  key={player}
                  className="border-b border-white/6 py-2 text-sm text-slate-200 xl:text-right"
                >
                  {player}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Statistics" helper="Live comparison" />
        <div className="grid gap-2 sm:gap-3">
          {statRows.map((stat) => (
            <div
              key={stat.label}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-white/6 py-3 sm:gap-3"
            >
              <p className="text-left font-display text-sm font-bold text-white sm:text-base md:text-lg">
                {stat.leftValue}
              </p>
              <p className="px-1 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:text-xs sm:tracking-[0.22em]">
                {stat.label}
              </p>
              <p className="text-right font-display text-sm font-bold text-white sm:text-base md:text-lg">
                {stat.rightValue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit the live prediction block here. */}
      {hasAccount ? (
        <div className="grid gap-4 pt-5 sm:pt-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Live prediction
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{details.livePrediction.headline}</p>
            <p className="mt-3 text-sm text-slate-400">{details.livePrediction.note}</p>
          </div>

          <div className="border border-brand-300/20 bg-brand-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-300">
              Likely result / live bet
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-white">
              {details.livePrediction.likelyWinner}
            </p>
            <p className="mt-2 text-sm text-slate-300">{details.livePrediction.confidence}</p>
            <p className="mt-3 text-sm font-semibold text-white">
              Recommended bet: {details.livePrediction.recommendedBet}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-5 sm:pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Live prediction
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Sign in to access live betting recommendations and predictions.
          </p>
        </div>
      )}
    </section>
  )
}

function PreMatchDetails({ match, details, hasAccount }) {
  const statRows = details.stats.map((stat) => {
    const [leftValue, rightValue] = stat.value.includes(' vs ')
      ? stat.value.split(' vs ')
      : [stat.value, stat.value]

    return { label: stat.label, leftValue, rightValue }
  })

  return (
    <section className="border border-white/10 bg-white/4 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
      {/* Edit the main pre-match comparison layout below section by section. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-white/10 pb-5 sm:gap-4 sm:pb-6">
        <TeamHeader team={match.home} side="left" />
        <p className="text-center font-display text-xl font-bold text-brand-300 sm:text-2xl">vs</p>
        <TeamHeader team={match.away} side="right" />
      </div>

      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Recent performance" helper="Last matches" />
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              {match.home.name}
            </p>
            {details.homeForm.map((item) => (
              <div key={item} className="border-b border-white/6 py-2 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>

          <div className="hidden h-full w-px bg-white/10 md:block" />

          <div className="space-y-3 text-left md:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              {match.away.name}
            </p>
            {details.awayForm.map((item) => (
              <div key={item} className="border-b border-white/6 py-2 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 py-5 sm:py-6">
        <SectionLabel title="Statistics" helper="Left vs right comparison" />
        <div className="grid gap-2 sm:gap-3">
          {statRows.map((stat) => (
            <div
              key={stat.label}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-white/6 py-3 sm:gap-3"
            >
              <p className="text-left font-display text-sm font-bold text-white sm:text-base md:text-lg">
                {stat.leftValue}
              </p>
              <p className="px-1 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:text-xs sm:tracking-[0.22em]">
                {stat.label}
              </p>
              <p className="text-right font-display text-sm font-bold text-white sm:text-base md:text-lg">
                {stat.rightValue}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 border-b border-white/10 py-5 sm:py-6 xl:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Team notes
          </p>
          <div className="grid gap-4">
            {details.teamDetails.map((team) => (
              <div key={team.title}>
                <p className="font-display text-lg font-semibold text-white">{team.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{team.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            League standings
          </p>
          <div className="grid gap-3">
            {details.standings.map((row) => (
              <div
                key={row.team}
                className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/6 py-2"
              >
                <div>
                  <p className="font-semibold text-white">{row.team}</p>
                  <p className="text-sm text-slate-300">Form: {row.form}</p>
                </div>
                <p className="font-display text-lg font-bold text-brand-300 sm:text-xl">
                  {row.points} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-b border-white/10 py-5 sm:py-6 xl:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Odds comparisons
          </p>
          <div className="grid gap-3">
            {details.odds.map((row) => (
              <div
                key={row.market}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-white/6 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <p className="text-white">{row.market}</p>
                <p className="text-sm text-slate-300">{row.bestBook}</p>
                <p className="font-display text-lg font-bold text-brand-300">{row.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Value and totals
          </p>
          <div className="grid gap-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-brand-300">Value bets</p>
              <div className="grid gap-2">
                {details.valueBets.map((bet) => (
                  <div key={bet} className="border-b border-white/6 py-2 text-sm text-white">
                    {bet}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-brand-300">
                Over/under bets
              </p>
              <div className="grid gap-2">
                {details.overUnder.map((row) => (
                  <div
                    key={row.line}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-white/6 py-2 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <p className="text-white">{row.line}</p>
                    <p className="text-sm text-slate-300">Model: {row.model}</p>
                    <p className="font-display text-lg font-bold text-brand-300">{row.market}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasAccount ? (
        <div className="grid gap-4 pt-5 sm:pt-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              System summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{details.headline}</p>
          </div>

          <div className="border border-brand-300/20 bg-brand-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-300">
              Likely winner / best pick
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-white">{details.recommendedBet}</p>
            <p className="mt-2 text-sm text-slate-300">{details.confidence}</p>
          </div>
        </div>
      ) : (
        <div className="pt-5 sm:pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            System summary
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Sign in to access betting recommendations and system picks.
          </p>
        </div>
      )}
    </section>
  )
}

function MatchDetailsPage() {
  const { id, matchId } = useParams()
  const routeMatchId = id ?? matchId
  const { hasAccount } = useAuth()

  // Edit route-level match lookup here if the source of fixtures changes later.
  const match = matchListings.find((item) => item.id === routeMatchId)
  const todayMatch = todaysMatches.find((item) => item.id === routeMatchId)

  if (!match) {
    return <Navigate to="/matches" replace />
  }

  // Match details come from mockData.js for now.
  const liveDetails = liveMatchDetailsById[match.id]
  const details = matchDetailsById[match.id] || getFallbackMatchDetails(match)
  const isLive = todayMatch?.status === 'Live' && Boolean(liveDetails)

  return (
    <div className="section-shell">
      <div className="flex items-center">
        <Link to="/matches" className="secondary-button px-4 py-2 text-sm">
          Back to matches
        </Link>
      </div>

      <PageHero
        eyebrow={
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              <LeagueCrest league={match.league} size="sm" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              {match.league}
            </p>
          </div>
        }
        title={`${match.home.name} vs ${match.away.name}`}
        description={
          isLive
            ? `Live at ${liveDetails.minute} • ${liveDetails.venue}. This page tracks the score, timeline, lineups, and a live prediction that can shift as the match changes.`
            : `${match.kickoff} • ${match.venue}. The full comparison stays on one page so users can read both teams side by side before deciding whether to follow the system bet.`
        }
      />

      {isLive ? (
        <LiveMatchDetails match={match} details={liveDetails} hasAccount={hasAccount} />
      ) : (
        <PreMatchDetails match={match} details={details} hasAccount={hasAccount} />
      )}
    </div>
  )
}

export default MatchDetailsPage
