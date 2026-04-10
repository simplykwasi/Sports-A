import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import PageHero from '../components/ui/PageHero'
import { useAuth } from '../hooks/useAuth'

// User profile page.
function UserProfilePage() {
  const { currentUser, hasAccount, updateProfile } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (currentUser) {
      setPhoneNumber(currentUser.phoneNumber || '')
    }
  }, [currentUser])

  if (!hasAccount) {
    return (
      <div className="section-shell">
        <PageHero
          eyebrow="User profile"
          title="No profile found."
          description="Sign in or create an account to see your Sports A profile details."
        />

        <div className="grid gap-6 rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-md text-center">
          <p className="text-base leading-7 text-slate-300">
            A Sports A account gives you access to saved preferences, favorites, and personalized match insights.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/login" className="primary-button">
              Sign in
            </Link>
            <Link to="/register" className="secondary-button">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSaveProfile = (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!phoneNumber.trim()) {
      setErrorMessage('Phone number is required.')
      return
    }

    if (password && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    const result = updateProfile({ phoneNumber, password })

    if (!result.ok) {
      setErrorMessage(result.error || 'Unable to save profile at this time.')
      return
    }

    setPassword('')
    setConfirmPassword('')
    setSuccessMessage('Your profile has been updated successfully.')
  }

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="User profile"
        title={`${currentUser.username}'s profile`}
        description="Update your account details and keep your Sports A profile up to date."
      />

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-linear-to-br from-slate-950/90 via-slate-900/90 to-ink-950/90 p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.84)]">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-400/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

          <div className="relative grid gap-6">
            <div className="flex flex-col gap-4 rounded-4xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-400/15 text-3xl font-bold text-brand-300">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Profile</p>
                  <h2 className="text-3xl font-semibold text-white">{currentUser.username}</h2>
                  <p className="mt-2 text-sm text-slate-300">Active Sports A member since {new Date(currentUser.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Status</p>
                <p className="mt-3 text-lg font-semibold text-white">Signed in</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Phone</p>
                <p className="mt-3 text-lg font-semibold text-white">{currentUser.phoneNumber}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Joined</p>
                  <p className="mt-3 text-lg font-semibold text-white">{new Date(currentUser.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-4xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Saved preferences</p>
                <p className="mt-3 text-lg font-semibold text-white">Sporting preferences, favorites, and alerts</p>
              </div>
              <div className="rounded-4xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Next goal</p>
                <p className="mt-3 text-lg font-semibold text-white">Keep your contact info current</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.84)]">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Profile editor</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Update your account</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Save your latest contact details and optionally change your password. Username is fixed for security.
            </p>
          </div>

          <form className="grid gap-5" onSubmit={handleSaveProfile}>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Username</label>
              <input
                className="input-field"
                type="text"
                value={currentUser.username}
                readOnly
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Phone number</label>
              <input
                className="input-field"
                type="tel"
                placeholder="+234 801 234 5678"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">New password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Confirm password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" className="primary-button">
                Save changes
              </button>
              <Link to="/dashboard" className="secondary-button">
                Back to dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
