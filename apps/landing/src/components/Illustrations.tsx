import type { SVGProps } from 'react'

type SvgProps = SVGProps<SVGSVGElement>

/** Inline SVG — темы: витрина + телефон, загрузка в один клик, CRM заказы */

export function IllustrShopPhone(props: SvgProps) {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="ip1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>
      </defs>
      <rect x="24" y="40" width="220" height="200" rx="16" fill="#171717" stroke="#404040" strokeWidth="1.5" />
      <rect x="40" y="56" width="80" height="72" rx="8" fill="#262626" stroke="#525252" />
      <rect x="132" y="56" width="80" height="72" rx="8" fill="#262626" stroke="#525252" />
      <rect x="40" y="140" width="80" height="72" rx="8" fill="#262626" stroke="#525252" />
      <rect x="132" y="140" width="80" height="72" rx="8" fill="#262626" stroke="#525252" />
      <path d="M196 24h64c8 0 14 6 14 14v188c0 8-6 14-14 14h-64" stroke="url(#ip1)" strokeWidth="2" strokeLinecap="round" />
      <rect x="248" y="48" width="104" height="184" rx="18" fill="#0a0a0a" stroke="#525252" strokeWidth="1.5" />
      <rect x="258" y="60" width="84" height="148" rx="10" fill="#171717" />
      <circle cx="300" cy="216" r="6" fill="#404040" />
      <rect x="268" y="76" width="64" height="48" rx="6" fill="#262626" stroke="#8b5cf6" strokeOpacity="0.5" />
      <path d="M284 124l8 8 16-16" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IllustrOneClick(props: SvgProps) {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="ip2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <rect x="48" y="48" width="200" height="160" rx="20" fill="#171717" stroke="#404040" strokeWidth="1.5" />
      <circle cx="148" cy="128" r="44" fill="#262626" stroke="url(#ip2)" strokeWidth="2" />
      <path
        d="M128 128h40M148 108v40"
        stroke="#d8b4fe"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="268" y="72" width="96" height="72" rx="12" fill="#0a0a0a" stroke="#525252" />
      <path d="M296 108l12 12 24-24" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IllustrCrm(props: SvgProps) {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="32" y="40" width="336" height="200" rx="14" fill="#0a0a0a" stroke="#404040" strokeWidth="1.5" />
      <rect x="48" y="56" width="72" height="8" rx="4" fill="#525252" />
      <rect x="48" y="76" width="120" height="6" rx="3" fill="#404040" />
      <rect x="48" y="104" width="304" height="1" fill="#262626" />
      <rect x="48" y="120" width="88" height="28" rx="6" fill="#171717" stroke="#8b5cf6" strokeOpacity="0.4" />
      <rect x="148" y="120" width="88" height="28" rx="6" fill="#171717" stroke="#404040" />
      <rect x="248" y="120" width="88" height="28" rx="6" fill="#171717" stroke="#404040" />
      <rect x="48" y="164" width="304" height="36" rx="8" fill="#171717" stroke="#404040" />
      <circle cx="64" cy="182" r="6" fill="#22c55e" opacity="0.8" />
      <rect x="80" y="174" width="120" height="8" rx="2" fill="#525252" />
      <rect x="80" y="188" width="80" height="6" rx="2" fill="#404040" />
      <rect x="280" y="176" width="56" height="20" rx="6" fill="#7c3aed" opacity="0.9" />
    </svg>
  )
}
