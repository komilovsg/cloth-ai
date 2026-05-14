import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { useI18n } from '../context/I18nContext'
import { LogoMark } from './LogoMark'

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t py-12" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <LogoMark />
          <p className="mt-3 max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
            {t.footer.desc}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
            style={{ background: 'var(--accent)', outline: '1px solid var(--accent-ring)' }}
          >
            {t.footer.cta1}
          </a>
          <a
            href={DASHBOARD_URL}
            className="text-center text-sm underline underline-offset-2 transition hover:opacity-80 sm:text-right"
            style={{ color: 'var(--accent)', textDecorationColor: 'var(--accent-ring)' }}
          >
            {t.footer.cta2}
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs sm:px-6" style={{ color: 'var(--muted)' }}>
        © {year} CLOTH.AI
      </p>
    </footer>
  )
}
