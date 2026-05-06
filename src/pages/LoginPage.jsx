import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import BrandLogo from '../components/ui/BrandLogo'

// Login screen for returning users.
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { hasAccount, isAuthReady, login } = useAuth()

  const handleSignIn = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)

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
    <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-6">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <p className="font-display text-4xl font-bold text-white md:text-5xl">
            Welcome back
          </p>
          <BrandLogo size="lg" stacked className="mx-auto mt-5" />
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Sign in to continue with your Sports A dashboard and betting analytics.
          </p>
        </div>

        <div className="glass-panel p-6 md:p-8">
          <form className="grid gap-4" onSubmit={handleSignIn}>
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
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
            <button type="submit" className="primary-button w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="flex flex-col gap-3 text-center">
              <button type="button" className="text-sm text-brand-300">
                Forgot password?
              </button>
              <p className="text-sm text-slate-300">
                If you dont have an account{' '}
                <Link to="/register" className="text-brand-300">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
