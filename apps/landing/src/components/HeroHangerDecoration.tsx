import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { HANGER_WIRE_PATH } from './icons/HangerSymbol'

export function HeroHangerDecoration() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const gid = 'hero-hanger-blue'

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 40])

  return (
    <motion.div
      ref={ref}
      className="relative flex w-full max-w-md shrink-0 justify-center lg:justify-end"
      style={reduce ? {} : { y }}
      initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <svg
        className="h-auto w-full max-w-[min(100%,380px)] lg:max-w-[440px]"
        style={{ filter: 'drop-shadow(0 0 56px rgba(59,130,246,0.35))' }}
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
    </motion.div>
  )
}
