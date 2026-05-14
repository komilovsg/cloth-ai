import { motion, useReducedMotion } from 'framer-motion'
import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { useI18n } from '../context/I18nContext'
import { HeroHangerDecoration } from './HeroHangerDecoration'
import { HeroSpotlight } from './HeroSpotlight'

export function Hero() {
  const reduce = useReducedMotion()
  const { t } = useI18n()
  const h = t.hero

  return (
    <section className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
      <div
        className="hero-grid-animate pointer-events-none absolute -inset-[100%] opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <HeroSpotlight disabled={reduce === true} />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:pt-24">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] lg:items-center lg:gap-10 xl:gap-14">
          <div className="min-w-0">
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm"
              style={{ borderColor: 'var(--border)', background: 'rgba(59,130,246,0.06)', color: 'var(--muted)' }}
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              {h.badge}
            </motion.p>

            <motion.h1
              className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.08] lg:text-6xl"
              style={{ color: 'var(--fg)' }}
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              {h.title}
            </motion.h1>

            <motion.p
              className="mt-5 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg"
              style={{ color: 'var(--muted)' }}
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-center text-base font-medium text-white transition hover:opacity-90"
                style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)', outline: '1px solid var(--accent-ring)' }}
              >
                {h.cta1}
              </a>
              <a
                href={DASHBOARD_URL}
                className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-center text-base font-medium transition hover:opacity-80"
                style={{ borderColor: 'var(--border)', color: 'var(--fg)', background: 'rgba(255,255,255,0.03)' }}
              >
                {h.cta2}
              </a>
            </motion.div>
          </div>

          <HeroHangerDecoration />
        </div>

        <dl
          className="mt-14 grid gap-6 border-t pt-10 sm:grid-cols-3"
          style={{ borderColor: 'var(--border)' }}
        >
          {([h.stat1, h.stat2, h.stat3] as const).map((s) => (
            <div key={s.label}>
              <dt className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{s.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums sm:text-3xl" style={{ color: 'var(--fg)' }}>{s.value}</dd>
              <dd className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{s.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
