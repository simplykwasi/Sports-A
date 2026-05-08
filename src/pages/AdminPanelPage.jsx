import { useState } from 'react'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import StatCard from '../components/ui/StatCard'
import { adminCards } from '../data/mockData'
import { fetchMatches } from '../services/sportsApi'

// Admin-only overview page.
function AdminPanelPage() {
  const [syncState, setSyncState] = useState({
    isSyncing: false,
    message: '',
    error: '',
  })

  const handleSyncMatches = async () => {
    setSyncState({ isSyncing: true, message: '', error: '' })

    const result = await fetchMatches()

    if (result.error) {
      setSyncState({
        isSyncing: false,
        message: `Loaded ${result.data.length} cached match rows from Supabase.`,
        error: result.error.message || 'API-Football sync failed.',
      })
      return
    }

    setSyncState({
      isSyncing: false,
      message: `Synced ${result.synced} match rows from API-Football.`,
      error: '',
    })
  }

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

      <SectionCard
        title="Temporary match sync"
        description="Fetch today's API-Football live and upcoming fixtures, then upsert them into the Supabase matches table."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">
              This button is for development seeding and should be removed once backend scheduled sync is active.
            </p>
            {syncState.message ? <p className="mt-2 text-sm text-brand-300">{syncState.message}</p> : null}
            {syncState.error ? <p className="mt-2 text-sm text-amber-300">{syncState.error}</p> : null}
          </div>
          <button
            type="button"
            className="primary-button shrink-0"
            onClick={handleSyncMatches}
            disabled={syncState.isSyncing}
          >
            {syncState.isSyncing ? 'Syncing...' : 'Sync matches'}
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

export default AdminPanelPage
