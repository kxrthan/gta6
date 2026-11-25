'use client'
import { useState } from 'react'
import { Users, Radio } from 'lucide-react'

const allCharacters = [
  {
    name: 'LUCIA',
    alias: 'The Ghost of Leonida',
    role: 'Protagonist / Criminal Operator',
    group: 'Protagonists',
    status: 'WANTED - 4 STARS',
    accent: 'border-gta-pink/60 text-gta-pink bg-gta-pink/10 shadow-[0_0_20px_rgba(255,46,136,0.2)]',
    glowColor: '#FF2E88',
    skills: ['Precision Firearms', 'Infiltration', 'High-Stakes Heists', 'Hand-to-Hand'],
    bio: 'Sharp, relentless, and fiercely calculating. Released from prison on Leonida state custody, Lucia is determined to take everything Vice City owes her. With her partner Jason, they form a modern Bonnie & Clyde operating across neon nightclubs and desolate swamplands.',
    quote: '"The only way out of this city is through the front door with the bag."',
  },
  {
    name: 'JASON',
    alias: 'Jay-Bird',
    role: 'Protagonist / Tactical Wheelman',
    group: 'Protagonists',
    status: 'WANTED - 4 STARS',
    accent: 'border-gta-teal/60 text-gta-teal bg-gta-teal/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]',
    glowColor: '#00E5FF',
    skills: ['Combat Driving', 'Explosives', 'Underworld Logistics', 'Stealth'],
    bio: 'Former military contractor who found traditional life in Vice City too slow. Calm under fire with unmatched vehicular mastery, Jason is the pragmatic counterpart to Lucia’s aggressive ambition. Fiercely protective, he navigates the city’s dangerous cartel politics.',
    quote: '"Trust me. When the sirens start, we won’t even be in the rear-view mirror."',
  },
  {
    name: 'CHIEF STEFANIE MORETTI',
    alias: 'VCPD Chief of Police',
    role: 'Law Enforcement / Commander of Vice City Police',
    group: 'VCPD Police',
    status: 'COMMANDING OFFICER',
    accent: 'border-blue-500/80 text-blue-400 bg-blue-500/15 shadow-[0_0_25px_rgba(59,130,246,0.3)]',
    glowColor: '#3B82F6',
    skills: ['SWAT Coordination', 'Citywide Roadblocks', 'Drone Surveillance', 'Zero Tolerance'],
    bio: 'The newly appointed, iron-fisted Chief of the Vice City Police Department. Armed with multimillion-dollar federal counter-gang grants, Moretti has ordered high-speed Buffalo EVX interceptors and military-grade riot trucks into the streets to crush the rising wave of robberies.',
    quote: '"I do not care if they think they are Bonnie & Clyde. In my city, criminals end up in a cell or in a bag."',
  },
  {
    name: 'DETECTIVE VANCE HERNANDEZ',
    alias: 'Badge 404',
    role: 'VCPD Major Crimes & Tactical Pursuits',
    group: 'VCPD Police',
    status: 'LEAD DETECTIVE',
    accent: 'border-cyan-400/80 text-cyan-300 bg-cyan-500/15 shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    glowColor: '#06B6D4',
    skills: ['Highway Interceptions', 'Informant Interrogation', 'Tactical Firearms', 'Undercover Sting'],
    bio: 'Veteran VCPD detective spearheading the special task force tracking Lucia and Jason. Obsessed with stopping high-profile getaway drivers, Hernandez personally pilots the customized unmarked Buffalo police interceptor.',
    quote: '"You two think you’re special? Vice City has swallowed tougher pairs before breakfast."',
  },
  {
    name: 'OFFICER CHAD DIXON',
    alias: 'VCPD Highway Pursuit Specialist',
    role: 'Leonida State Patrol / Highway Division',
    group: 'VCPD Police',
    status: 'ACTIVE PURSUIT UNIT',
    accent: 'border-indigo-400/80 text-indigo-300 bg-indigo-500/15 shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    glowColor: '#6366F1',
    skills: ['PIT Maneuvers', 'Motorcycle Interceptions', 'Spike Strip Deployment'],
    bio: 'Patrols Leonida Interstate 95 on the 175-MPH Western Sovereign Police Motorcycle. Dixon has logged over 200 successful vehicle captures and is notorious for initiating high-speed chases through dense downtown traffic.',
    quote: '"Nobody outruns the radio, buddy. Pull it over or leave on a stretcher."',
  },
  {
    name: 'RAUL SANTOS',
    alias: 'El Caiman',
    role: 'Antagonist / Port Gellhorn Cartel Boss',
    group: 'Underworld',
    status: 'HIGH-VALUE TARGET',
    accent: 'border-gta-orange/60 text-gta-orange bg-gta-orange/10 shadow-[0_0_20px_rgba(255,138,61,0.2)]',
    glowColor: '#FF8A3D',
    skills: ['Contraband Smuggling', 'Bribery', 'Private Militias'],
    bio: 'Controls 80% of marine freight entering Vice City via the southern waterways. Cold-blooded and cultured, Raul operates out of a fortified villa on Starfish Island with armed guards and state-of-the-art surveillance.',
    quote: '"In Vice City, blood is cheap. Loyalty is the only currency that matters."',
  },
  {
    name: 'UNCLE CAL',
    alias: 'The Fixer',
    role: 'Underworld Fence & Weapons Broker',
    group: 'Underworld',
    status: 'INFORMANT / NEUTRAL',
    accent: 'border-gta-purple/60 text-gta-purple bg-gta-purple/10 shadow-[0_0_20px_rgba(123,47,247,0.2)]',
    glowColor: '#7B2FF7',
    skills: ['Black Market Arms', 'Counterfeiting', 'Clean Safe Houses'],
    bio: 'An old-school smuggler who survived the 1980s Vice City cocaine wars. Now operates a run-down boat repair dock in the Everglades that conceals one of the largest black-market armories on the East Coast.',
    quote: '"If it shoots, flies, or goes boom, I got two in the back. Cash only."',
  },
  {
    name: 'ROXY DEVILLE',
    alias: 'Radio V-Rock Host',
    role: 'Vice City Media Celebrity & Informant',
    group: 'Underworld',
    status: 'CIVILIAN VIP',
    accent: 'border-yellow-400/60 text-yellow-400 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
    glowColor: '#FACC15',
    skills: ['Social Media Reach', 'Celebrity Connections', 'City Gossip'],
    bio: 'The biggest voice on Leonida airwaves and social feeds. Her late-night broadcasts provide players with live police scanner rumors, secret rave coordinates, and street gossip.',
    quote: '"Good evening, Vice City! The temperature is 82 degrees and the crime rate is climbing!"',
  },
]

