import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { quickStats } from '../data/mockData'

// Standalone match analysis page.
function MatchAnalysisPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Match analysis"
        title="Break down each fixture with context that explains the prediction."
        description="This page is structured for head-to-head data, form comparisons, injuries, xG, and home-away split analysis."
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Team form snapshot" description="Good place for recent results, possession trends, and attacking output.">
          <div className="grid gap-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Narrative notes" description="Use this block later for injuries, tactical concerns, and analyst comments.">
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>Home side is generating stronger xG in the last five fixtures and creating more chances from open play.</p>
            <p>Away side is vulnerable defending transitions and has allowed multiple big chances in three straight matches.</p>
            <p>Market price still looks slightly soft compared with the model expectation.</p>
          </div>
        </SectionCard>
      </section>
    </div>
  )
}

export default MatchAnalysisPage
