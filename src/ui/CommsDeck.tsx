import { useEffect, useMemo, useRef, useState } from 'react'
import { identity, roles, skills } from '../content/cv'
import { prefersReducedMotion } from '../store/journeyStore'

/**
 * Exit — Comms Deck. A functional room, not a spectacle one:
 * secure-channel beat, then contact, the employment record,
 * and a compact system inventory.
 */
export default function CommsDeck() {
  const reduced = useMemo(prefersReducedMotion, [])
  const [connected, setConnected] = useState(reduced)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduced || connected) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setConnected(true), 900)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, connected])

  return (
    <section ref={ref} id="comms" aria-label="Contact" className="relative flex min-h-screen items-center px-6 py-[16vh]">
      <div className="mx-auto w-full max-w-3xl">
        <p className="sys-label mb-4 text-signal-amber">Stage 08 — Comms Deck</p>
        <p className="mb-10 font-mono text-sm text-circuit-teal" aria-hidden="true">
          &gt; establishing secure channel{connected ? ' ... connected ✓' : <span className="cursor-blink" />}
        </p>

        <div
          className={`transition-all duration-700 ${connected ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <h2 className="mb-3 font-mono text-2xl text-bone sm:text-[2rem]">Open a connection.</h2>
          <p className="mb-10 max-w-prose leading-relaxed text-bone-dim">
            {identity.thesis} If you need someone who treats your infrastructure like code and your deploys like they
            should be boring, get in touch.
          </p>

          <div className="mb-12 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${identity.email}`}
              className="rounded-sm bg-signal-amber px-5 py-3 font-mono text-sm text-void transition-transform duration-200 hover:-translate-y-0.5"
            >
              {identity.email}
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-rack-steel-light px-5 py-3 font-mono text-sm text-bone transition-colors duration-200 hover:border-signal-amber/70"
            >
              LinkedIn ↗
            </a>
          </div>

          <div className="grid gap-10 border-t border-rack-steel-light/60 pt-10 md:grid-cols-2">
            <div>
              <h3 className="sys-label mb-4 text-bone-dim">Employment record</h3>
              <ul className="list-none space-y-4">
                {roles.map((r) => (
                  <li key={r.title + r.company}>
                    <p className="font-mono text-sm text-bone">{r.title}</p>
                    <p className="text-sm text-bone-dim">
                      {r.company} · {r.period}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="sys-label mb-4 text-bone-dim">System inventory</h3>
              <dl className="space-y-3">
                {Object.entries(skills).map(([group, list]) => (
                  <div key={group} className="text-sm leading-relaxed">
                    <dt className="sys-label inline text-circuit-teal">{group}: </dt>
                    <dd className="inline text-bone-dim">{list.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-rack-steel-light/60 pt-6">
            <p className="sys-label text-bone-dim/70">
              © 2026 {identity.name} · {identity.location}
            </p>
            <p className="sys-label text-bone-dim/70">built with Claude Code</p>
          </footer>
        </div>
      </div>
    </section>
  )
}
