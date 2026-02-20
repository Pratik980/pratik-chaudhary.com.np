'use client'

import { Github, Linkedin, Twitter, Send, Instagram } from 'lucide-react'

const quickLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#portfolio', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
]

const techStack = [
  'ReactJS', 'NodeJS', 'MongoDB', 'ExpressJS',
  'Python', 'JavaScript', 'TypeScript', 'TailwindCSS',
  'MySQL', 'Firebase', 'Git', 'Postman',
]

export function Footer() {
  return (
    <footer className="relative py-20 bg-foreground text-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-12">
          {/* Logo and Description */}
          <div className="col-span-12 md:col-span-4">
            <div>
              <div className="font-bagel text-background text-3xl tracking-wider mb-4">
                PRATIK
              </div>
              <p className="text-background/70 leading-relaxed mb-6">
                Full Stack Developer crafting scalable digital solutions with MERN Stack, Python, and modern web technologies.
              </p>
              {/* Social Media Icons */}
              <div className="flex items-center space-x-5">
                <a href="https://www.linkedin.com/in/pratik-chaudhary-web/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 gentle-animation cursor-pointer text-background/70 hover:text-background">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/Pratik980" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:scale-110 gentle-animation cursor-pointer text-background/70 hover:text-background">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://x.com/PraTik_980" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:scale-110 gentle-animation cursor-pointer text-background/70 hover:text-background">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://t.me/pratik_web" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:scale-110 gentle-animation cursor-pointer text-background/70 hover:text-background">
                  <Send className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/ig_pratik0p/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:scale-110 gentle-animation cursor-pointer text-background/70 hover:text-background">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-12 md:col-span-4">
            <h4 className="font-black text-xl text-background mb-4">QUICK LINKS</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-background/70 hover:text-background gentle-animation text-sm font-medium"
                >
                  → {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="col-span-12 md:col-span-4">
            <h4 className="font-black text-xl text-background mb-4">TECH STACK</h4>
            <div className="grid grid-cols-2 gap-2">
              {techStack.map(tech => (
                <div key={tech} className="text-background/70 hover:text-background gentle-animation text-sm font-medium">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-background/70 mb-4 md:mb-0">
              © 2025 Pratik Chaudhary. All rights reserved.
            </div>
            <div className="text-sm text-background/70">
              Kalanki, Kathmandu, Nepal · prtkcha980@gmail.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
