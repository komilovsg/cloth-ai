import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { LogoMark } from './LogoMark'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="min-w-0 shrink rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
          <LogoMark />
        </a>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Основное меню">
          <a
            href={DASHBOARD_URL}
            className="hidden rounded-xl px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white sm:inline-block"
          >
            Админка
          </a>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-violet-400/40 transition hover:bg-violet-500 sm:px-4"
          >
            Telegram
          </a>
        </nav>
      </div>
    </header>
  )
}
