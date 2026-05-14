import { motion } from 'framer-motion'
import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Anchor button with a periodic shimmer sweep on hover. */
export function ShimmerButton({ children, className = '', style, ...rest }: Props) {
  return (
    <motion.a
      {...(rest as object)}
      className={`relative overflow-hidden ${className}`}
      style={style}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        initial={{ x: '-120%', skewX: '-18deg' }}
        animate={{ x: '220%', skewX: '-18deg' }}
        transition={{
          duration: 0.75,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
          width: '45%',
        }}
      />
      {children}
    </motion.a>
  )
}
