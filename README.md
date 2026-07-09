# Muhammad Musayyab — Portfolio

Personal portfolio / resume website. Dark, futuristic single-pager with GSAP scroll animations and a Three.js particle/wireframe background.

## Stack

- [Vite](https://vitejs.dev/) — dev server & build
- [GSAP + ScrollTrigger](https://gsap.com/) — scroll & interaction animations
- [Three.js](https://threejs.org/) — 3D background (starfield, torus knot, icosahedron)
- Vanilla HTML/CSS/JS — no framework

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & deploy

```bash
npm run build    # outputs to dist/
```

Deploys to Vercel with zero config — import the repo, framework preset "Vite".

## Content

Site content is sourced from `content-structure.md` (derived from the CV). The downloadable resume lives at `public/Musayyab-CV.pdf` — replace that file to update it.
