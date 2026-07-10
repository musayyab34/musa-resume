import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep, stagger } from '../journeyConfig'
import { cloneBlueprintPair, PALETTE, setBlueprintProgress } from '../materials/blueprintSolid'
import { PairMesh, useBlueprintPair } from './helpers'

/** One pod per project — full cards live in the DOM grid. */
const POD_NAMES = ['MIGRATION', 'CAGECALLS', 'COST-REPORT', 'ROUTE53', 'FYP-PIPELINE', 'CLOUDERA']

/** Stage 07 — the hangar bay of project pods. The DOM grid carries the detail. */
export default function ProjectsHangar() {
  const light = useRef<THREE.PointLight>(null)
  const bobs = useRef<THREE.Group[]>([])

  const basePair = useBlueprintPair({ color: '#202633', emissive: PALETTE.amber, maxEmissive: 0.06, roughness: 0.45 })
  const podGeo = useMemo(() => new THREE.BoxGeometry(3.4, 2.2, 2.6), [])

  const podPairs = useMemo(
    () => POD_NAMES.map(() => cloneBlueprintPair(basePair)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const positions = useMemo(
    () =>
      POD_NAMES.map((_, i): [number, number, number] => [((i % 3) - 1) * 5.6, 0.2, Math.floor(i / 3) * -6.5 - 2]),
    [],
  )

  useFrame(({ clock }) => {
    const p = scrollState.section[7]
    const t = smoothstep(p, 0.1, 0.5)
    podPairs.forEach((pair, i) => setBlueprintProgress(pair, stagger(t, i, POD_NAMES.length)))
    bobs.current.forEach((g, i) => {
      if (g) g.position.y = Math.sin(clock.elapsedTime * 0.7 + i * 1.3) * 0.12
    })
    if (light.current) light.current.intensity = 10 * t
  })

  return (
    <group position={ROOMS.hangar as unknown as THREE.Vector3Tuple}>
      {POD_NAMES.map((name, i) => (
        <group
          key={name}
          ref={(g) => {
            if (g) bobs.current[i] = g
          }}
        >
          <PairMesh pair={podPairs[i]} geometry={podGeo} position={positions[i]} />
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -5]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#0b0e15" roughness={0.85} />
      </mesh>
      <pointLight ref={light} position={[0, 6, 2]} color="#ffd8ab" intensity={0} distance={34} decay={2} />
    </group>
  )
}
