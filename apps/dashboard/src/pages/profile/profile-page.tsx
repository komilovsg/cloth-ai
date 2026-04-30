import { Card } from '../../shared/ui/card'
import { useAuthMeQuery } from '../../shared/api/queries'
import { ChangePasswordCard, ShopVitrineEditor } from './shop-profile-editor'

function roleLabel(role: string | undefined): string {
  if (role === 'super_admin') return 'Супер-администратор платформы'
  if (role === 'seller_admin') return 'Администратор магазина'
  return role ?? '—'
}

export function ProfilePage() {
  const authMe = useAuthMeQuery()
  const canEditVitrine = authMe.data?.role === 'seller_admin'

  if (authMe.isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 max-w-xl rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-40 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-52 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Личный кабинет</h1>
        <p className="mt-1 text-sm font-normal text-neutral-900 dark:text-neutral-400">
          Учётная запись и настройки безопасности. Витрина доступна только администратору конкретного магазина.
        </p>
      </header>

      <Card className="p-5">
        <div className="text-sm font-semibold">Аккаунт</div>
        <dl className="mt-3 space-y-2 text-sm font-normal">
          <div className="flex flex-wrap gap-2">
            <dt className="text-neutral-600 dark:text-neutral-400">Email</dt>
            <dd className="font-medium text-neutral-900 dark:text-neutral-100">
              {authMe.data?.email ?? '—'}
            </dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="text-neutral-600 dark:text-neutral-400">Роль</dt>
            <dd className="font-medium text-neutral-900 dark:text-neutral-100">
              {roleLabel(authMe.data?.role)}
              {authMe.data?.impersonation ? (
                <span className="ml-2 text-xs text-amber-700 dark:text-amber-300">(режим магазина)</span>
              ) : null}
            </dd>
          </div>
        </dl>
      </Card>

      {canEditVitrine ? (
        <ShopVitrineEditor />
      ) : (
        <Card className="p-5">
          <div className="text-sm font-semibold">Витрина магазина</div>
          <p className="mt-2 text-sm font-normal text-neutral-700 dark:text-neutral-400">
            Редактирование логотипа и описания доступно только администратору магазина. Как супер-администратор вы
            можете открыть раздел «Продавцы» и использовать «Войти как», чтобы управлять витриной выбранного магазина.
          </p>
        </Card>
      )}

      <ChangePasswordCard />
    </div>
  )
}
