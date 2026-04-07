import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

function LoginPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Login page"
        title="Welcome back to Sports A."
        description="This screen is ready for future authentication wiring. For now it provides the styled shell and form structure."
      />

      <SectionCard title="Sign in" description="Edit these fields when you connect a real auth provider.">
        <form className="grid gap-4 md:max-w-xl">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email address</label>
            <input className="input-field" type="email" placeholder="analyst@sportsa.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input className="input-field" type="password" placeholder="Enter your password" />
          </div>
          <button type="button" className="primary-button">
            Sign in
          </button>
          <p className="text-sm text-slate-300">
            No account yet?{' '}
            <Link to="/register" className="text-brand-300">
              Create one here
            </Link>
          </p>
        </form>
      </SectionCard>
    </div>
  )
}

export default LoginPage
