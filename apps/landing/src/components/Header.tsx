import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { useI18n } from '../context/I18nContext'
import { useTheme } from '../context/ThemeContext'
import { LANGS } from '../i18n/translations'
import type { LangCode } from '../i18n/translations'
import { LogoMark } from './LogoMark'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function Header() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggle } = useTheme()

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 80%, transparent)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="min-w-0 shrink rounded-xl outline-none focus-visible:ring-2"
          style={{ ['--tw-ring-color' as string]: 'var(--accent)' }}
        >
          <LogoMark />
        </a>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Основное меню">
          {/* Language switcher */}
          <div className="hidden items-center rounded-xl border p-0.5 sm:flex" style={{ borderColor: 'var(--border)' }}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as LangCode)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium transition"
                style={{
                  background: lang === l.code ? 'var(--accent)' : 'transparent',
                  color: lang === l.code ? '#fff' : 'var(--muted)',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-xl border transition hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <a
            href={DASHBOARD_URL}
            className="hidden rounded-xl px-3 py-2 text-sm transition hover:opacity-80 sm:inline-block"
            style={{ color: 'var(--muted)' }}
          >
            {t.nav.dashboard}
          </a>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 sm:px-4"
            style={{ background: 'var(--accent)', outline: '1px solid var(--accent-ring)' }}
          >
            {t.nav.telegram}
          </a>
        </nav>
      </div>
    </header>
  )
}
