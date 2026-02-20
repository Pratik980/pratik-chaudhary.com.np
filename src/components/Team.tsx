'use client'

import taylorsImg from '@/assets/taylors.jpg'
import omImg from '@/assets/Om.jpg'
import trijuddaImg from '@/assets/trijudda_logo.jpg'

const educations = [
  {
    degree: 'Bachelor of Computer Science (Hons)',
    institution: 'IIMS College (Affiliated with Taylor\'s University, Malaysia)',
    location: 'Dhobidhara, Kathmandu',
    period: '2023 - Present',
    image: taylorsImg,
    rotation: 'rotate-3',
    crime: 'PURSUING B.SC. CS (HONS)',
    bounty: 'Current',
  },
  {
    degree: 'Higher Secondary Certificate (NEB)',
    institution: 'Om National College - Science Stream (Computer Science)',
    location: 'Birgunj, Nepal',
    period: '2020 - 2022',
    image: omImg,
    rotation: '-rotate-2',
    crime: 'COMPLETED WITH DISTINCTION',
    bounty: '2022',
  },
  {
    degree: 'Secondary School Certificate',
    institution: 'Trijuddha Mahabir Prasad Raghubir Ram Secondary School',
    location: 'Birgunj, Nepal',
    period: '2016 - 2020',
    image: trijuddaImg,
    rotation: 'rotate-2',
    crime: 'FOUNDATION OF EXCELLENCE',
    bounty: '2020',
  },
]

export function Team() {
  return (
    <div className="relative py-32 w-full" style={{
      overflow: 'visible',
      height: 'auto',
      minHeight: '0',
      maxHeight: 'none'
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-card/10 to-background/70" />
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10" style={{ overflow: 'visible' }}>

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">Academic Journey</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 text-slate-100">
            <span className="block mb-2">My</span>
            <span className="block">Education</span>
          </h2>

          <p className="text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
        </div>

        {/* Framed Education Board */}
        <div className="max-w-6xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-gradient-to-br from-black via-gray-900 to-black p-8 rounded-2xl shadow-2xl relative border border-gray-800/50" style={{ overflow: 'visible' }}>
            <div className="bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 rounded-xl p-8 relative border border-slate-300/50" style={{ overflow: 'visible' }}>
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-30 rounded-xl"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 30%, rgba(71, 85, 105, 0.03) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }} />

              {/* Education Cards Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" style={{ overflow: 'visible' }}>
                {educations.map((edu, index) => (
                  <div
                    key={index}
                    className={`group transform ${edu.rotation} hover:rotate-0 transition-all duration-500 hover:scale-105 hover:z-20`}
                    style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))', overflow: 'visible' }}
                  >
                    {/* Wanted-style Education Poster */}
                    <div className="bg-gradient-to-b from-white to-gray-50 border-4 border-black relative shadow-lg" style={{ overflow: 'visible' }}>
                      {/* Push pins */}
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg border border-red-700" />
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg border border-red-700" />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 via-transparent to-gray-100/20" />

                      <div className="p-6 text-center relative z-10">
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-3xl font-black text-black mb-2" style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}>
                            EDUCATION
                          </h3>
                          <div className="w-full h-0.5 bg-black mb-2" />
                        </div>

                        {/* Institution Logo */}
                        <div className="relative mb-4 mx-auto w-32 h-32 border-2 border-black bg-white rounded-sm flex items-center justify-center overflow-hidden">
                          <img
                            src={edu.image}
                            alt={edu.institution}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        {/* Details */}
                        <div className="text-left space-y-2" style={{ fontFamily: 'serif' }}>
                          <div className="font-bold text-blue-600 text-sm">{edu.crime}</div>
                          <div className="font-black text-base text-black leading-tight">{edu.degree}</div>
                          <div className="text-sm text-gray-700">{edu.institution}</div>
                          <div className="text-xs text-gray-500">{edu.location}</div>
                          <div className="font-bold text-black text-sm border-t border-gray-300 pt-2 mt-2">
                            📅 {edu.period}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
