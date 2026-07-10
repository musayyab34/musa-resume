# The Infrastructure Journey
### Build Plan for Musayyab's Portfolio Site — handoff document for Claude Code

---

## 0. What this document is

This is a full spec for "The Infrastructure Journey" — a cinematic, scroll-driven 3D portfolio site built from Musayyab's actual CV. It's written to be dropped into a repo as `PROJECT_BRIEF.md` and fed to Claude Code section by section. It covers the design system, the content mapping, the technical architecture, and a phased build order — because a project like this fails if you ask an agent to one-shot the whole 3D scene at once. Build it in layers.

The rejected first attempt (Fable 5, dark terminal + generic glassmorphism + neon) looked like every other AI-generated portfolio because it used the defaults: near-black background, one neon accent, floating glass cards, generic scroll-fade. This plan deliberately avoids that palette and that structure. Every choice below is justified by *this* CV — a DevOps engineer who has actually shipped Terraform, GitHub Actions pipelines, Cloud Run migrations, and cost-optimization dashboards — not by "what looks cool on Dribbble."

---

## 1. The concept

The site is a walkthrough of a single imaginary data center building, told entirely through scroll. Instead of "About / Experience / Skills / Projects" sections, you move physically through rooms, and each room's content is real content from the CV — actual employers, actual services, actual outcomes. No filler.

The through-line that ties every room together, and the "one thing this site is remembered for": **everything materializes from blueprint to solid.** Every key object in every room first appears as a glowing wireframe (blue-line schematic, like a Terraform plan output) and resolves into solid, lit geometry as you scroll into that room. This is the visual metaphor for infrastructure-as-code — configuration becoming real infrastructure — and it's the one signature move used consistently rather than a different gimmick per room. Restraint here is what will make it look intentional instead of AI-generated.

---

## 2. Visual identity (design tokens)

Avoid the three current AI-design defaults: warm cream + terracotta serif, near-black + single neon accent, or broadsheet hairline-rule newspaper layout. A data center's real lighting vocabulary — cool ambient LED, amber status/warning lights, rare red-to-green alert transitions — gives a palette that's justified by the subject rather than borrowed from a template.

**Color**
| Token | Hex | Use |
|---|---|---|
| `--void` | `#080A10` | base background (blue-black, not pure black) |
| `--rack-steel` | `#151922` | panel / surface / card backgrounds |
| `--rack-steel-light` | `#232936` | borders, dividers, inactive UI |
| `--signal-amber` | `#FFB454` | primary accent — CTAs, active state, the "attention" color |
| `--circuit-teal` | `#4FD1C5` | secondary accent, used sparingly — data flow, wireframe lines |
| `--alert-red` | `#FF5C5C` | reserved for one narrative beat only (see Room 5) — never decorative |
| `--bone` | `#E8E6DE` | primary text — warm off-white, not pure white |
| `--bone-dim` | `#9AA0AC` | secondary/muted text |

Rule: amber and teal never appear at full saturation together in the same shot. Amber is the "this matters" color; teal is ambient/atmospheric. This discipline is what keeps it from reading as generic neon-on-black.

**Type**
- Display / room titles: a monospace with real character, not the default JetBrains Mono every dev portfolio reaches for. Use **Departure Mono** or **Commit Mono** (both free, both distinctive, both suit a terminal/schematic feel without being a cliché).
- Body copy: a humanist sans that isn't Inter. Use **Instrument Sans** or **General Sans** (free, on Fontshare) — sized generously, high line-height, since long-form paragraph reading needs to feel calm against a busy 3D background.
- System/UI labels (stage numbers, tags, timestamps): the same mono family as display, but small (11–12px), uppercase, letter-spaced (`0.08em`+) — like a real system log or a status readout.

**Structure**
Each room gets a small `STAGE 0X — ROOM NAME` label in the mono utility face. This is one of the few times numbered markers are actually justified (per general design practice) rather than decorative — this is a real sequential pipeline, and the stage number **is** information: it mirrors how a real CI/CD pipeline or Kubernetes rollout reports its stages.

**Signature element:** the blueprint→solid materialization transition (Section 1). Everything else — lighting, camera moves, panel styling — stays disciplined and quiet around it.

---

## 3. The journey map

This is the actual content-to-room mapping, pulled directly from the CV. Nothing invented — every line below maps to something Musayyab actually did.

### Entry — Exterior Approach (hero)
You start outside the glowing structure at night, silhouette on the horizon. A terminal-style boot sequence types out identity instead of a static headline:
```
> whoami
Muhammad Musayyab — DevOps Engineer
> location
Islamabad, Pakistan
> status
Available — building cloud infrastructure since 2025
> scroll to enter_
```
This replaces the generic "Hi, I'm X, a Y" hero with something that's actually in his register (a person who lives in terminals) and sets up the whole site's grammar before the 3D even loads.

