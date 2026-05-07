import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="app-shell grid min-h-screen bg-ink-950 text-slate-100 xl:grid-cols-[auto,1fr]">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col">
        <Topbar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onMenuToggle={() => setIsMobileSidebarOpen((open) => !open)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
