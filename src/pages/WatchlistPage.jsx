import PageHero from '../components/ui/PageHero';

export default function WatchlistPage() {
  return (
    <div>
      <PageHero title="Watchlist" subtitle="Monitor matches and teams you're interested in" />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Watchlist loading...</p>
      </div>
    </div>
  );
}
