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
      return 'bg-sky-500/15 text-sky-100 ring-sky-400/35'
    case 'cod':
      return 'bg-amber-500/15 text-amber-100 ring-amber-400/35'
    case 'reserve':
      return 'bg-violet-500/15 text-violet-100 ring-violet-400/35'
    default:
      return 'bg-neutral-950/60 text-neutral-200 ring-white/10'
  }
}

export function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-emerald-500/15 text-emerald-100 ring-emerald-400/35'
    case 'reserved':
      return 'bg-violet-500/15 text-violet-100 ring-violet-400/35'
    case 'awaiting_cod':
      return 'bg-amber-500/15 text-amber-100 ring-amber-400/35'
    case 'packing':
    case 'shipping':
      return 'bg-sky-500/15 text-sky-100 ring-sky-400/35'
    case 'delivered':
      return 'bg-teal-500/15 text-teal-100 ring-teal-400/35'
    case 'cancelled':
      return 'bg-red-500/15 text-red-100 ring-red-400/35'
    default:
      return 'bg-neutral-950/60 text-neutral-200 ring-white/10'
  }
}
