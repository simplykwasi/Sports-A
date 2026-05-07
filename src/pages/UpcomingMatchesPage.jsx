import { useMemo, useState } from 'react'
import LeagueFilterTabs from '../components/matches/LeagueFilterTabs'
import MatchListCard from '../components/matches/MatchListCard'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { matchLeagueTabs, matchListings, todaysMatches } from '../data/mockData'
import { calculateMatchOutcome, findValueBets } from '../utils/mathEngine'

function UpcomingMatchesPage() {
  const [activeLeague, setActiveLeague] = useState('All leagues')
  const liveMatchIds = useMemo(
    () => new Set(todaysMatches.filter((match) => match.status === 'Live').map((match) => match.id)),
    [],
  )

  const visibleMatches = useMemo(() => {
    if (activeLeague === 'Live') {
      return matchListings.filter((match) => liveMatchIds.has(match.id))
    }

    if (activeLeague === 'All leagues') {
      return matchListings
    }

    return matchListings.filter((match) => match.league === activeLeague)
  }, [activeLeague, liveMatchIds])

  const matchMathById = useMemo(() => {
    const map = new Map()
    visibleMatches.forEach((match) => {
      const λh = match.expectedHomeGoals
      const λa = match.expectedAwayGoals
      if (typeof λh !== 'number' || typeof λa !== 'number' || !match.bookOdds) {
        return
      }

      const poisson = calculateMatchOutcome(λh, λa)
      const modelPredictions = {
        homeWin: poisson.homeWin,
        draw: poisson.draw,
        awayWin: poisson.awayWin,
      }
      const edges = findValueBets(modelPredictions, match.bookOdds, 0.02)
      const topEdge = edges[0]

      map.set(match.id, {
        lambdaHome: λh,
        lambdaAway: λa,
        homeWin: poisson.homeWin,
        draw: poisson.draw,
        awayWin: poisson.awayWin,
        valueHint: topEdge
          ? `Model edge · ${topEdge.outcome} +${topEdge.edgePercentage.toFixed(1)}% vs book`
          : null,
      })
    })
    return map
  }, [visibleMatches])

  const slateEdges = useMemo(() => {
    let count = 0
    matchMathById.forEach((row) => {
      if (row.valueHint) count += 1
    })
    return count
  }, [matchMathById])

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Matches"
        title="Browse matches by league."
        description="Poisson projections use expected-goals inputs from each fixture card (demo slate). Value hints compare model prices against demo decimal odds."
      />

      <section className="glass-panel p-4 md:p-6">
        <LeagueFilterTabs
          leagues={matchLeagueTabs}
          activeLeague={activeLeague}
          onSelect={setActiveLeague}
        />
      </section>

      <SectionCard
        title="Math engine snapshot"
        description="Clientside Poisson 1X2 from λ_home / λ_away · Value screening threshold ≥ 2% edge vs listed odds."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Visible fixtures</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{visibleMatches.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Modeled edges found</p>
            <p className="mt-2 font-display text-3xl font-bold text-brand-300">{slateEdges}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Engine</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Same helpers power dashboard fixtures when Supabase returns xG rows.
            </p>
          </div>
        </div>
      </SectionCard>

      <section className="grid gap-4">
        {visibleMatches.map((match) => (
          <MatchListCard key={match.id} match={match} poissonSummary={matchMathById.get(match.id)} />
        ))}
      </section>
    </div>
  )
}

export default UpcomingMatchesPage
