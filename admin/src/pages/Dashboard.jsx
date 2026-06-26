import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { FolderGit2, Wrench, Briefcase, MessageSquare, MessageCircle, User, Code2, GraduationCap, Layout, Navigation, Search, Phone, Shield } from 'lucide-react'

const statCards = [
  { label: 'Projects', key: 'projects', icon: FolderGit2, link: '/projects' },
  { label: 'Skills', key: 'skills', icon: Wrench, link: '/skills' },
  { label: 'Experience', key: 'experience', icon: Briefcase, link: '/experience' },
  { label: 'Testimonials', key: 'testimonials', icon: MessageSquare, link: '/testimonials' },
  { label: 'New Messages', key: 'new_messages', icon: MessageCircle, link: '/messages' },
]

const quickLinks = [
  { label: 'Hero Section', icon: User, link: '/hero' },
  { label: 'About Section', icon: Code2, link: '/about' },
  { label: 'Education', icon: GraduationCap, link: '/education' },
  { label: 'Services', icon: Layout, link: '/services' },
  { label: 'Navbar', icon: Navigation, link: '/navbar' },
  { label: 'Footer', icon: Layout, link: '/footer' },
  { label: 'SEO', icon: Search, link: '/seo' },
  { label: 'Contact Info', icon: Phone, link: '/contact' },
  { label: 'Settings', icon: Shield, link: '/change-password' },
]

async function getCount(table, filter = null) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) query = query.eq(filter.key, filter.value)
  const { count } = await query
  return count || 0
}

async function fetchRecentMessages() {
  const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5)
  return data || []
}

export default function Dashboard() {
  const { data: counts } = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: async () => ({
      projects: await getCount('projects'),
      skills: await getCount('skills'),
      experience: await getCount('experience'),
      testimonials: await getCount('testimonials'),
      new_messages: await getCount('contact_submissions', { key: 'status', value: 'new' }),
    }),
    refetchInterval: 30000,
  })

  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: fetchRecentMessages,
    refetchInterval: 30000,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link key={card.key} to={card.link}>
            <StatCard icon={card.icon} label={card.label} value={counts?.[card.key] ?? '...'} className="hover:border-primary/50 transition-colors cursor-pointer" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Messages</h2>
          {recentMessages?.length ? (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{msg.name}</p>
                    <p className="text-xs text-muted-foreground">{msg.subject || 'No subject'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    msg.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                    msg.status === 'read' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Links</h2>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.link}
                to={link.link}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
