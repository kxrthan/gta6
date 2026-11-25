'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
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
  Layers,
  MapPin,
  Search,
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

// Authentic Web Audio synthesizer for GTA GPS / radar cues
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
      // Two-tone high-tech GTA waypoint confirmation chime
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
    } else if (type === 'clear') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, now)
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.12)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.12)
    }
  } catch (e) {
    // AudioContext blocked until user interaction
  }
}

// Authentic Leonida Counties & Districts
export const LEONIDA_COUNTIES = [
  {
    id: 'all',
    name: 'All Leonida State',
    desc: 'The complete archipelago & mainland state of Leonida including Vice City metro and the southern keys.',
    camera: { x: 0, y: 19, z: 14, lookX: 0, lookY: 0, lookZ: 0 },
  },
  {
    id: 'vice-dale',
    name: 'Vice Dale County',
    tag: 'METROPOLITAN CORE',
    desc: 'Vice City metropolis, Downtown skyscrapers, Vice City International Airport, and Ocean Beach neon strip.',
    camera: { x: 3.5, y: 9.5, z: 2.2, lookX: 3.2, lookY: 0, lookZ: 0.8 },
  },
  {
    id: 'mariana',
    name: 'Mariana County',
    tag: 'PORT GELLHORN',
    desc: 'Port Gellhorn deepwater shipping docks, coastal refineries, illegal chop shops, and drag raceways.',
    camera: { x: -2.8, y: 10, z: 5.5, lookX: -2.6, lookY: 0, lookZ: 4.8 },
  },
  {
    id: 'gator-keys',
    name: 'Gator Keys',
    tag: 'SOUTHERN KEYS',
    desc: 'Sun-drenched overseas highway bridges, coral reefs, Key Zancudo naval station, and tropical hideaways.',
    camera: { x: -0.5, y: 8.5, z: 9.8, lookX: -0.8, lookY: 0, lookZ: 8.5 },
  },
  {
    id: 'leonida-central',
    name: 'Leonida Wetlands',
    tag: 'GRASSRIVERS SWAMP',
    desc: 'Sprawling treacherous Everglades with alligator bayous, clandestine dirt airfields, and fan-powered airboats.',
    camera: { x: -0.5, y: 11, z: 1.5, lookX: -0.2, lookY: 0, lookZ: 0.0 },
  },
  {
    id: 'leonard',
    name: 'Leonard County',
    tag: 'LAKE LEONIDA',
    desc: 'Massive freshwater Lake Leonida, Ambrosia agro-industrial refineries, and eastern ocean barrier dunes.',
    camera: { x: 3.2, y: 10.5, z: -4.5, lookX: 2.8, lookY: 0, lookZ: -5.0 },
  },
  {
    id: 'lummox',
    name: 'Lummox County',
    tag: 'NORTHERN PEAKS',
    desc: 'Mountain ranges, hydroelectric mega-dam, twisting ridge passes, and rocky northern ocean coves.',
    camera: { x: 0.2, y: 10, z: -9.5, lookX: 0.0, lookY: 0, lookZ: -8.8 },
  },
  {
    id: 'kelly',
    name: 'Kelly County',
    tag: 'WESTERN RIDGES',
    desc: 'Rolling farmsteads, heavy limestone aggregate quarries, dirt speedways, and secluded trailer compounds.',
    camera: { x: -3.6, y: 10.5, z: -4.0, lookX: -3.2, lookY: 0, lookZ: -3.8 },
  },
]

