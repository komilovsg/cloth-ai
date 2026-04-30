import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import { useCatalogRowsQuery } from '../../shared/api/queries'
import type { CatalogStatus } from '../../shared/api/types'

const CATEGORY_LABEL_RU: Record<string, string> = {
  tops: 'Верх',
  bottoms: 'Низ',
  dresses: 'Платья',
}

const CATALOG_STATUS_RU: Record<CatalogStatus, string> = {
  draft: 'Черновик',
  generating: 'Генерация',
  generated: 'Готово к публикации',
  published: 'Опубликовано',
  hidden: 'Скрыт',
}

/** Keeps column proportions; parent scrolls horizontally on narrow viewports. */
const CATALOG_TABLE_GRID =
  'grid grid-cols-[1.4fr_.6fr_.5fr_.6fr_.8fr] gap-0'

function StatusBadge({ status }: { status: CatalogStatus }) {
  const tone =
    status === 'published'
      ? 'bg-emerald-100 text-emerald-900 ring-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/30'
      : status === 'generated'
        ? 'bg-sky-100 text-sky-900 ring-sky-400 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-400/30'
        : status === 'draft'
          ? 'bg-neutral-100 text-neutral-900 ring-neutral-300 dark:bg-neutral-950/60 dark:text-neutral-200 dark:ring-white/10'
          : status === 'hidden'
            ? 'bg-neutral-200 text-neutral-900 ring-neutral-400 dark:bg-neutral-600/20 dark:text-neutral-200 dark:ring-neutral-500/30'
            : 'bg-amber-100 text-amber-950 ring-amber-400 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30'

  return (
    <span className={['inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1', tone].join(' ')}>
      {CATALOG_STATUS_RU[status] ?? status}
    </span>
  )
}

export function CatalogPage() {
  const catalog = useCatalogRowsQuery()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | CatalogStatus>('all')

  const rows = useMemo(() => {
    const all = catalog.data ?? []
    const filtered = status === 'all' ? all : all.filter((r) => r.status === status)
    const qq = q.trim().toLowerCase()
    if (!qq) return filtered
    return filtered.filter((r) => r.title.toLowerCase().includes(qq) || r.id.toLowerCase().includes(qq))
  }, [catalog.data, q, status])

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Каталог</h1>
          <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
            Список товаров с яркими статусами. Категории фиксированы (верх / низ / платья) — свой набор
            категорий появится вместе с обновлением API.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/catalog/new">
            <Button>+ Добавить</Button>
          </Link>
        </div>
      </header>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1">
            <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">Поиск</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="По названию или ID"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500"
            />
          </div>
          <div className="w-56">
            <label className="text-xs font-normal text-neutral-800 dark:text-neutral-300">Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | CatalogStatus)}
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
            >
              <option value="all">Все</option>
            {(Object.keys(CATALOG_STATUS_RU) as CatalogStatus[]).map((key) => (
              <option key={key} value={key}>
                {CATALOG_STATUS_RU[key]}
              </option>
            ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden ring-1 ring-neutral-200 dark:ring-white/10">
        <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] touch-pan-x">
          <div className="min-w-[720px]">
            <div
              className={`${CATALOG_TABLE_GRID} border-b border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-neutral-900 dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-400`}
            >
              <div className="shrink-0">Товар</div>
              <div className="shrink-0">Категория</div>
              <div className="shrink-0 text-right">Цена</div>
              <div className="shrink-0 pl-2">Статус</div>
              <div className="shrink-0">Обновлено</div>
            </div>

            <div className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-transparent">
              {catalog.isLoading && (
                <div className="px-4 py-8 text-center text-sm font-normal text-neutral-900 dark:text-neutral-300">
                  Загружаем каталог…
                </div>
              )}
              {catalog.isError && (
                <div className="px-4 py-8 text-center text-sm font-normal text-neutral-900 dark:text-neutral-200">
                  Не удалось загрузить
                </div>
              )}

              {!catalog.isLoading &&
                !catalog.isError &&
                rows.map((r) => (
                  <Link
                    key={r.id}
                    to={`/catalog/${r.id}/edit`}
                    className="block hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                  >
                    <div className={`${CATALOG_TABLE_GRID} items-center px-4 py-3`}>
                      <div className="min-w-0 shrink-0">
                        <div className="truncate text-sm font-medium">{r.title}</div>
                        <div className="mt-1 text-xs font-normal text-neutral-700 dark:text-neutral-400">{r.id}</div>
                      </div>
                      <div className="min-w-0 shrink-0">
                        <div className="text-sm font-normal text-neutral-900 dark:text-neutral-200">
                          {CATEGORY_LABEL_RU[r.category] ?? r.category}
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-sm font-semibold">{r.priceTjs} TJS</div>
                      <div className="shrink-0 pl-2">
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="shrink-0 whitespace-nowrap text-xs font-normal text-neutral-900 dark:text-neutral-300">
                        {new Date(r.updatedAtIso).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))}

              {!catalog.isLoading && !catalog.isError && rows.length === 0 && (
                <div className="px-4 py-8 text-center text-sm font-normal text-neutral-900 dark:text-neutral-300">
                  Ничего не найдено.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

