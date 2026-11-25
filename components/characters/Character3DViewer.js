'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Sun,
  Moon,
  Camera,
  Shirt,
} from 'lucide-react'

// ==========================================
// PROCEDURAL CANVAS TEXTURE GENERATORS
// ==========================================

// Realistic Denim Fabric Texture with diagonal twill weave, subtle wash fading, and stitching
function createDenimTexture(baseHex = '#1e3a5f') {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // Base denim tone
  ctx.fillStyle = baseHex
  ctx.fillRect(0, 0, 256, 256)

  // Diagonal twill weave
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  for (let i = -256; i < 512; i += 4) {
    ctx.fillRect(i, 0, 1.5, 256)
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
  for (let i = -256; i < 512; i += 4) {
    ctx.fillRect(i + 2, 0, 1.5, 256)
  }

  // Cross-grain micro texture
  for (let y = 0; y < 256; y += 3) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)'
    ctx.fillRect(0, y, 256, 1)
  }

  // Realistic gold contrast double stitching line on border
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.strokeRect(4, 4, 248, 248)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

// Realistic Tropical Hawaiian Camp Shirt Texture (GTA Vice City floral & palm leaves)
function createHawaiianTexture(primaryColor = '#00e5ff') {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Tropical base gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512)
  grad.addColorStop(0, primaryColor)
  grad.addColorStop(1, '#0f2b48')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  // Palm fronds & tropical monstera leaves
  const colors = ['#ff2e88', '#f59e0b', '#10b981', '#ffffff']
  for (let i = 0; i < 36; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const col = colors[i % colors.length]

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((Math.random() * 360 * Math.PI) / 180)
    ctx.fillStyle = col
    ctx.globalAlpha = 0.65

    // Leaf shape
    ctx.beginPath()
    ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2)
    ctx.fill()

    // Stem
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-18, 0)
    ctx.lineTo(18, 0)
    ctx.stroke()
    ctx.restore()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

// Realistic Tactical Kevlar / Ballistic Grid Texture
function createTacticalTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#141419'
  ctx.fillRect(0, 0, 256, 256)

  // Ballistic diamond weave
  ctx.strokeStyle = '#282835'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 256; i += 8) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + 256, 256)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(i, 256)
    ctx.lineTo(i + 256, 0)
    ctx.stroke()
  }

  // MOLLE webbing strap across middle
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 96, 256, 64)
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.strokeRect(8, 104, 240, 48)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

