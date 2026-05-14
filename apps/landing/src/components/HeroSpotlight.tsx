import { useEffect, useRef, useState } from 'react'

type Props = { disabled?: boolean }

export function HeroSpotlight({ disabled }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 45 })

  useEffect(() => {
    if (disabled) return
    const root = wrapRef.current
    if (!root) return
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect()
      setPos({
        x: ((e.clientX - r.left) / Math.max(r.width, 1)) * 100,
        y: ((e.clientY - r.top) / Math.max(r.height, 1)) * 100,
      })
    }
    root.addEventListener('mousemove', onMove, { passive: true })
    return () => root.removeEventListener('mousemove', onMove)
  }, [disabled])

  if (disabled) return null

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background: `radial-gradient(520px circle at ${pos.x}% ${pos.y}%, rgba(59,130,246,0.20), transparent 62%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          background: `radial-gradient(260px circle at ${pos.x}% ${pos.y}%, rgba(56,189,248,0.16), transparent 50%)`,
        }}
      />
    </div>
  )
}
