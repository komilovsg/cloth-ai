import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { useI18n } from '../context/I18nContext'
import { useTheme } from '../context/ThemeContext'
import { LANGS } from '../i18n/translations'
import type { LangCode } from '../i18n/translations'
import { LogoMark } from './LogoMark'
import { ShimmerButton } from './ShimmerButton'

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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-5 flex flex-col justify-center gap-[5px]" aria-hidden>
      <motion.span
        className="block h-[2px] w-full rounded-full"
        style={{ background: 'var(--fg)', transformOrigin: 'center' }}
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
      />
      <motion.span
        className="block h-[2px] w-full rounded-full"
        style={{ background: 'var(--fg)' }}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.span
        className="block h-[2px] w-full rounded-full"
        style={{ background: 'var(--fg)', transformOrigin: 'center' }}
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
      />
    </div>
  )
}

export function Header() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 80%, transparent)' }}
    >
      {/* ── Main bar ─────────────────────────────────────── */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="min-w-0 shrink rounded-xl outline-none">
          <LogoMark />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Основное меню">
          {/* Language switcher */}
          <div className="flex items-center rounded-xl border p-0.5" style={{ borderColor: 'var(--border)' }}>
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

          {/* Dashboard — snake border */}
          <a
            href={DASHBOARD_URL}
            className="btn-snake hidden rounded-xl px-3 py-2 text-sm transition hover:opacity-80 sm:inline-block"
            style={{ color: 'var(--muted)' }}
          >
            {t.nav.dashboard}
          </a>

          {/* Telegram — shimmer */}
          <ShimmerButton
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-3 py-2 text-sm font-medium text-white sm:px-4"
            style={{ background: 'var(--accent)', outline: '1px solid var(--accent-ring)' }}
          >
            {t.nav.telegram}
          </ShimmerButton>
        </nav>

        {/* Mobile: theme toggle always visible + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-xl border transition hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-xl border transition hover:opacity-80"
            style={{ borderColor: 'var(--border)' }}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b sm:hidden"
            style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 95%, transparent)' }}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5">
              {/* Language switcher */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Язык / Language
                </p>
                <div className="flex gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code as LangCode); setMenuOpen(false) }}
                      className="flex-1 rounded-xl border py-2 text-sm font-medium transition"
                      style={{
                        borderColor: lang === l.code ? 'var(--accent)' : 'var(--border)',
                        background: lang === l.code ? 'rgba(59,130,246,0.12)' : 'transparent',
                        color: lang === l.code ? 'var(--accent)' : 'var(--muted)',
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: 'var(--border)' }} />

              {/* Dashboard link */}
              <a
                href={DASHBOARD_URL}
                onClick={() => setMenuOpen(false)}
                className="btn-snake flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition"
                style={{ color: 'var(--fg)' }}
              >
                {t.nav.dashboard}
              </a>

              {/* Telegram button */}
              <ShimmerButton
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white"
                style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)', outline: '1px solid var(--accent-ring)' }}
              >
                {t.nav.telegram}
              </ShimmerButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
