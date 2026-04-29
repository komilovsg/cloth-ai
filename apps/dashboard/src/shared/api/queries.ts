import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCatalogRow, getOrderDetails, listCatalogRows, listOrderSummaries, listOrders, setOrderStatus, updateCatalogRow } from './api-client'

export const queryKeys = {
  orders: () => ['orders'] as const,
  orderSummaries: () => ['orderSummaries'] as const,
  orderDetails: (orderId: string) => ['order', orderId] as const,
  catalogRows: () => ['catalogRows'] as const,
  catalogRow: (id: string) => ['catalogRow', id] as const,
}

export function useOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.orders(),
    queryFn: listOrders,
    staleTime: 10_000,
  })
}

export function useOrderSummariesQuery() {
  return useQuery({
    queryKey: queryKeys.orderSummaries(),
    queryFn: listOrderSummaries,
    staleTime: 10_000,
  })
}

export function useOrderDetailsQuery(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orderDetails(orderId),
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
  })
}

export function useSetOrderStatusMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: setOrderStatus,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.orders() })
      qc.invalidateQueries({ queryKey: queryKeys.orderSummaries() })
      qc.setQueryData(queryKeys.orderDetails(data.orderId), data)
    },
  })
}

export function useCatalogRowsQuery() {
  return useQuery({
    queryKey: queryKeys.catalogRows(),
    queryFn: listCatalogRows,
    staleTime: 10_000,
  })
}

export function useCatalogRowQuery(id: string, opts?: { pollWhileGenerating?: boolean }) {
  return useQuery({
    queryKey: queryKeys.catalogRow(id),
    queryFn: () => getCatalogRow(id),
    enabled: !!id,
    refetchInterval: (q) => {
      if (!opts?.pollWhileGenerating) return false
      const s = q.state.data?.status
      return s === 'generating' ? 2000 : false
    },
  })
}

export function useUpdateCatalogRowMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateCatalogRow,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.catalogRows() })
      qc.invalidateQueries({ queryKey: queryKeys.catalogRow(variables.id) })
    },
  })
}

