import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Html } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import '../Styles/Mapa.css'

// ─── Hotspots data ────────────────────────────────────────────────────────────

const hotspots = [
  { id: 1, label: '🛏️ Habitación Principal', position: [-1.5, 1.2, -2] as [number, number, number] },
  { id: 2, label: '🚪 Entrada',              position: [2.5,  1.2, -1.5] as [number, number, number] },
  { id: 3, label: '🪑 Sala Principal',       position: [-2,   1.2,  0.5] as [number, number, number] },
  { id: 4, label: '🔧 Cocina',               position: [1.5,  1.2,  0.5] as [number, number, number] },
  { id: 5, label: '🌿 Patio / Jardín',       position: [-1,   1.2,  2.5] as [number, number, number] },
]

// ─── Hotspot component ────────────────────────────────────────────────────────

function Hotspot({ label, position }: { label: string; position: [number, number, number] }) {
  return (
    <Html position={position} center>
      <div className='hotspot'>
        {label}
      </div>
    </Html>
  )
}

// ─── Simple room ──────────────────────────────────────────────────────────────

function Habitacion() {
  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Pared trasera */}
      <mesh position={[0, 1.5, -5]}>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-5, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 10]} />
        <meshStandardMaterial color="#252525" />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[5, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 10]} />
        <meshStandardMaterial color="#252525" />
      </mesh>

      {/* Cama */}
      <mesh position={[-1.5, 0.3, -2.5]} castShadow>
        <boxGeometry args={[2, 0.5, 3]} />
        <meshStandardMaterial color="#3a5c3a" />
      </mesh>

      {/* Mesa */}
      <mesh position={[-2, 0.2, 0.5]} castShadow>
        <boxGeometry args={[2.5, 0.3, 2]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>

      {/* Cocina */}
      <mesh position={[2.5, 0.4, 0.5]} castShadow>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Planta */}
      <mesh position={[-1, 0.3, 2.5]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#2d6a2e" />
      </mesh>
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Escena() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[3, 3, 3]}  intensity={0.5} color="#e8721a" />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#4c7b45" />

      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#4c7b45"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#2d3a2d"
        fadeDistance={20}
        position={[0, -0.01, 0]}
      />

      <Habitacion />

      {hotspots.map((h) => (
        <Hotspot key={h.id} label={h.label} position={h.position} />
      ))}
    </>
  )
}

// ─── Page (FIX SSR) ───────────────────────────────────────────────────────────

export default function TourVirtual() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🔥 CLAVE: evita render en servidor (Vercel)
  if (!mounted) return null

  return (
    <div className='tour-container'>
      <div className='tour-header'>
        <h2>Tour Virtual</h2>
        <p>Navega con el mouse. Arrastra para rotar, scroll para zoom.</p>
      </div>

      <Canvas
        shadows
        camera={{ position: [6, 5, 8], fov: 50 }}
        className='tour-canvas'
      >
        <Suspense fallback={null}>
          <Escena />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}