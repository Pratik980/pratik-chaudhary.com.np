import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { cn } from '../lib/utils'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Topbar sidebarCollapsed={collapsed} />
      <main className={cn(
        "pt-24 pb-6 px-6 min-h-screen transition-all duration-300",
        collapsed ? "ml-16" : "ml-64"
      )}>
        <Outlet />
      </main>
    </div>
  )
}
