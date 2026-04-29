import { Link, useParams } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useOrderQuery } from '../../shared/api/queries'
import { openPaymentUrl } from '../../features/payments/open-payment-url'

export function OrderPage() {
  const { orderId } = useParams()
  const id = orderId ?? ''
  const order = useOrderQuery(id)
  const paymentUrl =
    typeof window === 'undefined'
      ? null
      : (sessionStorage.getItem(`clothai:paymentUrl:${id}`) ?? null)

  const title =
    order.data?.status === 'paid'
      ? 'Оплата прошла'
      : order.data?.status === 'reserved'
        ? 'Резерв создан'
        : order.data?.status === 'awaiting_cod'
          ? 'Заказ создан'
        : order.data?.status === 'created'
          ? 'Ожидаем оплату'
          : 'Статус заказа'

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <Card className="p-4">
        {order.isLoading ? (
          <div className="text-sm text-neutral-200">Загружаем статус…</div>
        ) : order.isError ? (
          <div className="text-sm text-neutral-200">Заказ не найден.</div>
        ) : order.data ? (
          <div className="space-y-2">
            <div className="text-sm text-neutral-200">
              Статус: <span className="text-neutral-50">{order.data.status}</span>
            </div>
            <div className="text-xs text-neutral-400">
              Метод: {order.data.method} • {new Date(order.data.createdAtIso).toLocaleString()}
            </div>
            <div className="rounded-xl bg-neutral-950 p-3 text-xs text-neutral-400 ring-1 ring-white/10">
              MVP: дальше будет трекинг (Сборка / В пути / Доставлено) от бэка.
            </div>
          </div>
        ) : null}

        {!order.isLoading && !order.isError && order.data?.status === 'created' && (
          <div className="mt-3 space-y-2">
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
              Я оплатил
            </Button>
            <div className="text-xs text-neutral-400">
              Статус обновится автоматически (проверяем каждые ~1.5s).
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Link to="/">
          <Button>В каталог</Button>
        </Link>
        <Link to="/cart">
          <Button variant="secondary">Корзина</Button>
        </Link>
      </div>
    </div>
  )
}

