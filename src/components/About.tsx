'use client'

import { useEffect, useState } from 'react'
import aboutImg from '@/assets/about.jpg'
import { Download, MapPin, Mail } from 'lucide-react'

const devProcess = [
  {
    number: '01',
    title: 'Requirement Analysis',
    description: 'Understanding client needs, defining scope, and planning architecture.',
    color: 'accent-blue',
  },
  {
    number: '02',
    title: 'Design & Prototyping',
    description: 'UI/UX wireframes, database schema design, and API planning.',
    color: 'accent-emerald',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Full-stack implementation using MERN, Python, or the best-fit stack.',
    color: 'accent-purple',
  },
  {
    number: '04',
    title: 'Testing & QA',
    description: 'Unit tests, integration tests, debugging, and performance optimization.',
    color: 'accent-blue',
  },
  {
    number: '05',
    title: 'Deployment & Delivery',
    description: 'CI/CD pipelines, cloud deployment, and handoff with documentation.',
    color: 'accent-emerald',
  },
]

export function About() {
  const [activeFrame, setActiveFrame] = useState(-1)
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setAnimationStarted(true)
      devProcess.forEach((_, index) => {
        setTimeout(() => {
          setActiveFrame(index)
        }, index * 2000 + 1000)
      })
    }, 3000)
  }, [])

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-card/10 to-background/70" />
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">About Me</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-slate-100">
            Who I Am
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            A passionate full-stack developer crafting scalable digital solutions
          </p>
        </div>

        {/* About Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 scale-105 blur-2xl" />
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden clean-border elevated-shadow">
                <img
                  src={aboutImg}
                  alt="Pratik Chaudhary"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-3xl font-black text-slate-100 mb-2">I'm Pratik Chaudhary</h3>
            <span className="inline-block text-accent-blue font-semibold text-lg mb-4">Full Stack Developer</span>

            <p className="text-slate-300 leading-relaxed mb-6">
              Dedicated Computer Science student with proven full-stack development expertise and hands-on experience building production-grade applications.
              Proficient in MERN Stack, Python, Java, and data science technologies with demonstrated ability to deliver scalable solutions for real-world clients.
              Strong foundation in software engineering principles, machine learning, and data-driven decision-making.
              Combines technical proficiency with digital marketing experience and collaborative mindset to create impactful, user-centered solutions.
              Committed to writing clean, maintainable code and solving complex problems in dynamic, innovation-driven environments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-card clean-border rounded-xl p-4">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                  <p className="text-sm font-semibold text-foreground">prtkcha980@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-card clean-border rounded-xl p-4">
                <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Location</p>
                  <p className="text-sm font-semibold text-foreground">Kalanki, Kathmandu, Nepal</p>
                </div>
              </div>
            </div>

            <a
              href="/CV.pdf"
              download="Pratik_Chaudhary_CV.pdf"
              className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-lg hover:opacity-80 gentle-animation"
            >
              <Download className="w-4 h-4" /> Download Resume
            </a>
          </div>
        </div>

        {/* Dev Process - Film Strip */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-100 mb-2">My Development Process</h3>
            <p className="text-slate-300">Watch my workflow unfold step by step</p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 rounded-xl overflow-hidden"
              style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.05)' }}>

              {/* Film Perforations - Top */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 overflow-hidden">
                <div className={`flex items-center justify-between px-12 h-full ${animationStarted ? 'perforations-scroll-animation' : ''}`} style={{ width: '200%' }}>
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="w-4 h-3 bg-gray-800 rounded-sm border border-gray-700 flex-shrink-0" />
                  ))}
                </div>
              </div>

              {/* Film Perforations - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-20 overflow-hidden">
                <div className={`flex items-center justify-between px-12 h-full ${animationStarted ? 'perforations-scroll-animation' : ''}`} style={{ width: '200%' }}>
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="w-4 h-3 bg-gray-800 rounded-sm border border-gray-700 flex-shrink-0" />
                  ))}
                </div>
              </div>

              {/* Film Frames */}
              <div className="relative py-6 px-8 overflow-hidden h-64 max-w-full">
                <div className={`flex transition-transform duration-1000 ease-in-out ${animationStarted ? 'film-scroll-animation' : ''}`} style={{ width: 'max-content', gap: '32px' }}>
                  <div className="flex-shrink-0 w-80 h-52 bg-gray-800 rounded-lg border-2 border-gray-700 opacity-60 flex items-center justify-center">
                    <div className="text-gray-400 font-mono tracking-wider">● START</div>
                  </div>

                  {[...devProcess, ...devProcess].map((step, index) => (
                    <div
                      key={`${step.number}-${index}`}
                      className={`flex-shrink-0 w-80 h-52 bg-background rounded-lg border-4 ${activeFrame >= (index % devProcess.length) ? `border-${step.color}` : 'border-gray-600'}`}
                      style={{ boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
                    >
                      <div className="relative h-full p-6 flex flex-col justify-between">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-black z-10 text-lg"
                          style={{ boxShadow: '0 6px 12px rgba(0,0,0,0.4)' }}>
                          {step.number}
                        </div>
                        <div>
                          <h3 className="font-black text-xl leading-tight mb-4 text-foreground">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                        <div className="absolute left-1 top-1 bottom-1 w-px bg-gray-300/20" />
                        <div className="absolute right-1 top-1 bottom-1 w-px bg-gray-300/20" />
                        <div className="absolute top-1 left-1 right-1 h-px bg-gray-300/20" />
                        <div className="absolute bottom-1 left-1 right-1 h-px bg-gray-300/20" />
                      </div>
                    </div>
                  ))}

                  <div className="flex-shrink-0 w-80 h-52 bg-gray-800 rounded-lg border-2 border-gray-700 opacity-60 flex items-center justify-center">
                    <div className="text-gray-400 font-mono tracking-wider">● END</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-6 bg-card/80 backdrop-blur-sm clean-border rounded-2xl px-8 py-4 subtle-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-foreground">8+ Projects</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <span className="text-sm font-semibold text-foreground">2+ Years Coding</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <span className="text-sm font-semibold text-foreground">MERN Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
