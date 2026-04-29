import { Link, useNavigate, useParams } from 'react-router-dom'
import { MOCK_CATALOG } from '../../features/catalog/mock-catalog'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { useMemo, useState } from 'react'
import { useCartStore } from '../../features/cart/cart-store'
import type { ProductSize } from '@cloth-ai/contracts'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const modelType = useAvatarStore((s) => s.modelType)
  const addItem = useCartStore((s) => s.addItem)

  const product = useMemo(
    () => MOCK_CATALOG.find((p) => p.id === productId) ?? null,
    [productId],
  )

  const [size, setSize] = useState<ProductSize | null>(null)

  if (!product) {
    return (
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Товар не найден</h1>
        <Link to="/" className="text-sm text-violet-300">
          ← Вернуться в каталог
        </Link>
      </div>
    )
  }

  const availableSizes = product.sizes.filter((s) => s.inStock)
  const canAdd = !!size && availableSizes.some((s) => s.size === size)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">{product.title}</h1>
        <div className="text-sm text-neutral-300">{product.priceTjs} TJS</div>
      </div>

      <Card className="overflow-hidden">
        <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950">
          <img
            src={modelType ? product.modelImages[modelType] : product.coverUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
      </Card>

      {!modelType && (
        <Card className="p-3">
          <div className="text-sm text-neutral-200">
            Для “примерки” выбери типаж один раз — и вся витрина будет на нём.
          </div>
          <div className="mt-3">
            <Link to="/onboarding/avatar">
              <Button variant="secondary">Выбрать типаж</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium">Размер</div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s.size}
              type="button"
              disabled={!s.inStock}
              onClick={() => setSize(s.size)}
              className={[
                'rounded-xl px-3 py-2 text-sm ring-1 transition',
                s.inStock
                  ? 'ring-white/10 hover:bg-neutral-900'
                  : 'cursor-not-allowed opacity-40 ring-white/5',
                size === s.size ? 'bg-violet-500 text-white ring-violet-400' : 'bg-neutral-950',
              ].join(' ')}
            >
              {s.size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={() => navigate('/cart')}
          disabled={useCartStore.getState().items.length === 0}
        >
          В корзину
        </Button>
        <Button
          onClick={() => {
            if (!canAdd) return
            const kind =
              product.category === 'tops'
                ? 'top'
                : product.category === 'bottoms'
                  ? 'bottom'
                  : 'single'
            addItem({ kind, productId: product.id, size })
            navigate('/cart')
          }}
          disabled={!canAdd}
        >
          Добавить
        </Button>
      </div>

      <p className="text-xs text-neutral-400">
        MVP: фото на типажах — пре-рендер от бэка; тут пока мок.
      </p>
    </div>
  )
}

