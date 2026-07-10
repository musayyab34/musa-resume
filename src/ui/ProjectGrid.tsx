import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects, type Project } from '../content/cv'
import { prefersReducedMotion } from '../store/journeyStore'

/** Projects Hangar pods — the information-dense, "hire me" room. */
export default function ProjectGrid() {
  const gridRef = useRef<HTMLUListElement>(null)
  const reduced = useMemo(prefersReducedMotion, [])

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('li').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          },
        )
      })
    }, gridRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <ul ref={gridRef} className="mx-auto mt-4 grid max-w-6xl list-none gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p, i) => (
        <ProjectCard key={p.name} project={p} index={i} />
      ))}
    </ul>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false)
  const bodyId = `pod-body-${index}`

  return (
    <li className="rounded-md border border-rack-steel-light bg-rack-steel/85 backdrop-blur-sm transition-colors duration-300 hover:border-signal-amber/60">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
      >
        <span>
          <span className="sys-label block text-bone-dim">
            Pod {String(index + 1).padStart(2, '0')} · {project.org}
          </span>
          <span className="mt-2 block font-mono text-lg text-bone">{project.name}</span>
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 font-mono text-signal-amber transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>

      <div
        id={bodyId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <p className="text-sm leading-relaxed text-bone-dim">{project.summary}</p>
            <p className="mt-3 text-sm leading-relaxed text-bone">
              <span className="sys-label mr-2 text-circuit-teal">Outcome</span>
              {project.outcome}
            </p>
          </div>
        </div>
      </div>

      <ul className="flex list-none flex-wrap gap-2 border-t border-rack-steel-light/60 px-6 py-4">
        {project.stack.map((tech) => (
          <li key={tech} className="sys-label rounded-sm bg-rack-steel-light/50 px-2 py-1 text-bone-dim">
            {tech}
          </li>
        ))}
      </ul>
    </li>
  )
}
