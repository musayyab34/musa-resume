import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep, stagger } from '../journeyConfig'
import { cloneBlueprintPair, PALETTE, setBlueprintProgress, type BlueprintPair } from '../materials/blueprintSolid'
import { PairMesh, useBlueprintPair } from './helpers'

interface Item {
  kind: 'rack' | 'db' | 'node'
  pos: [number, number, number]
}

/** Racks, database cylinders, and network nodes — applied in order. */
const ITEMS: Item[] = [
  { kind: 'rack', pos: [-6.5, 0, -2] },
  { kind: 'rack', pos: [-4.2, 0, -4.5] },
  { kind: 'db', pos: [0, -0.3, -6] },
  { kind: 'rack', pos: [4.2, 0, -4.5] },
  { kind: 'rack', pos: [6.5, 0, -2] },
  { kind: 'node', pos: [-3.5, 2.6, -7.5] },
  { kind: 'db', pos: [2.5, -0.3, -1] },
  { kind: 'rack', pos: [-2, 0, 0.5] },
  { kind: 'node', pos: [4, 2.9, -8] },
  { kind: 'rack', pos: [1.5, 0, 2.5] },
]

/**
 * Stage 04 — the clearest expression of the signature: a blueprint floor grid
 * where infrastructure resolves into place one resource at a time,
 * like a terraform apply executing in front of you.
 */
export default function IacControlRoom() {
  const light = useRef<THREE.PointLight>(null)
  const tipMats = useRef<THREE.MeshBasicMaterial[]>([])

  const rackPair = useBlueprintPair({ color: '#1c222e', emissive: PALETTE.teal, maxEmissive: 0.08 })
  const dbPair = useBlueprintPair({ color: '#232936', emissive: PALETTE.teal, maxEmissive: 0.1, roughness: 0.35 })
  const nodePair = useBlueprintPair({ color: '#2a3040', emissive: PALETTE.amber, maxEmissive: 0.22, roughness: 0.3 })
  // One extra pair per kind isn't enough for per-item stagger with shared
  // materials — so each item gets its own lightweight pair.
  const pairs = useRef<BlueprintPair[]>([])

  const rackGeo = useMemo(() => new THREE.BoxGeometry(1.7, 3.1, 1.1), [])
  const dbGeo = useMemo(() => new THREE.CylinderGeometry(1.05, 1.05, 2.4, 20), [])
  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.7, 0), [])
  const kinds = { rack: rackPair, db: dbPair, node: nodePair }

  const itemPairs = useMemo(
    () =>
      ITEMS.map((item) => {
        const pair = cloneBlueprintPair(kinds[item.kind])
        pairs.current.push(pair)
        return pair
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(() => {
    const p = scrollState.section[4]
    const t = smoothstep(p, 0.12, 0.72)
    itemPairs.forEach((pair, i) => setBlueprintProgress(pair, stagger(t, i, ITEMS.length, 0.62)))
    if (light.current) light.current.intensity = 8 * t
    const tipOpacity = smoothstep(t, 0.85, 1) * 0.9
    tipMats.current.forEach((m) => {
      if (m) m.opacity = tipOpacity
    })
  })

  return (
    <group position={ROOMS.iac as unknown as THREE.Vector3Tuple}>
      <Grid
        position={[0, -1.55, -3]}
        args={[44, 44]}
        cellSize={1.1}
        cellThickness={0.6}
        cellColor="#1d4f4a"
        sectionSize={5.5}
        sectionThickness={1.1}
        sectionColor="#2a7a72"
        fadeDistance={38}
        fadeStrength={2}
      />

      {ITEMS.map((item, i) => {
        const geo = item.kind === 'rack' ? rackGeo : item.kind === 'db' ? dbGeo : nodeGeo
        return (
          <PairMesh
            key={`${item.kind}-${item.pos[0]}-${item.pos[2]}`}
            pair={itemPairs[i]}
            geometry={geo}
            position={item.pos}
            wireMode={item.kind === 'node' ? 'wireframe' : 'edges'}
          />
        )
      })}

      {/* status tips on rack tops — the "applied" lights */}
      {ITEMS.filter((it) => it.kind === 'rack').map((item) => (
        <mesh key={`tip-${item.pos[0]}-${item.pos[2]}`} position={[item.pos[0] + 0.6, item.pos[1] + 1.68, item.pos[2] + 0.3]}>
          <boxGeometry args={[0.18, 0.06, 0.18]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m && !tipMats.current.includes(m)) tipMats.current.push(m)
            }}
            color={PALETTE.amber}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}

      <pointLight ref={light} position={[0, 8, 0]} color="#d7f2ee" intensity={0} distance={36} decay={2} />
    </group>
  )
}
