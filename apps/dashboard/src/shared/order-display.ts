import type { CheckoutMethod, OrderStatus } from '@cloth-ai/contracts'

export const METHOD_LABEL_RU: Record<CheckoutMethod, string> = {
  online: 'Онлайн',
  cod: 'При получении',
  reserve: 'Резерв',
}

export const STATUS_LABEL_RU: Record<OrderStatus, string> = {
  created: 'Создан',
  paid: 'Оплачен',
  reserved: 'Резерв',
  awaiting_cod: 'Ждём оплату при получении',
  packing: 'Сборка',
  shipping: 'Доставка',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export function methodBadgeClass(method: CheckoutMethod): string {
  switch (method) {
    case 'online':
      return 'bg-sky-100 text-sky-900 ring-sky-400 dark:bg-sky-500/15 dark:text-sky-100 dark:ring-sky-400/35'
    case 'cod':
      return 'bg-amber-100 text-amber-950 ring-amber-400 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/35'
    case 'reserve':
      return 'bg-violet-100 text-violet-900 ring-violet-400 dark:bg-violet-500/15 dark:text-violet-100 dark:ring-violet-400/35'
    default:
      return 'bg-neutral-100 text-neutral-900 ring-neutral-300 dark:bg-neutral-950/60 dark:text-neutral-200 dark:ring-white/10'
  }
}

export function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-900 ring-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-100 dark:ring-emerald-400/35'
    case 'reserved':
      return 'bg-violet-100 text-violet-900 ring-violet-400 dark:bg-violet-500/15 dark:text-violet-100 dark:ring-violet-400/35'
    case 'awaiting_cod':
      return 'bg-amber-100 text-amber-950 ring-amber-400 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/35'
    case 'packing':
    case 'shipping':
      return 'bg-sky-100 text-sky-900 ring-sky-400 dark:bg-sky-500/15 dark:text-sky-100 dark:ring-sky-400/35'
    case 'delivered':
      return 'bg-teal-100 text-teal-900 ring-teal-400 dark:bg-teal-500/15 dark:text-teal-100 dark:ring-teal-400/35'
    case 'cancelled':
      return 'bg-red-100 text-red-900 ring-red-400 dark:bg-red-500/15 dark:text-red-100 dark:ring-red-400/35'
    default:
      return 'bg-neutral-100 text-neutral-900 ring-neutral-300 dark:bg-neutral-950/60 dark:text-neutral-200 dark:ring-white/10'
  }
}
