'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSkills } from '@/api/portfolio'

const fallbackSkills = [
  { name: 'ReactJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'ExpressJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'NodeJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'R', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
  { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
  { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
  { name: 'Scikit-Learn', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg' },
  { name: 'Matplotlib', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg' },
  { name: 'Seaborn', icon: 'https://raw.githubusercontent.com/mwaskom/seaborn/master/doc/_static/logo-wide-lightbg.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
  { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg' },
  { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
  { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
]

export function Services() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const { data: skillData } = useQuery({ queryKey: ['skills'], queryFn: getSkills })

  const skills = skillData?.length
    ? skillData.flatMap((cat) => cat.skills ?? []).map((s) => ({
        name: s.name,
        icon: s.icon_url || ''
      }))
    : fallbackSkills

  return (
    <section id="skills" className="relative py-20" style={{
      background: 'linear-gradient(135deg, rgba(10,14,26,0.9) 0%, rgba(15,20,35,0.9) 30%, rgba(5,8,19,0.9) 60%, rgba(15,20,35,0.9) 100%)',
      overflow: 'visible'
    }}>
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className={`inline-flex items-center gap-3 mb-4 sm:mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Tech Stack</span>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className={`text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 sm:mb-6 text-slate-100 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Skills & Abilities
          </h2>
          <p className={`text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto px-2 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Technologies I work with to build exceptional digital experiences
          </p>
        </div>

        {/* Skills Grid - Photo Lab style hanging photos */}
        <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

          {/* Rope */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute top-4 left-0 right-0 h-2 sm:h-3 rope-sway">
              <div className="w-full h-full bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-full shadow-lg" />
              <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-transparent via-slate-500 to-transparent rounded-full opacity-80" />
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-black/30 rounded-full blur-xl" />
            </div>
            {/* Wall anchors */}
            <div className="absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-500 to-gray-800 rounded-full shadow-xl border border-gray-400" />
            <div className="absolute right-0 top-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-500 to-gray-800 rounded-full shadow-xl border border-gray-400" />

            {/* Skills hanging */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 pt-12 sm:pt-16 px-2 sm:px-4">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className={`transform transition-all duration-300 ${hoveredSkill === skill.name ? 'scale-110 -translate-y-2' : 'scale-100'} ${index % 3 === 0 ? 'photo-sway-1' : index % 3 === 1 ? 'photo-sway-2' : 'photo-sway-3'}`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{ transitionDelay: `${index * 50}ms`, animationDelay: `${index * 0.2}s` }}
                >
                  {/* Clothespin */}
                  <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative w-3 h-6 sm:w-4 sm:h-8">
                      <div className="absolute left-0 top-0 w-1.5 h-6 sm:w-2 sm:h-8 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-l-sm shadow-sm" />
                      <div className="absolute right-0 top-0 w-1.5 h-6 sm:w-2 sm:h-8 bg-gradient-to-l from-yellow-200 to-orange-200 rounded-r-sm shadow-sm" />
                      <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-2 h-1 sm:w-3 sm:h-1.5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm" />
                    </div>
                  </div>

                  {/* Skill Card */}
                  <div
                    className="relative bg-white p-2 sm:p-4 shadow-2xl cursor-pointer w-20 sm:w-28"
                    style={{
                      filter: hoveredSkill === skill.name ? 'brightness(1.1) contrast(1.05)' : 'brightness(1) contrast(0.95)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)'
                    }}
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        style={{ filter: 'sepia(5%) saturate(90%) brightness(95%)' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <span className="text-[10px] sm:text-xs font-bold text-gray-800 text-center leading-tight">{skill.name}</span>
                    </div>
                    {/* Developer stamp */}
                    <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[7px] sm:text-[9px] text-gray-400 font-mono opacity-50">DEV</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