// Authentic Map Blips strictly positioned on the Leonida map image (X & Y normalized in percentage 0-100)
export const LEONIDA_MAP_BLIPS = [
  // --- VICE DALE COUNTY ---
  {
    id: 'vcpd-hq',
    name: 'VCPD Central Headquarters',
    county: 'Vice Dale County',
    district: 'Downtown Vice City',
    type: 'police',
    x: 70.5,
    y: 53.5,
    threat: 'Extreme (4-Star SWAT)',
    desc: 'Central command precinct for the Vice City Police Department with armory, tactical Enforcer APCs, and rooftop SWAT helipad.',
    features: ['VCPD Buffalo EVX', 'SWAT Riot APCs', 'Helipad'],
  },
  {
    id: 'ocean-view',
    name: 'Ocean View Safehouse',
    county: 'Vice Dale County',
    district: 'Vice Beach / Ocean Drive',
    type: 'safehouse',
    x: 82.5,
    y: 53.0,
    threat: 'Safe Zone (Low)',
    desc: 'Lucia & Jason’s iconic pastel oceanfront safehouse with underground garage, wardrobe customizer, and contraband stash.',
    features: ['Wardrobe Fitting', 'Vehicle Garage', 'Weapons Cache'],
  },
  {
    id: 'vc-airport',
    name: 'Vice City International Airport (MIA)',
    county: 'Vice Dale County',
    district: 'Airport Metro Sector',
    type: 'airport',
    x: 61.0,
    y: 57.5,
    threat: 'Restricted Airspace (3-Star)',
    desc: 'Massive international air hub featuring dual intersecting runways, private jet hangars, cargo terminals, and security checkpoints.',
    features: ['Private Jet Hangars', 'Dual Runways', 'Helicopter Pads'],
  },
  {
    id: 'starfish-imports',
    name: 'Starfish Island Luxury Dealership',
    county: 'Vice Dale County',
    district: 'Starfish Island',
    type: 'dealership',
    x: 75.0,
    y: 53.5,
    threat: 'Private Security',
    desc: 'Gated billionaire showroom importing exotic Grotti, Pegassi, and Pfister hypercars. Guarded by heavily armed PMC mercenaries.',
    features: ['Grotti Cheetah', 'Pegassi Torero', 'Pfister Comet'],
  },
  {
    id: 'bank-heist',
    name: 'First National Bank of Vice City',
    county: 'Vice Dale County',
    district: 'Downtown Financial Sector',
    type: 'heist',
    x: 69.0,
    y: 50.8,
    threat: 'High (3-Star Response)',
    desc: 'Subterranean fortified bank vault holding over $50,000,000 in bullion and syndicate bearer bonds.',
    features: ['Vault Penetration', 'Subterranean Escape Tunnel'],
  },
  {
    id: 'malibu-club',
    name: 'The Malibu Nightclub',
    county: 'Vice Dale County',
    district: 'Vice Beach',
    type: 'heist',
    x: 83.5,
    y: 55.5,
    threat: 'Syndicate VIP',
    desc: 'Vice City’s premier neon dance venue. Front for high-stakes cartel money laundering and underworld contacts.',
    features: ['VIP Syndicate Lounge', 'Underworld Fence'],
  },
  {
    id: 'port-vice-city',
    name: 'Port of Vice City Cargo Docks',
    county: 'Vice Dale County',
    district: 'Industrial Bay',
    type: 'garage',
    x: 77.0,
    y: 61.0,
    threat: 'Cartel Security',
    desc: 'Sprawling shipping crane terminal handling container freight. Secret maritime contraband export channels.',
    features: ['Speedboat Berths', 'Container Crates', 'Forklifts'],
  },

  // --- MARIANA COUNTY (Port Gellhorn) ---
  {
    id: 'port-gellhorn-chop',
    name: 'Port Gellhorn Freight Chop Shop',
    county: 'Mariana County',
    district: 'Port Gellhorn Harbor',
    type: 'garage',
    x: 37.5,
    y: 72.0,
    threat: 'Cartel Run (3-Star)',
    desc: 'Underground vehicle modifications, respray bays, VIN etching, and police wanted heat cooldown workshop.',
    features: ['Armor Plating', 'Respray Bay', 'Police Scanner'],
  },
  {
    id: 'port-gellhorn-speedway',
    name: 'Mariana County Speedway & Drag Strip',
    county: 'Mariana County',
    district: 'Port Gellhorn Suburbs',
    type: 'dealership',
    x: 43.0,
    y: 69.0,
    threat: 'Moderate',
    desc: 'Asphalt drag strip and circle track where muscle car syndicates wager pink slips on illegal high-speed sprints.',
    features: ['Muscle Car Drag Racing', 'Nitrous Tuning'],
  },
  {
    id: 'south-swamp-hideout',
    name: 'Mariana Bay Smuggler Stilt Shacks',
    county: 'Mariana County',
    district: 'South Coastal Wetlands',
    type: 'safehouse',
    x: 46.0,
    y: 78.5,
    threat: 'Wilderness Hazard',
    desc: 'Secluded wooden stilt cabins built over shallow coastal waters. Docking for fan-powered airboats and jet skis.',
    features: ['Airboat Dock', 'Ammo Stash', 'Camouflage Hideout'],
  },

  // --- GATOR KEYS ---
  {
    id: 'keys-overseas-highway',
    name: 'Overseas Highway Seven-Mile Bridge',
    county: 'Gator Keys',
    district: 'Upper Keys',
    type: 'police',
    x: 62.0,
    y: 84.5,
    threat: 'State Patrol Radar',
    desc: 'Elevated highway spanning open ocean between Leonida mainland and the keys. High-speed highway patrol traps.',
    features: ['Highway Interception', 'Ocean Jump Points'],
  },
  {
    id: 'keys-naval-airbase',
    name: 'Key Zancudo Naval Air Station',
    county: 'Gator Keys',
    district: 'Lower Keys Island',
    type: 'airport',
    x: 26.0,
    y: 92.5,
    threat: 'Maximum Military (5-Star)',
    desc: 'Heavily defended military naval airbase on the southwestern key. Fighter jets, attack choppers, and SAM missile turrets.',
    features: ['P-996 Lazer Fighter', 'Attack Chopper', 'Military Armory'],
  },
  {
    id: 'keys-safehouse',
    name: 'Gator Keys Beach Bungalow Safehouse',
    county: 'Gator Keys',
    district: 'Sugarloaf Key',
    type: 'safehouse',
    x: 43.5,
    y: 95.0,
    threat: 'Low (Safe Zone)',
    desc: 'Peaceful beachfront retreat surrounded by turquoise waters. Private dock with Torpedo high-speed offshore powerboat.',
    features: ['Powerboat Slip', 'Off-Grid Radio', 'Weapon Stash'],
  },

  // --- LEONIDA WETLANDS (Everglades) ---
  {
    id: 'everglades-airfield',
    name: 'Grassrivers Smuggler Dirt Airfield',
    county: 'Leonida Wetlands',
    district: 'The Everglades (Grassrivers)',
    type: 'airport',
    x: 47.5,
    y: 49.0,
    threat: 'Extreme Wilderness',
    desc: 'Unregistered dirt airstrip nestled in dense swampland. Used by cartel pilots to fly sea planes and illicit payloads.',
    features: ['Dodo Sea Plane', 'Fuel Tanks', 'Radio Tower'],
  },
  {
    id: 'everglades-airboat-dock',
    name: 'Caiman Creek Airboat Tours & Bait Shop',
    county: 'Leonida Wetlands',
    district: 'Alligator Bayous',
    type: 'garage',
    x: 39.5,
    y: 51.5,
    threat: 'Predatory Alligators',
    desc: 'Rustic swamp outpost with high-powered airboats capable of skimming through tall sawgrass and mudflats.',
    features: ['High-Velocity Airboats', 'Hunting Rifles'],
  },

  // --- KELLY COUNTY ---
  {
    id: 'kelly-quarry',
    name: 'Kelly County Aggregate Quarry',
    county: 'Kelly County',
    district: 'Western Ridges',
    type: 'weapons',
    x: 33.0,
    y: 38.0,
    threat: 'Armed Miners & Guards',
    desc: 'Deep multi-tiered limestone quarry with heavy excavation dump trucks and explosive demolition supply depots.',
    features: ['Commercial Explosives', 'Heavy Dump Trucks'],
  },
  {
    id: 'kelly-speedway',
    name: 'Kelly Dirt Track Speedway',
    county: 'Kelly County',
    district: 'Kelly Farmlands',
    type: 'dealership',
    x: 36.0,
    y: 28.5,
    threat: 'Low',
    desc: 'Red dirt oval track hosting weekend demolition derbies, monster trucks, and customized off-road buggies.',
    features: ['Sandking XL Offroader', 'Bifta Dune Buggy'],
  },

  // --- LEONARD COUNTY (Lake Leonida) ---
  {
    id: 'lake-leonida-marina',
    name: 'Lake Leonida Deepwater Marina',
    county: 'Leonard County',
    district: 'Lake Leonida',
    type: 'safehouse',
    x: 67.0,
    y: 28.0,
    threat: 'Low',
    desc: 'Scenic freshwater marina on the southern shore of Lake Leonida. Jet ski rentals, lakeside cabins, and fishing piers.',
    features: ['Seashark Jet Skis', 'Fishing Gear', 'Safe Cabin'],
  },
  {
    id: 'ambrosia-sugar-depot',
    name: 'Ambrosia Industrial Sugar Refinery',
    county: 'Leonard County',
    district: 'Ambrosia Plains',
    type: 'heist',
    x: 60.5,
    y: 35.0,
    threat: 'Armed Syndicate',
    desc: 'Sprawling agricultural agro-refinery complex concealing an offshore syndicate cash counting operation.',
    features: ['Heist Target', 'Freight Trains', 'Distribution Network'],
  },
  {
    id: 'leonard-ammunation',
    name: 'Leonard County Gun Emporium',
    county: 'Leonard County',
    district: 'East Coastal Highway',
    type: 'weapons',
    x: 82.0,
    y: 26.0,
    threat: 'Armed Personnel',
    desc: 'Major regional Ammu-Nation with 100-yard outdoor rifle range, tactical optics, and ballistic armor vest fittings.',
    features: ['Sniper Rifles', 'Heavy Armor', 'Shooting Range'],
  },

  // --- LUMMOX COUNTY (North) ---
  {
    id: 'lummox-hydro-dam',
    name: 'Lummox County Hydroelectric Dam',
    county: 'Lummox County',
    district: 'Lummox Peaks',
    type: 'heist',
    x: 52.0,
    y: 11.5,
    threat: 'Federal Security (3-Star)',
    desc: 'Monumental concrete hydroelectric dam regulating northern river flows. Generates power for the entire state.',
    features: ['Substation Heist', 'High-Altitude Viewpoint', 'Observation Deck'],
  },
  {
    id: 'lummox-smuggler-cove',
    name: 'North Ocean Smuggler Cove',
    county: 'Lummox County',
    district: 'Lummox Coastline',
    type: 'safehouse',
    x: 41.0,
    y: 14.5,
    threat: 'Remote Wilderness',
    desc: 'Hidden rocky cove with sea cave entrance. Secret refueling depot for illegal offshore cargo vessels.',
    features: ['Submersible Docks', 'Smuggler Cache'],
  },
]

