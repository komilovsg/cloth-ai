import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { DASHBOARD_URL, TELEGRAM_BOT_URL } from './constants/public-links'
import { FadeSection } from './components/Section'

function MidCta() {
  return (
    <FadeSection className="border-b border-white/5 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 to-[#0a0a0a] px-6 py-10 text-center sm:px-10">
          <h2 className="text-xl font-semibold text-neutral-50 sm:text-2xl">
            Готовы показать коллекцию клиентам в Telegram?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-400">
            Подключите бота и админку — ссылки на них заданы в коде лендинга и попадают в сборку без отдельного .env.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-violet-900/25 ring-1 ring-violet-400/45 transition hover:bg-violet-500 sm:w-auto"
            >
              Открыть в Telegram
            </a>
            <a
              href={DASHBOARD_URL}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-8 py-3 text-base font-medium text-neutral-200 transition hover:bg-white/5 sm:w-auto"
            >
              Админка продавца
            </a>
          </div>
        </div>
      </div>
    </FadeSection>
  )
}

export default function App() {
  return (
    <div id="top" className="min-h-full">
      <Header />
      <main>
        <Hero />
        <Features />
        <MidCta />
      </main>
      <Footer />
    </div>
  )
}
