import PageHero from '../components/ui/PageHero';
import { usePredictionUpdates, useliveLiveMatchUpdates } from '../hooks/useRealtimeSubscription';

export default function LiveAnalysisPage() {
  return (
    <div>
      <PageHero title="Live Analysis" subtitle="Real-time match updates and probability shifts" />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Live analysis loading...</p>
      </div>
    </div>
  );
}
