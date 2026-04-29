import { Card } from '../../shared/ui/card'
import { useOrdersQuery } from '../../shared/api/queries'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-950/60 p-4 ring-1 ring-white/10">
      <div className="text-xs text-neutral-300">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  )
}

export function OverviewPage() {
  const orders = useOrdersQuery()

  const total = orders.data?.length ?? 0
  const paid = orders.data?.filter((o) => o.status === 'paid').length ?? 0
  const reserved = orders.data?.filter((o) => o.status === 'reserved').length ?? 0
  const cod = orders.data?.filter((o) => o.status === 'awaiting_cod').length ?? 0

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Обзор</h1>
        <p className="mt-1 text-sm text-neutral-300">
          Рабочее место владельца: заказы, контент, публикации.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Всего заказов" value={orders.isLoading ? '…' : String(total)} />
        <Stat label="Оплачено (online)" value={orders.isLoading ? '…' : String(paid)} />
        <Stat label="Резерв" value={orders.isLoading ? '…' : String(reserved)} />
        <Stat label="Оплата при получении" value={orders.isLoading ? '…' : String(cod)} />
      </div>

      <Card className="p-4">
        <div className="text-sm font-medium">Что дальше</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
          <li>Добавить товар через мастер “3 шага”</li>
          <li>Проверить генерации и опубликовать</li>
          <li>Отслеживать оплаты/резервы/наложку</li>
        </ul>
      </Card>
    </div>
  )
}

