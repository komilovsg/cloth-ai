import { MOCK_CATALOG } from '../../features/catalog/mock-catalog'
import type {
  CatalogListResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
} from './contracts'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const orderStore = new Map<string, GetOrderResponse>()

export async function getCatalog(): Promise<CatalogListResponse> {
  await sleep(250)
  return { items: MOCK_CATALOG }
}

export async function createOrder(
  req: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  await sleep(500)

  const totalTjs = req.items.reduce((sum, i) => {
    const p = MOCK_CATALOG.find((p) => p.id === i.productId)
    if (!p) return sum
    return sum + p.priceTjs * i.qty
  }, 0)

  const orderId = crypto.randomUUID()
  const status =
    req.method === 'online'
      ? 'created'
      : req.method === 'reserve'
        ? 'reserved'
        : 'awaiting_cod'

  const order: GetOrderResponse = {
    orderId,
    status,
    createdAtIso: new Date().toISOString(),
    method: req.method,
  }

  orderStore.set(orderId, order)

  if (req.method === 'online') {
    // simulate payment processing, so UI can poll status
    setTimeout(() => {
      const current = orderStore.get(orderId)
      if (!current) return
      orderStore.set(orderId, { ...current, status: 'paid' })
    }, 2200)
  }

  return {
    orderId,
    status,
    totalTjs,
    payment:
      req.method === 'online'
        ? { provider: 'smartpay', paymentUrl: `https://example.com/pay/${orderId}` }
        : undefined,
  }
}

export async function getOrder(orderId: string): Promise<GetOrderResponse> {
  await sleep(250)
  const order = orderStore.get(orderId)
  if (!order) {
    throw new Error('Order not found')
  }
  return order
}

