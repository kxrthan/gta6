'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Copy, Check, AlertTriangle, Sparkles, X, Gamepad, Terminal } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const platforms = ['All', 'PS5', 'Xbox', 'PC']
const categories = ['All', 'Weapons', 'Vehicles', 'Player', 'Wanted', 'World']

const categoryThemes = {
  Weapons: {
    badge: 'border-red-500/40 bg-red-500/10 text-red-400',
    border: 'hover:border-red-500/60',
    glow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]',
  },
  Vehicles: {
    badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    border: 'hover:border-blue-500/60',
    glow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
  },
  Player: {
    badge: 'border-green-500/40 bg-green-500/10 text-green-400',
    border: 'hover:border-green-500/60',
    glow: 'hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]',
  },
  Wanted: {
    badge: 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400',
    border: 'hover:border-yellow-400/60',
    glow: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.2)]',
  },
  World: {
    badge: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    border: 'hover:border-purple-500/60',
    glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
  },
}

export default function CheatsClientPage({ cheats }) {
  const [search, setSearch] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState(null)
  const { addToast } = useToast()

  const handleCopyCode = (cheat, platformKey, code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(`${cheat.id}-${platformKey}`)
    addToast(`${cheat.name} activated for ${platformKey.toUpperCase()}!`, 'cheat', 3000)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredCheats = useMemo(() => {
    return cheats.filter((cheat) => {
      const matchesSearch =
        !search ||
        cheat.name.toLowerCase().includes(search.toLowerCase()) ||
        cheat.description.toLowerCase().includes(search.toLowerCase()) ||
        (cheat.combo && cheat.combo.toLowerCase().includes(search.toLowerCase())) ||
        (cheat.ps5 && cheat.ps5.toLowerCase().includes(search.toLowerCase())) ||
        (cheat.xbox && cheat.xbox.toLowerCase().includes(search.toLowerCase())) ||
        (cheat.pc && cheat.pc.toLowerCase().includes(search.toLowerCase())) ||
        (cheat.effect && cheat.effect.toLowerCase().includes(search.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'All' || cheat.category === selectedCategory

      const matchesPlatform =
        selectedPlatform === 'All' ||
        (selectedPlatform === 'PS5' && cheat.ps5) ||
        (selectedPlatform === 'Xbox' && cheat.xbox) ||
        (selectedPlatform === 'PC' && cheat.pc)

      return matchesSearch && matchesCategory && matchesPlatform
    })
  }, [cheats, search, selectedCategory, selectedPlatform])

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setSelectedPlatform('All')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-orange/40 bg-gta-orange/10 text-gta-orange text-xs font-heading tracking-[0.25em] mb-4"
        >
          <Gamepad size={14} />
          VERIFIED CHEAT CODES DATABASE
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4"
        >
          GTA 6 <span className="text-gta-orange neon-text-orange">CHEAT CODES</span>
        </motion.h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
          Every button combination and console command for PlayStation 5, Xbox Series X/S, and PC.
          Click any code below to copy it with instant activation confirmation.
        </p>

        {/* Warning Notice */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-body">
          <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0" />
          <span>Note: Using cheats disables Trophies and Achievements for the active session. Save first!</span>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-gta-card/90 border border-gta-border/80 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code name, effect, vehicle, PC keyword..."
              className="w-full pl-11 pr-10 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gta-orange focus:ring-1 focus:ring-gta-orange font-body text-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Platform Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-gta-dark/90 p-1 rounded-xl border border-gta-border">
            {platforms.map((plat) => {
              const active = selectedPlatform === plat
              return (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-4 py-2 rounded-lg font-heading text-xs tracking-wider uppercase transition-all ${
                    active
                      ? 'bg-gta-teal text-gta-dark font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 pt-4 border-t border-gta-border/50 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-heading tracking-wider mr-2">
            CATEGORY:
          </span>
          {categories.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-heading text-xs tracking-wider uppercase transition-all ${
                  active
                    ? 'bg-gta-pink text-white border border-gta-pink shadow-[0_0_12px_rgba(255,46,136,0.4)]'
                    : 'bg-gta-dark/50 text-gray-400 border border-gta-border hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}

          {(search || selectedCategory !== 'All' || selectedPlatform !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-xs text-gta-pink hover:underline ml-auto font-heading tracking-wider flex items-center gap-1"
            >
              <X size={12} /> CLEAR FILTERS
            </button>
          )}
        </div>
      </div>

      {/* Cheats Grid */}
      <div className="mb-6 flex justify-between items-center text-xs text-gray-400">
        <div>
          FOUND <span className="text-white font-bold">{filteredCheats.length}</span> CHEAT CODES
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span>ALL CODES TESTED & WORKING</span>
        </div>
      </div>

      {filteredCheats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCheats.map((cheat) => {
            const theme = categoryThemes[cheat.category] || categoryThemes.Weapons

            return (
              <motion.div
                key={cheat.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`card-gta p-6 border border-gta-border/80 ${theme.border} ${theme.glow} flex flex-col justify-between transition-all duration-300 relative`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-heading tracking-widest px-2.5 py-0.5 rounded border uppercase ${theme.badge}`}>
                      {cheat.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">#{cheat.id}</span>
                  </div>

                  <h3 className="font-heading text-2xl text-white mb-2">{cheat.name}</h3>
                  <p className="text-xs text-gray-300 font-body leading-relaxed mb-3">
                    {cheat.description}
                  </p>

                  {cheat.effect && (
                    <div className="text-xs text-gta-teal font-body mb-3 flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>{cheat.effect}</span>
                    </div>
                  )}

                  {cheat.combo && (
                    <div className="text-[11px] text-gray-400 font-mono bg-black/40 border border-gta-border/40 rounded-lg p-2.5 mb-3">
                      <span className="text-gta-teal font-heading text-[10px] tracking-wider uppercase block mb-1">
                        D-PAD SEQUENCE (PS5 &amp; XBOX):
                      </span>
                      <span className="text-gray-200 font-semibold">{cheat.combo}</span>
                    </div>
                  )}

                  {cheat.warning && (
                    <div className="text-[11px] text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/20 rounded p-2 mb-4 flex items-start gap-1.5">
                      <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-yellow-400" />
                      <span>{cheat.warning}</span>
                    </div>
                  )}
                </div>

                {/* Platform Code Rows */}
                <div className="space-y-2 pt-3 border-t border-gta-border/50">
                  {/* PS5 */}
                  {(selectedPlatform === 'All' || selectedPlatform === 'PS5') && cheat.ps5 && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gta-dark/80 border border-gta-border/60">
                      <div className="flex items-center gap-1.5 w-14 flex-shrink-0">
                        <span className="text-[10px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          PS5
                        </span>
                      </div>
                      <code className="text-xs font-mono text-gray-200 flex-1 text-center font-bold tracking-wider">
                        {cheat.ps5}
                      </code>
                      <button
                        onClick={() => handleCopyCode(cheat, 'ps5', cheat.ps5)}
                        className="p-1.5 rounded hover:bg-gta-border text-gray-400 hover:text-white transition-colors"
                        title="Copy PS5 button combo"
                      >
                        {copiedId === `${cheat.id}-ps5` ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Xbox */}
                  {(selectedPlatform === 'All' || selectedPlatform === 'Xbox') && cheat.xbox && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gta-dark/80 border border-gta-border/60">
                      <div className="flex items-center gap-1.5 w-14 flex-shrink-0">
                        <span className="text-[10px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          XBOX
                        </span>
                      </div>
                      <code className="text-xs font-mono text-gray-200 flex-1 text-center font-bold tracking-wider">
                        {cheat.xbox}
                      </code>
                      <button
                        onClick={() => handleCopyCode(cheat, 'xbox', cheat.xbox)}
                        className="p-1.5 rounded hover:bg-gta-border text-gray-400 hover:text-white transition-colors"
                        title="Copy Xbox button combo"
                      >
                        {copiedId === `${cheat.id}-xbox` ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )}

                  {/* PC */}
                  {(selectedPlatform === 'All' || selectedPlatform === 'PC') && cheat.pc && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gta-dark/80 border border-gta-border/60">
                      <div className="flex items-center gap-1.5 w-14 flex-shrink-0">
                        <span className="text-[10px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-0.5">
                          <Terminal size={10} /> PC
                        </span>
                      </div>
                      <code className="text-xs font-mono text-gta-orange flex-1 text-center font-bold tracking-widest uppercase">
                        {cheat.pc}
                      </code>
                      <button
                        onClick={() => handleCopyCode(cheat, 'pc', cheat.pc)}
                        className="p-1.5 rounded hover:bg-gta-border text-gray-400 hover:text-white transition-colors"
                        title="Copy PC console command"
                      >
                        {copiedId === `${cheat.id}-pc` ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-gta-card/40 rounded-2xl border border-gta-border/60">
          <div className="font-heading text-4xl text-gray-500 mb-2">NO CHEAT CODES FOUND</div>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Try searching for a different keyword or resetting your platform and category filters.
          </p>
          <button onClick={clearFilters} className="gta-btn-secondary">
            RESET ALL FILTERS
          </button>
        </div>
      )}
      {/* Educational SEO & Guide Section */}
      <section className="mt-16 pt-12 border-t border-gta-border/60">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="font-heading text-xs tracking-[0.25em] text-gta-orange uppercase block mb-1">
              OPERATIONAL CHEAT BRIEFING
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">
              HOW TO USE <span className="gradient-text">GTA 6 CHEAT CODES</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-body mb-4">
              Cheat codes have been an integral part of the Grand Theft Auto experience across every generation. In
              GTA 6, players roaming Vice City and the state of Leonida can input directional D-Pad button sequences
              fluidly on PlayStation 5 and Xbox Series X/S controllers to alter gameplay parameters, boost character focus,
              cycle weather conditions, or grant emergency cash funds.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-body">
              For in-depth analysis and the full verification ledger, read our comprehensive{' '}
              <a href="/blog/complete-cheat-codes-guide" className="text-gta-pink hover:underline font-semibold">
                GTA 6 cheat codes guide
              </a>
              , explore the{' '}
              <a href="/vehicles" className="text-gta-teal hover:underline font-semibold">
                confirmed vehicles database
              </a>
              , or consult our{' '}
              <a href="/map" className="text-gta-orange hover:underline font-semibold">
                Leonida interactive map
              </a>
              .
            </p>
          </div>

          {/* Tactical Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-5 rounded-xl bg-gta-card border border-gta-border/80">
              <h3 className="font-heading text-xl text-yellow-400 mb-2 flex items-center gap-2">
                <span>⚠️</span> TROPHY &amp; ACHIEVEMENT PENALTY
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-body">
                Activating any cheat code temporarily disables PlayStation 5 Trophies and Xbox Achievements for that
                active session. Always create an independent manual save before entering button combinations so you can
                reload later without affecting your completion progress.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gta-card border border-gta-border/80">
              <h3 className="font-heading text-xl text-gta-teal mb-2 flex items-center gap-2">
                <span>🔒</span> SINGLE PLAYER CAMPAIGN ONLY
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-body">
                Cheats are strictly functional in single-player story mode across Vice City and Leonida. They cannot be
                used, activated, or transferred into any multiplayer or GTA Online environment.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gta-card border border-gta-border">
            <span className="font-heading text-xs tracking-widest text-gta-orange uppercase block mb-1">
              FREQUENTLY ASKED
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-white mb-6">
              CHEAT CODE <span className="text-gta-orange neon-text-orange">QUESTIONS</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg text-white mb-1">
                  How do you enter cheat codes in GTA 6?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  Input the directional arrow sequences on your D-Pad while freely roaming the game world without pausing.
                  Execute each button press in steady succession. A brief on-screen confirmation badge will signal that
                  the cheat was accepted.
                </p>
              </div>

              <div className="border-t border-gta-border/50 pt-4">
                <h3 className="font-heading text-lg text-white mb-1">
                  What is the combination for the $250,000 cash cheat?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  The reported sequence is <code className="text-gta-pink font-mono bg-black/50 px-2 py-0.5 rounded">↑ → ↓ ← ↑ ← ↓ →</code> (Up, Right, Down, Left, Up, Left, Down, Right).
                  This deposits $250,000 directly into your active protagonist’s funds.
                </p>
              </div>

              <div className="border-t border-gta-border/50 pt-4">
                <h3 className="font-heading text-lg text-white mb-1">
                  How does the Unlimited Focus cheat work?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  Entering <code className="text-gta-teal font-mono bg-black/50 px-2 py-0.5 rounded">↓ ↑ ↑ ↓ ↑ ↓ ↑ ↓ ↑ →</code> locks your Focus meter at 100%, allowing permanent precision
                  targeting and slow-motion combat reflexes during intense firefights.
                </p>
              </div>

              <div className="border-t border-gta-border/50 pt-4">
                <h3 className="font-heading text-lg text-white mb-1">
                  Do cheats save when you quit GTA 6?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  No. Cheat effects are session-specific and reset when the game is restarted or reloaded from a previous save file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
