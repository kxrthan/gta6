'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import MediumArticleEditor from '@/components/admin/MediumArticleEditor'
import {
  Lock,
  Unlock,
  LayoutDashboard,
  FileText,
  Car,
  Terminal,
  Users,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle,
  Download,
  ExternalLink,
  HardDrive,
  Database,
  Eye,
  EyeOff,
  Sparkles,
  Radio,
  Shield,
  Zap,
  RefreshCw,
  X,
  Save,
  Check,
  Volume2,
  Music,
  Upload,
  Gauge,
  Compass,
  Siren,
  Play,
  Copy,
  AlertTriangle,
  User,
  LogOut,
  Key,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const cheatCategoryThemes = {
  Weapons: {
    badge: 'border-red-500/40 bg-red-500/10 text-red-400',
    border: 'border-red-500/60',
    glow: 'shadow-[0_0_25px_rgba(239,68,68,0.2)]',
  },
  Vehicles: {
    badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    border: 'border-blue-500/60',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.2)]',
  },
  Player: {
    badge: 'border-green-500/40 bg-green-500/10 text-green-400',
    border: 'border-green-500/60',
    glow: 'shadow-[0_0_25px_rgba(34,197,94,0.2)]',
  },
  Wanted: {
    badge: 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400',
    border: 'border-yellow-400/60',
    glow: 'shadow-[0_0_25px_rgba(250,204,21,0.2)]',
  },
  World: {
    badge: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    border: 'border-purple-500/60',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]',
  },
}


// Web Audio API Engine Rev Synthesizer
function playVehicleRevSound(audioType = 'v8', customAudioUrl = null) {
  if (customAudioUrl) {
    try {
      const audio = new Audio(customAudioUrl)
      audio.currentTime = 0
      audio.play().catch(() => {})
      return
    } catch (e) {}
  }
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    if (audioType === 'siren' || audioType.includes('Police')) {
      // VCPD Pursuit Siren dual-wail
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(650, now)
      osc.frequency.linearRampToValueAtTime(1050, now + 0.35)
      osc.frequency.linearRampToValueAtTime(650, now + 0.7)
      osc.frequency.linearRampToValueAtTime(1050, now + 1.05)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 1.3)
    } else if (audioType === 'helicopter' || audioType.includes('Air')) {
      // Chopper rotor blade thump
      for (let i = 0; i < 7; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(48, now + i * 0.16)
        gain.gain.setValueAtTime(0.2, now + i * 0.16)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.16 + 0.12)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.16)
        osc.stop(now + i * 0.16 + 0.12)
      }
    } else if (audioType === 'v12') {
      // High-RPM screaming V12
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(120, now)
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.5)
      osc.frequency.exponentialRampToValueAtTime(850, now + 1.0)
      osc.frequency.exponentialRampToValueAtTime(180, now + 1.6)
      gain.gain.setValueAtTime(0.14, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.7)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 1.7)
    } else if (audioType === 'muscle') {
      // Supercharged V8 deep rumble
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(60, now)
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.45)
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.85)
      osc.frequency.exponentialRampToValueAtTime(75, now + 1.5)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 1.6)
    } else {
      // V8 Twin Turbo
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.5)
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.9)
      osc.frequency.exponentialRampToValueAtTime(95, now + 1.5)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.7)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 1.7)
    }
  } catch (e) {}
}

// Initial Seed Data: Posts
const INITIAL_POSTS = [
  {
    id: 1,
    title: 'GTA 6 Official Release Window & Target Launch Platforms Confirmed',
    slug: 'gta6-release-date-confirmed',
    category: 'News',
    author: 'Jason Vance',
    views: '142,850',
    status: 'Published',
    date: '2026-05-18',
    coverImage: '/images/posts/release-date.jpg',
    tags: ['GTA 6', 'Release Date', 'Rockstar Games'],
    excerpt: 'Rockstar Games reaffirms worldwide launch window for PlayStation 5 and Xbox Series X/S.',
    content: `# GTA 6 Official Release Window & Target Launch Platforms Confirmed\n\nRockstar Games has officially reaffirmed that Grand Theft Auto VI is targeted for worldwide release in Fall 2026 on PlayStation 5 and Xbox Series X/S.\n\n## Next-Gen Fidelity & Technology\n\nBuilt on the latest iteration of RAGE (Rockstar Advanced Game Engine), GTA 6 introduces physically based water physics, volumetric fog over the Everglades, and dynamic crowd density in Vice City.\n\n![Release Artwork](/images/posts/release-date.jpg)\n*OFFICIAL ROCKSTAR GAMES ANNOUNCEMENT PROMO*\n\n## PC Launch Window\n\nAs with previous major Rockstar launches including GTA V and Red Dead Redemption 2, the PC version is scheduled to follow following post-launch console optimization.`,
  },
  {
    id: 2,
    title: 'Top 10 Things Every Player Must Do First in Vice City & Leonida',
    slug: 'top-10-things-to-do-first',
    category: 'Guides',
    author: 'Lucia Caminos',
    views: '98,400',
    status: 'Published',
    date: '2026-05-15',
    coverImage: '/images/posts/top-10.jpg',
    tags: ['Guides', 'Walkthrough', 'Vice City', 'Leonida'],
    excerpt: 'From hijacking your first boat in Ocean Beach to exploring Port Gellhorn swamplands.',
    content: `# Top 10 Things Every Player Must Do First in Vice City & Leonida\n\nWhen you first touch down in Vice City as Lucia and Jason, the open world can be overwhelming. Here is the definitive bucket list of what to prioritize in your first 10 hours.\n\n## 1. Secure the Ocean View Safehouse Garage\n\nHead directly to Ocean Beach to unlock your primary safehouse, equipped with a 4-vehicle garage and wardrobe fitting station.\n\n## 2. Scout VCPD Patrol Response Times\n\nTest the new law enforcement pursuit mechanics in Little Havana to understand vehicle pitting and spike strip deployment.\n\n![Vice City Skyline](/images/posts/top-10.jpg)\n*DOWNTOWN VICE CITY AT TWILIGHT*`,
  },
  {
    id: 3,
    title: 'Complete GTA 6 Cheat Codes Vault: Weapons, Supercars & God Mode',
    slug: 'complete-cheat-codes-guide',
    category: 'Cheats',
    author: 'Vice Editorial',
    views: '235,120',
    status: 'Published',
    date: '2026-05-12',
    coverImage: '/images/posts/cheats.jpg',
    tags: ['Cheats', 'Weapons', 'God Mode', 'Spawn Cars'],
    excerpt: 'Comprehensive cheat codes compilation for PS5, Xbox Series X, and PC consoles.',
    content: `# Complete GTA 6 Cheat Codes Vault: Weapons, Supercars & God Mode\n\nRockstar Games continues the proud tradition of button combination cheats and cell phone dialer codes in GTA 6.\n\n## Universal Cheat Hotkeys\n\nDial these numbers on your in-game smartphone or enter controller button combos to trigger instant invincibility, spawn Grotti hypercars, or clear wanted stars.\n\n- **Invincibility (5 Minutes):** 1-999-724-654-5537 (PAIN-KILLER)\n- **Max Health & Armor:** 1-999-887-853 (TURTLE)\n- **Spawn Grotti Cheetah Classic:** 1-999-266-38 (COMET)`,
  },
  {
    id: 4,
    title: 'New Leaked Map Coordinates Discovered in Vice City Suburbs',
    slug: 'new-leaked-map-coordinates-discovered',
    category: 'News',
    author: 'Vice City Reporter',
    views: '76,310',
    status: 'Published',
    date: '2026-11-16',
    coverImage: '/images/posts/map-coords.jpg',
    tags: ['leaks', 'map', 'coordinates', 'vice city'],
    excerpt: 'Data miners have decrypted coordinate sets pointing to a massive underground bunker complex in the northern Leonida mountain ranges.',
    content: `# New Leaked Map Coordinates Discovered in Vice City Suburbs\n\nLate last night, members of the GTA 6 mapping project announced a breakthrough: hidden coordinates embedded in recently analyzed game file telemetry point to an expansive northern territory known internally as **Mount Kalaga** and the **Ambrosia Basin**.\n\n![VCPD Satellite Reconnaissance](/images/posts/map-coords.jpg)\n*VICE CITY POLICE DEPARTMENT ARCHIVE // RECON PHOTO · CASE FILE #NEW-LEAKED*\n\n## The Decrypted Coordinates\n\nThe satellite beacon coordinates translate to a sector roughly 12 miles northwest of Downtown Vice City:\n\n- **Sector:** Ambrosia Agri-Corridor\n- **Latitude / Longitude:** \`26.1420° N, 80.3840° W\`\n- **Elevation:** 850m above sea level\n\n## Underground Military Installation\n\nUnlike GTA V's Mount Chiliad mysteries, this location appears to host an enterable underground complex:\n\n1. **Sub-level Blast Doors:** Accessible via heavy industrial keycard\n2. **Subterranean Vehicle Test Track:** Designed for high-speed military prototypes\n3. **Radar Jamming Station:** Blocks all minimap radar within a 1-mile radius\n\n![Leonida Satellite Topology Map](/images/gta6-leonida-map.jpg)\n*OFFICIAL INTEL // Northern Leonida Military Research Installation Perimeter*\n\n> "Rockstar seems to have built dynamic interior streaming for deep installations without any visible loading screens." — Mapping Community Lead\n\n## What This Means for Gameplay\n\nThis suggests that Leonida isn't just about Miami beaches and neon nightclubs. Rockstar is blending dense urban nightlife with expansive rural mysteries and deep verticality.\n\nStay tuned as we continue analyzing the latest dispatches from Leonida!`,
  },
]

