import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { adminCards } from '../data/mockData'

// Admin-only overview page.
function AdminPanelPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Admin panel"
        title="Monitor platform health, user growth, and feed quality."
        description="This route is designed for internal controls such as feed monitoring, user management, and moderation tools."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <SectionCard title="Operations notes" description="Future admin tools can live here: role management, API health, logs, and manual content overrides.">
        <p className="text-sm leading-7 text-slate-300">
          Keep sensitive admin-only components isolated in this route when authentication and permissions are implemented.
        </p>
      </SectionCard>
    </div>
  )
}

export default AdminPanelPage
