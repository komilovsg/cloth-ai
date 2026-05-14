import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  id?: string
  style?: CSSProperties
}

const ease = [0.22, 1, 0.36, 1] as const

export function FadeSection({ children, className = '', id, style }: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.section
      id={id}
      className={className}
      style={style}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px', amount: 0.15 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.section>
  )
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export function StaggerSection({ children, className = '', id }: Props) {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }
  return (
    <motion.section
      id={id}
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px', amount: 0.15 }}
    >
      {children}
    </motion.section>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
