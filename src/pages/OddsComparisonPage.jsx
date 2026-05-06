import PageHero from '../components/ui/PageHero';

export default function OddsComparisonPage() {
  return (
    <div>
      <PageHero title="Odds Comparison" subtitle="Compare our predictions against live bookmaker odds" />
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Odds comparison loading...</p>
      </div>
    </div>
  );
}
