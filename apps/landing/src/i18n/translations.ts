export const LANGS = [
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'Eng' },
  { code: 'tg', label: 'Тоҷ' },
] as const

export type LangCode = (typeof LANGS)[number]['code']

export interface Translations {
  nav: { dashboard: string; telegram: string }
  hero: {
    badge: string
    title: string
    subtitle: string
    cta1: string
    cta2: string
    stat1: { label: string; value: string; desc: string }
    stat2: { label: string; value: string; desc: string }
    stat3: { label: string; value: string; desc: string }
  }
  features: {
    heading: string
    subheading: string
    items: Array<{ title: string; body: string }>
  }
  midCta: { title: string; body: string; cta1: string; cta2: string }
  footer: { desc: string; cta1: string; cta2: string }
}

const ru: Translations = {
  nav: { dashboard: 'Админка', telegram: 'Telegram' },
  hero: {
    badge: 'Платформа для магазинов одежды и цехов',
    title: 'Ваш магазин на автопилоте: от фото до продажи в Telegram за минуты.',
    subtitle:
      'CLOTH.AI превращает снимки товара в профессиональную витрину с примеркой на типажах и оплатой внутри бота — а заказы и статусы вы видите в своей CRM в браузере.',
    cta1: 'Открыть в Telegram',
    cta2: 'Войти в админку',
    stat1: { label: 'Скорость', value: 'Минуты', desc: 'Контент и карточки без студии' },
    stat2: { label: 'Канал', value: 'Telegram', desc: 'Оплата и статус заказа в боте' },
    stat3: { label: 'Контроль', value: 'CRM', desc: 'Заказы и каталог в одном месте' },
  },
  features: {
    heading: 'Три опоры продукта',
    subheading: 'Витрина, генерация контента и CRM — всё в одной платформе.',
    items: [
      {
        title: 'Витрина и магазин с телефона',
        body: 'Каталог, карточки и покупки там, где уже живут ваши клиенты. Продавец ведёт бизнес с Telegram, покупатель проходит путь от выбора до оплаты без лишних приложений.',
      },
      {
        title: 'Товар на продажу почти в один жест',
        body: 'Сфотографировали вещь — получили готовый оффер: описание, визуал и публикация без отдельной «запускай студию» воркфлоу.',
      },
      {
        title: 'Своя CRM в браузере',
        body: 'Заказы, статусы, каталог и настройки магазина — в админке с тем же фирменным акцентом, что и в продукте. Один вход — полная картина продаж.',
      },
    ],
  },
  midCta: {
    title: 'Готовы показать коллекцию клиентам в Telegram?',
    body: 'Подключите бота и откройте витрину — Telegram-магазин без разработчиков и студии.',
    cta1: 'Открыть в Telegram',
    cta2: 'Войти в админку',
  },
  footer: {
    desc: 'Платформа для магазинов одежды и цехов: фото товара с телефона, витрина и оплата в Telegram, заказы и каталог — в админке.',
    cta1: 'Запустить в Telegram',
    cta2: 'Панель продавца',
  },
}

const en: Translations = {
  nav: { dashboard: 'Dashboard', telegram: 'Telegram' },
  hero: {
    badge: 'Platform for clothing stores and ateliers',
    title: 'Your store on autopilot: from phone photo to Telegram sale in minutes.',
    subtitle:
      'CLOTH.AI turns product photos into a professional storefront with try-on visuals and in-bot checkout — while orders and statuses appear in your browser CRM.',
    cta1: 'Open in Telegram',
    cta2: 'Go to Dashboard',
    stat1: { label: 'Speed', value: 'Minutes', desc: 'Content & cards without a studio' },
    stat2: { label: 'Channel', value: 'Telegram', desc: 'Payment & order status in the bot' },
    stat3: { label: 'Control', value: 'CRM', desc: 'Orders & catalog in one place' },
  },
  features: {
    heading: 'Three pillars of the product',
    subheading: 'Storefront, content generation and CRM — all in one platform.',
    items: [
      {
        title: 'Storefront & shop from your phone',
        body: 'Catalog, cards and purchases where your customers already live. The seller manages business from Telegram, the buyer goes from selection to payment without extra apps.',
      },
      {
        title: 'Product for sale in almost one gesture',
        body: 'Photograph an item — get a ready offer: description, visual and publication without a separate studio workflow.',
      },
      {
        title: 'Your own CRM in the browser',
        body: 'Orders, statuses, catalog and store settings in a dashboard with the same brand accent as the product. One login — the full picture of sales.',
      },
    ],
  },
  midCta: {
    title: 'Ready to show your collection to customers in Telegram?',
    body: 'Connect the bot and open your storefront — a Telegram store without developers or a studio.',
    cta1: 'Open in Telegram',
    cta2: 'Go to Dashboard',
  },
  footer: {
    desc: 'Platform for clothing stores and ateliers: product photos from your phone, storefront and payment in Telegram, orders and catalog in the dashboard.',
    cta1: 'Launch in Telegram',
    cta2: 'Seller Dashboard',
  },
}

const tg: Translations = {
  nav: { dashboard: 'Панел', telegram: 'Telegram' },
  hero: {
    badge: 'Платформа барои мағозаҳои либос ва корхонаҳо',
    title: 'Мағозаи шумо дар автопилот: аз акси телефон то фурӯш дар Telegram дар чанд дақиқа.',
    subtitle:
      'CLOTH.AI акси молро ба витринаи касбӣ табдил медиҳад — бо намоиш дар намунаҳо ва пардохт дар дохили бот. Фармоишҳо дар браузери шумо.',
    cta1: 'Дар Telegram кушоед',
    cta2: 'Вориди панел шавед',
    stat1: { label: 'Суръат', value: 'Дақиқаҳо', desc: 'Контент бе студия' },
    stat2: { label: 'Канал', value: 'Telegram', desc: 'Пардохт ва статуси фармоиш' },
    stat3: { label: 'Назорат', value: 'CRM', desc: 'Фармоишҳо ва каталог дар як ҷо' },
  },
  features: {
    heading: 'Се сутуни маҳсулот',
    subheading: 'Витрина, тавлиди контент ва CRM — ҳама дар як платформа.',
    items: [
      {
        title: 'Витрина ва мағоза аз телефон',
        body: 'Каталог, коллекция ва харид дар ҳамон ҷое, ки муштариёни шумо ҳастанд. Фурӯшанда аз Telegram кор мекунад, харидор бе барномаҳои иловагӣ мекунад.',
      },
      {
        title: 'Мол барои фурӯш дар як ҳаракат',
        body: 'Акс гирифтед — офери омода гирифтед: тавсиф, визуал ва нашр бе воркфлоуи студияи алоҳида.',
      },
      {
        title: 'CRM-и худатон дар браузер',
        body: 'Фармоишҳо, статусҳо, каталог ва танзимоти мағоза — дар як ҷо. Як вуруд — тасвири пурраи фурӯш.',
      },
    ],
  },
  midCta: {
    title: 'Омодаед коллексияро ба муштариён дар Telegram нишон диҳед?',
    body: 'Ботро пайваст кунед ва витринаро кушоед — мағозаи Telegram бе барномасоз.',
    cta1: 'Дар Telegram кушоед',
    cta2: 'Вориди панел шавед',
  },
  footer: {
    desc: 'Платформа барои мағозаҳои либос: акси мол аз телефон, витрина ва пардохт дар Telegram, фармоишҳо ва каталог дар панел.',
    cta1: 'Дар Telegram оғоз кунед',
    cta2: 'Панели фурӯшанда',
  },
}

export const translations: Record<LangCode, Translations> = { ru, en, tg }
