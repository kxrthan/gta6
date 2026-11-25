'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RotateCcw, ArrowRight } from 'lucide-react'

export default function NotFound() {
  const [bloodSplatter, setBloodSplatter] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setBloodSplatter(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[120] wasted-screen flex flex-col items-center justify-center overflow-hidden scanlines film-grain select-none">
      {/* Red flash effect on load */}
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-red-700 pointer-events-none"
      />

      {/* Floating Wasted Stars */}
      <div className="absolute top-12 flex gap-3 text-3xl">
        {[1, 2, 3, 4, 5].map((s) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 2, delay: s * 0.2, repeat: Infinity }}
            className="text-red-500/70 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          >
            ★
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* WASTED Text in GTA Font */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, letterSpacing: '0.1em' }}
          animate={{ scale: 1, opacity: 1, letterSpacing: '0.25em' }}
          transition={{ duration: 0.8, type: 'spring', damping: 12 }}
          className="font-heading text-8xl sm:text-9xl md:text-[11rem] text-red-500 font-bold mb-4 drop-shadow-[0_0_40px_rgba(239,68,68,0.9)] tracking-widest"
        >
          WASTED
        </motion.div>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-10"
        >
          <div className="font-heading text-2xl sm:text-3xl text-gray-200 tracking-wider">
            ERROR 404: COORDINATES NOT FOUND
          </div>
          <p className="text-sm text-gray-400 font-body max-w-md mx-auto leading-relaxed">
            You wandered into the wrong alleyway in Little Haiti. The page or file you are looking for has been confiscated by the VCPD.
          </p>
          <div className="text-xs text-red-400 font-mono">
            HOSPITAL CHARGES: $5,000 DEDUCTED FROM ACCOUNT
          </div>
        </motion.div>

        {/* Respawn Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="gta-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <RotateCcw size={18} />
            RESPAWN AT HOSPITAL (HOME)
          </Link>
          <Link
            href="/blog"
            className="gta-btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            VIEW LATEST POSTS
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Subtle bottom disclaimer */}
      <div className="absolute bottom-6 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
        VICE CITY MEDICAL CENTER · RESPAWN DIVISION
      </div>
    </div>
  )
}
