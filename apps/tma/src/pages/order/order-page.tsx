import { Link, useParams } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useOrderQuery } from '../../shared/api/queries'
import { openPaymentUrl } from '../../features/payments/open-payment-url'
import type { OrderStatus, CheckoutMethod } from '@cloth-ai/contracts'

const METHOD_LABEL: Record<CheckoutMethod, string> = {
  online: 'Онлайн оплата',
  cod: 'Оплата при получении',
  reserve: 'Резерв',
}

const TRACKING_STEPS: Array<{ statuses: OrderStatus[]; label: string }> = [
  { statuses: ['created', 'paid', 'awaiting_cod', 'reserved', 'packing', 'shipping', 'delivered'], label: 'Оформлен' },
  { statuses: ['packing', 'shipping', 'delivered'], label: 'Сборка' },
  { statuses: ['shipping', 'delivered'], label: 'В пути' },
  { statuses: ['delivered'], label: 'Доставлен' },
]

function getCompletedSteps(status: OrderStatus): number {
  if (status === 'delivered') return 4
  if (status === 'shipping') return 3
  if (status === 'packing') return 2
  return 1
}

const SHOW_TRACKING: OrderStatus[] = ['packing', 'shipping', 'delivered']

export function OrderPage() {
  const { orderId } = useParams()
  const id = orderId ?? ''
  const order = useOrderQuery(id)
  const paymentUrl =
    typeof window === 'undefined'
      ? null
      : (sessionStorage.getItem(`clothai:paymentUrl:${id}`) ?? null)

  const status = order.data?.status
  const method = order.data?.method
  const showTracking = status != null && SHOW_TRACKING.includes(status)
  const completedSteps = status ? getCompletedSteps(status) : 0

  const pageTitle = status === 'cancelled'
    ? 'Заказ отменён'
    : status === 'delivered'
      ? 'Доставлен!'
      : status === 'shipping'
        ? 'Заказ в пути'
        : status === 'packing'
          ? 'Заказ собирается'
          : status === 'paid'
            ? 'Оплата прошла'
            : status === 'reserved'
              ? 'Товар зарезервирован'
              : status === 'awaiting_cod'
                ? 'Заказ принят'
                : 'Статус заказа'

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>

      <Card className="p-4">
        {order.isLoading ? (
          <div className="text-sm text-neutral-400">Загружаем…</div>
        ) : order.isError ? (
          <div className="text-sm text-neutral-400">Заказ не найден.</div>
        ) : order.data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Способ оплаты</span>
              <span className="font-medium">{method ? METHOD_LABEL[method] : '—'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Создан</span>
              <span className="font-medium">
                {new Date(order.data.createdAtIso).toLocaleString('ru', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {showTracking && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-medium text-neutral-400">Отслеживание</div>
                <div className="flex items-center gap-0">
                  {TRACKING_STEPS.map((step, i) => {
                    const done = completedSteps > i
                    const active = completedSteps === i + 1
                    return (
                      <div key={step.label} className="flex flex-1 flex-col items-center gap-1">
                        <div className="flex w-full items-center">
                          {i > 0 && (
                            <div
                              className={[
                                'h-0.5 flex-1',
                                done ? 'bg-violet-500' : 'bg-neutral-700',
                              ].join(' ')}
                            />
                          )}
                          <div
                            className={[
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                              done
                                ? 'bg-violet-500 text-white'
                                : active
                                  ? 'bg-violet-500/20 ring-2 ring-violet-500 text-violet-400'
                                  : 'bg-neutral-800 text-neutral-500',
                            ].join(' ')}
                          >
                            {done ? '✓' : i + 1}
                          </div>
                          {i < TRACKING_STEPS.length - 1 && (
                            <div
                              className={[
                                'h-0.5 flex-1',
                                completedSteps > i + 1 ? 'bg-violet-500' : 'bg-neutral-700',
                              ].join(' ')}
                            />
                          )}
                        </div>
                        <span className={[
                          'text-center text-[10px]',
                          done ? 'text-violet-400' : 'text-neutral-500',
                        ].join(' ')}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {status === 'cancelled' && (
              <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 ring-1 ring-red-500/20">
                Заказ отменён. Свяжитесь с магазином если это ошибка.
              </div>
            )}

            {status === 'reserved' && (
              <div className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-400 ring-1 ring-amber-500/20">
                Товар ждёт вас. Подойдите в магазин в течение 3 часов.
              </div>
            )}

            {status === 'awaiting_cod' && (
              <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-sm text-blue-400 ring-1 ring-blue-500/20">
                Заказ принят. Оплата при получении.
              </div>
            )}

            {status === 'paid' && (
              <div className="rounded-xl bg-green-500/10 px-3 py-2 text-sm text-green-400 ring-1 ring-green-500/20">
                Оплата подтверждена. Скоро начнём собирать заказ.
              </div>
            )}
          </div>
        ) : null}

        {!order.isLoading && !order.isError && status === 'created' && (
          <div className="mt-4 space-y-2">
            {paymentUrl && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => openPaymentUrl(paymentUrl)}
              >
                Открыть оплату
              </Button>
            )}
            <Button className="w-full" onClick={() => order.refetch()}>
              Я оплатил — проверить
            </Button>
            <div className="text-center text-xs text-neutral-500">
              Статус обновляется автоматически
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Link to="/">
          <Button className="w-full">В каталог</Button>
        </Link>
        <Link to="/cart">
          <Button variant="secondary" className="w-full">Корзина</Button>
        </Link>
      </div>
    </div>
  )
}
