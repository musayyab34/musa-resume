/**
 * No-WebGL / reduced-motion fallback backdrop. Preserves the visual language —
 * void base, faint teal schematic grid, one amber glow — with no 3D layer.
 */
export default function StaticBackdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-void">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #4FD1C5 1px, transparent 1px), linear-gradient(to bottom, #4FD1C5 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 75%)',
        }}
      />
      <div
        className="absolute left-1/2 top-[62%] h-[46vh] w-[70vw] -translate-x-1/2 rounded-[100%] opacity-[0.10]"
        style={{ background: 'radial-gradient(ellipse at center, #FFB454 0%, transparent 65%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-void to-transparent" />
    </div>
  )
}
