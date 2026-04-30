import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useCartStore } from '../../features/cart/cart-store'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { createOrder } from '../../shared/api/api-client'
import { openPaymentUrl } from '../../features/payments/open-payment-url'
import { useCatalogQuery } from '../../shared/api/queries'

type PaymentMethod = 'online' | 'cod' | 'reserve'

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const modelType = useAvatarStore((s) => s.modelType)
  const catalog = useCatalogQuery()
  const [method, setMethod] = useState<PaymentMethod>('online')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const productMap = useMemo(() => {
    return new Map((catalog.data?.items ?? []).map((p) => [p.id, p]))
  }, [catalog.data?.items])

  const total = useMemo(() => {
    return items.reduce((sum, i) => {
      const p = productMap.get(i.productId)
      if (!p) return sum
      return sum + p.priceTjs * i.qty
    }, 0)
  }, [items, productMap])

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight">Оформление</h1>
        <Card className="p-4 text-sm text-neutral-700 dark:text-neutral-200">Корзина пуста.</Card>
        <Button onClick={() => navigate('/')}>В каталог</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Оформление</h1>

      {modelType && (
        <Card className="overflow-hidden">
          <div className="p-4 pb-2">
            <div className="text-sm font-medium">Превью образа</div>
            <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              Типаж на фото:{' '}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {modelType === 'tall'
                  ? 'высокий'
                  : modelType === 'mid'
                    ? 'средний'
                    : modelType === 'curvy'
                      ? 'плотный'
                      : modelType}
              </span>
            </div>
          </div>
          <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
            {items.slice(0, 4).map((i) => {
              const p = productMap.get(i.productId)
              if (!p) return null
              const src = p.modelImages?.[modelType] ?? p.coverUrl
              return (
                <div
                  key={i.id}
                  className="overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/10 dark:bg-neutral-950 dark:ring-white/10"
                >
                  <div className="aspect-[3/4] w-full">
                    <img
                      src={src}
                      alt={p.title}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="border-t border-black/10 px-3 py-2 text-xs dark:border-white/10">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      {p.priceTjs} TJS • {i.size}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="text-sm font-medium">Способ оплаты</div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          {(
            [
              { id: 'online', label: 'Онлайн' },
              { id: 'cod', label: 'При получении' },
              { id: 'reserve', label: 'Резерв 2–4 ч' },
            ] as const
          ).map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setMethod(x.id)}
              className={[
                'rounded-xl px-3 py-3 ring-2 transition',
                method === x.id
                  ? 'bg-violet-600 text-white ring-violet-400'
                  : 'bg-neutral-100 text-neutral-900 ring-neutral-200 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-100 dark:ring-white/20 dark:hover:bg-neutral-900',
              ].join(' ')}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-neutral-100 p-3 text-xs text-neutral-700 ring-1 ring-black/10 dark:bg-neutral-950 dark:text-neutral-300 dark:ring-white/10">
          {method === 'online' && (
            <>
              Оплата онлайн (платёжная ссылка открывается после подтверждения — как только бекенд
              подключит провайдера).
            </>
          )}
          {method === 'cod' && <>Заказ попадёт в админку. Оплата курьеру или в точке выдачи.</>}
          {method === 'reserve' && (
            <>Резерв удерживает позиции ограниченное время — уточняйте SLA у поддержки.</>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">К оплате</div>
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
