import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'

export default function Topbar({ sidebarCollapsed }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('admin-theme') !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('admin-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <header className={cn(
      "fixed top-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 transition-all duration-300 z-40",
      sidebarCollapsed ? "left-16" : "left-64"
    )}>
      <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <span className="text-sm text-muted-foreground">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-md hover:opacity-90"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  )
}
