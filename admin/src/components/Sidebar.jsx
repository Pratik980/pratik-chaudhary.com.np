import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  LayoutDashboard, User, Code2, FolderGit2, Briefcase, GraduationCap,
  Wrench, MessageSquare, Phone, Menu, ChevronLeft, Navigation, Layout,
  Search, Shield, MessageCircle, Award
} from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hero', icon: User, label: 'Hero' },
  { to: '/about', icon: Code2, label: 'About' },
  { to: '/skills', icon: Wrench, label: 'Skills' },
  { to: '/projects', icon: FolderGit2, label: 'Projects' },
  { to: '/experience', icon: Briefcase, label: 'Experience' },
  { to: '/education', icon: GraduationCap, label: 'Education' },
  { to: '/services', icon: Layout, label: 'Services' },
  { to: '/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { to: '/contact', icon: Phone, label: 'Contact' },
  { to: '/navbar', icon: Navigation, label: 'Navbar' },
  { to: '/footer', icon: Layout, label: 'Footer' },
  { to: '/certifications', icon: Award, label: 'Certifications' },
  { to: '/seo', icon: Search, label: 'SEO' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/change-password', icon: Shield, label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnread = async () => {
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
    setUnreadCount(count || 0)
  }

  useEffect(() => {
    fetchUnread()
    const channel = supabase
      .channel('submissions-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, fetchUnread)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && <span className="font-bold text-foreground text-lg">Portfolio CMS</span>}
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground">
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1">{item.label}</span>
            )}
            {!collapsed && item.label === 'Messages' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
