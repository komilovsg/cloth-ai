import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../features/cart/cart-store'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { IconButton } from '../../shared/ui/icon-button'
import { LuArrowLeft, LuPlus, LuShoppingCart, LuTrash2 } from 'react-icons/lu'
import { useMemo } from 'react'
import { useCatalogQuery } from '../../shared/api/queries'

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const catalog = useCatalogQuery()

  const enriched = useMemo(() => {
    const map = new Map((catalog.data?.items ?? []).map((p) => [p.id, p]))
    return items.map((i) => ({
      item: i,
      product: map.get(i.productId),
    }))
  }, [items, catalog.data?.items])

  const total = useMemo(() => {
    return enriched.reduce((sum, x) => {
      if (!x.product) return sum
      return sum + x.product.priceTjs * x.item.qty
    }, 0)
  }, [enriched])

  const hasLook =
    enriched.some((x) => x.item.kind === 'top') && enriched.some((x) => x.item.kind === 'bottom')

  if (catalog.isLoading && items.length > 0) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <Card className="h-24 animate-pulse bg-neutral-200 dark:bg-neutral-900" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight">Корзина</h1>
        <Card className="p-4">
          <div className="text-sm text-neutral-700 dark:text-neutral-200">Пока пусто.</div>
          <div className="mt-3">
            <Link to="/">
              <Button>В каталог</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const missing = enriched.some((x) => !x.product)

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Корзина {hasLook ? '• образ' : ''}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {hasLook ? 'Топ и низ можно оформить вместе.' : 'Добавьте вторую вещь для образа.'}
          </p>
        </div>
        <Link to="/">
          <IconButton aria-label="Добавить товары">
            <LuPlus className="h-5 w-5" />
          </IconButton>
        </Link>
      </header>

      {missing && (
        <Card className="border border-amber-400/40 bg-amber-50 p-3 text-xs text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          Часть товаров не найдена в актуальном каталоге. Обновите витрину или удалите позицию.
        </Card>
      )}

      <div className="space-y-3">
        {enriched.map(({ item, product }) => (
          <Card key={item.id} className="p-3">
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-950">
                {product ? (
                  <img
                    src={product.coverUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                    ?
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {product?.title ?? item.productId}
                </div>
                <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  Размер: {item.size} • Кол-во: {item.qty}
                </div>
                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {product ? `${product.priceTjs} TJS` : '—'}
                </div>
              </div>
              <IconButton
                aria-label="Удалить из корзины"
                onClick={() => removeItem(item.id)}
                className="shrink-0 p-3"
              >
                <LuTrash2 className="h-6 w-6" />
              </IconButton>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Итого</div>
          <div className="text-lg font-semibold">{total} TJS</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex">
            <IconButton
              variant="secondary"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-full py-3"
            >
              <LuArrowLeft className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="flex">
            <IconButton
              variant="primary"
              aria-label="Оформить"
              onClick={() => navigate('/checkout')}
              className="w-full py-3"
              disabled={missing}
            >
              <LuShoppingCart className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </Card>
    </div>
  )
}
