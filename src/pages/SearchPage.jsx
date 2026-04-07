import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

function SearchPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Search"
        title="Find teams, leagues, matches, and betting markets quickly."
        description="This page is ready for global search results, recent searches, and type-ahead suggestions."
      />

      <SectionCard title="Search workspace" description="Connect this input to your data source when search is ready.">
        <div className="grid gap-4">
          <input className="input-field" type="search" placeholder="Search for Arsenal, Premier League, BTTS..." />
          <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-300">
            Search results will appear here once wired to real match and team data.
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default SearchPage
