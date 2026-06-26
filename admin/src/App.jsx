import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, ProtectedRoute } from './context/AuthContext'
import { queryClient } from './lib/queryClient'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import HeroEditor from './pages/sections/HeroEditor'
import AboutEditor from './pages/sections/AboutEditor'
import SkillsEditor from './pages/sections/SkillsEditor'
import ProjectsEditor from './pages/sections/ProjectsEditor'
import ExperienceEditor from './pages/sections/ExperienceEditor'
import EducationEditor from './pages/sections/EducationEditor'
import ServicesEditor from './pages/sections/ServicesEditor'
import TestimonialsEditor from './pages/sections/TestimonialsEditor'
import ContactEditor from './pages/sections/ContactEditor'
import NavbarEditor from './pages/sections/NavbarEditor'
import FooterEditor from './pages/sections/FooterEditor'
import SeoEditor from './pages/sections/SeoEditor'
import CertificationsEditor from './pages/sections/CertificationsEditor'
import ContactSubmissions from './pages/messages/ContactSubmissions'
import ChangePassword from './pages/settings/ChangePassword'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/admin">
        <ScrollToTop />
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{
            style: { background: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', border: '1px solid hsl(var(--border))' }
          }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="hero" element={<ErrorBoundary><HeroEditor /></ErrorBoundary>} />
              <Route path="about" element={<ErrorBoundary><AboutEditor /></ErrorBoundary>} />
              <Route path="skills" element={<ErrorBoundary><SkillsEditor /></ErrorBoundary>} />
              <Route path="projects" element={<ErrorBoundary><ProjectsEditor /></ErrorBoundary>} />
              <Route path="experience" element={<ErrorBoundary><ExperienceEditor /></ErrorBoundary>} />
              <Route path="education" element={<ErrorBoundary><EducationEditor /></ErrorBoundary>} />
              <Route path="services" element={<ErrorBoundary><ServicesEditor /></ErrorBoundary>} />
              <Route path="testimonials" element={<ErrorBoundary><TestimonialsEditor /></ErrorBoundary>} />
              <Route path="contact" element={<ErrorBoundary><ContactEditor /></ErrorBoundary>} />
              <Route path="navbar" element={<ErrorBoundary><NavbarEditor /></ErrorBoundary>} />
              <Route path="footer" element={<ErrorBoundary><FooterEditor /></ErrorBoundary>} />
              <Route path="seo" element={<ErrorBoundary><SeoEditor /></ErrorBoundary>} />
              <Route path="certifications" element={<ErrorBoundary><CertificationsEditor /></ErrorBoundary>} />
              <Route path="messages" element={<ContactSubmissions />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
