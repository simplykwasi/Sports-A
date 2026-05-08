import { NavLink } from 'react-router-dom'
import { Bell, Bookmark, Settings, User, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { navigationGroups } from '../../data/navigation'
import BrandLogo from '../ui/BrandLogo'

function Sidebar({ isMobileOpen = false, onClose }) {
  const { hasAccount } = useAuth()
  const accountLinks = hasAccount
    ? [
        { label: 'Profile', to: '/profile', icon: User },
        { label: 'Notifications', to: '/notifications', icon: Bell },
        { label: 'Favorites', to: '/favorites', icon: Bookmark },
        { label: 'Settings', to: '/settings', icon: Settings },
      ]
    : []

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={onClose}
        className={[
          'fixed inset-0 z-30 bg-ink-950/60 transition xl:hidden',
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <aside
        className={[
          'sidebar-shell fixed left-0 top-0 z-40 flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-slate-900 px-4 py-5 shadow-2xl shadow-black/20 transition-transform duration-200 xl:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="mb-5 flex items-center justify-between gap-2 md:gap-3 xl:mb-10">
          <BrandLogo
            size="sm"
            className="min-w-0"
            wordmarkClassName="min-w-0"
            titleClassName="truncate text-lg md:text-2xl"
            subtitleClassName="hidden md:block"
          />
          <div className="flex items-center gap-2">
            <NavLink to="/" className="secondary-button px-4 py-2 text-sm" onClick={onClose}>
              Home
            </NavLink>
            <button
              type="button"
              className="secondary-button h-10 w-10 rounded-full p-0 xl:hidden"
              aria-label="Close sidebar"
              onClick={onClose}
            >
              <X className="mx-auto h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="sidebar-scroll min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 xl:pr-2">
          {navigationGroups.map((group) => (
            <section key={group.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {group.title}
              </p>
              <div className="grid gap-2">
                {group.links.map((link) => {
                  const Icon = link.icon

                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'sidebar-link flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/70',
                          isActive
                            ? 'bg-brand-400 text-ink-950 shadow-lg shadow-brand-400/10'
                            : 'bg-white/0 text-slate-200 hover:bg-white/6',
                        ].join(' ')
                      }
                    >
                      <Icon className="sidebar-icon h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                      <span>{link.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </section>
          ))}

          {accountLinks.length > 0 ? (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Account
              </p>
              <div className="grid gap-2">
                {accountLinks.map((link) => {
                  const Icon = link.icon

                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'sidebar-link flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/70',
                          isActive
                            ? 'bg-brand-400 text-ink-950 shadow-lg shadow-brand-400/10'
                            : 'bg-white/0 text-slate-200 hover:bg-white/6',
                        ].join(' ')
                      }
                    >
                      <Icon className="sidebar-icon h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                      <span>{link.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
