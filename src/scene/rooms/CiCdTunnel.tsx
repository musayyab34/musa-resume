import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { scrollState } from '../../store/journeyStore'
import { ROOMS, clamp01, smoothstep } from '../journeyConfig'
import { PALETTE } from '../materials/blueprintSolid'

const MONO = '/fonts/DepartureMono-Regular.otf'
const GATES = [
  { label: 'BUILD', z: 22 },
  { label: 'TEST', z: 0 },
  { label: 'DEPLOY', z: -22 },
]
const RIB_COUNT = 11

/**
 * Stage 03 — a commit becomes a packet of light launching down the tunnel
 * through build → test → deploy gates. The fast room.
 */
export default function CiCdTunnel() {
  const packet = useRef<THREE.Group>(null)
  const glowPlane = useRef<THREE.Mesh>(null)
  const packetLight = useRef<THREE.PointLight>(null)
  const gateMats = useRef<THREE.MeshStandardMaterial[]>([])
  const gateTexts = useRef<{ fillOpacity: number; color: THREE.ColorRepresentation }[]>([])
  const amber = useMemo(() => new THREE.Color(PALETTE.amber), [])
  const steel = useMemo(() => new THREE.Color('#2a3244'), [])

  // Soft radial glow drawn in a fragment shader on a camera-facing plane —
  // the plain mesh path renders reliably where sprites/emissive spheres don't.
  const glowMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: false,
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float core = smoothstep(0.35, 0.0, d);
            float halo = smoothstep(1.0, 0.15, d);
            vec3 color = mix(vec3(1.0, 0.706, 0.329), vec3(1.0, 0.925, 0.784), core);
            float alpha = clamp(core + halo * 0.55, 0.0, 1.0);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [],
  )

  useFrame(({ clock, camera }) => {
    if (glowPlane.current) glowPlane.current.quaternion.copy(camera.quaternion)
    const p = scrollState.section[3]
    const t = smoothstep(p, 0.12, 0.85)
    // Packet travels +z → -z through the gates as you scroll.
    const z = THREE.MathUtils.lerp(34, -34, t)
    if (packet.current) {
      packet.current.position.z = z
      packet.current.position.y = 2 + Math.sin(clock.elapsedTime * 6) * 0.06
      const vis = smoothstep(p, 0.06, 0.16) * (1 - smoothstep(p, 0.9, 0.98))
      packet.current.scale.setScalar(Math.max(vis, 0.0001))
    }
    if (packetLight.current) packetLight.current.intensity = 30 * smoothstep(p, 0.08, 0.18)

    GATES.forEach((gate, i) => {
      const mat = gateMats.current[i]
      const passed = clamp01((gate.z - z + 3) / 6)
      if (mat) {
        mat.emissive.copy(steel).lerp(amber, passed)
        mat.emissiveIntensity = 0.4 + passed * 1.4
      }
      const text = gateTexts.current[i]
      if (text) text.fillOpacity = 0.35 + passed * 0.65
    })
  })

  return (
    <group position={ROOMS.cicd as unknown as THREE.Vector3Tuple}>
      {/* tunnel ribs */}
      {Array.from({ length: RIB_COUNT }, (_, i) => (
        <mesh key={i} position={[0, 2, 38 - i * 7.6]} rotation={[0, 0, Math.PI / 8]}>
          <torusGeometry args={[6.4, 0.045, 6, 8]} />
          <meshBasicMaterial color={PALETTE.teal} transparent opacity={0.16} depthWrite={false} />
        </mesh>
      ))}

      {/* gates */}
      {GATES.map((gate, i) => (
        <group key={gate.label} position={[0, 2, gate.z]}>
          <mesh>
            <torusGeometry args={[4.6, 0.22, 12, 48]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) gateMats.current[i] = m
              }}
              color="#232c3e"
              emissive="#2a3244"
              emissiveIntensity={0.4}
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>
          <Text
            ref={(t) => {
              if (t) gateTexts.current[i] = t as unknown as { fillOpacity: number; color: THREE.ColorRepresentation }
            }}
            font={MONO}
            fontSize={0.5}
            color={PALETTE.bone}
            anchorX="center"
            position={[0, -5.6, 0]}
            fillOpacity={0.35}
          >
            {gate.label}
          </Text>
        </group>
      ))}

      {/* the commit packet — a soft glow on a camera-facing plane */}
      <group ref={packet} position={[0, 2, 34]}>
        <mesh ref={glowPlane} material={glowMat}>
          <planeGeometry args={[2.6, 2.6]} />
        </mesh>
        <pointLight ref={packetLight} color={PALETTE.amber} intensity={0} distance={20} decay={1.8} />
      </group>

      {/* guide track */}
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 80]} />
        <meshBasicMaterial color={PALETTE.teal} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  )
}
