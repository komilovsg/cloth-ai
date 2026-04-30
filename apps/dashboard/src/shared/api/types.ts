import type { CheckoutMethod, OrderStatus } from '@cloth-ai/contracts'

export interface OrderItemDto {
  title: string
  size: string
  qty: number
  priceTjs: number
}

export interface OrderDetailsDto {
  orderId: string
  createdAtIso: string
  method: CheckoutMethod
  status: OrderStatus
  customer: {
    name: string
    phone?: string
    address?: string
  }
  items: OrderItemDto[]
  totalTjs: number
}

export interface OrderSummaryDto {
  orderId: string
  createdAtIso: string
  method: CheckoutMethod
  status: OrderStatus
  customerName: string
  itemsCount: number
  totalTjs: number
}

export type CatalogStatus = 'draft' | 'generating' | 'generated' | 'published' | 'hidden'

export interface CatalogRowDto {
  id: string
  title: string
  category: string
  priceTjs: number
  status: CatalogStatus
  updatedAtIso: string
  coverUrl?: string
  sourceImageUrl?: string
  modelImages?: Record<string, string>
  generationError?: string
}

export interface ShopProfileDto {
  shopName: string
  aboutText?: string | null
  logoUrl?: string | null
  updatedAtIso: string
}

export interface AuthMeDto {
  role: string
  email?: string | null
  sellerId?: string | null
  impersonation: boolean
}

export interface SellerSummaryDto {
  id: string
  slug?: string | null
  status: string
  shopName: string
  createdAtIso: string
}

export interface SellerListDto {
  items: SellerSummaryDto[]
  total: number
}
