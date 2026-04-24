import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useTranslation } from 'react-i18next'
import '../Styles/Mapa.css'

// ─── Datos ────────────────────────────────────────────────────────────────────
/*
  LAYOUT (vista superior):

      BACK  (North, z < 0) — Patio/Jardín
  ┌──────────────────────────────────────────┐ z = −6
  │            PATIO & JARDÍN                │
  │   (deck · césped · arbustos · luces)     │ z −6 → −3
  ╞══════════════ GLASS WALL ════════════════╡ z = −3
  │                    ┆                     │
  │    COCINA          ┆     SALA DE ESTAR   │
  │  (isla, mesón,     ┆   (sofá L, TV,     │ z −3 → 0.5
  │   estufa, nevera)  ┆    lámpara, rug)    │
  │              open concept                │
  ├────────┬───────────┼─────────────────────┤ z = 0.5
  │        │           │                     │
  │  HAB.  │   BAÑO    │     ENTRADA         │
  │ PRINC. │ (ducha,   │  (puerta, consola,  │ z 0.5 → 4
  │ (cama, │  lavabo,  │   cámara, luz)      │
  │ closet)│  espejo)  │                     │
  └────────┴───────────┴─────────────────────┘ z = 4
                                  ↑ Puerta principal
      FRONT  (South, z > 0) — Calle
*/

const WA_NUMBER = '573014032120'

const HABITACIONES = [
  {
    id: 'sala',
    nombreKey: 'mapa.rooms.sala',
    icono: '🛋️',
    dispositivosKeys: ['mapa.devices.ledReg', 'mapa.devices.audio', 'mapa.devices.voice', 'mapa.devices.blinds'],
    escenaKey: 'mapa.scenes.cine',
    estadoKey: 'mapa.states.encendida',
    colorEncendido: 0xffd699,
    posicion: { x: 2.25, y: 0, z: -1.25 },
    dimensiones: { w: 5.5, h: 2.8, d: 3.5 },
  },
  {
    id: 'cocina',
    nombreKey: 'mapa.rooms.cocina',
    icono: '🍳',
    dispositivosKeys: ['mapa.devices.ledCab', 'mapa.devices.gas', 'mapa.devices.smoke', 'mapa.devices.appliances'],
    escenaKey: 'mapa.scenes.cocina',
    estadoKey: 'mapa.states.encendida',
    colorEncendido: 0xfff0d0,
    posicion: { x: -2.75, y: 0, z: -1.25 },
    dimensiones: { w: 4.5, h: 2.8, d: 3.5 },
  },
  {
    id: 'habitacion',
    nombreKey: 'mapa.rooms.habitacion',
    icono: '🛏️',
    dispositivosKeys: ['mapa.devices.ambient', 'mapa.devices.climate', 'mapa.devices.blindsAuto', 'mapa.devices.presence'],
    escenaKey: 'mapa.scenes.descanso',
    estadoKey: 'mapa.states.encendida',
    colorEncendido: 0xffe8b0,
    posicion: { x: -2.75, y: 0, z: 2.25 },
    dimensiones: { w: 4.5, h: 2.8, d: 3.5 },
  },
  {
    id: 'bano',
    nombreKey: 'mapa.rooms.bano',
    icono: '🚿',
    dispositivosKeys: ['mapa.devices.ledMirror', 'mapa.devices.extractor', 'mapa.devices.humidity', 'mapa.devices.floor'],
    escenaKey: 'mapa.scenes.relax',
    estadoKey: 'mapa.states.activo',
    colorEncendido: 0xe8f0ff,
    posicion: { x: 0.75, y: 0, z: 2.25 },
    dimensiones: { w: 2.5, h: 2.8, d: 3.5 },
  },
  {
    id: 'entrada',
    nombreKey: 'mapa.rooms.entrada',
    icono: '🚪',
    dispositivosKeys: ['mapa.devices.lock', 'mapa.devices.cam', 'mapa.devices.motion', 'mapa.devices.intercom'],
    escenaKey: 'mapa.scenes.seguridad',
    estadoKey: 'mapa.states.activa',
    colorEncendido: 0xd4e8c4,
    posicion: { x: 3.5, y: 0, z: 2.25 },
    dimensiones: { w: 3, h: 2.8, d: 3.5 },
  },
  {
    id: 'patio',
    nombreKey: 'mapa.rooms.patio',
    icono: '🌿',
    dispositivosKeys: ['mapa.devices.landscape', 'mapa.devices.irrigation', 'mapa.devices.perimeter', 'mapa.devices.camExt'],
    escenaKey: 'mapa.scenes.exterior',
    estadoKey: 'mapa.states.encendida',
    colorEncendido: 0xc8e6c9,
    posicion: { x: 0, y: 0, z: -4.5 },
    dimensiones: { w: 10, h: 0.1, d: 3 },
  },
]

type Hab = (typeof HABITACIONES)[number] & { _light?: THREE.PointLight }

// ─── Day / Night presets (pre-allocated for lerp) ─────────────────────────────

const NIGHT = {
  bg:       new THREE.Color(0x151a2a),
  ambient:  new THREE.Color(0x303850),
  hemiSky:  new THREE.Color(0x2a3a5a),
  hemiGnd:  new THREE.Color(0x0a1508),
  dir:      new THREE.Color(0x6080b0),
  exposure: 0.85,
  fogDens:  0.014,
  ambInt:   0.3,
  hemiInt:  0.2,
  dirInt:   0.4,
  spotInt:  1.0,
  accInt:   0.6,
  roomBase: 1.6,
  patioBase: 0.5,
}

