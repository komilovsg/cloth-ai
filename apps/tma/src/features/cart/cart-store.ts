import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductSize } from '@cloth-ai/contracts'

export type CartItemKind = 'top' | 'bottom' | 'single'

export interface CartItem {
  id: string
  kind: CartItemKind
  productId: string
  size: ProductSize
  qty: number
}

interface CartState {
  items: CartItem[]
  addItem: (input: Omit<CartItem, 'id' | 'qty'> & { qty?: number }) => void
  removeItem: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: ({ kind, productId, size, qty = 1 }) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.kind === kind && i.productId === productId && i.size === size,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, qty: i.qty + qty } : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { id: crypto.randomUUID(), kind, productId, size, qty },
            ],
          }
        }),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'clothai:cart-v1' },
  ),
)

