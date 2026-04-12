import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AppLayout from './components/layout/AppLayout'

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Shared app shell for pages that use the main sidebar/topbar layout. */}
          <Route element={<AppLayout />}>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
