'use client'

import { useQuery } from '@tanstack/react-query'
import { Github, Linkedin, Twitter, Send, Instagram } from 'lucide-react'
import { getFooter, getSocialLinks, getNavbar } from '@/api/portfolio'

const fallbackLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#portfolio', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
]

const fallbackTech = [
  'ReactJS', 'NodeJS', 'MongoDB', 'ExpressJS',
  'Python', 'JavaScript', 'TypeScript', 'TailwindCSS',
  'MySQL', 'Firebase', 'Git', 'Postman',
]

const footerIcons = { Github, Linkedin, Twitter, Send, Instagram } as const

export function Footer() {
  const { data: footer } = useQuery({ queryKey: ['footer'], queryFn: getFooter })
  const { data: socialsData } = useQuery({ queryKey: ['socials-footer'], queryFn: getSocialLinks })
  const { data: navbar } = useQuery({ queryKey: ['navbar-footer'], queryFn: getNavbar })

  const quickLinks = navbar?.nav_links?.length
    ? navbar.nav_links.map((l) => ({ href: l.href, label: l.label }))
    : fallbackLinks

  const techStack = footer?.tech_stack?.length ? footer.tech_stack : fallbackTech

  const socialItems = socialsData?.length
    ? socialsData.map((s) => {
        const Icon = footerIcons[s.icon as keyof typeof footerIcons]
        return { href: s.url, icon: Icon ? <Icon className="w-5 h-5" /> : null, label: s.platform }
      }).filter(s => s.icon)
    : null

  return (
    <footer className="relative py-12 sm:py-20 bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Logo and Description */}
          <div className="sm:col-span-2 md:col-span-1">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                {navbar?.logo_image_url ? (
                  <img src={navbar.logo_image_url} alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                ) : null}
                <div className="font-bagel text-background text-2xl sm:text-3xl tracking-wider">
                  {navbar?.logo_text || 'PRATIK'}
                </div>
              </div>
              <p className="text-sm sm:text-base text-background/70 leading-relaxed mb-4 sm:mb-6">
                {footer?.description || 'Full Stack Developer crafting scalable digital solutions with MERN Stack, Python, and modern web technologies.'}
              </p>
              {/* Social Media Icons */}
              <div className="flex items-center space-x-4 sm:space-x-5">
                {(socialItems ?? [
                  { href: 'https://www.linkedin.com/in/pratik-chaudhary-web/', icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
                  { href: 'https://github.com/Pratik980', icon: <Github className="w-5 h-5" />, label: 'GitHub' },
                  { href: 'https://x.com/PraTik_980', icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
                  { href: 'https://t.me/pratik_web', icon: <Send className="w-5 h-5" />, label: 'Telegram' },
                  { href: 'https://www.instagram.com/ig_pratik0p/', icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
                ]).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:scale-110 gentle-animation cursor-pointer text-background/70 hover:text-background">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-lg sm:text-xl text-background mb-3 sm:mb-4">QUICK LINKS</h4>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {quickLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-background/70 hover:text-background gentle-animation text-xs sm:text-sm font-medium"
                >
                  → {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-black text-lg sm:text-xl text-background mb-3 sm:mb-4">TECH STACK</h4>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {techStack.map(tech => (
                <div key={tech} className="text-background/70 hover:text-background gentle-animation text-xs sm:text-sm font-medium">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-6 sm:pt-8 mt-10 sm:mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="text-xs sm:text-sm text-background/70 mb-2 sm:mb-0">
              {footer?.copyright_text || '© 2025 Pratik Chaudhary. All rights reserved.'}
            </div>
            <div className="text-xs sm:text-sm text-background/70">
              Kalanki, Kathmandu, Nepal · prtkcha980@gmail.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
