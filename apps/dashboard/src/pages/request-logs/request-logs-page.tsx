import { useState } from 'react'
import { useRequestLogsQuery } from '../../shared/api/queries'
import type { RequestLogDto } from '../../shared/api/types'

const LIMIT = 50

function badge(code: number) {
  const cls =
    code < 300
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
      : code < 500
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${cls}`}>
      {code}
    </span>
  )
}

function Row({ row }: { row: RequestLogDto }) {
  const ts = new Date(row.timestamp).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  })
  return (
    <tr className="border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5">
      <td className="px-3 py-2 text-xs text-neutral-400 whitespace-nowrap">{ts}</td>
      <td className="px-3 py-2">
        <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
          {row.method}
        </span>
      </td>
      <td className="px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 max-w-xs truncate">
        {row.path}
      </td>
      <td className="px-3 py-2">{badge(row.status_code)}</td>
      <td className="px-3 py-2 text-xs text-neutral-500 whitespace-nowrap">
        {row.duration_ms} мс
      </td>
      <td className="px-3 py-2">
        {row.is_generation && (
          <span className="inline-block rounded bg-violet-100 px-1.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
            AI
          </span>
        )}
      </td>
    </tr>
  )
}

export function RequestLogsPage() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'generation' | 'non_generation'>('all')

  const { data, isLoading, isError } = useRequestLogsQuery(page, LIMIT, filter)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">API Логи</h1>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value as typeof filter); setPage(1) }}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm dark:border-white/10 dark:bg-neutral-900"
        >
          <option value="all">Все запросы</option>
          <option value="generation">AI генерация</option>
          <option value="non_generation">Остальные</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-neutral-200 dark:bg-neutral-950/60 dark:ring-white/10">
        {isLoading && (
          <div className="px-4 py-8 text-center text-sm text-neutral-400">Загрузка…</div>
        )}
        {isError && (
          <div className="px-4 py-8 text-center text-sm text-red-500">Ошибка загрузки логов</div>
        )}
        {data && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-white/5 text-xs text-neutral-400 uppercase tracking-wide">
                <th className="px-3 py-2 text-left font-medium">Время</th>
                <th className="px-3 py-2 text-left font-medium">Метод</th>
                <th className="px-3 py-2 text-left font-medium">Путь</th>
                <th className="px-3 py-2 text-left font-medium">Код</th>
                <th className="px-3 py-2 text-left font-medium">Время</th>
                <th className="px-3 py-2 text-left font-medium">Тип</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-neutral-400">
                    Нет записей
                  </td>
                </tr>
              )}
              {data.items.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>
            {data.total} записей · стр. {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-neutral-200 px-3 py-1 disabled:opacity-40 dark:border-white/10"
            >
              ←
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-neutral-200 px-3 py-1 disabled:opacity-40 dark:border-white/10"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
