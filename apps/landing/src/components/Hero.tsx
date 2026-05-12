import { motion, useReducedMotion } from 'framer-motion'
import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { HeroHangerDecoration } from './HeroHangerDecoration'
import { HeroSpotlight } from './HeroSpotlight'

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div
        className="hero-grid-animate pointer-events-none absolute -inset-[100%] opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
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
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-neutral-400 sm:text-sm"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              Платформа для магазинов одежды и цехов
            </motion.p>

            <motion.h1
              className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-neutral-50 sm:text-5xl sm:leading-[1.08] lg:text-6xl"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Ваш магазин на&nbsp;автопилоте: от&nbsp;фото на телефоне до продажи в&nbsp;Telegram за&nbsp;минуты.
            </motion.h1>

            <motion.p
              className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              CLOTH.AI превращает снимки товара в профессиональную витрину с примеркой на типажах и оплатой внутри бота —
              а заказы и статусы вы видите в своей CRM в браузере.
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
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-center text-base font-medium text-white shadow-lg shadow-violet-900/30 ring-1 ring-violet-400/50 transition hover:bg-violet-500"
              >
                Открыть в Telegram
              </a>
              <a
                href={DASHBOARD_URL}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-center text-base font-medium text-neutral-100 transition hover:bg-white/[0.08]"
              >
                Войти в админку
              </a>
            </motion.div>
          </div>

          <HeroHangerDecoration />
        </div>

        <dl className="mt-14 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wider text-neutral-500">Скорость</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-neutral-100 sm:text-3xl">Минуты</dd>
            <dd className="mt-1 text-sm text-neutral-500">Контент и карточки без студии</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-neutral-500">Канал</dt>
            <dd className="mt-1 text-2xl font-semibold text-neutral-100 sm:text-3xl">Telegram</dd>
            <dd className="mt-1 text-sm text-neutral-500">Оплата и статус заказа в боте</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-neutral-500">Контроль</dt>
            <dd className="mt-1 text-2xl font-semibold text-neutral-100 sm:text-3xl">CRM</dd>
            <dd className="mt-1 text-sm text-neutral-500">Заказы и каталог в одном месте</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
