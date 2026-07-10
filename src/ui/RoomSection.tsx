import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import type { Stage } from '../content/cv'
import { prefersReducedMotion } from '../store/journeyStore'

interface Props {
  stage: Stage
  index: number
  children?: ReactNode
}

/**
 * Shared DOM wrapper for a room: stage label, heading, copy, facts.
 * All real content lives here as real DOM text (screen readers, SEO) —
 * the 3D layer behind is atmosphere, never the only copy of anything.
 *
 * Rooms with children (Projects Hangar) flow normally; the rest pin their
 * panel with position:sticky while the camera moves through the room.
 */
export default function RoomSection({ stage, index, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useMemo(prefersReducedMotion, [])
  const flowing = Boolean(children)
  // Alternate panel side so compositions vary as the camera changes rooms.
  const side = index % 2 === 0 ? 'md:mr-auto md:ml-[8vw]' : 'md:ml-auto md:mr-[8vw]'

  useLayoutEffect(() => {
    if (reduced || flowing) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        defaults: { ease: 'none' },
      })
      tl.fromTo(panelRef.current, { autoAlpha: 0, y: 56 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.08)
        .to(panelRef.current, { autoAlpha: 0, y: -40, duration: 0.12 }, 0.86)
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced, flowing])

  return (
    <section
      ref={sectionRef}
      id={`stage-${stage.id}`}
      aria-labelledby={`heading-${stage.id}`}
      className={`relative ${flowing ? 'py-[18vh]' : 'min-h-[180vh]'}`}
    >
      <div className={flowing ? 'px-6' : 'sticky top-0 flex h-screen items-center px-6'}>
        {/* Soft scrim, not a glass card: keeps copy readable over geometry
            without boxing it in. */}
        <div
          ref={panelRef}
          className={`w-full max-w-xl rounded-3xl p-7 sm:p-9 ${side}`}
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 50%, rgba(8,10,16,0.82) 45%, rgba(8,10,16,0) 100%)',
          }}
        >
          <p className="sys-label mb-4 text-signal-amber">
            Stage {stage.num} — {stage.name}
          </p>
          <h2 id={`heading-${stage.id}`} className="mb-6 font-mono text-2xl leading-snug text-bone sm:text-[2rem]">
            {stage.heading}
          </h2>
          {stage.copy.map((p) => (
            <p key={p.slice(0, 24)} className="mb-4 max-w-prose text-[1.05rem] leading-relaxed text-bone-dim">
              {p}
            </p>
          ))}

          {stage.facts && (
            <dl className="mt-8 space-y-3 border-l-2 border-rack-steel-light pl-5">
              {stage.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sys-label text-circuit-teal">{f.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-bone">{f.detail}</dd>
                </div>
              ))}
            </dl>
          )}

          {stage.footnote && <p className="sys-label mt-8 text-bone-dim/70">{stage.footnote}</p>}
        </div>
      </div>

      {children && <div className="px-6">{children}</div>}
    </section>
  )
}
