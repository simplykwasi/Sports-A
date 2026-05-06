import { useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';

export default function TeamAnalyticsPage() {
  const { teamId } = useParams();

  return (
    <div>
      <PageHero title="Team Analytics" subtitle={`Performance metrics for Team ${teamId}`} />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Team analytics loading...</p>
      </div>
    </div>
  );
}
