import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute() {
  const { currentUser, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
          <p className="text-sm text-slate-400">Loading session…</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export { ProtectedRoute }
export default ProtectedRoute
