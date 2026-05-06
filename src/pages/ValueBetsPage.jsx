import PageHero from '../components/ui/PageHero';

export default function ValueBetsPage() {
  return (
    <div>
      <PageHero title="Value Bets" subtitle="Bets where our AI probability beats bookmaker odds by 5%+" />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Value bets loading...</p>
      </div>
    </div>
  );
}
