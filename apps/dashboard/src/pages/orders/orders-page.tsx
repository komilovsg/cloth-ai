import { useMemo, useState } from 'react'
import { Card } from '../../shared/ui/card'
import type { OrderRow } from '../../features/orders/mock-orders'
import { useOrderSummariesQuery, useSetOrderStatusMutation } from '../../shared/api/queries'
import { Button } from '../../shared/ui/button'
import { Link } from 'react-router-dom'
import type { OrderStatus } from '@cloth-ai/contracts'

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-950 px-2 py-1 text-xs text-neutral-200 ring-1 ring-white/10">
      {children}
    </span>
  )
}

export function OrdersPage() {
  const [status, setStatus] = useState<'all' | OrderRow['status']>('all')
  const orders = useOrderSummariesQuery()
  const setOrderStatus = useSetOrderStatusMutation()

  const rows = useMemo(() => {
    const data = (orders.data ?? []).map((o) => ({
      id: o.orderId,
      createdAtIso: o.createdAtIso,
      customerName: o.customerName,
      method: o.method,
      status: o.status,
      totalTjs: o.totalTjs,
      itemsCount: o.itemsCount,
    }))
    if (status === 'all') return data
    return data.filter((o) => o.status === status)
  }, [orders.data, status])

  const getQuickActions = (s: OrderStatus) => {
    if (s === 'reserved') return [{ label: 'Подтвердить', next: 'packing' as const }, { label: 'Снять', next: 'cancelled' as const }]
    if (s === 'awaiting_cod') return [{ label: 'В сборку', next: 'packing' as const }, { label: 'Отменить', next: 'cancelled' as const }]
    if (s === 'paid') return [{ label: 'В сборку', next: 'packing' as const }]
    if (s === 'packing') return [{ label: 'В доставку', next: 'shipping' as const }]
    return []
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Заказы</h1>
          <p className="mt-1 text-sm text-neutral-300">
            MVP: список лидов (Оплачено / Резерв / Оплата на месте).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-300">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | OrderRow['status'])}
            className="rounded-xl bg-neutral-950 px-3 py-2 text-sm ring-1 ring-white/10"
          >
            <option value="all">Все</option>
            <option value="paid">paid</option>
            <option value="reserved">reserved</option>
            <option value="awaiting_cod">awaiting_cod</option>
            <option value="packing">packing</option>
            <option value="shipping">shipping</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      </header>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.1fr_.8fr_.7fr_.7fr_.6fr_.7fr] gap-0 border-b border-white/10 bg-neutral-950/60 px-4 py-3 text-xs text-neutral-300">
          <div>ID</div>
          <div>Дата</div>
          <div>Покупатель</div>
          <div>Метод</div>
          <div>Статус</div>
          <div className="text-right">Сумма</div>
          <div className="text-right">Действия</div>
        </div>
        <div className="divide-y divide-white/10">
          {orders.isLoading && (
            <div className="px-4 py-8 text-center text-sm text-neutral-300">
              Загружаем заказы…
            </div>
          )}
          {orders.isError && (
            <div className="px-4 py-8 text-center">
              <div className="text-sm text-neutral-200">Не удалось загрузить</div>
              <div className="mt-3 inline-flex">
                <Button variant="secondary" onClick={() => orders.refetch()}>
                  Повторить
                </Button>
              </div>
            </div>
          )}
          {rows.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="block hover:bg-neutral-950/40"
            >
              <div className="grid grid-cols-[1.1fr_.8fr_.7fr_.7fr_.6fr_.7fr] items-center gap-0 px-4 py-3 text-sm">
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-neutral-300">
                  {new Date(o.createdAtIso).toLocaleString()}
                </div>
                <div className="truncate text-sm text-neutral-200">{o.customerName}</div>
                <div>
                  <Badge>{o.method}</Badge>
                </div>
                <div>
                  <Badge>{o.status}</Badge>
                </div>
                <div className="text-right font-semibold">{o.totalTjs} TJS</div>
                <div className="flex justify-end gap-2">
                  {getQuickActions(o.status).map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOrderStatus.mutate({ orderId: o.id, status: a.next })
                      }}
                      className="rounded-lg bg-neutral-950 px-2 py-1 text-xs text-neutral-200 ring-1 ring-white/10 hover:bg-neutral-900 disabled:opacity-50"
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
            <div className="px-4 py-8 text-center text-sm text-neutral-300">
              Нет заказов для выбранного статуса.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

