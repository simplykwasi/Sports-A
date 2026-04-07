import { FiMenu, FiUser, FiX } from 'react-icons/fi'
import BrandLogo from '../ui/BrandLogo'

// Top navigation bar shared across the app layout.
function Topbar({ isMobileSidebarOpen, onMenuToggle }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-ink-950/70 px-3 py-3 backdrop-blur md:px-6 md:py-4 xl:px-8">
      <div className="flex items-center justify-between gap-3">
        {/* Left side: mobile menu button + brand */}
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            className="secondary-button h-10 w-10 shrink-0 rounded-full p-0 md:h-12 md:w-12 xl:hidden"
            aria-label={isMobileSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isMobileSidebarOpen}
            onClick={onMenuToggle}
          >
            {isMobileSidebarOpen ? <FiX /> : <FiMenu />}
          </button>

          <BrandLogo
            size="sm"
            className="min-w-0"
            wordmarkClassName="min-w-0"
            titleClassName="truncate text-lg md:text-2xl"
            subtitleClassName="hidden md:block"
          />
        </div>

        {/* Right side: profile actions */}
        <div className="flex shrink-0 items-center gap-3">
          <button className="secondary-button h-10 w-10 rounded-full p-0 md:h-12 md:w-12" aria-label="User profile">
            <FiUser />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar
