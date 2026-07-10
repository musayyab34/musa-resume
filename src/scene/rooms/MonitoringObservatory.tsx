import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep } from '../journeyConfig'
import { PALETTE } from '../materials/blueprintSolid'

const PANEL_COUNT = 16
const DOME_RADIUS = 11

/**
 * Stage 05 — a planetarium of dashboard panels orbiting like constellations.
 * The one room allowed to use alert red: a single panel pulses red and
 * resolves to teal past the room's midpoint. Things break; he fixes them.
 */
export default function MonitoringObservatory() {
  const dome = useRef<THREE.Group>(null)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])
  const red = useMemo(() => new THREE.Color(PALETTE.red), [])
  const teal = useMemo(() => new THREE.Color(PALETTE.teal), [])
  const green = useMemo(() => new THREE.Color('#5CE0A8'), [])
  const dimTeal = useMemo(() => new THREE.Color('#2b6b64'), [])

  // Fibonacci hemisphere placement, panels facing the observer at the center.
  const panels = useMemo(() => {
    const list: { pos: THREE.Vector3; scale: number }[] = []
    for (let i = 0; i < PANEL_COUNT; i++) {
      const phi = Math.acos(1 - ((i + 0.5) / PANEL_COUNT) * 0.85)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const pos = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * DOME_RADIUS,
        Math.cos(phi) * DOME_RADIUS * 0.75 + 2,
        Math.sin(phi) * Math.sin(theta) * DOME_RADIUS,
      )
      list.push({ pos, scale: 0.85 + (i % 4) * 0.16 })
    }
    return list
  }, [])

  useFrame(({ clock }) => {
    const p = scrollState.section[5]
    const t = smoothstep(p, 0.12, 0.45)
    const resolved = smoothstep(p, 0.52, 0.68)
    if (dome.current) dome.current.rotation.y = clock.elapsedTime * 0.035

    mats.current.forEach((mat, i) => {
      if (!mat) return
      mat.opacity = 0.92 * smoothstep(t, i / PANEL_COUNT * 0.5, 0.5 + (i / PANEL_COUNT) * 0.5)
      if (i === 0) {
        // The incident panel: red pulse → resolves to green-teal.
        const pulse = 0.55 + Math.sin(clock.elapsedTime * 5.2) * 0.45
        mat.emissive.copy(red).lerp(green, resolved)
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.9 * pulse, 0.35, resolved)
      } else {
        mat.emissive.copy(dimTeal).lerp(teal, 0.25 + 0.4 * Math.sin(i * 3.7) ** 2)
        mat.emissiveIntensity = 0.28 * t
      }
    })
  })

  return (
    <group position={ROOMS.monitoring as unknown as THREE.Vector3Tuple}>
      <group ref={dome}>
        {panels.map((panel, i) => (
          <mesh key={i} position={panel.pos} scale={panel.scale} onUpdate={(m) => m.lookAt(0, 2, 0)}>
            <boxGeometry args={[2.6, 1.6, 0.09]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) mats.current[i] = m
              }}
              color="#10141d"
              emissive="#2b6b64"
              emissiveIntensity={0}
              transparent
              opacity={0}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* faint dome wireframe */}
      <mesh>
        <sphereGeometry args={[DOME_RADIUS + 2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
        <meshBasicMaterial color={PALETTE.teal} wireframe transparent opacity={0.028} depthWrite={false} />
      </mesh>

      <pointLight position={[0, 4, 0]} color="#6fd8cd" intensity={14} distance={30} decay={2} />
    </group>
  )
}
