import { useI18n } from '../context/I18nContext'
import { FadeSection, StaggerItem, StaggerSection } from './Section'
import { IllustrCatalogWizard, IllustrMiniApp, IllustrOrders } from './Illustrations'

const FIGURES = [IllustrMiniApp, IllustrCatalogWizard, IllustrOrders] as const

export function Features() {
  const { t } = useI18n()
  const { heading, subheading, items } = t.features

  return (
    <section className="border-b py-16 sm:py-24" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeSection className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: 'var(--fg)' }}>
            {heading}
          </h2>
          <p className="mt-3" style={{ color: 'var(--muted)' }}>{subheading}</p>
        </FadeSection>

        <div className="mt-14 flex flex-col gap-20 lg:gap-28">
          {items.map((item, i) => {
            const Figure = FIGURES[i]!
            return (
              <StaggerSection
                key={item.title}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
              >
                <StaggerItem className="mx-auto w-full max-w-lg lg:mx-0">
                  <div
                    className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: 'var(--border)', boxShadow: '0 0 48px rgba(59,130,246,0.10)' }}
                  >
                    <Figure className="h-auto w-full" aria-hidden />
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <p
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--accent)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: 'var(--fg)' }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--muted)' }}>
                    {item.body}
                  </p>
                </StaggerItem>
              </StaggerSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