const DAY = {
  bg:       new THREE.Color(0xb4ccdf),
  ambient:  new THREE.Color(0xc8daea),
  hemiSky:  new THREE.Color(0x88bbee),
  hemiGnd:  new THREE.Color(0x556633),
  dir:      new THREE.Color(0xfff0d0),
  exposure: 1.12,
  fogDens:  0.007,
  ambInt:   0.7,
  hemiInt:  0.6,
  dirInt:   1.5,
  spotInt:  0.25,
  accInt:   0.12,
  roomBase: 0.3,
  patioBase: 0.08,
}

// ─── Procedural Textures ──────────────────────────────────────────────────────

function createWoodTexture(): THREE.CanvasTexture {
  const s = 512
  const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#B08050'; ctx.fillRect(0, 0, s, s)
  for (let y = 0; y < s; y++) {
    const n = Math.sin(y * 0.08) * 12 + Math.sin(y * 0.025 + 1.5) * 18 + (Math.random() - 0.5) * 8
    ctx.fillStyle = `rgb(${Math.min(255, Math.max(0, 176 + n)) | 0},${Math.min(255, Math.max(0, 128 + n * 0.7)) | 0},${Math.min(255, Math.max(0, 80 + n * 0.4)) | 0})`
    ctx.fillRect(0, y, s, 1)
  }
  for (let i = 1; i < 6; i++) { ctx.strokeStyle = 'rgba(60,35,10,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(i * s / 6, 0); ctx.lineTo(i * s / 6, s); ctx.stroke() }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t
}

function createTileTexture(base = '#e0ddd5', grout = '#c8c4bc'): THREE.CanvasTexture {
  const s = 256
  const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  ctx.fillStyle = grout; ctx.fillRect(0, 0, s, s)
  const ts = s / 4, g = 3
  for (let r = 0; r < 4; r++) for (let col = 0; col < 4; col++) {
    const v = (Math.random() - 0.5) * 10
    ctx.fillStyle = `rgb(${Math.min(255, Math.max(0, parseInt(base.slice(1, 3), 16) + v)) | 0},${Math.min(255, Math.max(0, parseInt(base.slice(3, 5), 16) + v)) | 0},${Math.min(255, Math.max(0, parseInt(base.slice(5, 7), 16) + v)) | 0})`
    ctx.fillRect(col * ts + g, r * ts + g, ts - g * 2, ts - g * 2)
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t
}

function createGrassTexture(): THREE.CanvasTexture {
  const s = 256
  const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#2a5a1e'; ctx.fillRect(0, 0, s, s)
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * s, y = Math.random() * s, sh = Math.random()
    ctx.fillStyle = `rgba(${20 + sh * 30 | 0},${60 + sh * 80 | 0},${10 + sh * 20 | 0},0.5)`
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 3)
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t
}

// ─── Geometry Helpers ─────────────────────────────────────────────────────────

function addBox(sc: THREE.Scene, x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; sc.add(m); return m
}
function addCyl(sc: THREE.Scene, x: number, y: number, z: number, rT: number, rB: number, h: number, seg: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; sc.add(m); return m
}
function addSphere(sc: THREE.Scene, x: number, y: number, z: number, r: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat); m.position.set(x, y, z); m.castShadow = true; sc.add(m); return m
}
function addPlane(sc: THREE.Scene, x: number, y: number, z: number, w: number, d: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; sc.add(m); return m
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Mapa() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [panelHab, setPanelHab] = useState<Hab | null>(null)
  const [showRotate, setShowRotate] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)
  const [isNight, setIsNight] = useState(true)
  const isNightRef = useRef(true)

  // sync state → ref (read in animation loop)
  useEffect(() => { isNightRef.current = isNight }, [isNight])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x151a2a)
    scene.fog = new THREE.FogExp2(0x151a2a, 0.014)

    // ── Environment map ───────────────────────────────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envSc = new THREE.Scene(); envSc.add(new THREE.HemisphereLight(0x6688aa, 0x334422, 2))
    const envMap = pmrem.fromScene(envSc).texture; scene.environment = envMap; pmrem.dispose()

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 120)
    camera.position.set(10, 12, 16); camera.lookAt(0, 0, 0)

    // ── Controls ──────────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.06
    controls.minDistance = 6; controls.maxDistance = 28
    controls.maxPolarAngle = Math.PI / 2.1; controls.target.set(0, 1, 0)
    controls.enabled = false

    // ── Textures ──────────────────────────────────────────────────────────────
    const woodTex = createWoodTexture(); woodTex.repeat.set(3, 3)
    const tileTex = createTileTexture(); tileTex.repeat.set(3, 3)
    const bathTileTex = createTileTexture('#d8dde8', '#b8bcc8'); bathTileTex.repeat.set(4, 4)
    const grassTex = createGrassTexture(); grassTex.repeat.set(8, 8)

    // ── Materials ─────────────────────────────────────────────────────────────
    const mWallExt = new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.85 })
    const mWallInt = new THREE.MeshStandardMaterial({ color: 0xf5f2ed, roughness: 0.9, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
    const mFloorWood = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.55 })
    const mFloorTile = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.3, metalness: 0.05 })
    const mFloorBath = new THREE.MeshStandardMaterial({ map: bathTileTex, roughness: 0.3, metalness: 0.05 })
    const mGlass = new THREE.MeshPhysicalMaterial({ color: 0x88bbee, transparent: true, opacity: 0.15, roughness: 0, metalness: 0.2, side: THREE.DoubleSide, depthWrite: false })
    const mMetalDark = new THREE.MeshStandardMaterial({ color: 0x2d2d30, roughness: 0.25, metalness: 0.9 })
    const mMetalFrame = new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.2, metalness: 0.92 })
    const mWoodDark = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.6 })
    const mWoodMed = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.5 })
    const mFabricDark = new THREE.MeshStandardMaterial({ color: 0x3a3a3e, roughness: 0.95 })
    const mMarble = new THREE.MeshStandardMaterial({ color: 0xf5f0ea, roughness: 0.12, metalness: 0.05 })
    const mCabinet = new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.7 })
    const mScreen = new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.05, metalness: 0.5, emissive: 0x1a2840, emissiveIntensity: 0.5 })
    const mCeramic = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    const mMirror = new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0, metalness: 1 })
    const mDoor = new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.5 })
    const mDoorHandle = new THREE.MeshStandardMaterial({ color: 0xccaa00, roughness: 0.15, metalness: 0.95 })
    const mLightBulb = new THREE.MeshStandardMaterial({ color: 0xfff8e0, emissive: 0xffd060, emissiveIntensity: 2, roughness: 0.3 })
    const mPillow = new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.92 })
    const mBedsheet = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.95 })
    const mHeadboard = new THREE.MeshStandardMaterial({ color: 0x4a4a50, roughness: 0.85 })
    const mRug = new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: 0.98 })
    const mGrass = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.9 })
    const mConcrete = new THREE.MeshStandardMaterial({ color: 0x888880, roughness: 0.85 })
    const mSteel = new THREE.MeshStandardMaterial({ color: 0xc8c8cc, roughness: 0.15, metalness: 0.8 })

    const WH = 2.8, WT = 0.12

    // ── Ground ────────────────────────────────────────────────────────────────
    addPlane(scene, 0, -0.02, -1, 30, 30, mGrass)
    addPlane(scene, 0, -0.01, 0.5, 11, 8, mConcrete) // foundation

    // ── Room Floors ───────────────────────────────────────────────────────────
    addPlane(scene, 2.25, 0.01, -1.25, 5.5, 3.5, mFloorWood)     // sala
    addPlane(scene, -2.75, 0.01, -1.25, 4.5, 3.5, mFloorTile)    // cocina
    addPlane(scene, -2.75, 0.01, 2.25, 4.5, 3.5, mFloorWood)     // habitación
    addPlane(scene, 0.75, 0.01, 2.25, 2.5, 3.5, mFloorBath)      // baño
    addPlane(scene, 3.5, 0.01, 2.25, 3, 3.5, mFloorTile)         // entrada
    const mDeck = mWoodDark.clone(); mDeck.color = new THREE.Color(0x6a5540)
    addPlane(scene, 0, 0.03, -3.7, 10, 1.4, mDeck)               // deck

    // ══════════════════════════════════════════════════════════════════════════
    // EXTERIOR WALLS
    // ══════════════════════════════════════════════════════════════════════════

    // North (z = −3) — GLASS curtain wall, faces patio
    for (const gx of [-3.75, -1.25, 1.25, 3.75])
      addBox(scene, gx, WH / 2, -3, 2.5, WH, 0.06, mGlass)
    for (const mx of [-5, -2.5, 0, 2.5, 5])
      addBox(scene, mx, WH / 2, -3, 0.06, WH, 0.08, mMetalFrame)
    addBox(scene, 0, WH, -3, 10 + WT, 0.04, 0.08, mMetalFrame)
    addBox(scene, 0, 0, -3, 10 + WT, 0.04, 0.08, mMetalFrame)

    // South (z = 4) — solid, with entrance door opening at x ≈ 3.5
    addBox(scene, -1.05, WH / 2, 4, 7.9, WH, WT, mWallExt)      // left
    addBox(scene, 4.55, WH / 2, 4, 0.9, WH, WT, mWallExt)       // right
    addBox(scene, 3.5, 2.5, 4, 1.2, 0.6, WT, mWallExt)          // above door

    // West (x = −5)
    addBox(scene, -5, WH / 2, 0.5, WT, WH, 7 + WT, mWallExt)

    // East (x = 5)
    addBox(scene, 5, WH / 2, 0.5, WT, WH, 7 + WT, mWallExt)

    // ── Windows on solid exterior walls ───────────────────────────────────────
    const addWindow = (x: number, y: number, z: number, onNS: boolean) => {
      if (onNS) {
        addBox(scene, x, y, z, 1.6, 1.3, 0.02, mGlass)
        addBox(scene, x, y + 0.68, z, 1.66, 0.05, 0.05, mMetalFrame)
        addBox(scene, x, y - 0.68, z, 1.66, 0.05, 0.05, mMetalFrame)
        addBox(scene, x - 0.83, y, z, 0.05, 1.4, 0.05, mMetalFrame)
        addBox(scene, x + 0.83, y, z, 0.05, 1.4, 0.05, mMetalFrame)
      } else {
        addBox(scene, x, y, z, 0.02, 1.3, 1.6, mGlass)
        const fx = x > 0 ? x + 0.01 : x - 0.01
        addBox(scene, fx, y + 0.68, z, 0.05, 0.05, 1.66, mMetalFrame)
        addBox(scene, fx, y - 0.68, z, 0.05, 0.05, 1.66, mMetalFrame)
        addBox(scene, fx, y, z - 0.83, 0.05, 1.4, 0.05, mMetalFrame)
        addBox(scene, fx, y, z + 0.83, 0.05, 1.4, 0.05, mMetalFrame)
      }
    }
    addWindow(-5.07, 1.5, -1.5, false)  // west — cocina
    addWindow(-5.07, 1.5, 2.5, false)   // west — habitación
    addWindow(5.07, 1.5, -1.25, false)  // east — sala
    addWindow(-2.75, 1.5, 4.07, true)   // south — habitación

    // ══════════════════════════════════════════════════════════════════════════
    // INTERIOR WALLS
    // ══════════════════════════════════════════════════════════════════════════

    // z = 0.5 — divider social / private
    addBox(scene, -4, WH / 2, 0.5, 2, WH, WT, mWallInt)         // behind kitchen (x −5 → −3)
    addBox(scene, 0.5, WH / 2, 0.5, 4, WH, WT, mWallInt)        // central (x −1.5 → 2.5)
    addBox(scene, 4.75, WH / 2, 0.5, 0.5, WH, WT, mWallInt)     // corner (x 4.5 → 5)
    // lintels over openings
    addBox(scene, -2.25, 2.65, 0.5, 1.5, 0.3, WT, mWallInt)     // above bedroom door (x −3 → −1.5)
    addBox(scene, 3.5, 2.65, 0.5, 2, 0.3, WT, mWallInt)         // above sala→entrada arch (x 2.5 → 4.5)

    // x = −0.5 — habitación ↔ baño
    addBox(scene, -0.5, WH / 2, 1.0, WT, WH, 1, mWallInt)       // z 0.5 → 1.5
    addBox(scene, -0.5, WH / 2, 3.4, WT, WH, 1.2, mWallInt)     // z 2.8 → 4
    addBox(scene, -0.5, 2.65, 2.15, WT, 0.3, 1.3, mWallInt)     // lintel

    // x = 2 — baño ↔ entrada
    addBox(scene, 2, WH / 2, 1.0, WT, WH, 1, mWallInt)          // z 0.5 → 1.5
    addBox(scene, 2, WH / 2, 3.4, WT, WH, 1.2, mWallInt)        // z 2.8 → 4
    addBox(scene, 2, 2.65, 2.15, WT, 0.3, 1.3, mWallInt)        // lintel

    // ══════════════════════════════════════════════════════════════════════════
    // SALA DE ESTAR  (x −0.5 → 5, z −3 → 0.5)
    // ══════════════════════════════════════════════════════════════════════════

    // L-Sofa (facing TV at z ≈ 0.35)
    addBox(scene, 2.5, 0.25, -1.3, 3.0, 0.45, 0.9, mFabricDark)     // main seat
    addBox(scene, 3.85, 0.25, -2.05, 0.7, 0.45, 0.6, mFabricDark)   // right arm seat
    addBox(scene, 2.5, 0.55, -1.7, 3.0, 0.4, 0.2, mFabricDark)      // main backrest
    addBox(scene, 4.15, 0.55, -2.05, 0.15, 0.4, 0.6, mFabricDark)   // side backrest
    // cushions
    addBox(scene, 1.4, 0.52, -1.3, 0.42, 0.32, 0.42, mPillow)
    addBox(scene, 3.4, 0.52, -1.3, 0.42, 0.32, 0.42,
      new THREE.MeshStandardMaterial({ color: 0xE8721A, roughness: 0.92 }))
    // Coffee table
    addBox(scene, 2.5, 0.35, -0.4, 1.2, 0.04, 0.6,
      new THREE.MeshPhysicalMaterial({ color: 0xeeeeff, transparent: true, opacity: 0.35, roughness: 0, metalness: 0.1, depthWrite: false }))
    for (const [cx, cz] of [[2.0, -0.15], [3.0, -0.15], [2.0, -0.65], [3.0, -0.65]])
      addCyl(scene, cx, 0.17, cz, 0.025, 0.025, 0.32, 8, mMetalDark)
    // TV + shelf (on divider wall z ≈ 0.35)
    addBox(scene, 2.25, 1.45, 0.35, 1.8, 1.0, 0.05, mScreen)
    addBox(scene, 2.25, 1.45, 0.38, 1.85, 1.05, 0.02, mMetalDark)
    addBox(scene, 2.25, 0.35, 0.28, 1.8, 0.06, 0.35, mWoodDark)
    addCyl(scene, 1.45, 0.17, 0.28, 0.03, 0.03, 0.34, 8, mMetalDark)
    addCyl(scene, 3.05, 0.17, 0.28, 0.03, 0.03, 0.34, 8, mMetalDark)
    // Floor lamp
    addCyl(scene, 4.3, 0.6, -2.5, 0.018, 0.018, 1.2, 8, mMetalDark)
    addCyl(scene, 4.3, 0, -2.5, 0.12, 0.12, 0.02, 12, mMetalDark)
    addSphere(scene, 4.3, 1.25, -2.5, 0.1, mLightBulb)
    // Rug
    addBox(scene, 2.5, 0.015, -0.9, 2.2, 0.02, 1.5, mRug)
    // Ceiling light
    addCyl(scene, 2.25, 2.75, -1.25, 0.22, 0.22, 0.04, 16, mLightBulb)

    // ══════════════════════════════════════════════════════════════════════════
    // COCINA  (x −5 → −0.5, z −3 → 0.5)
    // ══════════════════════════════════════════════════════════════════════════

    // West wall counter
    addBox(scene, -4.7, 0.45, -1.25, 0.55, 0.9, 2.5, mCabinet)
    addBox(scene, -4.7, 0.91, -1.25, 0.6, 0.04, 2.6, mMarble)
    // Divider wall counter
    addBox(scene, -3, 0.45, 0.18, 2.8, 0.9, 0.55, mCabinet)
    addBox(scene, -3, 0.91, 0.18, 2.9, 0.04, 0.6, mMarble)
    // Island
    addBox(scene, -2.5, 0.45, -1.5, 1.8, 0.9, 0.7, mCabinet)
    addBox(scene, -2.5, 0.91, -1.5, 1.85, 0.04, 0.75, mMarble)
    // Cooktop burners on west counter
    for (const bz of [-2.0, -1.6, -1.0, -0.6]) {
      const br = Math.abs(bz) > 1.5 ? 0.13 : 0.1
      addCyl(scene, -4.7, 0.95, bz, br, br, 0.02, 16, mMetalDark)
    }
    // Range hood
    addBox(scene, -4.7, 2.0, -1.3, 0.6, 0.25, 1.0, mMetalFrame)
    addCyl(scene, -4.7, 2.3, -1.3, 0.12, 0.12, 0.3, 8, mMetalFrame)
    // Fridge (south end of west counter)
    addBox(scene, -4.7, 1.0, 0.0, 0.7, 2.0, 0.65, mSteel)
    // Sink (on divider counter)
    addBox(scene, -3, 0.88, 0.18, 0.45, 0.08, 0.3,
      new THREE.MeshStandardMaterial({ color: 0x888890, roughness: 0.15, metalness: 0.9 }))
    // Ceiling light
    addCyl(scene, -2.75, 2.75, -1.25, 0.22, 0.22, 0.04, 16, mLightBulb)

    // ══════════════════════════════════════════════════════════════════════════
    // HABITACIÓN PRINCIPAL  (x −5 → −0.5, z 0.5 → 4)
    // ══════════════════════════════════════════════════════════════════════════

    // Bed (headboard against south ext wall z ≈ 3.85)
    addBox(scene, -2.75, 0.2, 2.65, 1.9, 0.35, 2.3, mWoodDark)      // base
    addBox(scene, -2.75, 0.42, 2.65, 1.85, 0.18, 2.25, mBedsheet)   // mattress
    addBox(scene, -2.75, 0.56, 2.65, 1.8, 0.1, 2.2, mBedsheet)      // sheet
    addBox(scene, -2.75, 0.8, 3.85, 2.0, 1.0, 0.1, mHeadboard)      // headboard
    // Pillows
    addBox(scene, -3.2, 0.65, 3.5, 0.5, 0.15, 0.4, mPillow)
    addBox(scene, -2.3, 0.65, 3.5, 0.5, 0.15, 0.4, mPillow)
    // Nightstands
    addBox(scene, -4.3, 0.25, 3.5, 0.5, 0.5, 0.4, mWoodDark)
    addBox(scene, -1.2, 0.25, 3.5, 0.5, 0.5, 0.4, mWoodDark)
    // Lamps
    addCyl(scene, -4.3, 0.6, 3.5, 0.04, 0.04, 0.2, 8, mMetalDark)
    addSphere(scene, -4.3, 0.75, 3.5, 0.08, mLightBulb)
    addCyl(scene, -1.2, 0.6, 3.5, 0.04, 0.04, 0.2, 8, mMetalDark)
    addSphere(scene, -1.2, 0.75, 3.5, 0.08, mLightBulb)
    // Closet (west wall)
    addBox(scene, -4.7, 1.0, 1.8, 0.5, 2.0, 1.8, mWoodMed)
    addBox(scene, -4.44, 1.0, 1.35, 0.03, 1.9, 0.8,
      new THREE.MeshStandardMaterial({ color: 0x907050, roughness: 0.4, metalness: 0.05 }))
    addBox(scene, -4.44, 1.0, 2.25, 0.03, 1.9, 0.8,
      new THREE.MeshStandardMaterial({ color: 0x907050, roughness: 0.4, metalness: 0.05 }))
    addCyl(scene, -4.42, 1.0, 1.77, 0.015, 0.015, 0.15, 8, mMetalDark)
    addCyl(scene, -4.42, 1.0, 1.87, 0.015, 0.015, 0.15, 8, mMetalDark)
    // Rug
    addBox(scene, -2.75, 0.015, 1.8, 2.0, 0.02, 1.0,
      new THREE.MeshStandardMaterial({ color: 0x5a5050, roughness: 0.98 }))
    // Ceiling light
    addCyl(scene, -2.75, 2.75, 2.25, 0.18, 0.18, 0.04, 16, mLightBulb)

    // ══════════════════════════════════════════════════════════════════════════
    // BAÑO  (x −0.5 → 2, z 0.5 → 4)
    // ══════════════════════════════════════════════════════════════════════════

    // Shower enclosure (SE corner near x=1.8, z=3.5)
    addBox(scene, 0.8, 1.2, 3.3, 0.04, 2.2, 1.2, mGlass)        // west glass
    addBox(scene, 1.4, 1.2, 2.75, 1.16, 2.2, 0.04, mGlass)      // north glass
    addCyl(scene, 1.5, 2.2, 3.5, 0.08, 0.08, 0.04, 16, mMetalFrame) // shower head
    addCyl(scene, 1.5, 2.0, 3.5, 0.018, 0.018, 0.4, 8, mMetalFrame) // pipe
    addPlane(scene, 1.4, 0.02, 3.4, 1.2, 1.0,
      new THREE.MeshStandardMaterial({ color: 0xbbc0ca, roughness: 0.3, metalness: 0.05 }))
    // Vanity (against north divider z ≈ 0.5)
    addBox(scene, 0.5, 0.5, 0.85, 1.2, 0.15, 0.5, mMarble)
    addBox(scene, 0.5, 0.3, 0.85, 1.15, 0.3, 0.45, mCabinet)
    addCyl(scene, 0.5, 0.55, 0.85, 0.18, 0.18, 0.08, 16, mCeramic)  // basin
    addCyl(scene, 0.5, 0.65, 0.85, 0.015, 0.015, 0.22, 8, mMetalFrame) // faucet
    // Mirror
    addBox(scene, 0.5, 1.5, 0.56, 0.9, 0.7, 0.03, mMirror)
    addBox(scene, 0.5, 1.5, 0.54, 0.95, 0.75, 0.015, mMetalDark)
    // Toilet
    addBox(scene, 1.7, 0.2, 2.0, 0.4, 0.4, 0.55, mCeramic)
    addBox(scene, 1.7, 0.42, 2.15, 0.38, 0.08, 0.45, mCeramic)
    addBox(scene, 1.7, 0.5, 1.75, 0.4, 0.5, 0.1, mCeramic)
    // Towel rail
    addBox(scene, 1.9, 1.0, 2.6, 0.04, 0.04, 0.3, mMetalFrame)
    addBox(scene, 1.9, 1.2, 2.6, 0.04, 0.04, 0.3, mMetalFrame)
    addBox(scene, 1.9, 1.1, 2.45, 0.04, 0.24, 0.04, mMetalFrame)
    addBox(scene, 1.9, 1.1, 2.75, 0.04, 0.24, 0.04, mMetalFrame)
    // Ceiling light
    addCyl(scene, 0.75, 2.75, 2.25, 0.15, 0.15, 0.04, 16, mLightBulb)

    // ══════════════════════════════════════════════════════════════════════════
    // ENTRADA  (x 2 → 5, z 0.5 → 4)
    // ══════════════════════════════════════════════════════════════════════════

    // Main door
    addBox(scene, 3.5, 1.05, 3.95, 1.0, 2.1, 0.08, mDoor)
    addSphere(scene, 3.9, 1.0, 3.91, 0.04, mDoorHandle)
    // Console table
    addBox(scene, 4.5, 0.4, 1.5, 0.8, 0.06, 0.35, mWoodDark)
    for (const [lx, lz] of [[4.15, 1.35], [4.85, 1.35], [4.15, 1.65], [4.85, 1.65]])
      addCyl(scene, lx, 0.2, lz, 0.025, 0.025, 0.38, 8, mMetalDark)
    // Security camera
    addBox(scene, 4.7, 2.4, 3.6, 0.12, 0.1, 0.15, mMetalDark)
    addCyl(scene, 4.7, 2.3, 3.5, 0.05, 0.07, 0.1, 8, mMetalDark)
    // Pendant light
    addCyl(scene, 3.5, 2.2, 2.25, 0.18, 0.18, 0.12, 16, mMetalFrame)
    addSphere(scene, 3.5, 2.1, 2.25, 0.06, mLightBulb)
    // Doormat
    addBox(scene, 3.5, 0.015, 3.5, 0.8, 0.02, 0.45,
      new THREE.MeshStandardMaterial({ color: 0x5a5040, roughness: 0.98 }))

    // ══════════════════════════════════════════════════════════════════════════
    // PATIO  (x −5 → 5, z −6 → −3)
    // ══════════════════════════════════════════════════════════════════════════

    // Bushes
    const bushColors = [0x2d6a2e, 0x3a7a3a, 0x2a6028, 0x357035]
    const bushData: [number, number, number, number][] = [
      [-4, 0.4, -5, 0.5], [-2.5, 0.3, -5.5, 0.35],
      [3.5, 0.45, -5, 0.5], [1.5, 0.3, -5.5, 0.35],
    ]
    bushData.forEach(([bx, by, bz, br], i) =>
      addSphere(scene, bx, by, bz, br,
        new THREE.MeshStandardMaterial({ color: bushColors[i % bushColors.length], roughness: 0.9 })))
    // Garden bollard lights
    const gardenGlow = new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffcc60, emissiveIntensity: 1.5, roughness: 0.3 })
    for (const gx of [-1.5, 1.5]) {
      addCyl(scene, gx, 0.3, -4.5, 0.025, 0.025, 0.6, 8, mMetalDark)
      addSphere(scene, gx, 0.65, -4.5, 0.05, gardenGlow)
    }
    addCyl(scene, 0, 0.3, -5.3, 0.025, 0.025, 0.6, 8, mMetalDark)
    addSphere(scene, 0, 0.65, -5.3, 0.05, gardenGlow)
    // Stone path
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xa09890, roughness: 0.8 })
    addBox(scene, 0, 0.02, -4.5, 1.0, 0.04, 0.45, stoneMat)
    addBox(scene, 0.15, 0.02, -5.0, 0.9, 0.04, 0.4, stoneMat)
    addBox(scene, -0.1, 0.02, -5.5, 0.85, 0.04, 0.4, stoneMat)
    // Planters near glass wall
    addBox(scene, -4.5, 0.2, -3.3, 0.5, 0.4, 0.5, mConcrete)
    addSphere(scene, -4.5, 0.55, -3.3, 0.3,
      new THREE.MeshStandardMaterial({ color: 0x3a8a3a, roughness: 0.9 }))
    addBox(scene, 4.5, 0.2, -3.3, 0.5, 0.4, 0.5, mConcrete)
    addSphere(scene, 4.5, 0.55, -3.3, 0.3,
      new THREE.MeshStandardMaterial({ color: 0x2d7a2e, roughness: 0.9 }))

    // ══════════════════════════════════════════════════════════════════════════
    // HIT MESHES  (invisible, for raycasting)
    // ══════════════════════════════════════════════════════════════════════════

    const habitacionMeshes: THREE.Mesh[] = []
    const habs: Hab[] = HABITACIONES.map(h => ({ ...h }))
    habs.forEach((hab) => {
      const { posicion: p, dimensiones: d } = hab
      const hm = new THREE.Mesh(new THREE.BoxGeometry(d.w, d.h, d.d), new THREE.MeshBasicMaterial({ visible: false }))
      hm.position.set(p.x, d.h / 2, p.z)
      hm.userData.id = hab.id
      scene.add(hm)
      habitacionMeshes.push(hm)
    })

    // ══════════════════════════════════════════════════════════════════════════
    // LIGHTING
    // ══════════════════════════════════════════════════════════════════════════

    const ambientLight = new THREE.AmbientLight(0x303850, 0.3)
    scene.add(ambientLight)

    const hemiLight = new THREE.HemisphereLight(0x2a3a5a, 0x0a1508, 0.2)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0x6080b0, 0.4)
    dirLight.position.set(-8, 15, 10)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048; dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.camera.near = 1; dirLight.shadow.camera.far = 40
    dirLight.shadow.camera.left = -12; dirLight.shadow.camera.right = 12
    dirLight.shadow.camera.top = 12; dirLight.shadow.camera.bottom = -12
    dirLight.shadow.bias = -0.001
    scene.add(dirLight)

    // per-room interior lights
    habs.forEach((hab) => {
      const isPatio = hab.id === 'patio'
      const pl = new THREE.PointLight(hab.colorEncendido, isPatio ? 0.5 : 1.6, isPatio ? 6 : 8)
      pl.position.set(hab.posicion.x, isPatio ? 1 : 2.4, hab.posicion.z)
      if (!isPatio) { pl.castShadow = true; pl.shadow.mapSize.width = 512; pl.shadow.mapSize.height = 512 }
      scene.add(pl)
      hab._light = pl
    })

    // accent lights
    const spotLight = new THREE.SpotLight(0xffd699, 1.0, 6, Math.PI / 4, 0.5)
    spotLight.position.set(2.5, 2.7, -1.25); spotLight.target.position.set(2.5, 0, -1.25)
    scene.add(spotLight); scene.add(spotLight.target)

    const kitchenAccent = new THREE.PointLight(0xfff0d0, 0.6, 3)
    kitchenAccent.position.set(-4.5, 1.2, -1.25)
    scene.add(kitchenAccent)

    // ══════════════════════════════════════════════════════════════════════════
    // HOTSPOTS
    // ══════════════════════════════════════════════════════════════════════════

    const hotspotEls: Record<string, HTMLDivElement> = {}
    habs.forEach((hab) => {
      const el = document.createElement('div'); el.className = 'mapa-hotspot'
      const bubble = document.createElement('div'); bubble.className = 'mapa-hotspot__bubble'
      bubble.textContent = hab.icono + ' ' + t(hab.nombreKey)
      el.appendChild(bubble)
      el.addEventListener('click', (e) => { e.stopPropagation(); setPanelHab(hab) })
      container.appendChild(el)
      hotspotEls[hab.id] = el
    })

    // ══════════════════════════════════════════════════════════════════════════
    // RAYCASTING
    // ══════════════════════════════════════════════════════════════════════════

    const raycaster = new THREE.Raycaster()
    const onCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(habitacionMeshes)
      if (hits.length > 0) {
        const hab = habs.find(h => h.id === hits[0].object.userData.id)
        if (hab) setPanelHab(hab)
      }
    }
    renderer.domElement.addEventListener('click', onCanvasClick)

    // ══════════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ══════════════════════════════════════════════════════════════════════════

    let introAngle = Math.PI * 0.25
    let introFrame = 0
    let introActive = true
    const INTRO_DURATION = 240
    const LERP = 0.03     // smooth day↔night transition speed
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = performance.now() * 0.001

      // ── Intro orbit ─────────────────────────────────────────────────────────
      if (introActive) {
        introFrame++
        introAngle += 0.006
        camera.position.x = Math.sin(introAngle) * 15
        camera.position.z = Math.cos(introAngle) * 15
        camera.position.y = 11 + Math.sin(introFrame * 0.018) * 1.5
        camera.lookAt(0, 1, 0)
        if (introFrame >= INTRO_DURATION) {
          introActive = false
          controls.enabled = true
          setTimeout(() => setHintVisible(false), 5000)
        }
      }

      // ── Day ↔ Night smooth transition ───────────────────────────────────────
      const mode = isNightRef.current ? NIGHT : DAY
      const bg = scene.background as THREE.Color
      bg.lerp(mode.bg, LERP)
      const fog = scene.fog as THREE.FogExp2
      fog.color.lerp(mode.bg, LERP)
      fog.density += (mode.fogDens - fog.density) * LERP
      renderer.toneMappingExposure += (mode.exposure - renderer.toneMappingExposure) * LERP

      ambientLight.color.lerp(mode.ambient, LERP)
      ambientLight.intensity += (mode.ambInt - ambientLight.intensity) * LERP
      hemiLight.color.lerp(mode.hemiSky, LERP)
      hemiLight.groundColor.lerp(mode.hemiGnd, LERP)
      hemiLight.intensity += (mode.hemiInt - hemiLight.intensity) * LERP
      dirLight.color.lerp(mode.dir, LERP)
      dirLight.intensity += (mode.dirInt - dirLight.intensity) * LERP
      spotLight.intensity += (mode.spotInt - spotLight.intensity) * LERP
      kitchenAccent.intensity += (mode.accInt - kitchenAccent.intensity) * LERP

      // ── Room lights (flicker + mode) ────────────────────────────────────────
      habs.forEach((hab) => {
        if (!hab._light) return
        const base = hab.id === 'patio' ? mode.patioBase : mode.roomBase
        const target = base + 0.15 * Math.sin(time * 1.2 + hab.posicion.x * 0.5)
        hab._light.intensity += (target - hab._light.intensity) * LERP
      })

      // ── Position hotspots ───────────────────────────────────────────────────
      habs.forEach((hab) => {
        const el = hotspotEls[hab.id]; if (!el) return
        const hotspotY = hab.id === 'patio' ? 1.5 : hab.dimensiones.h + 0.5
        const pos3D = new THREE.Vector3(hab.posicion.x, hotspotY, hab.posicion.z)
        pos3D.project(camera)
        const x = (pos3D.x * 0.5 + 0.5) * container.clientWidth
        const y = (-pos3D.y * 0.5 + 0.5) * container.clientHeight
        const visible = pos3D.z > -1 && pos3D.z < 1 && x > 0 && x < container.clientWidth && y > 0 && y < container.clientHeight
        el.style.left = x + 'px'; el.style.top = y + 'px'
        el.style.display = visible ? 'block' : 'none'
      })

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Orientation ───────────────────────────────────────────────────────────
    const checkOrientation = () => {
      const dismissed = sessionStorage.getItem('rotate-dismissed')
      setShowRotate(window.innerWidth < 768 && window.innerHeight > window.innerWidth && !dismissed)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 350))

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('resize', checkOrientation)
      renderer.domElement.removeEventListener('click', onCanvasClick)
      Object.values(hotspotEls).forEach(el => el.remove())
      woodTex.dispose(); tileTex.dispose(); bathTileTex.dispose(); grassTex.dispose()
      envMap.dispose(); renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  const waMsg = panelHab
    ? encodeURIComponent(t('mapa.whatsappMsg', { room: t(panelHab.nombreKey), devices: panelHab.dispositivosKeys.map(k => t(k)).join(', ') }))
    : ''

  return (
    <main className='mapa-main'>
      {showRotate && (
        <div className='mapa-rotate-overlay'>
          <div className='mapa-rotate-content'>
            <div className='mapa-rotate-icon'>📱</div>
            <span className='mapa-rotate-arrow'>↻</span>
            <h2>{t('mapa.rotateTitle')}</h2>
            <p>{t('mapa.rotateDesc')}</p>
            <hr className='mapa-rotate-divider' />
            <p className='mapa-rotate-note'>{t('mapa.rotateNote')}</p>
            <button className='mapa-btn-continuar' tabIndex={5} onClick={() => { sessionStorage.setItem('rotate-dismissed', '1'); setShowRotate(false) }}>
              {t('mapa.rotateContinue')}
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} className='mapa-canvas-container' />

      <aside className={`mapa-info-panel${panelHab ? '' : ' mapa-info-panel--hidden'}`}>
        <div className='mapa-info-panel__header'>
          <span className='mapa-info-icono'>{panelHab?.icono}</span>
          <h3>{panelHab ? t(panelHab.nombreKey) : ''}</h3>
          <button className='mapa-info-close' tabIndex={5} onClick={() => setPanelHab(null)}>✕</button>
        </div>
        <div className='mapa-info-panel__body'>
          <p className='mapa-info-categoria'>{t('mapa.devicesInstalled')}</p>
          <ul className='mapa-info-dispositivos'>
            {panelHab?.dispositivosKeys.map((d) => <li key={d}>{t(d)}</li>)}
          </ul>
          <div className='mapa-info-estado'>
            <span className='mapa-info-label'>{t('mapa.status')}</span>
            <span className='mapa-info-badge'>{panelHab ? t(panelHab.estadoKey) : ''}</span>
          </div>
          <div className='mapa-info-escena'>
            <span className='mapa-info-label'>{t('mapa.activeScene')}</span>
            <span className='mapa-info-escena-val'>{panelHab ? t(panelHab.escenaKey) : ''}</span>
          </div>
        </div>
        <div className='mapa-info-panel__footer'>
          <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target='_blank' rel='noopener noreferrer' className='mapa-btn-cta-whatsapp' tabIndex={4}>
            {t('mapa.whatsappCta')}
          </a>
        </div>
      </aside>

      {/* Day / Night toggle */}
      <button className='mapa-mode-toggle' tabIndex={5} onClick={() => setIsNight(n => !n)}>
        {isNight ? t('mapa.modeDay') : t('mapa.modeNight')}
      </button>

      {hintVisible && (
        <div className='mapa-controls-hint'>
          {t('mapa.hint')}
        </div>
      )}
    </main>
  )
}