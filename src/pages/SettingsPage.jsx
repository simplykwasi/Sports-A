import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

// User/app settings page.
function SettingsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Settings"
        title="Control preferences for the app experience."
        description="Use this page for theme controls, timezone, favorite leagues, risk display preferences, and alert settings."
      />

      <SectionCard title="App preferences" description="Each preference block can become a real setting tied to the logged-in user later.">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Timezone</span>
            <select className="input-field" defaultValue="UTC">
              <option>UTC</option>
              <option>GMT+1</option>
              <option>GMT+2</option>
              <option>EST</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Default league</span>
            <select className="input-field" defaultValue="Premier League">
              <option>Premier League</option>
              <option>La Liga</option>
              <option>Serie A</option>
              <option>Bundesliga</option>
            </select>
          </label>
        </div>
      </SectionCard>
    </div>
  )
}

export default SettingsPage
