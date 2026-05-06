import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { useAuth } from '../hooks/useAuth'

// Registration page for new users.
function RegisterPage() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { hasAccount, isAuthReady, register } = useAuth()

  const handleCreateAccount = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    const result = await register(email, password, displayName)

    if (!result.ok) {
      setErrorMessage(result.error)
      setIsLoading(false)
      return
    }

    setErrorMessage('')
    navigate('/dashboard')
  }

  if (isAuthReady && hasAccount) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Register page"
        title="Create your Sports A account."
        description="Sign up now to start receiving value bet recommendations and live match analytics."
      />

      <SectionCard title="Register" description="Join Sports A to track value bets and get real-time betting insights.">
        <form className="grid gap-4 md:max-w-xl" onSubmit={handleCreateAccount}>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Display Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Your Name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Confirm Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-sm text-slate-300">
            Already registered?{' '}
            <Link to="/login" className="text-brand-300">
              Sign in here
            </Link>
          </p>
        </form>
      </SectionCard>
    </div>
  )
}

export default RegisterPage
