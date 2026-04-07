import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { notificationFeed } from '../data/mockData'

function NotificationsPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Notifications"
        title="Collect important match and market alerts in one place."
        description="This route can later support read states, alert categories, push preferences, and odds movement triggers."
      />

      <SectionCard title="Alert feed" description="Good destination for real-time updates once the backend starts emitting events.">
        <div className="grid gap-3">
          {notificationFeed.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default NotificationsPage
