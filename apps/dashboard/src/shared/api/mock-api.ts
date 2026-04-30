import type { CatalogListResponse, GetOrderResponse, OrderStatus } from '@cloth-ai/contracts'
import { MOCK_ORDERS } from '../../features/orders/mock-orders'
import type {
  AuthMeDto,
  CatalogRowDto,
  OrderDetailsDto,
  OrderSummaryDto,
  SellerListDto,
  SellerSummaryDto,
  ShopProfileDto,
} from './types'

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

let mockAuthMe: AuthMeDto = {
  role: 'super_admin',
  email: 'admin@mock.local',
  sellerId: null,
  impersonation: false,
}

let mockSellers: SellerSummaryDto[] = []

export async function fetchAuthMe(): Promise<AuthMeDto> {
  await sleep(50)
  return { ...mockAuthMe }
}

export async function passwordForgot(_email: string): Promise<void> {
  await sleep(250)
}

export async function passwordReset(_token: string, _newPassword: string): Promise<void> {
  await sleep(250)
}

export async function passwordChangeStart(_current: string, _next: string): Promise<string> {
  await sleep(200)
  return '00000000-0000-0000-0000-00000000mock'
}

export async function passwordChangeConfirm(_id: string, _code: string): Promise<void> {
  await sleep(200)
}

export async function listSellers(page: number, limit: number): Promise<SellerListDto> {
  await sleep(150)
  const start = (page - 1) * limit
  const items = mockSellers.slice(start, start + limit)
  return { items, total: mockSellers.length }
}

export async function createSeller(input: { shopName: string; slug?: string }): Promise<SellerSummaryDto> {
  await sleep(200)
  const id = `mock-seller-${mockSellers.length + 1}`
  const row: SellerSummaryDto = {
    id,
    slug: input.slug?.trim() ? input.slug.trim() : null,
    status: 'active',
    shopName: input.shopName.trim() || 'Магазин',
    createdAtIso: new Date().toISOString(),
  }
  mockSellers = [...mockSellers, row]
  return row
}

export async function patchSeller(input: { sellerId: string; status: string }): Promise<SellerSummaryDto> {
  await sleep(150)
  const i = mockSellers.findIndex((s) => s.id === input.sellerId)
  if (i < 0) throw new Error('Seller not found')
  const prev = mockSellers[i]!
  const next = { ...prev, status: input.status }
  mockSellers = mockSellers.map((s, idx) => (idx === i ? next : s))
  return next
}

export async function createSellerAdminUser(_input: {
  email: string
  password: string
  sellerId: string
}): Promise<void> {
  await sleep(200)
}

export async function impersonateSeller(sellerId: string): Promise<void> {
  await sleep(120)
  mockAuthMe = {
    role: 'seller_admin',
    email: mockAuthMe.email,
    sellerId,
    impersonation: true,
  }
}

export async function endImpersonation(): Promise<void> {
  await sleep(120)
  mockAuthMe = {
    role: 'super_admin',
    email: mockAuthMe.email ?? 'admin@mock.local',
    sellerId: null,
    impersonation: false,
  }
}

