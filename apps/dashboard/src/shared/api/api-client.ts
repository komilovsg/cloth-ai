import type { CatalogListResponse, GetOrderResponse, OrderStatus } from '@cloth-ai/contracts'
import * as mock from './mock-api'
import { setAdminToken } from '../../app/auth-gate'
import type { CatalogRowDto, OrderDetailsDto, OrderSummaryDto, ShopProfileDto } from './types'

type ApiMode = 'mock' | 'real'

const TOKEN_KEY = 'clothai_admin_jwt'

function getEnv(name: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (import.meta as any).env?.[name]
}

function getApiMode(): ApiMode {
  const raw = getEnv('VITE_API_MODE')?.toLowerCase()
  return raw === 'real' ? 'real' : 'mock'
}

function getBaseUrl(): string {
  return (getEnv('VITE_API_BASE_URL') ?? '').replace(/\/+$/, '')
}

function adminAuthHeaders(): Record<string, string> {
  if (getApiMode() !== 'real') return {}
  try {
    const t = sessionStorage.getItem(TOKEN_KEY)
    return t ? { Authorization: `Bearer ${t}` } : {}
  } catch {
    return {}
  }
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
  auth: 'admin' | 'none' = 'admin',
): Promise<T> {
  const baseUrl = getBaseUrl()
  if (!baseUrl) throw new Error('VITE_API_BASE_URL is not set')
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  }
  if (auth === 'admin') Object.assign(headers, adminAuthHeaders())
  if (
    init?.body &&
    typeof init.body === 'string' &&
    !headers['content-type'] &&
    !headers['Content-Type']
  ) {
    headers['content-type'] = 'application/json'
  }
  const res = await fetch(`${baseUrl}${path}`, { ...init, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

async function requestForm<T>(path: string, form: FormData): Promise<T> {
  const baseUrl = getBaseUrl()
  if (!baseUrl) throw new Error('VITE_API_BASE_URL is not set')
  const headers = adminAuthHeaders()
  const res = await fetch(`${baseUrl}${path}`, { method: 'POST', body: form, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export async function adminLogin(password: string): Promise<void> {
  if (getApiMode() === 'mock') {
    setAdminToken('mock-token')
    return
  }
  const data = await requestJson<{ accessToken: string }>(
    '/v1/admin/login',
    {
      method: 'POST',
      body: JSON.stringify({ password }),
    },
    'none',
  )
  setAdminToken(data.accessToken)
}

/** Email + password (super_admin / seller_admin). Prefer over legacy adminLogin. */
export async function dashboardLogin(email: string, password: string): Promise<void> {
  if (getApiMode() === 'mock') {
    setAdminToken('mock-token')
    return
  }
  const data = await requestJson<{ accessToken: string }>(
    '/v1/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    },
    'none',
  )
  setAdminToken(data.accessToken)
}

export async function listOrders(): Promise<GetOrderResponse[]> {
  if (getApiMode() === 'mock') return mock.listOrders()
  return requestJson<GetOrderResponse[]>('/v1/orders')
}

export async function listOrderSummaries(): Promise<OrderSummaryDto[]> {
  if (getApiMode() === 'mock') return mock.listOrderSummaries()
  return requestJson<OrderSummaryDto[]>('/v1/orders')
}

export async function getOrderDetails(orderId: string): Promise<OrderDetailsDto> {
  if (getApiMode() === 'mock') return mock.getOrderDetails(orderId)
  return requestJson<OrderDetailsDto>(`/v1/orders/${encodeURIComponent(orderId)}`)
}

export async function setOrderStatus(input: {
  orderId: string
  status: OrderStatus
}): Promise<OrderDetailsDto> {
  if (getApiMode() === 'mock') return mock.setOrderStatus(input)
  return requestJson<OrderDetailsDto>(`/v1/orders/${encodeURIComponent(input.orderId)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status: input.status }),
  })
}

export async function getCatalog(): Promise<CatalogListResponse> {
  if (getApiMode() === 'mock') return mock.getCatalog()
  return requestJson<CatalogListResponse>('/v1/catalog')
}

export async function createCatalogItemDraft(): Promise<{ id: string }> {
  if (getApiMode() === 'mock') return mock.createCatalogItemDraft()
  return requestJson<{ id: string }>('/v1/catalog/items', { method: 'POST' })
}

export async function listCatalogRows(): Promise<CatalogRowDto[]> {
  if (getApiMode() === 'mock') return mock.listCatalogRows()
  return requestJson<CatalogRowDto[]>('/v1/catalog/items')
}

export async function getCatalogRow(id: string): Promise<CatalogRowDto> {
  if (getApiMode() === 'mock') {
    const rows = await mock.listCatalogRows()
    const row = rows.find((r) => r.id === id)
    if (!row) throw new Error('Catalog item not found')
    return row
  }
  return requestJson<CatalogRowDto>(`/v1/catalog/items/${encodeURIComponent(id)}`)
}

export async function updateCatalogRow(input: {
  id: string
  title: string
  priceTjs: number
  category: string
}): Promise<CatalogRowDto> {
  if (getApiMode() === 'mock') return mock.updateCatalogRow(input)
  return requestJson<CatalogRowDto>(`/v1/catalog/items/${encodeURIComponent(input.id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function setCatalogStatus(input: {
  id: string
  status: CatalogRowDto['status']
}): Promise<CatalogRowDto> {
  if (getApiMode() === 'mock') return mock.setCatalogStatus(input)
  return requestJson<CatalogRowDto>(`/v1/catalog/items/${encodeURIComponent(input.id)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status: input.status }),
  })
}

export async function uploadCatalogPhoto(itemId: string, file: File): Promise<CatalogRowDto> {
  if (getApiMode() === 'mock') {
    await new Promise((r) => setTimeout(r, 300))
    return getCatalogRow(itemId)
  }
  const fd = new FormData()
  fd.append('file', file)
  return requestForm<CatalogRowDto>(`/v1/catalog/items/${encodeURIComponent(itemId)}/upload`, fd)
}

export async function triggerAiGeneration(itemId: string): Promise<{ queued: boolean }> {
  if (getApiMode() === 'mock') {
    await setCatalogStatus({ id: itemId, status: 'generated' })
    return { queued: true }
  }
  return requestJson<{ queued: boolean }>(
    `/v1/catalog/items/${encodeURIComponent(itemId)}/generate-ai`,
    { method: 'POST' },
  )
}

export async function getShopProfile(): Promise<ShopProfileDto> {
  if (getApiMode() === 'mock') return mock.getShopProfile()
  return requestJson<ShopProfileDto>('/v1/shop/profile', undefined, 'none')
}

export async function updateShopProfile(input: {
  shopName: string
  aboutText: string
}): Promise<ShopProfileDto> {
  if (getApiMode() === 'mock') return mock.updateShopProfile(input)
  return requestJson<ShopProfileDto>('/v1/admin/shop-profile', {
    method: 'PATCH',
    body: JSON.stringify({
      shopName: input.shopName,
      aboutText: input.aboutText,
    }),
  })
}

export async function uploadShopLogo(file: File): Promise<ShopProfileDto> {
  if (getApiMode() === 'mock') return mock.uploadShopLogo(file)
  const fd = new FormData()
  fd.append('file', file)
  return requestForm<ShopProfileDto>('/v1/admin/shop-profile/logo', fd)
}
