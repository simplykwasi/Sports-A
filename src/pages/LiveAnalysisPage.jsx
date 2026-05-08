import { useEffect, useState } from 'react'
import PageHero from '../components/ui/PageHero'
import { fetchCachedMatchesFromSupabase } from '../services/sportsApi'

export default function LiveAnalysisPage() {
  const [matches, setMatches] = useState([])
  const [syncSource, setSyncSource] = useState('cache')
  const [syncError, setSyncError] = useState(null)
  const [isLoadingCache, setIsLoadingCache] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadCachedMatches = async () => {
      try {
        const cachedMatches = await fetchCachedMatchesFromSupabase()
        if (isMounted) {
          setMatches(cachedMatches)
        }
      } catch (error) {
        if (isMounted) {
          setSyncError(error)
        }
      } finally {
        if (isMounted) {
          setIsLoadingCache(false)
        }
      }
    }

    const handleLiveFixturesSync = (event) => {
      const { data, source, error } = event.detail
      setMatches(data ?? [])
      setSyncSource(source)
      setSyncError(error ?? null)
      setIsLoadingCache(false)
    }

    loadCachedMatches()
    window.addEventListener('sports-a:live-fixtures-sync', handleLiveFixturesSync)

    return () => {
      isMounted = false
      window.removeEventListener('sports-a:live-fixtures-sync', handleLiveFixturesSync)
    }
  }, [])

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Live"
        title="Live analysis hub"
        description="Track API-Football fixture snapshots as they sync into Supabase. If the API rate-limits, the table keeps showing the latest cached rows."
      />

      {syncError ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {syncError.message || 'API-Football sync failed. Showing cached Supabase data.'}
        </div>
      ) : null}

      <div className="glass-panel px-4 py-6 md:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-300">
              Live fixture cache
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Source: {syncSource === 'api' ? 'API-Football sync' : 'Supabase cache'}
            </p>
          </div>
          <p className="text-sm text-slate-400">
            Refreshes every 60 seconds on live pages
          </p>
        </div>

        {isLoadingCache ? (
          <p className="text-sm text-slate-400">Loading cached matches...</p>
        ) : matches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Match</th>
                  <th className="px-3 py-2 text-left font-semibold">Minute</th>
                  <th className="px-3 py-2 text-left font-semibold">Score</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b border-white/5">
                    <td className="px-3 py-3 text-slate-100">
                      {match.home_team_name} vs {match.away_team_name}
                    </td>
                    <td className="px-3 py-3 text-slate-300">{match.elapsed ?? '-'}</td>
                    <td className="px-3 py-3 text-slate-300">
                      {match.home_score ?? 0} - {match.away_score ?? 0}
                    </td>
                    <td className="px-3 py-3 text-slate-400">{match.status_long ?? match.status_short ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No cached live fixtures yet. The poller will populate this table when API-Football returns live matches.
          </p>
        )}
      </div>
    </div>
  )
}
