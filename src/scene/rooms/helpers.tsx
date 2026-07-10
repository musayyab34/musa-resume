import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { createBlueprintPair, disposeBlueprintPair, type BlueprintOptions, type BlueprintPair } from '../materials/blueprintSolid'

/** Memoized blueprint material pair with disposal on unmount. */
export function useBlueprintPair(opts: BlueprintOptions = {}): BlueprintPair {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pair = useMemo(() => createBlueprintPair(opts), [])
  useEffect(() => () => disposeBlueprintPair(pair), [pair])
  return pair
}

interface PairMeshProps {
  pair: BlueprintPair
  geometry: THREE.BufferGeometry
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  /** 'edges' draws clean outline lines (hard-surface); 'wireframe' shows triangles (curved). */
  wireMode?: 'edges' | 'wireframe'
}

/** Co-located solid body + schematic, sharing one geometry. */
export function PairMesh({ pair, geometry, position, rotation, scale, wireMode = 'edges' }: PairMeshProps) {
  const edges = useMemo(
    () => (wireMode === 'edges' ? new THREE.EdgesGeometry(geometry, 24) : null),
    [geometry, wireMode],
  )
  useEffect(() => () => edges?.dispose(), [edges])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={pair.solid} />
      {edges ? <lineSegments geometry={edges} material={pair.line} /> : <mesh geometry={geometry} material={pair.wire} />}
    </group>
  )
}