export default function CharactersPage() {
  const [filter, setFilter] = useState('All')

  const displayedCharacters = allCharacters.filter((c) => {
    if (filter === 'All') return true
    if (filter === 'Police') return c.group === 'VCPD Police'
    if (filter === 'Protagonists') return c.group === 'Protagonists'
    if (filter === 'Underworld') return c.group === 'Underworld'
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-purple/40 bg-gta-purple/10 text-gta-purple text-xs font-heading tracking-[0.25em] mb-4">
          <Users size={14} />
          VCPD SUSPECT RAP SHEETS &amp; LAW ENFORCEMENT
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          GTA 6 <span className="gradient-text">CHARACTERS &amp; VCPD</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
          Meet the protagonists Lucia and Jason, the elite officers of the Vice City Police Department (VCPD),
          and the ruthless cartel bosses ruling the underworld of Leonida.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-gta-card border border-gta-border/80 shadow-lg">
            {['All', 'Protagonists', 'Police', 'Underworld'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-heading text-xs tracking-wider uppercase transition-all ${
                  filter === tab
                    ? tab === 'Police'
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                      : 'bg-gta-pink text-white shadow-[0_0_15px_rgba(255,46,136,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'Police' && '🚔 '}
                {tab === 'Protagonists' && '⭐ '}
                {tab} ({tab === 'All' ? allCharacters.length : allCharacters.filter((c) => tab === 'Police' ? c.group === 'VCPD Police' : c.group === tab).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Characters Dossier Grid */}
      <div className="pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-heading tracking-[0.25em] text-gta-teal uppercase block mb-2">
            VCPD SURVEILLANCE &amp; DOSSIERS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide">
            CONFIRMED <span className="gradient-text">PERSONS OF INTEREST</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayedCharacters.map((char) => {
          const isPolice = char.group === 'VCPD Police'

          return (
            <div
              key={char.name}
              className={`card-gta p-6 sm:p-8 border ${char.accent} transition-all duration-300 relative overflow-hidden`}
            >
              {/* Stamp Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-heading tracking-widest px-2.5 py-1 rounded border border-current font-bold uppercase ${
                  isPolice ? 'text-blue-400 bg-blue-500/20' : ''
                }`}>
                  {isPolice && '🛡️ '}
                  {char.status}
                </span>
              </div>

              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-xl border border-white/20 bg-gta-dark flex items-center justify-center font-heading text-3xl font-bold flex-shrink-0"
                  style={{ color: char.glowColor, textShadow: `0 0 15px ${char.glowColor}` }}
                >
                  {isPolice ? '👮' : char.name[0]}
                </div>
                <div>
                  <span className="text-xs font-heading tracking-widest text-gray-400 uppercase block">
                    {char.alias}
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide">
                    {char.name}
                  </h2>
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

              {/* Skills & Specialties */}
              <div>
                <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block mb-2">
                  TACTICAL ATTRIBUTES &amp; ATTRIBUTES:
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
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}
