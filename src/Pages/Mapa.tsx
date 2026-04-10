import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import '../Styles/Mapa.css'

// ─── Datos ────────────────────────────────────────────────────────────────────

const WA_NUMBER = '573014032120'

const HABITACIONES = [
  {
    id: 'sala',
    nombre: 'Sala Principal',
    icono: '🛋️',
    dispositivos: ['Iluminación inteligente', 'Audio multizona', 'Control por voz'],
    escena: 'Modo Cine',
    estado: 'Encendida',
    color: 0x2d3a2d,
    colorEncendido: 0xff9955,
    posicion: { x: -3, y: 0, z: 0 },
    dimensiones: { w: 4, h: 2.5, d: 4 },
  },
  {
    id: 'cocina',
    nombre: 'Cocina',
    icono: '🍳',
    dispositivos: ['Iluminación inteligente', 'Sensor de gas', 'Sensor de humo'],
    escena: 'Modo Cocina',
    estado: 'Apagada',
    color: 0x243024,
    colorEncendido: 0xfff3e0,
    posicion: { x: 2.5, y: 0, z: 0 },
    dimensiones: { w: 3, h: 2.5, d: 3 },
  },
  {
    id: 'habitacion1',
    nombre: 'Habitación Principal',
    icono: '🛏️',
    dispositivos: ['Iluminación inteligente', 'Climatización', 'Persiana automática'],
    escena: 'Modo Descanso',
    estado: 'Encendida',
    color: 0x1a2e1a,
    colorEncendido: 0xffe8a0,
    posicion: { x: -3, y: 0, z: -5 },
    dimensiones: { w: 4, h: 2.5, d: 4 },
  },
  {
    id: 'entrada',
    nombre: 'Entrada',
    icono: '🚪',
    dispositivos: ['Cerradura inteligente', 'Cámara IP', 'Sensor de movimiento'],
    escena: 'Modo Seguridad',
    estado: 'Activa',
    color: 0x344034,
    colorEncendido: 0x88cc88,
    posicion: { x: 2.5, y: 0, z: -5 },
    dimensiones: { w: 2.5, h: 2.5, d: 2.5 },
  },
  {
    id: 'patio',
    nombre: 'Patio / Jardín',
    icono: '🌿',
    dispositivos: ['Iluminación exterior', 'Sensor de movimiento', 'Riego automático'],
    escena: 'Modo Exterior',
    estado: 'Encendida',
    color: 0x0d1a0d,
    colorEncendido: 0xc8e6c9,
    posicion: { x: 0, y: 0, z: 5 },
    dimensiones: { w: 7, h: 0.1, d: 3.5 },
  },
]

