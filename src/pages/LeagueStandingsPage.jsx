import DataTable from '../components/ui/DataTable'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { standings } from '../data/mockData'

const standingsColumns = [
  { key: 'team', label: 'Team' },
  { key: 'points', label: 'Points' },
  { key: 'goalDiff', label: 'Goal diff' },
  { key: 'form', label: 'Recent form' },
]

function LeagueStandingsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="League standings"
        title="Track league position and pressure context."
        description="Standings matter for motivation, relegation risk, and title pressure. This route is ready for those tables."
      />

      <SectionCard title="Current table" description="Swap the sample rows for live league data when the backend is ready.">
        <DataTable columns={standingsColumns} rows={standings} />
      </SectionCard>
    </div>
  )
}

export default LeagueStandingsPage
