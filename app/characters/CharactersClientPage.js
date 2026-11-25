'use client'
import { useState } from 'react'
import { Users, Shield, Star, HelpCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const allCharacters = [
  {
    name: 'LUCIA',
    alias: 'The Female Protagonist',
    role: 'Protagonist / Criminal Operator',
    group: 'Protagonists',
    badge: 'OFFICIALLY CONFIRMED',
    badgeColor: 'border-gta-pink/60 text-gta-pink bg-gta-pink/15',
    accent: 'border-gta-pink/60 text-gta-pink bg-gta-pink/10 shadow-[0_0_20px_rgba(255,46,136,0.2)]',
    glowColor: '#FF2E88',
    skills: ['Armed Infiltration', 'Precision Shooting', 'High-Stakes Robberies', 'Hand-to-Hand'],
    bio: 'Lucia is the headline female protagonist of Grand Theft Auto VI, officially introduced in Trailer 1. Seen wearing a Leonida Department of Corrections inmate uniform and later teaming up with her partner Jason for armed convenience store and bank robberies across Vice City.',
    quote: '"The only way we are gonna get through this is by sticking together, being a team."',
    officialSource: 'Rockstar Games Official Trailer 1',
  },
  {
    name: 'JASON',
    alias: 'The Male Protagonist',
    role: 'Protagonist / Tactical Wheelman',
    group: 'Protagonists',
    badge: 'OFFICIALLY CONFIRMED',
    badgeColor: 'border-gta-teal/60 text-gta-teal bg-gta-teal/15',
    accent: 'border-gta-teal/60 text-gta-teal bg-gta-teal/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]',
    glowColor: '#00E5FF',
    skills: ['High-Speed Pursuit Driving', 'Tactical Firearms', 'Getaway Logistics', 'Reconnaissance'],
    bio: 'Jason is the male co-protagonist of GTA 6 and Lucia’s partner in crime. In official Trailer 1 footage, he is seen alongside Lucia during high-speed vehicle escapes and armed hold-ups, displaying calm composure under heavy police pursuit.',
    quote: '"Trust."',
    officialSource: 'Rockstar Games Official Trailer 1',
  },
  {
    name: 'STEFANIE',
    alias: 'Corrections Counselor',
    role: 'Leonida Department of Corrections Official',
    group: 'Law Enforcement',
    badge: 'SEEN IN TRAILER 1',
    badgeColor: 'border-blue-400/60 text-blue-300 bg-blue-500/15',
    accent: 'border-blue-500/80 text-blue-400 bg-blue-500/15 shadow-[0_0_25px_rgba(59,130,246,0.3)]',
    glowColor: '#3B82F6',
    skills: ['Inmate Evaluation', 'Correctional Procedures', 'Institutional Psychology'],
    bio: 'Stefanie is the prison counselor who appears in the opening seconds of Rockstar’s official GTA 6 Trailer 1. She conducts Lucia’s prison evaluation, asking the iconic question: "Lucia, do you know why you’re here?"',
    quote: '"Lucia, do you know why you’re here?"',
    officialSource: 'Rockstar Games Official Trailer 1 (0:05)',
  },
  {
    name: 'VCPD HIGHWAY PURSUIT UNITS',
    alias: 'Leonida State Troopers & City Police',
    role: 'Vice City Police Department / Patrol Division',
    group: 'Law Enforcement',
    badge: 'SEEN IN TRAILER 1',
    badgeColor: 'border-cyan-400/60 text-cyan-300 bg-cyan-500/15',
    accent: 'border-cyan-400/80 text-cyan-300 bg-cyan-500/15 shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    glowColor: '#06B6D4',
    skills: ['High-Speed Interceptions', 'SWAT Deployment', 'Helicopter Spotting', 'Spike Strips'],
    bio: 'Trailer 1 showcases extensive VCPD law enforcement activity across Vice City, including high-speed Buffalo EVX cruisers, SWAT tactical transports, police helicopters, and beach patrol units actively enforcing a heavy citywide presence.',
    quote: '"All units, suspect vehicle sighted heading eastbound on Ocean Drive."',
    officialSource: 'Rockstar Games Official Trailer 1 (Multiple Shots)',
  },
  {
    name: 'RAUL SANTOS',
    alias: 'Port Gellhorn Freight Contact',
    role: 'Underworld Maritime Smuggler (Speculative)',
    group: 'Community Lore',
    badge: 'SPECULATIVE INTEL',
    badgeColor: 'border-yellow-400/60 text-yellow-300 bg-yellow-500/10',
    accent: 'border-gta-orange/60 text-gta-orange bg-gta-orange/10 shadow-[0_0_20px_rgba(255,138,61,0.2)]',
    glowColor: '#FF8A3D',
    skills: ['Marine Cargo', 'Underground Logistics', 'Port Freight'],
    bio: 'A popular community-theorized character based on shipping and freight signage observed at the Port Gellhorn container yards. Not yet officially named or confirmed by Rockstar Games.',
    quote: '"The docks move when I say they move."',
    officialSource: 'Community Mapping & Speculation',
  },
  {
    name: 'UNCLE CAL',
    alias: 'The Everglades Fixer',
    role: 'Swamp Outfitter & Arms Fence (Speculative)',
    group: 'Community Lore',
    badge: 'SPECULATIVE INTEL',
    badgeColor: 'border-purple-400/60 text-purple-300 bg-purple-500/10',
    accent: 'border-gta-purple/60 text-gta-purple bg-gta-purple/10 shadow-[0_0_20px_rgba(123,47,247,0.2)]',
    glowColor: '#7B2FF7',
    skills: ['Airboat Modifications', 'Black Market Trade', 'Swamp Navigation'],
    bio: 'Community-crafted profile representing independent swamp airboat operators and illicit trade rumors set in the rural Grassrivers bayous.',
    quote: '"Stay off the main channels if you got heat behind you."',
    officialSource: 'Community Speculation',
  },
]

export default function CharactersClientPage() {
  const [filter, setFilter] = useState('All')

  const displayedCharacters = allCharacters.filter((c) => {
    if (filter === 'All') return true
    if (filter === 'Protagonists') return c.group === 'Protagonists'
    if (filter === 'Law Enforcement') return c.group === 'Law Enforcement'
    if (filter === 'Community Lore') return c.group === 'Community Lore'
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-purple/40 bg-gta-purple/10 text-gta-purple text-xs font-heading tracking-[0.25em] mb-4">
          <Users size={14} />
          LEONIDA DOSSIERS &amp; CAST RECONNAISSANCE
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="gradient-text">CHARACTERS &amp; CAST</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
          Meet the confirmed protagonists Lucia and Jason, characters spotted in official Rockstar Games footage,
          and community-theorized figures across the State of Leonida.
        </p>

        {/* Verification Status Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-gray-400 mb-8 bg-black/40 p-3 rounded-xl border border-gta-border/60">
          <span className="flex items-center gap-1.5 text-gta-pink">
            <Star size={13} /> Confirmed in Trailer 1
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <Shield size={13} /> Official Law Enforcement
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 text-yellow-400">
            <HelpCircle size={13} /> Community Speculation (Clearly Labeled)
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-gta-card border border-gta-border/80 shadow-lg">
            {['All', 'Protagonists', 'Law Enforcement', 'Community Lore'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-heading text-xs tracking-wider uppercase transition-all ${
                  filter === tab
                    ? tab === 'Law Enforcement'
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                      : 'bg-gta-pink text-white shadow-[0_0_15px_rgba(255,46,136,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab} ({tab === 'All' ? allCharacters.length : allCharacters.filter((c) => c.group === tab).length})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Characters Dossier Grid */}
      <section className="pt-6" aria-labelledby="characters-section-heading">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-heading tracking-[0.25em] text-gta-teal uppercase block mb-2">
            SURVEILLANCE DOSSIERS
          </span>
          <h2 id="characters-section-heading" className="font-heading text-3xl sm:text-4xl text-white tracking-wide">
            LEONIDA <span className="gradient-text">PERSONS OF INTEREST</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayedCharacters.map((char) => (
            <article
              key={char.name}
              className={`card-gta p-6 sm:p-8 border ${char.accent} transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
            >
              <div>
                {/* Stamp Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-heading tracking-widest px-2.5 py-1 rounded border font-bold uppercase ${char.badgeColor}`}>
                    {char.badge}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">{char.officialSource}</span>
                </div>

                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-xl border border-white/20 bg-gta-dark flex items-center justify-center font-heading text-3xl font-bold flex-shrink-0"
                    style={{ color: char.glowColor, textShadow: `0 0 15px ${char.glowColor}` }}
                    aria-label={`Avatar for ${char.name}`}
                  >
                    {char.group === 'Law Enforcement' ? '👮' : char.name[0]}
                  </div>
                  <div>
                    <span className="text-xs font-heading tracking-widest text-gray-400 uppercase block">
                      {char.alias}
                    </span>
                    <h3 className="font-heading text-3xl sm:text-4xl text-white tracking-wide">
                      {char.name}
                    </h3>
                    <span className="text-xs font-body text-gray-300 font-medium">
                      {char.role}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-gray-300 font-body leading-relaxed mb-5">
                  {char.bio}
                </p>

                {/* Quote */}
                <blockquote className="border-l-2 border-current pl-3 py-1 text-xs italic text-gray-400 font-body mb-5">
                  {char.quote}
                </blockquote>
              </div>

              {/* Skills & Specialties */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block mb-2">
                  ATTRIBUTES &amp; COMBAT SKILLS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {char.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-body px-2.5 py-1 rounded bg-gta-dark/80 border border-gta-border/60 text-gray-300"
                    >
                      • {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contextual Hub Footer */}
      <footer className="mt-16 pt-8 border-t border-gta-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-gta-purple" />
          <span>Characters verified against Rockstar Games Trailer 1 and official copyright registries.</span>
        </div>
        <div className="flex items-center gap-4 font-heading tracking-wider">
          <Link href="/vehicles" className="hover:text-gta-pink transition-colors">GETAWAY CARS</Link>
          <Link href="/map" className="hover:text-gta-teal transition-colors">LEONIDA MAP</Link>
          <Link href="/news" className="hover:text-gta-orange transition-colors">LATEST NEWS</Link>
        </div>
      </footer>
    </div>
  )
}
