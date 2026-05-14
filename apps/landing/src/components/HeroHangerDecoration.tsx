import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'
import { HANGER_WIRE_PATH } from './icons/HangerSymbol'

export function HeroHangerDecoration() {
  const reduce = useReducedMotion()
  const outerRef = useRef<HTMLDivElement>(null)
  const gid = 'hero-hanger-blue'

  /* ── Scroll parallax ─────────────────────────────────── */
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end start'] })
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 40])

  /* ── Mouse tracking (normalized -1..1) ──────────────── */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-20, 20]), { stiffness: 140, damping: 18 })
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [14, -14]), { stiffness: 140, damping: 18 })

  /* Specular glow: opposite corner from mouse */
  const glowX = useTransform(rawX, [-1, 1], ['78%', '22%'])
  const glowY = useTransform(rawY, [-1, 1], ['78%', '22%'])
  const glowBg = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, rgba(147,197,253,0.5), transparent 65%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !outerRef.current) return
    const r = outerRef.current.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1)
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={outerRef}
      className="relative flex w-full max-w-md shrink-0 justify-center lg:justify-end"
      style={reduce ? {} : { y: scrollY, perspective: '900px' }}
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden
    >
      {/* 3-D tilt inner */}
      <motion.div
        className="relative w-full max-w-[min(100%,380px)] lg:max-w-[440px]"
        style={
          reduce
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }
        }
      >
        <svg
          className="h-auto w-full"
          style={{ filter: 'drop-shadow(0 0 56px rgba(59,130,246,0.38))' }}
          viewBox="0 0 48 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gid} x1="6" y1="6" x2="42" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93c5fd" />
              <stop offset="0.45" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <motion.path
            d={HANGER_WIRE_PATH}
            stroke={`url(#${gid})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Specular highlight — opposite side of cursor */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ background: glowBg, mixBlendMode: 'screen' }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
