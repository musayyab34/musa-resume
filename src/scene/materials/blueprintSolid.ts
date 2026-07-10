import * as THREE from 'three'
import { clamp01, smoothstep } from '../journeyConfig'

/**
 * The signature move: everything materializes from blueprint to solid.
 * Each object is a persistent set of materials on co-located meshes —
 * a teal schematic (edge lines for hard-surface shapes, triangle wireframe
 * for curved ones) and a lit solid — and the transition is a pure
 * material-property lerp. No mesh swapping, no remounts, no recompiles.
 */

export interface BlueprintPair {
  /** triangle-wireframe schematic (curved geometry) */
  wire: THREE.MeshBasicMaterial
  /** edge-line schematic (boxes, cylinders — no triangle diagonals) */
  line: THREE.LineBasicMaterial
  solid: THREE.MeshStandardMaterial
}

export interface BlueprintOptions {
  color?: THREE.ColorRepresentation
  emissive?: THREE.ColorRepresentation
  maxEmissive?: number
  roughness?: number
  metalness?: number
  wireColor?: THREE.ColorRepresentation
  flatShading?: boolean
}

export const PALETTE = {
  void: '#080A10',
  steel: '#151922',
  steelLight: '#232936',
  amber: '#FFB454',
  teal: '#4FD1C5',
  red: '#FF5C5C',
  bone: '#E8E6DE',
  coolGrey: '#9AB0C4',
} as const

export function createBlueprintPair(opts: BlueprintOptions = {}): BlueprintPair {
  const wireColor = opts.wireColor ?? PALETTE.teal
  const wire = new THREE.MeshBasicMaterial({
    color: wireColor,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  })
  const line = new THREE.LineBasicMaterial({
    color: wireColor,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  })
  const solid = new THREE.MeshStandardMaterial({
    color: opts.color ?? PALETTE.steelLight,
    emissive: opts.emissive ?? PALETTE.teal,
    emissiveIntensity: 0,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0.3,
    flatShading: opts.flatShading ?? false,
    transparent: true,
    opacity: 0,
  })
  solid.userData.maxEmissive = opts.maxEmissive ?? 0.35
  return { wire, line, solid }
}

export function cloneBlueprintPair(base: BlueprintPair): BlueprintPair {
  const pair: BlueprintPair = { wire: base.wire.clone(), line: base.line.clone(), solid: base.solid.clone() }
  pair.solid.userData.maxEmissive = base.solid.userData.maxEmissive
  return pair
}

/** Drive one pair: schematic holds, solid dissolves in, schematic recedes. */
export function setBlueprintProgress(pair: BlueprintPair, t: number) {
  const k = clamp01(t)
  const wireOpacity = 0.85 * (1 - smoothstep(k, 0.45, 0.95))
  pair.wire.opacity = wireOpacity
  pair.line.opacity = wireOpacity
  pair.solid.opacity = smoothstep(k, 0.12, 0.7)
  pair.solid.emissiveIntensity = (pair.solid.userData.maxEmissive as number) * smoothstep(k, 0.35, 1)
}

export function disposeBlueprintPair(pair: BlueprintPair) {
  pair.wire.dispose()
  pair.line.dispose()
  pair.solid.dispose()
}
