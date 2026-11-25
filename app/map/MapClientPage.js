'use client'
import { useState } from 'react'
import { Navigation, ShieldCheck, MapPin, Compass, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import LeonidaTacticalMap from '@/components/map/LeonidaTacticalMap'

const leonidaCountiesData = [
  {
    name: 'VICE DALE COUNTY (VICE CITY)',
    region: 'Southeast Coastline',
    category: 'Urban Metropolis & Neon Beach',
    threatLevel: 'High Security (3-Star VCPD)',
    desc: 'The beating heart of Leonida. Pastel art-deco hotels along Ocean Drive, towering corporate skyscrapers in Downtown, high-end exotics on Starfish Island, and the sprawling dual runways of Vice City International Airport.',
    stats: {
      vehicles: 'Grotti Cheetah Classic, Pegassi Torero, Buffalo EVX',
      cops: 'VCPD Central HQ SWAT & Beach Cruisers',
      loot: 'First National Bank Vault ($50M+)',
    },
    color: 'border-gta-pink/60 text-gta-pink bg-gta-pink/10 shadow-[0_0_20px_rgba(255,46,136,0.2)]',
    coords: '25.7617° N, 80.1918° W',
    landmarks: ['Ocean Drive Strip', 'VCPD Central HQ', 'Vice City International Airport', 'The Malibu Club', 'Starfish Island'],
  },
  {
    name: 'MARIANA COUNTY (PORT GELLHORN)',
    region: 'Southwest Basin',
    category: 'Deepwater Shipping & Freight',
    threatLevel: 'Extreme (4-Star Cartel)',
    desc: 'Rusting gantry cranes, container cargo ships, chemical refineries, and industrial freight yards. Controlled by maritime smuggling cartels with underground chop shops and high-stakes illegal drag strips.',
    stats: {
      vehicles: 'Gauntlet Hellfire, Heavy Semi-Trucks, Muscle Cars',
      cops: 'Low VCPD Patrol Response',
      loot: 'Smuggler Container Crates & Contraband',
    },
    color: 'border-gta-orange/60 text-gta-orange bg-gta-orange/10 shadow-[0_0_20px_rgba(255,138,61,0.2)]',
    coords: '25.7120° N, 80.2540° W',
    landmarks: ['Port Gellhorn Harbor', 'Underground Chop Shop', 'Mariana Speedway', 'Bay Refinery'],
  },
  {
    name: 'GATOR KEYS (SOUTHERN ARCHIPELAGO)',
    region: 'Southern Islands Chain',
    category: 'Coral Atolls & Overseas Bridges',
    threatLevel: 'Military Zone (5-Star Key Zancudo)',
    desc: 'A sun-drenched archipelago of tropical keys connected by the monumental Seven-Mile Overseas Highway bridge. Features offshore speedboat channels, secluded safehouses, and the fortified Key Zancudo Naval Air Station.',
    stats: {
      vehicles: 'P-996 Lazer Fighter Jets, Torpedo Powerboats, Sovereign Bikes',
      cops: 'Military SAM Batteries & State Patrol',
      loot: 'Military Flight Technology & Marine Cargo',
    },
    color: 'border-cyan-400/60 text-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    coords: '24.5551° N, 81.7800° W',
    landmarks: ['Seven-Mile Overseas Bridge', 'Key Zancudo Naval Air Station', 'Sugarloaf Safehouse', 'Key Marathon'],
  },
  {
    name: 'LEONIDA WETLANDS (THE GRASSRIVERS)',
    region: 'Central Everglades',
    category: 'Swamplands & Sawgrass Bayous',
    threatLevel: 'Hostile Wilderness (Alligators)',
    desc: 'Vast, treacherous swamplands stretching between Vice City and Port Gellhorn. Infested with predatory alligators, illicit moonshine distilleries, clandestine smuggler dirt airstrips, and fan-powered airboats skimming across sawgrass.',
    stats: {
      vehicles: 'High-Velocity Airboats, Dodo Seaplanes, Off-Road Trucks',
      cops: 'Zero Law Patrol Coverage',
      loot: 'Unmarked Airdropped Drug Crates',
    },
    color: 'border-green-400/60 text-green-400 bg-green-400/10 shadow-[0_0_20px_rgba(74,222,128,0.2)]',
    coords: '25.6420° N, 80.5210° W',
    landmarks: ['Grassrivers Smuggler Airfield', 'Caiman Creek Airboats', 'Alligator Bayous', 'Sawgrass Stilt Cabins'],
  },
  {
    name: 'LEONARD COUNTY (LAKE LEONIDA)',
    region: 'Northeast Heartland',
    category: 'Freshwater Basin & Agro-Industrial',
    threatLevel: 'Moderate (2-Star)',
    desc: 'Centered around the massive Lake Leonida freshwater inland sea. Surrounded by the Ambrosia agricultural sugar refineries, freight train depots, lakeside marinas, and sprawling citrus orchards.',
    stats: {
      vehicles: 'Freight Semi-Rigs, Quad Bikes, Speedboats',
      cops: 'Highway State Troopers',
      loot: 'Agri-Corridor Payroll & Chemical Shipments',
    },
    color: 'border-blue-400/60 text-blue-400 bg-blue-400/10 shadow-[0_0_20px_rgba(96,165,250,0.2)]',
    coords: '26.1420° N, 80.3840° W',
    landmarks: ['Lake Leonida Inland Sea', 'Ambrosia Agri-Corridor', 'Freight Rail Terminal', 'Sugar Silos'],
  },
  {
    name: 'LUMMOX COUNTY (NORTHERN MOUNTAINS)',
    region: 'Northern Highlands',
    category: 'Alpine Peaks & Military Bunkers',
    threatLevel: 'Extreme (5-Star Black-Ops)',
    desc: 'The rugged northern border of Leonida. Deep mountain ravines, pine wilderness, the Mount Kalaga Hydroelectric Dam, and encrypted file telemetry pointing to massive subterranean test tracks and radar jamming stations.',
    stats: {
      vehicles: 'Tactical Off-Road 4x4s, Helicopters, Military Prototypes',
      cops: 'Federal Marshals & Armed PMC',
      loot: 'Classified Subterranean Military Tech',
    },
    color: 'border-purple-400/60 text-purple-400 bg-purple-400/10 shadow-[0_0_20px_rgba(192,132,252,0.2)]',
    coords: '26.4150° N, 80.6100° W',
    landmarks: ['Mount Kalaga Dam', 'Underground Bunker Blast Doors', 'Radar Jamming Station', 'North Pass Bridge'],
  },
  {
    name: 'KELLY COUNTY (FARMSTEADS & RED DIRT)',
    region: 'Northwest Plateau',
    category: 'Agricultural Limestone Mines',
    threatLevel: 'Low-Moderate (2-Star)',
    desc: 'Rolling red-dirt countryside, limestone gravel quarries, livestock ranches, and country trailer parks. Prime territory for off-road mud bogging and moonshine bootlegging.',
    stats: {
      vehicles: 'Bravado Bison Pickups, Sanchez Dirt Bikes, Mining Trucks',
      cops: 'Rural County Patrol',
      loot: 'Commercial Mining Explosives Depot',
    },
    color: 'border-yellow-400/60 text-yellow-400 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
    coords: '26.4200° N, 80.8200° W',
    landmarks: ['Kelly County Aggregate Quarry', 'Kelly Dirt Track Speedway', 'Western Ridge Highway'],
  },
]

export default function MapClientPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-teal/40 bg-gta-teal/10 text-gta-teal text-xs font-heading tracking-[0.25em] mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Navigation size={14} className="animate-pulse" />
          STATE OF LEONIDA · SATELLITE RECONNAISSANCE
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="gradient-text">INTERACTIVE MAP</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
          Tactical satellite reconnaissance of Vice City and the surrounding State of Leonida.
          Explore VCPD precincts, safehouses, commercial banks, international airports, and naval airbases across the 7 counties.
        </p>

        {/* Verification & Transparency Notice */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-gta-teal/30 text-xs text-gray-300 flex items-center justify-center gap-2 max-w-2xl mx-auto font-body">
          <ShieldCheck size={16} className="text-gta-teal flex-shrink-0" />
          <span>
            <strong>Official Cartography Status:</strong> The State of Leonida, Vice City, Port Gellhorn, and the Keys are officially confirmed by Rockstar Games. Coordinate telemetry and boundary overlays reflect community mapping project estimates.
          </span>
        </div>
      </header>

      {/* Leonida Tactical Map Core Engine */}
      <section className="mb-14" aria-label="Interactive Tactical GPS Radar">
        <LeonidaTacticalMap />
      </section>

      {/* Leonida Counties Dossier Section */}
      <section className="pt-6 border-t border-gta-border/60" aria-labelledby="counties-dossier-heading">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-heading tracking-[0.25em] text-gta-pink uppercase block mb-2">
            INTELLIGENCE DOSSIER
          </span>
          <h2 id="counties-dossier-heading" className="font-heading text-3xl sm:text-5xl text-white tracking-wide">
            EXPLORE THE 7 <span className="gradient-text">COUNTIES OF LEONIDA</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 font-body">
            From the neon coastal skyscrapers of Vice Dale County to the sawgrass swamplands of the Grassrivers and the Key Zancudo naval station.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leonidaCountiesData.map((county) => (
            <article
              key={county.name}
              className={`card-gta p-6 border ${county.color} transition-all duration-300 flex flex-col justify-between hover:scale-[1.01]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-heading tracking-widest px-2.5 py-0.5 rounded bg-black/60 border border-current font-bold uppercase">
                    {county.region}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gta-teal flex items-center gap-1">
                    <MapPin size={10} /> {county.coords}
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-1 leading-tight">
                  {county.name}
                </h3>
                <span className="text-xs font-heading tracking-wider text-gray-400 uppercase block mb-3">
                  {county.category}
                </span>

                <p className="text-xs text-gray-300 font-body leading-relaxed mb-4">
                  {county.desc}
                </p>

                {/* Key Landmarks */}
                <div className="mb-4">
                  <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block mb-1.5">
                    KEY SECTOR LANDMARKS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {county.landmarks.map((lm) => (
                      <span
                        key={lm}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-gta-border/60 text-gray-300"
                      >
                        • {lm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Box */}
              <div className="p-3 rounded-xl bg-black/75 border border-white/10 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">RIDES:</span>
                  <span className="text-white truncate max-w-[170px] text-right">{county.stats.vehicles}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">COPS:</span>
                  <span className="text-blue-400">{county.stats.cops}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">HEIST:</span>
                  <span className="text-yellow-400">{county.stats.loot}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contextual Hub Footer */}
      <footer className="mt-16 pt-8 border-t border-gta-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-gta-teal" />
          <span>Interactive coordinates and waypoint telemetry mapped for Grand Theft Auto VI.</span>
        </div>
        <div className="flex items-center gap-4 font-heading tracking-wider">
          <Link href="/vehicles" className="hover:text-gta-pink transition-colors">CONFIRMED CARS</Link>
          <Link href="/guides" className="hover:text-gta-orange transition-colors">STRATEGY GUIDES</Link>
          <Link href="/characters" className="hover:text-gta-purple transition-colors">CAST DOSSIERS</Link>
        </div>
      </footer>
    </div>
  )
}
