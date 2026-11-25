'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Navigation,
  Crosshair,
  Shield,
  DollarSign,
  Wrench,
  Siren,
  Car,
  Target,
  Plane,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  X,
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

// Authentic GTA Web Audio synthesizer for radar beep / waypoint cues
function playGtaSound(type = 'blip') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    if (type === 'blip') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(820, now)
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.05)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.06)
    } else if (type === 'waypoint') {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      osc1.type = 'triangle'
      osc2.type = 'sine'
      osc1.frequency.setValueAtTime(540, now)
      osc1.frequency.setValueAtTime(1080, now + 0.09)
      osc2.frequency.setValueAtTime(810, now)
      osc2.frequency.setValueAtTime(1620, now + 0.09)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.25)
      osc2.stop(now + 0.25)
    } else if (type === 'open') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.16)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.16)
    }
  } catch {
    // AudioContext blocked by policy until user interaction
  }
}

// Authentic Leonida Cartography Blip Locations mapped 1:1 onto the official Leonida map image
export const LEONIDA_MAP_BLIPS = [
  {
    id: 'vcpd-hq',
    name: 'VCPD Central Headquarters',
    type: 'police',
    county: 'Vice Dale County',
    district: 'Downtown Vice City',
    coords: '25.7781° N, 80.1313° W',
    x: 77.5,
    y: 53.0,
    threat: 'Extreme (4-Star SWAT)',
    icon: Siren,
    color: '#3b82f6',
    desc: 'Central command citadel of the Vice City Police Department. Houses heavy tactical SWAT transport, helicopter landing pads, and a reinforced armory.',
    loot: 'SWAT Armory Crates & Police Tactical Gear',
    cops: 'High Response Time (< 60s)',
  },
  {
    id: 'safehouse-oceanview',
    name: 'Ocean View Beach Safehouse',
    type: 'safehouse',
    county: 'Vice Dale County',
    district: 'Vice Beach / Ocean Drive',
    coords: '25.7617° N, 80.1918° W',
    x: 88.0,
    y: 52.5,
    threat: 'Low (Sanctuary)',
    icon: Shield,
    color: '#4ade80',
    desc: 'Lucia & Jason’s oceanfront safehouse with underground garage, concealed weapons cache, and wardrobe.',
    loot: 'Personal Armory & Stashed Cash',
    cops: 'Zero Patrol Inside',
  },
  {
    id: 'bank-vault',
    name: 'First National Bank of Vice City',
    type: 'heist',
    county: 'Vice Dale County',
    district: 'Downtown Financial',
    coords: '25.7720° N, 80.1380° W',
    x: 76.0,
    y: 49.5,
    threat: 'High Security (5-Star Alert)',
    icon: DollarSign,
    color: '#facc15',
    desc: 'Fortified subterranean bank vault holding $50,000,000+ in gold bullion and bearer bonds. Multi-phase heist target.',
    loot: '$50,000,000+ Bullion & Bonds',
    cops: 'Immediate SWAT Mobilization',
  },
  {
    id: 'airport-mia',
    name: 'Vice City International Airport (MIA)',
    type: 'airport',
    county: 'Vice Dale County',
    district: 'Airport Metro Sector',
    coords: '25.7950° N, 80.2870° W',
    x: 62.0,
    y: 58.0,
    threat: 'Restricted Airspace (3-Star)',
    icon: Plane,
    color: '#00E5FF',
    desc: 'Expansive international airport featuring dual intersecting commercial runways, private jet hangars, and cargo terminals.',
    loot: 'Private Learjets & Air Freight Goods',
    cops: 'Airport Security & TSA Checkpoints',
  },
  {
    id: 'starfish-dealership',
    name: 'Starfish Luxury Supercar Imports',
    type: 'dealership',
    county: 'Vice Dale County',
    district: 'Starfish Island',
    coords: '25.7725° N, 80.1740° W',
    x: 82.5,
    y: 51.0,
    threat: 'Private Security',
    icon: Car,
    color: '#FF2E88',
    desc: 'High-end exotic car showroom surrounded by billionaire mansions. Features imported Grotti Cheetahs, Pegassi Toreros, and Pfister exotics.',
    loot: 'Exotic Vehicles Valued at $2M+',
    cops: 'Private Armed Security Guards',
  },
  {
    id: 'ammunation-havana',
    name: 'Ammu-Nation Gun Range & Arsenal',
    type: 'weapons',
    county: 'Vice Dale County',
    district: 'Little Havana',
    coords: '25.7650° N, 80.2100° W',
    x: 73.0,
    y: 56.5,
    threat: 'Armed Personnel',
    icon: Target,
    color: '#f87171',
    desc: 'Premier firearms emporium. Heavy explosives, kevlar body armor, sniper modifications, and underground firing range.',
    loot: 'Heavy Firearms & Ballistic Armor',
    cops: 'Gun Shop Owner Armed with Shotgun',
  },
  {
    id: 'malibu-nightclub',
    name: 'The Malibu Club',
    type: 'heist',
    county: 'Vice Dale County',
    district: 'Vice Beach Strip',
    coords: '25.7890° N, 80.1280° W',
    x: 86.5,
    y: 46.0,
    threat: 'Syndicate VIP',
    icon: Sparkles,
    color: '#ec4899',
    desc: 'Iconic neon nightclub with pulsating synthwave music, VIP lounge, and syndicate money-laundering operations.',
    loot: 'Nightclub Safe & Cartel Laundered Cash',
    cops: 'Bouncers & Disguised Vice Squad',
  },
  {
    id: 'port-gellhorn-chop',
    name: 'Port Gellhorn Freight Chop Shop',
    type: 'garage',
    county: 'Mariana County',
    district: 'Port Gellhorn Shipping Docks',
    coords: '25.7120° N, 80.2540° W',
    x: 32.5,
    y: 72.0,
    threat: 'Cartel Run (4-Star)',
    icon: Wrench,
    color: '#FF8A3D',
    desc: 'Underground vehicle respray, engine tuning workshop, and stolen cargo dismantling bay. Cools down police wanted levels immediately.',
    loot: 'Stolen Supercars & Engine Turbochargers',
    cops: 'Minimum Law Patrol Presence',
  },
  {
    id: 'everglades-airfield',
    name: 'Grassrivers Smuggler Dirt Airstrip',
    type: 'safehouse',
    county: 'Leonida Wetlands',
    district: 'Grassrivers (Everglades)',
    coords: '25.6420° N, 80.5210° W',
    x: 48.0,
    y: 48.0,
    threat: 'Hostile Wilderness (Alligators)',
    icon: Shield,
    color: '#4ade80',
    desc: 'Clandestine dirt runway hidden deep in the sawgrass bayous. Base for drug runner seaplanes and Sea Sparrow amphibious choppers.',
    loot: 'Airdropped Contraband Crates',
    cops: 'Zero Police Presence',
  },
  {
    id: 'lake-leonida-refinery',
    name: 'Ambrosia Agri-Corridor & Refinery',
    type: 'heist',
    county: 'Leonard County',
    district: 'Lake Leonida Shore',
    coords: '26.1420° N, 80.3840° W',
    x: 68.0,
    y: 28.0,
    threat: 'Industrial Security (3-Star)',
    icon: DollarSign,
    color: '#facc15',
    desc: 'Massive agricultural sugar refineries, freight train depot, and chemical silos bordering the immense freshwater Lake Leonida.',
    loot: 'Freight Shipments & Industrial Payroll',
    cops: 'State Troopers Patrol Highway',
  },
  {
    id: 'mount-kalaga-dam',
    name: 'Mount Kalaga Hydroelectric Complex',
    type: 'bunker',
    county: 'Lummox County',
    district: 'Northern Mountain Range',
    coords: '26.4150° N, 80.6100° W',
    x: 52.0,
    y: 12.0,
    threat: 'Military Installation (5-Star)',
    icon: Crosshair,
    color: '#a855f7',
    desc: 'Heavily fortified underground bunker complex and massive hydroelectric dam in northern Leonida. Decrypted file telemetry reveals enterable subterranean tracks.',
    loot: 'Military Prototypes & Radar Jammer',
    cops: 'Armed PMC & High-Voltage Perimeter',
  },
  {
    id: 'key-zancudo-naval',
    name: 'Key Zancudo Naval Air Station',
    type: 'airport',
    county: 'Gator Keys',
    district: 'Southern Archipelago Runway',
    coords: '24.5551° N, 81.7800° W',
    x: 24.0,
    y: 91.5,
    threat: 'Military War Zone (5-Star)',
    icon: Plane,
    color: '#00E5FF',
    desc: 'Fortified naval airbase at the southwest tip of the Gator Keys archipelago. Houses P-996 Lazer jet fighters, attack boats, and SAM missile batteries.',
    loot: 'Military Jet Fighters & Heavy Ordnance',
    cops: 'Lethal Shoot-on-Sight Authorization',
  },
  {
    id: 'kelly-quarry',
    name: 'Kelly County Aggregate Quarry',
    type: 'garage',
    county: 'Kelly County',
    district: 'Central Farmlands',
    coords: '25.9200° N, 80.5100° W',
    x: 38.0,
    y: 33.0,
    threat: 'Moderate (2-Star)',
    icon: Wrench,
    color: '#FF8A3D',
    desc: 'Vast open-pit limestone quarry with heavy excavation dump trucks, dirt tracks, and illegal street drifting circuits.',
    loot: 'Industrial Heavy Equipment & Tools',
    cops: 'County Sheriff Patrols',
  },
]

