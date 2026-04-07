import { Link, Navigate, useParams } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { matchDetailsById, matchListings } from '../data/mockData'

function TeamHeader({ team, side }) {
  return (
    <div className={['flex items-center gap-3', side === 'right' ? 'justify-end text-right' : 'justify-start'].join(' ')}>
      {side === 'right' ? (
        <>
          <div>
            <p className="font-display text-xl font-bold text-white md:text-2xl">{team.name}</p>
            <p className="text-sm text-slate-300">{team.shortName}</p>
          </div>
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-full border font-display text-sm font-bold',
              team.crestColor,
            ].join(' ')}
          >
            {team.shortName}
          </div>
        </>
      ) : (
        <>
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-full border font-display text-sm font-bold',
              team.crestColor,
            ].join(' ')}
          >
            {team.shortName}
          </div>
          <div>
            <p className="font-display text-xl font-bold text-white md:text-2xl">{team.name}</p>
            <p className="text-sm text-slate-300">{team.shortName}</p>
          </div>
        </>
      )}
    </div>
  )
}

function MatchDetailsPage() {
  const { matchId } = useParams()

  // Route-level lookup keeps every fixture on its own shareable details page.
  const match = matchListings.find((item) => item.id === matchId)

  if (!match) {
    return <Navigate to="/matches" replace />
  }

  const details = matchDetailsById[match.id]

  return (
    <div className="section-shell">
      <div className="flex items-center">
        <Link to="/matches" className="secondary-button px-4 py-2 text-sm">
          Back to matches
        </Link>
      </div>

      <PageHero
        eyebrow={match.league}
        title={`${match.home.name} vs ${match.away.name}`}
        description={`${match.kickoff} · ${match.venue}. The full comparison stays on one page so users can read both teams side by side before deciding whether to follow the system bet.`}
      />

      {/* Main comparison sheet inspired by sportsbook head-to-head layouts. */}
      <section className="border border-white/10 bg-white/4 px-4 py-5 md:px-6 md:py-6">
        <div className="grid gap-4 border-b border-white/10 pb-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <TeamHeader team={match.home} side="left" />
          <p className="text-center font-display text-2xl font-bold text-brand-300">vs</p>
          <TeamHeader team={match.away} side="right" />
        </div>

        <div className="grid gap-4 border-b border-white/10 py-6 xl:grid-cols-[1fr_auto_1fr] xl:items-start">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              {match.home.name} recent matches
            </p>
            {details.homeForm.map((item) => (
              <div key={item} className="border-b border-white/6 py-2 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>

          <div className="hidden xl:block h-full w-px bg-white/10" />

          <div className="space-y-3 text-left xl:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              {match.away.name} recent matches
            </p>
            {details.awayForm.map((item) => (
              <div key={item} className="border-b border-white/6 py-2 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-white/10 py-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Head-to-head statistics
            </p>
            <p className="text-sm text-slate-400">Compare both sides quickly</p>
          </div>

          <div className="grid gap-3">
            {details.stats.map((stat) => (
              <div
                key={stat.label}
                className="grid items-center gap-3 border-b border-white/6 py-3 md:grid-cols-[1fr_auto_1fr]"
              >
                <p className="font-display text-lg font-bold text-white">{stat.value.split(' vs ')[0] ?? stat.value}</p>
                <p className="text-center text-xs uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <p className="text-left font-display text-lg font-bold text-white md:text-right">
                  {stat.value.includes(' vs ') ? stat.value.split(' vs ')[1] : stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 border-b border-white/10 py-6 xl:grid-cols-[1fr_1fr]">
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
                <div key={row.team} className="grid grid-cols-[1fr_auto] items-center border-b border-white/6 py-2">
                  <div>
                    <p className="font-semibold text-white">{row.team}</p>
                    <p className="text-sm text-slate-300">Form: {row.form}</p>
                  </div>
                  <p className="font-display text-xl font-bold text-brand-300">{row.points} pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-b border-white/10 py-6 xl:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Odds comparisons
            </p>
            <div className="grid gap-3">
              {details.odds.map((row) => (
                <div key={row.market} className="grid gap-2 border-b border-white/6 py-3 md:grid-cols-[1fr_auto_auto] md:items-center">
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
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-brand-300">Over/under bets</p>
                <div className="grid gap-2">
                  {details.overUnder.map((row) => (
                    <div key={row.line} className="grid gap-2 border-b border-white/6 py-2 md:grid-cols-[1fr_auto_auto] md:items-center">
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

        <div className="grid gap-4 pt-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              System summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{details.headline}</p>
          </div>

          <div className="border border-brand-300/20 bg-brand-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-300">Likely winner / best pick</p>
            <p className="mt-3 font-display text-2xl font-bold text-white">{details.recommendedBet}</p>
            <p className="mt-2 text-sm text-slate-300">{details.confidence}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MatchDetailsPage
