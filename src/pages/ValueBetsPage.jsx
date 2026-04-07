import DataTable from '../components/ui/DataTable'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { oddsRows } from '../data/mockData'

const valueColumns = [
  { key: 'market', label: 'Value bet' },
  { key: 'bookmaker', label: 'Best book' },
  { key: 'odds', label: 'Price' },
  { key: 'edge', label: 'Model edge' },
]

function ValueBetsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Value bets"
        title="Highlight wagers where your probability beats the market."
        description="This route is ideal for ranked bet recommendations with filters by league, confidence, and edge percentage."
      />

      <SectionCard title="Value board" description="Future logic can sort by strongest edge, risk, or expected return.">
        <DataTable columns={valueColumns} rows={oddsRows} />
      </SectionCard>
    </div>
  )
}

export default ValueBetsPage
