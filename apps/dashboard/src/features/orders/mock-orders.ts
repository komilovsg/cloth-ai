import type { CheckoutMethod, OrderStatus } from '@cloth-ai/contracts'

export interface OrderRow {
  id: string
  createdAtIso: string
  customerName: string
  method: CheckoutMethod
  status: OrderStatus
  totalTjs: number
}

export const MOCK_ORDERS: OrderRow[] = [
  {
    id: 'o-1001',
    createdAtIso: new Date(Date.now() - 25 * 60_000).toISOString(),
    customerName: 'Telegram User',
    method: 'online',
    status: 'paid',
    totalTjs: 448,
  },
  {
    id: 'o-1002',
    createdAtIso: new Date(Date.now() - 3 * 60_60_000).toISOString(),
    customerName: 'Telegram User',
    method: 'reserve',
    status: 'reserved',
    totalTjs: 399,
  },
  {
    id: 'o-1003',
    createdAtIso: new Date(Date.now() - 9 * 60_60_000).toISOString(),
    customerName: 'Telegram User',
    method: 'cod',
    status: 'awaiting_cod',
    totalTjs: 199,
  },
]

