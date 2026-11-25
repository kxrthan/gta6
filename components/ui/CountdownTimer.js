'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function TimeUnit({ value, label, accentColor = 'from-gta-pink to-gta-orange' }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* Glow behind box */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gta-pink via-gta-purple to-gta-teal rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500" />
        
        {/* Inner Counter Box */}
        <div className="relative bg-gta-card border border-gta-border/80 rounded-lg p-3 sm:p-5 min-w-[70px] sm:min-w-[90px] text-center shadow-2xl backdrop-blur-sm">
          <motion.div
            key={value}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`font-heading text-4xl sm:text-6xl bg-gradient-to-b ${accentColor} bg-clip-text text-transparent font-bold tracking-wider`}
          >
            {String(value).padStart(2, '0')}
          </motion.div>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs text-gray-400 font-heading tracking-[0.25em] mt-2 uppercase">
        {label}
      </span>
    </div>
  )
}

export default function CountdownTimer({ targetDate = '2026-05-26T00:00:00' }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(getTimeLeft(targetDate))
    const interval = setInterval(() => {
      setTime(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-4 h-24">
        <div className="text-gray-500 font-heading tracking-widest text-sm animate-pulse">
          SYNCHRONIZING VICE CITY SATELLITE...
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <TimeUnit value={time.days} label="DAYS" accentColor="from-gta-pink to-gta-orange" />
      <span className="font-heading text-3xl sm:text-5xl text-gta-pink neon-text-pink mb-6 animate-pulse">:</span>
      <TimeUnit value={time.hours} label="HOURS" accentColor="from-gta-orange to-yellow-400" />
      <span className="font-heading text-3xl sm:text-5xl text-gta-orange neon-text-orange mb-6 animate-pulse">:</span>
      <TimeUnit value={time.minutes} label="MINUTES" accentColor="from-gta-purple to-gta-pink" />
      <span className="font-heading text-3xl sm:text-5xl text-gta-purple neon-text-purple mb-6 animate-pulse">:</span>
      <TimeUnit value={time.seconds} label="SECONDS" accentColor="from-gta-teal to-blue-400" />
    </div>
  )
}
