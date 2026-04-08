import { useMemo, useState } from 'react'
import LeagueFilterTabs from '../components/matches/LeagueFilterTabs'
import MatchListCard from '../components/matches/MatchListCard'
import PageHero from '../components/ui/PageHero'
import { matchLeagueTabs, matchListings, todaysMatches } from '../data/mockData'

function UpcomingMatchesPage() {
  const [activeLeague, setActiveLeague] = useState('All leagues')
  const liveMatchIds = useMemo(
    () => new Set(todaysMatches.filter((match) => match.status === 'Live').map((match) => match.id)),
    []
  )

  // League filter for the match list page.
  const visibleMatches = useMemo(() => {
    if (activeLeague === 'Live') {
      return matchListings.filter((match) => liveMatchIds.has(match.id))
    }

    if (activeLeague === 'All leagues') {
      return matchListings
    }

    return matchListings.filter((match) => match.league === activeLeague)
  }, [activeLeague, liveMatchIds])

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Matches"
        title="Browse matches by league."
        description="Use the Live tab to see in-play matches, or pick a league and open any fixture to move into a full match analysis page."
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
