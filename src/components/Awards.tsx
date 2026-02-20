'use client'

import { ExternalLink } from 'lucide-react'

const certifications = [
  {
    title: 'MERN Stack Internship',
    issuer: 'Bheema Infotech, Indore, India',
    date: 'Nov 2025',
    link: 'https://drive.google.com/file/d/1-V2ogiV3u5iumkEG806rrNsAjWclz24t/view?usp=sharing',
    color: 'accent-purple',
    subLinks: null,
  },
  {
    title: 'MERN Stack Development',
    issuer: 'Broadway Infosys, Kathmandu',
    date: 'March 2025',
    link: 'https://drive.google.com/file/d/1u31IUQS8PvX_q1RMDQCasQwv8pTe5HFn/view?usp=sharing',
    color: 'accent-blue',
    subLinks: null,
  },
  {
    title: 'Design Thinking Certification',
    issuer: 'Industry Certification',
    date: 'March 2025',
    link: 'https://drive.google.com/file/d/1B6rbz4vx7HGDkYUjcGEAjfo0zPQ6Hbrl/view?usp=sharing',
    color: 'accent-purple',
    subLinks: null,
  },
  {
    title: 'ORACLE Dev: Database Developers',
    issuer: 'Oracle Academy',
    date: 'July 2023',
    link: 'https://drive.google.com/file/d/1iNZPkP8osLsJm8na3cn111mG9ccCr_bm/view?usp=sharing',
    color: 'accent-emerald',
    subLinks: null,
  },
  {
    title: 'Network Technician Career Path',
    issuer: 'Cisco Networking Academy',
    date: 'June 2023',
    link: null,
    color: 'accent-blue',
    subLinks: [
      { label: 'Networking Devices & Initial Configuration', url: 'https://drive.google.com/file/d/1yfL7geiQsny-vYQfR6SSRkuki49qOI1D/view?usp=drive_link' },
      { label: 'Network Support and Security', url: 'https://drive.google.com/file/d/1aA9ITT-GBcT-vuJyQkKq4Atc3w-xvQl7/view?usp=drive_link' },
      { label: 'Network Addressing & Troubleshooting', url: 'https://drive.google.com/file/d/1ObxtRZIMMbwaMYBeSlPAkrwckTNvGZ4m/view?usp=sharing' },
      { label: 'Career Path Completion Certificate', url: 'https://drive.google.com/file/d/1svswNEdmB7DDGjXzwzJh0fF_1/view?usp=sharing' },
    ],
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

export function Awards() {
  return (
    <section id="certifications" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-card/15 to-background/70" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">Certifications</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-slate-100">
            Awards & Certifications
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Verified credentials and training from industry-leading platforms
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="group relative bg-background border border-border rounded-2xl p-6 shadow-md hover:scale-[1.02] transition-all duration-500 flex flex-col gap-4"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${colorMap[cert.color]} mb-3 inline-block`}>
                      {cert.date}
                    </span>
                    <h3 className="text-xl font-black text-foreground leading-tight">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${dotMap[cert.color]} animate-pulse`} />
                </div>

                {/* Single link */}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:underline text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" /> View Certificate
                  </a>
                )}

                {/* Sub-links for multi-cert */}
                {cert.subLinks && (
                  <ul className="space-y-2">
                    {cert.subLinks.map((sub, i) => (
                      <li key={i}>
                        <a
                          href={sub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:underline text-sm font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{sub.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
