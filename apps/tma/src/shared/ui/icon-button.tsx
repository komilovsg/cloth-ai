import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { usePrefsStore } from '../../features/preferences/prefs-store'

type Variant = 'primary' | 'secondary' | 'ghost'

export function IconButton({
  children,
  className = '',
  variant = 'ghost',
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>) {
  const theme = usePrefsStore((s) => s.theme)

  const base =
    'inline-flex items-center justify-center rounded-xl p-2 ring-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:opacity-50 disabled:pointer-events-none'

  const secondary =
    theme === 'light'
      ? 'bg-neutral-100 text-neutral-900 ring-neutral-200 hover:bg-neutral-200'
      : 'bg-neutral-800 text-neutral-50 ring-white/10 hover:bg-neutral-700'

  const ghost =
    theme === 'light'
      ? 'bg-transparent text-neutral-800 ring-neutral-200 hover:bg-neutral-100'
      : 'bg-transparent text-neutral-100 ring-white/10 hover:bg-neutral-900'

  const variants: Record<Variant, string> = {
    primary: 'bg-violet-500 text-white ring-violet-400 hover:bg-violet-400',
    secondary,
    ghost,
  }

  return (
    <button className={[base, variants[variant], className].join(' ')} {...props}>
      {children}
    </button>
  )
}

