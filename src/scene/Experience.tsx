import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useJourneyStore } from '../store/journeyStore'
import CameraRig from './CameraRig'
import ExteriorShell from './rooms/ExteriorShell'
import LinuxCore from './rooms/LinuxCore'
import ContainerBay from './rooms/ContainerBay'
import CiCdTunnel from './rooms/CiCdTunnel'
import IacControlRoom from './rooms/IacControlRoom'
import MonitoringObservatory from './rooms/MonitoringObservatory'
import DataAnnex from './rooms/DataAnnex'
import ProjectsHangar from './rooms/ProjectsHangar'
import CommsBeacon from './rooms/CommsBeacon'

/**
 * The persistent Canvas root — mounted once, fixed and full-viewport, behind
 * all HTML content. Tone mapping is R3F's default ACES Filmic; PerformanceMonitor
 * drops DPR and postprocessing if real FPS declines.
 */
export default function Experience() {
  const quality = useJourneyStore((s) => s.quality)
  const setQuality = useJourneyStore((s) => s.setQuality)
  const setWebglFailed = useJourneyStore((s) => s.setWebglFailed)

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={quality === 'high' ? [1, 1.75] : [0.7, 1]}
        camera={{ fov: 55, near: 0.1, far: 160 }}
        gl={{ antialias: quality === 'high', powerPreference: 'high-performance', alpha: false }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setWebglFailed()
          })
        }}
      >
        <color attach="background" args={['#080A10']} />
        <fog attach="fog" args={['#080A10', 25, 92]} />
        <ambientLight intensity={0.65} color="#2a3550" />

        <PerformanceMonitor onDecline={() => setQuality('low')} />
        <CameraRig />

        <Suspense fallback={null}>
          <ExteriorShell />
          <LinuxCore />
          <ContainerBay />
          <CiCdTunnel />
          <IacControlRoom />
          <MonitoringObservatory />
          <DataAnnex />
          <ProjectsHangar />
          <CommsBeacon />
        </Suspense>

        {quality === 'high' && (
          <EffectComposer>
            <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.32} luminanceSmoothing={0.15} />
            <Vignette eskil={false} offset={0.28} darkness={0.72} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
