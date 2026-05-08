import { useEffect, useMemo, useState } from 'react'
import MatchListCard from '../components/matches/MatchListCard'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { supabase } from '../lib/supabaseClient'
import { fetchFixturesFromSupabase } from '../services/sportsApi'

function UpcomingMatchesPage() {
  const [activeLeague, setActiveLeague] = useState('All leagues')
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadMatches = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const rows = await fetchFixturesFromSupabase()
        if (isMounted) {
          setMatches(rows)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Unable to load Supabase fixtures.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const channel = supabase
      .channel('fixtures-page-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'fixtures',
        },
        async () => {
          const rows = await fetchFixturesFromSupabase()
          setMatches(rows)
        },
      )
      .subscribe()

    loadMatches()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const leagueTabs = useMemo(() => {
    return ['All leagues', 'Live']
  }, [])

  const visibleMatches = useMemo(() => {
    if (activeLeague === 'Live') {
      return matches.filter((match) =>
        ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'].includes(match.status_short),
      )
    }

    return matches
  }, [activeLeague, matches])

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Matches"
        title="Live and upcoming matches."
        description="This page reads from the Supabase matches table and updates instantly when Realtime receives score or status changes."
      />

      <section className="glass-panel p-4 md:p-6">
        <div className="flex flex-wrap gap-2">
          {leagueTabs.map((league) => (
            <button
              key={league}
              type="button"
              className={[
                'rounded-full border px-4 py-2 text-sm font-semibold transition',
                activeLeague === league
                  ? 'border-brand-300 bg-brand-400 text-ink-950'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
              ].join(' ')}
              onClick={() => setActiveLeague(league)}
            >
              {league}
            </button>
          ))}
        </div>
      </section>

      <SectionCard
        title="Supabase feed"
        description="Rows are seeded from API-Football and refreshed via Supabase Realtime UPDATE events."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Visible matches</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{visibleMatches.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total cached</p>
            <p className="mt-2 font-display text-3xl font-bold text-brand-300">{matches.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Realtime</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Listening for UPDATE events on public.matches.
            </p>
          </div>
        </div>
      </SectionCard>

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4">
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Loading Supabase matches...
          </div>
        ) : visibleMatches.length > 0 ? (
          visibleMatches.map((match) => <MatchListCard key={match.id} match={match} />)
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            No matches found in Supabase yet. Use the Admin Panel sync button to seed today's fixtures.
          </div>
        )}
      </section>
    </div>
  )
}

export default UpcomingMatchesPage