### Stage 01 — Linux Core
**Maps to:** foundation across every role — Linux administration, BS Software Engineering (Virtual University, 2025), CCNA networking fundamentals.
**Visual:** a single glowing server core at the center of a dark room, faint concentric wireframe rings resolving to solid as you scroll in. Floating terminal panes show real (harmless) commands — `systemctl`, `ssh`, `chmod` — not lorem-ipsum code.
**Copy beat:** short — this is the "roots" room, one paragraph max, education line, and the CCNA/networking fundamentals as a quiet footnote.

### Stage 02 — Container Bay
**Maps to:** Docker/Docker Compose work across Forge-Tech (deployed and monitored Docker-based applications) and Antematter (UChicago Health migration off an EC2-based Docker setup), plus the Final Year Project (containerized a static web app with automated testing in the CI pipeline).
**Visual:** glowing cargo-container blocks moving along a track like a shipping yard, each block labeled with a real project name. Hovering/scrolling into one expands a short real detail.

### Stage 03 — CI/CD Launch Tunnel
**Maps to:** GitHub Actions pipelines maintained at Forge-Tech ("making deployments more consistent and reducing manual steps"), the CageCalls end-to-end deployment flow at Antematter (ECR, App Runner, RDS, Secrets Manager, S3, GitHub Actions), and the Final Year Project's push-triggered pipeline.
**Visual:** a tunnel where a commit becomes a glowing packet of light that launches down a track through sequential gates — build → test → deploy — each gate lighting up as the packet passes. This is the room where camera speed can pick up; it's meant to feel fast, unlike the calmer Room 1.

