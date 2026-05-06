import { Link } from 'react-router-dom'
import { FiShield } from 'react-icons/fi'
import MatchCard from '../components/ui/MatchCard'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useSportsData } from '../hooks/useSportsData'
import { SkeletonGrid, DataTableSkeleton } from '../components/ui/LoadingSkeletons'
import { analyticsAPI } from '../services/api.service'
import { useEffect, useState } from 'react'

// Main user dashboard.
function DashboardPage() {
  const { currentUser, hasAccount } = useAuth()
  const { valueBets, fixtures, loading: dataLoading } = useSportsData({ 
    autoRefresh: true, 
    refreshInterval: 30000 
  })
  const [dashboardData, setDashboardData] = useState(null)
  const [apiLoading, setApiLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  // Fetch aggregated dashboard data from backend
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

  // Dashboard fallback for visitors who do not have an account yet.
  if (!hasAccount) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="glass-panel w-full max-w-2xl p-8 text-center md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-400/12 text-brand-300">
            <FiShield className="text-4xl" />
          </div>

          <p className="mt-6 font-display text-4xl font-bold text-white">Sports A</p>
          <p className="mt-3 text-lg text-slate-200">Sorry you dont have an account</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Log in if you already signed up, or create a new account to access the
            full analytics dashboard.
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
        description="Your personalized Sports A dashboard with value bets, live matches, and AI-powered predictions."
      />

      {/* Key Metrics */}
      <section className="grid gap-4 md:grid-cols-3">
        {apiLoading ? (
          <>
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
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

      {/* Main Content Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Top Value Bets */}
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
                  className="glass-panel p-4 hover:bg-white/10 transition rounded-lg"
                >
                  <div className="text-sm text-slate-300">
                    <p className="font-semibold text-white">
                      {bet.homeTeam} vs {bet.awayTeam}
                    </p>
                    <p className="text-xs text-brand-300 mt-1">
                      Value Delta: +{(bet.valueDelta * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(bet.kickoff).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-slate-400">
                No value bets detected right now
              </div>
            )}
          </div>
          <Link to="/value-bets" className="text-brand-300 text-sm mt-4 inline-block hover:text-brand-200">
            View all value bets →
          </Link>
        </SectionCard>

        {/* Alerts & Quick Actions */}
        <SectionCard 
          title="Quick Actions" 
          description="Fast links to key features"
        >
          <div className="grid gap-3">
            <Link 
              to="/live-analysis"
              className="rounded-lg border border-brand-300/30 bg-brand-300/10 p-3 text-sm font-medium text-brand-300 hover:bg-brand-300/20 transition"
            >
              📊 View Live Analysis
            </Link>
            <Link 
              to="/odds-comparison"
              className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm font-medium text-emerald-300 hover:bg-emerald-300/20 transition"
            >
              📈 Compare Odds
            </Link>
            <Link 
              to="/saved-bets"
              className="rounded-lg border border-blue-300/30 bg-blue-300/10 p-3 text-sm font-medium text-blue-300 hover:bg-blue-300/20 transition"
            >
              💾 Your Saved Bets
            </Link>
            <Link 
              to="/bet-history"
              className="rounded-lg border border-purple-300/30 bg-purple-300/10 p-3 text-sm font-medium text-purple-300 hover:bg-purple-300/20 transition"
            >
              📋 Bet History
            </Link>
          </div>
        </SectionCard>
      </section>

      {/* Upcoming Matches */}
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
                    <th className="text-left py-3 px-4 font-semibold">Match</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcoming.slice(0, 5).map((match) => (
                    <tr key={match.fixture_id} className="border-b border-slate-700/50 hover:bg-white/5">
                      <td className="py-3 px-4">Fixture {match.external_fixture_id}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(match.kickoff_time).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                          {match.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link 
                          to={`/match-analytics/${match.fixture_id}`}
                          className="text-brand-300 hover:text-brand-200 text-sm"
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
            <div className="text-center py-8 text-slate-400">No upcoming matches</div>
          )}
        </SectionCard>
      </section>

      {apiError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
          Error loading dashboard: {apiError}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
