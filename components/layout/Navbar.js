'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Shield, Heart, Car } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useMapModal } from '@/components/ui/MapModalContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/cheats', label: 'Cheats' },
  { href: '/vehicles', label: 'Cars' },
  { href: '/map', label: 'Map' },
  { href: '/news', label: 'News' },
  { href: '/guides', label: 'Guides' },
  { href: '/characters', label: 'Characters & Wardrobe' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [wantedLevel, setWantedLevel] = useState(2)
  const [money, setMoney] = useState(8452100)
  const pathname = usePathname()
  const { addToast } = useToast()
  const { openMap } = useMapModal()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Slowly fluctuate cash to give living game feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((prev) => prev + Math.floor(Math.random() * 500) - 100)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleStarClick = (starIndex) => {
    const newLevel = starIndex === wantedLevel ? 0 : starIndex
    setWantedLevel(newLevel)

    if (newLevel === 5) {
      addToast('🚨 5-STAR WANTED! VCPD SWAT, HELICOPTERS & MILITARY DISPATCHED!', 'error', 5000)
    } else if (newLevel === 4) {
      addToast('🚨 4-STAR: VCPD Spike strips & Roadblocks active on all Vice City bridges!', 'error', 4000)
    } else if (newLevel === 3) {
      addToast('🚔 3-STAR: VCPD Police Air One Chopper tracking suspect getaway vehicle!', 'cheat', 3000)
    } else if (newLevel === 2) {
      addToast('🚔 2-STAR: VCPD Buffalo Interceptors in high-speed pursuit on Ocean Drive!', 'cheat', 2500)
    } else if (newLevel === 1) {
      addToast('👮 1-STAR: Patrol officer investigating disturbance in Little Haiti.', 'info', 2000)
    } else {
      addToast('✨ Heat Cleared: Paint job completed. Police lost all visual contact.', 'mission', 3000)
    }
  }

  return (
    <nav
      className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gta-dark/95 backdrop-blur-md border-b border-gta-border/80 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-gta-dark/90 via-gta-dark/60 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="font-heading text-2xl sm:text-3xl tracking-tight transition-all duration-300 group-hover:scale-105"
            >
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">GTA</span>
              <span className="text-gta-pink neon-text-pink ml-0.5">VI</span>
            </motion.div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] tracking-[0.3em] font-heading text-gta-teal neon-text-teal leading-none">
                VICE CITY
              </span>
              <span className="text-[9px] text-gray-500 font-body leading-none mt-0.5">FAN HUB</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === '/map' && pathname === '/') {
                      e.preventDefault()
                      openMap()
                    }
                  }}
                  className={`relative px-3 py-1.5 font-heading text-sm tracking-wider uppercase transition-colors duration-200 group ${
                    isActive ? 'text-gta-pink' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {link.label === 'Cars' && <Car size={13} className="text-gta-pink" />}
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-gta-pink/10 rounded border border-gta-pink/40 shadow-[0_0_12px_rgba(255,46,136,0.2)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gta-pink to-gta-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </Link>
              )
            })}
          </div>

          {/* GTA HUD Right Side (Cash + Health/Armor + Wanted Stars) */}
          <div className="flex items-center gap-4">
            {/* Money Counter */}
            <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 border border-green-500/30 text-green-400 font-heading text-sm tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.15)]">
              <span className="text-green-500 font-bold">$</span>
              <span suppressHydrationWarning>{money.toLocaleString('en-US')}</span>
            </div>

            {/* Health / Armor status mini widget */}
            <div className="hidden lg:flex flex-col gap-1 w-20">
              <div className="flex items-center gap-1.5" title="Armor: 100%">
                <Shield size={10} className="text-gta-teal flex-shrink-0" />
                <div className="flex-1 bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                  <div className="h-full bg-gta-teal shadow-[0_0_8px_#00E5FF] w-full" />
                </div>
              </div>
              <div className="flex items-center gap-1.5" title="Health: 100%">
                <Heart size={10} className="text-green-400 flex-shrink-0" />
                <div className="flex-1 bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                  <div className="h-full bg-green-400 shadow-[0_0_8px_#4ade80] w-[95%]" />
                </div>
              </div>
            </div>

            {/* Wanted Level Stars (Interactive) */}
            <div
              className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-lg border border-gta-border/60 cursor-pointer hover:border-yellow-400/50 transition-colors"
              title="Click stars to set Police Wanted Level (1-5 stars)!"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= wantedLevel
                return (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.85 }}
                    className={`text-base leading-none focus:outline-none transition-colors ${
                      active
                        ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)] animate-pulse'
                        : 'text-gray-700 hover:text-gray-500'
                    }`}
                    style={{ animationDuration: `${1.2 + star * 0.15}s` }}
                    aria-label={`Set wanted level to ${star}`}
                  >
                    ★
                  </motion.button>
                )
              })}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-gta-card border border-gta-border text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={20} className="text-gta-pink" /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-gta-dark/98 backdrop-blur-xl border-b border-gta-border shadow-2xl"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setIsOpen(false)
                      if (link.href === '/map' && pathname === '/') {
                        e.preventDefault()
                        openMap()
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-heading text-lg tracking-wider uppercase transition-all ${
                      isActive
                        ? 'bg-gta-pink/15 text-gta-pink border border-gta-pink/40 shadow-[0_0_12px_rgba(255,46,136,0.2)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-gta-teal">→</span>
                  </Link>
                )
              })}

              <div className="pt-4 mt-2 border-t border-gta-border/60 flex items-center justify-between px-2 text-xs text-gray-400">
                <span suppressHydrationWarning className="text-green-400 font-heading tracking-widest">
                  BANK: ${money.toLocaleString('en-US')}
                </span>
                <span className="font-heading tracking-wider text-gta-teal">
                  VICE CITY SYNDICATE
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
