'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Navigation,
  Car,
  Map,
  Gamepad2,
  Zap,
  BookOpen,
  Users,
} from 'lucide-react'
import { useMapModal } from '@/components/ui/MapModalContext'

const SECTOR_CATEGORIES = [
  {
    name: 'Cars & Vehicles',
    icon: Car,
    color: 'text-gta-pink',
    border: 'border-gta-pink/40 hover:border-gta-pink',
    bg: 'bg-gta-pink/10',
    href: '/vehicles',
    desc: 'Supercars, classic muscle, and VCPD police interceptors with full performance specs.',
  },
  {
    name: 'Interactive Map',
    icon: Map,
    color: 'text-green-400',
    border: 'border-green-400/40 hover:border-green-400',
    bg: 'bg-green-400/10',
    href: '/map',
    desc: 'Vice Beach, Port Gellhorn, the Everglades, and all hidden coordinates.',
  },
  {
    name: 'Cheat Codes',
    icon: Gamepad2,
    color: 'text-gta-orange',
    border: 'border-gta-orange/40 hover:border-gta-orange',
    bg: 'bg-gta-orange/10',
    href: '/cheats',
    desc: 'All 20+ verified button combos for PS5, Xbox Series X/S, and PC console.',
  },
  {
    name: 'News & Leaks',
    icon: Zap,
    color: 'text-gta-teal',
    border: 'border-gta-teal/40 hover:border-gta-teal',
    bg: 'bg-gta-teal/10',
    href: '/news',
    desc: 'Official trailer breakdowns, launch updates, and verified Rockstar intelligence.',
  },
  {
    name: 'Guides & Heists',
    icon: BookOpen,
    color: 'text-yellow-400',
    border: 'border-yellow-400/40 hover:border-yellow-400',
    bg: 'bg-yellow-400/10',
    href: '/guides',
    desc: 'Day-one tips, safehouse locations, passive real estate investments.',
  },
  {
    name: 'Characters & Wardrobe',
    icon: Users,
    color: 'text-gta-purple',
    border: 'border-gta-purple/40 hover:border-gta-purple',
    bg: 'bg-gta-purple/10',
    href: '/characters',
    desc: 'Lucia & Jason safehouse dressing room, VCPD Chief Stefanie, Detective Vance, and cartel bosses.',
  },
]

export default function LandingCategories() {
  const { openMap } = useMapModal()

  return (
    <div className="space-y-8">
      {/* Tactical Radar Feature Preview Banner on Landing Page */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => openMap()}
        className="cursor-pointer relative overflow-hidden rounded-2xl border-2 border-gta-teal/60 bg-gradient-to-r from-[#070b1a] via-[#150a24] to-[#070b1a] p-6 sm:p-8 shadow-[0_0_35px_rgba(0,229,255,0.2)] group"
      >
        <div className="absolute inset-0 retro-grid opacity-25 pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gta-teal/15 rounded-full blur-3xl pointer-events-none group-hover:bg-gta-pink/20 transition-all duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-gta-teal animate-ping" />
              LIVE VICE CITY SATELLITE HUD
            </div>
            <h3 className="font-heading text-2xl sm:text-4xl text-white tracking-wide mb-2 group-hover:text-gta-teal transition-colors">
              INTERACTIVE <span className="gradient-text">GTA 6 RADAR MAP</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-body">
              Click anywhere on this panel to pop open the tactical GTA GPS radar. Pinpoint safehouses, VCPD precincts, subterranean bank vaults, and set active navigation waypoints.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Mini Radar Visual */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gta-teal group-hover:border-gta-pink overflow-hidden bg-black/90 flex items-center justify-center transition-colors shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 origin-center rounded-full pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(0, 229, 255, 0.45) 0deg, transparent 60deg, transparent 360deg)',
                }}
              />
              <Navigation size={18} className="text-gta-teal group-hover:text-gta-pink transition-colors z-10" />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openMap()
              }}
              className="gta-btn bg-gta-teal hover:bg-cyan-300 text-gta-dark font-bold text-sm sm:text-base py-3 px-6 shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2"
            >
              <span>POP OPEN MAP [M]</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Sector Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SECTOR_CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isMap = cat.name === 'Interactive Map'

          if (isMap) {
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -4 }}
                onClick={() => openMap()}
                className={`card-gta p-6 border ${cat.border} group transition-all duration-300 relative overflow-hidden cursor-pointer shadow-xl`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3.5 rounded-lg ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-300 relative`}>
                    <Icon size={24} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gta-teal animate-ping" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className={`font-heading text-2xl ${cat.color} flex items-center gap-2`}>
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-heading tracking-widest px-2 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/40">
                        POPUP [M]
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-body mb-3">
                      {cat.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-heading tracking-wider text-gta-teal group-hover:text-white transition-colors">
                      <span>CLICK TO OPEN GTA MAP</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          }

          return (
            <Link
              key={cat.name}
              href={cat.href}
              className={`card-gta p-6 border ${cat.border} group transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-lg ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-heading text-2xl ${cat.color} mb-1.5 flex items-center justify-between`}>
                    {cat.name}
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-body">
                    {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
