import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import SectionCard from '../components/ui/SectionCard'

function RegisterPage() {
  return (
    <div className="section-shell">
      <PageHero
        eyebrow="Register page"
        title="Create your Sports A account."
        description="The registration form is separated and ready to connect to your backend once auth is added."
      />

      <SectionCard title="Register" description="Use this page for onboarding new users and plan selections later.">
        <form className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">First name</label>
            <input className="input-field" type="text" placeholder="Alex" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Last name</label>
            <input className="input-field" type="text" placeholder="Morgan" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Email address</label>
            <input className="input-field" type="email" placeholder="alex@sportsa.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input className="input-field" type="password" placeholder="Choose a password" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Favorite league</label>
            <select className="input-field" defaultValue="Premier League">
              <option>Premier League</option>
              <option>La Liga</option>
              <option>Serie A</option>
              <option>Bundesliga</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="button" className="primary-button">
              Create account
            </button>
          </div>
          <p className="text-sm text-slate-300 md:col-span-2">
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
