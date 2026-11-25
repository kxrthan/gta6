'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import TypewriterText from '@/components/ui/TypewriterText'
import { ChevronDown, Crosshair, Map } from 'lucide-react'
import { useMapModal } from '@/components/ui/MapModalContext'

const taglines = [
  'WELCOME BACK TO VICE CITY',
  'LUCIA & JASON: THE CRIME SAGA BEGINS',
  'THE BIGGEST OPEN WORLD IN GAMING HISTORY',
  'UNLIMITED WEAPONS, VEHICLES & CHEAT CODES',
  'NEON LIGHTS, FAST CARS & DANGEROUS NIGHTS',
]

export default function HeroSection() {
  const { openMap } = useMapModal()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax layer transformations
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacityFade = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* 1. Official GTA 6 Lucia & Jason Artwork Background */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <Image
          src="/images/gta6-hero.jpg"
          alt="GTA 6 Official Artwork - Lucia and Jason in Vice City"
          fill
          priority
          className="object-cover object-center brightness-[0.96] contrast-[1.05]"
          sizes="100vw"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gta-dark via-black/25 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* 2. Synthwave 3D Perspective Grid along the Bottom Floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 opacity-25 pointer-events-none z-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 229, 255, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.25) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(400px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* 4. Main Hero Content */}
      <motion.div
        style={{ y: textY, opacity: opacityFade }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-12"
      >
        {/* Vice City Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/80 border border-gta-teal/60 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          <span className="w-2 h-2 rounded-full bg-gta-teal animate-ping" />
          <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-gta-teal neon-text-teal">
            LEONIDA STATE · VICE CITY METRO
          </span>
        </motion.div>

        {/* Title Container: Converted to semantic H1 with accessible text and preserved visual styling */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="relative mb-3"
        >
          <h1 className="font-heading leading-none">
            <span className="sr-only">GTA 6 Fan Hub – Your Guide to Vice City and Leonida</span>
            <span
              aria-hidden="true"
              className="block font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] tracking-wider mb-2 font-medium"
            >
              GRAND THEFT AUTO
            </span>
            <span
              aria-hidden="true"
              className="block font-heading text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] text-gta-pink font-extrabold tracking-widest"
              style={{
                WebkitTextStroke: '3.5px #FFFFFF',
                paintOrder: 'stroke fill',
                textShadow:
                  '0 0 30px rgba(255,46,136,0.9), 0 0 60px rgba(255,46,136,0.5), 0 4px 20px rgba(0,0,0,0.9)',
              }}
            >
              VI
            </span>
          </h1>
        </motion.div>

        {/* Dynamic Typewriter Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="h-8 sm:h-9 mb-6 flex items-center justify-center"
        >
          <div className="px-4 py-1 rounded-lg bg-black/75 border border-white/15 backdrop-blur-md shadow-lg">
            <TypewriterText
              texts={taglines}
              className="font-heading text-sm sm:text-xl text-gta-orange tracking-widest neon-text-orange"
            />
          </div>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8"
        >
          <Link
            href="/vehicles"
            aria-label="Explore GTA 6 Vehicles, Confirmed Supercars and Police Interceptors"
            className="gta-btn-primary w-full sm:w-auto text-center shadow-[0_0_25px_rgba(255,46,136,0.7)] text-lg py-2.5 px-6"
          >
            CONFIRMED CARS &amp; VCPD
          </Link>
          <Link
            href="/cheats"
            aria-label="Access GTA 6 Verified Cheat Codes Database"
            className="gta-btn-secondary w-full sm:w-auto text-center text-lg py-2.5 px-6"
          >
            CHEAT CODES DATABASE
          </Link>
          <button
            type="button"
            onClick={() => openMap()}
            className="gta-btn bg-black/75 text-gray-200 border border-gta-teal/60 hover:text-white hover:border-gta-teal hover:bg-gta-teal/20 w-full sm:w-auto text-center transition-all text-lg py-2.5 px-6 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            <Map size={18} className="text-gta-teal" />
            INTERACTIVE MAP
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Vice City Minimap Radar Widget in Corner (Clickable to Pop Open Map) */}
      <motion.button
        type="button"
        onClick={() => openMap()}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="hidden lg:flex fixed bottom-8 right-8 z-40 items-center gap-3 bg-black/90 backdrop-blur-md p-2.5 rounded-full border border-gta-teal/60 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:border-gta-pink hover:shadow-[0_0_30px_rgba(255,46,136,0.5)] transition-all cursor-pointer group text-left"
        aria-label="Open Interactive GTA Map"
      >
        <div className="relative w-14 h-14 rounded-full border-2 border-gta-teal group-hover:border-gta-pink overflow-hidden bg-gta-dark flex items-center justify-center transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 origin-center rounded-full pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(0, 229, 255, 0.45) 0deg, transparent 60deg, transparent 360deg)',
            }}
          />
          <div className="w-2 h-2 bg-gta-pink rounded-full shadow-[0_0_8px_#FF2E88] z-10" />
          <Crosshair size={28} className="text-gta-teal/40 absolute z-0" />
        </div>
        <div className="pr-3 text-left">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gta-teal animate-ping" />
            <span className="text-[10px] font-heading tracking-widest text-gta-teal group-hover:text-gta-pink transition-colors">
              CLICK TO OPEN MAP [M]
            </span>
          </div>
          <div className="text-[9px] text-gray-400 font-mono">VICE CITY RADAR // 25.76° N</div>
        </div>
      </motion.button>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
        <span className="text-[9px] font-heading tracking-[0.3em] text-gta-teal">SCROLL TO DISPATCHES</span>
        <ChevronDown size={16} className="animate-bounce text-gta-teal" />
      </div>
    </section>
  )
}
