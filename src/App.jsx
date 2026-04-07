import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UpcomingMatchesPage from './pages/UpcomingMatchesPage'
import MatchDetailsPage from './pages/MatchDetailsPage'
import MatchAnalysisPage from './pages/MatchAnalysisPage'
import PredictionsPage from './pages/PredictionsPage'
import StatisticsPage from './pages/StatisticsPage'
import LeagueStandingsPage from './pages/LeagueStandingsPage'
import ResultsHistoryPage from './pages/ResultsHistoryPage'
import TeamDetailsPage from './pages/TeamDetailsPage'
import OddsComparisonPage from './pages/OddsComparisonPage'
import ValueBetsPage from './pages/ValueBetsPage'
import OverUnderPredictionsPage from './pages/OverUnderPredictionsPage'
import UserProfilePage from './pages/UserProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import AdminPanelPage from './pages/AdminPanelPage'

// Central route table so future edits stay in one easy-to-scan file.
const appRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/matches', element: <UpcomingMatchesPage /> },
  { path: '/matches/:matchId', element: <MatchDetailsPage /> },
  { path: '/match-analysis', element: <MatchAnalysisPage /> },
  { path: '/predictions', element: <PredictionsPage /> },
  { path: '/statistics', element: <StatisticsPage /> },
  { path: '/league-standings', element: <LeagueStandingsPage /> },
  { path: '/results-history', element: <ResultsHistoryPage /> },
  { path: '/team-details', element: <TeamDetailsPage /> },
  { path: '/odds-comparison', element: <OddsComparisonPage /> },
  { path: '/value-bets', element: <ValueBetsPage /> },
  { path: '/over-under-predictions', element: <OverUnderPredictionsPage /> },
  { path: '/profile', element: <UserProfilePage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/admin', element: <AdminPanelPage /> },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
