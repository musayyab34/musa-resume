import { stages } from '../content/cv'
import { useJourneyStore } from '../store/journeyStore'
import { scrollToId } from '../lib/scroll'

const items = [
  { id: 'hero', num: '00', name: 'Exterior' },
  ...stages.map((s) => ({ id: `stage-${s.id}`, num: s.num, name: s.name })),
  { id: 'comms', num: '08', name: 'Comms Deck' },
]

/**
 * Fixed pipeline rail — the journey really is sequential, so the stage
 * numbers are information, the way a CI pipeline reports its stages.
 */
export default function ProgressRail() {
  const current = useJourneyStore((s) => s.currentStage)

  return (
    <nav aria-label="Journey stages" className="fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
      <ol className="list-none space-y-1">
        {items.map((item, i) => {
          const active = current === i - 1
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToId(item.id)}
                aria-current={active ? 'step' : undefined}
                className={`group flex items-center gap-3 py-1 transition-colors duration-300 ${
                  active ? 'text-signal-amber' : 'text-bone-dim/50 hover:text-bone-dim'
                }`}
              >
                <span className="sys-label w-6 text-right">{item.num}</span>
                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-300 ${active ? 'w-6 bg-signal-amber' : 'w-3 bg-current'}`}
                />
                <span className="sys-label whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-80 group-focus-visible:opacity-80">
                  {item.name}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
