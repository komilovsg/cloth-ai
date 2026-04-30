import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAdminToken } from '../../app/auth-gate'
import {
  createSeller,
  createSellerAdminUser,
  endImpersonation,
  fetchAnalyticsTimeseries,
  fetchAuthMe,
  getCatalogRow,
  getDashboardApiMode,
  getOrderDetails,
  getShopProfile,
  impersonateSeller,
  listCatalogRows,
  listOrderSummaries,
  listOrders,
  listSellers,
  patchSeller,
  setOrderStatus,
  updateCatalogRow,
  updateShopProfile,
  uploadShopLogo,
} from './api-client'

export const queryKeys = {
  orders: () => ['orders'] as const,
  orderSummaries: () => ['orderSummaries'] as const,
  orderDetails: (orderId: string) => ['order', orderId] as const,
  catalogRows: () => ['catalogRows'] as const,
  catalogRow: (id: string) => ['catalogRow', id] as const,
  shopProfile: () => ['shopProfile'] as const,
  authMe: () => ['authMe'] as const,
  sellers: (page: number) => ['sellers', page] as const,
}

function dashboardQueriesEnabled() {
  return getDashboardApiMode() === 'mock' || !!getAdminToken()
}

export function useAuthMeQuery() {
  return useQuery({
    queryKey: queryKeys.authMe(),
    queryFn: fetchAuthMe,
    staleTime: 15_000,
    enabled: dashboardQueriesEnabled(),
  })
}

export function useSellersQuery(page: number) {
  return useQuery({
    queryKey: queryKeys.sellers(page),
    queryFn: () => listSellers(page, 50),
    staleTime: 10_000,
    enabled: dashboardQueriesEnabled(),
  })
}

export function useCreateSellerMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSeller,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sellers'] })
    },
  })
}

export function usePatchSellerMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: patchSeller,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sellers'] })
    },
  })
}

export function useCreateSellerAdminMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSellerAdminUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sellers'] })
    },
  })
}

export function useImpersonateMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: impersonateSeller,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.authMe() })
      qc.invalidateQueries({ queryKey: queryKeys.shopProfile() })
      qc.invalidateQueries({ queryKey: queryKeys.catalogRows() })
      qc.invalidateQueries({ queryKey: queryKeys.orders() })
      qc.invalidateQueries({ queryKey: queryKeys.orderSummaries() })
    },
  })
}

export function useEndImpersonationMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: endImpersonation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.authMe() })
      qc.invalidateQueries({ queryKey: queryKeys.shopProfile() })
      qc.invalidateQueries({ queryKey: queryKeys.catalogRows() })
      qc.invalidateQueries({ queryKey: queryKeys.orders() })
      qc.invalidateQueries({ queryKey: queryKeys.orderSummaries() })
    },
  })
}

export function useAnalyticsTimeseriesQuery(from: string, to: string) {
  return useQuery({
    queryKey: ['analytics', 'timeseries', from, to],
    queryFn: () => fetchAnalyticsTimeseries(from, to),
    staleTime: 60_000,
    enabled: dashboardQueriesEnabled(),
  })
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
      qc.invalidateQueries({ queryKey: ['analytics'] })
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
      qc.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useShopProfileQuery() {
  return useQuery({
    queryKey: queryKeys.shopProfile(),
    queryFn: getShopProfile,
    staleTime: 60_000,
  })
}

export function useUpdateShopProfileMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateShopProfile,
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.shopProfile(), data)
    },
  })
}

export function useUploadShopLogoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: uploadShopLogo,
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.shopProfile(), data)
    },
  })
}
