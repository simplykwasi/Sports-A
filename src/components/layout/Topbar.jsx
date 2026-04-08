import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiBell,
  FiBookmark,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
  FiUserPlus,
  FiX,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { navigationGroups } from '../../data/navigation'
import { matchListings } from '../../data/mockData'
import BrandLogo from '../ui/BrandLogo'

const signedInMenuLinks = [
  { label: 'Profile', to: '/profile', icon: FiUser },
  { label: 'Notifications', to: '/notifications', icon: FiBell },
  { label: 'Favorites', to: '/favorites', icon: FiBookmark },
  { label: 'Settings', to: '/settings', icon: FiSettings },
  { label: 'Admin Panel', to: '/admin', icon: FiShield },
]

// Top navigation bar shared across the app layout.
function Topbar({ isMobileSidebarOpen, onMenuToggle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileMenuRef = useRef(null)
  const searchRef = useRef(null)
  const { currentUser, hasAccount, signOut } = useAuth()

  const quickSearchItems = useMemo(() => {
    const routeItems = navigationGroups.flatMap((group) =>
      group.links.map((link) => ({
        id: `route-${link.to}`,
        title: link.label,
        helper: 'Page',
        to: link.to,
      })),
    )

    const accountItems = signedInMenuLinks.map((link) => ({
      id: `account-${link.to}`,
      title: link.label,
      helper: 'Account',
      to: link.to,
    }))

    const matchItems = matchListings.map((match) => ({
      id: `match-${match.id}`,
      title: `${match.home.name} vs ${match.away.name}`,
      helper: `${match.league} • ${match.kickoff}`,
      to: `/matches/${match.id}`,
    }))

    return [...routeItems, ...accountItems, ...matchItems]
  }, [])

  const filteredSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return quickSearchItems.slice(0, 6)
    }

    return quickSearchItems
      .filter((item) => `${item.title} ${item.helper}`.toLowerCase().includes(query))
      .slice(0, 8)
  }, [quickSearchItems, searchQuery])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false)
      }

      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    setIsProfileOpen(false)
  }

  const handleSearchToggle = () => {
    setIsProfileOpen(false)
    setIsSearchOpen((current) => !current)
  }

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
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div ref={searchRef} className="relative flex items-center">
            <button
              type="button"
              onClick={handleSearchToggle}
              className="secondary-button flex h-10 w-10 items-center justify-center rounded-full p-0 md:h-12 md:w-12"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={isSearchOpen}
            >
              <FiSearch />
            </button>

            <div
              className={[
                'absolute right-0 top-[calc(100%+0.75rem)] w-[min(22rem,88vw)] origin-top-right rounded-3xl border border-white/10 bg-ink-950/95 p-3 shadow-2xl backdrop-blur transition-all duration-200',
                isSearchOpen
                  ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
              ].join(' ')}
            >
              {/* Edit the temporary quick-search experience here. */}
              <label className="sr-only" htmlFor="header-search">
                Search
              </label>
              <div className="flex h-11 items-center gap-2 rounded-full border border-brand-300/20 bg-white/8 px-3">
                <FiSearch className="shrink-0 text-slate-300" />
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search matches, teams, leagues..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-3 space-y-2">
                <p className="px-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Quick results
                </p>

                {filteredSearchItems.length ? (
                  <div className="grid gap-2">
                    {filteredSearchItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.to}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery('')
                        }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                      >
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.helper}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                    No quick result found yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              className="secondary-button flex h-10 items-center gap-2 rounded-full px-3 md:h-12 md:px-4"
              aria-label="User profile menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-sm md:h-9 md:w-9">
                <FiUser />
              </span>
              {hasAccount ? (
                <span className="hidden max-w-32 truncate text-sm text-white sm:block">
                  {currentUser.username}
                </span>
              ) : null}
              <FiChevronDown className="text-sm text-slate-300" />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-white/10 bg-ink-950/95 p-3 shadow-2xl backdrop-blur">
                {hasAccount ? (
                  <div className="space-y-3">
                    <div className="border-b border-white/8 pb-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="mt-2 block truncate font-semibold text-white transition hover:text-brand-300"
                      >
                        {currentUser.username}
                      </Link>
                    </div>

                    <div className="grid gap-2">
                      {signedInMenuLinks.map((link) => {
                        const Icon = link.icon

                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            <Icon />
                            {link.label}
                          </Link>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <FiLogOut />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm leading-6 text-slate-300">
                      Sign in or create an account to access your Sports A profile.
                    </p>

                    <div className="grid gap-2">
                      <Link
                        to="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-brand-400 px-4 py-3 text-sm font-semibold text-ink-950 transition hover:bg-brand-300"
                      >
                        <FiUser />
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        <FiUserPlus />
                        Sign up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
