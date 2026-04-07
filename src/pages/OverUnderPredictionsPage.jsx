import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

const overUnderRows = [
  { fixture: 'Arsenal vs Newcastle', call: 'Over 2.5', confidence: '67%' },
  { fixture: 'Real Sociedad vs Atletico Madrid', call: 'Under 2.5', confidence: '61%' },
  { fixture: 'Atalanta vs Roma', call: 'Over 2.5', confidence: '59%' },
]

function OverUnderPredictionsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Over/under predictions"
        title="Create a dedicated totals market page."
        description="This screen separates goal total opportunities from match result picks, which helps users scan faster."
      />

      <SectionCard title="Totals signals" description="Add projected goal lines, xG context, and line movement details here later.">
        <div className="grid gap-3">
          {overUnderRows.map((row) => (
            <div
              key={row.fixture}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-white">{row.fixture}</p>
                <p className="text-sm text-slate-300">{row.call}</p>
              </div>
              <p className="font-display text-2xl font-bold text-brand-300">{row.confidence}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default OverUnderPredictionsPage
