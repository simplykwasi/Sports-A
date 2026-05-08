import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import MatchListCard from '../components/matches/MatchListCard'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { fetchMatchesFromSupabase } from '../services/sportsApi'

const LIVE_STATUSES = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'])
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN'])

function DashboardPage() {
  const { currentUser, hasAccount } = useAuth()
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadMatches = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const rows = await fetchMatchesFromSupabase()
        if (isMounted) {
          setMatches(rows)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Unable to load Supabase matches.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const handleLiveFixturesSync = (event) => {
      setMatches(event.detail.data ?? [])
      setErrorMessage(event.detail.error?.message ?? '')
      setIsLoading(false)
    }

    loadMatches()
    window.addEventListener('sports-a:live-fixtures-sync', handleLiveFixturesSync)

    return () => {
      isMounted = false
      window.removeEventListener('sports-a:live-fixtures-sync', handleLiveFixturesSync)
    }
  }, [])

  const matchStats = useMemo(() => {
    const liveMatches = matches.filter((match) => LIVE_STATUSES.has(match.status_short))
    const finishedMatches = matches.filter((match) => FINISHED_STATUSES.has(match.status_short))
    const statuses = new Set(matches.map((match) => match.status_short).filter(Boolean))

    return {
      liveCount: liveMatches.length,
      upcomingCount: matches.filter((match) => !LIVE_STATUSES.has(match.status_short) && !FINISHED_STATUSES.has(match.status_short)).length,
      finishedCount: finishedMatches.length,
      statusCount: statuses.size,
    }
  }, [matches])

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
        description="Your dashboard now reads directly from the Supabase matches cache seeded by API-Football."
      />

      <section className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          <>
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          </>
        ) : (
          <>
            <StatCard label="Live Matches" value={matchStats.liveCount} description="Currently in play" />
            <StatCard label="Upcoming" value={matchStats.upcomingCount} description="Not started today" />
            <StatCard label="Finished" value={matchStats.finishedCount} description="Completed today" />
            <StatCard label="Statuses" value={matchStats.statusCount} description="State codes cached" />
          </>
        )}
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : null}

      <SectionCard
        title="Today's match feed"
        description="Initial state comes from Supabase matches. Use Admin Panel sync to seed or refresh the cache."
      >
        <div className="grid gap-4">
          {isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Loading Supabase matches...
            </div>
          ) : matches.length > 0 ? (
            matches.slice(0, 6).map((match) => <MatchListCard key={match.id} match={match} />)
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No match rows are cached yet. Open Admin Panel and click Sync matches.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

export default DashboardPage
