'use client'

import { useState, useEffect } from 'react'

const skills = [
  { name: 'ReactJS', icon: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/000000/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png' },
  { name: 'ExpressJS', icon: 'https://img.icons8.com/fluency/48/000000/node-js.png' },
  { name: 'NodeJS', icon: 'https://img.icons8.com/color/48/000000/nodejs.png' },
  { name: 'MongoDB', icon: 'https://img.icons8.com/color/48/000000/mongodb.png' },
  { name: 'JavaScript', icon: 'https://img.icons8.com/color/48/000000/javascript--v1.png' },
  { name: 'Python', icon: 'https://img.icons8.com/color/48/000000/python--v1.png' },
  { name: 'Java', icon: 'https://img.icons8.com/color/48/000000/java-coffee-cup-logo--v1.png' },
  { name: 'R', icon: 'https://img.icons8.com/fluency/48/r-project.png' },
  { name: 'SQL', icon: 'https://img.icons8.com/color/48/000000/sql.png' },
  { name: 'PHP', icon: 'https://img.icons8.com/offices/48/000000/php-logo.png' },
  { name: 'HTML5', icon: 'https://img.icons8.com/color/48/000000/html-5--v1.png' },
  { name: 'CSS3', icon: 'https://img.icons8.com/color/48/000000/css3.png' },
  { name: 'TailwindCSS', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/48px-Tailwind_CSS_Logo.png' },
  { name: 'MySQL', icon: 'https://img.icons8.com/color/48/000000/mysql-logo.png' },
  { name: 'Git', icon: 'https://img.icons8.com/color/48/000000/git.png' },
  { name: 'GitHub', icon: 'https://img.icons8.com/glyph-neue/48/ffffff/github.png' },
  { name: 'Postman', icon: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-postman-is-the-only-complete-api-development-environment-logo-color-tal-revivo.png' },
  { name: 'Pandas', icon: 'https://img.icons8.com/color/48/pandas.png' },
  { name: 'NumPy', icon: 'https://img.icons8.com/color/48/numpy.png' },
  { name: 'Scikit-Learn', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Scikit_learn_logo_small.svg/48px-Scikit_learn_logo_small.svg.png' },
  { name: 'Matplotlib', icon: 'https://img.icons8.com/color/48/line-chart.png' },
  { name: 'Seaborn', icon: 'https://img.icons8.com/color/48/combo-chart.png' },
  { name: 'Firebase', icon: 'https://img.icons8.com/color/48/000000/firebase.png' },
  { name: 'Netlify', icon: 'https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/external-netlify-a-cloud-computing-company-that-offers-hosting-and-serverless-backend-services-for-static-websites-logo-shadow-tal-revivo.png' },
  { name: 'Vercel', icon: 'https://assets.vercel.com/image/upload/front/favicon/vercel/60x60.png' },
  { name: 'VS Code', icon: 'https://img.icons8.com/color/48/000000/visual-studio-code-2019.png' },
  { name: 'Jupyter', icon: 'https://img.icons8.com/fluency/48/jupyter.png' },
]

export function Services() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

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

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">Tech Stack</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-slate-100 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Skills & Abilities
          </h2>
          <p className={`text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Technologies I work with to build exceptional digital experiences
          </p>
        </div>

        {/* Skills Grid - Photo Lab style hanging photos */}
        <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

          {/* Rope */}
          <div className="relative mb-8">
            <div className="absolute top-4 left-0 right-0 h-3 rope-sway">
              <div className="w-full h-full bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-full shadow-lg" />
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-slate-500 to-transparent rounded-full opacity-80" />
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-black/30 rounded-full blur-xl" />
            </div>
            {/* Wall anchors */}
            <div className="absolute left-0 top-0 w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-800 rounded-full shadow-xl border border-gray-400" />
            <div className="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-800 rounded-full shadow-xl border border-gray-400" />

            {/* Skills hanging */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-16 px-4">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className={`transform transition-all duration-300 ${hoveredSkill === skill.name ? 'scale-110 -translate-y-2' : 'scale-100'} ${index % 3 === 0 ? 'photo-sway-1' : index % 3 === 1 ? 'photo-sway-2' : 'photo-sway-3'}`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{ transitionDelay: `${index * 50}ms`, animationDelay: `${index * 0.2}s` }}
                >
                  {/* Clothespin */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative w-4 h-8">
                      <div className="absolute left-0 top-0 w-2 h-8 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-l-sm shadow-sm" />
                      <div className="absolute right-0 top-0 w-2 h-8 bg-gradient-to-l from-yellow-200 to-orange-200 rounded-r-sm shadow-sm" />
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm" />
                    </div>
                  </div>

                  {/* Skill Card */}
                  <div
                    className="relative bg-white p-4 shadow-2xl cursor-pointer w-28"
                    style={{
                      filter: hoveredSkill === skill.name ? 'brightness(1.1) contrast(1.05)' : 'brightness(1) contrast(0.95)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)'
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-10 h-10 object-contain"
                        style={{ filter: 'sepia(5%) saturate(90%) brightness(95%)' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">{skill.name}</span>
                    </div>
                    {/* Developer stamp */}
                    <div className="absolute bottom-1 right-1 text-[9px] text-gray-400 font-mono opacity-50">DEV</div>
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
