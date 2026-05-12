import { useEffect, useRef, useState } from 'react'

type Props = {
  disabled?: boolean
}

/** Radial glow following pointer — GPU-friendly (one gradient, no blur stack). */
export function HeroSpotlight({ disabled }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 45 })

  useEffect(() => {
    if (disabled) return
    const root = wrapRef.current
    if (!root) return

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect()
      const x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100
      const y = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100
      setPos({ x, y })
    }

    root.addEventListener('mousemove', onMove, { passive: true })
    return () => root.removeEventListener('mousemove', onMove)
  }, [disabled])

  if (disabled) return null

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          background: `radial-gradient(520px circle at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.22), transparent 62%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-35 mix-blend-screen"
        style={{
          background: `radial-gradient(280px circle at ${pos.x}% ${pos.y}%, rgba(217,70,239,0.18), transparent 50%)`,
        }}
      />
    </div>
  )
}
