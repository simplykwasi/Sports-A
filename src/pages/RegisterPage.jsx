import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'
import { useAuth } from '../hooks/useAuth'

// Registration page for new users.
function RegisterPage() {
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { hasAccount, isAuthReady, register } = useAuth()

  const handleCreateAccount = (event) => {
    event.preventDefault()

    const result = register({ username, phoneNumber, password })

    if (!result.ok) {
      setErrorMessage(result.error)
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
        description="The registration form is separated and ready to connect to your backend once auth is added."
      />

      <SectionCard title="Register" description="Use this page for onboarding new users and plan selections later.">
        <form className="grid gap-4 md:max-w-xl" onSubmit={handleCreateAccount}>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Username</label>
            <input
              className="input-field"
              type="text"
              placeholder="sportsa_user"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
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
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
          <button type="submit" className="primary-button">
            Create account
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
