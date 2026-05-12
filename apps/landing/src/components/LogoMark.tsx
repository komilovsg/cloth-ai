import { HangerSymbol } from './icons/HangerSymbol'

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label="CLOTH.AI"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-sm ring-1 ring-violet-400/40">
        <HangerSymbol className="h-6 w-auto" stroke="#fafafa" strokeWidth={2} />
      </div>
      <span className="text-lg font-semibold tracking-tight text-neutral-100">
        CLOTH<span className="text-violet-400">.AI</span>
      </span>
    </div>
  )
}
