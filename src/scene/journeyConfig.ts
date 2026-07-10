/**
 * Spatial layout of the facility and the camera choreography.
 * Rooms sit along a winding path into -Z; fog keeps only the current
 * room (and a hint of the next) visible.
 */

export const ROOMS = {
  linux: [0, 0, 0],
  containers: [22, 0, -60],
  cicd: [0, 0, -140],
  iac: [-24, 0, -215],
  monitoring: [0, 10, -285],
  data: [26, 0, -350],
  hangar: [0, 0, -420],
  comms: [0, 6, -472],
} as const

export interface CameraPose {
  pos: [number, number, number]
  look: [number, number, number]
}

/**
 * One pose per DOM section (hero, 7 stages, comms) — index-aligned with
 * sectionIds. Compositions account for the copy panel side (panels alternate
 * left/right per stage), keeping the room's subject in the open half.
 */
export const cameraPoses: CameraPose[] = [
  // Exterior approach: the building glows on the horizon.
  { pos: [0, 2.5, 58], look: [0, 7, -6] },
  // Stage 01 — Linux Core (panel left): core sits right of center. Calm.
  { pos: [-4, 2.6, 12.5], look: [-4.5, 1.8, 0] },
  // Stage 02 — Container Bay (panel right): yard sits left of center.
  { pos: [26, 3.5, -45], look: [26.4, 1, -63] },
  // Stage 03 — CI/CD Tunnel (panel left): track runs right (the fast leg).
  { pos: [1.5, 2, -122], look: [-2.4, 2, -165] },
  // Stage 04 — IaC Control Room (panel right): apply grid left, elevated.
  { pos: [-20, 7, -196], look: [-19.4, -0.5, -216] },
  // Stage 05 — Monitoring Observatory (panel left): dome wall to the right.
  { pos: [0, 9, -271], look: [-3, 11, -289] },
  // Stage 06 — Data Annex (panel right): the star schema left, cooler wing.
  { pos: [29.5, 3.5, -336], look: [30, 1.8, -352] },
  // Stage 07 — Projects Hangar: wide symmetric shot; copy flows above the grid.
  { pos: [0, 4.5, -403], look: [0, 1.5, -422] },
  // Exit — Comms Deck: rising toward the antenna, into the dark.
  { pos: [0, 8, -452], look: [0, 12, -478] },
]

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export const smoothstep = (t: number, a: number, b: number) => {
  const k = clamp01((t - a) / (b - a))
  return k * k * (3 - 2 * k)
}

/**
 * Sequential materialization: maps room progress `t` to item i's local 0..1,
 * so racks/pods resolve one after another like a terraform apply.
 */
export function stagger(t: number, i: number, n: number, overlap = 0.55): number {
  const span = 1 / (n - (n - 1) * overlap)
  const start = i * span * (1 - overlap)
  return clamp01((t - start) / span)
}
