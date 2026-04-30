import { useQuery } from '@tanstack/react-query'
import { getCatalog, getCatalogProduct, getOrder } from './api-client'

export const queryKeys = {
  catalog: () => ['catalog'] as const,
  catalogProduct: (id: string) => ['catalog', 'product', id] as const,
  order: (orderId: string) => ['order', orderId] as const,
}

export function useCatalogQuery() {
  return useQuery({
    queryKey: queryKeys.catalog(),
    queryFn: getCatalog,
    staleTime: 60_000,
  })
}

export function useCatalogProductQuery(productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.catalogProduct(productId ?? ''),
    queryFn: () => getCatalogProduct(productId!),
    enabled: !!productId,
    staleTime: 60_000,
  })
}

export function useOrderQuery(orderId: string) {
  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => getOrder(orderId),
    retry: 0,
    refetchInterval: (q) => {
      const status = q.state.data?.status
      return status === 'created' ? 1500 : false
    },
  })
}

