import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { linuxCommands } from '../../content/cv'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep, stagger } from '../journeyConfig'
import { PALETTE } from '../materials/blueprintSolid'
import { setBlueprintProgress } from '../materials/blueprintSolid'
import { PairMesh, useBlueprintPair } from './helpers'

const MONO = '/fonts/DepartureMono-Regular.otf'
const RING_RADII = [3.2, 4.6, 6.1]

/** Stage 01 — a single glowing core, concentric rings, floating terminals. Calm. */
export default function LinuxCore() {
  const group = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)
  const paneMats = useRef<THREE.MeshBasicMaterial[]>([])
  const paneTexts = useRef<{ fillOpacity: number }[]>([])
  const light = useRef<THREE.PointLight>(null)

  const corePair = useBlueprintPair({ color: '#1a202c', emissive: PALETTE.amber, maxEmissive: 0.05, roughness: 0.45, flatShading: true })
  const coreGlow = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.amber, transparent: true, opacity: 0, toneMapped: false }),
    [],
  )
  const ringPairA = useBlueprintPair({ maxEmissive: 0.11 })
  const ringPairB = useBlueprintPair({ maxEmissive: 0.11 })
  const ringPairC = useBlueprintPair({ maxEmissive: 0.11 })
  const ringPairs = [ringPairA, ringPairB, ringPairC]

  const discGeo = useMemo(() => new THREE.CylinderGeometry(1.05, 1.05, 0.58, 6, 1), [])
  const gapGeo = useMemo(() => new THREE.CylinderGeometry(0.82, 0.82, 0.16, 6, 1), [])
  const DISC_YS = [0.2, 0.95, 1.7, 2.45, 3.2]
  const ringGeos = useMemo(() => RING_RADII.map((r) => new THREE.TorusGeometry(r, 0.05, 8, 72)), [])

  // Clustered on the core's open side so they never sit behind the copy panel.
  const PANE_POS: [number, number, number][] = [
    [2.9, 2.9, -1.8],
    [4.4, 3.7, 0.9],
    [2.5, 1.9, 2.9],
    [4.6, 2.4, -3.0],
  ]
  const panes = useMemo(() => linuxCommands.map((cmd, i) => ({ cmd, pos: PANE_POS[i] })), [])

  useFrame(({ clock, camera }) => {
    const p = scrollState.section[1]
    const t = smoothstep(p, 0.14, 0.52)
    setBlueprintProgress(corePair, stagger(t, 0, 4))
    ringPairs.forEach((pair, i) => setBlueprintProgress(pair, stagger(t, i + 1, 4)))
    coreGlow.opacity = 0.9 * stagger(t, 0, 4)
    if (light.current) light.current.intensity = 8 * t
    if (rings.current) rings.current.rotation.y = clock.elapsedTime * 0.08
    paneMats.current.forEach((m, i) => {
      const k = smoothstep(t, 0.5 + i * 0.08, 0.75 + i * 0.08)
      if (m) m.opacity = 0.85 * k
      const text = paneTexts.current[i]
      if (text) text.fillOpacity = 0.92 * k
    })
    if (group.current) {
      group.current.children.forEach((child) => {
        if (child.name === 'pane') child.lookAt(camera.position)
      })
    }
  })

  return (
    <group ref={group} position={ROOMS.linux as unknown as THREE.Vector3Tuple}>
      {/* server core: a stack of hex discs with hot amber gaps between them */}
      {DISC_YS.map((y) => (
        <PairMesh key={y} pair={corePair} geometry={discGeo} position={[0, y, 0]} />
      ))}
      {DISC_YS.slice(0, -1).map((y) => (
        <mesh key={`gap-${y}`} geometry={gapGeo} material={coreGlow} position={[0, y + 0.375, 0]} />
      ))}
      <group ref={rings}>
        {ringGeos.map((geo, i) => (
          <PairMesh
            key={RING_RADII[i]}
            pair={ringPairs[i]}
            geometry={geo}
            position={[0, 0.4 + i * 0.35, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            wireMode="wireframe"
          />
        ))}
      </group>

      {panes.map((pane, i) => (
        <group key={pane.cmd} name="pane" position={pane.pos}>
          <mesh>
            <planeGeometry args={[4.1, 0.9]} />
            <meshBasicMaterial
              ref={(m) => {
                if (m) paneMats.current[i] = m
              }}
              color={PALETTE.steel}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Text
            ref={(t) => {
              if (t) paneTexts.current[i] = t as unknown as { fillOpacity: number }
            }}
            font={MONO}
            fontSize={0.17}
            color={PALETTE.teal}
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.02]}
            fillOpacity={0}
          >
            {pane.cmd}
          </Text>
        </group>
      ))}

      <pointLight ref={light} position={[0, 6, 5]} color="#ffd2a1" intensity={0} distance={26} decay={1.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial color="#0c0f16" roughness={0.85} metalness={0.2} />
      </mesh>
    </group>
  )
}
