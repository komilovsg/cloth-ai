import WebApp from '@twa-dev/sdk'
import type {
  CatalogItemDto,
  CatalogListResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
} from '@cloth-ai/contracts'
import * as mock from './mock-api'

type ApiMode = 'mock' | 'real'

function getEnv(name: string): string | undefined {
  if (typeof import.meta === 'undefined') return undefined
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

function getTelegramInitData(): string | null {
  try {
    return WebApp.initData || null
  } catch {
    return null
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not set')
  }

  const url = `${baseUrl}${path}`
  const initData = getTelegramInitData()

  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(initData ? { 'x-telegram-init-data': initData } : {}),
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export async function getCatalog(): Promise<CatalogListResponse> {
  if (getApiMode() === 'mock') return mock.getCatalog()
  return requestJson<CatalogListResponse>('/v1/catalog')
}

export async function getCatalogProduct(productId: string): Promise<CatalogItemDto> {
  if (getApiMode() === 'mock') return mock.getCatalogProduct(productId)
  return requestJson<CatalogItemDto>(
    `/v1/catalog/product/${encodeURIComponent(productId)}`,
  )
}

export async function createOrder(
  req: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  if (getApiMode() === 'mock') return mock.createOrder(req)
  return requestJson<CreateOrderResponse>('/v1/orders', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export async function getOrder(orderId: string): Promise<GetOrderResponse> {
  if (getApiMode() === 'mock') return mock.getOrder(orderId)
  return requestJson<GetOrderResponse>(`/v1/orders/${encodeURIComponent(orderId)}`)
}

