import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UpcomingMatchesPage from './pages/UpcomingMatchesPage'
import MatchDetailsPage from './pages/MatchDetailsPage'
import LeagueStandingsPage from './pages/LeagueStandingsPage'
import UserProfilePage from './pages/UserProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import AdminPanelPage from './pages/AdminPanelPage'

// Edit routes here when adding, removing, or renaming pages.
const appRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/matches', element: <UpcomingMatchesPage /> },
  { path: '/matches/:matchId', element: <MatchDetailsPage /> },
  { path: '/league-standings', element: <LeagueStandingsPage /> },
  { path: '/profile', element: <UserProfilePage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/admin', element: <AdminPanelPage /> },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared app shell for pages that use the main sidebar/topbar layout. */}
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
