'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function ContactPage() {
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-[0.25em] mb-4">
          <Mail size={14} />
          DIRECT ENCRYPTED WIRE
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          CONTACT <span className="text-gta-teal neon-text-teal">HEADQUARTERS</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Got an unconfirmed GTA 6 leak, a new working cheat code to submit, or editorial feedback?
          Transmit your encrypted message directly to our staff.
        </p>
      </div>

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
          <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
            Thanks for reaching out, <strong className="text-white">{formData.name}</strong>. Our Vice City editors review all incoming intelligence within 24 hours.
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
              <label className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                CODENAME / YOUR NAME *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tommy V."
                className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gta-teal font-body text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                COMMUNICATION FREQUENCY (EMAIL) *
              </label>
              <input
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
              <label className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                DISPATCH CLASSIFICATION
              </label>
              <select
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
              <label className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
                DISPATCH SUBJECT
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary..."
                className="w-full px-4 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gta-teal font-body text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading tracking-wider uppercase text-gray-400 mb-2">
              DISPATCH MESSAGE *
            </label>
            <textarea
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
    </div>
  )
}
