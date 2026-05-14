import { DASHBOARD_URL, TELEGRAM_BOT_URL } from './constants/public-links'
import { I18nProvider, useI18n } from './context/I18nContext'
import { ThemeProvider } from './context/ThemeContext'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FadeSection } from './components/Section'
import { ShimmerButton } from './components/ShimmerButton'

function MidCta() {
  const { t } = useI18n()
  const c = t.midCta

  return (
    <FadeSection className="border-b py-16 sm:py-20" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="rounded-2xl border px-6 py-10 text-center sm:px-10"
          style={{
            borderColor: 'rgba(59,130,246,0.2)',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, var(--bg) 100%)',
          }}
        >
          <h2 className="text-xl font-semibold sm:text-2xl" style={{ color: 'var(--fg)' }}>
            {c.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl" style={{ color: 'var(--muted)' }}>
            {c.body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ShimmerButton
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl px-8 py-3 text-base font-medium text-white sm:w-auto"
              style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)', outline: '1px solid var(--accent-ring)' }}
            >
              {c.cta1}
            </ShimmerButton>
            <ShimmerButton
              href={DASHBOARD_URL}
              className="inline-flex w-full items-center justify-center rounded-xl border px-8 py-3 text-base font-medium sm:w-auto"
              style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
            >
              {c.cta2}
            </ShimmerButton>
          </div>
        </div>
      </div>
    </FadeSection>
  )
}

function AppInner() {
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

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppInner />
      </I18nProvider>
    </ThemeProvider>
  )
}
