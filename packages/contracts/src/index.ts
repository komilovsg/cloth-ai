export type MoneyTjs = number

export type ModelType = 'tall' | 'mid' | 'curvy'
export type ProductCategory = 'tops' | 'bottoms' | 'dresses'
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL'

export type CheckoutMethod = 'online' | 'cod' | 'reserve'

export type OrderStatus =
  | 'created'
  | 'paid'
  | 'reserved'
  | 'awaiting_cod'
  | 'packing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export interface CatalogItemDto {
  id: string
  title: string
  category: ProductCategory
  priceTjs: MoneyTjs
  coverUrl: string
  modelImages: Record<ModelType, string>
  sizes: Array<{ size: ProductSize; inStock: boolean }>
}

export interface CatalogListResponse {
  items: CatalogItemDto[]
}

export interface CreateOrderRequest {
  method: CheckoutMethod
  items: Array<{
    productId: string
    size: ProductSize
    qty: number
  }>
  modelType: ModelType | null
}

export interface CreateOrderResponse {
  orderId: string
  status: OrderStatus
  totalTjs: MoneyTjs
  payment?: {
    provider: 'smartpay'
    paymentUrl: string
  }
}

export interface GetOrderResponse {
  orderId: string
  status: OrderStatus
  createdAtIso: string
  method: CheckoutMethod
}

