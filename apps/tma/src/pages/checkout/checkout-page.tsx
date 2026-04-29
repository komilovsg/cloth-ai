import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useCartStore } from '../../features/cart/cart-store'
import { MOCK_CATALOG } from '../../features/catalog/mock-catalog'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { createOrder } from '../../shared/api/api-client'
import { openPaymentUrl } from '../../features/payments/open-payment-url'

type PaymentMethod = 'online' | 'cod' | 'reserve'

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const modelType = useAvatarStore((s) => s.modelType)
  const [method, setMethod] = useState<PaymentMethod>('online')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = useMemo(() => {
    return items.reduce((sum, i) => {
      const p = MOCK_CATALOG.find((p) => p.id === i.productId)
      if (!p) return sum
      return sum + p.priceTjs * i.qty
    }, 0)
  }, [items])

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight">Оформление</h1>
        <Card className="p-4 text-sm text-neutral-200">Корзина пуста.</Card>
        <Button onClick={() => navigate('/')}>В каталог</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Оформление</h1>

      {modelType && (
        <Card className="overflow-hidden">
          <div className="p-4">
            <div className="text-sm font-medium">Превью образа</div>
            <div className="mt-1 text-xs text-neutral-300">
              Типаж: <span className="text-neutral-50">{modelType}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {items.slice(0, 2).map((i) => {
              const p = MOCK_CATALOG.find((p) => p.id === i.productId)
              if (!p) return null
              return (
                <div
                  key={i.id}
                  className="aspect-[3/4] w-full overflow-hidden bg-neutral-950"
                >
                  <img
                    src={p.modelImages[modelType]}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="text-sm font-medium">Способ оплаты</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {(
            [
              { id: 'online', label: 'Online' },
              { id: 'cod', label: 'При получении' },
              { id: 'reserve', label: 'Резерв 2–4ч' },
            ] as const
          ).map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setMethod(x.id)}
              className={[
                'rounded-xl px-2 py-2 ring-1 transition',
                method === x.id
                  ? 'bg-violet-500 text-white ring-violet-400'
                  : 'bg-neutral-950 text-neutral-200 ring-white/10 hover:bg-neutral-900',
              ].join(' ')}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-neutral-950 p-3 text-xs text-neutral-300 ring-1 ring-white/10">
          {method === 'online' && (
            <>
              Оплата через SmartPay (в MVP), комиссия учитывается на бэке. Тут пока
              заглушка.
            </>
          )}
          {method === 'cod' && <>Заказ улетит в админку. Оплата курьеру/в магазине.</>}
          {method === 'reserve' && (
            <>
              Резервирует вещи на 2–4 часа. Если не подтвердили — резерв слетает.
            </>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-300">К оплате</div>
          <div className="text-lg font-semibold">{total} TJS</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => navigate('/cart')} disabled={isSubmitting}>
            Назад
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true)
              const res = await createOrder({
                method,
                modelType,
                items: items.map((i) => ({
                  productId: i.productId,
                  size: i.size,
                  qty: i.qty,
                })),
              })
              clear()
              if (method === 'online' && res.payment?.paymentUrl) {
                // keep url for OrderPage actions (open again / "I paid")
                sessionStorage.setItem(`clothai:paymentUrl:${res.orderId}`, res.payment.paymentUrl)
                openPaymentUrl(res.payment.paymentUrl)
              }
              navigate(`/order/${res.orderId}`)
            }}
          >
            {method === 'online' ? 'Оплатить' : method === 'cod' ? 'Оформить' : 'Забронировать'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

