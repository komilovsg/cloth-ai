import type { PropsWithChildren } from 'react'
import { useDashboardPrefsStore } from '../../features/dashboard-prefs-store'

export function Card({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  const theme = useDashboardPrefsStore((s) => s.theme)
  const surface =
    theme === 'light'
      ? 'rounded-2xl bg-white ring-1 ring-neutral-200 shadow-sm'
      : 'rounded-2xl bg-neutral-900/60 ring-1 ring-white/10'

  return (
    <div className={[surface, className].join(' ')}>
      {children}
    </div>
  )
}

