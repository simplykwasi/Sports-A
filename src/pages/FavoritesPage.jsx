import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PageHero from '../components/ui/PageHero'
import LeagueCrest from '../components/ui/LeagueCrest'
import { useAuth } from '../hooks/useAuth'
import { favoriteLeagues, favoriteTeams, featuredMatches, matchListings, todaysMatches } from '../data/mockData'

// Favorites page.
function FavoritesPage() {
  const { currentUser, hasAccount, updatePreferences } = useAuth()
  const [selectedLeagues, setSelectedLeagues] = useState(() => currentUser?.favoriteLeagues || [])
  const [selectedTeams, setSelectedTeams] = useState(() => currentUser?.favoriteTeams || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const filteredLeagues = useMemo(
    () =>
      favoriteLeagues.filter((league) =>
        league.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      ),
    [searchTerm],
  )

  const filteredTeams = useMemo(
    () =>
      favoriteTeams.filter((team) => team.toLowerCase().includes(searchTerm.trim().toLowerCase())),
    [searchTerm],
  )

  const matchDetailsMap = useMemo(() => {
    const map = new Map()

    matchListings.forEach((item) => {
      map.set(item.id, { ...item, status: 'Upcoming' })
    })

    todaysMatches.forEach((item) => {
      map.set(item.id, { ...map.get(item.id), ...item })
    })

    return map
  }, [])

  const trackedMatches = useMemo(
    () =>
      featuredMatches
        .map((match) => ({
          ...match,
          details: matchDetailsMap.get(match.id) || {},
        }))
        .filter(
          (match) =>
            selectedLeagues.includes(match.league) ||
            selectedTeams.includes(match.home) ||
            selectedTeams.includes(match.away),
        ),
    [selectedLeagues, selectedTeams, matchDetailsMap],
  )

  const handleToggleLeague = (league) => {
    setSelectedLeagues((current) =>
      current.includes(league) ? current.filter((item) => item !== league) : [...current, league],
    )
  }

  const handleToggleTeam = (team) => {
    setSelectedTeams((current) =>
      current.includes(team) ? current.filter((item) => item !== team) : [...current, team],
    )
  }

  const handleSavePreferences = (event) => {
    event.preventDefault()
    setStatusMessage('')

    const result = updatePreferences({ favoriteTeams: selectedTeams, favoriteLeagues: selectedLeagues })

    if (!result.ok) {
      setStatusMessage(result.error || 'Unable to save your watchlist.')
      return
    }

    setStatusMessage('Your tracking preferences were saved.')
  }

  if (!hasAccount) {
    return (
      <div className="section-shell">
        <PageHero
          eyebrow="Favorites"
          title="Build your match watchlist"
          description="Sign in or create an account to pick teams and leagues, then receive predictions and insights for your favorites."
        />

        <div className="grid gap-6 rounded-4xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/20">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">Favorites become your personal tracking engine.</p>
            <p className="text-sm leading-7 text-slate-300">
              Choose the teams and leagues you want tracked, and the system will surface only the matches and predictions that matter most to you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pick teams</p>
              <p className="mt-3 text-base font-semibold text-white">Select clubs you follow closely.</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pick leagues</p>
              <p className="mt-3 text-base font-semibold text-white">Track the competitions you care about.</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Get insights</p>
              <p className="mt-3 text-base font-semibold text-white">See predictions for your selected matches.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/login" className="primary-button">
              Sign in to start tracking
            </Link>
            <Link to="/register" className="secondary-button">
              Create account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Favorites"
        title={`Your watching preferences, ${currentUser.username}`}
        description="Choose the teams and leagues the system tracks and receive predictions for the matches that matter most."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-4xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/20">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Track preferences</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Select teams and leagues</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              The system will use these favorites to filter match alerts, predictions, and insights for your personalized watchlist.
            </p>
          </div>

          <form className="grid gap-6" onSubmit={handleSavePreferences}>
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[0.22em] text-slate-400">
                Search leagues and teams
              </label>
              <input
                className="input-field"
                type="search"
                placeholder="Search for Premier League, Arsenal, PSG..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="grid gap-4">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.22em] text-slate-400">Tracked items</p>
                {selectedLeagues.length > 0 || selectedTeams.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedLeagues.map((league) => (
                      <button
                        key={league}
                        type="button"
                        onClick={() => handleToggleLeague(league)}
                        className="rounded-full border border-brand-400 bg-brand-400/10 px-3 py-1 text-sm text-brand-200 transition hover:bg-brand-400/15"
                      >
                        {league} ×
                      </button>
                    ))}
                    {selectedTeams.map((team) => (
                      <button
                        key={team}
                        type="button"
                        onClick={() => handleToggleTeam(team)}
                        className="rounded-full border border-brand-400 bg-brand-400/10 px-3 py-1 text-sm text-brand-200 transition hover:bg-brand-400/15"
                      >
                        {team} ×
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Search and click a league or team to mark it for tracking.</p>
                )}
              </div>

              <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-4">
                <p className="mb-3 text-sm uppercase tracking-[0.22em] text-slate-400">Search results</p>
                {searchTerm.trim() ? (
                  <div className="grid gap-2">
                    {filteredLeagues.length === 0 && filteredTeams.length === 0 ? (
                      <p className="text-sm text-slate-500">No results found for "{searchTerm}".</p>
                    ) : null}

                    {filteredLeagues.map((league) => {
                      const active = selectedLeagues.includes(league)
                      return (
                        <button
                          key={league}
                          type="button"
                          onClick={() => handleToggleLeague(league)}
                          className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                            active
                              ? 'border-brand-400 bg-brand-400/15 text-white'
                              : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20'
                          }`}
                        >
                          <span className="font-semibold text-white">League</span> • {league}
                        </button>
                      )
                    })}

                    {filteredTeams.map((team) => {
                      const active = selectedTeams.includes(team)
                      return (
                        <button
                          key={team}
                          type="button"
                          onClick={() => handleToggleTeam(team)}
                          className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                            active
                              ? 'border-brand-400 bg-brand-400/15 text-white'
                              : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20'
                          }`}
                        >
                          <span className="font-semibold text-white">Team</span> • {team}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Start typing a league or team name to see matching results.</p>
                )}
              </div>
            </div>

            {statusMessage ? <p className="text-sm text-emerald-300">{statusMessage}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" className="primary-button">
                Save watchlist
              </button>
              <Link to="/dashboard" className="secondary-button">
                Back to dashboard
              </Link>
            </div>
          </form>
        </section>

        <aside className="rounded-4xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/20">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Watchlist summary</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Your current signal set</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Matches and predictions appear here based on your selected leagues and teams.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Leagues tracked</p>
              <p className="mt-3 text-xl font-semibold text-white">{selectedLeagues.length}</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Teams tracked</p>
              <p className="mt-3 text-xl font-semibold text-white">{selectedTeams.length}</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Matches tracked</p>
              <p className="mt-3 text-xl font-semibold text-white">{trackedMatches.length}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-6">
        {trackedMatches.length > 0 ? (
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Match details</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Live and upcoming matches</h2>
              </div>
              <p className="text-sm text-slate-400">
                Based on selected teams and leagues, the system displays match status, kickoff, and prediction insight for your favorites.
              </p>
            </div>

            <div className="grid gap-4">
              {trackedMatches.map((match) => {
                const { details } = match
                const status = details.status || 'Upcoming'
                const timeLabel = status === 'Live' ? details.minute || 'Live' : details.kickoff || 'Soon'
                const scoreLabel = status === 'Live' ? details.score || '–' : null

                return (
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="rounded-4xl border border-white/10 bg-white/5 p-6 transition hover:border-brand-400/40 hover:bg-white/10"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <LeagueCrest league={match.league} size="sm" />
                          </div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{match.league}</p>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-white">{match.home} vs {match.away}</h3>
                        <p className="mt-2 text-sm text-slate-300">
                          {details.venue ? `${details.venue} · ` : ''}{timeLabel}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${
                          status === 'Live'
                            ? 'border border-rose-300/20 bg-rose-400/10 text-rose-200'
                            : 'border border-brand-300/20 bg-brand-400/10 text-brand-200'
                        }`}>
                          {status}
                        </span>
                        {scoreLabel ? (
                          <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                            {scoreLabel}
                          </span>
                        ) : null}
                        <span className="text-sm font-semibold text-brand-300">View details</span>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-slate-950/80 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Prediction</p>
                        <p className="mt-2 text-base font-semibold text-white">{match.prediction}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-950/80 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Expected edge</p>
                        <p className="mt-2 text-base font-semibold text-white">{match.value}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-950/80 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Why track</p>
                        <p className="mt-2 text-base leading-6 text-slate-300">
                          This match is relevant because it matches your favorite teams or chosen leagues.
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-4xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">No tracked matches yet</p>
            <p className="mt-3 text-sm leading-7">
              Select teams and leagues above to populate this section with live and upcoming match details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
