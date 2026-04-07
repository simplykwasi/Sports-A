import { Link } from 'react-router-dom'
import MatchCard from '../components/ui/MatchCard'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { featuredMatches, heroMetrics, quickStats } from '../data/mockData'

function LandingPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Landing page"
        title="Build a football analytics product that helps users find smarter bets."
        description="This homepage introduces the Sports A vision, routes users into the app, and previews the type of match intelligence the product will surface."
        actions={
          <>
            <Link to="/dashboard" className="primary-button">
              Open dashboard
            </Link>
            <Link to="/register" className="secondary-button">
              Create account
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {heroMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Featured match opportunities"
          description="These cards preview the betting insight style we can later power with live APIs and model outputs."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {featuredMatches.map((match) => (
              <MatchCard key={`${match.home}-${match.away}`} match={match} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Signals for the MVP"
          description="Useful defaults to surface on first release before the platform gets more advanced."
        >
          <div className="grid gap-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}

export default LandingPage
