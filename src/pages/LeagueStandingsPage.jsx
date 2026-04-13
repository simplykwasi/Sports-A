import { useMemo, useState } from 'react'
import DataTable from '../components/ui/DataTable'
import LeagueCrest from '../components/ui/LeagueCrest'

const topLeagues = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Champions League',
]

const standingsColumns = [
  { key: 'position', label: 'Pos' },
  { key: 'club', label: 'Club' },
  { key: 'mp', label: 'MP' },
  { key: 'w', label: 'W' },
  { key: 'd', label: 'D' },
  { key: 'l', label: 'L' },
  { key: 'gs', label: 'GS' },
  { key: 'ga', label: 'GA' },
  { key: 'gd', label: 'GD' },
  { key: 'pts', label: 'PTS' },
]

const standingsByLeague = {
  'Premier League': [
    { position: 1, club: 'Arsenal', mp: 31, w: 22, d: 8, l: 1, gs: 68, ga: 26, gd: '+42', pts: 74 },
    { position: 2, club: 'Liverpool', mp: 31, w: 21, d: 8, l: 2, gs: 70, ga: 31, gd: '+39', pts: 71 },
    { position: 3, club: 'Manchester City', mp: 31, w: 21, d: 6, l: 4, gs: 73, ga: 32, gd: '+41', pts: 69 },
    { position: 4, club: 'Aston Villa', mp: 31, w: 19, d: 5, l: 7, gs: 59, ga: 40, gd: '+19', pts: 62 },
  ],
  'La Liga': [
    { position: 1, club: 'Real Madrid', mp: 30, w: 23, d: 6, l: 1, gs: 65, ga: 20, gd: '+45', pts: 75 },
    { position: 2, club: 'Barcelona', mp: 30, w: 20, d: 7, l: 3, gs: 61, ga: 32, gd: '+29', pts: 67 },
    { position: 3, club: 'Atletico Madrid', mp: 30, w: 20, d: 7, l: 3, gs: 54, ga: 24, gd: '+30', pts: 67 },
    { position: 4, club: 'Real Sociedad', mp: 30, w: 16, d: 9, l: 5, gs: 45, ga: 29, gd: '+16', pts: 57 },
  ],
  'Serie A': [
    { position: 1, club: 'Inter', mp: 31, w: 25, d: 4, l: 2, gs: 72, ga: 18, gd: '+54', pts: 79 },
    { position: 2, club: 'Milan', mp: 31, w: 20, d: 6, l: 5, gs: 60, ga: 35, gd: '+25', pts: 66 },
    { position: 3, club: 'Atalanta', mp: 31, w: 18, d: 6, l: 7, gs: 58, ga: 38, gd: '+20', pts: 60 },
    { position: 4, club: 'Roma', mp: 31, w: 17, d: 7, l: 7, gs: 52, ga: 35, gd: '+17', pts: 58 },
  ],
  Bundesliga: [
    { position: 1, club: 'Leverkusen', mp: 28, w: 23, d: 5, l: 0, gs: 69, ga: 19, gd: '+50', pts: 74 },
    { position: 2, club: 'Bayern', mp: 28, w: 19, d: 3, l: 6, gs: 76, ga: 33, gd: '+43', pts: 60 },
    { position: 3, club: 'Leipzig', mp: 28, w: 18, d: 7, l: 3, gs: 57, ga: 30, gd: '+27', pts: 61 },
    { position: 4, club: 'Dortmund', mp: 28, w: 17, d: 8, l: 3, gs: 55, ga: 34, gd: '+21', pts: 59 },
  ],
  'Ligue 1': [
    { position: 1, club: 'PSG', mp: 29, w: 20, d: 8, l: 1, gs: 67, ga: 24, gd: '+43', pts: 68 },
    { position: 2, club: 'Monaco', mp: 29, w: 17, d: 5, l: 7, gs: 56, ga: 38, gd: '+18', pts: 56 },
    { position: 3, club: 'Brest', mp: 29, w: 15, d: 8, l: 6, gs: 43, ga: 29, gd: '+14', pts: 53 },
    { position: 4, club: 'Lille', mp: 29, w: 14, d: 9, l: 6, gs: 42, ga: 27, gd: '+15', pts: 51 },
  ],
  'Champions League': [
    { position: 1, club: 'Manchester City', mp: 8, w: 6, d: 1, l: 1, gs: 19, ga: 8, gd: '+11', pts: 19 },
    { position: 2, club: 'Real Madrid', mp: 8, w: 5, d: 2, l: 1, gs: 16, ga: 9, gd: '+7', pts: 17 },
    { position: 3, club: 'Bayern', mp: 8, w: 5, d: 1, l: 2, gs: 17, ga: 10, gd: '+7', pts: 16 },
    { position: 4, club: 'Arsenal', mp: 8, w: 5, d: 1, l: 2, gs: 14, ga: 7, gd: '+7', pts: 16 },
  ],
}

// League standings page starter with a top-league horizontal tab bar.
function LeagueStandingsPage() {
  const [activeLeague, setActiveLeague] = useState(topLeagues[0])

  // Standings data changes when a different league tab is selected.
  const activeStandings = useMemo(
    () => standingsByLeague[activeLeague] ?? [],
    [activeLeague],
  )

  return (
    <div className="section-shell">
      <section className="glass-panel p-4 md:p-6">
        {/* Horizontal league tabs for switching between top competitions. */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {topLeagues.map((league) => (
            <button
              key={league}
              type="button"
              onClick={() => setActiveLeague(league)}
              className={[
                'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition',
                activeLeague === league
                  ? 'bg-brand-400 text-ink-950'
                  : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
              ].join(' ')}
            >
              <div className="shrink-0">
                <LeagueCrest league={league} size="sm" />
              </div>
              {league}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel p-4 md:p-6">
        {/* League standings table. Edit rows from standingsByLeague above. */}
        <DataTable columns={standingsColumns} rows={activeStandings} />

        {/* Acronym legend for the standings table. */}
        <div className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-sm text-slate-300 md:grid-cols-3">
          <p><span className="font-semibold text-white">MP</span>: Matches Played</p>
          <p><span className="font-semibold text-white">W</span>: Wins</p>
          <p><span className="font-semibold text-white">D</span>: Draws</p>
          <p><span className="font-semibold text-white">L</span>: Losses</p>
          <p><span className="font-semibold text-white">GS</span>: Goals Scored</p>
          <p><span className="font-semibold text-white">GA</span>: Goals Against</p>
          <p><span className="font-semibold text-white">GD</span>: Goal Difference</p>
          <p><span className="font-semibold text-white">PTS</span>: Points</p>
          <p><span className="font-semibold text-white">Pos</span>: Position</p>
        </div>
      </section>
    </div>
  )
}

export default LeagueStandingsPage
