import { useMemo, useState } from 'react'
import { Card } from '../../shared/ui/card'
import type { OrderSummaryDto } from '../../shared/api/types'
import { useOrderSummariesQuery, useSetOrderStatusMutation } from '../../shared/api/queries'
import { Button } from '../../shared/ui/button'
import { Link } from 'react-router-dom'
import type { CheckoutMethod, OrderStatus } from '@cloth-ai/contracts'
import {
  METHOD_LABEL_RU,
  STATUS_LABEL_RU,
  methodBadgeClass,
  statusBadgeClass,
} from '../../shared/order-display'

export function OrdersPage() {
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const orders = useOrderSummariesQuery()
  const setOrderStatus = useSetOrderStatusMutation()

  const rows = useMemo(() => {
    const data = orders.data ?? []
    const filtered = status === 'all' ? data : data.filter((o) => o.status === status)
    return filtered
  }, [orders.data, status])

  const getQuickActions = (s: OrderStatus) => {
    if (s === 'reserved')
      return [
        { label: 'Подтвердить', next: 'packing' as const },
        { label: 'Снять резерв', next: 'cancelled' as const },
      ]
    if (s === 'awaiting_cod')
      return [
        { label: 'В сборку', next: 'packing' as const },
        { label: 'Отменить', next: 'cancelled' as const },
      ]
    if (s === 'paid') return [{ label: 'В сборку', next: 'packing' as const }]
    if (s === 'packing') return [{ label: 'В доставку', next: 'shipping' as const }]
    return []
  }

  const Pill = ({
    children,
    tone,
  }: {
    children: React.ReactNode
    tone: string
  }) => (
    <span className={['inline-flex max-w-full items-center truncate rounded-full px-2 py-1 text-xs ring-1', tone].join(' ')}>
      {children}
    </span>
  )

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">Заказы</h1>
          <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
            Покупатель — имя из Telegram (или то, что передал клиент при оформлении).
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:max-w-xs">
          <label className="text-xs font-normal text-neutral-800 dark:text-neutral-400">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | OrderStatus)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          >
            <option value="all">Все</option>
            {(Object.keys(STATUS_LABEL_RU) as OrderStatus[]).map((k) => (
              <option key={k} value={k}>
                {STATUS_LABEL_RU[k]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Card className="overflow-hidden ring-1 ring-neutral-200 dark:ring-white/10">
        <div className="hidden overflow-x-auto lg:block">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[1fr_1fr_1.2fr_1fr_1fr_0.75fr_1.25fr] gap-0 border-b border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-neutral-900 dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-400">
              <div>ID</div>
              <div>Дата</div>
              <div>Покупатель</div>
              <div>Метод</div>
              <div>Статус</div>
              <div className="text-right">Сумма</div>
              <div className="text-right">Действия</div>
            </div>

            <div className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-transparent">
              {orders.isLoading && (
                <div className="px-4 py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                  Загружаем заказы…
                </div>
              )}
              {orders.isError && (
                <div className="px-4 py-8 text-center">
                  <div className="text-sm text-neutral-800 dark:text-neutral-200">Не удалось загрузить</div>
                  <div className="mt-3 inline-flex">
                    <Button variant="secondary" onClick={() => orders.refetch()}>
                      Повторить
                    </Button>
                  </div>
                </div>
              )}

              {rows.map((o: OrderSummaryDto) => (
                <Link
                  key={o.orderId}
                  to={`/orders/${o.orderId}`}
                  className="block hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                >
                  <div className="grid grid-cols-[1fr_1fr_1.2fr_1fr_1fr_0.75fr_1.25fr] items-center gap-2 px-4 py-3 text-sm">
                    <div className="break-all font-mono text-xs font-medium">{o.orderId}</div>
                    <div className="text-xs font-normal text-neutral-900 dark:text-neutral-400">
                      {new Date(o.createdAtIso).toLocaleString()}
                    </div>
                    <div className="min-w-0 truncate font-medium">{o.customerName}</div>
                    <div className="min-w-0">
                      <Pill tone={methodBadgeClass(o.method as CheckoutMethod)}>
                        {METHOD_LABEL_RU[o.method as CheckoutMethod] ?? o.method}
                      </Pill>
                    </div>
                    <div className="min-w-0">
                      <Pill tone={statusBadgeClass(o.status as OrderStatus)}>
                        {STATUS_LABEL_RU[o.status as OrderStatus] ?? o.status}
                      </Pill>
                    </div>
                    <div className="text-right font-semibold">{o.totalTjs} TJS</div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {getQuickActions(o.status as OrderStatus).map((a) => (
                        <button
                          key={a.label}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setOrderStatus.mutate({ orderId: o.orderId, status: a.next })
                          }}
                          className="rounded-lg bg-violet-600 px-2 py-1 text-[11px] font-medium text-white ring-1 ring-violet-400/40 hover:bg-violet-500 disabled:opacity-50 dark:bg-violet-600"
                          disabled={setOrderStatus.isPending}
                          title={`Позиций: ${o.itemsCount}`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              {!orders.isLoading && !orders.isError && rows.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                  Нет заказов для выбранного статуса.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-transparent lg:hidden">
          {orders.isLoading && (
            <div className="px-4 py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
              Загружаем заказы…
            </div>
          )}
          {orders.isError && (
            <div className="px-4 py-8 text-center">
              <div className="text-sm text-neutral-800 dark:text-neutral-200">Не удалось загрузить</div>
              <div className="mt-3 flex justify-center">
                <Button variant="secondary" onClick={() => orders.refetch()}>
                  Повторить
                </Button>
              </div>
            </div>
          )}
          {rows.map((o: OrderSummaryDto) => (
            <Link
              key={o.orderId}
              to={`/orders/${o.orderId}`}
              className="block space-y-3 px-4 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
            >
              <div className="flex flex-col gap-1">
                <span className="break-all font-mono text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  {o.orderId}
                </span>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {new Date(o.createdAtIso).toLocaleString()}
                </span>
              </div>
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{o.customerName}</div>
              <div className="flex flex-wrap gap-2">
                <Pill tone={methodBadgeClass(o.method as CheckoutMethod)}>
                  {METHOD_LABEL_RU[o.method as CheckoutMethod] ?? o.method}
                </Pill>
                <Pill tone={statusBadgeClass(o.status as OrderStatus)}>
                  {STATUS_LABEL_RU[o.status as OrderStatus] ?? o.status}
                </Pill>
              </div>
              <div className="text-base font-semibold">{o.totalTjs} TJS</div>
              <div className="flex flex-col gap-2 pt-1">
                {getQuickActions(o.status as OrderStatus).map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOrderStatus.mutate({ orderId: o.orderId, status: a.next })
                    }}
                    className="w-full rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-violet-400/40 hover:bg-violet-500 disabled:opacity-50 dark:bg-violet-600"
                    disabled={setOrderStatus.isPending}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </Link>
          ))}
          {!orders.isLoading && !orders.isError && rows.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
              Нет заказов для выбранного статуса.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
