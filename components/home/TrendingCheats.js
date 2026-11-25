'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Flame, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

export default function TrendingCheats({ cheats = [] }) {
  const [copiedId, setCopiedId] = useState(null)
  const { addToast } = useToast()

  const handleCopy = (cheat, platform, code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(`${cheat.id}-${platform}`)
    addToast(`${cheat.name} code for ${platform.toUpperCase()} copied!`, 'cheat')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-gta-orange font-heading tracking-widest text-xs uppercase mb-2">
            <Flame size={16} className="text-gta-orange animate-pulse" />
            POPULAR COMBOS
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide">
            TRENDING <span className="text-gta-orange neon-text-orange">CHEATS</span>
          </h2>
        </div>
        <Link
          href="/cheats"
          className="inline-flex items-center gap-2 text-gta-teal hover:text-white font-heading text-sm tracking-wider uppercase transition-colors group"
        >
          VIEW ALL VERIFIED CODES
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cheats.slice(0, 4).map((cheat, i) => (
          <motion.div
            key={cheat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="bg-gta-card/90 border border-gta-border/80 hover:border-gta-orange/60 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(255,138,61,0.15)]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-heading tracking-wider px-2 py-0.5 rounded border border-gta-orange/30 bg-gta-orange/10 text-gta-orange">
                  {cheat.category}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">#{cheat.id}</span>
              </div>
              <h3 className="font-heading text-xl text-white mb-1">{cheat.name}</h3>
              <p className="text-xs text-gray-400 mb-4 line-clamp-2">{cheat.description}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gta-border/40">
              {['ps5', 'xbox', 'pc'].map((plat) => {
                const code = cheat[plat]
                if (!code) return null
                const isCopied = copiedId === `${cheat.id}-${plat}`
                return (
                  <button
                    key={plat}
                    onClick={() => handleCopy(cheat, plat, code)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-gta-dark/70 hover:bg-gta-border/40 border border-gta-border/40 text-left transition-colors group/btn"
                    title={`Click to copy ${plat.toUpperCase()} code`}
                  >
                    <span className="text-[10px] font-heading tracking-wider text-gray-400 uppercase w-10">
                      {plat}
                    </span>
                    <span className="text-xs font-mono text-gray-200 truncate flex-1 text-center font-semibold">
                      {code}
                    </span>
                    <span className="ml-2">
                      {isCopied ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <Copy size={12} className="text-gray-500 group-hover/btn:text-gta-orange transition-colors" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
