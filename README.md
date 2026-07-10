# The Infrastructure Journey

Portfolio site for **Muhammad Musayyab — DevOps Engineer**. A cinematic, scroll-driven
walkthrough of an imaginary data center where every room maps to real CV content:
Linux foundations, containers, CI/CD, infrastructure-as-code, monitoring, data
engineering, and shipped projects.

The signature move: **everything materializes from blueprint to solid** — teal
schematic lines resolving into lit geometry as you scroll, the visual metaphor for
infrastructure-as-code.

Full spec: [`Infrastructure_Journey_Build_Plan.md`](./Infrastructure_Journey_Build_Plan.md)

## Stack

- Vite + React + TypeScript + Tailwind CSS v4
- React Three Fiber + drei (3D layer, primitive geometry only — no model assets)
- GSAP ScrollTrigger (camera rig + room beats) + Lenis (scroll smoothing, never hijacking)
- Zustand (stage/quality state), @react-three/postprocessing (Bloom + Vignette)
- Fonts: Departure Mono (display/system labels) + Instrument Sans (body)

## Develop

```bash
npm install
npm run dev       # dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Guardrails built in

- `prefers-reduced-motion`: no 3D canvas, no camera flight — static schematic backdrop, all content readable
- No-WebGL / context-loss fallback to the same static backdrop
- `PerformanceMonitor` drops DPR and postprocessing on sustained FPS decline
- Every fact exists as real DOM text (screen readers, SEO); the 3D layer is atmosphere only
- 3D chunk is lazy-loaded after first paint so the hero terminal appears immediately

## Content

All CV facts live in one file: `src/content/cv.ts`. Update it there — rooms,
project cards, and the comms deck all read from it.

## Deploy

Static SPA — `npm run build`, deploy `dist/` to Vercel or Netlify. The resume PDF
is served from `public/Musayyab-CV.pdf`.
