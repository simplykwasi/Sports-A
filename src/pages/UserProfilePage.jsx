import { Link } from 'react-router-dom'

import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { useAuth } from '../hooks/useAuth'

// User profile page.
function UserProfilePage() {
  const { currentUser, hasAccount } = useAuth()

  if (!hasAccount) {
    return (
      <div className="section-shell">
        <PageHero
          eyebrow="User profile"
          title="No profile found."
          description="Sign in or create an account to see your Sports A profile details."
        />

        <SectionCard title="Get started" description="Use the account pages below to access your profile.">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className="primary-button">
              Sign in
            </Link>
            <Link to="/register" className="secondary-button">
              Sign up
            </Link>
          </div>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="User profile"
        title={`${currentUser.username}'s profile`}
        description="These details come from the shared auth session and registered account data."
      />

      <SectionCard title="Profile details" description="Edit this section later when backend profile settings are connected.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Username</p>
            <p className="mt-2 text-lg font-semibold text-white">{currentUser.username}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Phone number</p>
            <p className="mt-2 text-lg font-semibold text-white">{currentUser.phoneNumber}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Account status</p>
            <p className="mt-2 text-lg font-semibold text-white">Signed in</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Member since</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {new Date(currentUser.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default UserProfilePage
