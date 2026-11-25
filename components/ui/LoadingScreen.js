'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Skip loading screen on repeat navigations within the session
    if (typeof window !== 'undefined' && sessionStorage.getItem('gta6_has_loaded')) {
      return
    }

    setLoading(true)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('gta6_has_loaded', 'true')
          }
          setTimeout(() => setLoading(false), 250)
          return 100
        }
        return prev + Math.random() * 25 + 15
      })
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gta-dark"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 retro-grid opacity-20" />

          {/* Content */}
          <div className="relative z-10 text-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-7xl sm:text-9xl gradient-text mb-4"
            >
              GTA VI
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-xl text-gta-teal tracking-[0.5em] mb-8"
            >
              FAN HUB
            </motion.div>

            {/* Loading Bar */}
            <div className="w-64 sm:w-80 mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-2 font-body">
                <span>LOADING...</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="h-1 bg-gta-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full loading-bar rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-600 mt-6 font-body"
            >
              Fan site — not affiliated with Rockstar Games
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
