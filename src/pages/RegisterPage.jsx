import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import BrandLogo from '../components/ui/BrandLogo'
import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { hasAccount, isAuthReady, register } = useAuth()

  const handleCreateAccount = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)

    const result = await register(email, password, username)

    if (!result.ok) {
      setErrorMessage(result.error)
      setIsLoading(false)
      return
    }

    navigate('/dashboard')
  }

  if (isAuthReady && hasAccount) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-2 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <BrandLogo size="lg" stacked className="mx-auto" />
          <h1 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
            Create your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Join Sports A to track matches, value bets, and live analysis from one focused workspace.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/25 sm:p-7">
          <form className="grid gap-5" onSubmit={handleCreateAccount}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="register-username">
                Username
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 focus-within:border-brand-400">
                <User className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <input
                  id="register-username"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  type="text"
                  placeholder="alex-morgan"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="register-email">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 focus-within:border-brand-400">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <input
                  id="register-email"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="register-password">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 focus-within:border-brand-400">
                <Lock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <input
                  id="register-password"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {errorMessage ? (
              <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errorMessage}
              </p>
            ) : null}

            <button type="submit" className="primary-button w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-300 transition hover:text-brand-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
