import { create } from 'zustand'

/**
 * Discrete journey state (React re-renders): current stage for the UI rail,
 * quality tier from PerformanceMonitor, capability flags.
 *
 * Continuous per-frame values (scroll progress) live in `scrollState` below as
 * plain mutable numbers — ScrollTrigger writes them and useFrame reads them,
 * so no React state churn happens during scroll.
 */

interface JourneyState {
  /** -1 = hero/exterior, 0..6 = stages, 7 = comms deck */
  currentStage: number
  quality: 'high' | 'low'
  webglFailed: boolean
  setCurrentStage: (s: number) => void
  setQuality: (q: 'high' | 'low') => void
  setWebglFailed: () => void
}

export const useJourneyStore = create<JourneyState>((set) => ({
  currentStage: -1,
  quality: 'high',
  webglFailed: false,
  setCurrentStage: (currentStage) => set({ currentStage }),
  setQuality: (quality) => set({ quality }),
  setWebglFailed: () => set({ webglFailed: true }),
}))

/** Mutable scroll channel — written by ScrollTrigger, read inside useFrame. */
export const scrollState = {
  /** whole-page progress 0..1 */
  overall: 0,
  /** local progress 0..1 for hero + each stage + comms (index = stage + 1) */
  section: new Float32Array(9),
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
