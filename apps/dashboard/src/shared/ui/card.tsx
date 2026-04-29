import type { PropsWithChildren } from 'react'

export function Card({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        'rounded-2xl bg-neutral-900/60 ring-1 ring-white/10',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

