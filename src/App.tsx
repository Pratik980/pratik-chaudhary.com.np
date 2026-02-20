import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { Awards } from './components/Awards'
import { About } from './components/About'
import { Services } from './components/Services'
import { Team } from './components/Team'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Experience } from './components/Experience'
import { Background3D } from './components/Background3D'
import { WhatsAppButton } from './components/WhatsAppButton'

export default function App() {
  return (
    <div className="min-h-screen text-foreground" style={{ overflow: 'visible' }}>
      {/* 3D Animated Particle Background */}
      <Background3D />
      <main className="relative" role="main" style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>
        <section id="about" aria-label="About section">
          <About />
        </section>
        <section id="skills" aria-label="Skills section">
          <Services />
        </section>
        <section id="education" aria-label="Education section" style={{ overflow: 'visible', height: 'auto', minHeight: '0', maxHeight: 'none' }}>
          <Team />
        </section>
        <section id="portfolio" aria-label="Projects section">
          <Portfolio />
        </section>
        <section id="experience" aria-label="Experience section">
          <Experience />
        </section>
        <section id="certifications" aria-label="Certifications section">
          <Awards />
        </section>
        <section id="contact" aria-label="Contact section">
          <Contact />
        </section>
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}
