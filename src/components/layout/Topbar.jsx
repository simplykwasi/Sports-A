import { FiBell, FiMenu, FiSearch, FiUser, FiX } from 'react-icons/fi'

function Topbar({ isMobileSidebarOpen, onMenuToggle }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-ink-950/70 px-4 py-4 backdrop-blur md:px-6 xl:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="secondary-button h-12 w-12 shrink-0 rounded-full p-0 xl:hidden"
            aria-label={isMobileSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isMobileSidebarOpen}
            onClick={onMenuToggle}
          >
            {isMobileSidebarOpen ? <FiX /> : <FiMenu />}
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
              Frontend foundation
            </p>
            <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
              Sports betting analytics UI
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <FiSearch />
            <input
              type="text"
              className="w-full bg-transparent outline-none md:w-56"
              placeholder="Search matches, leagues, teams"
            />
          </label>

          <div className="flex items-center gap-3">
            <button className="secondary-button h-12 w-12 rounded-full p-0" aria-label="Notifications">
              <FiBell />
            </button>
            <button className="secondary-button h-12 w-12 rounded-full p-0" aria-label="User profile">
              <FiUser />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