type Hab = typeof HABITACIONES[number] & { _light?: THREE.PointLight }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addBox(scene: THREE.Scene, x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}
function addCylinder(scene: THREE.Scene, x: number, y: number, z: number, r: number, h: number, mat: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 8), mat)
  mesh.position.set(x, y, z)
  scene.add(mesh)
  return mesh
}
function addSphere(scene: THREE.Scene, x: number, y: number, z: number, r: number, mat: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), mat)
  mesh.position.set(x, y, z)
  scene.add(mesh)
  return mesh
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Mapa() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [panelHab, setPanelHab] = useState<Hab | null>(null)
  const [showRotate, setShowRotate] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d1a0d)
    scene.fog = new THREE.FogExp2(0x0d1a0d, 0.025)

    // Camera
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(8, 10, 14)
    camera.lookAt(0, 0, 0)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 5
    controls.maxDistance = 32
    controls.maxPolarAngle = Math.PI / 2.15
    controls.target.set(0, 1, 0)
    controls.enabled = false

    // Piso
    const piso = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 20),
      new THREE.MeshLambertMaterial({ color: 0x1a2e1a })
    )
    piso.rotation.x = -Math.PI / 2
    piso.position.y = -0.01
    piso.receiveShadow = true
    scene.add(piso)

    // Grid
    const grid = new THREE.GridHelper(22, 22, 0x243024, 0x1e2e1e)
    grid.position.y = 0.01
    scene.add(grid)

    // Paredes exteriores
    const wm = new THREE.MeshLambertMaterial({ color: 0x2d3a2d })
    addBox(scene, -0.25, 1.5, -7.5, 9.5, 3, 0.15, wm)
    addBox(scene, -0.25, 1.5,  7,   9.5, 3, 0.15, wm)
    addBox(scene,  5,    1.5, -0.25, 0.15, 3, 14.5, wm)
    addBox(scene, -5.5,  1.5, -0.25, 0.15, 3, 14.5, wm)

    // Habitaciones
    const habitacionMeshes: THREE.Mesh[] = []
    const habs: Hab[] = HABITACIONES.map(h => ({ ...h }))

    habs.forEach((hab) => {
      const { posicion: p, dimensiones: d, color } = hab
      const mat = new THREE.MeshLambertMaterial({ color })

      const suelo = new THREE.Mesh(new THREE.PlaneGeometry(d.w - 0.1, d.d - 0.1), mat)
      suelo.rotation.x = -Math.PI / 2
      suelo.position.set(p.x, 0.02, p.z)
      suelo.receiveShadow = true
      scene.add(suelo)

      const hitMesh = new THREE.Mesh(
        new THREE.BoxGeometry(d.w, d.h, d.d),
        new THREE.MeshBasicMaterial({ visible: false })
      )
      hitMesh.position.set(p.x, d.h / 2, p.z)
      hitMesh.userData.id = hab.id
      scene.add(hitMesh)
      habitacionMeshes.push(hitMesh)

      const wi = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
      addBox(scene, p.x - d.w / 2, d.h / 2, p.z,          0.08, d.h, d.d,  wi)
      addBox(scene, p.x,           d.h / 2, p.z - d.d / 2, d.w,  d.h, 0.08, wi)

      // Muebles
      switch (hab.id) {
        case 'sala':
          addBox(scene, p.x - 0.5, 0.3,  p.z + 1.2, 2.2, 0.55, 0.7,  new THREE.MeshLambertMaterial({ color: 0x4a5a4a }))
          addBox(scene, p.x - 0.5, 0.65, p.z + 1.5, 2.2, 0.5,  0.18, new THREE.MeshLambertMaterial({ color: 0x4a5a4a }))
          addBox(scene, p.x - 0.5, 1.1,  p.z - 1.6, 1.6, 0.9,  0.06, new THREE.MeshLambertMaterial({ color: 0x111811 }))
          addBox(scene, p.x - 0.4, 0.2,  p.z + 0.2, 1.0, 0.12, 0.6,  new THREE.MeshLambertMaterial({ color: 0x3a4a3a }))
          break
        case 'cocina':
          addBox(scene,      p.x + 0.8, 0.5,  p.z - 0.9,  0.6,  0.9,  2.0,  new THREE.MeshLambertMaterial({ color: 0x3d503d }))
          addBox(scene,      p.x + 0.8, 0.95, p.z - 0.9,  0.65, 0.06, 2.1,  new THREE.MeshLambertMaterial({ color: 0x556655 }))
          addCylinder(scene, p.x + 0.7, 1.0,  p.z - 0.4,  0.12, 0.08, new THREE.MeshLambertMaterial({ color: 0x222e22 }))
          addCylinder(scene, p.x + 0.9, 1.0,  p.z - 0.4,  0.12, 0.08, new THREE.MeshLambertMaterial({ color: 0x222e22 }))
          addCylinder(scene, p.x + 0.7, 1.0,  p.z - 0.65, 0.12, 0.08, new THREE.MeshLambertMaterial({ color: 0x222e22 }))
          addCylinder(scene, p.x + 0.9, 1.0,  p.z - 0.65, 0.12, 0.08, new THREE.MeshLambertMaterial({ color: 0x222e22 }))
          break
        case 'habitacion1':
          addBox(scene, p.x,       0.18, p.z + 0.5,  1.8,  0.35, 2.8,  new THREE.MeshLambertMaterial({ color: 0x3a4a3a }))
          addBox(scene, p.x,       0.4,  p.z + 0.5,  1.75, 0.22, 2.75, new THREE.MeshLambertMaterial({ color: 0xd4b896 }))
          addBox(scene, p.x,       0.65, p.z - 0.8,  1.8,  0.9,  0.14, new THREE.MeshLambertMaterial({ color: 0x4a3a2a }))
          addBox(scene, p.x + 1.2, 0.3,  p.z - 0.3,  0.45, 0.6,  0.45, new THREE.MeshLambertMaterial({ color: 0x3a4a3a }))
          break
        case 'entrada':
          addBox(scene,    p.x,        1.05, p.z + 1.1, 0.9,  2.1,  0.08, new THREE.MeshLambertMaterial({ color: 0x4a5a3a }))
          addSphere(scene, p.x + 0.35, 1.0,  p.z + 1.1, 0.06, new THREE.MeshLambertMaterial({ color: 0xE8721A }))
          addCylinder(scene, p.x + 0.9, 2.0, p.z - 1.0, 0.08, 0.12, new THREE.MeshLambertMaterial({ color: 0x111811 }))
          break
        case 'patio':
          addSphere(scene, p.x - 2.5, 0.5,  p.z,       0.5,  new THREE.MeshLambertMaterial({ color: 0x2d6a2e }))
          addSphere(scene, p.x + 2,   0.4,  p.z + 0.8, 0.4,  new THREE.MeshLambertMaterial({ color: 0x3a7a3a }))
          addBox(scene,    p.x,       0.8,  p.z,       0.08, 1.6,  0.08, new THREE.MeshLambertMaterial({ color: 0x556644 }))
          addSphere(scene, p.x,       1.65, p.z,       0.14, new THREE.MeshLambertMaterial({ color: 0xfff3e0 }))
          break
      }

      // Luz por habitación
      if (hab.estado !== 'Apagada') {
        const light = new THREE.PointLight(hab.colorEncendido, 1.3, 7)
        light.position.set(p.x, 2.3, p.z)
        scene.add(light)
        hab._light = light
      }
    })

    // Iluminación global
    scene.add(new THREE.AmbientLight(0xf4faf5, 0.38))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.55)
    dirLight.position.set(10, 18, 12)
    dirLight.castShadow = true
    scene.add(dirLight)

    // Hotspots DOM
    const hotspotEls: Record<string, HTMLDivElement> = {}
    habs.forEach((hab) => {
      const el = document.createElement('div')
      el.className = 'mapa-hotspot'
      const bubble = document.createElement('div')
      bubble.className = 'mapa-hotspot__bubble'
      bubble.textContent = hab.icono + ' ' + hab.nombre
      el.appendChild(bubble)
      el.addEventListener('click', (e) => { e.stopPropagation(); setPanelHab(hab) })
      container.appendChild(el)
      hotspotEls[hab.id] = el
    })

    // Raycasting click
    const raycaster = new THREE.Raycaster()
    const onCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(habitacionMeshes)
      if (hits.length > 0) {
        const hab = habs.find(h => h.id === hits[0].object.userData.id)
        if (hab) setPanelHab(hab)
      }
    }
    renderer.domElement.addEventListener('click', onCanvasClick)

    // Animación
    let introAngle = Math.PI * 0.25
    let introFrame = 0
    let introActive = true
    const INTRO_DURATION = 200
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = performance.now() * 0.001

      if (introActive) {
        introFrame++
        introAngle += 0.007
        camera.position.x = Math.sin(introAngle) * 16
        camera.position.z = Math.cos(introAngle) * 16
        camera.position.y = 10 + Math.sin(introFrame * 0.02) * 1.5
        camera.lookAt(0, 1, 0)
        if (introFrame >= INTRO_DURATION) {
          introActive = false
          controls.enabled = true
          setTimeout(() => setHintVisible(false), 5000)
        }
      }

      habs.forEach((hab) => {
        if (hab._light) {
          hab._light.intensity = 1.1 + 0.2 * Math.sin(time * 1.4 + hab.posicion.x * 0.7)
        }
      })

      // Posicionar hotspots
      habs.forEach((hab) => {
        const el = hotspotEls[hab.id]
        if (!el) return
        const pos3D = new THREE.Vector3(hab.posicion.x, hab.dimensiones.h + 0.8, hab.posicion.z)
        pos3D.project(camera)
        const x = (pos3D.x * 0.5 + 0.5) * container.clientWidth
        const y = (-pos3D.y * 0.5 + 0.5) * container.clientHeight
        const visible = pos3D.z > -1 && pos3D.z < 1 && x > 0 && x < container.clientWidth && y > 0 && y < container.clientHeight
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.display = visible ? 'block' : 'none'
      })

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Orientación
    const checkOrientation = () => {
      const dismissed = sessionStorage.getItem('rotate-dismissed')
      setShowRotate(window.innerWidth < 768 && window.innerHeight > window.innerWidth && !dismissed)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 350))

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('resize', checkOrientation)
      renderer.domElement.removeEventListener('click', onCanvasClick)
      Object.values(hotspotEls).forEach(el => el.remove())
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  const waMsg = panelHab
    ? encodeURIComponent(`Hola! Vi el visualizador 3D de i-Homotic y me interesa la solución para ${panelHab.nombre}. Tiene: ${panelHab.dispositivos.join(', ')}. ¿Podemos hablar?`)
    : ''

  return (
    <main className='mapa-main'>
      {/* Overlay rotación mobile */}
      {showRotate && (
        <div className='mapa-rotate-overlay'>
          <div className='mapa-rotate-content'>
            <div className='mapa-rotate-icon'>📱</div>
            <span className='mapa-rotate-arrow'>↻</span>
            <h2>Gira tu dispositivo</h2>
            <p>Para una mejor experiencia del visualizador 3D</p>
            <hr className='mapa-rotate-divider' />
            <p className='mapa-rotate-note'>O continúa en vertical (experiencia limitada)</p>
            <button className='mapa-btn-continuar' onClick={() => { sessionStorage.setItem('rotate-dismissed', '1'); setShowRotate(false) }}>
              Continuar así
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div ref={containerRef} className='mapa-canvas-container' />

      {/* Panel lateral */}
      <aside className={`mapa-info-panel${panelHab ? '' : ' mapa-info-panel--hidden'}`}>
        <div className='mapa-info-panel__header'>
          <span className='mapa-info-icono'>{panelHab?.icono}</span>
          <h3>{panelHab?.nombre}</h3>
          <button className='mapa-info-close' onClick={() => setPanelHab(null)}>✕</button>
        </div>
        <div className='mapa-info-panel__body'>
          <p className='mapa-info-categoria'>Dispositivos instalados</p>
          <ul className='mapa-info-dispositivos'>
            {panelHab?.dispositivos.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <div className='mapa-info-estado'>
            <span className='mapa-info-label'>Estado</span>
            <span className='mapa-info-badge'>{panelHab?.estado}</span>
          </div>
          <div className='mapa-info-escena'>
            <span className='mapa-info-label'>Escena activa</span>
            <span className='mapa-info-escena-val'>{panelHab?.escena}</span>
          </div>
        </div>
        <div className='mapa-info-panel__footer'>
          <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target='_blank' rel='noopener noreferrer' className='mapa-btn-cta-whatsapp'>
            💬 Quiero esto en mi casa →
          </a>
        </div>
      </aside>

      {/* Hint */}
      {hintVisible && (
        <div className='mapa-controls-hint'>
          🖱 Arrastra para orbitar &nbsp;·&nbsp; 🔍 Scroll para zoom &nbsp;·&nbsp; Click en un espacio para explorar
        </div>
      )}
    </main>
  )
}