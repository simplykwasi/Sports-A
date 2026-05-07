import { useParams } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { useLiveMatchUpdates, usePredictionUpdates } from '../hooks/useRealtimeSubscription'

export default function MatchAnalyticsPage() {
  const { fixtureId } = useParams()
  const { liveEvents, isConnected } = useLiveMatchUpdates(fixtureId)
  const { prediction, marketData } = usePredictionUpdates(fixtureId)

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Match analytics"
        title={`Fixture ${fixtureId ?? '—'}`}
        description="Live Supabase channels stream predictions, markets, and pitch events for this fixture."
      />
      <div className="glass-panel px-4 py-6 md:px-8">
        <p className="text-sm text-slate-300">
          {prediction ? `Latest model update loaded (${prediction.model_name ?? 'model'}).` : 'Waiting for prediction rows…'}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Market ticks: {marketData.length} · Live events buffer: {liveEvents.length}
        </p>
        {isConnected ? (
          <p className="mt-4 text-sm font-medium text-brand-300">Realtime channel connected</p>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Connecting to realtime…</p>
        )}
      </div>
    </div>
  )
}
