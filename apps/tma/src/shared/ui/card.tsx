import type { PropsWithChildren } from 'react'
import { usePrefsStore } from '../../features/preferences/prefs-store'

export function Card({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  const theme = usePrefsStore((s) => s.theme)
  const surface =
    theme === 'light'
      ? 'rounded-2xl bg-white/95 ring-1 ring-neutral-200/90 shadow-sm text-neutral-900'
      : 'rounded-2xl bg-neutral-900/60 ring-1 ring-white/10'

  return <div className={[surface, className].join(' ')}>{children}</div>
}

