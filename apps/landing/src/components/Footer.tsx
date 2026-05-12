import { DASHBOARD_URL, TELEGRAM_BOT_URL } from '../constants/public-links'
import { LogoMark } from './LogoMark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <LogoMark />
          <p className="mt-3 max-w-sm text-sm text-neutral-500">
            Платформа для магазинов одежды и цехов: фото товара с телефона, витрина и оплата в Telegram,
            заказы и каталог — в админке. Условия оплаты и доставки настраиваются под ваш магазин.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-violet-400/40 transition hover:bg-violet-500 sm:w-auto"
          >
            Запустить в Telegram
          </a>
          <a
            href={DASHBOARD_URL}
            className="text-center text-sm text-violet-400 underline decoration-violet-500/40 underline-offset-2 hover:text-violet-300 sm:text-right"
          >
            Панель продавца
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-neutral-600 sm:px-6">
        © {year} CLOTH.AI
      </p>
    </footer>
  )
}
