'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', toggle)
    return () => window.removeEventListener('scroll', toggle)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 p-3 bg-gta-card border border-gta-purple rounded-full hover:border-gta-pink transition-all group"
          aria-label="Back to top"
          style={{ boxShadow: '0 0 15px rgba(123,47,247,0.3)' }}
        >
          <ArrowUp size={18} className="text-gta-purple group-hover:text-gta-pink transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