export const BLIP_FILTERS = [
  { id: 'all', label: 'All Markers', icon: Compass, color: 'text-white' },
  { id: 'police', label: 'VCPD Police', icon: Siren, color: 'text-blue-400' },
  { id: 'safehouse', label: 'Safehouses', icon: Shield, color: 'text-green-400' },
  { id: 'heist', label: 'Heists & Banks', icon: DollarSign, color: 'text-yellow-400' },
  { id: 'dealership', label: 'Dealerships', icon: Car, color: 'text-gta-pink' },
  { id: 'airport', label: 'Airports & Jets', icon: Plane, color: 'text-gta-teal' },
  { id: 'weapons', label: 'Ammu-Nation', icon: Target, color: 'text-red-400' },
  { id: 'garage', label: 'Chop Shops', icon: Wrench, color: 'text-gta-orange' },
]

export default function Gta3DMapViewer({
  initialBlipId = null,
  onBlipSelect = null,
  height = '620px',
  isModal = false,
}) {
  const mountRef = useRef(null)
  const threeRef = useRef({})
  const { addToast } = useToast()

  // State
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCounty, setSelectedCounty] = useState('all')
  const [activeBlip, setActiveBlip] = useState(LEONIDA_MAP_BLIPS[0])
  const [waypoint, setWaypoint] = useState(null)
  const [viewMode, setViewMode] = useState('3d') // '3d' | 'topdown'
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [projectedBlips, setProjectedBlips] = useState([])
  const [telemetry, setTelemetry] = useState({
    coords: '25.7617° N, 80.1918° W',
    elevation: '12m',
    speed: '0 MPH',
    weather: 'VICE CITY NEON SUNSET · 84°F',
  })

  // Player position: Lucia & Jason near Ocean View Safehouse (Vice Beach)
  const playerPosition = { x: 82.5, y: 53.0 }

  // Set initial blip
  useEffect(() => {
    if (initialBlipId) {
      const match = LEONIDA_MAP_BLIPS.find((b) => b.id === initialBlipId)
      if (match) setActiveBlip(match)
    }
  }, [initialBlipId])

  // Map world bounds in Three.js units
  // Map texture aspect ratio: 473x648 -> Width 15, Height 20.55
  const MAP_WIDTH = 15
  const MAP_HEIGHT = 20.55

  // Helper to convert normalized 0-100% coords to Three.js world space (X, Z) on plane
  const toWorldCoords = useCallback((percentX, percentY) => {
    const wx = (percentX / 100 - 0.5) * MAP_WIDTH
    const wz = (percentY / 100 - 0.5) * MAP_HEIGHT
    return { x: wx, z: wz }
  }, [MAP_WIDTH, MAP_HEIGHT])

  // --- THREE.JS INITIALIZATION ---
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    // 1. Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060814)
    scene.fog = new THREE.FogExp2(0x060814, 0.022)

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150)
    camera.position.set(0, 19, 14)
    camera.lookAt(0, 0, 0)

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x7090b0, 1.8)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 2.5)
    sunLight.position.set(12, 22, 10)
    scene.add(sunLight)

    // Vice City Synthwave Rim Lights
    const pinkRim = new THREE.PointLight(0xff2e88, 3.5, 35)
    pinkRim.position.set(10, 8, 4)
    scene.add(pinkRim)

    const tealRim = new THREE.PointLight(0x00e5ff, 3.2, 35)
    tealRim.position.set(-10, 8, -4)
    scene.add(tealRim)

    // 5. Leonida Map Textured Plane Geometry
    const textureLoader = new THREE.TextureLoader()
    const mapTexture = textureLoader.load('/images/gta6-leonida-map.jpg')
    mapTexture.wrapS = THREE.ClampToEdgeWrapping
    mapTexture.wrapT = THREE.ClampToEdgeWrapping
    mapTexture.generateMipmaps = true
    mapTexture.minFilter = THREE.LinearMipmapLinearFilter

    const planeGeo = new THREE.PlaneGeometry(MAP_WIDTH, MAP_HEIGHT, 64, 64)
    const planeMat = new THREE.MeshStandardMaterial({
      map: mapTexture,
      roughness: 0.65,
      metalness: 0.15,
      bumpScale: 0.08,
    })

    const mapPlane = new THREE.Mesh(planeGeo, planeMat)
    mapPlane.rotation.x = -Math.PI / 2
    mapPlane.receiveShadow = true
    scene.add(mapPlane)

    // 6. Holographic Outer Radar Edge Border & Grid
    const edgeGeo = new THREE.RingGeometry(13.5, 14.0, 64)
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
    const edgeRing = new THREE.Mesh(edgeGeo, edgeMat)
    edgeRing.rotation.x = -Math.PI / 2
    edgeRing.position.y = -0.05
    scene.add(edgeRing)

    // Glowing coordinate ground grid
    const gridHelper = new THREE.GridHelper(28, 28, 0x00e5ff, 0x1a264a)
    gridHelper.position.y = -0.08
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0.28
    scene.add(gridHelper)

    // 7. Dynamic Waypoint 3D Light Pillar & Pulsing Wave Rings
    const waypointGroup = new THREE.Group()
    waypointGroup.visible = false
    scene.add(waypointGroup)

    // Vertical neon beam
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.35, 14, 16)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xff2e88,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const beam = new THREE.Mesh(beamGeo, beamMat)
    beam.position.y = 7
    waypointGroup.add(beam)

    // Top Spinning Diamond
    const diamondGeo = new THREE.OctahedronGeometry(0.35, 0)
    const diamondMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    })
    const diamond = new THREE.Mesh(diamondGeo, diamondMat)
    diamond.position.y = 14
    waypointGroup.add(diamond)

    // Pulsing ground wave rings
    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff2e88,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    })
    const waypointRing = new THREE.Mesh(ringGeo, ringMat)
    waypointRing.rotation.x = -Math.PI / 2
    waypointRing.position.y = 0.08
    waypointGroup.add(waypointRing)

    // 8. Player GPS Marker in 3D Space
    const playerGroup = new THREE.Group()
    const pCoords = toWorldCoords(playerPosition.x, playerPosition.y)
    playerGroup.position.set(pCoords.x, 0.12, pCoords.z)

    const playerRingGeo = new THREE.RingGeometry(0.2, 0.32, 24)
    const playerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
    const playerRing = new THREE.Mesh(playerRingGeo, playerRingMat)
    playerRing.rotation.x = -Math.PI / 2
    playerGroup.add(playerRing)

    const playerConeGeo = new THREE.ConeGeometry(0.18, 0.42, 3)
    const playerConeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    const playerCone = new THREE.Mesh(playerConeGeo, playerConeMat)
    playerCone.rotation.x = Math.PI / 2
    playerCone.rotation.z = Math.PI * 0.75
    playerCone.position.y = 0.1
    playerGroup.add(playerCone)
    scene.add(playerGroup)

    // Store references
    threeRef.current = {
      scene,
      camera,
      renderer,
      waypointGroup,
      waypointRing,
      diamond,
      playerGroup,
      playerRing,
      container,
      targetPos: new THREE.Vector3(0, 19, 14),
      targetLook: new THREE.Vector3(0, 0, 0),
      isDragging: false,
      prevMouse: { x: 0, y: 0 },
      rotX: 0,
      rotY: 0,
    }

    // --- INTERACTIVE MOUSE / ORBIT CONTROLS ---
    let isMouseDown = false
    let startX = 0
    let startY = 0

    const onMouseDown = (e) => {
      isMouseDown = true
      startX = e.clientX
      startY = e.clientY
    }

    const onMouseMove = (e) => {
      if (!isMouseDown) return
      const deltaX = (e.clientX - startX) * 0.005
      const deltaY = (e.clientY - startY) * 0.005
      startX = e.clientX
      startY = e.clientY

      // Orbit camera around current lookAt point
      const cam = camera
      const look = threeRef.current.targetLook || new THREE.Vector3(0, 0, 0)
      const offset = cam.position.clone().sub(look)

      // Horizontal orbit
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX)

      // Vertical tilt (clamp to avoid flipping underneath)
      const curTilt = Math.atan2(offset.y, Math.sqrt(offset.x * offset.x + offset.z * offset.z))
      const newTilt = Math.max(0.3, Math.min(Math.PI / 2 - 0.05, curTilt + deltaY))
      const radius = offset.length()
      const horizRadius = radius * Math.cos(newTilt)
      const angleH = Math.atan2(offset.x, offset.z)

      offset.x = horizRadius * Math.sin(angleH)
      offset.z = horizRadius * Math.cos(angleH)
      offset.y = radius * Math.sin(newTilt)

      cam.position.copy(look).add(offset)
      cam.lookAt(look)
    }

    const onMouseUp = () => {
      isMouseDown = false
    }

    const onWheel = (e) => {
      e.preventDefault()
      const cam = camera
      const look = threeRef.current.targetLook || new THREE.Vector3(0, 0, 0)
      const dir = cam.position.clone().sub(look)
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92
      const newLen = Math.max(5, Math.min(38, dir.length() * zoomFactor))
      dir.setLength(newLen)
      cam.position.copy(look).add(dir)
      cam.lookAt(look)
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('wheel', onWheel, { passive: false })

    // --- ANIMATION LOOP ---
    let frameId
    let clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth camera interpolation toward target position/lookAt
      if (threeRef.current.targetPos && !isMouseDown) {
        camera.position.lerp(threeRef.current.targetPos, 0.045)
        const currentLook = new THREE.Vector3()
        camera.getWorldDirection(currentLook)
        camera.lookAt(threeRef.current.targetLook)
      }

      // Animate Waypoint Light Pillar & Diamond
      if (waypointGroup.visible) {
        diamond.rotation.y = elapsedTime * 2.5
        const pulse = 1 + Math.sin(elapsedTime * 6) * 0.25
        waypointRing.scale.set(pulse, pulse, 1)
      }

      // Animate Player GPS Ring Pulse
      const pPulse = 1 + Math.sin(elapsedTime * 4) * 0.2
      playerRing.scale.set(pPulse, pPulse, 1)

      renderer.render(scene, camera)

      // Project 3D World Blips to 2D Container Screen Coordinates
      const blipScreenCoords = []
      const halfW = width / 2
      const halfH = height / 2

      LEONIDA_MAP_BLIPS.forEach((blip) => {
        const wCoord = toWorldCoords(blip.x, blip.y)
        const vec = new THREE.Vector3(wCoord.x, 0.2, wCoord.z)
        vec.project(camera)

        // Only show if in front of camera
        if (vec.z < 1) {
          const sx = (vec.x * halfW) + halfW
          const sy = -(vec.y * halfH) + halfH
          blipScreenCoords.push({
            id: blip.id,
            screenX: sx,
            screenY: sy,
            visible: sx >= -20 && sx <= width + 20 && sy >= -20 && sy <= height + 20,
          })
        }
      })
      setProjectedBlips(blipScreenCoords)
    }

    animate()

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('wheel', onWheel)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [toWorldCoords, playerPosition.x, playerPosition.y])

  // --- CAMERA PRESET ACTIONS ---
  const applyCameraPreset = (camSettings) => {
    if (!threeRef.current.camera) return
    threeRef.current.targetPos = new THREE.Vector3(camSettings.x, camSettings.y, camSettings.z)
    threeRef.current.targetLook = new THREE.Vector3(camSettings.lookX, camSettings.lookY, camSettings.lookZ)
  }

  // Toggle 3D / Top-Down View
  const toggleViewMode = () => {
    if (viewMode === '3d') {
      setViewMode('topdown')
      applyCameraPreset({ x: 0, y: 22, z: 0.1, lookX: 0, lookY: 0, lookZ: 0 })
      if (soundEnabled) playGtaSound('blip')
      addToast('GPS TOP-DOWN 2D SATELLITE MODE ENGAGED', 'info', 2000)
    } else {
      setViewMode('3d')
      applyCameraPreset({ x: 0, y: 19, z: 14, lookX: 0, lookY: 0, lookZ: 0 })
      if (soundEnabled) playGtaSound('blip')
      addToast('3D TACTICAL RECON MODE ENGAGED', 'cheat', 2000)
    }
  }

  // Zoom Helpers
  const handleZoomIn = () => {
    if (!threeRef.current.camera) return
    const cam = threeRef.current.camera
    const look = threeRef.current.targetLook || new THREE.Vector3(0, 0, 0)
    const dir = cam.position.clone().sub(look).multiplyScalar(0.75)
    threeRef.current.targetPos = look.clone().add(dir)
    if (soundEnabled) playGtaSound('blip')
  }

  const handleZoomOut = () => {
    if (!threeRef.current.camera) return
    const cam = threeRef.current.camera
    const look = threeRef.current.targetLook || new THREE.Vector3(0, 0, 0)
    const dir = cam.position.clone().sub(look).multiplyScalar(1.3)
    threeRef.current.targetPos = look.clone().add(dir)
    if (soundEnabled) playGtaSound('blip')
  }

  const handleResetCamera = () => {
    setSelectedCounty('all')
    applyCameraPreset(LEONIDA_COUNTIES[0].camera)
    if (soundEnabled) playGtaSound('blip')
    addToast('Camera reset to Full Leonida Overview', 'info', 1500)
  }

  // County Selection
  const handleSelectCounty = (countyId) => {
    setSelectedCounty(countyId)
    const county = LEONIDA_COUNTIES.find((c) => c.id === countyId)
    if (county) {
      applyCameraPreset(county.camera)
      if (soundEnabled) playGtaSound('blip')
      setTelemetry((prev) => ({
        ...prev,
        elevation: countyId === 'lummox' ? '1,420m' : countyId === 'vice-dale' ? '8m' : '45m',
      }))
    }
  }

  // Blip Selection & Waypoint
  const handleBlipClick = (blip) => {
    setActiveBlip(blip)
    if (onBlipSelect) onBlipSelect(blip)
    if (soundEnabled) playGtaSound('blip')

    // Smoothly pan camera closer to blip
    const wCoord = toWorldCoords(blip.x, blip.y)
    threeRef.current.targetLook = new THREE.Vector3(wCoord.x, 0, wCoord.z)
    threeRef.current.targetPos = new THREE.Vector3(wCoord.x, 10, wCoord.z + 7)

    setTelemetry((prev) => ({
      ...prev,
      coords: `${(25.7 + (100 - blip.y) * 0.02).toFixed(4)}° N, ${(80.1 + (blip.x - 50) * 0.02).toFixed(4)}° W`,
    }))
  }

  const handleSetWaypoint = (blip) => {
    setWaypoint(blip)
    if (soundEnabled) playGtaSound('waypoint')

    // Position 3D Waypoint Light Pillar
    if (threeRef.current.waypointGroup) {
      const wCoord = toWorldCoords(blip.x, blip.y)
      threeRef.current.waypointGroup.position.set(wCoord.x, 0, wCoord.z)
      threeRef.current.waypointGroup.visible = true
    }

    // Distance calculation from Player to Waypoint in miles
    const dx = blip.x - playerPosition.x
    const dy = blip.y - playerPosition.y
    const distMiles = (Math.sqrt(dx * dx + dy * dy) * 0.45).toFixed(1)
    const etaMin = Math.max(1, Math.round(distMiles * 0.45))

    addToast(
      `📍 GPS WAYPOINT SET: ${blip.name.toUpperCase()} · ${distMiles} MILES (ETA: ${etaMin} MIN)`,
      'cheat',
      4500
    )
  }

  const handleClearWaypoint = () => {
    setWaypoint(null)
    if (threeRef.current.waypointGroup) {
      threeRef.current.waypointGroup.visible = false
    }
    if (soundEnabled) playGtaSound('clear')
    addToast('Waypoint removed from Leonida GPS tracker.', 'info', 2000)
  }

  // Center on Player (Lucia & Jason in Vice Beach)
  const handleCenterOnPlayer = () => {
    const pCoords = toWorldCoords(playerPosition.x, playerPosition.y)
    threeRef.current.targetLook = new THREE.Vector3(pCoords.x, 0, pCoords.z)
    threeRef.current.targetPos = new THREE.Vector3(pCoords.x, 8.5, pCoords.z + 5.5)
    if (soundEnabled) playGtaSound('blip')
    addToast('GPS centered on Player: Lucia & Jason (Ocean View Safehouse)', 'info', 2500)
  }

  // Filter blips
  const filteredBlips = LEONIDA_MAP_BLIPS.filter((b) => {
    const matchFilter = selectedFilter === 'all' || b.type === selectedFilter
    const matchSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.county.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFilter && matchSearch
  })

  // Distance to active blip
  const activeDistance = activeBlip
    ? (
        Math.sqrt(
          Math.pow(activeBlip.x - playerPosition.x, 2) + Math.pow(activeBlip.y - playerPosition.y, 2)
        ) * 0.45
      ).toFixed(1)
    : 0

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gta-teal/60 bg-[#060814] shadow-2xl flex flex-col select-none">
      {/* 1. TOP HUD BAR: Tactical State Feed & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-3 bg-black/90 border-b border-gta-border/80 backdrop-blur-md gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gta-teal/15 border border-gta-teal/50 text-gta-teal shadow-[0_0_12px_rgba(0,229,255,0.4)]">
            <Navigation size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gta-pink animate-ping" />
              <span className="font-heading text-xs tracking-[0.25em] text-white">
                STATE OF LEONIDA · GTA 6 SATELLITE CARTOGRAPHY
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              REAL 3D TOPOLOGY // LUMMOX · LEONARD · KELLY · VICE DALE · MARIANA · GATOR KEYS
            </span>
          </div>
        </div>

        {/* Quick Search & Sound / Reset Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search precinct, bank, airport..."
              className="w-full bg-gta-dark/90 border border-gta-border/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gta-teal transition-colors font-mono"
            />
          </div>

          <button
            type="button"
            onClick={toggleViewMode}
            className={`px-3 py-1.5 rounded-lg border font-heading text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-gta-teal/20 border-gta-teal text-gta-teal shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'bg-gta-dark border-gta-border text-gray-400 hover:text-white'
            }`}
            title="Toggle 3D Perspective / 2D Overhead Satellite"
          >
            <Layers size={14} />
            {viewMode === '3d' ? '3D TACTICAL' : '2D OVERHEAD'}
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className="p-2 rounded-lg bg-gta-dark border border-gta-border text-gray-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Disable GPS Audio' : 'Enable GPS Audio'}
          >
            {soundEnabled ? <Volume2 size={15} className="text-gta-teal" /> : <VolumeX size={15} />}
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 rounded-lg bg-gta-dark border border-gta-border text-gray-400 hover:text-white transition-colors"
            title="Reset View"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* 2. COUNTY QUICK-SECTOR FILTER BAR */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#090d1f]/95 border-b border-gta-border/60 overflow-x-auto no-scrollbar z-20">
        <span className="text-[10px] font-heading tracking-widest text-gta-teal uppercase mr-2 flex-shrink-0">
          SECTOR:
        </span>
        {LEONIDA_COUNTIES.map((county) => {
          const isSelected = selectedCounty === county.id
          return (
            <button
              key={county.id}
              onClick={() => handleSelectCounty(county.id)}
              className={`px-3 py-1 rounded-md text-[11px] font-heading tracking-wider uppercase whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gta-pink text-white font-bold shadow-[0_0_12px_rgba(255,46,136,0.6)]'
                  : 'bg-black/60 border border-gta-border/60 text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              {county.name}
            </button>
          )
        })}
      </div>

      {/* 3. MAIN 3D INTERACTIVE VIEWPORT */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Scanlines & Retro Grid Shader Overlay */}
        <div className="absolute inset-0 pointer-events-none retro-grid opacity-20" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(6,8,20,0.6)_100%)]" />

        {/* Floating 3D Waypoint Route HUD Overlay */}
        {waypoint && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-black/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gta-pink shadow-[0_0_20px_rgba(255,46,136,0.4)]">
            <span className="w-2.5 h-2.5 rounded-full bg-gta-pink animate-ping" />
            <div>
              <div className="text-[10px] font-heading tracking-widest text-gta-pink uppercase">
                ACTIVE GPS WAYPOINT
              </div>
              <div className="text-xs font-mono font-bold text-white truncate max-w-xs">
                {waypoint.name}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearWaypoint}
              className="ml-2 text-[10px] font-mono text-red-400 hover:text-red-300 underline uppercase"
            >
              CLEAR
            </button>
          </div>
        )}

        {/* On-Screen 3D Zoom & Recenter Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-lg bg-black/85 border border-gta-teal/60 hover:bg-gta-teal/20 text-gta-teal flex items-center justify-center shadow-lg transition-all"
            title="Zoom In (+)"
          >
            <ZoomIn size={17} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-lg bg-black/85 border border-gta-teal/60 hover:bg-gta-teal/20 text-gta-teal flex items-center justify-center shadow-lg transition-all"
            title="Zoom Out (-)"
          >
            <ZoomOut size={17} />
          </button>
          <button
            type="button"
            onClick={handleCenterOnPlayer}
            className="w-9 h-9 rounded-lg bg-black/85 border border-gta-pink/60 hover:bg-gta-pink/20 text-gta-pink flex items-center justify-center shadow-lg transition-all"
            title="Center on Lucia & Jason (Player)"
          >
            <Crosshair size={17} />
          </button>
        </div>

        {/* 2D Project Overlay Pins that float on the 3D surface */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {filteredBlips.map((blip) => {
            const projected = projectedBlips.find((p) => p.id === blip.id)
            if (!projected || !projected.visible) return null

            const isSelected = activeBlip?.id === blip.id
            const isWaypoint = waypoint?.id === blip.id
            const isPolice = blip.type === 'police'
            const isAirport = blip.type === 'airport'
            const isDealership = blip.type === 'dealership'

            return (
              <div
                key={blip.id}
                style={{
                  position: 'absolute',
                  left: `${projected.screenX}px`,
                  top: `${projected.screenY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={() => handleBlipClick(blip)}
                  onDoubleClick={() => handleSetWaypoint(blip)}
                  className={`group relative flex items-center justify-center transition-transform hover:scale-125 ${
                    isSelected ? 'scale-125 z-40' : 'scale-100 z-10'
                  }`}
                  title={`${blip.name} [Double Click to Set Waypoint]`}
                >
                  {/* Outer Pulsing Beacon */}
                  {(isSelected || isWaypoint) && (
                    <span
                      className={`absolute inset-0 -m-2 rounded-full animate-ping opacity-75 ${
                        isWaypoint ? 'bg-gta-pink' : isPolice ? 'bg-blue-500' : 'bg-gta-teal'
                      }`}
                    />
                  )}

                  <div
                    className={`p-1.5 sm:p-2 rounded-full border shadow-xl transition-all ${
                      isWaypoint
                        ? 'bg-gta-pink text-white border-white ring-4 ring-gta-pink/60 shadow-[0_0_20px_#FF2E88]'
                        : isSelected
                        ? 'bg-white text-gta-dark border-gta-teal ring-4 ring-gta-teal/60 shadow-[0_0_18px_#00E5FF]'
                        : isPolice
                        ? 'bg-blue-600/90 text-white border-blue-400'
                        : isAirport
                        ? 'bg-cyan-600/90 text-white border-cyan-300'
                        : isDealership
                        ? 'bg-gta-pink/90 text-white border-pink-300'
                        : 'bg-black/90 text-gta-teal border-gta-teal/70'
                    }`}
                  >
                    {blip.type === 'police' && <Siren size={13} />}
                    {blip.type === 'airport' && <Plane size={13} />}
                    {blip.type === 'safehouse' && <Shield size={13} />}
                    {blip.type === 'heist' && <DollarSign size={13} />}
                    {blip.type === 'dealership' && <Car size={13} />}
                    {blip.type === 'weapons' && <Target size={13} />}
                    {blip.type === 'garage' && <Wrench size={13} />}
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-black/95 text-white text-[10px] font-heading tracking-wider px-2 py-0.5 rounded border border-gta-teal shadow-lg z-50">
                    {blip.name}
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom Left Live Telemetry HUD */}
        <div className="absolute bottom-3 left-4 z-20 hidden md:flex items-center gap-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-[10px] font-mono text-gray-300">
          <span className="text-gta-teal font-bold">{telemetry.weather}</span>
          <span className="text-gray-500">|</span>
          <span>ELEV: {telemetry.elevation}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gta-pink">{telemetry.coords}</span>
        </div>

        {/* Bottom Right GTA Controller Controls Legend */}
        <div className="absolute bottom-3 right-4 z-20 hidden sm:flex items-center gap-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[10px] font-mono text-gray-400">
          <span><kbd className="px-1 py-0.5 rounded bg-gray-800 text-white">DRAG</kbd> 3D ORBIT</span>
          <span><kbd className="px-1 py-0.5 rounded bg-gray-800 text-white">SCROLL</kbd> ZOOM</span>
          <span><kbd className="px-1 py-0.5 rounded bg-gray-800 text-white">2x CLICK</kbd> GPS WAYPOINT</span>
        </div>
      </div>

      {/* 4. BOTTOM FILTER TABS & ACTIVE INTEL DRAWER */}
      <div className="p-4 bg-[#070a18] border-t border-gta-border/80">
        {/* Blip Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {BLIP_FILTERS.map((f) => {
            const Icon = f.icon
            const isCurrent = selectedFilter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-heading text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-gta-teal text-gta-dark font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'bg-black/60 border border-gta-border/60 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <Icon size={13} className={isCurrent ? 'text-gta-dark' : f.color} />
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Selected Recon Point Intel Banner */}
        {activeBlip && (
          <div className="p-4 rounded-xl bg-black/75 border border-gta-teal/40 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-heading tracking-widest px-2 py-0.5 rounded bg-gta-teal/15 text-gta-teal border border-gta-teal/40 uppercase">
                  {activeBlip.county} · {activeBlip.district}
                </span>
                <span className="text-[10px] font-mono text-gta-pink font-semibold">
                  THREAT: {activeBlip.threat}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  DIST: {activeDistance} MILES FROM PLAYER
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl text-white tracking-wide mb-1">
                {activeBlip.name}
              </h3>
              <p className="text-xs text-gray-300 font-body leading-relaxed mb-3">
                {activeBlip.desc}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {activeBlip.features?.map((ft) => (
                  <span
                    key={ft}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-gta-dark border border-gta-border/60 text-gray-300"
                  >
                    ✓ {ft}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetWaypoint(activeBlip)}
                className="gta-btn-primary text-xs py-2 px-4 w-full text-center flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,46,136,0.5)]"
              >
                <MapPin size={14} />
                SET GPS WAYPOINT
              </button>
              {waypoint?.id === activeBlip.id && (
                <button
                  type="button"
                  onClick={handleClearWaypoint}
                  className="w-full text-center text-[10px] font-mono text-red-400 hover:text-red-300 py-1"
                >
                  REMOVE WAYPOINT
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
