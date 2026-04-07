import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { savedMatches } from '../data/mockData'

// Saved matches page.
function FavoritesPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Favorites"
        title="Save the matches and teams you want to monitor closely."
        description="Favorites are useful for personalized dashboards, alerts, and faster repeat analysis."
      />

      <SectionCard title="Saved matches" description="You can expand this later with folders, notes, and reminder toggles.">
        <div className="grid gap-3">
          {savedMatches.map((match) => (
            <div key={match} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
              {match}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default FavoritesPage