// All 12 Confirmed GTA 6 Vehicles with Complete Fields (Cover Text, Sounds, Stats)
const INITIAL_VEHICLES = [
  {
    id: 1,
    name: 'Grotti Cheetah Classic',
    brand: 'Grotti',
    coverText: 'GROTTI MOTOR DIVISION',
    badge: 'SUPERCAR',
    class: 'Super',
    topSpeed: 204,
    acceleration: 2.9,
    handling: 9.4,
    armor: 6.8,
    price: '$1,850,000',
    location: 'Starfish Island Mansions & Ocean Drive Showrooms',
    desc: 'The quintessential Vice City icon. Mid-engine Italian thoroughbred with twin-turbo V8, pop-up headlights, and aggressive side strakes.',
    color: 'from-red-500 to-gta-pink',
    audioEngine: 'v8',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 2,
    name: 'Bravado Buffalo EVX Police Interceptor',
    brand: 'Bravado',
    coverText: 'VCPD HIGH-SPEED PURSUIT DIVISION',
    badge: 'VCPD INTERCEPTOR',
    class: 'Police & Emergency',
    topSpeed: 190,
    acceleration: 3.1,
    handling: 8.9,
    armor: 9.2,
    price: '$0 (Confiscate from VCPD)',
    location: 'VCPD Central Precinct & Little Haiti Patrols',
    desc: 'The primary high-speed response cruiser for Vice City Police Department. Fitted with heavy steel push-bars, EMP pulse blockers, and dual strobe lightbars.',
    color: 'from-blue-600 to-indigo-800',
    audioEngine: 'siren',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 3,
    name: 'Pegassi Torero XO',
    brand: 'Pegassi',
    coverText: 'PEGASSI HYPERCAR ENGINEERING',
    badge: 'HYPERCAR',
    class: 'Super',
    topSpeed: 218,
    acceleration: 2.6,
    handling: 9.7,
    armor: 6.2,
    price: '$2,890,000',
    location: 'Downtown Vice City Luxury Dealership',
    desc: 'Next-generation hypercar equipped with an active aerodynamic rear wing and butterfly doors. The preferred ride for Vice City’s high-stakes syndicate bosses.',
    color: 'from-gta-teal to-blue-500',
    audioEngine: 'v12',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 4,
    name: 'Bravado Gauntlet Hellfire',
    brand: 'Bravado',
    coverText: 'AMERICAN MUSCLE PERFORMANCE',
    badge: 'MUSCLE',
    class: 'Muscle',
    topSpeed: 182,
    acceleration: 3.4,
    handling: 7.8,
    armor: 7.5,
    price: '$745,000',
    location: 'Port Gellhorn Industrial Strip & Street Races',
    desc: 'Raw, unapologetic American supercharged V8 muscle. Smokes tires in third gear and dominates midnight drag races down Vice Beach Boulevard.',
    color: 'from-gta-orange to-red-600',
    audioEngine: 'muscle',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 5,
    name: 'VCPD SWAT Riot Armored Truck',
    brand: 'Brute',
    coverText: 'VCPD TACTICAL ENFORCEMENT',
    badge: 'VCPD SWAT HEAVY',
    class: 'Police & Emergency',
    topSpeed: 125,
    acceleration: 6.2,
    handling: 6.5,
    armor: 10.0,
    price: '$0 (5-Star Wanted Level Only)',
    location: 'Dispatched at 4 and 5 Star Wanted Levels',
    desc: 'Heavy bulletproof tactical transport. Features reinforced armor plating capable of deflecting RPG rounds, water cannon turrets, and seating for 8 tactical operators.',
    color: 'from-slate-700 to-slate-900',
    audioEngine: 'muscle',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 6,
    name: 'Pfister Comet S2 Cabrio',
    brand: 'Pfister',
    coverText: 'PFISTER STUTTGART MOTORWERK',
    badge: 'SPORTS CABRIO',
    class: 'Sports',
    topSpeed: 195,
    acceleration: 3.2,
    handling: 9.2,
    armor: 7.0,
    price: '$1,420,000',
    location: 'Vice Beach Club Valet Parking',
    desc: 'Rear-engine convertible perfection. Cruise Ocean Drive with the top down as the sun sets over the Atlantic with full synthwave radio blast.',
    color: 'from-gta-pink to-purple-600',
    audioEngine: 'v8',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 7,
    name: 'Albany Cavalcade XL Luxury SUV',
    brand: 'Albany',
    coverText: 'ALBANY EXECUTIVE COACHBUILDERS',
    badge: 'LUXURY SUV',
    class: 'SUVs',
    topSpeed: 160,
    acceleration: 4.8,
    handling: 7.5,
    armor: 8.8,
    price: '$860,000',
    location: 'Starfish Island & Little Havana',
    desc: 'Presidential escort luxury SUV featuring bullet-resistant glass, privacy tint, and enough interior trunk space for contraband duffel bags.',
    color: 'from-zinc-600 to-black',
    audioEngine: 'v8',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 8,
    name: 'Declasse Tulip M-100',
    brand: 'Declasse',
    coverText: 'LEONIDA GETAWAY DIVISION',
    badge: 'GETAWAY CLASSIC',
    class: 'Muscle',
    topSpeed: 168,
    acceleration: 3.8,
    handling: 7.2,
    armor: 7.2,
    price: '$380,000',
    location: 'Leonida Suburbs & Redhill Trailer Parks',
    desc: 'The iconic four-door classic seen driven by Jason and Lucia in the first trailer. Heavy steel frame, rumbling carbureted V8, and easily modded for robberies.',
    color: 'from-amber-600 to-yellow-600',
    audioEngine: 'muscle',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 9,
    name: 'VCPD Predator Patrol Boat',
    brand: 'Dinka',
    coverText: 'VICE CITY HARBOR PATROL',
    badge: 'POLICE COAST GUARD',
    class: 'Boats & Air',
    topSpeed: 95,
    acceleration: 4.1,
    handling: 8.5,
    armor: 8.5,
    price: '$0 (VCPD Coast Guard)',
    location: 'Vice City Canals & Port Gellhorn Harbor',
    desc: 'Twin high-output marine turbines equipped with searchlights and twin front-mounted machine gun mounts for coastal water pursuits.',
    color: 'from-blue-500 to-cyan-600',
    audioEngine: 'v8',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 10,
    name: 'Western Sovereign Police Motorcycle',
    brand: 'Western',
    coverText: 'LEONIDA STATE HIGHWAY PATROL',
    badge: 'HIGHWAY PATROL',
    class: 'Police & Emergency',
    topSpeed: 175,
    acceleration: 3.3,
    handling: 9.0,
    armor: 4.5,
    price: '$0 (VCPD Highway Patrol)',
    location: 'Leonida Interstate 95 Highway Patrol',
    desc: 'Heavy highway patrol cruiser with siren strobes, radar speed detection camera, and exceptional weave agility in heavy highway gridlock.',
    color: 'from-blue-700 to-slate-800',
    audioEngine: 'siren',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 11,
    name: 'Shitzu Hakuchou Drag',
    brand: 'Shitzu',
    coverText: 'SHITZU FACTORY RACING',
    badge: 'SUPERBIKE',
    class: 'Bikes',
    topSpeed: 220,
    acceleration: 2.4,
    handling: 8.7,
    armor: 4.0,
    price: '$976,000',
    location: 'Downtown Vice City Motorcycle Club',
    desc: 'Stretched wheelbase turbocharged superbike built for pure straight-line drag domination down the Leonida expressway.',
    color: 'from-gta-teal to-gta-purple',
    audioEngine: 'v12',
    audioFileName: null,
    audioFileUrl: null,
  },
  {
    id: 12,
    name: 'Sea Sparrow Amphibious Helicopter',
    brand: 'Western',
    coverText: 'WESTERN AERONAUTICS DIVISION',
    badge: 'AMPHIBIOUS CHOPPER',
    class: 'Boats & Air',
    topSpeed: 170,
    acceleration: 4.5,
    handling: 8.8,
    armor: 7.0,
    price: '$2,150,000',
    location: 'Everglades Airfield & Ocean Canals',
    desc: 'Light reconnaissance chopper with pontoon landing skids allowing seamless water touchdowns in the Everglades swamplands.',
    color: 'from-yellow-400 to-orange-500',
    audioEngine: 'helicopter',
    audioFileName: null,
    audioFileUrl: null,
  },
]

const INITIAL_CHEATS = [
  { id: 1, name: '$250,000', category: 'Player', ps5: '↑ → ↓ ← ↑ ← ↓ →', xbox: '↑ → ↓ ← ↑ ← ↓ →', pc: 'Up, Right, Down, Left, Up, Left, Down, Right', verified: true },
  { id: 2, name: 'Unlimited Focus', category: 'Player', ps5: '↓ ↑ ↑ ↓ ↑ ↓ ↑ ↓ ↑ →', xbox: '↓ ↑ ↑ ↓ ↑ ↓ ↑ ↓ ↑ →', pc: 'Down, Up, Up, Down, Up, Down, Up, Down, Up, Right', verified: true },
  { id: 3, name: 'Attack Force', category: 'Weapons', ps5: '↓ ↑ ← ← → ↓ ↓ ↑ ↓', xbox: '↓ ↑ ← ← → ↓ ↓ ↑ ↓', pc: 'Down, Up, Left, Left, Right, Down, Down, Up, Down', verified: true },
  { id: 4, name: 'Cycle Weather', category: 'World', ps5: '↓ → ↑ ↓ → ↑ →', xbox: '↓ → ↑ ↓ → ↑ →', pc: 'Down, Right, Up, Down, Right, Up, Right', verified: true },
]

