'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Character3DViewer from './Character3DViewer'
import {
  Shield,
  Check,
  Shirt,
  Glasses,
  Watch,
  Box,
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

// Authentic GTA Wardrobe Sound Effect
function playWardrobeSound(type = 'equip') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    if (type === 'equip') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.14)
    } else if (type === 'select') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)
    }
  } catch (e) {
    // AudioContext blocked
  }
}

export const CHARACTERS_WARDROBE = [
  {
    id: 'lucia',
    name: 'LUCIA',
    role: 'Protagonist / Mastermind',
    tagline: 'FEARLESS, CALCULATING & DEADLY',
    accentColor: '#FF2E88',
    badgeClass: 'bg-gta-pink/20 text-gta-pink border-gta-pink/50',
    safehouseLocation: 'Ocean View Beachfront Penthouse // Suite 304',
    outfits: [
      {
        id: 'lucia-dock-heist',
        name: 'Dockside Heist Rig',
        category: 'Combat Tactical',
        iconType: 'shield',
        desc: 'Tactical ribbed crop tank, frayed denim cutoff shorts, dual hip holster harness, and reinforced combat ankle kicks.',
        stats: { agility: 95, stealth: 70, armor: 60, heatReduction: 40 },
        unlocked: true,
        price: 'DEFAULT SAFEHOUSE GEAR',
        colorways: ['#FF2E88', '#00E5FF', '#111111', '#F59E0B'],
      },
      {
        id: 'lucia-streetwear',
        name: 'Vice Beach Neon Casual',
        category: 'Streetwear & Kicks',
        iconType: 'flame',
        desc: 'Oversized graphic street tee, parachute utility cargo pants, retro colorblock high-top sneakers, and mirrored sunglasses.',
        stats: { agility: 90, stealth: 85, armor: 30, heatReduction: 75 },
        unlocked: true,
        price: '$1,250 (Ponsonbys)',
        colorways: ['#EF4444', '#8B5CF6', '#10B981', '#3B82F6'],
      },
      {
        id: 'lucia-prison',
        name: 'Leonida DOC Inmate Gear',
        category: 'Prison Escape',
        iconType: 'crosshair',
        desc: 'Leonida Department of Corrections high-visibility orange boiler suit, white undershirt, custody tracking ankle band.',
        stats: { agility: 80, stealth: 20, armor: 40, heatReduction: 10 },
        unlocked: true,
        price: 'PROLOGUE SPECIAL',
        colorways: ['#F97316', '#64748B'],
      },
      {
        id: 'lucia-nightclub',
        name: 'Malibu VIP Velvet Dress',
        category: 'High Society',
        iconType: 'sparkles',
        desc: 'Midnight black velvet high-slit cocktail dress, strappy stiletto heels, diamond tennis choker, concealed garter knife.',
        stats: { agility: 65, stealth: 90, armor: 15, heatReduction: 85 },
        unlocked: true,
        price: '$4,800 (Didier Sachs)',
        colorways: ['#111111', '#831843', '#1E3A8A'],
      },
    ],
  },
  {
    id: 'jason',
    name: 'JASON',
    role: 'Protagonist / Tactical Wheelman',
    tagline: 'COOL UNDER FIRE // COMBAT DRIVER',
    accentColor: '#00E5FF',
    badgeClass: 'bg-gta-teal/20 text-gta-teal border-gta-teal/50',
    safehouseLocation: 'Little Haiti Underground Garage & Loft',
    outfits: [
      {
        id: 'jason-dock-smuggler',
        name: 'Vice Coastal Wheelman',
        category: 'Tropical Casual',
        iconType: 'flame',
        desc: 'Unbuttoned ocean blue floral Hawaiian camp shirt, white crew tee, tactical desert cargo trousers, diver chronograph.',
        stats: { agility: 88, stealth: 65, armor: 55, heatReduction: 50 },
        unlocked: true,
        price: 'DEFAULT SAFEHOUSE GEAR',
        colorways: ['#00E5FF', '#EC4899', '#F59E0B', '#3B82F6'],
      },
      {
        id: 'jason-jack-hearts',
        name: 'Jack of Hearts Street King',
        category: 'Streetwear & Kicks',
        iconType: 'shirt',
        desc: 'Oversized crimson drop-shoulder tee, distressed acid-wash denim, retro collector high-top kicks, heavy Cuban link gold chain.',
        stats: { agility: 85, stealth: 75, armor: 45, heatReduction: 70 },
        unlocked: true,
        price: '$2,400 (SubUrban)',
        colorways: ['#DC2626', '#1E293B', '#D97706'],
      },
      {
        id: 'jason-blackout-raid',
        name: 'Night Raid Blackout Rig',
        category: 'Special Ops Tactical',
        iconType: 'shield',
        desc: 'Ballistic Kevlar plate carrier vest, tactical combat trousers, balaclava stealth mask, non-reflective combat jump boots.',
        stats: { agility: 75, stealth: 95, armor: 90, heatReduction: 30 },
        unlocked: true,
        price: '$6,500 (Ammu-Nation Black Ops)',
        colorways: ['#0A0A0A', '#1C1917', '#1E3A8A'],
      },
    ],
  },
  {
    id: 'syndicate-boss',
    name: 'RAUL SANTOS',
    role: 'Port Gellhorn Cartel Boss',
    tagline: 'MIAMI UNDERWORLD KINGPIN',
    accentColor: '#F59E0B',
    badgeClass: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50',
    safehouseLocation: 'Starfish Island Luxury Waterfront Villa',
    outfits: [
      {
        id: 'raul-white-linen',
        name: 'Vice Kingpin White Linen Suit',
        category: 'Luxury Formal',
        iconType: 'sparkles',
        desc: 'Tailored Italian white linen blazer & trousers, deep violet silk unbuttoned shirt, leather driving gloves, aviators, leather duffel.',
        stats: { agility: 60, stealth: 60, armor: 50, heatReduction: 90 },
        unlocked: true,
        price: '$12,000 (Starfish Clothiers)',
        colorways: ['#FFFFFF', '#111827', '#4C1D95'],
      },
      {
        id: 'raul-silk-robe',
        name: 'Starfish Villa Gold Robe',
        category: 'Private Residence',
        iconType: 'flame',
        desc: 'Pure mulberry black and gold embroidered lounging robe, velvet smoking slippers, custom diamond signet pinky ring.',
        stats: { agility: 50, stealth: 40, armor: 20, heatReduction: 95 },
        unlocked: true,
        price: '$8,500 (Private Tailor)',
        colorways: ['#D97706', '#000000'],
      },
    ],
  },
  {
    id: 'vcpd-vance',
    name: 'DETECTIVE VANCE',
    role: 'VCPD Major Crimes Detective',
    tagline: 'UNDERCOVER SPECIAL PURSUIT UNIT',
    accentColor: '#3B82F6',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    safehouseLocation: 'VCPD Downtown Central Precinct // Desk 404',
    outfits: [
      {
        id: 'vance-undercover',
        name: 'Miami Undercover Palms',
        category: 'Law Enforcement',
        iconType: 'shirt',
        desc: 'Pastel palm short-sleeve shirt, concealed leather shoulder holster, beige pleated slacks, mirrored aviators, gold shield badge.',
        stats: { agility: 82, stealth: 80, armor: 65, heatReduction: 60 },
        unlocked: true,
        price: 'VCPD ISSUE // STING OPERATION',
        colorways: ['#38BDF8', '#F472B6', '#FBBF24'],
      },
      {
        id: 'vance-swat',
        name: 'VCPD Tactical SWAT Breacher',
        category: 'SWAT Enforcer',
        iconType: 'shield',
        desc: 'Level IV ceramic chest rig, POLICE high-visibility shoulder patches, ballistic helmet with drop-down anti-flash visor.',
        stats: { agility: 60, stealth: 20, armor: 98, heatReduction: 15 },
        unlocked: true,
        price: 'VCPD TACTICAL ARMORY',
        colorways: ['#1E3A8A', '#0F172A'],
      },
    ],
  },
]

