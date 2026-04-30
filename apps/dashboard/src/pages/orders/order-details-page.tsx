import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useOrderDetailsQuery, useSetOrderStatusMutation } from '../../shared/api/queries'
import type { CheckoutMethod, OrderStatus } from '@cloth-ai/contracts'
import {
  METHOD_LABEL_RU,
  STATUS_LABEL_RU,
  methodBadgeClass,
  statusBadgeClass,
} from '../../shared/order-display'

type BtnVariant = 'primary' | 'secondary' | 'ghost'

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className={['inline-flex max-w-full items-center truncate rounded-full px-2 py-1 text-xs ring-1', tone].join(' ')}>
      {children}
    </span>
  )
}

export function OrderDetailsPage() {
  const { orderId } = useParams()
  const id = orderId ?? ''
  const order = useOrderDetailsQuery(id)
  const setStatus = useSetOrderStatusMutation()

  const actions = useMemo((): Array<{ label: string; next: OrderStatus; variant?: BtnVariant }> => {
    const s = order.data?.status
    if (!s) return []

    if (s === 'reserved') {
      return [
        { label: 'Подтвердить резерв', next: 'packing', variant: 'primary' as const },
        { label: 'Снять резерв', next: 'cancelled', variant: 'secondary' as const },
      ]
    }
    if (s === 'awaiting_cod') {
      return [
        { label: 'Подтвердить заказ', next: 'packing', variant: 'primary' as const },
        { label: 'Отменить', next: 'cancelled', variant: 'secondary' as const },
      ]
    }
    if (s === 'paid') {
      return [{ label: 'В сборку', next: 'packing', variant: 'primary' as const }]
    }
    if (s === 'packing') {
      return [{ label: 'Передать в доставку', next: 'shipping', variant: 'primary' as const }]
    }
    if (s === 'shipping') {
      return [{ label: 'Доставлено', next: 'delivered', variant: 'primary' as const }]
    }
    return []
  }, [order.data?.status])

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Заказ {id}</h1>
          <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-300">
            Детали, статусы и действия для продавца.
          </p>
        </div>
        <Link to="/orders">
          <Button variant="ghost">← К списку</Button>
        </Link>
      </header>

      {order.isLoading ? (
        <Card className="p-4 text-sm font-normal text-neutral-900 dark:text-neutral-200">Загружаем…</Card>
      ) : order.isError ? (
        <Card className="p-4">
          <div className="text-sm font-medium">Заказ не найден</div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => order.refetch()}>
              Повторить
            </Button>
          </div>
        </Card>
      ) : order.data ? (
        <>
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-normal text-neutral-800 dark:text-neutral-300">Статус</div>
                <div className="flex items-center gap-2">
                  <Pill tone={statusBadgeClass(order.data.status as OrderStatus)}>
                    {STATUS_LABEL_RU[order.data.status as OrderStatus] ?? order.data.status}
                  </Pill>
                  <span className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
                    {new Date(order.data.createdAtIso).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {actions.map((a) => (
                  <Button
                    key={a.label}
                    variant={a.variant ?? 'primary'}
                    disabled={setStatus.isPending}
                    onClick={() => setStatus.mutate({ orderId: id, status: a.next })}
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-3 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <div className="text-sm font-semibold">Состав заказа</div>
              <div className="mt-3 divide-y divide-neutral-200 dark:divide-white/10">
                {order.data.items.map((i, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{i.title}</div>
                      <div className="mt-1 text-xs font-normal text-neutral-800 dark:text-neutral-300">
                        Размер: {i.size} • Кол-во: {i.qty}
                      </div>
                    </div>
                    <div className="shrink-0 font-semibold">{i.priceTjs * i.qty} TJS</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-neutral-100 p-4 ring-1 ring-neutral-200 dark:bg-neutral-950/60 dark:ring-white/10">
                <div className="text-sm font-normal text-neutral-800 dark:text-neutral-300">Итого</div>
                <div className="text-lg font-semibold">{order.data.totalTjs} TJS</div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-sm font-semibold">Покупатель</div>
              <div className="mt-3 space-y-2 text-sm font-normal text-neutral-900 dark:text-neutral-200">
                <div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Имя</div>
                  <div>{order.data.customer.name}</div>
                </div>
                {order.data.customer.phone && (
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Телефон</div>
                    <div>{order.data.customer.phone}</div>
                  </div>
                )}
                {order.data.customer.address && (
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Адрес</div>
                    <div>{order.data.customer.address}</div>
                  </div>
                )}
                <div className="pt-1">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Метод оплаты</div>
                  <div className="mt-1">
                    <Pill tone={methodBadgeClass(order.data.method as CheckoutMethod)}>
                      {METHOD_LABEL_RU[order.data.method as CheckoutMethod] ?? order.data.method}
                    </Pill>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-4 text-sm font-normal text-neutral-900 dark:text-neutral-300">
          Нет данных заказа.
        </Card>
      )}
    </div>
  )
}

