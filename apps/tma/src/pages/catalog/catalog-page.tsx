import { Link } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { useAvatarStore } from '../../features/avatar/avatar-store'
import { Button } from '../../shared/ui/button'
import { useCatalogQuery } from '../../shared/api/queries'
import { IconButton } from '../../shared/ui/icon-button'
import { LuUser } from 'react-icons/lu'

export function CatalogPage() {
  const modelType = useAvatarStore((s) => s.modelType)
  const catalog = useCatalogQuery()

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/brand/logo.jpg"
            alt="CLOTH.AI"
            className="h-9 w-9 rounded-xl bg-white object-contain ring-1 ring-white/10"
            loading="eager"
          />
        </div>
        <div className="flex items-start justify-end">
          <p className="mt-1 text-sm text-neutral-300">
            Витрина внутри Telegram. <br/> Выбор → образ → оплата.
          </p>
        </div>
        {!modelType ? (
          <Link to="/onboarding/avatar">
            <IconButton variant="secondary" aria-label="Выбрать типаж">
              <LuUser className="h-5 w-5" />
            </IconButton>
          </Link>
        ) : (
          <div className="rounded-xl bg-neutral-900 px-3 py-2 text-xs text-neutral-300 ring-1 ring-white/10">
            Типаж: <span className="text-neutral-50">{modelType}</span>
          </div>
        )}
      </header>

      {catalog.isLoading ? (
        <div className="grid grid-cols-2 items-stretch gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="h-full overflow-hidden">
              <div className="aspect-[3/4] w-full animate-pulse bg-neutral-900" />
              <div className="p-3">
                <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-800" />
                <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-neutral-800" />
              </div>
            </Card>
          ))}
        </div>
      ) : catalog.isError ? (
        <Card className="p-4">
          <div className="text-sm font-medium">Не удалось загрузить каталог</div>
          <div className="mt-1 text-xs text-neutral-300">
            Проверь сеть или попробуй позже.
          </div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => catalog.refetch()}>
              Повторить
            </Button>
          </div>
        </Card>
      ) : catalog.data ? (
        <div className="grid grid-cols-2 items-stretch gap-3">
          {catalog.data.items.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="block h-full">
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                <img
                  src={modelType ? p.modelImages[modelType] : p.coverUrl}
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-1 p-3">
                <div className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5">
                  {p.title}
                </div>
                <div className="text-xs text-neutral-300">{p.priceTjs} TJS</div>
              </div>
            </Card>
          </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

