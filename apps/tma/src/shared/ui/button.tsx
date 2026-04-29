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
    'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<Variant, string> = {
    primary: 'bg-violet-500 text-white hover:bg-violet-400',
    secondary: 'bg-neutral-800 text-neutral-50 hover:bg-neutral-700',
    ghost: 'bg-transparent text-neutral-100 hover:bg-neutral-900',
  }

  return (
    <button className={[base, variants[variant], className].join(' ')} {...props}>
      {children}
    </button>
  )
}

