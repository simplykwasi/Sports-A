import { useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';

export default function PlayerStatsPage() {
  const { playerId } = useParams();

  return (
    <div>
      <PageHero title="Player Stats" subtitle={`Detailed statistics for Player ${playerId}`} />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Player stats loading...</p>
      </div>
    </div>
  );
}
