import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminPanelPage from './pages/AdminPanelPage'
import BetHistoryPage from './pages/BetHistoryPage'
import DashboardPage from './pages/DashboardPage'
import FavoritesPage from './pages/FavoritesPage'
import LandingPage from './pages/LandingPage'
import LeagueStandingsPage from './pages/LeagueStandingsPage'
import LiveAnalysisPage from './pages/LiveAnalysisPage'
import LoginPage from './pages/LoginPage'
import MatchAnalyticsPage from './pages/MatchAnalyticsPage'
import MatchDetailsPage from './pages/MatchDetailsPage'
import NotificationsPage from './pages/NotificationsPage'
import OddsComparisonPage from './pages/OddsComparisonPage'
import PlayerStatsPage from './pages/PlayerStatsPage'
import RegisterPage from './pages/RegisterPage'
import SavedBetsPage from './pages/SavedBetsPage'
import SettingsPage from './pages/SettingsPage'
import TeamAnalyticsPage from './pages/TeamAnalyticsPage'
import UpcomingMatchesPage from './pages/UpcomingMatchesPage'
import UserProfilePage from './pages/UserProfilePage'
import ValueBetsPage from './pages/ValueBetsPage'
import WatchlistPage from './pages/WatchlistPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/matches" element={<UpcomingMatchesPage />} />
          <Route path="/match/:id" element={<MatchDetailsPage />} />
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
