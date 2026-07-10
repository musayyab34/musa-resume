import { lazy, Suspense, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { stages } from './content/cv'
import { prefersReducedMotion, scrollState, useJourneyStore, webglAvailable } from './store/journeyStore'
import { setLenis } from './lib/scroll'
import Hero from './ui/Hero'
import RoomSection from './ui/RoomSection'
import ProjectGrid from './ui/ProjectGrid'
import CommsDeck from './ui/CommsDeck'
import ProgressRail from './ui/ProgressRail'
import TopBar from './ui/TopBar'
import StaticBackdrop from './ui/StaticBackdrop'

gsap.registerPlugin(ScrollTrigger)

const Experience = lazy(() => import('./scene/Experience'))

/** Section ids in journey order — hero, seven stages, comms deck. */
export const sectionIds = ['hero', ...stages.map((s) => `stage-${s.id}`), 'comms'] as const

export default function App() {
  const reduced = prefersReducedMotion()
  const [mount3d, setMount3d] = useState(false)
  const webglFailed = useJourneyStore((s) => s.webglFailed)
  const setCurrentStage = useJourneyStore((s) => s.setCurrentStage)
  const show3d = mount3d && !reduced && !webglFailed

  // Lenis smooth scroll — smooths native scroll, never hijacks it.
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.12 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduced])

  // Scroll bridge: one trigger per section writes local progress into the
  // mutable scroll channel; the 3D layer reads it in useFrame.
  useEffect(() => {
    const triggers: ScrollTrigger[] = []
    sectionIds.forEach((id, i) => {
      const el = document.getElementById(id)
      if (!el) return
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            scrollState.section[i] = self.progress
          },
        }),
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setCurrentStage(i - 1)
          },
        }),
      )
    })
    const overall = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        scrollState.overall = self.progress
      },
    })
    return () => {
      triggers.forEach((t) => t.kill())
      overall.kill()
    }
  }, [setCurrentStage])

  // Lazy-hydrate the 3D layer after first paint so hero text lands fast.
  useEffect(() => {
    if (reduced || !webglAvailable()) {
      if (!webglAvailable()) useJourneyStore.getState().setWebglFailed()
      return
    }
    const hasIdle = 'requestIdleCallback' in window
    const handle = hasIdle ? window.requestIdleCallback(() => setMount3d(true)) : window.setTimeout(() => setMount3d(true), 350)
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [reduced])

  return (
    <>
      <a
        href="#comms"
        className="sys-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-signal-amber focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to contact
      </a>

      {/* Backdrop layer: 3D canvas when possible, static gradient otherwise */}
      {show3d ? (
        <Suspense fallback={<StaticBackdrop />}>
          <Experience />
        </Suspense>
      ) : (
        <StaticBackdrop />
      )}

      <TopBar />
      <ProgressRail />

      <main className="relative z-10">
        <Hero />
        {stages.map((stage, i) => (
          <RoomSection key={stage.id} stage={stage} index={i}>
            {stage.id === 'projects-hangar' && <ProjectGrid />}
          </RoomSection>
        ))}
        <CommsDeck />
      </main>
    </>
  )
}