// Realistic Leather Grain Bump Texture for holsters, belts, and boots
function createLeatherTexture(color = '#121216') {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 128, 128)

  // Organic leather noise grain
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 128
    const y = Math.random() * 128
    const r = Math.random() * 2 + 1
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.12)'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export default function Character3DViewer({
  characterId = 'lucia',
  outfitId = 'lucia-dock-heist',
  colorway = '#FF2E88',
  accessories = { glasses: true, holster: true, watch: true },
}) {
  const mountRef = useRef(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [lightingMode, setLightingMode] = useState('vice-sunset') // 'vice-sunset' | 'neon-club' | 'studio'
  const [activeCameraAngle, setActiveCameraAngle] = useState('full') // 'full' | 'portrait' | 'side' | 'back'

  // References to keep Three.js state across renders
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const characterGroupRef = useRef(null)
  const turntableRef = useRef(null)
  const particlesRef = useRef(null)
  const lightsRef = useRef({})
  const reqIdRef = useRef(null)
  const isMouseDownRef = useRef(false)
  const prevMousePosRef = useRef({ x: 0, y: 0 })
  const rotationYRef = useRef(0)
  const rotationXRef = useRef(0.08)
  const targetScaleRef = useRef(1)
  const targetCamYRef = useRef(1.05)
  const targetCamZRef = useRef(3.1)

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 550

    // 1. Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x060713)
    scene.fog = new THREE.FogExp2(0x060713, 0.14)

    // 2. Camera with high-definition perspective
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50)
    camera.position.set(0, targetCamYRef.current, targetCamZRef.current)
    camera.lookAt(0, 0.95, 0)
    cameraRef.current = camera

    // 3. Renderer with ACES Filmic Tone Mapping & High-Resolution Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    rendererRef.current = renderer

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 4. Studio Cinematic Lighting Rig (Vice City signature lighting)
    const ambientLight = new THREE.AmbientLight(0x1a1528, 2.2)
    scene.add(ambientLight)

    // Key Light (Warm Key)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2)
    keyLight.position.set(2.2, 3.8, 3.0)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 10
    keyLight.shadow.camera.left = -1.5
    keyLight.shadow.camera.right = 1.5
    keyLight.shadow.camera.top = 2.5
    keyLight.shadow.camera.bottom = -0.5
    keyLight.shadow.bias = -0.0006
    scene.add(keyLight)

    // Hot Neon Pink Rim Light (Left flank - GTA 6 signature)
    const pinkRim = new THREE.PointLight(0xff2e88, 5.0, 9)
    pinkRim.position.set(-2.8, 2.2, -1.8)
    scene.add(pinkRim)

    // Cool Neon Cyan Fill Light (Right flank)
    const cyanRim = new THREE.PointLight(0x00e5ff, 4.2, 9)
    cyanRim.position.set(2.6, 1.8, -1.6)
    scene.add(cyanRim)

    // Top Overhead Spotlight
    const topSpot = new THREE.SpotLight(0xffffff, 2.5, 8, Math.PI / 4, 0.4)
    topSpot.position.set(0, 4.2, 1.2)
    topSpot.target.position.set(0, 1, 0)
    scene.add(topSpot)
    scene.add(topSpot.target)

    lightsRef.current = { ambientLight, keyLight, pinkRim, cyanRim, topSpot }

    // 5. Turntable Pedestal with glowing edge ring & contact shadow
    const turntable = new THREE.Group()
    turntableRef.current = turntable
    scene.add(turntable)

    // Contact Shadow Ground Disk (prevents character from floating)
    const shadowGeo = new THREE.CircleGeometry(0.72, 32)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
    })
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat)
    contactShadow.rotation.x = -Math.PI / 2
    contactShadow.position.y = 0.003
    turntable.add(contactShadow)

    // Pedestal Base Cylinder
    const baseGeo = new THREE.CylinderGeometry(0.95, 1.05, 0.08, 48)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f1e,
      roughness: 0.25,
      metalness: 0.85,
    })
    const baseMesh = new THREE.Mesh(baseGeo, baseMat)
    baseMesh.position.y = -0.04
    baseMesh.receiveShadow = true
    turntable.add(baseMesh)

    // Glowing Neon Edge Torus
    const ringGeo = new THREE.TorusGeometry(0.98, 0.02, 16, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 2
    ringMesh.position.y = 0.01
    turntable.add(ringMesh)

    // Inner Grid Circle
    const innerGridGeo = new THREE.CircleGeometry(0.92, 36)
    const innerGridMat = new THREE.MeshStandardMaterial({
      color: 0x11152a,
      roughness: 0.3,
      metalness: 0.7,
    })
    const innerGrid = new THREE.Mesh(innerGridGeo, innerGridMat)
    innerGrid.rotation.x = -Math.PI / 2
    innerGrid.position.y = 0.006
    innerGrid.receiveShadow = true
    turntable.add(innerGrid)

    // 6. Floating Atmospheric Neon Bokeh / Dust Particles
    const particleCount = 50
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 3
      particlePositions[i + 1] = Math.random() * 2.8
      particlePositions[i + 2] = (Math.random() - 0.5) * 3
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })
    const particlePoints = new THREE.Points(particleGeo, particleMat)
    particlesRef.current = particlePoints
    scene.add(particlePoints)

    // 7. Character Group placed on turntable
    const charGroup = new THREE.Group()
    characterGroupRef.current = charGroup
    turntable.add(charGroup)

    // 8. Mouse & Touch Drag Handlers
    const onMouseDown = (e) => {
      isMouseDownRef.current = true
      prevMousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e) => {
      if (!isMouseDownRef.current) return
      const deltaX = e.clientX - prevMousePosRef.current.x
      const deltaY = e.clientY - prevMousePosRef.current.y
      prevMousePosRef.current = { x: e.clientX, y: e.clientY }

      rotationYRef.current += deltaX * 0.008
      rotationXRef.current = Math.max(-0.25, Math.min(0.35, rotationXRef.current + deltaY * 0.005))
    }

    const onMouseUp = () => {
      isMouseDownRef.current = false
    }

    const onWheel = (e) => {
      e.preventDefault()
      targetScaleRef.current = Math.max(0.65, Math.min(1.5, targetScaleRef.current - e.deltaY * 0.001))
      setZoomLevel(Math.round(targetScaleRef.current * 100) / 100)
    }

    // Touch events for mobile
    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX
        const deltaY = e.touches[0].clientY - touchStartY
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        rotationYRef.current += deltaX * 0.01
        rotationXRef.current = Math.max(-0.25, Math.min(0.35, rotationXRef.current + deltaY * 0.006))
      }
    }

    const domEl = renderer.domElement
    domEl.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    domEl.addEventListener('wheel', onWheel, { passive: false })
    domEl.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resizeObserver.observe(container)

    // 9. Animation Loop (Breathing + Turntable + Particles)
    let clock = new THREE.Clock()
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Auto-rotation when not dragging
      if (autoRotate && !isMouseDownRef.current) {
        rotationYRef.current += delta * 0.35
      }

      // Smooth camera interpolation
      if (turntableRef.current) {
        turntableRef.current.rotation.y = THREE.MathUtils.lerp(turntableRef.current.rotation.y, rotationYRef.current, 0.1)
        turntableRef.current.rotation.x = THREE.MathUtils.lerp(turntableRef.current.rotation.x, rotationXRef.current, 0.1)
        turntableRef.current.scale.setScalar(
          THREE.MathUtils.lerp(turntableRef.current.scale.x, targetScaleRef.current, 0.1)
        )
      }

      // Camera position interpolation for angle presets
      if (cameraRef.current) {
        cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetCamYRef.current, 0.08)
        cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetCamZRef.current, 0.08)
        cameraRef.current.lookAt(0, targetCamYRef.current - 0.15, 0)
      }

      // Floating dust particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += delta * 0.15
          if (positions[i] > 2.8) positions[i] = 0.1
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true
        particlesRef.current.rotation.y = time * 0.05
      }

      // Subtle human breathing cycle on character torso
      if (characterGroupRef.current) {
        const breath = Math.sin(time * 2.2) * 0.008
        characterGroupRef.current.position.y = breath
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqIdRef.current)
      resizeObserver.disconnect()
      domEl.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      domEl.removeEventListener('wheel', onWheel)
      domEl.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      renderer.dispose()
      if (container && domEl.parentNode === container) {
        container.removeChild(domEl)
      }
    }
  }, [autoRotate])

  // Lighting Mode Swapping
  useEffect(() => {
    const lights = lightsRef.current
    if (!lights.pinkRim) return

    if (lightingMode === 'vice-sunset') {
      lights.keyLight.color.setHex(0xfff5eb)
      lights.keyLight.intensity = 3.2
      lights.pinkRim.color.setHex(0xff2e88)
      lights.pinkRim.intensity = 5.0
      lights.cyanRim.color.setHex(0x00e5ff)
      lights.cyanRim.intensity = 4.2
      if (sceneRef.current) sceneRef.current.background.setHex(0x060713)
    } else if (lightingMode === 'neon-club') {
      lights.keyLight.color.setHex(0xbd00ff)
      lights.keyLight.intensity = 2.4
      lights.pinkRim.color.setHex(0xff007f)
      lights.pinkRim.intensity = 6.5
      lights.cyanRim.color.setHex(0x00f0ff)
      lights.cyanRim.intensity = 5.8
      if (sceneRef.current) sceneRef.current.background.setHex(0x0a0316)
    } else if (lightingMode === 'studio') {
      lights.keyLight.color.setHex(0xffffff)
      lights.keyLight.intensity = 4.0
      lights.pinkRim.color.setHex(0xffd166)
      lights.pinkRim.intensity = 2.2
      lights.cyanRim.color.setHex(0x90e0ef)
      lights.cyanRim.intensity = 2.0
      if (sceneRef.current) sceneRef.current.background.setHex(0x0e111b)
    }
  }, [lightingMode])

  // Rebuild 3D Realistic Character Model
  useEffect(() => {
    const charGroup = characterGroupRef.current
    if (!charGroup) return

    // Clean previous meshes
    while (charGroup.children.length > 0) {
      const obj = charGroup.children[0]
      charGroup.remove(obj)
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    }

    // Build the high-fidelity realistic character
    buildRealistic3DCharacter(charGroup, characterId, outfitId, colorway, accessories)
  }, [characterId, outfitId, colorway, accessories])

  // Camera Angle Presets
  const setCameraView = (mode) => {
    setActiveCameraAngle(mode)
    if (mode === 'full') {
      targetCamYRef.current = 1.05
      targetCamZRef.current = 3.1
      rotationYRef.current = 0
      rotationXRef.current = 0.08
      targetScaleRef.current = 1
    } else if (mode === 'portrait') {
      targetCamYRef.current = 1.62
      targetCamZRef.current = 1.45
      rotationYRef.current = 0
      rotationXRef.current = 0.02
      targetScaleRef.current = 1.15
    } else if (mode === 'side') {
      targetCamYRef.current = 1.1
      targetCamZRef.current = 2.9
      rotationYRef.current = Math.PI / 2
      rotationXRef.current = 0.05
      targetScaleRef.current = 1
    } else if (mode === 'back') {
      targetCamYRef.current = 1.15
      targetCamZRef.current = 3.0
      rotationYRef.current = Math.PI
      rotationXRef.current = 0.08
      targetScaleRef.current = 1
    } else if (mode === 'kicks') {
      targetCamYRef.current = 0.28
      targetCamZRef.current = 1.55
      rotationYRef.current = 0.35
      rotationXRef.current = -0.05
      targetScaleRef.current = 1.2
    }
  }

  const handleZoom = (delta) => {
    targetScaleRef.current = Math.max(0.65, Math.min(1.55, targetScaleRef.current + delta))
    setZoomLevel(Math.round(targetScaleRef.current * 100) / 100)
  }

  const resetView = () => {
    setCameraView('full')
  }

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] rounded-2xl overflow-hidden select-none border border-gta-border/80 bg-gradient-to-b from-[#080b18] via-[#0d091e] to-[#060814] shadow-2xl">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Floating HUD: Real-time 3D Engine Badge & Camera Angle Presets */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-md bg-black/80 border border-gta-teal/60 text-gta-teal font-mono text-[10px] tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gta-teal animate-pulse" />
            REALISTIC 3D ENGINE • PBR SHADERS
          </span>
        </div>

        {/* Camera Angle Presets */}
        <div className="flex items-center gap-1 bg-black/85 p-1 rounded-xl border border-white/15 backdrop-blur-md pointer-events-auto shadow-xl">
          {[
            { id: 'full', label: 'FULL BODY' },
            { id: 'portrait', label: 'FACE / PORTRAIT' },
            { id: 'side', label: 'SIDE' },
            { id: 'back', label: 'BACK' },
            { id: 'kicks', label: 'KICKS / GEAR' },
          ].map((angle) => (
            <button
              key={angle.id}
              onClick={() => setCameraView(angle.id)}
              className={`px-2.5 py-1 text-[10px] font-heading rounded-lg tracking-wider uppercase transition-all ${
                activeCameraAngle === angle.id
                  ? 'bg-gta-pink text-white font-bold shadow-[0_0_12px_rgba(255,46,136,0.5)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {angle.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Center Drag Instructions Badge */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <span className="text-[9px] font-mono tracking-widest text-gray-300 bg-black/75 px-3 py-1 rounded-full border border-gta-teal/30 backdrop-blur-sm shadow-md">
          DRAG TO ROTATE 360° • PINCH / SCROLL TO ZOOM
        </span>
      </div>

      {/* Bottom Floating HUD: Lighting Atmosphere Presets & View Controls */}
      <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 z-20 flex items-center justify-between gap-2 pointer-events-none flex-wrap">
        {/* Lighting Atmosphere Presets */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/85 p-1 rounded-xl border border-white/15 backdrop-blur-md shadow-lg">
          <span className="text-[9px] font-mono text-gray-400 px-2 uppercase hidden sm:inline">STUDIO LIGHTS:</span>
          <button
            onClick={() => setLightingMode('vice-sunset')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-heading tracking-wider uppercase transition-all ${
              lightingMode === 'vice-sunset'
                ? 'bg-gradient-to-r from-gta-pink to-gta-orange text-white font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Vice City Sunset Neon"
          >
            <Sun size={12} />
            <span>VICE SUNSET</span>
          </button>
          <button
            onClick={() => setLightingMode('neon-club')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-heading tracking-wider uppercase transition-all ${
              lightingMode === 'neon-club'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Malibu Club Neon Lights"
          >
            <Moon size={12} />
            <span>MALIBU NEON</span>
          </button>
          <button
            onClick={() => setLightingMode('studio')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-heading tracking-wider uppercase transition-all ${
              lightingMode === 'studio'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Neutral Studio Spotlight"
          >
            <Camera size={12} />
            <span>NEUTRAL</span>
          </button>
        </div>

        {/* Camera Turntable & Zoom Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/85 hover:bg-black border border-gta-teal/60 text-gta-teal hover:text-white text-[11px] font-heading tracking-wider uppercase transition-all backdrop-blur-md shadow-xl"
            title="Toggle Turntable 360 Spin"
          >
            {autoRotate ? <Pause size={13} /> : <Play size={13} />}
            <span className="hidden sm:inline">{autoRotate ? 'SPIN ON' : 'SPIN PAUSED'}</span>
          </button>

          <div className="flex items-center gap-1 bg-black/85 p-1 rounded-xl border border-white/15 backdrop-blur-md shadow-xl">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-gta-teal transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-gta-teal transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-gta-teal transition-colors"
              title="Reset 3D View"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// REALISTIC 3D CHARACTER SCULPTING PIPELINE
// ==========================================
function buildRealistic3DCharacter(group, charId, outfitId, colorHex, accessories) {
  const isFemale = charId === 'lucia'
  const isJason = charId === 'jason'
  const isRaul = charId === 'syndicate-boss'
  const isVance = charId === 'vcpd-vance'

  // Procedural PBR Textures
  const denimTex = createDenimTexture('#1e3a5f')
  const hawaiianTex = createHawaiianTexture(colorHex)
  const tacticalTex = createTacticalTexture()
  const leatherTex = createLeatherTexture('#121216')

  // 1. Skin Material with Subsurface Scattering Glow simulation
  const skinToneHex = isFemale ? 0xd49b7a : isRaul ? 0xbe8258 : isJason ? 0xcc9675 : 0xcfa080
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinToneHex,
    roughness: 0.48,
    metalness: 0.08,
  })

  // 2. Head & Face Skin
  const faceMat = new THREE.MeshStandardMaterial({
    color: skinToneHex,
    roughness: 0.45,
    metalness: 0.05,
  })

  // 3. Eyeball Material (Glossy white + Specular)
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.1,
    metalness: 0.1,
  })

  // 4. Iris Material (Character specific eye color)
  const irisColorHex = isFemale ? 0x5b3826 : isJason ? 0x3d6e8a : isRaul ? 0x2b1d12 : 0x4a5d4e
  const irisMat = new THREE.MeshStandardMaterial({
    color: irisColorHex,
    roughness: 0.15,
    metalness: 0.3,
  })

  // 5. Pupil Material
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 })

  // 6. Hair Material
  const hairColorHex = isFemale ? 0x1f1610 : isRaul ? 0x101012 : isJason ? 0x2c1f17 : 0x181412
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColorHex,
    roughness: 0.4,
    metalness: 0.25,
  })

  // 7. Dynamic Outfit Fabrics
  const primaryClothMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.5,
    metalness: 0.15,
  })

  const denimClothMat = new THREE.MeshStandardMaterial({
    map: denimTex || undefined,
    color: 0x27456d,
    roughness: 0.65,
    metalness: 0.05,
  })

  const hawaiianClothMat = new THREE.MeshStandardMaterial({
    map: hawaiianTex || undefined,
    roughness: 0.45,
    metalness: 0.1,
  })

  const tacticalClothMat = new THREE.MeshStandardMaterial({
    map: tacticalTex || undefined,
    color: 0x16161d,
    roughness: 0.55,
    metalness: 0.2,
  })

  const blackLeatherMat = new THREE.MeshStandardMaterial({
    map: leatherTex || undefined,
    color: 0x111116,
    roughness: 0.35,
    metalness: 0.45,
  })

  const goldJewelryMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.18,
    metalness: 0.95,
  })

  // Body Dimensions & Human Proportions
  const shoulderW = isFemale ? 0.38 : 0.50
  const chestH = isFemale ? 0.34 : 0.42
  const waistW = isFemale ? 0.26 : 0.34
  const hipW = isFemale ? 0.35 : 0.32
  const legH = isFemale ? 0.88 : 0.96

  // ==========================================
  // A. SCULPTED HEAD & REALISTIC FACIAL FEATURES
  // ==========================================
  const headGroup = new THREE.Group()
  headGroup.position.y = 1.68
  group.add(headGroup)

  // Cranium & Jawline (Sculpted with organic Capsule)
  const headGeo = new THREE.SphereGeometry(0.125, 32, 32)
  headGeo.scale(0.95, 1.25, 1.05)
  const headMesh = new THREE.Mesh(headGeo, faceMat)
  headMesh.castShadow = true
  headGroup.add(headMesh)

  // Chin / Jawline definition
  const jawGeo = new THREE.CylinderGeometry(0.045, 0.075, 0.08, 16)
  const jawMesh = new THREE.Mesh(jawGeo, faceMat)
  jawMesh.position.set(0, -0.11, 0.02)
  headGroup.add(jawMesh)

  // Realistic 3D Nose
  const noseBridgeGeo = new THREE.ConeGeometry(0.022, 0.065, 8)
  const noseMesh = new THREE.Mesh(noseBridgeGeo, faceMat)
  noseMesh.rotation.x = Math.PI - 0.25
  noseMesh.position.set(0, 0.005, 0.13)
  headGroup.add(noseMesh)

  const noseTipGeo = new THREE.SphereGeometry(0.015, 12, 12)
  const noseTip = new THREE.Mesh(noseTipGeo, faceMat)
  noseTip.position.set(0, -0.025, 0.138)
  headGroup.add(noseTip)

  // Realistic 3D Lips (Upper & Lower with rosy finish)
  const lipMat = new THREE.MeshStandardMaterial({
    color: isFemale ? 0xb84358 : 0xad6560,
    roughness: 0.35,
    metalness: 0.1,
  })
  const upperLipGeo = new THREE.BoxGeometry(0.046, 0.012, 0.018)
  const upperLip = new THREE.Mesh(upperLipGeo, lipMat)
  upperLip.position.set(0, -0.062, 0.125)
  headGroup.add(upperLip)

  const lowerLipGeo = new THREE.BoxGeometry(0.042, 0.015, 0.02)
  const lowerLip = new THREE.Mesh(lowerLipGeo, lipMat)
  lowerLip.position.set(0, -0.078, 0.122)
  headGroup.add(lowerLip)

  // Realistic 3D Eyes (Left & Right)
  const buildEye = (side = 1) => {
    const eyeGroup = new THREE.Group()
    eyeGroup.position.set(side * 0.042, 0.032, 0.115)

    // Sclera Eyeball
    const eyeballGeo = new THREE.SphereGeometry(0.019, 16, 16)
    const eyeball = new THREE.Mesh(eyeballGeo, eyeWhiteMat)
    eyeGroup.add(eyeball)

    // Iris
    const irisGeo = new THREE.CircleGeometry(0.01, 16)
    const iris = new THREE.Mesh(irisGeo, irisMat)
    iris.position.z = 0.0175
    eyeGroup.add(iris)

    // Pupil
    const pupilGeo = new THREE.CircleGeometry(0.005, 12)
    const pupil = new THREE.Mesh(pupilGeo, pupilMat)
    pupil.position.z = 0.018
    eyeGroup.add(pupil)

    // Eyelid crease (Skin tone)
    const eyelidGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.008, 12)
    const eyelid = new THREE.Mesh(eyelidGeo, faceMat)
    eyelid.rotation.z = Math.PI / 2
    eyelid.position.set(0, 0.016, 0.008)
    eyeGroup.add(eyelid)

    // Eyebrow
    const browGeo = new THREE.BoxGeometry(0.04, 0.008, 0.01)
    const brow = new THREE.Mesh(browGeo, hairMat)
    brow.position.set(0, 0.03, 0.015)
    brow.rotation.z = side * -0.08
    eyeGroup.add(brow)

    return eyeGroup
  }

  headGroup.add(buildEye(-1)) // Left eye
  headGroup.add(buildEye(1))  // Right eye

  // Ears (Left & Right)
  const earGeo = new THREE.SphereGeometry(0.028, 12, 12)
  earGeo.scale(0.5, 1.4, 0.8)
  const earL = new THREE.Mesh(earGeo, faceMat)
  earL.position.set(-0.118, -0.01, -0.01)
  headGroup.add(earL)

  const earR = new THREE.Mesh(earGeo, faceMat)
  earR.position.set(0.118, -0.01, -0.01)
  headGroup.add(earR)

  // Male 5 o'clock stubble / Mustache / Goatee
  if (!isFemale) {
    const beardGeo = new THREE.SphereGeometry(0.085, 16, 16)
    beardGeo.scale(0.9, 0.9, 0.7)
    const beardMat = new THREE.MeshStandardMaterial({
      color: 0x1c1714,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: isRaul ? 0.85 : 0.45,
    })
    const beard = new THREE.Mesh(beardGeo, beardMat)
    beard.position.set(0, -0.08, 0.07)
    headGroup.add(beard)
  }

  // ==========================================
  // B. LAYERED 3D HAIRSTYLE
  // ==========================================
  if (isFemale) {
    // Lucia's Signature High Ponytail & Face-Framing Locks
    const scalpGeo = new THREE.SphereGeometry(0.13, 24, 24)
    scalpGeo.scale(1.02, 1.15, 1.05)
    const scalp = new THREE.Mesh(scalpGeo, hairMat)
    scalp.position.set(0, 0.04, -0.03)
    headGroup.add(scalp)

    // Ponytail Knot / Hair Tie
    const tieGeo = new THREE.TorusGeometry(0.04, 0.012, 12, 24)
    const tie = new THREE.Mesh(tieGeo, goldJewelryMat)
    tie.position.set(0, 0.11, -0.14)
    headGroup.add(tie)

    // Voluminous Ponytail Stream (Flowing down back)
    const tailCurve = new THREE.CylinderGeometry(0.045, 0.02, 0.42, 16)
    const tail = new THREE.Mesh(tailCurve, hairMat)
    tail.rotation.x = 0.45
    tail.position.set(0, -0.06, -0.22)
    headGroup.add(tail)

    // Front curtain fringe lock
    const fringeGeo = new THREE.CylinderGeometry(0.015, 0.008, 0.18, 8)
    const fringeL = new THREE.Mesh(fringeGeo, hairMat)
    fringeL.position.set(-0.08, 0.01, 0.1)
    fringeL.rotation.z = -0.2
    headGroup.add(fringeL)

    const fringeR = new THREE.Mesh(fringeGeo, hairMat)
    fringeR.position.set(0.08, 0.01, 0.1)
    fringeR.rotation.z = 0.2
    headGroup.add(fringeR)

    // Gold Statement Hoop Earrings
    const hoopGeo = new THREE.TorusGeometry(0.035, 0.006, 12, 24)
    const hoopL = new THREE.Mesh(hoopGeo, goldJewelryMat)
    hoopL.position.set(-0.135, -0.045, -0.01)
    hoopL.rotation.y = Math.PI / 2
    headGroup.add(hoopL)

    const hoopR = hoopL.clone()
    hoopR.position.x = 0.135
    headGroup.add(hoopR)
  } else {
    // Male Hair (Textured crop fade for Jason, Slicked pompadour for Raul, Undercover side-part for Vance)
    const scalpGeo = new THREE.SphereGeometry(0.132, 24, 24)
    scalpGeo.scale(1.02, 1.12, 1.08)
    const scalp = new THREE.Mesh(scalpGeo, hairMat)
    scalp.position.set(0, 0.045, -0.02)
    headGroup.add(scalp)

    // Front Pompadour / Fringe Volume
    const quiffGeo = new THREE.BoxGeometry(0.14, 0.045, 0.08)
    const quiff = new THREE.Mesh(quiffGeo, hairMat)
    quiff.position.set(0, 0.14, 0.06)
    quiff.rotation.x = -0.3
    headGroup.add(quiff)
  }

  // Neck with Sternocleidomastoid Definition
  const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.14, 20)
  const neck = new THREE.Mesh(neckGeo, skinMat)
  neck.position.y = -0.11
  neck.castShadow = true
  headGroup.add(neck)

  // Cuban Link Gold Chain / Pendant
  const chainGeo = new THREE.TorusGeometry(0.082, 0.009, 12, 32)
  const chain = new THREE.Mesh(chainGeo, goldJewelryMat)
  chain.rotation.x = Math.PI / 2 + 0.25
  chain.position.set(0, -0.09, 0.02)
  headGroup.add(chain)

  // Sunglasses (Toggled with accessories.glasses)
  if (accessories.glasses) {
    const glassesGroup = new THREE.Group()
    glassesGroup.position.set(0, 0.035, 0.135)

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.95,
      roughness: 0.1,
    })
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      metalness: 0.9,
      roughness: 0.05,
    })

    // Teardrop Aviator Lenses
    const lensGeo = new THREE.CylinderGeometry(0.032, 0.036, 0.006, 16)
    lensGeo.scale(1.2, 0.9, 1)
    const lensL = new THREE.Mesh(lensGeo, lensMat)
    lensL.rotation.x = Math.PI / 2
    lensL.position.x = -0.045
    glassesGroup.add(lensL)

    const lensR = new THREE.Mesh(lensGeo, lensMat)
    lensR.rotation.x = Math.PI / 2
    lensR.position.x = 0.045
    glassesGroup.add(lensR)

    // Gold / Metal Top Brow Bar & Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.12, 8)
    const bridge = new THREE.Mesh(bridgeGeo, goldJewelryMat)
    bridge.rotation.z = Math.PI / 2
    bridge.position.y = 0.022
    glassesGroup.add(bridge)

    headGroup.add(glassesGroup)
  }

  // ==========================================
  // C. TORSO & DYNAMIC CLOTHING RIG
  // ==========================================
  const torsoGroup = new THREE.Group()
  torsoGroup.position.y = 1.30
  group.add(torsoGroup)

  const isCropTank = outfitId === 'lucia-dock-heist'
  const isVelvetDress = outfitId === 'lucia-nightclub'
  const isHawaiian = outfitId === 'jason-dock-smuggler'
  const isTacticalVest = outfitId === 'jason-blackout-raid' || outfitId === 'vance-swat'
  const isLinenSuit = outfitId === 'raul-white-linen'

  if (isCropTank) {
    // Lucia's Athletic Ribbed Crop Tank Top
    const tankGeo = new THREE.CylinderGeometry(shoulderW * 0.44, waistW * 0.48, 0.24, 24)
    const tankMesh = new THREE.Mesh(tankGeo, primaryClothMat)
    tankMesh.position.y = 0.06
    tankMesh.castShadow = true
    torsoGroup.add(tankMesh)

    // Exposed Toned Midriff Skin
    const midriffGeo = new THREE.CylinderGeometry(waistW * 0.46, waistW * 0.5, 0.14, 24)
    const midriff = new THREE.Mesh(midriffGeo, skinMat)
    midriff.position.y = -0.1
    midriff.castShadow = true
    torsoGroup.add(midriff)
  } else if (isHawaiian) {
    // Jason's Unbuttoned Tropical Hawaiian Camp Shirt
    const shirtGeo = new THREE.CylinderGeometry(shoulderW * 0.48, waistW * 0.52, 0.38, 24)
    const shirtMesh = new THREE.Mesh(shirtGeo, hawaiianClothMat)
    shirtMesh.position.y = 0.01
    shirtMesh.castShadow = true
    torsoGroup.add(shirtMesh)

    // White Undershirt in V-chest opening
    const innerTeeGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.28, 16)
    const innerTeeMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.6 })
    const innerTee = new THREE.Mesh(innerTeeGeo, innerTeeMat)
    innerTee.position.set(0, 0.04, 0.06)
    torsoGroup.add(innerTee)
  } else if (isTacticalVest) {
    // Heavy Ballistic Kevlar Plate Carrier Vest
    const vestGeo = new THREE.BoxGeometry(shoulderW * 0.88, chestH * 0.88, 0.28)
    const vestMesh = new THREE.Mesh(vestGeo, tacticalClothMat)
    vestMesh.position.y = 0.02
    vestMesh.castShadow = true
    torsoGroup.add(vestMesh)

    // Triple Front Ammo Magazines with brass bullet tips
    for (let i = -1; i <= 1; i++) {
      const pouchGeo = new THREE.BoxGeometry(0.075, 0.13, 0.06)
      const pouch = new THREE.Mesh(pouchGeo, blackLeatherMat)
      pouch.position.set(i * 0.095, -0.05, 0.16)
      torsoGroup.add(pouch)

      const bulletGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.03, 8)
      const bullet = new THREE.Mesh(bulletGeo, goldJewelryMat)
      bullet.position.set(i * 0.095, 0.025, 0.18)
      torsoGroup.add(bullet)
    }

    // High-visibility POLICE / VCPD chest tag
    const badgeGeo = new THREE.BoxGeometry(0.16, 0.045, 0.01)
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
    const badge = new THREE.Mesh(badgeGeo, badgeMat)
    badge.position.set(0, 0.11, 0.15)
    torsoGroup.add(badge)
  } else if (isLinenSuit) {
    // Raul's Tailored Linen Suit with Silk Open-Collared Shirt
    const jacketGeo = new THREE.CylinderGeometry(shoulderW * 0.52, waistW * 0.54, 0.44, 24)
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.55 })
    const jacket = new THREE.Mesh(jacketGeo, jacketMat)
    jacket.position.y = -0.01
    jacket.castShadow = true
    torsoGroup.add(jacket)

    // Silk Shirt in V-neck opening
    const silkGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16)
    const silkMesh = new THREE.Mesh(silkGeo, primaryClothMat)
    silkMesh.position.set(0, 0.04, 0.06)
    torsoGroup.add(silkMesh)
  } else if (isVelvetDress) {
    // Lucia's High-Slit Midnight Velvet Cocktail Dress
    const dressGeo = new THREE.CylinderGeometry(shoulderW * 0.44, hipW * 0.5, 0.48, 24)
    const velvetMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.35,
      metalness: 0.25,
    })
    const dress = new THREE.Mesh(dressGeo, velvetMat)
    dress.position.y = -0.06
    dress.castShadow = true
    torsoGroup.add(dress)
  } else {
    // Standard Streetwear Shirt
    const shirtGeo = new THREE.CylinderGeometry(shoulderW * 0.48, waistW * 0.52, 0.38, 24)
    const shirtMesh = new THREE.Mesh(shirtGeo, primaryClothMat)
    shirtMesh.position.y = 0.01
    shirtMesh.castShadow = true
    torsoGroup.add(shirtMesh)
  }

  // ==========================================
  // D. REALISTIC ARMS, HANDS & FINGERS
  // ==========================================
  const armRadius = isFemale ? 0.046 : 0.062
  const armLen = 0.56

  const createRealisticArm = (side = 1) => {
    const armGroup = new THREE.Group()
    armGroup.position.set(side * (shoulderW * 0.48), 0.16, 0)

    // Deltoid Shoulder Muscle
    const shoulderGeo = new THREE.SphereGeometry(armRadius * 1.3, 16, 16)
    const shoulderMat = isTacticalVest || isLinenSuit ? blackLeatherMat : skinMat
    const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat)
    armGroup.add(shoulder)

    // Upper Bicep (Capsule for smooth organic muscle contour)
    const bicepGeo = new THREE.CapsuleGeometry(armRadius, armLen * 0.35, 12, 16)
    const bicep = new THREE.Mesh(bicepGeo, shoulderMat)
    bicep.position.set(0, -armLen * 0.22, 0)
    bicep.castShadow = true
    armGroup.add(bicep)

    // Elbow Joint
    const elbowGeo = new THREE.SphereGeometry(armRadius * 0.9, 12, 12)
    const elbow = new THREE.Mesh(elbowGeo, skinMat)
    elbow.position.set(0, -armLen * 0.44, 0)
    armGroup.add(elbow)

    // Forearm Muscle
    const forearmGeo = new THREE.CapsuleGeometry(armRadius * 0.88, armLen * 0.36, 12, 16)
    const forearm = new THREE.Mesh(forearmGeo, skinMat)
    forearm.position.set(0, -armLen * 0.66, 0.02)
    forearm.castShadow = true
    armGroup.add(forearm)

    // Sculpted Hand Palm
    const palmGeo = new THREE.BoxGeometry(armRadius * 1.4, 0.065, armRadius * 0.85)
    const palm = new THREE.Mesh(palmGeo, skinMat)
    palm.position.set(0, -armLen * 0.92, 0.02)
    armGroup.add(palm)

    // Natural Relaxed Fingers
    for (let f = -2; f <= 1; f++) {
      const fingerGeo = new THREE.CapsuleGeometry(0.009, 0.038, 6, 8)
      const finger = new THREE.Mesh(fingerGeo, skinMat)
      finger.position.set(f * 0.015, -armLen * 0.98, 0.02)
      finger.rotation.x = 0.2
      armGroup.add(finger)
    }

    // Gold Chrono Watch on Left Wrist
    if (side === -1 && accessories.watch) {
      const watchCaseGeo = new THREE.CylinderGeometry(armRadius * 1.15, armRadius * 1.15, 0.032, 20)
      const watch = new THREE.Mesh(watchCaseGeo, goldJewelryMat)
      watch.position.set(0, -armLen * 0.84, 0.02)
      armGroup.add(watch)

      const dialGeo = new THREE.CircleGeometry(armRadius * 0.9, 16)
      const dialMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0f })
      const dial = new THREE.Mesh(dialGeo, dialMat)
      dial.position.set(0, -armLen * 0.82, armRadius * 1.16)
      dial.rotation.x = Math.PI / 2
      armGroup.add(dial)
    }

    return armGroup
  }

  torsoGroup.add(createRealisticArm(-1)) // Left
  torsoGroup.add(createRealisticArm(1))  // Right

  // ==========================================
  // E. HIPS, BELT & WEAPON HOLSTER RIG
  // ==========================================
  const hipGroup = new THREE.Group()
  hipGroup.position.y = 1.05
  group.add(hipGroup)

  // Leather Belt with Metal Buckle
  const beltGeo = new THREE.CylinderGeometry(waistW * 0.53, waistW * 0.53, 0.05, 24)
  const belt = new THREE.Mesh(beltGeo, blackLeatherMat)
  hipGroup.add(belt)

  const buckleGeo = new THREE.BoxGeometry(0.065, 0.055, 0.025)
  const buckle = new THREE.Mesh(buckleGeo, goldJewelryMat)
  buckle.position.set(0, 0, waistW * 0.54)
  hipGroup.add(buckle)

  // Combat Hip Holster Rig & Pistol Grip (Toggled with accessories.holster)
  if (accessories.holster) {
    const holsterSide = 1
    const holsterGeo = new THREE.BoxGeometry(0.08, 0.18, 0.1)
    const holster = new THREE.Mesh(holsterGeo, blackLeatherMat)
    holster.position.set(holsterSide * (hipW * 0.48), -0.06, 0.04)
    holster.rotation.z = holsterSide * 0.12
    hipGroup.add(holster)

    // Pistol Grip protruding from holster
    const gripGeo = new THREE.BoxGeometry(0.035, 0.09, 0.05)
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.3, metalness: 0.8 })
    const grip = new THREE.Mesh(gripGeo, gripMat)
    grip.position.set(holsterSide * (hipW * 0.48), 0.05, 0.06)
    grip.rotation.x = -0.3
    hipGroup.add(grip)
  }

  // ==========================================
  // F. LEGS, PANTS & ORGANIC ANATOMY
  // ==========================================
  const legGroup = new THREE.Group()
  legGroup.position.y = 0
  group.add(legGroup)

  const isShorts = outfitId === 'lucia-dock-heist'
  const isPantsDenim = outfitId === 'jason-dock-smuggler' || outfitId === 'lucia-streetwear'

  const legRadius = isFemale ? 0.072 : 0.086
  const legSpan = isFemale ? 0.12 : 0.15

  const createRealisticLeg = (side = 1) => {
    const leg = new THREE.Group()
    leg.position.x = side * legSpan

    if (isShorts) {
      // Cutoff Frayed Denim Shorts
      const shortGeo = new THREE.CapsuleGeometry(legRadius * 1.15, 0.12, 12, 16)
      const shortMesh = new THREE.Mesh(shortGeo, denimClothMat)
      shortMesh.position.y = 0.94
      shortMesh.castShadow = true
      leg.add(shortMesh)

      // Exposed Bare Toned Thigh Muscle
      const thighGeo = new THREE.CapsuleGeometry(legRadius, 0.32, 12, 16)
      const thigh = new THREE.Mesh(thighGeo, skinMat)
      thigh.position.y = 0.68
      thigh.castShadow = true
      leg.add(thigh)

      // Knee Joint (Patella)
      const kneeGeo = new THREE.SphereGeometry(legRadius * 0.85, 12, 12)
      const knee = new THREE.Mesh(kneeGeo, skinMat)
      knee.position.set(0, 0.48, 0.02)
      leg.add(knee)

      // Exposed Calf Muscle
      const calfGeo = new THREE.CapsuleGeometry(legRadius * 0.85, 0.34, 12, 16)
      const calf = new THREE.Mesh(calfGeo, skinMat)
      calf.position.y = 0.28
      calf.castShadow = true
      leg.add(calf)
    } else {
      // Full Pants / Trousers with fabric folds
      const pantsMat = isLinenSuit ? new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.55 }) : isPantsDenim ? denimClothMat : primaryClothMat

      const thighGeo = new THREE.CapsuleGeometry(legRadius * 1.12, 0.38, 12, 16)
      const thigh = new THREE.Mesh(thighGeo, pantsMat)
      thigh.position.y = 0.74
      thigh.castShadow = true
      leg.add(thigh)

      const kneeGeo = new THREE.SphereGeometry(legRadius * 0.95, 12, 12)
      const knee = new THREE.Mesh(kneeGeo, pantsMat)
      knee.position.set(0, 0.50, 0.01)
      leg.add(knee)

      const calfGeo = new THREE.CapsuleGeometry(legRadius * 0.96, 0.40, 12, 16)
      const calf = new THREE.Mesh(calfGeo, pantsMat)
      calf.position.y = 0.26
      calf.castShadow = true
      leg.add(calf)
    }

    // ==========================================
    // G. REALISTIC HIGH-TOP KICKS & COMBAT BOOTS
    // ==========================================
    const shoeGroup = new THREE.Group()
    shoeGroup.position.set(0, 0.045, 0.04)

    // Chunky White Rubber Sole with Tread
    const soleGeo = new THREE.BoxGeometry(legRadius * 1.9, 0.042, 0.25)
    const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.1 })
    const sole = new THREE.Mesh(soleGeo, soleMat)
    sole.position.y = -0.02
    sole.castShadow = true
    shoeGroup.add(sole)

    // Shoe Leather Upper Body
    const shoeUpperGeo = new THREE.BoxGeometry(legRadius * 1.8, 0.09, 0.23)
    const shoeMat = isShorts
      ? blackLeatherMat
      : new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.4, metalness: 0.2 })
    const shoeUpper = new THREE.Mesh(shoeUpperGeo, shoeMat)
    shoeUpper.position.set(0, 0.04, 0.01)
    shoeUpper.castShadow = true
    shoeGroup.add(shoeUpper)

    // Toe Cap
    const toeGeo = new THREE.CylinderGeometry(0.042, 0.045, 0.06, 12)
    toeGeo.scale(1.2, 0.8, 1)
    const toe = new THREE.Mesh(toeGeo, soleMat)
    toe.rotation.x = Math.PI / 2
    toe.position.set(0, 0.015, 0.10)
    shoeGroup.add(toe)

    // High-top Ankle Collar & Tongue
    const collarGeo = new THREE.CylinderGeometry(legRadius * 0.98, legRadius * 0.95, 0.08, 16)
    const collar = new THREE.Mesh(collarGeo, blackLeatherMat)
    collar.position.set(0, 0.09, 0.01)
    shoeGroup.add(collar)

    // Contrast Laces
    const laceGeo = new THREE.BoxGeometry(0.055, 0.008, 0.08)
    const laceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    const lace = new THREE.Mesh(laceGeo, laceMat)
    lace.position.set(0, 0.075, 0.07)
    shoeGroup.add(lace)

    leg.add(shoeGroup)
    return leg
  }

  legGroup.add(createRealisticLeg(-1)) // Left
  legGroup.add(createRealisticLeg(1))  // Right
}
