import MatchCard from '../components/ui/MatchCard'
import PageHero from '../components/ui/PageHero'
import { featuredMatches } from '../data/mockData'

function PredictionsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Predictions"
        title="Publish match forecasts with confidence and supporting reasoning."
        description="This route is set up for 1X2 forecasts, probability ranges, and explanation notes from your future model."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {featuredMatches.map((match) => (
          <MatchCard key={`${match.home}-${match.away}`} match={match} />
        ))}
      </section>
    </div>
  )
}

export default PredictionsPage
