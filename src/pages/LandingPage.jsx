import { Link } from 'react-router-dom'

import { todaysMatches } from '../data/mockData'

// Home page welcome message for new and returning users.
function LandingPage() {
  const liveMatches = todaysMatches.filter((match) => match.status === 'Live')
  const upcomingMatches = todaysMatches.filter((match) => match.status !== 'Live')

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pt-8 pb-8 sm:px-4 sm:pt-10 md:px-6 md:pt-14 md:pb-10">
      <div className="space-y-8 md:space-y-10">
        {/* Edit the main Home page message here. */}
        <section className="mx-auto max-w-3xl space-y-3 px-2 text-center sm:space-y-4">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Welcome to Sports A
          </h1>
          <p className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 md:text-lg">
            See today&apos;s matches, compare both teams, and get a simple match prediction.
          </p>
        </section>

        {/* Edit the live match feed layout here. */}
        <section className="space-y-4 sm:space-y-5">
          <div className="space-y-2 px-2 text-center">
            <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">Live Matches</h2>
            <p className="text-xs text-slate-400 sm:text-sm md:text-base">
              All matches currently being played across leagues.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {liveMatches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="block rounded-3xl border border-emerald-400/20 bg-slate-950/45 px-3 py-3 transition hover:border-emerald-400/40 hover:bg-slate-900/70 sm:px-4 sm:py-4"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-xs sm:tracking-[0.2em]">
                    <span className="truncate">{match.league}</span>
                    <span className="inline-flex w-fit rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-300">
                      Live {match.minute}
                    </span>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-12 sm:w-12 sm:text-sm ${match.home.crestColor}`}
                      >
                        {match.home.shortName}
                      </div>
                      <span className="truncate text-left text-xs font-semibold text-white sm:text-sm md:text-base">
                        {match.home.name}
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-semibold text-slate-200 sm:text-sm md:text-base">
                        {match.score}
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
                      <span className="truncate text-right text-xs font-semibold text-white sm:text-sm md:text-base">
                        {match.away.name}
                      </span>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-12 sm:w-12 sm:text-sm ${match.away.crestColor}`}
                      >
                        {match.away.shortName}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Edit the today upcoming match feed layout here. */}
        <section className="space-y-4 sm:space-y-5">
          <div className="space-y-2 px-2 text-center">
            <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">Matches for Today</h2>
            <p className="text-xs text-slate-400 sm:text-sm md:text-base">
              Upcoming kickoffs across all leagues for the rest of the day.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {upcomingMatches.map((match) => {
              return (
                <Link
                  key={match.id}
                  to={`/matches/${match.id}`}
                  className="block rounded-3xl border border-white/10 bg-slate-950/45 px-3 py-3 transition hover:border-emerald-400/30 hover:bg-slate-900/70 sm:px-4 sm:py-4"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-xs sm:tracking-[0.2em]">
                      <span className="truncate">{match.league}</span>
                      <span className="inline-flex w-fit rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-sky-300">
                        {match.status} {match.kickoff}
                      </span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-12 sm:w-12 sm:text-sm ${match.home.crestColor}`}
                        >
                          {match.home.shortName}
                        </div>
                        <span className="truncate text-left text-xs font-semibold text-white sm:text-sm md:text-base">
                          {match.home.name}
                        </span>
                      </div>

                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-200 sm:text-sm md:text-base">vs</div>
                      </div>

                      <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
                        <span className="truncate text-right text-xs font-semibold text-white sm:text-sm md:text-base">
                          {match.away.name}
                        </span>
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-12 sm:w-12 sm:text-sm ${match.away.crestColor}`}
                        >
                          {match.away.shortName}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Edit the league standings entry section here. */}
        <section className="space-y-4 px-2 text-center sm:space-y-5">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">
              League Standings
            </h2>
            <p className="text-xs text-slate-400 sm:text-sm md:text-base">
              Check the latest table positions across the top leagues.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/league-standings"
              className="inline-flex items-center justify-center rounded-full border border-brand-300/30 bg-brand-400/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-300/50 hover:bg-brand-400/20"
            >
              Go to league standings
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage
