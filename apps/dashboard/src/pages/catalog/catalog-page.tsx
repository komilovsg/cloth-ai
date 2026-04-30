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
  published: 'В витрине',
  hidden: 'Скрыт',
}

function StatusBadge({ status }: { status: CatalogStatus }) {
  const tone =
    status === 'published'
      ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30'
      : status === 'generated'
        ? 'bg-sky-500/15 text-sky-200 ring-sky-400/30'
        : status === 'draft'
          ? 'bg-neutral-100 text-neutral-800 ring-neutral-200 dark:bg-neutral-950/60 dark:text-neutral-200 dark:ring-white/10'
          : 'bg-amber-500/15 text-amber-200 ring-amber-400/30'

  return (
    <span className={['inline-flex flex-col gap-0.5 rounded-full px-2 py-1 text-xs ring-1', tone].join(' ')}>
      <span>{CATALOG_STATUS_RU[status] ?? status}</span>
      <span className="font-mono text-[10px] opacity-70">{status}</span>
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
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
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
            <label className="text-xs text-neutral-300">Поиск</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="По названию или ID"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950"
            />
          </div>
          <div className="w-56">
            <label className="text-xs text-neutral-300">Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | CatalogStatus)}
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950"
            >
              <option value="all">Все</option>
            <option value="draft">Черновик (draft)</option>
            <option value="generating">Генерация (generating)</option>
            <option value="generated">Готово (generated)</option>
            <option value="published">В витрине (published)</option>
            <option value="hidden">Скрыт (hidden)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.4fr_.6fr_.5fr_.6fr_.8fr] gap-0 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600 dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-400">
          <div>Товар</div>
          <div>Категория</div>
          <div className="text-right">Цена</div>
          <div className="pl-2">Статус</div>
          <div>Обновлено</div>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-white/10">
          {catalog.isLoading && (
            <div className="px-4 py-8 text-center text-sm text-neutral-300">
              Загружаем каталог…
            </div>
          )}
          {catalog.isError && (
            <div className="px-4 py-8 text-center text-sm text-neutral-200">
              Не удалось загрузить
            </div>
          )}

          {!catalog.isLoading && !catalog.isError && rows.map((r) => (
            <Link key={r.id} to={`/catalog/${r.id}/edit`} className="block hover:bg-neutral-50 dark:hover:bg-neutral-950/40">
              <div className="grid grid-cols-[1.4fr_.6fr_.5fr_.6fr_.8fr] items-center gap-0 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{r.title}</div>
                  <div className="mt-1 text-xs text-neutral-400">{r.id}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-neutral-800 dark:text-neutral-200">
                    {CATEGORY_LABEL_RU[r.category] ?? r.category}
                  </div>
                  <div className="font-mono text-[10px] text-neutral-500">{r.category}</div>
                </div>
                <div className="text-right text-sm font-semibold">{r.priceTjs} TJS</div>
                <div className="pl-2">
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-xs text-neutral-300">
                  {new Date(r.updatedAtIso).toLocaleString()}
                </div>
              </div>
            </Link>
          ))}

          {!catalog.isLoading && !catalog.isError && rows.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-neutral-300">
              Ничего не найдено.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

