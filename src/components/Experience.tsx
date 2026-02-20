'use client'

import { motion } from 'framer-motion'

const experiences = [
  {
    company: 'Bheema Infotech Pvt. Ltd.',
    role: 'MERN Stack Developer Intern (Remote)',
    period: 'Nov 2025 - Jan 2026',
    location: 'Indore, India',
    side: 'right',
    color: 'accent-blue',
    description: 'Developed production-ready full-stack web applications using MongoDB, Express.js, React.js, and Node.js. Architected RESTful APIs with JWT authentication, role-based access control, and data validation. Optimized database queries improving performance by 40%. Integrated third-party services including payment gateways, OAuth systems, and notification services.',
  },
  {
    company: 'Nagmani International Pvt. Ltd.',
    role: 'Social Media Manager',
    period: 'March 2025 - May 2025',
    location: 'Kathmandu, Nepal',
    side: 'left',
    color: 'accent-purple',
    description: 'Managed multi-platform social media presence, increasing engagement rates by 35% through data-driven strategies. Created and edited multimedia content using Canva and CapCut, producing 50+ promotional videos and graphics. Analyzed social media metrics using analytics tools to optimize content performance and aligned digital campaigns with business objectives.',
  },
]

const colorDot: Record<string, string> = {
  'accent-blue': 'bg-accent-blue',
  'accent-purple': 'bg-accent-purple',
  'accent-emerald': 'bg-accent-emerald',
}
const colorBorder: Record<string, string> = {
  'accent-blue': 'border-accent-blue/30',
  'accent-purple': 'border-accent-purple/30',
  'accent-emerald': 'border-accent-emerald/30',
}

export function Experience() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-card/10 to-background/70" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">Work History</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-slate-100">
            Experience
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Real-world experience building and shipping production applications
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${exp.side === 'left' ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Card */}
                <div className={`w-full md:w-5/12 bg-background border ${colorBorder[exp.color]} rounded-2xl p-6 elevated-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-xl text-foreground">{exp.company}</h3>
                      <p className="text-blue-500 font-semibold text-sm mt-0.5">{exp.role}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${colorDot[exp.color]} animate-pulse`} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 font-medium">
                    📅 {exp.period} · 📍 {exp.location}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>

                {/* Center dot */}
                <div className={`hidden md:flex w-2/12 justify-center`}>
                  <div className={`w-5 h-5 rounded-full border-4 border-background ${colorDot[exp.color]} shadow-lg z-10`} />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
