'use client'

import { Github } from 'lucide-react'

const projects = [
  {
    title: 'Skating Park Management System',
    category: 'MERN Stack',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Stripe API'],
    description: 'Production-grade skating park management platform actively used by a real client. Features automated session booking, real-time slot management, player tracking, and secure payment processing managing 500+ bookings monthly.',
    github: 'https://github.com/Pratik980/Skating-Park-Management',
    color: 'accent-blue',
  },
  {
    title: 'Prabin Institute Learning Platform',
    category: 'MERN Stack',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Payment Gateway'],
    description: 'Comprehensive e-learning platform for NEB exam preparation with video course delivery, progress tracking, secure payment processing with automated WhatsApp notifications, and scalable video streaming for 100+ hours of lessons.',
    github: 'https://github.com/Pratik980/prabin-institute-neb-courses',
    color: 'accent-purple',
  },
  {
    title: 'Mini Amazon E-Commerce',
    category: 'Full Stack',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'JWT'],
    description: 'Complete e-commerce application with user authentication, product catalog, cart, order management, and admin dashboard for inventory, user administration, order tracking, and sales analytics.',
    github: 'https://github.com/Pratik980/Mini-Amazon-MERN-Stack-E-Commerce-Application',
    color: 'accent-emerald',
  },
  {
    title: 'URJA Smart Energy Platform',
    category: 'ML & Analytics',
    tech: ['Node.js', 'MongoDB', 'Machine Learning', 'Chart.js'],
    description: 'Intelligent energy monitoring system with real-time consumption insights, AI-driven energy forecasting, interactive analytics dashboards, and gamification features targeting 20% energy cost reduction.',
    github: 'https://github.com/Pratik980/URJA---Smart-Energy-Analytics-Platform',
    color: 'accent-blue',
  },
  {
    title: 'GharNirman AI Contractor Evaluation',
    category: 'Machine Learning',
    tech: ['Node.js', 'MongoDB', 'Random Forest', 'Python'],
    description: 'AI-powered bid evaluation platform using Random Forest algorithm for contractor proposal analysis. Automated cost estimation with 85% prediction accuracy through feature engineering and model optimization.',
    github: 'https://github.com/Pratik980/GharNirman',
    color: 'accent-purple',
  },
  {
    title: 'Bhabhya Event Management',
    category: 'Full Stack',
    tech: ['PHP', 'MySQL', 'Google OAuth', 'Email API'],
    description: 'Full-featured event booking platform with real-time availability checking, automated email notifications, Google OAuth 2.0 integration, and comprehensive admin panel with analytics dashboard.',
    github: 'https://github.com/Pratik980/Bhabhya_Event',
    color: 'accent-emerald',
  },
  {
    title: 'Motosafa Waste Management',
    category: 'Mobile App',
    tech: ['GPS Tracking', 'SMS Integration', 'Multilingual'],
    description: 'Waste collection app with GPS-based real-time tracking, automated SMS alerts, multilingual support (English/Nepali), and promotional content that increased user downloads by 45%.',
    github: 'https://github.com/Pratik980/Motosafa-Waste-Management-System',
    color: 'accent-blue',
  },
  {
    title: 'Student Management System',
    category: 'Java',
    tech: ['Java', 'MySQL', 'JDBC'],
    description: 'Robust Java-based system with MySQL integration for managing student records, enrollment, and attendance. Normalized database schema with JDBC prepared statements preventing SQL injection.',
    github: 'https://github.com/Pratik980/StudentManagementSystem',
    color: 'accent-purple',
  },
]

const colorMap: Record<string, string> = {
  'accent-blue': 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  'accent-purple': 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  'accent-emerald': 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
}
const dotMap: Record<string, string> = {
  'accent-blue': 'bg-accent-blue',
  'accent-purple': 'bg-accent-purple',
  'accent-emerald': 'bg-accent-emerald',
}

export function Portfolio() {
  return (
    <section id="portfolio" className="relative py-16 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-card/10 to-background/70" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Projects Made</span>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 sm:mb-8 text-slate-100">
            <span className="block mb-2">Featured Projects</span>
          </h2>
          <p className="text-lg sm:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-2">
            A collection of projects that showcase my skills and passion for building great software.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-card clean-border rounded-xl sm:rounded-2xl p-4 sm:p-6 elevated-shadow hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              {/* Category badge */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${colorMap[project.color]}`}>
                  {project.category}
                </span>
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${dotMap[project.color]} animate-pulse`} />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 sm:mb-3">{project.title}</h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-5 flex-1 line-clamp-4 sm:line-clamp-none">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {project.tech.map(t => (
                  <span key={t} className="text-[10px] sm:text-xs bg-background border border-border rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-muted-foreground font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:opacity-80 gentle-animation"
                >
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View on GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
