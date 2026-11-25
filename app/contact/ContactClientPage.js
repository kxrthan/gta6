'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, CheckCircle2, Loader2, MessageSquare, ShieldAlert, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

export default function ContactClientPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'News Tip',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        addToast('Dispatch transmitted to Vice City Command!', 'mission', 4000)
      } else {
        setStatus('idle')
        addToast(data.error || 'Transmission failed.', 'error', 3000)
      }
    } catch (err) {
      setStatus('idle')
      addToast('Connection error during transmission.', 'error', 3000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-[0.25em] mb-4">
          <Mail size={14} />
          DIRECT EDITORIAL WIRE
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          CONTACT <span className="text-gta-teal neon-text-teal">HEADQUARTERS</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Have an unconfirmed GTA 6 leak with verifiable evidence, a newly discovered cheat code button combination,
          an editorial correction, or general inquiry? Transmit your dispatch to our staff.
        </p>
      </header>

      {/* Editorial Contact Briefing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10" aria-label="Contact Guidelines">
        <div className="p-4 rounded-xl bg-gta-card border border-gta-border/70 flex items-start gap-3">
          <Clock size={20} className="text-gta-teal flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading text-sm text-white uppercase tracking-wider mb-1">RESPONSE WINDOW</h2>
            <p className="text-xs text-gray-400 font-body">Editorial staff reviews all incoming correspondence within 24 to 48 business hours.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gta-card border border-gta-border/70 flex items-start gap-3">
          <ShieldAlert size={20} className="text-gta-orange flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading text-sm text-white uppercase tracking-wider mb-1">LEAK VERIFICATION</h2>
            <p className="text-xs text-gray-400 font-body">Please provide direct links, timestamps, or patent documentation for leak submissions.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gta-card border border-gta-border/70 flex items-start gap-3">
          <MessageSquare size={20} className="text-gta-pink flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading text-sm text-white uppercase tracking-wider mb-1">PRESS &amp; PARTNERSHIPS</h2>
            <p className="text-xs text-gray-400 font-body">Select &quot;Partnership / Advertising&quot; under dispatch classification for business requests.</p>
          </div>
        </div>
      </section>

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-gta p-8 sm:p-12 text-center border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 border border-green-500/40">
            <CheckCircle2 size={36} />
          </div>
          <div className="font-heading text-4xl text-yellow-400 mb-2">
            DISPATCH TRANSMITTED! ★
          </div>
          <p className="text-gray-300 text-sm max-w-md mx-auto mb-6 font-body">
            Thank you for reaching out, <strong className="text-white">{formData.name}</strong>. Our Vice City editors review all incoming dispatches promptly.
          </p>
          <button
            onClick={() => {
              setStatus('idle')
              setFormData({ name: '', email: '', category: 'News Tip', subject: '', message: '' })
            }}
            className="gta-btn-secondary"
          >
            TRANSMIT ANOTHER MESSAGE
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="card-gta p-6 sm:p-10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                CODENAME / YOUR NAME *
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tommy V."
                className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gta-teal font-body text-sm"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                COMMUNICATION FREQUENCY (EMAIL) *
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tommy@vicecity.net"
                className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gta-teal font-body text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-category" className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                DISPATCH CLASSIFICATION
              </label>
              <select
                id="contact-category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white focus:outline-none focus:border-gta-teal font-body text-sm"
              >
                <option value="News Tip">News Tip / Verified Leak</option>
                <option value="Cheat Code Submission">Cheat Code Submission</option>
                <option value="Correction">Post Correction</option>
                <option value="Advertising">Partnership / Advertising</option>
                <option value="Other">General Inquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                DISPATCH SUBJECT
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary..."
                className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gta-teal font-body text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
              DISPATCH MESSAGE *
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide full details, video links, or cheat code instructions..."
              className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gta-teal font-body text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="gta-btn-primary w-full py-4 flex items-center justify-center gap-2 text-xl"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                TRANSMITTING INTEL...
              </>
            ) : (
              <>
                <Send size={18} />
                SEND TRANSMISSION
              </>
            )}
          </button>
        </form>
      )}

      {/* Contextual Hub Footer */}
      <footer className="mt-16 pt-8 border-t border-gta-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div>
          <span>GTA 6 Fan Hub Editorial Office · Independent Fan Resource</span>
        </div>
        <div className="flex items-center gap-4 font-heading tracking-wider">
          <Link href="/about" className="hover:text-gta-purple transition-colors">ABOUT OUR MISSION</Link>
          <Link href="/news" className="hover:text-gta-teal transition-colors">NEWS INTEL</Link>
          <Link href="/cheats" className="hover:text-gta-orange transition-colors">CHEAT CODES</Link>
        </div>
      </footer>
    </div>
  )
}
