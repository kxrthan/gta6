'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Map as MapIcon } from 'lucide-react'
import Link from 'next/link'
import LeonidaTacticalMap, {
  LEONIDA_MAP_BLIPS,
  BLIP_FILTERS,
} from '@/components/map/LeonidaTacticalMap'

export { LEONIDA_MAP_BLIPS as GTA_MAP_BLIPS, BLIP_FILTERS }

export default function GtaMapModal({ isOpen, onClose, initialBlipId = null }) {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
          onClose()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 select-none">
        {/* Fullscreen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[96vh] bg-[#070914] border-2 border-gta-teal/60 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden z-10"
        >
          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/95 border-b border-gta-border/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gta-pink/20 border border-gta-pink/60 flex items-center justify-center text-gta-pink shadow-[0_0_12px_rgba(255,46,136,0.4)]">
                <MapIcon size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gta-pink animate-ping" />
                  <span className="font-heading text-sm sm:text-base tracking-[0.25em] text-white">
                    LEONIDA SATELLITE CARTOGRAPHY
                  </span>
                </div>
                <span className="text-[10px] text-gta-teal font-mono">
                  AUTHENTIC LEONIDA MAP SHAPE · RECON PINS &amp; GPS ROUTING
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/map"
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gta-teal/40 bg-gta-teal/10 hover:bg-gta-teal/20 text-gta-teal text-xs font-heading tracking-wider transition-colors"
              >
                <span>OPEN FULL PAGE</span>
                <ExternalLink size={12} />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-gta-dark border border-gta-border/80 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                title="Close Map [ESC or M]"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body: Embedded Leonida Tactical Map */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <LeonidaTacticalMap
              initialBlipId={initialBlipId}
              isModal={true}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
