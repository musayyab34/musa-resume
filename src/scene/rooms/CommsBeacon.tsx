import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep } from '../journeyConfig'
import { PALETTE } from '../materials/blueprintSolid'

const WAVES = [0, 1, 2]

/** Exit — a quiet signal mast broadcasting. Functional, not spectacle. */
export default function CommsBeacon() {
  const waveMats = useRef<THREE.MeshBasicMaterial[]>([])
  const waves = useRef<THREE.Mesh[]>([])

  useFrame(({ clock }) => {
    const p = scrollState.section[8]
    const on = smoothstep(p, 0.05, 0.35)
    WAVES.forEach((w) => {
      const cycle = (clock.elapsedTime * 0.4 + w / WAVES.length) % 1
      const mesh = waves.current[w]
      const mat = waveMats.current[w]
      if (mesh) mesh.scale.setScalar(0.5 + cycle * 5)
      if (mat) mat.opacity = on * 0.5 * (1 - cycle)
    })
  })

  return (
    <group position={ROOMS.comms as unknown as THREE.Vector3Tuple}>
      {/* mast */}
      <mesh position={[-11, 2, -8]}>
        <cylinderGeometry args={[0.08, 0.16, 9, 10]} />
        <meshStandardMaterial color="#2a3040" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[-11, 6.6, -8]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color={PALETTE.teal} toneMapped={false} />
      </mesh>

      {/* expanding signal rings */}
      {WAVES.map((w) => (
        <mesh
          key={w}
          position={[-11, 6.6, -8]}
          rotation={[Math.PI / 2, 0, 0]}
          ref={(m) => {
            if (m) waves.current[w] = m
          }}
        >
          <torusGeometry args={[1, 0.02, 6, 40]} />
          <meshBasicMaterial
            ref={(mat) => {
              if (mat) waveMats.current[w] = mat
            }}
            color={PALETTE.teal}
            transparent
            opacity={0}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
