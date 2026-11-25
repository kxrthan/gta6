'use client'
import { motion } from 'framer-motion'

const tickerItems = [
  '🔥 GTA 6 release confirmed for 2026 — Get ready, Vice City awaits!',
  '🎮 New cheat codes discovered — Check out our Cheats page!',
  '🗺️ Full Vice City map leaked — See all locations and secrets',
  '🚗 Top 10 best vehicles in GTA 6 — Our complete ranking',
  '💰 Money glitch discovered — Unlimited cash guide inside',
  '⭐ Rockstar confirms 400+ missions in GTA 6 storyline',
  '🏖️ Vice City beaches confirmed — Surfing mechanics detailed',
  '🎵 GTA 6 radio stations revealed — Full track listing',
]

export default function NewsTicker() {
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-gta-pink/90 backdrop-blur-sm overflow-hidden flex items-center">
      <div className="flex-shrink-0 bg-gta-dark px-3 h-full flex items-center border-r border-white/20">
        <span className="font-heading text-xs tracking-widest text-gta-teal whitespace-nowrap">BREAKING</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="text-xs font-body text-white/90 inline-block">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
