import { Link } from 'react-router-dom'
import { FiShield } from 'react-icons/fi'
import MatchCard from '../components/ui/MatchCard'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { featuredMatches, heroMetrics, notificationFeed } from '../data/mockData'

function DashboardPage() {
  // Temporary frontend-only account gate.
  // Change this to your real auth/user state later.
  const hasAccount =
    typeof window !== 'undefined' &&
    window.localStorage.getItem('sportsAHasAccount') === 'true'

  // Dashboard fallback for visitors who do not have an account yet.
  if (!hasAccount) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="glass-panel w-full max-w-2xl p-8 text-center md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-400/12 text-brand-300">
            <FiShield className="text-4xl" />
          </div>

          <p className="mt-6 font-display text-4xl font-bold text-white">Sports A</p>
          <p className="mt-3 text-lg text-slate-200">Sorry you dont have an account</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Log in if you already signed up, or create a new account to access the
            full analytics dashboard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="primary-button">
              Log in
            </Link>
            <Link to="/register" className="secondary-button">
              Sign up
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Dashboard"
        title="A command center for your daily football betting workflow."
        description="Use the dashboard to pull together model signals, favorite matches, and alerts into one starting view."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {heroMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard title="Top cards for today" description="Prime opportunities can sit here once your scoring logic is connected.">
          <div className="grid gap-4 lg:grid-cols-2">
            {featuredMatches.map((match) => (
              <MatchCard key={`${match.home}-${match.away}`} match={match} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Latest alerts" description="This card can later be driven by odds movements, injury news, and model updates.">
          <div className="grid gap-3">
            {notificationFeed.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}

export default DashboardPage
