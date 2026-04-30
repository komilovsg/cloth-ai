import type { CatalogListResponse, GetOrderResponse, OrderStatus } from '@cloth-ai/contracts'
import { MOCK_ORDERS } from '../../features/orders/mock-orders'
import type { CatalogRowDto, OrderDetailsDto, OrderSummaryDto, ShopProfileDto } from './types'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const orderDetailsStore = new Map<string, OrderDetailsDto>()

function ensureOrdersSeeded() {
  if (orderDetailsStore.size > 0) return
  for (const o of MOCK_ORDERS) {
    const items =
      o.id === 'o-1001'
        ? [
            { title: 'Топ спортивный — черный', size: 'L', qty: 1, priceTjs: 199 },
            { title: 'Легинсы — графит', size: 'M', qty: 1, priceTjs: 249 },
          ]
        : [{ title: 'Платье — синее', size: 'M', qty: 1, priceTjs: 399 }]

    const totalTjs = items.reduce((s, i) => s + i.priceTjs * i.qty, 0)

    orderDetailsStore.set(o.id, {
      orderId: o.id,
      createdAtIso: o.createdAtIso,
      method: o.method,
      status: o.status,
      customer: {
        name: o.customerName,
        phone: '+992 900 00 00 00',
        address: 'ул. Рудаки, 10',
      },
      items,
      totalTjs,
    })
  }
}

const catalogStore = new Map<string, CatalogRowDto>()

// Dashboard пока не хранит собственный стор заказов — мок.
export async function listOrders(): Promise<GetOrderResponse[]> {
  await sleep(250)
  ensureOrdersSeeded()
  return Array.from(orderDetailsStore.values()).map((o) => ({
    orderId: o.orderId,
    status: o.status,
    createdAtIso: o.createdAtIso,
    method: o.method,
  }))
}

export async function listOrderSummaries(): Promise<OrderSummaryDto[]> {
  await sleep(250)
  ensureOrdersSeeded()
  return Array.from(orderDetailsStore.values()).map((o) => ({
    orderId: o.orderId,
    createdAtIso: o.createdAtIso,
    method: o.method,
    status: o.status,
    customerName: o.customer.name,
    itemsCount: o.items.reduce((s, i) => s + i.qty, 0),
    totalTjs: o.totalTjs,
  }))
}

export async function getOrderDetails(orderId: string): Promise<OrderDetailsDto> {
  await sleep(250)
  ensureOrdersSeeded()
  const order = orderDetailsStore.get(orderId)
  if (!order) throw new Error('Order not found')
  return order
}

export async function setOrderStatus(input: {
  orderId: string
  status: OrderStatus
}): Promise<OrderDetailsDto> {
  await sleep(250)
  ensureOrdersSeeded()
  const order = orderDetailsStore.get(input.orderId)
  if (!order) throw new Error('Order not found')
  const next = { ...order, status: input.status }
  orderDetailsStore.set(input.orderId, next)
  return next
}

export async function getCatalog(): Promise<CatalogListResponse> {
  await sleep(250)
  return { items: [] }
}

export async function createCatalogItemDraft(): Promise<{ id: string }> {
  await sleep(300)
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  catalogStore.set(id, {
    id,
    title: 'Новый товар',
    category: 'tops',
    priceTjs: 199,
    status: 'draft',
    updatedAtIso: now,
  })
  return { id }
}

export async function listCatalogRows(): Promise<CatalogRowDto[]> {
  await sleep(250)
  if (catalogStore.size === 0) {
    const now = new Date().toISOString()
    catalogStore.set('c-1', {
      id: 'c-1',
      title: 'Топ спортивный — черный',
      category: 'tops',
      priceTjs: 199,
      status: 'published',
      updatedAtIso: now,
    })
    catalogStore.set('c-2', {
      id: 'c-2',
      title: 'Легинсы — графит',
      category: 'bottoms',
      priceTjs: 249,
      status: 'generated',
      updatedAtIso: now,
    })
  }
  return Array.from(catalogStore.values()).sort((a, b) =>
    b.updatedAtIso.localeCompare(a.updatedAtIso),
  )
}

export async function updateCatalogRow(input: {
  id: string
  title: string
  priceTjs: number
  category: string
}): Promise<CatalogRowDto> {
  await sleep(250)
  const row = catalogStore.get(input.id)
  if (!row) throw new Error('Catalog item not found')
  const next: CatalogRowDto = {
    ...row,
    title: input.title,
    priceTjs: input.priceTjs,
    category: input.category,
    updatedAtIso: new Date().toISOString(),
  }
  catalogStore.set(input.id, next)
  return next
}

export async function setCatalogStatus(input: {
  id: string
  status: CatalogRowDto['status']
}): Promise<CatalogRowDto> {
  await sleep(250)
  const row = catalogStore.get(input.id)
  if (!row) throw new Error('Catalog item not found')
  const next: CatalogRowDto = {
    ...row,
    status: input.status,
    updatedAtIso: new Date().toISOString(),
  }
  catalogStore.set(input.id, next)
  return next
}

let shopProfileMock: ShopProfileDto = {
  shopName: '',
  aboutText: '',
  logoUrl: undefined,
  updatedAtIso: new Date().toISOString(),
}

export async function getShopProfile(): Promise<ShopProfileDto> {
  await sleep(150)
  return { ...shopProfileMock }
}

export async function updateShopProfile(input: {
  shopName: string
  aboutText: string
}): Promise<ShopProfileDto> {
  await sleep(250)
  shopProfileMock = {
    ...shopProfileMock,
    shopName: input.shopName,
    aboutText: input.aboutText.trim() ? input.aboutText : '',
    updatedAtIso: new Date().toISOString(),
  }
  return { ...shopProfileMock }
}

export async function uploadShopLogo(file: File): Promise<ShopProfileDto> {
  await sleep(400)
  shopProfileMock = {
    ...shopProfileMock,
    logoUrl: URL.createObjectURL(file),
    updatedAtIso: new Date().toISOString(),
  }
  return { ...shopProfileMock }
}

