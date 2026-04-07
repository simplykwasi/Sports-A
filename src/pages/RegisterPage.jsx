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
        <form className="grid gap-4 md:max-w-xl">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Username</label>
            <input className="input-field" type="text" placeholder="sportsa_user" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Phone number</label>
            <input className="input-field" type="tel" placeholder="+234 801 234 5678" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input className="input-field" type="password" placeholder="Choose a password" />
          </div>
          <button type="button" className="primary-button">
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
