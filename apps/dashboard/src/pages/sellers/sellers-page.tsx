import { useState } from 'react'
import { Card } from '../../shared/ui/card'
import { Button } from '../../shared/ui/button'
import {
  useAuthMeQuery,
  useCreateSellerAdminMutation,
  useCreateSellerMutation,
  useImpersonateMutation,
  usePatchSellerMutation,
  useSellersQuery,
} from '../../shared/api/queries'
import { Navigate } from 'react-router-dom'

export function SellersPage() {
  const authMe = useAuthMeQuery()
  const [page, setPage] = useState(1)
  const sellers = useSellersQuery(page)
  const createSeller = useCreateSellerMutation()
  const patchSeller = usePatchSellerMutation()
  const impersonate = useImpersonateMutation()
  const createAdmin = useCreateSellerAdminMutation()

  const [shopName, setShopName] = useState('')
  const [slug, setSlug] = useState('')
  const [modalSellerId, setModalSellerId] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  if (authMe.isError) {
    return (
      <Card className="p-6 text-sm font-normal text-neutral-800 dark:text-neutral-200">
        Не удалось проверить права доступа. Обновите страницу или войдите снова.
      </Card>
    )
  }

  if (authMe.isLoading) {
    return (
      <Card className="p-6 text-sm font-normal text-neutral-700 dark:text-neutral-300">
        Проверяем права доступа…
      </Card>
    )
  }

  if (!authMe.data || authMe.data.role !== 'super_admin' || authMe.data.impersonation) {
    return <Navigate to="/" replace />
  }

  const rows = sellers.data?.items ?? []

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Продавцы</h1>
        <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
          Управление магазинами и вход администратора магазина. Доступно только супер-администратору платформы.
        </p>
      </header>

      <Card className="p-4">
        <div className="text-sm font-semibold">Новый магазин</div>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            placeholder="Название"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="min-w-[12rem] flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          <input
            placeholder="Slug (необязательно)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-44 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
          />
          <Button
            type="button"
            disabled={createSeller.isPending || !shopName.trim()}
            onClick={() =>
              createSeller.mutate(
                { shopName: shopName.trim(), slug: slug.trim() || undefined },
                {
                  onSuccess: () => {
                    setShopName('')
                    setSlug('')
                  },
                },
              )
            }
          >
            {createSeller.isPending ? 'Создание…' : 'Создать'}
          </Button>
        </div>
        {createSeller.isError && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            {(createSeller.error as Error)?.message ?? 'Ошибка'}
          </div>
        )}
      </Card>

      <Card className="overflow-hidden ring-1 ring-neutral-200 dark:ring-white/10">
        <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] touch-pan-x">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1fr_120px_140px_200px] gap-0 border-b border-neutral-200 bg-white px-4 py-3 text-xs font-medium text-neutral-900 dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-400">
              <div className="shrink-0">Магазин</div>
              <div className="shrink-0">Slug</div>
              <div className="shrink-0">Статус</div>
              <div className="shrink-0 text-right">Действия</div>
            </div>
            <div className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-transparent">
              {sellers.isLoading && (
                <div className="px-4 py-8 text-center text-sm text-neutral-700 dark:text-neutral-300">
                  Загрузка…
                </div>
              )}
              {sellers.isError && (
                <div className="px-4 py-8 text-center text-sm text-neutral-900 dark:text-neutral-200">
                  Не удалось загрузить список
                </div>
              )}
              {!sellers.isLoading &&
                !sellers.isError &&
                rows.map((r) => (
                  <div key={r.id} className="grid grid-cols-[1fr_120px_140px_200px] items-center gap-0 px-4 py-3">
                    <div className="min-w-0 shrink-0">
                      <div className="truncate text-sm font-medium">{r.shopName || '—'}</div>
                      <div className="mt-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">{r.id}</div>
                    </div>
                    <div className="shrink-0 text-sm text-neutral-800 dark:text-neutral-200">{r.slug ?? '—'}</div>
                    <div className="shrink-0 text-sm">{r.status}</div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        className="text-xs"
                        disabled={impersonate.isPending || r.status !== 'active'}
                        onClick={() => impersonate.mutate(r.id)}
                      >
                        Войти как
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        className="text-xs"
                        onClick={() => {
                          setModalSellerId(r.id)
                          setAdminEmail('')
                          setAdminPassword('')
                        }}
                      >
                        + Админ
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        className="text-xs"
                        disabled={patchSeller.isPending}
                        onClick={() =>
                          patchSeller.mutate({
                            sellerId: r.id,
                            status: r.status === 'active' ? 'suspended' : 'active',
                          })
                        }
                      >
                        {r.status === 'active' ? 'Приостановить' : 'Включить'}
                      </Button>
                    </div>
                  </div>
                ))}
              {!sellers.isLoading && !sellers.isError && rows.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-neutral-700 dark:text-neutral-300">
                  Пока нет магазинов — создайте первый блоком выше.
                </div>
              )}
            </div>
          </div>
        </div>
        {(sellers.data?.total ?? 0) > 50 && (
          <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3 dark:border-white/10">
            <Button
              variant="secondary"
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Назад
            </Button>
            <Button
              variant="secondary"
              type="button"
              disabled={page * 50 >= (sellers.data?.total ?? 0)}
              onClick={() => setPage((p) => p + 1)}
            >
              Далее
            </Button>
          </div>
        )}
      </Card>

      {modalSellerId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <Card className="w-full max-w-md space-y-3 p-5">
            <div className="text-sm font-semibold">Администратор магазина</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Создаётся пользователь с ролью seller_admin для выбранного магазина.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
            />
            <input
              type="password"
              placeholder="Пароль (мин. 8 символов)"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50"
            />
            {createAdmin.isError && (
              <div className="text-xs text-red-600 dark:text-red-400">
                {(createAdmin.error as Error)?.message ?? 'Ошибка'}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" type="button" onClick={() => setModalSellerId(null)}>
                Отмена
              </Button>
              <Button
                type="button"
                disabled={createAdmin.isPending || adminPassword.length < 8 || !adminEmail.trim()}
                onClick={() =>
                  createAdmin.mutate(
                    { email: adminEmail.trim(), password: adminPassword, sellerId: modalSellerId },
                    {
                      onSuccess: () => setModalSellerId(null),
                    },
                  )
                }
              >
                {createAdmin.isPending ? 'Создание…' : 'Создать'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
