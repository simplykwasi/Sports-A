import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useSportsData } from '../hooks/useSportsData'
import { SkeletonGrid, DataTableSkeleton } from '../components/ui/LoadingSkeletons'
import { analyticsAPI } from '../services/api.service'
import { useEffect, useMemo, useState } from 'react'
import { calculateMatchOutcome, findValueBets } from '../utils/mathEngine'

function DashboardPage() {
  const { currentUser, hasAccount } = useAuth()
  const { valueBets, fixtures, teams, loading: dataLoading } = useSportsData({
    autoRefresh: true,
    refreshInterval: 30000,
  })
  const [dashboardData, setDashboardData] = useState(null)
  const [apiLoading, setApiLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await analyticsAPI.getDashboard()
        if (result.error) {
          setApiError(result.error.message)
        } else {
          setDashboardData(result)
        }
      } catch (err) {
        setApiError(err.message)
      } finally {
        setApiLoading(false)
      }
    }

    if (currentUser && hasAccount) {
      fetchDashboard()
    }
  }, [currentUser, hasAccount])

  const teamNameById = useMemo(() => {
    const m = new Map()
    ;(teams || []).forEach((t) => {
      if (t.team_id) m.set(t.team_id, t.name || t.short_name || 'Team')
    })
    return m
  }, [teams])

  const fixturePoissonRows = useMemo(() => {
    return (fixtures || []).slice(0, 10).map((fx) => {
      const homeName = teamNameById.get(fx.home_team_id) ?? fx.home_team ?? 'Home'
      const awayName = teamNameById.get(fx.away_team_id) ?? fx.away_team ?? 'Away'
      const λh = Number(fx.home_xg)
      const λa = Number(fx.away_xg)
      const lh = Number.isFinite(λh) && λh > 0 ? λh : 1.35
      const la = Number.isFinite(λa) && λa > 0 ? λa : 1.28
      const poisson = calculateMatchOutcome(lh, la)
      const p = fx.predictions
      let valueNote = null
      if (p && p.bookie_home_prob != null && p.bookie_draw_prob != null && p.bookie_away_prob != null) {
        const odds = {
          homeWin: 1 / Number(p.bookie_home_prob),
          draw: 1 / Number(p.bookie_draw_prob),
          awayWin: 1 / Number(p.bookie_away_prob),
        }
        const preds = {
          homeWin: Number(p.predicted_home_prob),
          draw: Number(p.predicted_draw_prob),
          awayWin: Number(p.predicted_away_prob),
        }
        const vb = findValueBets(preds, odds, 0.03)
        if (vb.length) {
          valueNote = `${vb[0].outcome} · +${vb[0].edgePercentage.toFixed(1)}% vs book`
        }
      }

      return {
        id: fx.fixture_id,
        homeName,
        awayName,
        lh,
        la,
        poisson,
        valueNote,
      }
    })
  }, [fixtures, teamNameById])

  if (!hasAccount) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="glass-panel w-full max-w-2xl p-8 text-center md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-400/12 text-brand-300">
            <Shield className="h-10 w-10" strokeWidth={1.75} aria-hidden />
          </div>

          <p className="mt-6 font-display text-4xl font-bold text-white">Sports A</p>
          <p className="mt-3 text-lg text-slate-200">Sorry you dont have an account</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Log in if you already signed up, or create a new account to access the full analytics dashboard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="primary-button">
              Log in
            </Link>
            <Link to="/register" className="secondary-button">
              Sign up
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const displayName = currentUser?.user_metadata?.display_name || currentUser?.email || 'User'

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Dashboard"
        title={`Welcome back, ${displayName}.`}
        description="Your personalized Sports A dashboard with value bets, live matches, and Poisson-powered snapshots fed by Supabase fixtures."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {apiLoading ? (
          <>
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          </>
        ) : (
          <>
            <StatCard
              label="Active Matches"
              value={dashboardData?.upcoming?.length || 0}
              description="Upcoming fixtures"
            />
            <StatCard
              label="Value Bets Found"
              value={dashboardData?.quickValueBets?.length || valueBets.length}
              description="Today's opportunities"
            />
            <StatCard
              label="Leagues Tracked"
              value={dashboardData?.leagues?.length || 0}
              description="Active competitions"
            />
          </>
        )}
      </section>

      <SectionCard
        title="Poisson & value scan (live Supabase fixtures)"
        description="Expected goals from each fixture row drive independent Poisson 1X2 probabilities in the browser. When book-implied probs exist on a prediction row, we surface the strongest positive edge."
      >
        {dataLoading ? (
          <DataTableSkeleton rows={4} />
        ) : fixturePoissonRows.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No fixtures returned yet — once Supabase syncs upcoming games, λ-based projections appear here automatically.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-200">Fixture</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-200">λh / λa</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-200">Poisson 1X2</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-200">Model vs book</th>
                </tr>
              </thead>
              <tbody>
                {fixturePoissonRows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-3 py-3 text-slate-100">
                      {row.homeName} vs {row.awayName}
                    </td>
                    <td className="px-3 py-3 text-slate-400">
                      {row.lh.toFixed(2)} · {row.la.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-slate-300">
                      {(row.poisson.homeWin * 100).toFixed(1)}% / {(row.poisson.draw * 100).toFixed(1)}% /{' '}
                      {(row.poisson.awayWin * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-xs text-warning-400">{row.valueNote ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Top Value Bets Today"
          description="Matches where our AI probability beats bookmaker odds by 5%+"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {dataLoading ? (
              <SkeletonGrid columns={2} count={4} />
            ) : valueBets.length > 0 ? (
              valueBets.slice(0, 4).map((bet) => (
                <Link
                  key={bet.fixtureId}
                  to={`/match-analytics/${bet.fixtureId}`}
                  className="glass-panel rounded-lg p-4 transition hover:bg-white/10"
                >
                  <div className="text-sm text-slate-300">
                    <p className="font-semibold text-white">
                      {bet.homeTeam} vs {bet.awayTeam}
                    </p>
                    <p className="mt-1 text-xs text-brand-300">
                      Value Delta: +{((bet.valueDelta ?? 0) * 100).toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(bet.kickoff).toLocaleString()}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-slate-400">No value bets detected right now</div>
            )}
          </div>
          <Link to="/value-bets" className="mt-4 inline-block text-sm text-brand-300 hover:text-brand-200">
            View all value bets →
          </Link>
        </SectionCard>

        <SectionCard title="Quick Actions" description="Fast links to key features">
          <div className="grid gap-3">
            <Link
              to="/live-analysis"
              className="rounded-lg border border-brand-300/30 bg-brand-300/10 p-3 text-sm font-medium text-brand-300 transition hover:bg-brand-300/20"
            >
              View Live Analysis
            </Link>
            <Link
              to="/odds-comparison"
              className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-300/20"
            >
              Compare Odds
            </Link>
            <Link
              to="/saved-bets"
              className="rounded-lg border border-blue-300/30 bg-blue-300/10 p-3 text-sm font-medium text-blue-300 transition hover:bg-blue-300/20"
            >
              Your Saved Bets
            </Link>
            <Link
              to="/bet-history"
              className="rounded-lg border border-purple-300/30 bg-purple-300/10 p-3 text-sm font-medium text-purple-300 transition hover:bg-purple-300/20"
            >
              Bet History
            </Link>
          </div>
        </SectionCard>
      </section>

      <section>
        <SectionCard
          title="Upcoming Matches"
          description="Live fixtures with real-time probability updates"
        >
          {dataLoading ? (
            <DataTableSkeleton rows={5} />
          ) : dashboardData?.upcoming?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Match</th>
                    <th className="px-4 py-3 text-left font-semibold">Time</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcoming.slice(0, 5).map((match) => (
                    <tr key={match.fixture_id} className="border-b border-slate-700/50 hover:bg-white/5">
                      <td className="px-4 py-3">Fixture {match.external_fixture_id}</td>
                      <td className="px-4 py-3 text-slate-400">{new Date(match.kickoff_time).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300">{match.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/match-analytics/${match.fixture_id}`}
                          className="text-sm text-brand-300 hover:text-brand-200"
                        >
                          Analyze →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">No upcoming matches</div>
          )}
        </SectionCard>
      </section>

      {apiError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Error loading dashboard: {apiError}
        </div>
      ) : null}
    </div>
  )
}

export default DashboardPage
