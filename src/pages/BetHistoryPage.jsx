import PageHero from '../components/ui/PageHero';

export default function BetHistoryPage() {
  return (
    <div>
      <PageHero title="Bet History" subtitle="Track your past predictions and outcomes" />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Bet history loading...</p>
      </div>
    </div>
  );
}
