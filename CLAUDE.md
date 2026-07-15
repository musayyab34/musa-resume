# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"The Infrastructure Journey" — Muhammad Musayyab's DevOps portfolio, built as a cinematic scroll-driven walkthrough of an imaginary data center. Each "room" maps to real CV content. `Infrastructure_Journey_Build_Plan.md` is the authoritative design/build spec; consult it before making structural or visual changes — palette, typography, room concepts, and the signature effect are all specified there and were chosen deliberately (the previous generic version was rejected).

## Commands

```bash
npm run dev      # Vite dev server (hot reload)
npm run build    # tsc -b (typecheck) then vite build → dist/
npm run preview  # serve the production build
```

There is no test suite and no ESLint config. `npm run build` is the gate: it runs `tsc -b` first, and `tsconfig.app.json` enables `noUnusedLocals`/`noUnusedParameters`, so unused imports/vars fail the build. `eslint-disable` comments in the source are inert (no linter runs them) — they mark intentional `react-hooks/exhaustive-deps` exceptions where materials are memoized once with `[]`.

Verification is visual, not test-based. There's no headless browser installed by default; screenshots require Playwright + a running `preview`/`dev` server.

## Architecture

**Two layers, one scroll.** A fixed full-viewport `<Canvas>` (the 3D data center) sits at `z-0` behind normal-flowing HTML sections at `z-10`. The HTML is the real content (SEO + screen readers); the 3D is atmosphere. Every fact visible in 3D also exists as DOM text.

**The scroll bridge (critical pattern).** `src/store/journeyStore.ts` deliberately splits state in two:
- `useJourneyStore` (Zustand) holds *discrete* state that triggers React re-renders: `currentStage` (for the nav rail), `quality`, `webglFailed`.
- `scrollState` is a plain mutable object (`{ overall, section: Float32Array(9) }`) — **not** React state. `App.tsx` ScrollTriggers write per-section progress into it every frame; room components read it inside `useFrame` and mutate Three.js objects directly. This keeps scrolling off React's render path entirely. Never lift scroll progress into React state or `setState` inside `useFrame`.

`scrollState.section` is indexed by DOM section: `[0]` = hero, `[1..7]` = the 7 stages, `[8]` = comms. `sectionIds` in `App.tsx` and `cameraPoses`/`ROOMS` in `journeyConfig.ts` are all index-aligned to this order — keep them in sync when adding/reordering rooms.

**Camera.** `src/scene/CameraRig.tsx` owns one GSAP timeline scrubbed by a single page-spanning ScrollTrigger, with one keyframed pose per section (`cameraPoses`). Segment durations are proportional to real DOM section heights (measured on mount, rebuilt on resize) so the camera arrives at each room as its copy panel pins. Rooms are laid out along -Z in `ROOMS`; fog hides all but the current room.

**The signature effect — blueprint→solid.** `src/scene/materials/blueprintSolid.ts`. Every materializing object is a *persistent pair* of materials (teal wireframe/edge-lines + lit solid) on co-located meshes sharing one geometry. `setBlueprintProgress(pair, t)` lerps opacity + emissive to dissolve wireframe→solid. This is a **material-property lerp, never a mesh swap** (swapping remounts and recompiles shaders, causing stutter). `PairMesh` in `src/scene/rooms/helpers.tsx` renders a pair; `cloneBlueprintPair` gives each instance its own materials so they can stagger independently (see `stagger()` in `journeyConfig.ts` for the sequential "terraform apply" reveal).

**Content is single-sourced.** `src/content/cv.ts` holds every real CV fact (roles, projects, skills, room copy), typed. Room components and UI import from it — never hardcode resume text elsewhere. Confidentiality boundary: employer names (Forge-Tech, Antematter, Blutech) and CageCalls are public; client names stay anonymized ("US healthcare client").

**Directory roles:** `src/scene/` = 3D (Canvas root `Experience.tsx`, camera, `materials/`, one file per room in `rooms/`); `src/ui/` = DOM overlay (Hero, RoomSection wrapper, ProjectGrid, CommsDeck, nav); `src/styles/tokens.css` = design tokens as CSS vars + Tailwind v4 `@theme`.

## Fallbacks (must stay intact)

Three independent conditions swap the 3D canvas for `StaticBackdrop` (same palette/type, zero WebGL): `prefers-reduced-motion`, WebGL unavailable, and runtime `webglcontextlost`. The Canvas also lazy-hydrates via `requestIdleCallback` after first paint so the hero terminal renders immediately. `PerformanceMonitor` (drei) drops `quality` to `'low'` on sustained FPS decline, which lowers DPR and disables postprocessing. When touching `App.tsx` mounting logic or `Experience.tsx`, preserve all of these.

## Conventions

- Design tokens live twice: CSS custom properties in `tokens.css` (`--void`, `--signal-amber`, etc.) and mirrored in `PALETTE` in `blueprintSolid.ts` for Three.js. Amber = "this matters"; teal = ambient; `--alert-red` is reserved for the single Stage 05 incident beat only.
- Fonts are self-hosted in `public/fonts/` (Departure Mono, `@font-face` in `tokens.css`) and via `@fontsource-variable/instrument-sans`. `drei/Text` in rooms loads the `.otf` directly by path.
- Tailwind v4 (no config file) — theme extension is inline in `tokens.css` via `@theme`.
- three.js is manually chunked (`vite.config.ts`) into its own ~1.2MB bundle; the size warning is expected.
