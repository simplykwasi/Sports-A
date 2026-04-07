import DataTable from '../components/ui/DataTable'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

const resultColumns = [
  { key: 'date', label: 'Date' },
  { key: 'fixture', label: 'Fixture' },
  { key: 'score', label: 'Score' },
  { key: 'market', label: 'Winning market' },
]

const resultRows = [
  { date: '2026-04-04', fixture: 'Arsenal vs Chelsea', score: '2-1', market: 'Home win' },
  { date: '2026-04-03', fixture: 'Milan vs Lazio', score: '1-1', market: 'Under 2.5' },
  { date: '2026-04-02', fixture: 'Barcelona vs Betis', score: '3-1', market: 'Over 2.5' },
]

function ResultsHistoryPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Results history"
        title="Review previous fixtures and how predictions performed."
        description="Historical result tracking is useful for model validation, edge tracking, and user trust."
      />

      <SectionCard title="Recent completed matches" description="This table is ready for backtesting views and performance metrics later.">
        <DataTable columns={resultColumns} rows={resultRows} />
      </SectionCard>
    </div>
  )
}

export default ResultsHistoryPage
