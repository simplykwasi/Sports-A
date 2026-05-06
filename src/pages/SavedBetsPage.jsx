import PageHero from '../components/ui/PageHero';

export default function SavedBetsPage() {
  return (
    <div>
      <PageHero title="Saved Bets" subtitle="Your personally saved betting picks" />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Saved bets loading...</p>
      </div>
    </div>
  );
}
