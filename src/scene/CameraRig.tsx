import { useEffect, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sectionIds } from '../App'
import { cameraPoses } from './journeyConfig'

gsap.registerPlugin(ScrollTrigger)

/**
 * Owns the master camera timeline: one GSAP timeline spanning the whole page,
 * scrubbed by scroll, with one pose keyframe per DOM section. Segment durations
 * are proportional to real section heights so the camera arrives at each room
 * exactly when its copy panel is on screen.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    camera.fov = size.width < 640 ? 72 : 55
    camera.updateProjectionMatrix()
  }, [camera, size])

  useLayoutEffect(() => {
    let tl: gsap.core.Timeline | null = null

    const build = () => {
      tl?.scrollTrigger?.kill()
      tl?.kill()

      const first = cameraPoses[0]
      const proxy = {
        x: first.pos[0], y: first.pos[1], z: first.pos[2],
        tx: first.look[0], ty: first.look[1], tz: first.look[2],
      }
      const apply = () => {
        camera.position.set(proxy.x, proxy.y, proxy.z)
        camera.lookAt(proxy.tx, proxy.ty, proxy.tz)
      }
      apply()

      // Segment lengths from real section offsets.
      const tops = sectionIds.map((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })

      tl = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        scrollTrigger: {
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: 0.8,
        },
        onUpdate: apply,
      })

      // Hold-then-travel: dwell in each room while its copy is on screen
      // (the panel pins for ~the first 60% of the section), then fly to the
      // next room during the tail of the scroll.
      const HOLD = 0.58
      for (let i = 1; i < cameraPoses.length; i++) {
        const pose = cameraPoses[i]
        const span = Math.max(tops[i] - tops[i - 1], 1)
        tl.to(proxy, { x: '+=0', duration: span * HOLD, ease: 'none' })
        tl.to(proxy, {
          x: pose.pos[0], y: pose.pos[1], z: pose.pos[2],
          tx: pose.look[0], ty: pose.look[1], tz: pose.look[2],
          duration: span * (1 - HOLD),
        })
      }
      // Hold the final pose through the comms section's own height.
      tl.to(proxy, { x: '+=0', duration: window.innerHeight })
    }

    build()
    let debounce = 0
    const onResize = () => {
      window.clearTimeout(debounce)
      debounce = window.setTimeout(build, 350)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(debounce)
      tl?.scrollTrigger?.kill()
      tl?.kill()
    }
  }, [camera])

  return null
}
