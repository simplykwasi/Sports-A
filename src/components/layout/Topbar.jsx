import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiUser,
  FiUserPlus,
  FiX,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { navigationGroups } from '../../data/navigation'
import { matchListings } from '../../data/mockData'
import BrandLogo from '../ui/BrandLogo'

// Top navigation bar shared across the app layout.
function Topbar({ isMobileSidebarOpen, onMenuToggle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileMenuRef = useRef(null)
  const searchRef = useRef(null)
  const { currentUser, hasAccount, signOut } = useAuth()

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

  const navigate = useNavigate()

  const searchItems = useMemo(() => {
    const pageLinks = navigationGroups.flatMap((group) =>
      group.links.map((link) => ({
        id: `page-${link.to}`,
        title: link.label,
        helper: 'Page',
        to: link.to,
      })),
    )

    const accountLinks = hasAccount
      ? [
          { id: 'account-profile', title: 'Profile', helper: 'Account', to: '/profile' },
          { id: 'account-notifications', title: 'Notifications', helper: 'Account', to: '/notifications' },
          { id: 'account-favorites', title: 'Favorites', helper: 'Account', to: '/favorites' },
          { id: 'account-settings', title: 'Settings', helper: 'Account', to: '/settings' },
        ]
      : []

    const matchLinks = matchListings.map((match) => ({
      id: `match-${match.id}`,
      title: `${match.home.name} vs ${match.away.name}`,
      helper: `${match.league}`,
      to: `/matches/${match.id}`,
    }))

    return [...pageLinks, ...accountLinks, ...matchLinks]
  }, [hasAccount])

  const filteredSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return []
    }

    return searchItems.filter((item) =>
      `${item.title} ${item.helper}`.toLowerCase().includes(query),
    )
  }, [searchItems, searchQuery])

  const handleSearchToggle = () => {
    setIsProfileOpen(false)
    setIsSearchOpen((current) => !current)
  }

  const handleSearchKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return
    }

    const firstResult = filteredSearchItems[0]
    if (firstResult) {
      event.preventDefault()
      navigate(firstResult.to)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-ink-950/95 px-3 py-3 backdrop-blur transition-colors duration-200 sm:px-4 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="secondary-button h-10 w-10 rounded-full p-0 text-white transition hover:bg-white/10 xl:hidden"
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
            titleClassName="truncate text-lg font-semibold text-white md:text-xl"
            subtitleClassName="hidden text-sm text-slate-400 md:block"
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div ref={searchRef} className="relative w-full max-w-xs min-w-0 md:w-auto">
            <button
              type="button"
              onClick={handleSearchToggle}
              className="secondary-button flex h-10 w-10 items-center justify-center rounded-full p-0 transition hover:bg-white/10 md:h-11 md:w-11"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={isSearchOpen}
            >
              <FiSearch />
            </button>

            <div
              className={[
                'absolute left-0 right-0 z-50 mt-2 w-full origin-top rounded-3xl border border-white/10 bg-ink-950/95 p-3 shadow-2xl backdrop-blur transition-all duration-150',
                'md:left-auto md:right-0 md:w-88',
                isSearchOpen ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95',
              ].join(' ')}
            >
              <label className="sr-only" htmlFor="header-search">
                Search
              </label>
              <div className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3">
                <FiSearch className="text-slate-300" />
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search matches, teams, leagues..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-3 space-y-2">
                {searchQuery.trim() === '' ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                    Type a team, league, or page name to search.
                  </div>
                ) : filteredSearchItems.length > 0 ? (
                  <div className="grid gap-2 max-h-72 overflow-y-auto">
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
                    No results found for "{searchQuery.trim()}".
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              className="secondary-button flex h-10 items-center gap-2 rounded-full px-3 transition hover:bg-white/10 md:h-11"
              aria-label="User profile menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-sm md:h-9 md:w-9">
                <FiUser />
              </span>
              {hasAccount ? (
                <span className="hidden truncate text-sm text-white sm:block">
                  {currentUser.username}
                </span>
              ) : null}
              <FiChevronDown className={`text-sm text-slate-300 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 mt-2 min-w-55 rounded-3xl border border-white/10 bg-ink-950/95 p-3 shadow-2xl backdrop-blur">
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