### Stage 04 — IaC Control Room
**Maps to:** Terraform (Final Year Project, general IaC practice at Antematter) and AWS CDK (used to define and version-control CageCalls' cloud resources).
**Visual:** the clearest expression of the blueprint→solid signature — a floor grid of blue wireframe lines where solid server racks, database cylinders, and network nodes resolve into place one at a time, like a `terraform apply` executing in front of you.

### Stage 05 — Monitoring Observatory
**Maps to:** CloudWatch, Prometheus/Grafana, Loki; the daily cloud cost reporting system built with Lambda, EventBridge, SNS, and Cost Explorer (with real waste-reduction outcome); Route 53 DNS/subdomain automation; and the incident-resolution work at Antematter (service accounts, secrets, Cloud SQL connectivity, VPC access, Cloud Run revisions).
**Visual:** a planetarium dome of floating dashboard panels orbiting like constellations. This is the one room that uses `--alert-red`: one panel starts red/pulsing (representing a rollout issue), and as you scroll past the midpoint of the room it resolves to teal-green — a small narrative beat that shows the actual job (things break, he fixes them) instead of just naming tools.

### Stage 06 — Data Engineering Annex
**Maps to:** the two Blutech Consulting internships — Cloudera Administration (HDFS/YARN, ingest→Parquet→Spark SQL, OLTP/OLAP and star/snowflake schema concepts mapped to Hive/Impala) and Data Engineering (SQL tuning, table/key/index design, INSERT/UPDATE/MERGE bulk operations).
**Visual:** a distinct wing, slightly cooler and greyer in temperature than the rest of the building (signals "different discipline, same building") — a pool of flowing particles (raw data) converging into a crystalline lattice structure (a literal star-schema shape) as it moves from ingest to structured warehouse.

### Stage 07 — Projects Hangar
**Maps to:** the concrete, nameable outputs — UChicago Health migration, CageCalls, the cost-reporting system, Route 53 automation, the Final Year DevOps Pipeline Simulation, and the Cloudera cluster work.
**Visual:** a hangar bay of modular pods. Each pod expands on interaction into a real project card: what it was, the stack, the outcome. This is the room that does the heaviest "hire me" lifting, so it should be the most information-dense despite the game-level framing.

### Exit — Comms Deck (contact)
A handshake/connection metaphor instead of a plain contact form: `> establishing secure channel...` before revealing email, resume download, and socials. Low-key, no gimmicks — this is a functional room, not a spectacle one.

---

## 4. Tech stack

- **Vite + React + TypeScript** — fast dev loop, what Claude Code will be most reliable scaffolding.
- **React Three Fiber + drei** — the 3D scene layer. `drei` gives you `PerformanceMonitor`, `Detailed` (LOD), `Environment`, and preload helpers for free.
- **GSAP + ScrollTrigger** — drives the *camera and scene* state off scroll position. This is the industry-standard pairing for this exact effect (fixed full-screen `<Canvas>` behind the HTML, GSAP timeline scrubbed by scroll progress, `scrollTrigger.scrub` synced to a persistent camera rig). Don't reach for Framer Motion for the camera work — GSAP's ScrollTrigger is the tool actually built for scroll-scrubbed timelines; save Framer Motion for the DOM-layer UI (nav reveal, button hover states, panel expand/collapse in the Projects Hangar).
- **Lenis** — smooth-scroll wrapper so native scroll feels buttery without hijacking it. Important: never scroll-jack (don't override the user's scroll input) — let native scroll drive the scrub, only smooth it.
- **@react-three/postprocessing** — `Bloom`, `Vignette`, `ToneMapping` (ACES Filmic) for the glow/atmosphere. Keep the effect stack small — bloom + vignette + tone mapping is enough; each extra pass costs frame budget.
- **Zustand** — tiny global store for "current stage index" / scroll progress, read by both the 2D UI layer and the 3D layer without prop-drilling.
- **Tailwind CSS** — utility styling for the HTML overlay layer (nav, text panels, project cards).

Geometry approach: **don't model real 3D assets.** Use primitive geometry (boxes, cylinders, planes, instanced meshes for repeated elements like server racks or containers) with custom materials, wireframe-to-solid shader transitions, and lighting/bloom doing the heavy lifting. This keeps the whole thing buildable by Claude Code without a Blender pipeline, keeps the bundle small, and is honestly more in keeping with the "schematic" visual language than photoreal models would be.

---

## 5. Scroll & camera mechanics (how it actually works)

1. A single `<Canvas>` is mounted once, fixed and full-viewport, sitting behind all HTML content (`position: fixed; z-index: -1` or similar layering).
2. The HTML content scrolls normally on top (wrapped in Lenis for smoothing) — each "room" is a real DOM section with real height (e.g. `min-height: 100vh`, some rooms taller if they need more scroll distance for their beat).
3. A single GSAP timeline, built inside a `useLayoutEffect`, is driven by one long `ScrollTrigger` spanning the whole page (`start: "top top"`, `end: "bottom bottom"`, `scrub: 1`). Camera position/rotation and per-room object properties are keyframed along that one timeline, the same way you'd animate a single camera-action clip with one keyframe per shot.
4. Each room additionally gets its own smaller `ScrollTrigger` (trigger: that room's section, scrub: true) for local beats — e.g. Room 5's red→teal alert resolution, Room 4's blueprint→solid reveal — so local animation doesn't require scrubbing the entire page timeline.
5. Do the wireframe→solid transition as a **shader/material property lerp** (opacity + emissive intensity + a dissolve-style threshold), not as swapping meshes — swapping meshes triggers remounts and shader recompiles and will visibly stutter.
6. `frameloop="demand"` where a room's scene is fully static between scroll updates, calling `invalidate()` on scroll-driven changes rather than rendering every frame — saves battery/GPU on mobile.

---

## 6. Performance & accessibility guardrails (non-negotiable)

Award-winning portfolio sites lose points for being slow or confusing, not just for looking plain — usability and clarity are judged alongside visual creativity. Build these in from the start, not as cleanup at the end:

- **Device-tier detection + adaptive quality.** Use drei's `PerformanceMonitor` to watch real FPS and drop quality (disable postprocessing, reduce particle counts, lower DPR) automatically on decline, rather than fixed quality tiers.
- **`prefers-reduced-motion` fallback.** Detect it and swap the camera-move journey for a calmer version: gentle fades/parallax between rooms, no continuous camera flight, no autoplay motion.
- **No-WebGL fallback.** If `<Canvas>` fails to initialize, show a static version that preserves the visual language (same colors/type/layout) with no 3D layer — never a blank page.
- **Mutate in `useFrame`, never `setState` in the render loop.** Direct ref mutation only, or you'll thrash React's reconciler on every frame.
- **Compress everything.** Any textures you do use: Draco/KTX2/Meshopt. Keep the total 3D asset payload small — this build shouldn't need any GLTF assets at all if you stick to primitive geometry (Section 4).
- **Lazy-load the 3D layer** below the very first paint so the initial hero text/typing sequence appears fast (target: meaningful content under ~1.5s), then hydrate the Canvas.
- **Keyboard and screen-reader path.** Every room's real content (project names, dates, outcomes) must exist as real DOM text, not only as 3D-rendered labels — this also matters for SEO, since a JS-only 3D-canvas-only site is invisible to crawlers and to anyone not using a mouse.
- **Frame budget target:** 60fps on a mid-range desktop, a stable 30fps+ floor on a mid-range Android before triggering the reduced-quality fallback.

---

## 7. Suggested file structure

```
src/
  App.tsx
  store/
    journeyStore.ts          # zustand: current stage, scroll progress
  scene/
    Experience.tsx           # the persistent <Canvas> root
    CameraRig.tsx            # GSAP timeline owner, drives camera per scroll
    materials/
      blueprintSolid.ts      # shared shader/material for the signature transition
    rooms/
      LinuxCore.tsx
      ContainerBay.tsx
      CiCdTunnel.tsx
      IacControlRoom.tsx
      MonitoringObservatory.tsx
      DataAnnex.tsx
      ProjectsHangar.tsx
  ui/
    Hero.tsx
    RoomSection.tsx           # shared DOM wrapper: stage label, heading, copy
    ProjectCard.tsx
    CommsDeck.tsx             # contact section
  content/
    cv.ts                     # single source of truth: all real CV content, typed
  styles/
    tokens.css                # the design tokens from Section 2
```

Keep `content/cv.ts` as the one place all real resume facts live (roles, dates, bullet points, skills) — every room component imports from it rather than hardcoding text. That makes future CV updates a one-file change instead of a hunt through 7 room components.

---

## 8. Phased build order (feed this to Claude Code one phase at a time)

Don't ask for the finished site in one prompt. Go in this order, confirming each phase looks/works right before moving on:

**Phase 0 — Scaffold.** Vite + React + TS + Tailwind, ESLint, folder structure from Section 7, design tokens loaded as CSS variables, fonts loading (Departure Mono / Commit Mono + Instrument Sans/General Sans).

**Phase 1 — Content skeleton (no 3D at all).** Build every room as a plain scrollable HTML section with real copy and stage labels, in the final color/type system. This locks in the actual content and reading flow before any 3D work starts — much easier to fix copy/pacing now than after the 3D is wired up.

**Phase 2 — Scroll engine, still no 3D.** Add Lenis + the master GSAP ScrollTrigger timeline, but animate simple 2D layer transforms (parallax, opacity, position) between the HTML sections. This proves the scroll-story pacing works before adding 3D complexity on top.

**Phase 3 — Canvas + camera rig.** Introduce the persistent `<Canvas>`, `CameraRig.tsx`, and get the camera moving through empty space in sync with scroll progress. No room geometry yet — just prove the camera choreography.

**Phase 4 — Build Room 1 and Room 2 geometry.** Start with the two simplest rooms. Get the blueprint→solid material working here first, since every later room reuses it.

**Phase 5 — Remaining rooms**, one at a time, in order (3 → 4 → 5 → 6 → 7), each using the shared material/patterns established in Phase 4.

**Phase 6 — Postprocessing pass.** Add Bloom + Vignette + ACES Filmic tone mapping once all geometry exists — tuning bloom against a half-built scene wastes time.

**Phase 7 — Performance & accessibility pass.** `PerformanceMonitor`, reduced-motion fallback, no-WebGL fallback, keyboard/screen-reader audit, Lighthouse pass. Everything from Section 6.

**Phase 8 — Ship.** Deploy (Vercel/Netlify are both a good fit for a Vite SPA), custom domain, OG/meta tags for link previews, resume PDF download wired up in the Comms Deck.

---

## 9. Content & asset checklist

- [ ] Resume PDF (the uploaded CV, or an updated version) for direct download in the Comms Deck
- [ ] Final one-line thesis for the hero typing sequence (draft: *"DevOps Engineer — I make deployments less stressful."* — pulled straight from his own "About Me" framing, tighten as needed)
- [ ] Confirm which Antematter/Forge-Tech details are safe to name publicly vs. need to stay generic (the CV already anonymizes some client work — keep that boundary on the live site)
- [ ] Font licenses checked (Departure Mono, Commit Mono, Instrument Sans, General Sans are all free/open — verify current license terms before shipping)
- [ ] Contact method(s) to surface: email, and any socials/GitHub he wants linked
- [ ] Decide early whether Cloud Tinkers (his Discord community) gets a mention anywhere — could be a small footer credibility signal but isn't core CV content

---

## 10. Kickoff prompt — paste this into Claude Code

```
I'm building a portfolio site called "The Infrastructure Journey" — a cinematic,
scroll-driven walkthrough of an imaginary data center, where each room maps to
real content from my DevOps resume. Full spec is in PROJECT_BRIEF.md in this repo
— read it fully before writing any code.

Let's start with Phase 0 only: scaffold a Vite + React + TypeScript + Tailwind
project, set up the folder structure from Section 7 of the brief, load the
design tokens from Section 2 as CSS variables, and get the two fonts loading
correctly. Don't touch React Three Fiber or GSAP yet — that's Phase 2+.

Once this is working, I'll confirm and we'll move to Phase 1 (content skeleton).
```

Save this whole document as `PROJECT_BRIEF.md` in the repo root before that first prompt — Claude Code will read it as context, and you can point back to specific section numbers ("go build Phase 4 from the brief") for every subsequent prompt instead of re-explaining the concept each time.
