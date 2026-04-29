import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../features/cart/cart-store'
import { MOCK_CATALOG } from '../../features/catalog/mock-catalog'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { IconButton } from '../../shared/ui/icon-button'
import { LuArrowLeft, LuPlus, LuShoppingCart, LuTrash2 } from 'react-icons/lu'
import { useMemo } from 'react'

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)

  const enriched = useMemo(() => {
    return items.map((i) => ({
      item: i,
      product: MOCK_CATALOG.find((p) => p.id === i.productId)!,
    }))
  }, [items])

  const total = enriched.reduce(
    (sum, x) => sum + x.product.priceTjs * x.item.qty,
    0,
  )

  const hasLook = enriched.some((x) => x.item.kind === 'top') && enriched.some((x) => x.item.kind === 'bottom')

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight">Корзина</h1>
        <Card className="p-4">
          <div className="text-sm text-neutral-200">Пока пусто.</div>
          <div className="mt-3">
            <Link to="/">
              <Button>В каталог</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Корзина {hasLook ? '• Full Look' : ''}
          </h1>
          <p className="mt-1 text-sm text-neutral-300">
            {hasLook ? 'Топ + низ в одном чеке.' : 'Можно собрать образ.'}
          </p>
        </div>
        <Link to="/">
          <IconButton aria-label="Добавить товары">
            <LuPlus className="h-5 w-5" />
          </IconButton>
        </Link>
      </header>

      <div className="space-y-3">
        {enriched.map(({ item, product }) => (
          <Card key={item.id} className="p-3">
            <div className="flex gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-neutral-950">
                <img
                  src={product.coverUrl}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{product.title}</div>
                <div className="mt-1 text-xs text-neutral-300">
                  Размер: {item.size} • Кол-во: {item.qty}
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {product.priceTjs} TJS
                </div>
              </div>
              <IconButton
                aria-label="Удалить из корзины"
                onClick={() => removeItem(item.id)}
                className="p-3"
              >
                <LuTrash2 className="h-6 w-6" />
              </IconButton>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-300">Итого</div>
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
            >
              <LuShoppingCart className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </Card>
    </div>
  )
}