export default function CharacterDressingRoom() {
  const [selectedCharId, setSelectedCharId] = useState('lucia')
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('#FF2E88')
  const [equippedOutfits, setEquippedOutfits] = useState({
    lucia: 'lucia-dock-heist',
    jason: 'jason-dock-smuggler',
    'syndicate-boss': 'raul-white-linen',
    'vcpd-vance': 'vance-undercover',
  })
  const [accessories, setAccessories] = useState({
    glasses: true,
    holster: true,
    watch: true,
  })
  const { addToast } = useToast()

  const currentChar = CHARACTERS_WARDROBE.find((c) => c.id === selectedCharId)
  const currentOutfit = currentChar.outfits[selectedOutfitIndex] || currentChar.outfits[0]
  const isEquipped = equippedOutfits[currentChar.id] === currentOutfit.id

  const handleCharSelect = (charId) => {
    setSelectedCharId(charId)
    setSelectedOutfitIndex(0)
    const newChar = CHARACTERS_WARDROBE.find((c) => c.id === charId)
    if (newChar && newChar.outfits[0]) {
      setSelectedColor(newChar.outfits[0].colorways[0])
    }
    playWardrobeSound('select')
  }

  const handleOutfitSelect = (index) => {
    setSelectedOutfitIndex(index)
    setSelectedColor(currentChar.outfits[index].colorways[0])
    playWardrobeSound('select')
  }

  const handleEquip = () => {
    setEquippedOutfits((prev) => ({
      ...prev,
      [currentChar.id]: currentOutfit.id,
    }))
    playWardrobeSound('equip')
    addToast(
      `👔 WARDROBE UPDATED: ${currentChar.name} equipped "${currentOutfit.name}"!`,
      'mission',
      4500
    )
  }

  const toggleAccessory = (acc) => {
    setAccessories((prev) => ({ ...prev, [acc]: !prev[acc] }))
    playWardrobeSound('select')
  }

  return (
    <section id="wardrobe" className="py-12 sm:py-16">
      {/* Wardrobe Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-pink/40 bg-gta-pink/10 text-gta-pink text-xs font-heading tracking-[0.25em] mb-4">
          <Shirt size={14} />
          AUTHENTIC 3D SAFEHOUSE WARDROBE
        </div>
        <h2 className="font-heading text-4xl sm:text-6xl text-white tracking-wide mb-3">
          REALISTIC 3D <span className="gradient-text">CHARACTER DRESSING ROOM</span>
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-body">
          Explore realistic 3D models of Lucia, Jason, and Vice City figures. Click any outfit to instantly fit it
          onto the 3D model with custom PBR fabric textures, colorways, and interactive 360° controls.
        </p>
      </div>

      {/* Main Wardrobe Stage Window */}
      <div className="rounded-2xl border-2 border-gta-pink/60 bg-gradient-to-b from-[#090b16] via-[#120a22] to-[#070914] shadow-[0_0_50px_rgba(255,46,136,0.25)] overflow-hidden">
        {/* Top Character Selector Strip */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 bg-black/85 border-b border-gta-border/60 overflow-x-auto gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {CHARACTERS_WARDROBE.map((char) => {
              const active = selectedCharId === char.id
              return (
                <button
                  key={char.id}
                  onClick={() => handleCharSelect(char.id)}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl font-heading text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-gta-pink text-white shadow-[0_0_15px_rgba(255,46,136,0.5)] font-bold ring-2 ring-white/20'
                      : 'bg-gta-card border border-gta-border text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: char.accentColor }} />
                  {char.name}
                </button>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="text-gta-teal font-heading tracking-wider">SAFEHOUSE LOCATION:</span>
            <span>{currentChar.safehouseLocation}</span>
          </div>
        </div>

        {/* 2-Column Fitting Mirror & Outfits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Pure 3D Interactive Fitting Showcase Stage (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[480px] sm:min-h-[560px] lg:min-h-full p-4 sm:p-6 flex flex-col justify-between overflow-hidden bg-black/60">
            {/* Top HUD Badges */}
            <div className="relative z-20 flex items-center justify-between gap-2 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-heading tracking-widest uppercase border ${currentChar.badgeClass}`}>
                  {currentChar.role}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/80 border border-white/20 text-white font-mono text-[10px]">
                  {currentOutfit.price}
                </span>
              </div>

              {/* Pure 3D Simulation Status Badge (Replaces 2D switcher) */}
              <div className="flex items-center gap-2 bg-black/90 px-3 py-1.5 rounded-xl border border-gta-teal/40 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-gta-teal animate-pulse" />
                <span className="text-[10px] font-heading tracking-widest text-gta-teal uppercase">
                  100% REALISTIC 3D MODEL
                </span>
              </div>

              {isEquipped && (
                <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/60 text-green-300 font-heading text-xs tracking-widest flex items-center gap-1.5 shadow-lg">
                  <Check size={14} />
                  <span>EQUIPPED IN SAFEHOUSE</span>
                </div>
              )}
            </div>

            {/* Central Stage: 100% Pure Interactive 3D Model View */}
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] rounded-2xl overflow-hidden mb-4">
              <Character3DViewer
                characterId={currentChar.id}
                outfitId={currentOutfit.id}
                colorway={selectedColor}
                accessories={accessories}
              />
            </div>

            {/* Bottom HUD: Active Outfit Name & Stat Bars */}
            <div className="relative z-10 pt-2">
              <div className="max-w-xl">
                <span className="text-[10px] font-heading tracking-[0.25em] text-gta-teal uppercase block mb-1 drop-shadow">
                  {currentChar.name} {'//'} {currentOutfit.category}
                </span>
                <h3 className="font-heading text-3xl sm:text-5xl text-white tracking-wide mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {currentOutfit.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 font-body leading-relaxed mb-5 drop-shadow">
                  {currentOutfit.desc}
                </p>

                {/* Stat Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 bg-black/80 p-3.5 rounded-xl border border-white/15 backdrop-blur-md">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                      <span>AGILITY</span>
                      <span className="text-white font-bold">{currentOutfit.stats.agility}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gta-teal"
                        style={{ width: `${currentOutfit.stats.agility}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                      <span>STEALTH</span>
                      <span className="text-white font-bold">{currentOutfit.stats.stealth}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gta-pink"
                        style={{ width: `${currentOutfit.stats.stealth}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                      <span>ARMOR</span>
                      <span className="text-white font-bold">{currentOutfit.stats.armor}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${currentOutfit.stats.armor}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                      <span>HEAT COOL</span>
                      <span className="text-white font-bold">-{currentOutfit.stats.heatReduction}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400"
                        style={{ width: `${currentOutfit.stats.heatReduction}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Equip CTA */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEquip}
                    disabled={isEquipped}
                    className={`gta-btn text-sm py-3 px-6 uppercase tracking-wider font-bold flex items-center gap-2 transition-all shadow-xl ${
                      isEquipped
                        ? 'bg-green-700/80 text-white cursor-default border-green-500'
                        : 'bg-gta-pink hover:bg-pink-600 text-white border-gta-pink shadow-[0_0_20px_rgba(255,46,136,0.5)]'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check size={16} />
                        <span>CURRENTLY EQUIPPED IN SAFEHOUSE</span>
                      </>
                    ) : (
                      <>
                        <Shirt size={16} />
                        <span>EQUIP OUTFIT TO 3D SAFEHOUSE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Wardrobe Rack / Outfits List (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-black/90 border-t lg:border-t-0 lg:border-l border-gta-border/60 flex flex-col justify-between">
            <div>
              {/* Category Subhead */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gta-border/60">
                <span className="text-xs font-heading tracking-widest text-gta-teal uppercase flex items-center gap-1.5">
                  <Box size={14} />
                  3D WARDROBE RACK ({currentChar.outfits.length} OUTFITS)
                </span>
                <span className="text-[10px] text-gray-500 font-mono">CLICK TO FIT 3D MODEL</span>
              </div>

              {/* Outfit Choice Cards - Clean 3D Gear Swatches with NO 2D Photo Gallery */}
              <div className="space-y-3 mb-6">
                {currentChar.outfits.map((outfit, idx) => {
                  const isSelected = selectedOutfitIndex === idx
                  const isEquippedThis = equippedOutfits[currentChar.id] === outfit.id

                  return (
                    <button
                      key={outfit.id}
                      onClick={() => handleOutfitSelect(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-gta-card border-gta-pink shadow-[0_0_20px_rgba(255,46,136,0.3)] ring-1 ring-gta-pink'
                          : 'bg-gta-dark/70 border-gta-border hover:border-gray-500 hover:bg-gta-card/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* 3D Gear Badge Swatch (Clean 3D design, no 2D stock photos) */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center relative border border-white/20 flex-shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${outfit.colorways[0]}33, #0a0c16)`,
                            borderColor: isSelected ? outfit.colorways[0] : 'rgba(255,255,255,0.2)',
                          }}
                        >
                          <Shirt size={20} style={{ color: outfit.colorways[0] }} />
                          <span className="absolute bottom-1 right-1 text-[8px] font-mono px-1 py-0.2 rounded bg-black/80 text-white font-bold">
                            3D
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-base text-white group-hover:text-gta-pink transition-colors">
                              {outfit.name}
                            </span>
                            {isEquippedThis && (
                              <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/40 uppercase">
                                EQUIPPED
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 font-body block">
                            {outfit.category} • {outfit.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: outfit.colorways[0] }}
                          title="Primary colorway"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Colorways Palette Selector */}
              <div className="mb-6 p-4 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block mb-2.5">
                  3D COLORWAY &amp; FABRIC SWATCH:
                </span>
                <div className="flex items-center gap-3">
                  {currentOutfit.colorways.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => {
                        setSelectedColor(hex)
                        playWardrobeSound('select')
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform relative ${
                        selectedColor === hex
                          ? 'scale-125 border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                          : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={`Switch to ${hex}`}
                    >
                      {selectedColor === hex && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories Customizer Toggles */}
              <div>
                <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block mb-2.5">
                  REAL-TIME 3D ACCESSORIES:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => toggleAccessory('glasses')}
                    className={`p-2.5 rounded-xl border text-xs font-heading tracking-wider uppercase transition-all flex flex-col items-center gap-1.5 ${
                      accessories.glasses
                        ? 'bg-gta-teal/20 border-gta-teal text-gta-teal shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                        : 'bg-gta-card border-gta-border text-gray-500'
                    }`}
                  >
                    <Glasses size={16} />
                    <span className="text-[9px]">AVIATOR GLASSES</span>
                  </button>

                  <button
                    onClick={() => toggleAccessory('holster')}
                    className={`p-2.5 rounded-xl border text-xs font-heading tracking-wider uppercase transition-all flex flex-col items-center gap-1.5 ${
                      accessories.holster
                        ? 'bg-gta-pink/20 border-gta-pink text-gta-pink shadow-[0_0_12px_rgba(255,46,136,0.25)]'
                        : 'bg-gta-card border-gta-border text-gray-500'
                    }`}
                  >
                    <Shield size={16} />
                    <span className="text-[9px]">WEAPON HOLSTER</span>
                  </button>

                  <button
                    onClick={() => toggleAccessory('watch')}
                    className={`p-2.5 rounded-xl border text-xs font-heading tracking-wider uppercase transition-all flex flex-col items-center gap-1.5 ${
                      accessories.watch
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                        : 'bg-gta-card border-gta-border text-gray-500'
                    }`}
                  >
                    <Watch size={16} />
                    <span className="text-[9px]">CHRONO WATCH</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dressing Room Footer Note */}
            <div className="pt-6 mt-6 border-t border-gta-border/60 text-[11px] font-mono text-gray-500 flex items-center justify-between">
              <span>3D WARDROBE ENGINE READY</span>
              <span className="text-gta-pink font-heading tracking-wider">VICE CITY CUSTOMS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
