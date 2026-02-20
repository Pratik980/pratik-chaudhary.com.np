'use client'

import { useState } from 'react'
import { User, Mail, Phone, MessageSquare, Send } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const form = e.target as HTMLFormElement
      const data = new FormData(form)
      data.append('access_key', 'af53f1a0-b23e-483c-b82a-3286172da6a2')
      data.append('subject', "New Contact Form Submission - Pratik's Portfolio")
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-16 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-card/15 to-background/70" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Let's Connect</span>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 sm:mb-8 text-slate-100">
            <span className="block mb-2">Get in Touch</span>
          </h2>
          <p className="text-lg sm:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-2">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </div>

        {/* Contact Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-background clean-border rounded-2xl sm:rounded-3xl overflow-hidden elevated-shadow">
            {/* Widget Header */}
            <div className="bg-card/50 px-4 sm:px-8 py-4 sm:py-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-foreground mb-1">Send a Message</h3>
                  <p className="text-sm text-muted-foreground">I'll respond within 24 hours</p>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-slate-300 font-medium">Available now</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-8 lg:p-12">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input type="hidden" name="botcheck" style={{ display: 'none' }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-card clean-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-card clean-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+977 XXXXXXXXXX"
                        className="w-full pl-11 pr-4 py-3 bg-card clean-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project..."
                        required
                        rows={5}
                        className="w-full pl-11 pr-4 py-3 bg-card clean-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-black text-lg py-4 rounded-xl hover:opacity-80 gentle-animation disabled:opacity-50 transition-all"
                  >
                    {submitting ? 'Sending...' : (<><Send className="w-5 h-5" /> Send Message</>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-background clean-border rounded-xl sm:rounded-2xl p-4 sm:p-6 subtle-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h4 className="font-black text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Email</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">prtkcha980@gmail.com</p>
            </div>
            <div className="bg-background clean-border rounded-xl sm:rounded-2xl p-4 sm:p-6 subtle-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <h4 className="font-black text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Phone</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">+977 9762825200</p>
            </div>
            <div className="bg-background clean-border rounded-xl sm:rounded-2xl p-4 sm:p-6 subtle-shadow sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
              </div>
              <h4 className="font-black text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Location</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">Kalanki, Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