export const BLIP_FILTERS = [
  { id: 'all', label: 'All Markers', icon: Compass, color: 'text-white' },
  { id: 'police', label: 'VCPD Precincts', icon: Siren, color: 'text-blue-400' },
  { id: 'safehouse', label: 'Safehouses', icon: Shield, color: 'text-green-400' },
  { id: 'heist', label: 'Heists & Banks', icon: DollarSign, color: 'text-yellow-400' },
  { id: 'weapons', label: 'Ammu-Nation', icon: Target, color: 'text-red-400' },
  { id: 'dealership', label: 'Supercars', icon: Car, color: 'text-gta-pink' },
  { id: 'airport', label: 'Airports & Naval', icon: Plane, color: 'text-cyan-400' },
]

export const LEONIDA_COUNTIES_INFO = [
  {
    name: 'VICE DALE COUNTY',
    tag: 'VICE CITY METRO',
    color: 'border-gta-pink text-gta-pink',
    desc: 'The neon metropolis: Ocean Drive pastel hotels, Downtown skyscrapers, Starfish Island villas, and Vice City International Airport.',
  },
  {
    name: 'MARIANA COUNTY',
    tag: 'PORT GELLHORN',
    color: 'border-gta-orange text-gta-orange',
    desc: 'Deepwater container freight shipping docks, chemical refineries, and illicit drag strip raceways.',
  },
  {
    name: 'GATOR KEYS',
    tag: 'SOUTHERN KEYS',
    color: 'border-cyan-400 text-cyan-400',
    desc: 'Tropical islands connected by monumental bridges leading to the Key Zancudo Naval Air Station.',
  },
  {
    name: 'LEONIDA WETLANDS',
    tag: 'THE GRASSRIVERS',
    color: 'border-green-400 text-green-400',
    desc: 'Endless sawgrass swamplands, predator alligators, fan airboats, and clandestine smuggler dirt runways.',
  },
  {
    name: 'LEONARD COUNTY',
    tag: 'LAKE LEONIDA',
    color: 'border-blue-400 text-blue-400',
    desc: 'Enormous freshwater inland sea surrounded by the Ambrosia agricultural sugar refineries.',
  },
  {
    name: 'LUMMOX COUNTY',
    tag: 'NORTHERN PEAKS',
    color: 'border-purple-400 text-purple-400',
    desc: 'Rugged northern mountain ranges, Mount Kalaga hydroelectric dam, and enterable underground complexes.',
  },
  {
    name: 'KELLY COUNTY',
    tag: 'RED DIRT BASIN',
    color: 'border-yellow-400 text-yellow-400',
    desc: 'Rolling red-dirt farmsteads, aggregate limestone quarries, and rural dirt race tracks.',
  },
]

