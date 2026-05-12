import { FadeSection } from './Section'
import { IllustrCrm, IllustrOneClick, IllustrShopPhone } from './Illustrations'

const items = [
  {
    title: 'Витрина и магазин с телефона',
    body:
      'Каталог, карточки и покупки там, где уже живут ваши клиенты. Продавец ведёт бизнес с Telegram, покупатель проходит путь от выбора до оплаты без лишних приложений.',
    Figure: IllustrShopPhone,
  },
  {
    title: 'Товар на продажу почти в один жест',
    body:
      'Сфотографировали вещь — получили готовый оффер: описание, визуал и публикация без отдельной «запускай студию» воркфлоу.',
    Figure: IllustrOneClick,
  },
  {
    title: 'Своя CRM в браузере',
    body:
      'Заказы, статусы, каталог и настройки магазина — в админке с тем же фирменным акцентом, что и в продукте. Один вход — полная картина продаж.',
    Figure: IllustrCrm,
  },
] as const

export function Features() {
  return (
    <section className="border-b border-white/5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeSection className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
            Три опоры продукта
          </h2>
          <p className="mt-3 text-neutral-400">
            Крупный hero, три понятных столпа и финальный призыв — без лишнего веса на странице.
          </p>
        </FadeSection>

        <div className="mt-14 flex flex-col gap-16 lg:gap-20">
          {items.map(({ title, body, Figure }, i) => (
            <FadeSection key={title}>
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
              >
                <div className="mx-auto w-full max-w-md lg:mx-0">
                  <Figure className="h-auto w-full drop-shadow-[0_0_40px_rgba(139,92,246,0.12)]" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-violet-400/90">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-neutral-50 sm:text-2xl">{title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-neutral-400 sm:text-lg">{body}</p>
                </div>
              </article>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}
