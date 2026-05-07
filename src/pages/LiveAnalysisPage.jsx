import PageHero from '../components/ui/PageHero'

export default function LiveAnalysisPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Live"
        title="Live analysis hub"
        description="Track probability shifts and in-play signals while realtime fixtures stream through Supabase. Open any fixture analytics route for socket-backed telemetry."
      />
      <div className="glass-panel px-4 py-6 text-sm text-slate-300 md:px-8">
        <p>
          Connect Supabase replication slots for <code className="text-brand-300">live_events</code> and{' '}
          <code className="text-brand-300">predictions</code>, then drill into a fixture via Matches → Analyze for streaming
          updates.
        </p>
      </div>
    </div>
  )
}
