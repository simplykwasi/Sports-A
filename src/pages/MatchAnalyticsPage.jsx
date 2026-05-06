import { useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { usePredictionUpdates, useliveLiveMatchUpdates } from '../hooks/useRealtimeSubscription';

export default function MatchAnalyticsPage() {
  const { fixtureId } = useParams();
  const { liveEvents, isConnected } = useliveLiveMatchUpdates(fixtureId);
  const { prediction, marketData } = usePredictionUpdates(fixtureId);

  return (
    <div>
      <PageHero title="Match Analytics" subtitle={`Real-time analysis for Fixture ${fixtureId}`} />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Match analytics loading...</p>
        {isConnected && <p className="text-green-600">WebSocket Connected</p>}
      </div>
    </div>
  );
}
