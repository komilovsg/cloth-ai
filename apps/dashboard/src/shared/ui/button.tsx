import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<Variant, string> = {
    primary: 'bg-violet-500 text-white hover:bg-violet-400',
    secondary:
      'bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50 dark:ring-transparent dark:hover:bg-neutral-700',
    ghost:
      'bg-transparent text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900',
  }

  return (
    <button className={[base, variants[variant], className].join(' ')} {...props}>
      {children}
    </button>
  )
}

