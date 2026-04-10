import { Link } from 'react-router-dom'

import PageHero from '../components/ui/PageHero'
import { useAuth } from '../hooks/useAuth'
import { notificationFeed } from '../data/mockData'

// Notifications page.
function NotificationsPage() {
  const { currentUser, hasAccount } = useAuth()
  const alertCount = notificationFeed.length

  if (!hasAccount) {
    return (
      <div className="section-shell">
        <PageHero
          eyebrow="Notifications"
          title="Notifications need an account"
          description="Sign in or create an account to unlock your personalized match alerts, odds movements, and favorite team updates."
        />

        <div className="grid gap-8 rounded-4xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/20">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">Stay on top of the action.</p>
            <p className="text-sm leading-7 text-slate-300">
              Sports A notifications are built to follow your teams, watch market moves, and highlight the best match opportunities.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Match alerts</p>
              <p className="mt-3 text-base font-semibold text-white">Live score updates and event triggers</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Odds moves</p>
              <p className="mt-3 text-base font-semibold text-white">Watch lines, value swings, and smart pushes</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Favorites</p>
              <p className="mt-3 text-base font-semibold text-white">Receive alerts for teams and leagues you care about</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/login" className="primary-button">
              Sign in to view alerts
            </Link>
            <Link to="/register" className="secondary-button">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Notifications"
        title={`Welcome back, ${currentUser.username}`}
        description="These are the latest alerts for your Sports A account. Keep this page open while matches and odds evolve."
      />

      <div className="grid gap-6">
        <div className="grid gap-4 rounded-4xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/20 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Alert center</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">You have {alertCount} notifications</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Your most important match alerts appear here first. Use this page to quickly scan new updates and stay ready.
            </p>
          </div>
          <div className="rounded-4xl bg-white/5 p-5 text-sm text-slate-300">
            <p className="font-semibold text-white">What this page does</p>
            <ul className="mt-4 space-y-3">
              <li>• Stores your account notifications in one place.</li>
              <li>• Shows the latest match, odds, and team updates.</li>
              <li>• Encourages you to keep your profile active.</li>
            </ul>
          </div>
        </div>

        {alertCount > 0 ? (
          <div className="grid gap-4">
            {notificationFeed.map((message, index) => (
              <article
                key={index}
                className="group rounded-4xl border border-white/10 bg-white/5 p-6 transition hover:border-brand-400/40 hover:bg-white/10"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Alert {index + 1}</p>
                    <p className="mt-3 text-lg font-semibold text-white">{message}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                    New
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Tap an alert to view it later or return when you need a quick refresh on the latest picks.
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-4xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">No new notifications yet</p>
            <p className="mt-3 text-sm leading-7">
              Your accounts alerts will appear here once match signals and odds updates are generated.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
