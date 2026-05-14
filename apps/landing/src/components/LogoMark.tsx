import { motion, useReducedMotion } from 'framer-motion'
import { HANGER_WIRE_PATH } from './icons/HangerSymbol'

export function LogoMark({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const gid = 'logo-grad'

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="CLOTH.AI">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-sm ring-1 ring-blue-400/40">
        <svg
          viewBox="0 0 48 42"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-auto"
          aria-hidden
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#bfdbfe" />
            </linearGradient>
          </defs>
          <motion.path
            d={HANGER_WIRE_PATH}
            stroke={`url(#${gid})`}
            strokeWidth={2}
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          />
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>
        CLOTH<span style={{ color: 'var(--accent)' }}>.AI</span>
      </span>
    </div>
  )
}
