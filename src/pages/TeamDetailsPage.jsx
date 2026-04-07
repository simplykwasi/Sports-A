import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'

const teamDetails = [
  { label: 'Average xG', value: '1.91', helper: 'Across the last 10 matches' },
  { label: 'Shots per match', value: '15.4', helper: 'Strong attacking volume' },
  { label: 'Clean sheets', value: '5', helper: 'In the last 10 fixtures' },
]

function TeamDetailsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Team details"
        title="Create a reusable team profile view."
        description="This screen works well for squad context, injuries, tactical notes, and advanced metrics for a selected club."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {teamDetails.map((detail) => (
          <StatCard key={detail.label} {...detail} />
        ))}
      </section>

      <SectionCard title="Team profile summary" description="Add crest, squad depth, coach notes, and schedule congestion here later.">
        <p className="text-sm leading-7 text-slate-300">
          Arsenal are used here as placeholder data. Replace the hardcoded content with a team selector and real team endpoint when ready.
        </p>
      </SectionCard>
    </div>
  )
}

export default TeamDetailsPage
