import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { DataTableSkeleton } from './components/ui/LoadingSkeletons'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UpcomingMatchesPage = lazy(() => import('./pages/UpcomingMatchesPage'))
const MatchDetailsPage = lazy(() => import('./pages/MatchDetailsPage'))
const LeagueStandingsPage = lazy(() => import('./pages/LeagueStandingsPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'))

// Additional pages for 20-page frontend
const ValueBetsPage = lazy(() => import('./pages/ValueBetsPage'))
const OddsComparisonPage = lazy(() => import('./pages/OddsComparisonPage'))
const LiveAnalysisPage = lazy(() => import('./pages/LiveAnalysisPage'))
const MatchAnalyticsPage = lazy(() => import('./pages/MatchAnalyticsPage'))
const SavedBetsPage = lazy(() => import('./pages/SavedBetsPage'))
const BetHistoryPage = lazy(() => import('./pages/BetHistoryPage'))
const TeamAnalyticsPage = lazy(() => import('./pages/TeamAnalyticsPage'))
const PlayerStatsPage = lazy(() => import('./pages/PlayerStatsPage'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'))

// Loading component
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400 mx-auto"></div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )
}

// Public routes (no auth required)
const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]

// Protected routes (auth required)
const protectedRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/matches', element: <UpcomingMatchesPage /> },
  { path: '/matches/:matchId', element: <MatchDetailsPage /> },
  { path: '/league-standings', element: <LeagueStandingsPage /> },
  { path: '/value-bets', element: <ValueBetsPage /> },
  { path: '/odds-comparison', element: <OddsComparisonPage /> },
  { path: '/live-analysis', element: <LiveAnalysisPage /> },
  { path: '/match-analytics/:fixtureId', element: <MatchAnalyticsPage /> },
  { path: '/saved-bets', element: <SavedBetsPage /> },
  { path: '/bet-history', element: <BetHistoryPage /> },
  { path: '/team-analytics/:teamId', element: <TeamAnalyticsPage /> },
  { path: '/player-stats/:playerId', element: <PlayerStatsPage /> },
  { path: '/watchlist', element: <WatchlistPage /> },
  { path: '/profile', element: <UserProfilePage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/admin', element: <AdminPanelPage /> },
]

function App() {
  return (
    <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              {publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}

              {/* Protected routes with app layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {protectedRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
