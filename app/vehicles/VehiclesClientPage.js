'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Gauge, Shield, Zap, Compass, Siren, Flame, Volume2, Check, X } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const categories = ['All', 'Super', 'Muscle', 'Sports', 'Police & Emergency', 'SUVs', 'Bikes', 'Boats & Air']

export default function VehiclesClientPage({ vehicles }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [revvingId, setRevvingId] = useState(null)
  const { addToast } = useToast()

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchCat =
        selectedCategory === 'All' || v.class === selectedCategory
      const matchSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase()) ||
        v.badge.toLowerCase().includes(search.toLowerCase())

      return matchCat && matchSearch
    })
  }, [vehicles, search, selectedCategory])

  const handleRevEngine = (vehicle) => {
    setRevvingId(vehicle.id)
    addToast(`V8 Twin-Turbo Engine Revved: ${vehicle.name}!`, 'cheat', 2500)
    setTimeout(() => {
      setRevvingId(null)
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-pink/40 bg-gta-pink/10 text-gta-pink text-xs font-heading tracking-[0.25em] mb-4"
        >
          <Flame size={14} />
          LEONIDA AUTOMOTIVE REGISTRY
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4"
        >
          GTA 6 <span className="text-gta-pink neon-text-pink">CARS &amp; VEHICLES</span>
        </motion.h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Explore confirmed supercars, heavy American muscle, and Vice City Police Department (VCPD) pursuit cruisers.
          Check top speeds, handling stats, and spawn coordinates across Leonida.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-gta-card/90 border border-gta-border/80 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by car name, brand (Grotti, Bravado, Pfister), or location..."
              className="w-full pl-11 pr-10 py-3 bg-gta-dark/90 border border-gta-border/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gta-pink focus:ring-1 focus:ring-gta-pink font-body text-sm transition-all"
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
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs text-gray-400 font-heading tracking-wider mr-2 hidden sm:inline">
            CLASS:
          </span>
          {categories.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-heading text-xs tracking-wider uppercase transition-all ${
                  active
                    ? 'bg-gta-pink text-white border border-gta-pink shadow-[0_0_12px_rgba(255,46,136,0.4)]'
                    : 'bg-gta-dark/50 text-gray-400 border border-gta-border hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Vehicle Grid Count */}
      <div className="flex justify-between items-center text-xs text-gray-400 mb-6">
        <div>
          DISCOVERED <span className="text-white font-bold">{filteredVehicles.length}</span> VEHICLES IN LEONIDA
        </div>
        <div className="text-[11px] text-gta-teal font-heading tracking-wider">
          OFFICIAL TRAILER FOOTAGE &amp; DISCOVERIES
        </div>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const isRevving = revvingId === vehicle.id
            const isPolice = vehicle.class.includes('Police')

            return (
              <motion.div
                key={vehicle.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className={`card-gta p-6 border ${
                  isPolice
                    ? 'border-blue-500/60 hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'border-gta-border/80 hover:border-gta-pink/60 shadow-xl'
                } flex flex-col justify-between transition-all duration-300 relative overflow-hidden`}
              >
                {/* Top Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-heading tracking-widest px-2.5 py-1 rounded border uppercase ${
                        isPolice
                          ? 'border-blue-400/50 bg-blue-500/15 text-blue-300 flex items-center gap-1'
                          : 'border-gta-pink/40 bg-gta-pink/10 text-gta-pink'
                      }`}
                    >
                      {isPolice && <Siren size={11} className="animate-pulse text-red-400" />}
                      {vehicle.badge}
                    </span>
                    <span className="text-xs font-heading tracking-wider text-green-400 font-bold">
                      {vehicle.price}
                    </span>
                  </div>

                  {/* Vehicle Graphic Art Header */}
                  <div className="relative min-h-[7.5rem] rounded-xl bg-gradient-to-r from-gta-dark via-[#130922] to-gta-dark border border-gta-border/60 flex items-center justify-center p-4 mb-4 overflow-hidden">
                    <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />
                    {isRevving && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.2, 0.8, 0.3, 0.9, 0.4] }}
                        transition={{ duration: 0.25, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-gta-pink/20 via-gta-teal/20 to-orange-500/20"
                      />
                    )}
                    <div className="relative text-center w-full px-2 z-10">
                      <div
                        className={`font-heading text-white tracking-wider leading-tight break-words ${
                          vehicle.name.length > 28
                            ? 'text-xl sm:text-2xl'
                            : vehicle.name.length > 18
                            ? 'text-2xl sm:text-3xl'
                            : 'text-3xl sm:text-4xl'
                        }`}
                      >
                        {vehicle.name.toUpperCase()}
                      </div>
                      <span className="text-[10px] font-heading tracking-[0.25em] text-gray-500 uppercase mt-1.5 block">
                        {vehicle.brand} MOTOR DIVISION
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 font-body leading-relaxed mb-4">
                    {vehicle.desc}
                  </p>

                  {/* Performance Metrics Bars */}
                  <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-gta-border/50 text-xs">
                    {/* Top Speed */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-body">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Gauge size={12} className="text-gta-teal" /> BENCHMARK SPEED (EST.)
                        </span>
                        <span className="text-white font-mono font-bold">{vehicle.topSpeed} MPH</span>
                      </div>
                      <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                        <div
                          className="h-full bg-gradient-to-r from-gta-teal to-blue-500 rounded-full"
                          style={{ width: `${(vehicle.topSpeed / 240) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Acceleration */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-body">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Zap size={12} className="text-gta-orange" /> 0-60 MPH
                        </span>
                        <span className="text-white font-mono font-bold">{vehicle.acceleration}s</span>
                      </div>
                      <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                        <div
                          className="h-full bg-gradient-to-r from-gta-orange to-yellow-400 rounded-full"
                          style={{ width: `${Math.max(15, (6 / vehicle.acceleration) * 60)}%` }}
                        />
                      </div>
                    </div>

                    {/* Handling */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-body">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Compass size={12} className="text-gta-pink" /> HANDLING
                        </span>
                        <span className="text-white font-mono font-bold">{vehicle.handling}/10</span>
                      </div>
                      <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                        <div
                          className="h-full bg-gradient-to-r from-gta-pink to-purple-500 rounded-full"
                          style={{ width: `${(vehicle.handling / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Armor */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-body">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Shield size={12} className="text-green-400" /> ARMOR &amp; REINFORCEMENT
                        </span>
                        <span className="text-white font-mono font-bold">{vehicle.armor}/10</span>
                      </div>
                      <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                          style={{ width: `${(vehicle.armor / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Spawn Location */}
                  <div className="text-[11px] text-gray-400 font-body mb-4 flex items-start gap-1.5">
                    <span className="text-gta-teal font-heading tracking-wider uppercase flex-shrink-0">
                      SPAWN:
                    </span>
                    <span>{vehicle.location}</span>
                  </div>
                </div>

                {/* Interactive Action Button: Rev Engine */}
                <div className="pt-3 border-t border-gta-border/50">
                  <button
                    onClick={() => handleRevEngine(vehicle)}
                    className={`w-full py-2.5 rounded-lg font-heading text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                      isRevving
                        ? 'bg-gta-pink text-white shadow-[0_0_20px_rgba(255,46,136,0.6)] animate-pulse'
                        : 'bg-gta-dark hover:bg-gta-card border border-gta-border hover:border-gta-teal text-gray-300 hover:text-white'
                    }`}
                  >
                    <Volume2 size={14} className={isRevving ? 'animate-bounce text-yellow-300' : ''} />
                    {isRevving ? 'V8 ENGINE ROARING! 🔥' : 'REV ENGINE / TEST SOUND'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gta-card/40 rounded-xl border border-gta-border">
          <p className="font-heading text-3xl text-gray-500 mb-2">NO VEHICLES FOUND</p>
          <p className="text-gray-400 text-xs">Try selecting another class or clearing your search query.</p>
        </div>
      )}
      {/* Educational SEO & Guide Section */}
      <section className="mt-16 pt-12 border-t border-gta-border/60">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="font-heading text-xs tracking-[0.25em] text-gta-pink uppercase block mb-1">
              AUTOMOTIVE LORE &amp; INTELLIGENCE
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">
              GTA 6 VEHICLE <span className="gradient-text">ECOSYSTEM IN LEONIDA</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-body mb-4">
              Vehicles are central to the identity of Grand Theft Auto VI. Set in the diverse subtropical state of
              Leonida, transportation spans from pristine coastal supercar boulevards on Ocean Beach to treacherous,
              mud-soaked swamp trails in the Grassrivers. Rockstar Games has upgraded automotive physics using the latest
              RAGE engine, delivering distinct surface friction, advanced deformation modeling, and responsive vehicle
              audio.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-body">
              Whether you are evading tactical VCPD pursuit cruisers across interstate highway bridges or cruising the
              nightlife district in an Italian exotic, explore our interactive tools including our{' '}
              <a href="/map" className="text-gta-pink hover:underline font-semibold">
                interactive map
              </a>
              , tested{' '}
              <a href="/cheats" className="text-gta-teal hover:underline font-semibold">
                cheat codes guide
              </a>
              , and essential{' '}
              <a href="/guides" className="text-gta-orange hover:underline font-semibold">
                beginner tips
              </a>
              .
            </p>
          </div>

          {/* Vehicle Class Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-5 rounded-xl bg-gta-card border border-gta-border/80">
              <h3 className="font-heading text-xl text-white mb-2 flex items-center gap-2">
                <span className="text-gta-pink">★</span> SUPER &amp; SPORTS EXOTICS
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-body">
                Vice City’s affluent waterfronts feature contemporary hypercars like the Pegassi Torero XO alongside
                heritage classics like the Grotti Cheetah Classic and Pfister Comet S2 Cabrio, inspired by iconic Italian
                and German automotive engineering.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gta-card border border-gta-border/80">
              <h3 className="font-heading text-xl text-white mb-2 flex items-center gap-2">
                <span className="text-blue-400">★</span> VCPD LAW ENFORCEMENT FLEET
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-body">
                The Vice City Police Department deploys modern Buffalo EVX interceptors, heavy SWAT Riot carriers for
                5-star containment, highway patrol motorcycles, and high-speed coastal patrol boats to monitor shipping
                canals.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gta-card border border-gta-border">
            <span className="font-heading text-xs tracking-widest text-gta-teal uppercase block mb-1">
              COMMUNITY INTEL
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-white mb-6">
              FREQUENTLY ASKED <span className="text-gta-teal neon-text-teal">QUESTIONS</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg text-white mb-1">
                  What cars are officially confirmed for GTA 6?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  Official trailer footage has confirmed returning icons and new models, including the Grotti Cheetah
                  Classic (Ferrari Testarossa), Pegassi Torero XO (Lamborghini Countach), Bravado Gauntlet Hellfire
                  (Dodge Challenger Hellcat), Pfister Comet S2 (Porsche 911), Albany Cavalcade XL (Cadillac Escalade), and
                  the dual protagonists’ getaway car, the Declasse Tulip M-100 (1970s Chevrolet Chevelle).
                </p>
              </div>

              <div className="border-t border-gta-border/50 pt-4">
                <h3 className="font-heading text-lg text-white mb-1">
                  How does vehicle handling differ across terrain in Leonida?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  Vehicles react realistically to surface friction. Smooth asphalt allows maximum traction for supercars,
                  while driving onto wet sands, dirt trails, or the murky waters of the Grassrivers requires high-clearance
                  off-road vehicles or specialized airboats.
                </p>
              </div>

              <div className="border-t border-gta-border/50 pt-4">
                <h3 className="font-heading text-lg text-white mb-1">
                  Are vehicles fully customizable in GTA 6?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  Yes. Trailer footage showcases extensive car meets and street takeovers featuring customized widebody
                  fenders, performance spoilers, aftermarket rims, custom paint finishes, and audio systems.
                </p>
              </div>

              <div className="border-t border-gta-border/50 pt-4">
                <h3 className="font-heading text-lg text-white mb-1">
                  What is the main getaway vehicle used by Jason and Lucia?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
                  The primary vehicle highlighted with protagonists Jason and Lucia in promotional materials is the
                  Declasse Tulip M-100, a classic four-door American muscle car engineered for durability during early
                  robbery getaways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
