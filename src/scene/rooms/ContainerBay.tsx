import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { containerLabels } from '../../content/cv'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep, stagger } from '../journeyConfig'
import { PALETTE, setBlueprintProgress } from '../materials/blueprintSolid'
import { PairMesh, useBlueprintPair } from './helpers'

const MONO = '/fonts/DepartureMono-Regular.otf'
const BG_COUNT = 18

/** Stage 02 — cargo containers sliding along a track, labeled with real projects. */
export default function ContainerBay() {
  const heroRow = useRef<THREE.Group>(null)
  const labelRefs = useRef<{ fillOpacity: number }[]>([])
  const light = useRef<THREE.PointLight>(null)

  const pairs = [
    useBlueprintPair({ color: '#1d2330', emissive: PALETTE.teal, maxEmissive: 0.05 }),
    useBlueprintPair({ color: '#252b3a', emissive: PALETTE.teal, maxEmissive: 0.05 }),
    useBlueprintPair({ color: '#1d2330', emissive: PALETTE.teal, maxEmissive: 0.05 }),
    useBlueprintPair({ color: '#252b3a', emissive: PALETTE.teal, maxEmissive: 0.05 }),
  ]
  const boxGeo = useMemo(() => new THREE.BoxGeometry(3.2, 2.3, 2.3), [])

  const bgBoxes = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < BG_COUNT; i++) {
      items.push({
        pos: [-14 + (i % 6) * 5.6, 1.15 + Math.floor(i / 6) * 2.5, -10 - Math.floor(i / 6) * 3.2],
        scale: 0.95 + Math.random() * 0.1,
      })
    }
    return items
  }, [])

  useFrame(() => {
    const p = scrollState.section[2]
    const t = smoothstep(p, 0.14, 0.55)
    pairs.forEach((pair, i) => setBlueprintProgress(pair, stagger(t, i, pairs.length)))
    labelRefs.current.forEach((label, i) => {
      if (label) label.fillOpacity = 0.95 * smoothstep(stagger(t, i, pairs.length), 0.6, 1)
    })
    // The row drifts along the track like a shipping yard conveyor.
    if (heroRow.current) heroRow.current.position.x = THREE.MathUtils.lerp(5, -5, smoothstep(p, 0.2, 0.85))
    if (light.current) light.current.intensity = 11 * t
  })

  return (
    <group position={ROOMS.containers as unknown as THREE.Vector3Tuple}>
      {/* track rails */}
      <mesh position={[0, -1.35, 1.2]}>
        <boxGeometry args={[36, 0.12, 0.25]} />
        <meshStandardMaterial color="#2a3040" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, -1.35, -1.2]}>
        <boxGeometry args={[36, 0.12, 0.25]} />
        <meshStandardMaterial color="#2a3040" roughness={0.5} metalness={0.6} />
      </mesh>

      <group ref={heroRow}>
        {containerLabels.map((label, i) => (
          <group key={label} position={[(i - 1.5) * 4.4, 0, 0]}>
            <PairMesh pair={pairs[i]} geometry={boxGeo} />
            <Text
              ref={(t) => {
                if (t) labelRefs.current[i] = t as unknown as { fillOpacity: number }
              }}
              font={MONO}
              fontSize={0.27}
              color={PALETTE.bone}
              anchorX="center"
              position={[0, 1.65, 0.6]}
              fillOpacity={0}
            >
              {label}
            </Text>
          </group>
        ))}
      </group>

      {bgBoxes.map((b) => (
        <mesh key={`${b.pos[0]}-${b.pos[1]}`} position={b.pos} scale={b.scale}>
          <boxGeometry args={[3.2, 2.3, 2.3]} />
          <meshStandardMaterial color="#1a2130" emissive="#131a29" emissiveIntensity={0.5} roughness={0.8} metalness={0.25} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -4]}>
        <planeGeometry args={[48, 30]} />
        <meshStandardMaterial color="#0b0e15" roughness={0.9} />
      </mesh>
      <pointLight ref={light} position={[0, 7, 4]} color="#b8e8e3" intensity={0} distance={34} decay={1.9} />
    </group>
  )
}
