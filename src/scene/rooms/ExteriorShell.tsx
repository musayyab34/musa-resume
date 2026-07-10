import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '../../store/journeyStore'
import { smoothstep } from '../journeyConfig'
import { PALETTE } from '../materials/blueprintSolid'

const WIN_COLS = 9
const WIN_ROWS = 5
const WIN_COUNT = WIN_COLS * WIN_ROWS

/**
 * The building seen from outside during the hero approach: a schematic shell
 * with lit windows. It fades away as the camera passes through the wall.
 */
export default function ExteriorShell() {
  const wireMat = useRef<THREE.MeshBasicMaterial>(null)
  const winMat = useRef<THREE.MeshBasicMaterial>(null)
  const windows = useRef<THREE.InstancedMesh>(null)

  const winTransforms = useMemo(() => {
    const dummy = new THREE.Object3D()
    const matrices: THREE.Matrix4[] = []
    const colors: THREE.Color[] = []
    const amber = new THREE.Color(PALETTE.amber)
    const dim = new THREE.Color('#3a4256')
    for (let r = 0; r < WIN_ROWS; r++) {
      for (let c = 0; c < WIN_COLS; c++) {
        dummy.position.set((c - (WIN_COLS - 1) / 2) * 2.6, (r - (WIN_ROWS - 1) / 2) * 2.4, 0)
        dummy.updateMatrix()
        matrices.push(dummy.matrix.clone())
        colors.push(Math.random() < 0.45 ? amber.clone() : dim.clone())
      }
    }
    return { matrices, colors }
  }, [])

  useFrame(({ clock }) => {
    const p = scrollState.section[0]
    // Section progress sits near 0.38 at page load; the shell dissolves as the
    // camera crosses the wall on the way to Stage 01.
    const gone = smoothstep(p, 0.52, 0.78)
    if (wireMat.current) wireMat.current.opacity = 0.5 * (1 - gone)
    if (winMat.current) winMat.current.opacity = 0.95 * (1 - gone)
    // A couple of windows flicker — the building is alive.
    if (windows.current && winMat.current) {
      const t = clock.elapsedTime
      const flicker = Math.sin(t * 9) > 0.92 ? 0.5 : 1
      winMat.current.opacity *= flicker
    }
  })

  return (
    <group position={[0, 6, -4]}>
      <mesh>
        <boxGeometry args={[27, 15, 26]} />
        <meshBasicMaterial ref={wireMat} color={PALETTE.teal} wireframe transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <instancedMesh
        ref={(mesh) => {
          if (!mesh) return
          windows.current = mesh
          winTransforms.matrices.forEach((m, i) => mesh.setMatrixAt(i, m))
          winTransforms.colors.forEach((c, i) => mesh.setColorAt(i, c))
          mesh.instanceMatrix.needsUpdate = true
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        }}
        args={[undefined, undefined, WIN_COUNT]}
        position={[0, 0, 13.05]}
      >
        <planeGeometry args={[1.1, 0.75]} />
        <meshBasicMaterial ref={winMat} transparent opacity={0.95} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
