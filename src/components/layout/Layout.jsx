import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col xl:pl-72">
        <Topbar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onMenuToggle={() => setIsMobileSidebarOpen((open) => !open)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div key={location.pathname} className="page-fade">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
