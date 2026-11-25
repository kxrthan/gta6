'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, Sparkles, Trophy } from 'lucide-react'
import { useToast } from './Toast'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [showMissionPassed, setShowMissionPassed] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Website Newsletter' }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setShowMissionPassed(true)
        addToast('Subscribed to Vice City Daily Intelligence Briefing!', 'mission', 5000)
        setTimeout(() => {
          setShowMissionPassed(false)
        }, 4500)
      } else {
        setStatus('idle')
        addToast(data.error || 'Subscription failed. Please check your email.', 'error', 4000)
      }
    } catch (err) {
      setStatus('idle')
      addToast('Connection error. Please try again.', 'error', 3000)
    }
  }

  return (
    <section className="relative py-24 overflow-hidden border-t border-b border-gta-border/50 bg-gradient-to-b from-gta-dark via-gta-navy to-gta-dark">
      {/* Background Neon Glows and Grid */}
      <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gta-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-gta-pink/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Mission Passed Fullscreen Overlay when triggered */}
      <AnimatePresence>
        {showMissionPassed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md pointer-events-none"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15 }}
              className="text-center px-4"
            >
              <div className="font-heading text-6xl sm:text-8xl text-yellow-400 tracking-widest drop-shadow-[0_0_35px_rgba(250,204,21,0.9)] mb-2">
                MISSION PASSED!
              </div>
              <div className="font-heading text-2xl sm:text-3xl text-yellow-200 tracking-[0.3em] mb-4">
                RESPECT + RESISTANCE
              </div>
              <div className="text-gta-teal font-heading text-xl sm:text-2xl tracking-wider">
                $250,000 BOUNTY CREDITED TO {email.toUpperCase()}
              </div>
              <div className="flex justify-center gap-2 mt-4 text-3xl">
                {'★★★★★'.split('').map((s, idx) => (
                  <span key={idx} className="wanted-star animate-pulse" style={{ animationDelay: `${idx * 0.1}s` }}>
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gta-pink/40 bg-gta-pink/10 text-gta-pink text-xs font-heading tracking-[0.2em] mb-6">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
            VICE CITY DISPATCH SERVICE
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl text-white tracking-wide mb-4">
            GET THE DAILY <span className="gradient-text">VICE CITY INTEL</span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Stay one step ahead of the cops and the competition. Subscribe for daily verified GTA 6 cheat drops,
            leaked map coordinates, secret vehicle locations, and mission guides.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex flex-col items-center gap-3 p-6 rounded-xl border border-yellow-400/40 bg-black/60 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <Trophy size={32} className="text-yellow-400 animate-bounce" />
                <div className="text-left">
                  <div className="font-heading text-2xl text-yellow-400">YOU&apos;RE ON THE PAYROLL</div>
                  <div className="text-xs text-gray-400 font-body">Confirmation sent to: <span className="text-gta-teal">{email}</span></div>
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for the syndicate..."
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gta-dark/90 border border-gta-border/80 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gta-pink focus:ring-1 focus:ring-gta-pink font-body text-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="gta-btn-primary flex items-center justify-center gap-2 py-3.5 px-8 font-heading text-lg tracking-widest whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      ENCRYPTING...
                    </>
                  ) : (
                    'JOIN SYNDICATE'
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500 font-body">
                <span>🔒 No spam, ever</span>
                <span>•</span>
                <span>⚡ Daily cheat drops</span>
                <span>•</span>
                <span>🌴 100% Unofficial Fan Club</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
