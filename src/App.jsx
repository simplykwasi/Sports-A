import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'

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
const ValueBetsPage = lazy(() => import('./pages/ValueBetsPage'))
const OddsComparisonPage = lazy(() => import('./pages/OddsComparisonPage'))
const LiveAnalysisPage = lazy(() => import('./pages/LiveAnalysisPage'))
const MatchAnalyticsPage = lazy(() => import('./pages/MatchAnalyticsPage'))
const SavedBetsPage = lazy(() => import('./pages/SavedBetsPage'))
const BetHistoryPage = lazy(() => import('./pages/BetHistoryPage'))
const TeamAnalyticsPage = lazy(() => import('./pages/TeamAnalyticsPage'))
const PlayerStatsPage = lazy(() => import('./pages/PlayerStatsPage'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
        <p className="text-slate-400">Loading…</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes without layout */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with layout */}
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/matches" element={<UpcomingMatchesPage />} />
                <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
                <Route path="/league-standings" element={<LeagueStandingsPage />} />
                <Route path="/value-bets" element={<ValueBetsPage />} />
                <Route path="/odds-comparison" element={<OddsComparisonPage />} />
                <Route path="/live-analysis" element={<LiveAnalysisPage />} />
                <Route path="/match-analytics/:fixtureId" element={<MatchAnalyticsPage />} />
                <Route path="/saved-bets" element={<SavedBetsPage />} />
                <Route path="/bet-history" element={<BetHistoryPage />} />
                <Route path="/team-analytics/:teamId" element={<TeamAnalyticsPage />} />
                <Route path="/player-stats/:playerId" element={<PlayerStatsPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
