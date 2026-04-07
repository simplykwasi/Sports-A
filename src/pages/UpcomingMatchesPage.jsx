import { useMemo, useState } from 'react'
import LeagueFilterTabs from '../components/matches/LeagueFilterTabs'
import MatchListCard from '../components/matches/MatchListCard'
import PageHero from '../components/ui/PageHero'
import { matchLeagueTabs, matchListings } from '../data/mockData'

function UpcomingMatchesPage() {
  const [activeLeague, setActiveLeague] = useState('All leagues')

  // League filter for the match list page.
  const visibleMatches = useMemo(() => {
    if (activeLeague === 'All leagues') {
      return matchListings
    }

    return matchListings.filter((match) => match.league === activeLeague)
  }, [activeLeague])

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Matches"
        title="Browse matches by league."
        description="Pick a league, then open any match to move into a full analysis page with form, stats, odds, and the recommended bet."
      />

      <section className="glass-panel p-4 md:p-6">
        {/* Edit league tabs from mockData.js */}
        <LeagueFilterTabs
          leagues={matchLeagueTabs}
          activeLeague={activeLeague}
          onSelect={setActiveLeague}
        />
      </section>

      <section className="grid gap-4">
        {/* Edit match cards/listings from mockData.js */}
        {visibleMatches.map((match) => (
          <MatchListCard key={match.id} match={match} />
        ))}
      </section>
    </div>
  )
}

export default UpcomingMatchesPage
