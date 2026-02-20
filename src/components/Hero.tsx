'use client'

import { motion } from 'framer-motion'
import { Menu, X, Github, Linkedin, Twitter, Send, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'
import portfolioImg from '@/assets/portfolio.png'

const typingRoles = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'Python Developer',
  'Data Science Enthusiast',
  'UI/UX Enthusiast',
]

export function Hero() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  // Typing effect
  useEffect(() => {
    const current = typingRoles[roleIndex]
    const speed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1500)
        } else {
          setCharIndex(c => c + 1)
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setRoleIndex(r => (r + 1) % typingRoles.length)
          setCharIndex(0)
        } else {
          setCharIndex(c => c - 1)
        }
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, roleIndex])

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#education', label: 'Education' },
    { href: '#portfolio', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#certifications', label: 'Certifications' },
    { href: '#contact', label: 'Contact' },
  ]

  const socials = [
    { href: 'https://www.linkedin.com/in/pratik-chaudhary-web/', icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
    { href: 'https://github.com/Pratik980', icon: <Github className="w-5 h-5" />, label: 'GitHub' },
    { href: 'https://x.com/PraTik_980', icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
    { href: 'https://t.me/pratik_web', icon: <Send className="w-5 h-5" />, label: 'Telegram' },
    { href: 'https://www.instagram.com/ig_pratik0p/', icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-card/20 to-background/80" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${
          isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border' : 'bg-transparent'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="font-orbitron text-2xl font-black tracking-widest bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-500">PRATIK</span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground font-medium gentle-animation hover:scale-105 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right: CTA + Mobile */}
            <div className="flex items-center space-x-3">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block bg-accent-blue text-white font-semibold px-5 py-2.5 rounded-md hover:opacity-90 gentle-animation text-sm"
              >
                Hire Me
              </motion.a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-effect p-3 rounded-full text-foreground hover:bg-foreground/10 gentle-animation cursor-pointer z-[120] relative"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-background/95 backdrop-blur-xl border-l border-border z-[90]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="glass-effect p-3 rounded-full text-foreground hover:bg-foreground/10 gentle-animation cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col px-6 pb-6 gap-2">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 hover:text-foreground/80 hover:bg-foreground/5 rounded-lg gentle-animation font-medium text-lg text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="mt-4 bg-accent-blue text-background font-semibold px-6 py-3 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
              Hire Me
            </a>
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-300">Available for work</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-slate-100 mb-4">
                Hi There,<br />
                I'm <span className="text-accent-blue">Pratik</span>{' '}
                <span className="text-slate-100">Chaudhary</span>
              </h1>

              <div className="text-base sm:text-xl md:text-2xl text-slate-300 mb-6 sm:mb-8 min-h-[2rem]">
                I'm into{' '}
                <span className="text-accent-purple font-semibold break-words">
                  {displayText}<span className="animate-pulse">|</span>
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 mb-6 sm:mb-8 max-w-lg leading-relaxed px-1">
                Dedicated Computer Science student with proven full-stack development expertise. Proficient in MERN Stack, Python, Java, and data science technologies. Combines technical proficiency with digital marketing experience to create impactful, user-centered solutions.
              </p>

              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full xs:w-auto">
                <motion.a
                  href="#about"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="bg-accent-blue text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:opacity-90 gentle-animation text-sm sm:text-base text-center w-full xs:w-auto"
                >
                  About Me ↓
                </motion.a>
                <motion.a
                  href="/CV.pdf"
                  download="Pratik_Chaudhary_CV.pdf"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="bg-background clean-border text-foreground font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-card gentle-animation text-sm sm:text-base text-center w-full xs:w-auto"
                >
                  Resume →
                </motion.a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {socials.map(social => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-card clean-border rounded-full flex items-center justify-center text-slate-300 hover:text-blue-400 hover:bg-accent-blue/10 gentle-animation"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right: Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-cyan-500/20 scale-110 blur-2xl" />
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden clean-border elevated-shadow">
                  <img
                    src={portfolioImg}
                    alt="Pratik Chaudhary - Full Stack Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-4 bg-background clean-border rounded-2xl px-4 py-3 elevated-shadow"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">MERN Stack Dev</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-background clean-border rounded-2xl px-4 py-3 elevated-shadow"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">Open to Work</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
