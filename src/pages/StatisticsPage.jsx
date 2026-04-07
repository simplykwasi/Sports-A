import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { quickStats } from '../data/mockData'

function StatisticsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Statistics"
        title="Surface the raw performance numbers behind the picks."
        description="This page can hold team splits, shots, xG, conversion rate, possession, and trend visualizations."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <SectionCard title="Stats module notes" description="Charts can slot into this section once you decide on a data visualization library.">
        <p className="text-sm leading-7 text-slate-300">
          Keep this page focused on measurable inputs. It pairs well with filters for league, season, and home-away split.
        </p>
      </SectionCard>
    </div>
  )
}

export default StatisticsPage
