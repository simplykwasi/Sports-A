import DataTable from '../components/ui/DataTable'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { oddsRows } from '../data/mockData'

const oddsColumns = [
  { key: 'market', label: 'Market' },
  { key: 'bookmaker', label: 'Bookmaker' },
  { key: 'odds', label: 'Odds' },
  { key: 'edge', label: 'Edge' },
]

function OddsComparisonPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Odds comparison"
        title="Compare bookmaker prices against model expectations."
        description="This page is built for live odds tables, price movement tracking, and identifying soft markets."
      />

      <SectionCard title="Current odds table" description="Hook this into bookmaker feeds when your data layer is ready.">
        <DataTable columns={oddsColumns} rows={oddsRows} />
      </SectionCard>
    </div>
  )
}

export default OddsComparisonPage
