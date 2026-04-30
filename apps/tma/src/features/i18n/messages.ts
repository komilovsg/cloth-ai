import type { LocaleCode } from '../preferences/prefs-store'

export type MessageKey =
  | 'catalogTitle'
  | 'catalogSubtitle'
  | 'navCatalog'
  | 'navCart'
  | 'navCheckout'
  | 'navOrders'
  | 'navAvatar'
  | 'menuTitle'
  | 'themeSection'
  | 'themeDark'
  | 'themeLight'
  | 'languageRu'
  | 'languageTg'
  | 'modelChip'

const ru: Record<MessageKey, string> = {
  catalogTitle: 'Витрина',
  catalogSubtitle: 'Подбор образа и оплата в пару шагов.',
  navCatalog: 'Витрина',
  navCart: 'Корзина',
  navCheckout: 'Оформление',
  navOrders: 'Мои заказы',
  navAvatar: 'Типаж',
  menuTitle: 'Меню',
  themeSection: 'Тема оформления',
  themeDark: 'Тёмная',
  themeLight: 'Светлая',
  languageRu: 'Русский',
  languageTg: 'Тоҷикӣ',
  modelChip: 'Типаж',
}

const tg: Record<MessageKey, string> = {
  catalogTitle: 'Витрина',
  catalogSubtitle: 'Интихоби либос ва пардохт дар якҷоя осон.',
  navCatalog: 'Витрина',
  navCart: 'Сабад',
  navCheckout: 'Пардохт',
  navOrders: 'Фармонҳо',
  navAvatar: 'Намуд',
  menuTitle: 'Меню',
  themeSection: 'Мавзӯъ',
  themeDark: 'Торик',
  themeLight: 'Равшан',
  languageRu: 'Русӣ',
  languageTg: 'Тоҷикӣ',
  modelChip: 'Намуд',
}

export function t(locale: LocaleCode, key: MessageKey): string {
  const table = locale === 'tg' ? tg : ru
  return table[key] ?? ru[key]
}
