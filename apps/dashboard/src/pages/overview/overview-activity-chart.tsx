import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import type { AnalyticsTimeseriesPointDto } from '../../shared/api/types'

type RangePreset = 7 | 30 | 90

export function OverviewActivityChart({
  points,
  rangeDays,
  onRangeDays,
  isLoading,
  isError,
  onRetry,
}: {
  points: AnalyticsTimeseriesPointDto[]
  rangeDays: RangePreset
  onRangeDays: (d: RangePreset) => void
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}) {
  const chartRows = points.map((p) => ({
    ...p,
    label: p.date.slice(5).replace('-', '.'),
  }))

  const axisStroke = 'rgba(115,115,115,0.35)'
  const gridStroke = 'rgba(115,115,115,0.15)'

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Динамика по дням
          </div>
          <p className="mt-1 max-w-xl text-xs font-normal text-neutral-600 dark:text-neutral-400">
            Опубликовано — активность карточек со статусом «Опубликовано» по дате изменения (приблизительно).
            Продажи — заказы со статусами оплаты и отгрузки. Резерв и отмены — по дате создания заказа.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {([7, 30, 90] as const).map((d) => (
            <Button
              key={d}
              type="button"
              variant={rangeDays === d ? 'primary' : 'secondary'}
              className="w-full text-xs sm:w-auto"
              onClick={() => onRangeDays(d)}
            >
              {d} дн.
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-80 w-full min-h-[260px]">
        {isLoading && (
          <div className="grid h-full place-items-center text-sm text-neutral-600 dark:text-neutral-400">
            Загружаем график…
          </div>
        )}
        {!isLoading && isError && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="text-sm text-neutral-800 dark:text-neutral-200">Не удалось загрузить статистику</div>
            <Button variant="secondary" type="button" onClick={onRetry}>
              Повторить
            </Button>
          </div>
        )}
        {!isLoading && !isError && chartRows.length === 0 && (
          <div className="grid h-full place-items-center text-sm text-neutral-600 dark:text-neutral-400">
            Нет данных за выбранный период.
          </div>
        )}
        {!isLoading && !isError && chartRows.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke={axisStroke} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke={axisStroke} width={36} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(120,120,120,0.2)',
                  fontSize: 12,
                  background: 'rgba(24,24,27,0.94)',
                  color: '#fafafa',
                }}
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as { date?: string } | undefined
                  return row?.date ?? ''
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="publishedProducts" name="Опубликовано" stroke="#8b5cf6" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="soldOrders" name="Продажи" stroke="#22c55e" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="reservedOrders" name="В резерве" stroke="#eab308" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="cancelledOrders" name="Отмены" stroke="#f43f5e" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
