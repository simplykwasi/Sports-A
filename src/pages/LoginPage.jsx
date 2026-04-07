import { Link } from 'react-router-dom'
import BrandLogo from '../components/ui/BrandLogo'

function LoginPage() {
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
          <form className="grid gap-4">
            {/* Login fields live here for future backend/auth integration. */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">Username</label>
              <input className="input-field" type="text" placeholder="sportsa_user" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input className="input-field" type="password" placeholder="Enter your password" />
            </div>
            <button type="button" className="primary-button w-full">
              Sign in
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
