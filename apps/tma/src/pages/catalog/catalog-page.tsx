import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Card } from '../../shared/ui/card'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { Button } from '../../shared/ui/button'
import { useCatalogQuery } from '../../shared/api/queries'
import { IconButton } from '../../shared/ui/icon-button'
import { LuMenu, LuUser } from 'react-icons/lu'
import type { ProductCategory } from '@cloth-ai/contracts'
import { usePrefsStore } from '../../features/preferences/prefs-store'
import { t } from '../../features/i18n/messages'
import { categoryFilterLabelRu, modelTypeShortRu } from '../../features/catalog/labels'
import { useMenuDrawer } from '../../app/menu-drawer'

type CatFilter = 'all' | ProductCategory

export function CatalogPage() {
  const modelType = useAvatarStore((s) => s.modelType)
  const catalog = useCatalogQuery()
  const locale = usePrefsStore((s) => s.locale)
  const theme = usePrefsStore((s) => s.theme)
  const { openMenu } = useMenuDrawer()
  const [cat, setCat] = useState<CatFilter>('all')

  const items = useMemo(() => {
    const list = catalog.data?.items ?? []
    if (cat === 'all') return list
    return list.filter((p) => p.category === cat)
  }, [catalog.data?.items, cat])

  const chips: CatFilter[] = ['all', 'tops', 'bottoms', 'dresses']

  const headerAccent =
    theme === 'light'
      ? 'from-violet-200/90 via-fuchsia-100/40 to-transparent'
      : 'from-violet-600/35 via-fuchsia-600/15 to-transparent'

  return (
    <div className="space-y-4">
      <header className="relative overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${headerAccent}`} />
        <div className="relative flex flex-wrap items-start justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo.jpg"
              alt="CLOTH.AI"
              className="h-10 w-10 rounded-xl bg-white object-contain ring-1 ring-black/10 dark:ring-white/15"
              loading="eager"
            />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">{t(locale, 'catalogTitle')}</h1>
              <p className="mt-0.5 max-w-[14rem] text-xs leading-snug text-neutral-600 dark:text-neutral-400">
                {t(locale, 'catalogSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            {!modelType ? (
              <Link to="/onboarding/avatar">
                <IconButton variant="secondary" aria-label={t(locale, 'navAvatar')}>
                  <LuUser className="h-5 w-5" />
                </IconButton>
              </Link>
            ) : (
              <div className="rounded-xl bg-black/[0.05] px-3 py-2 text-xs ring-1 ring-black/10 dark:bg-neutral-900/80 dark:ring-white/15">
                <span className="text-neutral-500 dark:text-neutral-400">{t(locale, 'modelChip')}: </span>
                <span className="font-medium text-violet-700 dark:text-violet-200">
                  {modelTypeShortRu(modelType)}
                </span>
              </div>
            )}
            <IconButton aria-label={t(locale, 'menuTitle')} onClick={openMenu}>
              <LuMenu className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        <div className="relative flex gap-2 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={[
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition',
                cat === c
                  ? 'bg-violet-600 text-white ring-violet-500'
                  : theme === 'light'
                    ? 'bg-white/90 text-neutral-800 ring-neutral-200 hover:bg-neutral-50'
                    : 'bg-neutral-900/90 text-neutral-200 ring-white/15 hover:bg-neutral-900',
              ].join(' ')}
            >
              {categoryFilterLabelRu(c)}
            </button>
          ))}
        </div>
      </header>

      {catalog.isLoading ? (
        <div className="grid grid-cols-2 items-stretch gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="h-full overflow-hidden">
              <div className="aspect-[3/4] w-full animate-pulse bg-neutral-200 dark:bg-neutral-900" />
              <div className="p-3">
                <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </Card>
          ))}
        </div>
      ) : catalog.isError ? (
        <Card className="p-4">
          <div className="text-sm font-medium">Не удалось загрузить каталог</div>
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Проверь сеть или попробуй позже.
          </div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => catalog.refetch()}>
              Повторить
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {items.length === 0 ? (
            <Card className="p-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
              В этой категории пока нет товаров.
              <div className="mt-3 flex justify-center">
                <Button variant="secondary" type="button" onClick={() => setCat('all')}>
                  Показать все
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 items-stretch gap-3">
              {items.map((p) => {
                const img =
                  modelType && p.modelImages?.[modelType]
                    ? p.modelImages[modelType]
                    : p.coverUrl
                return (
                  <Link key={p.id} to={`/product/${p.id}`} className="block h-full">
                    <Card className="flex h-full flex-col overflow-hidden transition hover:ring-violet-400/40">
                      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                        <img
                          src={img}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-1 p-3">
                        <div className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5">
                          {p.title}
                        </div>
                        <div className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                          {p.priceTjs} TJS
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
