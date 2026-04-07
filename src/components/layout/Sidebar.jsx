import { NavLink } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { navigationGroups } from '../../data/navigation'
import BrandLogo from '../ui/BrandLogo'

function Sidebar({ isMobileOpen = false, onClose }) {
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
          'sidebar-shell fixed inset-y-0 left-0 z-40 flex h-screen w-[300px] max-w-[85vw] flex-col border-r border-white/10 bg-ink-950/95 px-3 py-4 backdrop-blur transition-transform duration-200 md:px-4 md:py-5 xl:sticky xl:top-0 xl:h-screen xl:w-auto xl:max-w-none xl:translate-x-0 xl:self-start xl:border-b-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="mb-5 flex items-center justify-between gap-2 md:gap-3 xl:mb-10">
          <BrandLogo
            size="sm"
            className="min-w-0"
            wordmarkClassName="sidebar-copy min-w-0"
            titleClassName="truncate text-lg md:text-2xl"
            subtitleClassName="hidden md:block"
          />
          <div className="flex items-center gap-2">
            <NavLink to="/" className="sidebar-action secondary-button px-4 py-2 text-sm" onClick={onClose}>
              Home
            </NavLink>
            <button
              type="button"
              className="secondary-button h-10 w-10 rounded-full p-0 xl:hidden"
              aria-label="Close sidebar"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="sidebar-scroll min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 xl:pr-2">
          {navigationGroups.map((group) => (
            <section key={group.title}>
              <p className="sidebar-copy mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {group.title}
              </p>
              <div className="grid gap-2">
                {group.links.map((link) => {
                  const Icon = link.icon

                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'sidebar-link flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition',
                          isActive
                            ? 'bg-brand-400 text-ink-950'
                            : 'bg-white/0 text-slate-200 hover:bg-white/6',
                        ].join(' ')
                      }
                    >
                      <Icon className="sidebar-icon shrink-0 text-base" />
                      <span className="sidebar-copy">{link.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
