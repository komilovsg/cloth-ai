import { motion, useReducedMotion } from 'framer-motion'
import { HANGER_WIRE_PATH } from './icons/HangerSymbol'

/** Крупная декоративная вешалка справа от hero — контур в фирменном градиенте. */
export function HeroHangerDecoration() {
  const reduce = useReducedMotion()
  const gid = 'hero-hanger-grad'

  return (
    <motion.div
      className="relative flex w-full max-w-md shrink-0 justify-center lg:justify-end"
      initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <svg
        className="h-auto w-full max-w-[min(100%,380px)] drop-shadow-[0_0_56px_rgba(139,92,246,0.38)] lg:max-w-[440px]"
        viewBox="0 0 48 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gid} x1="6" y1="6" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c4b5fd" />
            <stop offset="0.45" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <path
          d={HANGER_WIRE_PATH}
          stroke={`url(#${gid})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}
