import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { useMemo, useState } from 'react'
import { useCartStore } from '../../features/cart/cart-store'
import type { ProductSize } from '@cloth-ai/contracts'
import { useCatalogProductQuery } from '../../shared/api/queries'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const modelType = useAvatarStore((s) => s.modelType)
  const addItem = useCartStore((s) => s.addItem)

  const q = useCatalogProductQuery(productId)
  const product = q.data ?? null

  const [size, setSize] = useState<ProductSize | null>(null)

  const heroSrc = useMemo(() => {
    if (!product) return ''
    return modelType && product.modelImages?.[modelType]
      ? product.modelImages[modelType]
      : product.coverUrl
  }, [product, modelType])

  if (q.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <Card className="overflow-hidden">
          <div className="aspect-[3/4] animate-pulse bg-neutral-200 dark:bg-neutral-900" />
        </Card>
      </div>
    )
  }

  if (q.isError || !product) {
    return (
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Товар не найден</h1>
        <Link to="/" className="text-sm text-violet-600 dark:text-violet-300">
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
        <div className="text-lg font-semibold text-violet-700 dark:text-violet-300">
          {product.priceTjs} TJS
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
          <img src={heroSrc} alt={product.title} className="h-full w-full object-cover" />
        </div>
      </Card>

      {!modelType && (
        <Card className="p-3">
          <div className="text-sm text-neutral-700 dark:text-neutral-200">
            Для примерки на модели выберите типаж один раз — так мы покажем вещь на вашем силуэте.
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
        {!size && (
          <p className="text-xs text-amber-700 dark:text-amber-200/90">
            Выберите размер, чтобы добавить в корзину.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s.size}
              type="button"
              disabled={!s.inStock}
              onClick={() => setSize(s.size)}
              className={[
                'min-h-[48px] min-w-[52px] rounded-2xl px-4 py-3 text-base font-semibold ring-2 transition',
                !s.inStock
                  ? 'cursor-not-allowed opacity-35 ring-transparent'
                  : size === s.size
                    ? 'bg-violet-600 text-white ring-violet-400'
                    : 'bg-neutral-100 text-neutral-900 ring-neutral-300 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-white/25 dark:hover:bg-neutral-800',
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
          type="button"
          onClick={() => navigate('/cart')}
          disabled={useCartStore.getState().items.length === 0}
        >
          Открыть корзину
        </Button>
        <Button
          type="button"
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
          Добавить в корзину
        </Button>
      </div>
    </div>
  )
}
