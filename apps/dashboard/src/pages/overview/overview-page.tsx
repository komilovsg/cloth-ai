import { Card } from '../../shared/ui/card'
import { useOrdersQuery } from '../../shared/api/queries'
import { LuBanknote, LuClock3, LuCoins, LuShoppingCart } from 'react-icons/lu'

function Stat({
  label,
  value,
  icon,
  tint,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tint: string
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-neutral-200 dark:bg-neutral-950/60 dark:shadow-none dark:ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-normal text-neutral-900 dark:text-neutral-400">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{value}</div>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tint}`}>{icon}</div>
      </div>
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
        <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
          Заказы и активность магазина — быстрый снимок за сегодня.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Всего заказов"
          value={orders.isLoading ? '…' : String(total)}
          tint="bg-orange-500/20 text-orange-600 dark:text-orange-300"
          icon={<LuShoppingCart className="h-6 w-6" />}
        />
        <Stat
          label="Оплачено онлайн"
          value={orders.isLoading ? '…' : String(paid)}
          tint="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
          icon={<LuCoins className="h-6 w-6" />}
        />
        <Stat
          label="Резерв"
          value={orders.isLoading ? '…' : String(reserved)}
          tint="bg-violet-500/20 text-violet-700 dark:text-violet-200"
          icon={<LuClock3 className="h-6 w-6" />}
        />
        <Stat
          label="Оплата при получении"
          value={orders.isLoading ? '…' : String(cod)}
          tint="bg-amber-500/20 text-amber-800 dark:text-amber-200"
          icon={<LuBanknote className="h-6 w-6" />}
        />
      </div>

      <Card className="p-4">
        <div className="text-sm font-medium">Что дальше</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-normal text-neutral-900 dark:text-neutral-400">
          <li>Добавить товар через мастер «3 шага»</li>
          <li>Проверить генерации и опубликовать</li>
          <li>Отслеживать оплаты / резервы / наложку</li>
        </ul>
      </Card>
    </div>
  )
}
