import { identity } from '../content/cv'
import { scrollToId } from '../lib/scroll'

export default function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 bg-gradient-to-b from-void/90 to-transparent">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => scrollToId('hero')}
          className="pointer-events-auto flex items-center gap-3"
          aria-label="Back to top"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-signal-amber/60 font-mono text-sm text-signal-amber">
            MM
          </span>
          <span className="sys-label hidden text-bone-dim sm:block">{identity.title}</span>
        </button>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToId('comms')}
            className="sys-label rounded-sm bg-signal-amber px-3 py-2 text-void transition-transform duration-200 hover:-translate-y-0.5"
          >
            Contact
          </button>
        </div>
      </div>
    </header>
  )
}
