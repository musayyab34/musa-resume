import { useEffect, useMemo, useState } from 'react'
import { bootSequence, identity } from '../content/cv'
import { prefersReducedMotion } from '../store/journeyStore'

interface TypedLine {
  prompt: string
  output: string
}

/**
 * Entry — Exterior Approach. A terminal boot sequence types out identity
 * instead of a static headline. All text is real DOM content.
 */
export default function Hero() {
  const reduced = useMemo(prefersReducedMotion, [])
  const lines = bootSequence as readonly TypedLine[]
  // charCount counts characters across prompts only; outputs print whole,
  // the way command output actually appears after a command is entered.
  const [lineIdx, setLineIdx] = useState(reduced ? lines.length : 0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (reduced || lineIdx >= lines.length) return
    const prompt = lines[lineIdx].prompt
    const t = window.setTimeout(
      () => {
        if (charIdx < prompt.length) setCharIdx(charIdx + 1)
        else {
          setLineIdx(lineIdx + 1)
          setCharIdx(0)
        }
      },
      charIdx === 0 ? 620 : 46,
    )
    return () => window.clearTimeout(t)
  }, [reduced, lineIdx, charIdx, lines])

  const done = lineIdx >= lines.length

  return (
    <section id="hero" aria-label="Introduction" className="relative flex min-h-[160vh] flex-col">
      <h1 className="sr-only">
        {identity.name} — {identity.title}, {identity.location}. {identity.thesis}
      </h1>

      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <p className="sys-label mb-6 text-bone-dim">
            The Infrastructure Journey <span aria-hidden="true">·</span> boot sequence
          </p>

          <div
            className="rounded-md border border-rack-steel-light bg-[#10141d]/95 p-6 font-mono text-sm leading-8 backdrop-blur-sm sm:p-8 sm:text-base"
            role="log"
            aria-live="polite"
          >
            {lines.map((line, i) => {
              if (i > lineIdx) return null
              const typing = i === lineIdx
              const promptText = typing ? line.prompt.slice(0, charIdx) : line.prompt
              const isLast = i === lines.length - 1
              return (
                <div key={line.prompt}>
                  <p className={isLast ? 'text-signal-amber' : 'text-bone'}>
                    <span className="select-none text-bone-dim">&gt; </span>
                    {promptText}
                    {(typing || (done && isLast)) && <span className="cursor-blink" aria-hidden="true" />}
                  </p>
                  {!typing && line.output && <p className="pl-5 text-circuit-teal">{line.output}</p>}
                </div>
              )
            })}
          </div>

          <p
            className={`sys-label mt-10 text-center text-bone-dim transition-opacity duration-1000 ${done ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!done}
          >
            ▼ scroll to enter the facility
          </p>
        </div>
      </div>

      {/* Approach beat: the tail of the section is empty scroll distance while
          the camera closes in on the building exterior. */}
      <div className="h-[60vh]" aria-hidden="true" />
    </section>
  )
}
