import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout() {
  // Controls the off-canvas sidebar on mobile and tablet screens.
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="app-shell min-h-screen xl:grid">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="min-w-0">
        <Topbar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onMenuToggle={() => setIsMobileSidebarOpen((open) => !open)}
        />
        <main className="px-4 pb-8 pt-6 md:px-6 xl:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