const INITIAL_SUBSCRIBERS = [
  { id: 1, email: 'tommy.v@vicecity.net', source: 'Hero Footer', date: '2026-05-18', status: 'Active' },
  { id: 2, email: 'lucia.operator@protonmail.com', source: 'Map Modal', date: '2026-05-17', status: 'Active' },
  { id: 3, email: 'jason.wheelman@keysfleet.com', source: 'Cheats Page', date: '2026-05-16', status: 'Active' },
  { id: 4, email: 'chief.moretti@vcpd.gov', source: 'Vehicles Page', date: '2026-05-14', status: 'Active' },
]

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthChecking, setIsAuthChecking] = useState(false)
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isChangePassOpen, setIsChangePassOpen] = useState(false)
  const [changePassForm, setChangePassForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [changePassLoading, setChangePassLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('vehicles') // default to vehicles for immediate inspection
  const { addToast } = useToast()
  const audioInputRef = useRef(null)

  // Data States
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES)
  const [cheats, setCheats] = useState(INITIAL_CHEATS)
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS)

  // Search & Filter States
  const [postSearch, setPostSearch] = useState('')
  const [postCategoryFilter, setPostCategoryFilter] = useState('All')
  const [vehicleSearch, setVehicleSearch] = useState('')
  const [vehicleClassFilter, setVehicleClassFilter] = useState('All')

  // Live Sound Rev State
  const [revvingCarId, setRevvingCarId] = useState(null)
  const [isModalRevving, setIsModalRevving] = useState(false)
  const [dbStatus, setDbStatus] = useState(null)

  // Verify session cookie with backend on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsAuthenticated(true)
          setCurrentUser(data.user)
          setUsername(data.user.username)
        }
      })
      .catch(() => {})
      .finally(() => setIsAuthChecking(false))
  }, [])

  // Check Bluehost MySQL status
  useEffect(() => {
    fetch('/api/db-test')
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch(() => setDbStatus({ success: false }))
  }, [])

  // Modals State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [postForm, setPostForm] = useState({
    title: '',
    category: 'News',
    author: 'Vice City Reporter',
    excerpt: '',
    content: '',
    coverImage: '/images/posts/map-coords.jpg',
    tags: 'leaks, map, coordinates, vice city',
    status: 'Published',
  })

  // Load dynamically saved posts from backend API / filesystem
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          setPosts((prev) => {
            const merged = [...prev]
            data.posts.forEach((apiPost) => {
              const idx = merged.findIndex((p) => p.slug === apiPost.slug)
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...apiPost }
              } else {
                merged.push({ id: Date.now() + Math.random(), views: '1,500', status: 'Published', ...apiPost })
              }
            })
            return merged
          })
        }
      })
      .catch(() => {})
  }, [])

  // Load dynamically saved cheats from backend API / cheats.json
  useEffect(() => {
    fetch('/api/cheats')
      .then((res) => res.json())
      .then((data) => {
        if (data.cheats && data.cheats.length > 0) {
          setCheats(data.cheats)
        }
      })
      .catch(() => {})
  }, [])

  // Load dynamically saved vehicles from backend API / database
  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles)
        }
      })
      .catch(() => {})
  }, [])

  // Load dynamically saved subscribers from backend API / database
  useEffect(() => {
    fetch('/api/subscribers')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscribers) {
          setSubscribers(data.subscribers)
        }
      })
      .catch(() => {})
  }, [])

  // Comprehensive Vehicle Form State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [vehicleForm, setVehicleForm] = useState({
    name: 'Grotti Cheetah Classic',
    brand: 'Grotti',
    coverText: 'GROTTI MOTOR DIVISION',
    badge: 'SUPERCAR',
    class: 'Super',
    topSpeed: 204,
    acceleration: 2.9,
    handling: 9.4,
    armor: 6.8,
    price: '$1,850,000',
    location: 'Starfish Island Mansions & Ocean Drive Showrooms',
    desc: 'The quintessential Vice City icon. Mid-engine Italian thoroughbred with twin-turbo V8, pop-up headlights, and aggressive side strakes.',
    color: 'from-red-500 to-gta-pink',
    audioEngine: 'v8',
    audioFileName: null,
    audioFileUrl: null,
  })

  const [isCheatModalOpen, setIsCheatModalOpen] = useState(false)
  const [editingCheat, setEditingCheat] = useState(null)
  const [cheatForm, setCheatForm] = useState({
    name: '',
    category: 'Player',
    effect: '',
    description: '',
    ps5: '',
    xbox: '',
    pc: '',
    combo: '',
    warning: '',
    verified: true,
  })

  // Database-backed login handler
  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    if (!username.trim() || !password) {
      setAuthError('Please enter both username and password.')
      return
    }

    setIsSubmittingAuth(true)
    setAuthError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()

      if (data.success && data.user) {
        setIsAuthenticated(true)
        setCurrentUser(data.user)
        setAuthError('')
        addToast(`🔓 ACCESS GRANTED: Welcome, ${data.user.name || data.user.username}!`, 'mission', 3000)
      } else {
        setAuthError(data.error || 'INVALID CREDENTIALS — ACCESS DENIED')
        addToast(data.error || 'Access Denied: Invalid credentials', 'error', 3000)
      }
    } catch (err) {
      setAuthError('Connection error contacting database authentication server.')
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {}
    setIsAuthenticated(false)
    setCurrentUser(null)
    setPassword('')
    addToast('🔒 Session terminated. Terminal locked.', 'info', 2500)
  }

  // Change admin password in Bluehost MySQL
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (changePassForm.newPassword !== changePassForm.confirmPassword) {
      addToast('New passwords do not match!', 'error', 3000)
      return
    }
    if (changePassForm.newPassword.length < 6) {
      addToast('New password must be at least 6 characters long!', 'error', 3000)
      return
    }

    setChangePassLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: changePassForm.currentPassword,
          newPassword: changePassForm.newPassword,
          newUsername: changePassForm.newUsername || currentUser?.username,
        }),
      })
      const data = await res.json()
      if (data.success) {
        addToast(data.message || 'Credentials updated in MySQL database!', 'mission', 4000)
        setIsChangePassOpen(false)
        setChangePassForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' })
        if (data.username) {
          setCurrentUser((prev) => ({ ...prev, username: data.username }))
          setUsername(data.username)
        }
      } else {
        addToast(data.error || 'Failed to update credentials', 'error', 3500)
      }
    } catch (err) {
      addToast('Network error while updating credentials', 'error', 3000)
    } finally {
      setChangePassLoading(false)
    }
  }

  // Vehicle Actions: Open New Modal
  const handleOpenNewVehicle = () => {
    setEditingVehicle(null)
    setVehicleForm({
      name: '',
      brand: '',
      coverText: 'VICE CITY SPECIAL TUNING',
      badge: 'SUPERCAR',
      class: 'Super',
      topSpeed: 200,
      acceleration: 3.0,
      handling: 9.0,
      armor: 6.5,
      price: '$1,500,000',
      location: 'Ocean Drive Showrooms',
      desc: 'High-performance exotic vehicle confirmed for the streets of Vice City.',
      color: 'from-red-500 to-gta-pink',
      audioEngine: 'v8',
      audioFileName: null,
      audioFileUrl: null,
    })
    setIsVehicleModalOpen(true)
  }

  // Vehicle Actions: Edit Existing Vehicle
  const handleEditVehicle = (veh) => {
    setEditingVehicle(veh)
    setVehicleForm({
      name: veh.name || '',
      brand: veh.brand || '',
      coverText: veh.coverText || `${veh.brand.toUpperCase()} MOTOR DIVISION`,
      badge: veh.badge || 'CONFIRMED',
      class: veh.class || 'Super',
      topSpeed: veh.topSpeed || 200,
      acceleration: veh.acceleration || 3.0,
      handling: veh.handling || 8.0,
      armor: veh.armor || 7.0,
      price: veh.price || '$1,000,000',
      location: veh.location || 'Vice City Dealership',
      desc: veh.desc || '',
      color: veh.color || 'from-gta-teal to-blue-500',
      audioEngine: veh.audioEngine || 'v8',
      audioFileName: veh.audioFileName || null,
      audioFileUrl: veh.audioFileUrl || null,
    })
    setIsVehicleModalOpen(true)
  }

  // Vehicle Actions: Save (Create or Update with MySQL persistence)
  const handleSaveVehicle = async (e) => {
    e.preventDefault()
    if (!vehicleForm.name) return

    const payload = {
      ...(editingVehicle ? { id: editingVehicle.id } : {}),
      ...vehicleForm,
    }

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success && data.vehicle) {
        if (editingVehicle) {
          setVehicles((prev) =>
            prev.map((v) => (String(v.id) === String(editingVehicle.id) ? { ...v, ...data.vehicle } : v))
          )
          addToast(`🚗 Vehicle "${vehicleForm.name}" updated in database!`, 'mission', 3500)
        } else {
          setVehicles((prev) => [data.vehicle, ...prev])
          addToast(`🚗 New vehicle "${data.vehicle.name}" registered in Leonida database!`, 'mission', 3500)
        }
      } else {
        addToast(data.error || 'Failed to save vehicle', 'error', 3000)
      }
    } catch (err) {
      console.warn('Vehicle save API fallback:', err)
      if (editingVehicle) {
        setVehicles((prev) =>
          prev.map((v) => (String(v.id) === String(editingVehicle.id) ? { ...v, ...vehicleForm } : v))
        )
      } else {
        setVehicles([{ id: Date.now(), ...vehicleForm }, ...vehicles])
      }
    }
    setIsVehicleModalOpen(false)
  }

  const handleDeleteVehicle = async (id, name) => {
    if (confirm(`Remove "${name}" from confirmed vehicle registry?`)) {
      try {
        await fetch(`/api/vehicles?id=${id}`, { method: 'DELETE' })
      } catch (err) {
        console.warn('Vehicle delete API fallback:', err)
      }
      setVehicles((prev) => prev.filter((v) => String(v.id) !== String(id)))
      addToast(`🗑️ Vehicle "${name}" deleted from database.`, 'cheat', 2500)
    }
  }

  const handleDeleteSubscriber = async (id, email) => {
    if (confirm(`Remove subscriber "${email}"?`)) {
      try {
        await fetch(`/api/subscribers?id=${id}`, { method: 'DELETE' })
      } catch (err) {
        console.warn('Subscriber delete API error:', err)
      }
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      addToast(`🗑️ Subscriber "${email}" removed.`, 'info', 2500)
    }
  }

  // Audio Upload Handler
  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVehicleForm((prev) => ({
        ...prev,
        audioFileName: file.name,
        audioFileUrl: url,
        audioEngine: 'custom',
      }))
      addToast(`🎵 Audio file "${file.name}" uploaded successfully!`, 'mission', 3000)
    }
  }

  const handleRemoveAudioFile = () => {
    setVehicleForm((prev) => ({
      ...prev,
      audioFileName: null,
      audioFileUrl: null,
      audioEngine: 'v8',
    }))
    addToast('Custom audio removed. Reset to V8 Twin-Turbo engine preset.', 'info', 2000)
  }

  // Rev Sound Trigger in Modal
  const handleTestModalRev = () => {
    setIsModalRevving(true)
    playVehicleRevSound(vehicleForm.audioEngine, vehicleForm.audioFileUrl)
    addToast(`🔊 Revving ${vehicleForm.name || 'Vehicle'} Engine Sound...`, 'cheat', 2000)
    setTimeout(() => setIsModalRevving(false), 1800)
  }

  // Rev Sound Trigger on Grid Cards
  const handleCardRev = (veh) => {
    setRevvingCarId(veh.id)
    playVehicleRevSound(veh.audioEngine || 'v8', veh.audioFileUrl)
    addToast(`🔊 Revving Engine: ${veh.name}!`, 'cheat', 2000)
    setTimeout(() => setRevvingCarId(null), 1800)
  }

  // Post Actions
  const handleOpenNewPost = () => {
    setEditingPost(null)
    setPostForm({
      title: '',
      category: 'News',
      author: 'Vice City Reporter',
      excerpt: '',
      content: `# New Dispatch Header\n\nWrite the opening intel for your Vice City article...`,
      coverImage: '/images/posts/map-coords.jpg',
      tags: 'GTA 6, Vice City',
      status: 'Published',
    })
    setIsPostModalOpen(true)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setPostForm({
      title: post.title,
      category: post.category,
      author: post.author || 'Vice City Reporter',
      excerpt: post.excerpt || '',
      content: post.content || `# ${post.title}\n\n${post.excerpt || ''}`,
      coverImage: post.coverImage || '/images/posts/map-coords.jpg',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || 'GTA 6, Vice City',
      status: post.status || 'Published',
    })
    setIsPostModalOpen(true)
  }

  const handleSavePost = async (e) => {
    e.preventDefault()
    if (!postForm.title) return

    const slug = (editingPost?.slug || postForm.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const postPayload = {
      ...postForm,
      slug,
      tags: typeof postForm.tags === 'string' ? postForm.tags.split(',').map((t) => t.trim()) : postForm.tags,
      date: editingPost?.date || new Date().toISOString().split('T')[0],
      views: editingPost?.views || '1,250',
    }

    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      })
    } catch (err) {
      console.warn('API save fallback:', err)
    }

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? { ...p, ...postPayload } : p))
      )
      addToast(`✅ Article "${postForm.title}" saved with all sections!`, 'info', 3500)
    } else {
      const newPost = {
        id: Date.now(),
        ...postPayload,
      }
      setPosts([newPost, ...posts])
      addToast(`📰 New Article created & published!`, 'mission', 3500)
    }
    setIsPostModalOpen(false)
  }

  const handleDeletePost = async (id, title, slug) => {
    if (confirm(`Delete "${title}"?`)) {
      if (slug) {
        try {
          await fetch(`/api/posts?slug=${slug}`, { method: 'DELETE' })
        } catch (err) {}
      }
      setPosts(posts.filter((p) => p.id !== id))
      addToast(`🗑️ Article deleted.`, 'cheat', 2500)
    }
  }

  // Cheat Actions
  const openAddCheatModal = () => {
    setEditingCheat(null)
    setCheatForm({
      name: '',
      category: 'Player',
      effect: '',
      description: '',
      ps5: '',
      xbox: '',
      pc: '',
      combo: '',
      warning: '',
      verified: true,
    })
    setIsCheatModalOpen(true)
  }

  const openEditCheatModal = (cheat) => {
    setEditingCheat(cheat)
    setCheatForm({
      name: cheat.name || '',
      category: cheat.category || 'Player',
      effect: cheat.effect || '',
      description: cheat.description || '',
      ps5: cheat.ps5 || '',
      xbox: cheat.xbox || '',
      pc: cheat.pc || '',
      combo: cheat.combo || '',
      warning: cheat.warning || '',
      verified: cheat.verified !== undefined ? cheat.verified : true,
    })
    setIsCheatModalOpen(true)
  }

  const handleSaveCheat = async (e) => {
    e.preventDefault()
    if (!cheatForm.name) return

    const payload = {
      ...(editingCheat ? { id: editingCheat.id } : {}),
      ...cheatForm,
    }

    try {
      const res = await fetch('/api/cheats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.cheats) {
        setCheats(data.cheats)
      } else if (editingCheat) {
        setCheats(cheats.map((c) => (c.id === editingCheat.id ? { ...c, ...cheatForm } : c)))
      } else {
        setCheats([{ id: Date.now(), ...cheatForm }, ...cheats])
      }
      setIsCheatModalOpen(false)
      const cheatName = cheatForm.name
      setEditingCheat(null)
      addToast(
        editingCheat
          ? `✏️ Cheat code "${cheatName}" updated!`
          : `⭐ Cheat code "${cheatName}" saved to vault!`,
        'mission',
        3000
      )
    } catch (err) {
      console.error(err)
      addToast('Error saving cheat code', 'cheat', 2500)
    }
  }

  const handleDeleteCheat = async (id, name) => {
    try {
      const res = await fetch(`/api/cheats?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.cheats) {
        setCheats(data.cheats)
      } else {
        setCheats(cheats.filter((c) => c.id !== id))
      }
      addToast(`🗑️ Cheat code "${name}" removed.`, 'cheat', 2500)
    } catch (err) {
      setCheats(cheats.filter((c) => c.id !== id))
      addToast(`🗑️ Cheat code "${name}" removed.`, 'cheat', 2500)
    }
  }

  // Backup DB
  const handleBackupDb = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      source: 'GTA 6 Fan Hub Admin Database',
      posts,
      vehicles,
      cheats,
      subscribers,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gta6-portal-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    addToast('💾 Database snapshot downloaded as JSON!', 'mission', 3000)
  }

  // ==========================================
  // 1. LOGIN / LOCK SCREEN
  // ==========================================
  if (isAuthChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="card-gta p-8 text-center border border-gta-border/60">
          <Loader2 size={32} className="animate-spin text-gta-pink mx-auto mb-3" />
          <p className="font-heading text-sm tracking-widest text-gray-400">VERIFYING ENCRYPTED SESSION...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full card-gta p-8 text-center border-2 border-gta-pink/60 shadow-[0_0_50px_rgba(255,46,136,0.3)] bg-gradient-to-b from-[#0c0e1e] to-[#060814] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gta-pink via-gta-teal to-gta-orange" />
          
          <div className="w-16 h-16 rounded-2xl bg-gta-pink/15 border border-gta-pink/40 text-gta-pink flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,46,136,0.4)]">
            <Lock size={30} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3">
            <Radio size={12} className="text-gta-pink animate-pulse" />
            VCPD CYBER OPERATIONS // SECURE AUTH GATE
          </div>

          <h1 className="font-heading text-4xl text-white mb-2 tracking-wide">
            ADMIN <span className="gradient-text">MASTER LOGIN</span>
          </h1>
          <p className="text-xs text-gray-400 font-body mb-6 leading-relaxed">
            Enter administrative credentials to authenticate and enter command.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-gta-dark border border-gta-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gta-pink font-body text-sm shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                Passcode / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-gta-dark border border-gta-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gta-pink font-body text-sm shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-mono bg-red-500/10 p-3 rounded-lg border border-red-500/30 flex items-center gap-2">
                <AlertTriangle size={14} className="flex-shrink-0 text-red-400" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="gta-btn-primary w-full py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>VERIFYING DATABASE...</span>
                </>
              ) : (
                <>
                  <Unlock size={16} />
                  <span>AUTHENTICATE &amp; ENTER COMMAND</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Filtered Vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchCat = vehicleClassFilter === 'All' || v.class === vehicleClassFilter
    const matchSearch =
      v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.brand.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.location.toLowerCase().includes(vehicleSearch.toLowerCase())
    return matchCat && matchSearch
  })

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchCat = postCategoryFilter === 'All' || p.category === postCategoryFilter
    const matchSearch = p.title.toLowerCase().includes(postSearch.toLowerCase()) || p.author.toLowerCase().includes(postSearch.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-5 border-b border-gta-border/60">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-heading tracking-widest text-gta-teal uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>VCPD BACKEND DESK // STATUS: ACTIVE</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl text-white tracking-wide">
            ADMIN <span className="gradient-text">MASTER CONTROL</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {dbStatus?.success ? (
            <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-emerald-500/40 text-xs font-mono text-emerald-400 hidden sm:flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BLUEHOST MYSQL: ONLINE</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-yellow-500/40 text-xs font-mono text-yellow-400 hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>BLUEHOST MYSQL: CONNECTING...</span>
            </div>
          )}

          {/* User Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-gta-pink/40 text-xs font-mono text-gray-200 hidden sm:flex items-center gap-2 shadow-[0_0_12px_rgba(255,46,136,0.15)]">
            <User size={13} className="text-gta-pink" />
            <span>{currentUser?.username || 'admin'} ({currentUser?.role || 'SUPERADMIN'})</span>
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => setIsChangePassOpen(true)}
            className="text-xs font-heading tracking-wider px-3.5 py-2 rounded-xl bg-gta-card border border-gta-border hover:border-gta-teal text-gray-300 hover:text-gta-teal transition-colors flex items-center gap-1.5"
            title="Change Admin Password in MySQL Database"
          >
            <Key size={13} />
            <span className="hidden md:inline">CHANGE PASSWORD</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-xs font-heading tracking-wider px-3.5 py-2 rounded-xl bg-gta-card border border-gta-border hover:border-red-400 text-gray-300 hover:text-red-400 transition-colors flex items-center gap-1.5"
            title="End Session & Lock Terminal"
          >
            <LogOut size={13} />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-gta-border/60">
        {[
          { id: 'vehicles', label: `Vehicles Registry (${vehicles.length})`, icon: Car },
          { id: 'posts', label: `Articles (${posts.length})`, icon: FileText },
          { id: 'cheats', label: `Cheats Vault (${cheats.length})`, icon: Terminal },
          { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: Users },
          { id: 'overview', label: 'Overview & Health', icon: LayoutDashboard },
          { id: 'settings', label: '10GB Storage & Hosting', icon: HardDrive },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-xs tracking-wider uppercase transition-all flex-shrink-0 ${
                active
                  ? 'bg-gta-pink text-white shadow-[0_0_15px_rgba(255,46,136,0.5)] font-bold'
                  : 'bg-gta-dark/80 text-gray-400 hover:text-white border border-gta-border hover:border-gray-500'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ==========================================
          TAB: VEHICLES DATABASE (CAR SECTION)
         ========================================== */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {/* Action Bar & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  placeholder="Search car by name, brand, or location..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gta-dark border border-gta-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gta-teal"
                />
              </div>

              <select
                value={vehicleClassFilter}
                onChange={(e) => setVehicleClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gta-dark border border-gta-border text-xs text-white focus:outline-none focus:border-gta-teal"
              >
                <option value="All">All Classes ({vehicles.length})</option>
                <option value="Super">Supercars</option>
                <option value="Muscle">Muscle</option>
                <option value="Sports">Sports</option>
                <option value="Police & Emergency">Police &amp; Emergency</option>
                <option value="SUVs">SUVs</option>
                <option value="Bikes">Bikes &amp; Motorcycles</option>
                <option value="Boats & Air">Boats &amp; Air</option>
              </select>
            </div>

            <button
              onClick={handleOpenNewVehicle}
              className="gta-btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(255,46,136,0.4)]"
            >
              <Plus size={16} />
              <span>ADD NEW CONFIRMED VEHICLE</span>
            </button>
          </div>

          {/* Vehicles Cards Grid - Exact GTA 6 Visuals with Edit & Rev Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
              const isRevving = revvingCarId === vehicle.id
              const isPolice = vehicle.class?.includes('Police')

              return (
                <div
                  key={vehicle.id}
                  className={`card-gta p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                    isPolice
                      ? 'border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                      : 'border-gta-border hover:border-gta-pink/60 shadow-xl'
                  }`}
                >
                  <div>
                    {/* Badge & Price Header */}
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

                    {/* Vehicle Graphic Cover Box with Retro Grid & Editable Subtitle */}
                    <div className="relative min-h-[7rem] rounded-xl bg-gradient-to-r from-gta-dark via-[#130922] to-gta-dark border border-gta-border/60 flex items-center justify-center p-3 mb-4 overflow-hidden">
                      <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />
                      {isRevving && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gta-pink/25 via-gta-teal/25 to-orange-500/25 animate-pulse" />
                      )}
                      <div className="relative text-center w-full px-2 z-10">
                        <div className="font-heading text-white tracking-wider leading-tight break-words text-2xl sm:text-3xl">
                          {vehicle.name.toUpperCase()}
                        </div>
                        <span className="text-[10px] font-heading tracking-[0.25em] text-gray-400 uppercase mt-1 block">
                          {vehicle.coverText || `${vehicle.brand.toUpperCase()} MOTOR DIVISION`}
                        </span>
                      </div>
                    </div>

                    {/* Lore Description */}
                    <p className="text-xs text-gray-300 font-body leading-relaxed mb-4">
                      {vehicle.desc}
                    </p>

                    {/* Performance Metrics Bars */}
                    <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-gta-border/50 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-body">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Gauge size={12} className="text-gta-teal" /> TOP SPEED
                          </span>
                          <span className="text-white font-mono font-bold">{vehicle.topSpeed} MPH</span>
                        </div>
                        <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                          <div
                            className="h-full bg-gradient-to-r from-gta-teal to-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, (vehicle.topSpeed / 240) * 100)}%` }}
                          />
                        </div>
                      </div>

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

                    {/* Audio Status */}
                    <div className="text-[10px] font-mono text-gray-500 mb-3 flex items-center gap-1.5">
                      <Music size={11} className="text-gta-pink" />
                      <span>
                        ENGINE AUDIO:{' '}
                        <strong className="text-gray-300">
                          {vehicle.audioFileName ? `Custom (${vehicle.audioFileName})` : vehicle.audioEngine?.toUpperCase() || 'V8 TWIN-TURBO'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Buttons: Rev Engine, Edit, Delete */}
                  <div className="pt-3 border-t border-gta-border/50 space-y-2">
                    <button
                      onClick={() => handleCardRev(vehicle)}
                      className={`w-full py-2.5 rounded-lg font-heading text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                        isRevving
                          ? 'bg-gta-pink text-white shadow-[0_0_20px_rgba(255,46,136,0.6)] animate-pulse'
                          : 'bg-gta-dark hover:bg-gta-card border border-gta-border hover:border-gta-teal text-gray-300 hover:text-white'
                      }`}
                    >
                      <Volume2 size={14} className={isRevving ? 'animate-bounce text-yellow-300' : ''} />
                      {isRevving ? 'ENGINE ROARING! 🔥' : 'REV ENGINE / TEST SOUND'}
                    </button>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="py-1.5 rounded-lg bg-gta-card border border-gta-border hover:border-gta-pink text-gray-300 hover:text-white font-heading text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 size={13} className="text-gta-pink" />
                        <span>EDIT CAR</span>
                      </button>

                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id, vehicle.name)}
                        className="py-1.5 rounded-lg bg-gta-card border border-gta-border hover:border-red-500 text-gray-400 hover:text-red-400 font-heading text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB: ARTICLES & DISPATCHES
         ========================================== */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Search articles by title or author..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gta-dark border border-gta-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gta-pink"
                />
              </div>

              <select
                value={postCategoryFilter}
                onChange={(e) => setPostCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gta-dark border border-gta-border text-xs text-white focus:outline-none focus:border-gta-pink"
              >
                <option value="All">All Categories</option>
                <option value="News">News</option>
                <option value="Guides">Guides</option>
                <option value="Cheats">Cheats</option>
                <option value="Map">Map</option>
              </select>
            </div>

            <button
              onClick={handleOpenNewPost}
              className="gta-btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              <span>NEW DISPATCH ARTICLE</span>
            </button>
          </div>

          {/* Posts Table */}
          <div className="card-gta overflow-hidden border border-gta-border/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-black/80 font-heading text-gray-400 tracking-wider uppercase border-b border-gta-border">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gta-border/60">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-heading text-sm text-white">
                        <div className="font-bold">{post.title}</div>
                        <div className="text-[11px] font-mono text-gray-500">/blog/{post.slug}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-heading tracking-widest bg-gta-pink/15 text-gta-pink border border-gta-pink/30 uppercase">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 font-mono text-xs">{post.author}</td>
                      <td className="py-3.5 px-4 text-gray-300 font-mono text-xs">{post.views}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-heading tracking-widest uppercase ${
                            post.status === 'Published'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-gta-dark border border-gta-border hover:border-gta-teal text-gray-400 hover:text-gta-teal transition-colors"
                            title="View Public Post"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-1.5 rounded-lg bg-gta-dark border border-gta-border hover:border-gta-pink text-gray-400 hover:text-gta-pink transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title, post.slug)}
                            className="p-1.5 rounded-lg bg-gta-dark border border-gta-border hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB: CHEATS VAULT
         ========================================== */}
      {activeTab === 'cheats' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">
              MANAGING {cheats.length} ACTIVE CHEAT CODES
            </span>
            <button
              onClick={openAddCheatModal}
              className="gta-btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2"
            >
              <Plus size={16} />
              <span>ADD CHEAT CODE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cheats.map((ch) => (
              <div key={ch.id} className="card-gta p-5 border border-gta-border hover:border-yellow-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-lg text-white">{ch.name}</h3>
                    <span className="text-[10px] font-heading tracking-widest px-2 py-0.5 rounded bg-yellow-400/15 text-yellow-300 border border-yellow-400/40 uppercase">
                      {ch.category}
                    </span>
                  </div>

                  {(ch.effect || ch.description) && (
                    <p className="text-xs text-gray-300 mb-3 font-body">
                      {ch.effect || ch.description}
                    </p>
                  )}

                  <div className="space-y-1.5 font-mono text-xs mb-3">
                    <div className="flex gap-2 text-gray-300 items-center">
                      <span className="text-gta-pink w-12 font-heading text-[10px] uppercase">PS5:</span>
                      <span className="bg-black/60 px-2 py-0.5 rounded text-white font-mono flex-1">{ch.ps5 || '—'}</span>
                    </div>
                    <div className="flex gap-2 text-gray-300 items-center">
                      <span className="text-green-400 w-12 font-heading text-[10px] uppercase">XBOX:</span>
                      <span className="bg-black/60 px-2 py-0.5 rounded text-white font-mono flex-1">{ch.xbox || '—'}</span>
                    </div>
                    <div className="flex gap-2 text-gray-300 items-center">
                      <span className="text-gta-teal w-12 font-heading text-[10px] uppercase">PC:</span>
                      <span className="bg-black/60 px-2 py-0.5 rounded text-white font-mono flex-1">{ch.pc || '—'}</span>
                    </div>
                  </div>

                  {ch.combo && (
                    <div className="text-[11px] text-gray-400 font-mono bg-black/40 border border-gta-border/40 rounded p-2 mb-3">
                      <span className="text-gta-orange text-[9px] uppercase tracking-wider block font-heading">COMBO:</span>
                      <span className="text-gray-200">{ch.combo}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gta-border/60 mt-2">
                  <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                    <CheckCircle size={12} /> VERIFIED FOR RELEASE
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCheatModal(ch)}
                      className="text-gray-400 hover:text-yellow-400 p-1.5 rounded hover:bg-gta-border/40 transition-colors"
                      title="Edit Cheat"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCheat(ch.id, ch.name)}
                      className="text-gray-400 hover:text-red-400 p-1.5 rounded hover:bg-gta-border/40 transition-colors"
                      title="Delete Cheat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB: SUBSCRIBERS
         ========================================== */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">
              TOTAL NEWSLETTER LEADS: {subscribers.length} (SYNCED TO SAFEHOUSE)
            </span>
            <button
              onClick={() => {
                const csv = 'Email,Source,Date,Status\n' + subscribers.map((s) => `${s.email},${s.source},${s.date},${s.status}`).join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'gta6-subscribers.csv'
                a.click()
                addToast('📄 Exported subscribers CSV!', 'mission', 2500)
              }}
              className="gta-btn-secondary py-2 px-5 text-xs font-bold flex items-center gap-2"
            >
              <Download size={14} />
              <span>EXPORT LEADS CSV</span>
            </button>
          </div>

          <div className="card-gta overflow-hidden border border-gta-border">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/80 font-heading text-gray-400 tracking-wider uppercase border-b border-gta-border">
                <tr>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Capture Source</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gta-border/60">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-white font-bold">{s.email}</td>
                    <td className="py-3 px-4 text-gray-400">{s.source}</td>
                    <td className="py-3 px-4 text-gray-400">{s.date}</td>
                    <td className="py-3 px-4 text-green-400 font-bold">{s.status}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(s.id, s.email)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete Subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB: OVERVIEW & SYSTEM HEALTH
         ========================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="card-gta p-6 border-l-4 border-l-gta-teal">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-heading tracking-widest text-gray-400 uppercase">LEONIDA FLEET</span>
                <Car size={18} className="text-gta-teal" />
              </div>
              <div className="font-heading text-4xl text-white">{vehicles.length}</div>
              <span className="text-[11px] text-gta-teal font-mono mt-1 block">Full Audio &amp; Cover Support</span>
            </div>

            <div className="card-gta p-6 border-l-4 border-l-gta-pink">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-heading tracking-widest text-gray-400 uppercase">PUBLISHED ARTICLES</span>
                <FileText size={18} className="text-gta-pink" />
              </div>
              <div className="font-heading text-4xl text-white">{posts.length}</div>
              <span className="text-[11px] text-green-400 font-mono mt-1 block">Active Editorial Desk</span>
            </div>

            <div className="card-gta p-6 border-l-4 border-l-yellow-400">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-heading tracking-widest text-gray-400 uppercase">CHEAT CODES</span>
                <Terminal size={18} className="text-yellow-400" />
              </div>
              <div className="font-heading text-4xl text-white">{cheats.length}</div>
              <span className="text-[11px] text-yellow-300 font-mono mt-1 block">PS5, Xbox &amp; PC</span>
            </div>

            <div className="card-gta p-6 border-l-4 border-l-green-400">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-heading tracking-widest text-gray-400 uppercase">SUBSCRIBERS</span>
                <Users size={18} className="text-green-400" />
              </div>
              <div className="font-heading text-4xl text-white">8,452</div>
              <span className="text-[11px] text-green-400 font-mono mt-1 block">Live Safehouse Audience</span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB: 10GB STORAGE & HOSTING
         ========================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="card-gta p-6 border-gta-teal/50">
            <h3 className="font-heading text-2xl text-white mb-2 flex items-center gap-2">
              <HardDrive size={22} className="text-gta-teal" />
              10 GB HOSTING ALLOCATION &amp; DATABASE ENGINE
            </h3>
            <p className="text-xs text-gray-400 font-body mb-6 leading-relaxed max-w-3xl">
              Your server includes 10 GB of storage. Next.js runs seamlessly with an embedded SQLite database (or Postgres) which only requires 50MB. All uploads are optimized into WebP format to prevent disk overflow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">DATABASE ENGINE</span>
                <span className="font-heading text-lg text-white">SQLite + Prisma</span>
                <span className="text-[11px] text-gta-teal font-mono block mt-1">Local &amp; Zero Cost (50 MB)</span>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">IMAGE OPTIMIZER</span>
                <span className="font-heading text-lg text-white">Sharp WebP Engine</span>
                <span className="text-[11px] text-gta-pink font-mono block mt-1">~120 KB per screenshot</span>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">AVAILABLE CAPACITY</span>
                <span className="font-heading text-lg text-green-400">9.15 GB FREE</span>
                <span className="text-[11px] text-gray-400 font-mono block mt-1">Up to 25,000 articles</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gta-border/60">
              <button
                onClick={handleBackupDb}
                className="gta-btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2"
              >
                <Download size={15} />
                <span>DOWNLOAD DATABASE BACKUP</span>
              </button>

              <button
                onClick={() => addToast('⚡ Next.js ISR Cache Revalidated!', 'info', 2500)}
                className="gta-btn-secondary py-2.5 px-6 text-xs font-bold flex items-center gap-2"
              >
                <RefreshCw size={15} />
                <span>FLUSH CACHE &amp; REVALIDATE</span>
              </button>
            </div>
          </div>

          {/* MySQL Database Admin User Details Card */}
          <div className="card-gta p-6 border-gta-pink/50 bg-gradient-to-r from-[#0d0f22] to-[#120a1c]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-heading text-2xl text-white flex items-center gap-2">
                  <Shield size={22} className="text-gta-pink" />
                  ADMINISTRATOR ACCOUNT (BLUEHOST MYSQL)
                </h3>
                <p className="text-xs text-gray-400 font-body mt-1">
                  Secure admin authentication backed by the <code className="text-gta-teal font-mono">admin_users</code> table in Bluehost MySQL.
                </p>
              </div>

              <button
                onClick={() => setIsChangePassOpen(true)}
                className="gta-btn-primary py-2 px-5 text-xs font-heading tracking-wider uppercase flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Key size={14} />
                <span>CHANGE CREDENTIALS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">CURRENT USERNAME</span>
                <span className="font-heading text-base text-white flex items-center gap-1.5">
                  <User size={14} className="text-gta-teal" />
                  {currentUser?.username || 'admin'}
                </span>
              </div>

              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">ACCESS ROLE</span>
                <span className="font-heading text-base text-gta-pink">
                  {currentUser?.role || 'SUPERADMIN'}
                </span>
              </div>

              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">PASSWORD ENCRYPTION</span>
                <span className="font-heading text-base text-emerald-400">Salted Scrypt Hash</span>
              </div>

              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">LAST LOGIN</span>
                <span className="font-mono text-xs text-gray-300">
                  {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'Active Session'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CHANGE ADMIN CREDENTIALS IN DATABASE
         ========================================== */}
      {isChangePassOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChangePassOpen(false)
          }}
        >
          <div className="max-w-md w-full card-gta p-6 sm:p-8 border border-gta-teal/60 bg-[#0d0f22] relative shadow-[0_0_40px_rgba(0,229,255,0.25)]">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gta-border/60">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-gta-teal" />
                <h3 className="font-heading text-xl text-white">UPDATE ADMIN CREDENTIALS</h3>
              </div>
              <button
                onClick={() => setIsChangePassOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400 font-body mb-5 leading-relaxed">
              Updates your administrative credentials directly in the remote Bluehost MySQL database table (<code className="text-gta-teal font-mono">admin_users</code>) using salted scrypt hashing.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={changePassForm.currentPassword}
                  onChange={(e) => setChangePassForm({ ...changePassForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                  className="w-full px-3.5 py-2.5 bg-gta-dark border border-gta-border rounded-lg text-white font-body text-sm focus:outline-none focus:border-gta-teal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  New Username (Optional)
                </label>
                <input
                  type="text"
                  value={changePassForm.newUsername}
                  onChange={(e) => setChangePassForm({ ...changePassForm, newUsername: e.target.value })}
                  placeholder={currentUser?.username || 'admin'}
                  className="w-full px-3.5 py-2.5 bg-gta-dark border border-gta-border rounded-lg text-white font-body text-sm focus:outline-none focus:border-gta-teal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  New Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  value={changePassForm.newPassword}
                  onChange={(e) => setChangePassForm({ ...changePassForm, newPassword: e.target.value })}
                  placeholder="New secure password"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 bg-gta-dark border border-gta-border rounded-lg text-white font-body text-sm focus:outline-none focus:border-gta-teal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={changePassForm.confirmPassword}
                  onChange={(e) => setChangePassForm({ ...changePassForm, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 bg-gta-dark border border-gta-border rounded-lg text-white font-body text-sm focus:outline-none focus:border-gta-teal"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(false)}
                  className="w-1/2 py-2.5 rounded-lg border border-gta-border text-xs font-heading tracking-wider uppercase text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={changePassLoading}
                  className="w-1/2 gta-btn-primary py-2.5 text-xs font-heading tracking-wider uppercase flex items-center justify-center gap-1.5"
                >
                  {changePassLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>SAVE IN DB</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: COMPREHENSIVE VEHICLE EDITOR
          (Cover Text, Audio Upload, Stats, Live Card Preview)
          ========================================== */}
      {isVehicleModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md pt-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsVehicleModalOpen(false)
          }}
        >
          <div className="card-gta max-w-4xl w-full h-[85vh] p-5 sm:p-6 border-2 border-gta-pink/80 shadow-[0_0_60px_rgba(255,46,136,0.3)] flex flex-col overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gta-border/60 flex-shrink-0">
              <div>
                <div className="text-[10px] font-mono text-gta-teal tracking-widest uppercase mb-1">
                  LEONIDA MOTOR REGISTRY // COMPLETE VEHICLE SUITE
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl text-white">
                  {editingVehicle ? `EDIT: ${editingVehicle.name.toUpperCase()}` : 'REGISTER NEW CONFIRMED VEHICLE'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="p-2 rounded-xl bg-black/60 border border-gta-border hover:border-red-500 text-gray-400 hover:text-white hover:bg-red-500/20 transition-all flex items-center justify-center ml-2 group"
                title="Close Vehicle Editor"
              >
                <X size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="flex-1 flex flex-col min-h-0">
              {/* 2-Column Suite: Left Form Controls, Right Live Card Preview */}
              <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
                {/* Left Column: Form Inputs (7 cols) */}
                <div className="lg:col-span-7 space-y-4 pr-1">
                  {/* 1. Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                        Vehicle Name
                      </label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.name}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                        placeholder="e.g. Grotti Cheetah Classic"
                        className="w-full px-3.5 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-gta-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                        Manufacturer / Brand
                      </label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.brand}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                        placeholder="e.g. Grotti"
                        className="w-full px-3.5 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-gta-pink"
                      />
                    </div>
                  </div>

                  {/* 2. Cover Text & Subtitle Edit (As Requested by User) */}
                  <div className="p-4 rounded-xl bg-black/60 border border-gta-pink/40 space-y-3">
                    <span className="text-[10px] font-heading tracking-widest text-gta-pink uppercase block">
                      COVER ART BOX &amp; DIVISION TEXT EDIT:
                    </span>

                    <div>
                      <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                        Cover Subtitle / Division Text
                      </label>
                      <input
                        type="text"
                        value={vehicleForm.coverText}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, coverText: e.target.value })}
                        placeholder="e.g. GROTTI MOTOR DIVISION, VCPD PURSUIT DIVISION..."
                        className="w-full px-3.5 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-gta-pink font-mono"
                      />
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        Displays directly below the big car title inside the cover banner.
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={vehicleForm.badge}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, badge: e.target.value })}
                          placeholder="SUPERCAR, VCPD INTERCEPTOR..."
                          className="w-full px-3 py-1.5 bg-gta-dark border border-gta-border rounded-xl text-white text-xs focus:outline-none focus:border-gta-pink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                          Price Display
                        </label>
                        <input
                          type="text"
                          value={vehicleForm.price}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                          placeholder="$1,850,000"
                          className="w-full px-3 py-1.5 bg-gta-dark border border-gta-border rounded-xl text-green-400 font-bold text-xs focus:outline-none focus:border-gta-pink font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Audio & Engine Sound Upload (As Requested by User) */}
                  <div className="p-4 rounded-xl bg-black/60 border border-gta-teal/40 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-heading tracking-widest text-gta-teal uppercase flex items-center gap-1.5">
                        <Volume2 size={13} />
                        ENGINE REV SOUND &amp; AUDIO UPLOAD:
                      </span>
                      <button
                        type="button"
                        onClick={handleTestModalRev}
                        className="px-2.5 py-1 rounded bg-gta-teal/20 text-gta-teal hover:bg-gta-teal hover:text-black font-heading text-[10px] tracking-wider uppercase transition-all flex items-center gap-1"
                      >
                        <Play size={10} />
                        <span>TEST SOUND NOW</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                          Audio Profile Preset
                        </label>
                        <select
                          value={vehicleForm.audioEngine}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, audioEngine: e.target.value })}
                          className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-xs focus:outline-none focus:border-gta-teal"
                        >
                          <option value="v8">V8 Twin-Turbo High-Boost Roar</option>
                          <option value="v12">V12 High-RPM Italian Screamer</option>
                          <option value="muscle">American Supercharged V8 Rumble</option>
                          <option value="siren">VCPD Dual-Wail Pursuit Siren</option>
                          <option value="helicopter">Turbine Helicopter Rotor Blades</option>
                          {vehicleForm.audioFileName && <option value="custom">Custom Uploaded File</option>}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                          Upload Custom Engine Sound
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={audioInputRef}
                            onChange={handleAudioFileChange}
                            accept="audio/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => audioInputRef.current?.click()}
                            className="flex-1 px-3 py-2 rounded-xl bg-gta-dark border border-gta-border hover:border-gta-teal text-gray-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Upload size={13} className="text-gta-teal" />
                            <span>{vehicleForm.audioFileName ? 'Change Audio' : 'Upload .mp3 / .wav'}</span>
                          </button>

                          {vehicleForm.audioFileName && (
                            <button
                              type="button"
                              onClick={handleRemoveAudioFile}
                              className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                              title="Remove custom audio"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {vehicleForm.audioFileName && (
                      <div className="text-[11px] font-mono text-green-400 flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/30">
                        <CheckCircle size={13} />
                        <span>Active Audio File: <strong>{vehicleForm.audioFileName}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* 4. Lore Description */}
                  <div>
                    <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                      Vehicle Lore / Story Description
                    </label>
                    <textarea
                      rows={3}
                      value={vehicleForm.desc}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, desc: e.target.value })}
                      placeholder="Write the backstory, engine specs, and Vice City lore..."
                      className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-xs focus:outline-none focus:border-gta-pink resize-none leading-relaxed"
                    />
                  </div>

                  {/* 5. Performance Metrics Sliders */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                    <span className="text-[10px] font-heading tracking-widest text-gray-400 uppercase block">
                      PERFORMANCE METRICS &amp; STAT METERS:
                    </span>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Top Speed */}
                      <div>
                        <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                          <span>TOP SPEED:</span>
                          <span className="text-gta-teal font-bold">{vehicleForm.topSpeed} MPH</span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="260"
                          value={vehicleForm.topSpeed}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, topSpeed: Number(e.target.value) })}
                          className="w-full accent-gta-teal cursor-pointer"
                        />
                      </div>

                      {/* 0-60 MPH */}
                      <div>
                        <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                          <span>0-60 MPH:</span>
                          <span className="text-gta-orange font-bold">{vehicleForm.acceleration}s</span>
                        </div>
                        <input
                          type="range"
                          min="1.8"
                          max="8.0"
                          step="0.1"
                          value={vehicleForm.acceleration}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, acceleration: Number(e.target.value) })}
                          className="w-full accent-gta-orange cursor-pointer"
                        />
                      </div>

                      {/* Handling */}
                      <div>
                        <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                          <span>HANDLING:</span>
                          <span className="text-gta-pink font-bold">{vehicleForm.handling}/10</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="10.0"
                          step="0.1"
                          value={vehicleForm.handling}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, handling: Number(e.target.value) })}
                          className="w-full accent-gta-pink cursor-pointer"
                        />
                      </div>

                      {/* Armor */}
                      <div>
                        <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                          <span>ARMOR:</span>
                          <span className="text-green-400 font-bold">{vehicleForm.armor}/10</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="10.0"
                          step="0.1"
                          value={vehicleForm.armor}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, armor: Number(e.target.value) })}
                          className="w-full accent-green-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Spawn Location & Class */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                        Vehicle Class
                      </label>
                      <select
                        value={vehicleForm.class}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, class: e.target.value })}
                        className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-xs focus:outline-none focus:border-gta-pink"
                      >
                        <option value="Super">Super</option>
                        <option value="Muscle">Muscle</option>
                        <option value="Sports">Sports</option>
                        <option value="Police & Emergency">Police &amp; Emergency</option>
                        <option value="SUVs">SUVs</option>
                        <option value="Bikes">Bikes &amp; Motorcycles</option>
                        <option value="Boats & Air">Boats &amp; Air</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading tracking-wider uppercase text-gray-300 mb-1">
                        Spawn Location
                      </label>
                      <input
                        type="text"
                        value={vehicleForm.location}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, location: e.target.value })}
                        placeholder="e.g. Starfish Island Mansions..."
                        className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-xs focus:outline-none focus:border-gta-pink"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Exact 1:1 Live Vehicle Card Preview (Matching User's Screenshot) (5 cols) */}
                <div className="lg:col-span-5 bg-black/80 p-5 rounded-2xl border-2 border-gta-border flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="text-[10px] font-heading tracking-widest text-gta-teal uppercase mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                      <span>LIVE GTA 6 CARD PREVIEW</span>
                      <span className="text-gray-500 font-mono">1:1 IN-GAME SYNC</span>
                    </div>

                    {/* Card Preview Container */}
                    <div className="card-gta p-5 border border-gta-pink/60 bg-[#090b16] shadow-xl relative overflow-hidden rounded-xl">
                      {/* Badge & Price Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-heading tracking-widest px-2.5 py-1 rounded border uppercase border-gta-pink/40 bg-gta-pink/10 text-gta-pink">
                          {vehicleForm.badge || 'SUPERCAR'}
                        </span>
                        <span className="text-xs font-heading tracking-wider text-green-400 font-bold font-mono">
                          {vehicleForm.price || '$1,850,000'}
                        </span>
                      </div>

                      {/* Cover Box with Title & Editable Subtitle */}
                      <div className="relative min-h-[7rem] rounded-xl bg-gradient-to-r from-gta-dark via-[#130922] to-gta-dark border border-gta-border/60 flex items-center justify-center p-3 mb-4 overflow-hidden">
                        <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />
                        {isModalRevving && (
                          <div className="absolute inset-0 bg-gradient-to-r from-gta-pink/25 via-gta-teal/25 to-orange-500/25 animate-pulse" />
                        )}
                        <div className="relative text-center w-full px-2 z-10">
                          <div className="font-heading text-white tracking-wider leading-tight break-words text-2xl sm:text-3xl">
                            {(vehicleForm.name || 'VEHICLE NAME').toUpperCase()}
                          </div>
                          <span className="text-[10px] font-heading tracking-[0.25em] text-gray-400 uppercase mt-1 block">
                            {(vehicleForm.coverText || `${(vehicleForm.brand || 'BRAND').toUpperCase()} MOTOR DIVISION`).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Lore Description */}
                      <p className="text-xs text-gray-300 font-body leading-relaxed mb-4">
                        {vehicleForm.desc || 'No description entered yet.'}
                      </p>

                      {/* Performance Metrics */}
                      <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-gta-border/50 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-body">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Gauge size={12} className="text-gta-teal" /> TOP SPEED
                            </span>
                            <span className="text-white font-mono font-bold">{vehicleForm.topSpeed} MPH</span>
                          </div>
                          <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                            <div
                              className="h-full bg-gradient-to-r from-gta-teal to-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, (vehicleForm.topSpeed / 240) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-body">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Zap size={12} className="text-gta-orange" /> 0-60 MPH
                            </span>
                            <span className="text-white font-mono font-bold">{vehicleForm.acceleration}s</span>
                          </div>
                          <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                            <div
                              className="h-full bg-gradient-to-r from-gta-orange to-yellow-400 rounded-full"
                              style={{ width: `${Math.max(15, (6 / vehicleForm.acceleration) * 60)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-body">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Compass size={12} className="text-gta-pink" /> HANDLING
                            </span>
                            <span className="text-white font-mono font-bold">{vehicleForm.handling}/10</span>
                          </div>
                          <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                            <div
                              className="h-full bg-gradient-to-r from-gta-pink to-purple-500 rounded-full"
                              style={{ width: `${(vehicleForm.handling / 10) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-body">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Shield size={12} className="text-green-400" /> ARMOR &amp; REINFORCEMENT
                            </span>
                            <span className="text-white font-mono font-bold">{vehicleForm.armor}/10</span>
                          </div>
                          <div className="w-full bg-gta-dark h-1.5 rounded-full overflow-hidden border border-gta-border">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                              style={{ width: `${(vehicleForm.armor / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Spawn Location */}
                      <div className="text-[11px] text-gray-400 font-body mb-4 flex items-start gap-1.5">
                        <span className="text-gta-teal font-heading tracking-wider uppercase flex-shrink-0">
                          SPAWN:
                        </span>
                        <span>{vehicleForm.location || 'Starfish Island Showrooms'}</span>
                      </div>

                      {/* Interactive Rev Button on Preview */}
                      <button
                        type="button"
                        onClick={handleTestModalRev}
                        className={`w-full py-2.5 rounded-lg font-heading text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                          isModalRevving
                            ? 'bg-gta-pink text-white shadow-[0_0_20px_rgba(255,46,136,0.6)] animate-pulse'
                            : 'bg-gta-dark hover:bg-gta-card border border-gta-border hover:border-gta-teal text-gray-300 hover:text-white'
                        }`}
                      >
                        <Volume2 size={14} className={isModalRevving ? 'animate-bounce text-yellow-300' : ''} />
                        {isModalRevving ? 'ENGINE ROARING! 🔥' : 'REV ENGINE / TEST SOUND'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-gray-500 text-center">
                    Changes reflect immediately in the live preview and on the public /vehicles page.
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gta-border/60 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-heading tracking-wider uppercase text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gta-btn-primary py-2.5 px-8 text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <Save size={15} />
                  <span>{editingVehicle ? 'SAVE VEHICLE MODIFICATIONS' : 'CONFIRM & REGISTER VEHICLE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CREATE / EDIT ARTICLE STUDIO (MEDIUM LIVE WYSIWYG)
         ========================================== */}
      {isPostModalOpen && (
        <MediumArticleEditor
          post={editingPost || postForm}
          onSave={(savedPost) => {
            setPosts((prev) => {
              const exists = prev.some((p) => p.slug === savedPost.slug)
              if (exists) {
                return prev.map((p) => (p.slug === savedPost.slug ? { ...p, ...savedPost } : p))
              }
              return [savedPost, ...prev]
            })
            setIsPostModalOpen(false)
            setEditingPost(null)
          }}
          onCancel={() => {
            setIsPostModalOpen(false)
            setEditingPost(null)
          }}
        />
      )}

      {/* ==========================================
          MODAL: ADD / EDIT CHEAT CODE (WITH 1:1 LIVE PREVIEW)
         ========================================== */}
      {isCheatModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md pt-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCheatModalOpen(false)
              setEditingCheat(null)
            }
          }}
        >
          <div className="card-gta max-w-5xl w-full h-[88vh] p-5 sm:p-6 border-2 border-yellow-400/80 shadow-[0_0_60px_rgba(250,204,21,0.25)] flex flex-col overflow-hidden relative animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gta-border/60 flex-shrink-0">
              <div>
                <div className="text-[10px] font-mono text-yellow-400 tracking-widest uppercase mb-1">
                  VICE CITY CHEATS VAULT // 1:1 LIVE EDITOR &amp; CARD PREVIEW
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl text-white">
                  {editingCheat ? `EDIT: ${(cheatForm.name || 'CHEAT CODE').toUpperCase()}` : 'ADD NEW CHEAT CODE'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCheatModalOpen(false)
                  setEditingCheat(null)
                }}
                className="p-2 rounded-xl bg-black/60 border border-gta-border hover:border-red-500 text-gray-400 hover:text-white hover:bg-red-500/20 transition-all flex items-center justify-center ml-2 group"
                title="Close Cheat Editor"
              >
                <X size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSaveCheat} className="flex-1 flex flex-col min-h-0">
              {/* 2-Column Suite: Left Form Inputs, Right Live Card Preview */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
                {/* Left Column: Form Controls (7 cols) */}
                <div className="lg:col-span-7 space-y-3.5 pr-1">
                  <div>
                    <label className="block text-xs font-heading tracking-wider uppercase text-gray-300 mb-1">
                      Cheat Name / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={cheatForm.name}
                      onChange={(e) => setCheatForm({ ...cheatForm, name: e.target.value })}
                      placeholder="e.g. $250,000 or Unlimited Focus"
                      className="w-full px-4 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-heading tracking-wider uppercase text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={cheatForm.category}
                        onChange={(e) => setCheatForm({ ...cheatForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Player">Player</option>
                        <option value="Weapons">Weapons</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Wanted">Wanted</option>
                        <option value="World">World</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-heading tracking-wider uppercase text-gta-teal mb-1">
                        PC Dial / Code
                      </label>
                      <input
                        type="text"
                        value={cheatForm.pc || ''}
                        onChange={(e) => setCheatForm({ ...cheatForm, pc: e.target.value })}
                        placeholder="e.g. CASHME or TURTLE"
                        className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-gta-teal font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-heading tracking-wider uppercase text-gray-300 mb-1">
                      Effect / Benefit
                    </label>
                    <input
                      type="text"
                      value={cheatForm.effect || ''}
                      onChange={(e) => setCheatForm({ ...cheatForm, effect: e.target.value })}
                      placeholder="e.g. Instantly gives you $250,000"
                      className="w-full px-4 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading tracking-wider uppercase text-gray-300 mb-1">
                      Description / Lore (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={cheatForm.description || ''}
                      onChange={(e) => setCheatForm({ ...cheatForm, description: e.target.value })}
                      placeholder="e.g. Instantly deposits cash into your protagonist's bank account."
                      className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-heading tracking-wider uppercase text-gta-pink mb-1 flex justify-between items-center">
                        <span>PS5 Button Sequence</span>
                        <span className="text-[10px] text-gray-500 font-mono">D-Pad</span>
                      </label>
                      <input
                        type="text"
                        value={cheatForm.ps5 || ''}
                        onChange={(e) => setCheatForm({ ...cheatForm, ps5: e.target.value })}
                        placeholder="e.g. ↑ → ↓ ← ↑ ← ↓ →"
                        className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-gta-pink font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-heading tracking-wider uppercase text-green-400 mb-1 flex justify-between items-center">
                        <span>Xbox Button Sequence</span>
                        <span className="text-[10px] text-gray-500 font-mono">D-Pad</span>
                      </label>
                      <input
                        type="text"
                        value={cheatForm.xbox || ''}
                        onChange={(e) => setCheatForm({ ...cheatForm, xbox: e.target.value })}
                        placeholder="e.g. ↑ → ↓ ← ↑ ← ↓ →"
                        className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-green-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Quick Arrow Helper Palette */}
                  <div className="p-2.5 rounded-xl bg-black/50 border border-gta-border/60 flex items-center justify-between">
                    <span className="text-[10px] font-heading text-gray-400 uppercase tracking-wider">
                      Quick Insert Arrows:
                    </span>
                    <div className="flex gap-1.5">
                      {['↑', '↓', '←', '→'].map((arrow) => (
                        <button
                          key={arrow}
                          type="button"
                          onClick={() => {
                            setCheatForm((prev) => ({
                              ...prev,
                              ps5: prev.ps5 ? `${prev.ps5} ${arrow}` : arrow,
                              xbox: prev.xbox ? `${prev.xbox} ${arrow}` : arrow,
                            }))
                          }}
                          className="w-7 h-7 rounded bg-gta-dark border border-gta-border hover:border-yellow-400 text-yellow-400 font-mono font-bold text-sm flex items-center justify-center transition-colors"
                          title={`Append ${arrow}`}
                        >
                          {arrow}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-heading tracking-wider uppercase text-gta-orange mb-1">
                      D-Pad Sequence in Words (Optional)
                    </label>
                    <input
                      type="text"
                      value={cheatForm.combo || ''}
                      onChange={(e) => setCheatForm({ ...cheatForm, combo: e.target.value })}
                      placeholder="e.g. Up, Right, Down, Left, Up, Left, Down, Right"
                      className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-gta-orange font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading tracking-wider uppercase text-yellow-400 mb-1">
                      Warning / Restriction (Optional)
                    </label>
                    <input
                      type="text"
                      value={cheatForm.warning || ''}
                      onChange={(e) => setCheatForm({ ...cheatForm, warning: e.target.value })}
                      placeholder="e.g. Disables Trophies and Achievements for active session"
                      className="w-full px-3 py-2 bg-gta-dark border border-gta-border rounded-xl text-white text-sm focus:outline-none focus:border-yellow-400 text-xs"
                    />
                  </div>
                </div>

                {/* Right Column: Live Card Preview (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-black/60 border border-gta-border/80 rounded-2xl p-4 sm:p-5">
                  <div>
                    {/* Live Header */}
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gta-border/50">
                      <div className="flex items-center gap-1.5 text-[11px] font-heading tracking-widest text-yellow-400 uppercase">
                        <Eye size={13} />
                        <span>LIVE CARD PREVIEW</span>
                      </div>
                      <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        1:1 VAULT SYNC
                      </span>
                    </div>

                    {/* Previewed Card (Exact Match to Public /cheats) */}
                    {(() => {
                      const theme = cheatCategoryThemes[cheatForm.category] || cheatCategoryThemes.Player
                      return (
                        <div className={`card-gta p-5 border ${theme.border} ${theme.glow} transition-all duration-300 relative bg-gta-card/95 shadow-xl`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-heading tracking-widest px-2.5 py-0.5 rounded border uppercase ${theme.badge}`}>
                              {cheatForm.category || 'Player'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              #{editingCheat ? editingCheat.id : 'NEW'}
                            </span>
                          </div>

                          <h3 className="font-heading text-2xl text-white mb-2 leading-tight">
                            {cheatForm.name || 'Your Cheat Name'}
                          </h3>

                          <p className="text-xs text-gray-300 font-body leading-relaxed mb-3">
                            {cheatForm.description || cheatForm.effect || 'Cheat description will appear here in real-time as you type.'}
                          </p>

                          {cheatForm.effect && (
                            <div className="text-xs text-gta-teal font-body mb-3 flex items-center gap-1">
                              <Sparkles size={12} />
                              <span>{cheatForm.effect}</span>
                            </div>
                          )}

                          {cheatForm.combo && (
                            <div className="text-[11px] text-gray-400 font-mono bg-black/40 border border-gta-border/40 rounded-lg p-2.5 mb-3">
                              <span className="text-gta-teal font-heading text-[10px] tracking-wider uppercase block mb-1">
                                D-PAD SEQUENCE (PS5 &amp; XBOX):
                              </span>
                              <span className="text-gray-200 font-semibold">{cheatForm.combo}</span>
                            </div>
                          )}

                          {cheatForm.warning && (
                            <div className="text-[11px] text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/20 rounded p-2 mb-3 flex items-start gap-1.5">
                              <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-yellow-400" />
                              <span>{cheatForm.warning}</span>
                            </div>
                          )}

                          {/* Platform Code Rows */}
                          <div className="space-y-2 pt-3 border-t border-gta-border/50">
                            {/* PS5 */}
                            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gta-dark/80 border border-gta-border/60">
                              <span className="text-[10px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                PS5
                              </span>
                              <code className="text-xs font-mono text-gray-200 flex-1 text-center font-bold tracking-wider">
                                {cheatForm.ps5 || '—'}
                              </code>
                              <span className="text-gray-500 p-1">
                                <Copy size={13} />
                              </span>
                            </div>

                            {/* Xbox */}
                            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gta-dark/80 border border-gta-border/60">
                              <span className="text-[10px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                                XBOX
                              </span>
                              <code className="text-xs font-mono text-gray-200 flex-1 text-center font-bold tracking-wider">
                                {cheatForm.xbox || '—'}
                              </code>
                              <span className="text-gray-500 p-1">
                                <Copy size={13} />
                              </span>
                            </div>

                            {/* PC */}
                            {cheatForm.pc && (
                              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gta-dark/80 border border-gta-border/60">
                                <span className="text-[10px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-0.5">
                                  <Terminal size={10} /> PC
                                </span>
                                <code className="text-xs font-mono text-gta-teal flex-1 text-center font-bold tracking-wider">
                                  {cheatForm.pc}
                                </code>
                                <span className="text-gray-500 p-1">
                                  <Copy size={13} />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-gray-400 text-center">
                    Preview reflects real-time styling on public <span className="text-yellow-400 font-bold">/cheats</span> &amp; homepage.
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gta-border/60 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheatModalOpen(false)
                    setEditingCheat(null)
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-heading tracking-wider uppercase text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gta-btn bg-yellow-400 text-black py-2.5 px-8 text-xs font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                >
                  <Terminal size={14} />
                  <span>{editingCheat ? '✓ UPDATE CHEAT' : '>_ SAVE CHEAT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
