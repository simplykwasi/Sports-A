import MatchCard from '../components/ui/MatchCard'
import PageHero from '../components/ui/PageHero'
import { featuredMatches } from '../data/mockData'

function UpcomingMatchesPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Upcoming matches"
        title="Browse the next slate of fixtures."
        description="This page is the natural place for league filters, kickoff sorting, and quick links into deeper match analysis."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {featuredMatches.map((match) => (
          <MatchCard key={`${match.home}-${match.away}`} match={match} />
        ))}
      </section>
    </div>
  )
}

export default UpcomingMatchesPage