export default function LeonidaTacticalMap({
  initialBlipId = null,
  isModal = false,
  onClose = null,
}) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [activeBlip, setActiveBlip] = useState(LEONIDA_MAP_BLIPS[0])
  const [waypoint, setWaypoint] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mapMode, setMapMode] = useState('satellite') // 'satellite' | 'vector'
  const mapContainerRef = useRef(null)
  const { addToast } = useToast()

  // Player position (Jason & Lucia starting near Ocean View Safehouse)
  const playerPos = { x: 86.0, y: 54.0 }

  useEffect(() => {
    if (initialBlipId) {
      const match = LEONIDA_MAP_BLIPS.find((b) => b.id === initialBlipId)
      if (match) setActiveBlip(match)
    }
  }, [initialBlipId])

  const handleSelectBlip = useCallback(
    (blip) => {
      setActiveBlip(blip)
      if (soundEnabled) playGtaSound('blip')
    },
    [soundEnabled]
  )

  const handleSetWaypoint = useCallback(
    (blip) => {
      setWaypoint(blip)
      if (soundEnabled) playGtaSound('waypoint')
      if (addToast) {
        addToast(
          `📍 GPS WAYPOINT LOCKED: ${blip.name.toUpperCase()} (${blip.county})`,
          'cheat',
          3500
        )
      }
    },
    [soundEnabled, addToast]
  )

  const handleClearWaypoint = useCallback(() => {
    setWaypoint(null)
    if (soundEnabled) playGtaSound('blip')
    if (addToast) addToast('GPS Waypoint cleared.', 'info', 2000)
  }, [soundEnabled, addToast])

  // Distance calculation in miles
  const calculateDistance = (blip) => {
    const dx = ((blip.x - playerPos.x) * 45) / 100
    const dy = ((blip.y - playerPos.y) * 60) / 100
    const dist = Math.sqrt(dx * dx + dy * dy)
    const miles = Math.max(0.4, dist * 1.8).toFixed(1)
    const etaMins = Math.max(1, Math.round(dist * 1.2))
    return { miles, etaMins }
  }

  const filteredBlips = LEONIDA_MAP_BLIPS.filter(
    (b) => selectedFilter === 'all' || b.type === selectedFilter
  )

  return (
    <div className="w-full flex flex-col bg-[#05070e] text-white rounded-2xl overflow-hidden border border-gta-teal/40 shadow-2xl">
      {/* 1. Tactical Map Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 bg-black/90 border-b border-gta-border/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gta-teal/20 border border-gta-teal/60 flex items-center justify-center text-gta-teal shadow-[0_0_12px_rgba(0,229,255,0.4)]">
            <Crosshair size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gta-teal animate-ping" />
              <span className="font-heading text-sm sm:text-base tracking-[0.25em] text-white">
                LEONIDA CARTOGRAPHY // GPS RADAR
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              AUTHENTIC GTA 6 GEOGRAPHY · 7 COUNTIES · REAL-TIME SATELLITE TELEMETRY
            </span>
          </div>
        </div>

        {/* View Mode & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/60 p-1 rounded-lg border border-gta-border/60 text-xs font-heading">
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded text-[11px] tracking-wider uppercase transition-all ${
                mapMode === 'satellite'
                  ? 'bg-gta-teal text-gta-dark font-bold shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Satellite Recon
            </button>
            <button
              type="button"
              onClick={() => setMapMode('vector')}
              className={`px-2.5 py-1 rounded text-[11px] tracking-wider uppercase transition-all ${
                mapMode === 'vector'
                  ? 'bg-gta-pink text-white font-bold shadow-[0_0_10px_rgba(255,46,136,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Vector Radar
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-gta-teal/20 border-gta-teal text-gta-teal'
                : 'bg-black/60 border-gta-border text-gray-500 hover:text-gray-300'
            }`}
            title={soundEnabled ? 'Mute GPS Audio Cues' : 'Unmute GPS Audio Cues'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Close button if in modal */}
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gta-dark border border-gta-border/80 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              title="Close Map"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Blip Filter Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/75 border-b border-gta-border/60 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {BLIP_FILTERS.map((f) => {
            const Icon = f.icon
            const active = selectedFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-heading tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-gta-teal text-gta-dark font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-black/50 border border-gta-border/60 text-gray-300 hover:text-white hover:border-gray-400'
                }`}
              >
                <Icon size={12} className={active ? 'text-gta-dark' : f.color} />
                <span>{f.label}</span>
              </button>
            )
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.25).toFixed(2)))}
            className="p-1.5 rounded bg-black/60 border border-gta-border/60 text-gray-300 hover:text-white hover:border-gta-teal transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <span className="text-[10px] font-mono px-1.5 text-gta-teal font-bold min-w-[36px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.25).toFixed(2)))}
            className="p-1.5 rounded bg-black/60 border border-gta-border/60 text-gray-300 hover:text-white hover:border-gta-teal transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-1.5 rounded bg-black/60 border border-gta-border/60 text-gray-300 hover:text-white hover:border-gta-teal transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 3. Main Split View: Map Viewport (Left) + Intelligence Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] relative">
        {/* Map Viewport Area */}
        <div
          ref={mapContainerRef}
          className="lg:col-span-8 relative min-h-[460px] sm:min-h-[560px] lg:min-h-[640px] bg-[#070b16] overflow-hidden flex items-center justify-center select-none"
        >
          {/* Subtle Retro Grid Lines */}
          <div className="absolute inset-0 retro-grid opacity-25 pointer-events-none" />

          {/* Animated Circular Radar Sweep Scanner */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 z-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="w-[140%] h-[140%] rounded-full pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(0, 229, 255, 0.32) 0deg, transparent 50deg, transparent 360deg)',
              }}
            />
          </div>

          {/* Radar HUD Overlay Elements */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 border border-gta-teal/40 backdrop-blur-sm text-[10px] font-heading tracking-widest text-gta-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-gta-teal animate-ping" />
              <span>LEONIDA RECON SATELLITE ACTIVE</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-gray-400">
              SECTOR: {activeBlip ? `${activeBlip.district.toUpperCase()} · ${activeBlip.county.toUpperCase()}` : 'LEONIDA'}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-gray-300">
              GPS: {activeBlip ? activeBlip.coords : '25.7617° N, 80.1918° W'}
            </div>
          </div>

          {/* Waypoint distance banner if waypoint active */}
          {waypoint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gta-pink/20 border border-gta-pink text-white backdrop-blur-md shadow-[0_0_20px_rgba(255,46,136,0.35)]"
            >
              <Navigation size={14} className="text-gta-pink animate-pulse" />
              <div className="text-[11px] font-heading tracking-wider">
                <span className="text-gta-pink font-bold">ROUTE ACTIVE:</span> {waypoint.name}
                <span className="text-gray-300 ml-2 font-mono text-[10px]">
                  ({calculateDistance(waypoint).miles} mi · ~{calculateDistance(waypoint).etaMins}m ETA)
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearWaypoint}
                className="ml-2 text-gray-400 hover:text-white"
                title="Cancel Waypoint"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          {/* Zoomable Canvas Containing the Exact Leonida Map */}
          <div
            className="relative w-full h-full max-w-[560px] max-h-[720px] aspect-[473/648] transition-transform duration-300 origin-center flex items-center justify-center p-4"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* The Authentic Leonida Map Shape & Geography */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-cyan-500/30">
              {/* Satellite Recon Mode: High-Res Real Map Image */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  mapMode === 'satellite' ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <Image
                  src="/images/gta6-leonida-map.jpg"
                  alt="Official GTA 6 Leonida Island Map"
                  fill
                  priority
                  className="object-contain object-center contrast-[1.08] brightness-[0.98]"
                />
              </div>

              {/* Vector Radar Mode: High-Tech Tactical SVG Vector Layer */}
              <svg
                className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
                  mapMode === 'vector' ? 'opacity-100' : 'opacity-40'
                }`}
                viewBox="0 0 473 648"
              >
                <defs>
                  <filter id="vector-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Ocean bathymetric ring contours */}
                <ellipse cx="236" cy="324" rx="220" ry="300" fill="none" stroke="#00E5FF" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.25" />
                <ellipse cx="236" cy="324" rx="180" ry="240" fill="none" stroke="#00E5FF" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.2" />

                {/* Lake Leonida vector outline */}
                <ellipse cx="320" cy="180" rx="38" ry="32" fill="#070e24" stroke="#00E5FF" strokeWidth="1.5" opacity="0.75" />

                {/* County Division Vectors */}
                {/* Lummox County North */}
                <path d="M 170 80 Q 236 60 330 85" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                {/* Leonard County East */}
                <path d="M 280 140 Q 380 200 370 290" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                {/* Vice Dale / Vice City Metro */}
                <path d="M 330 330 Q 420 380 380 500" fill="none" stroke="#FF2E88" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.7" />
                {/* Mariana County Southwest */}
                <path d="M 140 370 Q 220 440 230 520" fill="none" stroke="#FF8A3D" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                {/* Gator Keys Bridge Highway Vector */}
                <path d="M 320 530 Q 260 590 120 600" fill="none" stroke="#00E5FF" strokeWidth="1.8" strokeDasharray="2 3" opacity="0.8" filter="url(#vector-glow)" />

                {/* Waypoint Route Line from Player to Waypoint */}
                {waypoint && (
                  <line
                    x1={`${(playerPos.x * 473) / 100}`}
                    y1={`${(playerPos.y * 648) / 100}`}
                    x2={`${(waypoint.x * 473) / 100}`}
                    y2={`${(waypoint.y * 648) / 100}`}
                    stroke="#FF2E88"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    filter="url(#vector-glow)"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Dynamic Player Position Marker (Lucia & Jason) */}
              <div
                style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-gta-teal/30 border border-gta-teal animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-gta-teal border-2 border-white flex items-center justify-center shadow-[0_0_15px_#00E5FF]">
                    <Navigation size={10} className="text-black fill-black" style={{ transform: 'rotate(-35deg)' }} />
                  </div>
                  <span className="absolute -bottom-4 bg-black/90 px-1.5 py-0.2 rounded border border-gta-teal/60 text-[8px] font-heading text-gta-teal font-bold whitespace-nowrap">
                    YOU (LUCIA &amp; JASON)
                  </span>
                </div>
              </div>

              {/* Waypoint Visual Beacon if set */}
              {waypoint && (
                <div
                  style={{ left: `${waypoint.x}%`, top: `${waypoint.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-gta-pink/40 border border-gta-pink animate-ping absolute" />
                    <div className="w-6 h-6 rounded-full bg-gta-pink border-2 border-white flex items-center justify-center shadow-[0_0_20px_#FF2E88]">
                      <Crosshair size={12} className="text-white animate-spin" />
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Blips accurately positioned on Leonida */}
              {filteredBlips.map((blip) => {
                const isSelected = activeBlip?.id === blip.id
                const isWaypoint = waypoint?.id === blip.id
                const Icon = blip.icon

                return (
                  <motion.button
                    key={blip.id}
                    type="button"
                    onClick={() => handleSelectBlip(blip)}
                    onDoubleClick={() => handleSetWaypoint(blip)}
                    whileHover={{ scale: 1.35 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full cursor-pointer transition-all shadow-xl group ${
                      isSelected
                        ? 'bg-gta-pink text-white ring-4 ring-gta-pink/60 shadow-[0_0_20px_#FF2E88] scale-125 z-30'
                        : isWaypoint
                        ? 'bg-gta-pink text-white ring-4 ring-white shadow-[0_0_15px_#FF2E88]'
                        : 'bg-black/90 text-white border border-white/60 hover:bg-gta-teal hover:text-black hover:border-gta-teal'
                    }`}
                    title={`${blip.name} (${blip.county}) - Click to inspect, double-click for waypoint`}
                  >
                    <Icon size={13} style={{ color: isSelected ? '#ffffff' : blip.color }} />

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                      <div className="px-2.5 py-1 rounded bg-black/95 border border-gta-teal/60 text-[10px] font-heading tracking-wider whitespace-nowrap text-white shadow-xl">
                        {blip.name}
                        <span className="block text-[8px] text-gta-teal font-mono">
                          {blip.county} · Double-click to route
                        </span>
                      </div>
                      <div className="w-1.5 h-1.5 bg-black rotate-45 border-r border-b border-gta-teal/60 -mt-1" />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Intelligence Dossier Side Panel (Right) */}
        <div className="lg:col-span-4 bg-black/95 border-t lg:border-t-0 lg:border-l border-gta-border/80 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
          {activeBlip ? (
            <div className="space-y-4">
              {/* Sector Header */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-heading tracking-widest px-2.5 py-0.5 rounded bg-gta-teal/10 border border-gta-teal/40 text-gta-teal uppercase font-bold">
                    {activeBlip.county}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {activeBlip.coords}
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white tracking-wide leading-tight">
                  {activeBlip.name}
                </h3>
                <span className="text-xs text-gta-pink font-heading tracking-wider uppercase block mt-0.5">
                  {activeBlip.district}
                </span>
              </div>

              {/* Threat Level */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Radio size={13} className="text-yellow-400 animate-pulse" />
                  THREAT STATUS:
                </span>
                <span className="font-bold text-gta-pink">{activeBlip.threat}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 font-body leading-relaxed bg-[#0b0e1b] p-3 rounded-xl border border-white/5">
                {activeBlip.desc}
              </p>

              {/* Intel Specs */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex justify-between">
                  <span className="text-gray-500">PRIMARY LOOT:</span>
                  <span className="text-yellow-300 text-right truncate max-w-[190px]">{activeBlip.loot}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex justify-between">
                  <span className="text-gray-500">VCPD PATROL:</span>
                  <span className="text-blue-400 text-right truncate max-w-[190px]">{activeBlip.cops}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex justify-between">
                  <span className="text-gray-500">DISTANCE FROM PLAYER:</span>
                  <span className="text-gta-teal font-bold">
                    {calculateDistance(activeBlip).miles} mi (~{calculateDistance(activeBlip).etaMins}m ETA)
                  </span>
                </div>
              </div>

              {/* Waypoint Actions */}
              <div className="pt-2 flex flex-col gap-2">
                {waypoint?.id === activeBlip.id ? (
                  <button
                    type="button"
                    onClick={handleClearWaypoint}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600/20 border border-red-500 hover:bg-red-600 text-white text-xs font-heading tracking-wider uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    <X size={14} />
                    CANCEL GPS ROUTE
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetWaypoint(activeBlip)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gta-pink hover:bg-gta-pink-hover text-white text-xs font-heading tracking-wider uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,136,0.4)]"
                  >
                    <Navigation size={14} />
                    LOCK GPS WAYPOINT ({calculateDistance(activeBlip).miles} MI)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
              <Crosshair size={32} className="text-gta-teal/40 mb-3 animate-spin" />
              <span className="font-heading text-sm text-gray-400 tracking-wider">
                SELECT A RECON BLIP ON LEONIDA
              </span>
              <p className="text-xs text-gray-600 mt-1 max-w-[200px]">
                Click any marker on the map to access police intel, bank vaults, and GPS routing.
              </p>
            </div>
          )}

          {/* Bottom Counties Quick-Reference */}
          <div className="pt-4 mt-4 border-t border-gta-border/60">
            <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block mb-2">
              7 LEONIDA COUNTIES:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {LEONIDA_COUNTIES_INFO.map((c) => (
                <span
                  key={c.name}
                  className={`text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 border ${c.color}`}
                >
                  {c.tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Status Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-black/95 border-t border-gta-border/60 text-[10px] font-mono text-gray-400">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-white border border-gray-700">CLICK</kbd> RECON PIN</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-white border border-gray-700">2x CLICK</kbd> SET WAYPOINT</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-white border border-gray-700">ZOOM</kbd> +/- BUTTONS</span>
        </div>
        <div className="text-gta-teal tracking-widest font-heading hidden sm:block">
          STATE OF LEONIDA · CARTOGRAPHY DEPT © 2026
        </div>
      </div>
    </div>
  )
}
