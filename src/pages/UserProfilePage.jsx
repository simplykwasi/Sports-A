import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

// User profile page.
function UserProfilePage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="User profile"
        title="Manage the bettor profile and personalization layer."
        description="Use this route for account details, subscription state, preferred leagues, and saved betting settings."
      />

      <SectionCard title="Profile details" description="These blocks can later become editable profile settings and billing controls.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Username</p>
            <p className="mt-2 text-lg font-semibold text-white">dataedge_fc</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Plan</p>
            <p className="mt-2 text-lg font-semibold text-white">Pro Analyst</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default UserProfilePage
