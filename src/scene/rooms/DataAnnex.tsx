import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, smoothstep } from '../journeyConfig'

const COUNT = 1400

/**
 * Stage 06 — the data wing: cooler, greyer. A pool of raw-data particles
 * converges into a crystalline star-schema lattice — a fact-table core with
 * six dimension clusters — as it moves from ingest to structured warehouse.
 */
export default function DataAnnex() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const linesMat = useRef<THREE.LineBasicMaterial>(null)

  const { geometry, linesGeometry } = useMemo(() => {
    const start = new Float32Array(COUNT * 3)
    const target = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)

    // Dimension cluster centers around the fact core.
    const clusters: THREE.Vector3[] = [new THREE.Vector3(0, 2.6, 0)]
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      clusters.push(new THREE.Vector3(Math.cos(a) * 5.2, 2.6 + Math.sin(i * 2.1) * 1.4, Math.sin(a) * 5.2))
    }

    for (let i = 0; i < COUNT; i++) {
      // Start: a flat scattered pool of raw data near the floor.
      const r = Math.sqrt(Math.random()) * 11
      const a = Math.random() * Math.PI * 2
      start[i * 3] = Math.cos(a) * r
      start[i * 3 + 1] = -1.1 + Math.random() * 0.5
      start[i * 3 + 2] = Math.sin(a) * r

      // Target: tight crystalline clusters — fact table denser than dimensions.
      const cluster = clusters[i % 7 === 0 || Math.random() < 0.35 ? 0 : 1 + (i % 6)]
      const spread = cluster === clusters[0] ? 1.15 : 0.75
      target[i * 3] = cluster.x + (Math.random() - 0.5) * spread * 2
      target[i * 3 + 1] = cluster.y + (Math.random() - 0.5) * spread * 2
      target[i * 3 + 2] = cluster.z + (Math.random() - 0.5) * spread * 2
      seed[i] = Math.random()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(start, 3))
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))

    // Schema edges: fact core to each dimension cluster.
    const linePts: number[] = []
    for (let i = 1; i < clusters.length; i++) {
      linePts.push(clusters[0].x, clusters[0].y, clusters[0].z, clusters[i].x, clusters[i].y, clusters[i].z)
    }
    const linesGeometry = new THREE.BufferGeometry()
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePts), 3))

    return { geometry, linesGeometry }
  }, [])

  const shader = useMemo(
    () => ({
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#9ab0c4') },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aTarget;
        attribute float aSeed;
        uniform float uMix;
        uniform float uTime;
        varying float vSeed;
        void main() {
          vSeed = aSeed;
          // Each particle departs on its own offset — the stream, not a teleport.
          float local = clamp(uMix * 1.6 - aSeed * 0.6, 0.0, 1.0);
          local = local * local * (3.0 - 2.0 * local);
          vec3 p = mix(position, aTarget, local);
          p.y += sin(uTime * 0.8 + aSeed * 20.0) * 0.08 * (1.0 - local * 0.6);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (2.0 + aSeed * 2.4) * (26.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vSeed;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d) * (0.5 + vSeed * 0.5);
          gl_FragColor = vec4(uColor, alpha * 0.85);
        }
      `,
    }),
    [],
  )

  useFrame(({ clock }) => {
    const p = scrollState.section[6]
    if (mat.current) {
      mat.current.uniforms.uMix.value = smoothstep(p, 0.15, 0.68)
      mat.current.uniforms.uTime.value = clock.elapsedTime
    }
    if (linesMat.current) linesMat.current.opacity = 0.5 * smoothstep(p, 0.55, 0.75)
  })

  return (
    <group position={ROOMS.data as unknown as THREE.Vector3Tuple}>
      <points geometry={geometry}>
        <shaderMaterial ref={mat} args={[shader]} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial ref={linesMat} color="#9ab0c4" transparent opacity={0} />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <circleGeometry args={[16, 40]} />
        <meshStandardMaterial color="#0d1017" roughness={0.9} />
      </mesh>
      {/* cooler, greyer light — a different discipline, same building */}
      <pointLight position={[0, 9, 3]} color="#8aa3b8" intensity={16} distance={32} decay={2} />
    </group>
  )
}
