import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { useMemo, useState } from 'react'
import { useCartStore } from '../../features/cart/cart-store'
import type { ProductSize } from '@cloth-ai/contracts'
import { useCatalogProductQuery, useCatalogQuery } from '../../shared/api/queries'
import { LuX, LuZoomIn } from 'react-icons/lu'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const modelType = useAvatarStore((s) => s.modelType)
  const addItem = useCartStore((s) => s.addItem)

  const q = useCatalogProductQuery(productId)
  const product = q.data ?? null

  const catalog = useCatalogQuery()
  const related = (catalog.data?.items ?? [])
    .filter((p) => p.category === product?.category && p.id !== productId)
    .slice(0, 4)

  const [size, setSize] = useState<ProductSize | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

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
    <>
      {/* Fullscreen image viewer */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm"
            onClick={() => setFullscreen(false)}
          >
            <LuX className="h-6 w-6" />
          </button>
          <img
            src={heroSrc}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">{product.title}</h1>
          <div className="text-lg font-semibold text-violet-700 dark:text-violet-300">
            {product.priceTjs} TJS
          </div>
        </div>

        <Card className="group relative overflow-hidden">
          <div
            className="aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-neutral-100 dark:bg-neutral-950"
            onClick={() => setFullscreen(true)}
          >
            <img src={heroSrc} alt={product.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                <LuZoomIn className="h-3.5 w-3.5" />
                Открыть
              </div>
            </div>
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

        {related.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Похожие товары</div>
            <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {related.map((p) => {
                const src = modelType && p.modelImages?.[modelType] ? p.modelImages[modelType] : p.coverUrl
                return (
                  <Link key={p.id} to={`/product/${p.id}`} className="shrink-0">
                    <div className="w-32 overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
                      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                        <img src={src} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-2">
                        <div className="line-clamp-2 text-xs font-medium leading-4">{p.title}</div>
                        <div className="mt-1 text-xs text-violet-700 dark:text-violet-300">{p.priceTjs} TJS</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
