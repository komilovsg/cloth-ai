import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { setAdminToken } from './auth-gate'
import {
  LuLayoutDashboard,
  LuListOrdered,
  LuMenu,
  LuMoon,
  LuPackage,
  LuPlus,
  LuStore,
  LuSun,
  LuUsers,
  LuX,
} from 'react-icons/lu'
import { useToastStore } from '../shared/toast-store'
import { useDashboardPrefsStore } from '../features/dashboard-prefs-store'
import { useAuthMeQuery, useEndImpersonationMutation, useShopProfileQuery } from '../shared/api/queries'

function NavItem({
  to,
  label,
  icon,
  light,
}: {
  to: string
  label: string
  icon: React.ReactNode
  light: boolean
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 transition',
          isActive
            ? 'bg-violet-500 text-white ring-violet-400'
            : light
              ? 'bg-white text-neutral-800 ring-neutral-200 hover:bg-neutral-50'
              : 'bg-neutral-950 text-neutral-200 ring-white/10 hover:bg-neutral-900',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={
              isActive ? 'text-white' : light ? 'text-neutral-600' : 'text-neutral-200'
            }
          >
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}

export function RootLayout() {
  const navigate = useNavigate()
  const toastMsg = useToastStore((s) => s.message)
  const theme = useDashboardPrefsStore((s) => s.theme)
  const setDashTheme = useDashboardPrefsStore((s) => s.setTheme)
  const [mobileNav, setMobileNav] = useState(false)
  const shopProfile = useShopProfileQuery()
  const authMe = useAuthMeQuery()
  const endImpersonation = useEndImpersonationMutation()

  const light = theme === 'light'

  const showSellersNav =
    authMe.data?.role === 'super_admin' && authMe.data && !authMe.data.impersonation
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    if (theme === 'light') {
      document.body.style.backgroundColor = '#fafafa'
      document.body.style.color = '#171717'
    } else {
      document.body.style.backgroundColor = '#0a0a0a'
      document.body.style.color = '#fafafa'
    }
    return () => {
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }
  }, [theme])

  const shell = light ? 'min-h-dvh bg-zinc-50 text-neutral-900' : 'min-h-dvh bg-neutral-950 text-neutral-50'
  const headerBar = light
    ? 'border-b border-neutral-200 bg-white/95 backdrop-blur'
    : 'border-b border-white/10 bg-neutral-950/80 backdrop-blur'

  const navLinks = (
    <>
      <NavItem to="/" label="Обзор" icon={<LuLayoutDashboard className="h-4 w-4" />} light={light} />
      <NavItem to="/orders" label="Заказы" icon={<LuListOrdered className="h-4 w-4" />} light={light} />
      <NavItem to="/catalog" label="Каталог" icon={<LuPackage className="h-4 w-4" />} light={light} />
      <NavItem to="/catalog/new" label="Добавить" icon={<LuPlus className="h-4 w-4" />} light={light} />
      <NavItem to="/shop" label="Магазин" icon={<LuStore className="h-4 w-4" />} light={light} />
      {showSellersNav && (
        <NavItem to="/sellers" label="Продавцы" icon={<LuUsers className="h-4 w-4" />} light={light} />
      )}
    </>
  )
  return (
    <div className={shell}>
      {toastMsg && (
        <div className="fixed left-1/2 top-4 z-[80] max-w-md -translate-x-1/2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl ring-1 ring-emerald-400/40">
          {toastMsg}
        </div>
      )}

      {authMe.data?.impersonation && (
        <div
          className={
            light
              ? 'border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-normal text-amber-950'
              : 'border-b border-amber-500/40 bg-amber-950/95 px-4 py-2 text-center text-xs font-normal text-amber-100'
          }
        >
          Вы действуете как магазин «{shopProfile.data?.shopName?.trim() || '…'}».{' '}
          <button
            type="button"
            className="font-semibold underline decoration-amber-600/70 underline-offset-2 hover:opacity-90 dark:decoration-amber-300/70"
            disabled={endImpersonation.isPending}
            onClick={() => endImpersonation.mutate()}
          >
            Выйти из режима продавца
          </button>
        </div>
      )}

      <header className={headerBar}>
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={shopProfile.data?.logoUrl || '/brand/logo.jpg'}
              alt={shopProfile.data?.shopName?.trim() || 'CLOTH.AI'}
              className="h-9 w-9 rounded-xl bg-white object-contain ring-1 ring-black/10 dark:ring-white/10"
              loading="eager"
            />
            <div className="text-sm font-semibold tracking-tight">Admin</div>
          </Link>

          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            {navLinks}
            <button
              type="button"
              className={
                light
                  ? 'rounded-xl p-2 text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100'
                  : 'rounded-xl p-2 text-neutral-300 ring-1 ring-white/10 hover:bg-neutral-900'
              }
              aria-label={light ? 'Тёмная тема' : 'Светлая тема'}
              onClick={() => setDashTheme(light ? 'dark' : 'light')}
            >
              {light ? <LuMoon className="h-4 w-4" /> : <LuSun className="h-4 w-4" />}
            </button>
            <button
              type="button"
              className={
                light
                  ? 'rounded-xl px-3 py-2 text-xs text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100'
                  : 'rounded-xl px-3 py-2 text-xs text-neutral-400 ring-1 ring-white/10 hover:bg-neutral-900'
              }
              onClick={() => {
                setAdminToken(null)
                navigate('/login', { replace: true })
              }}
            >
              Выход
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className={
                light
                  ? 'rounded-xl p-2 text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100'
                  : 'rounded-xl p-2 text-neutral-300 ring-1 ring-white/10 hover:bg-neutral-900'
              }
              aria-label={light ? 'Тёмная тема' : 'Светлая тема'}
              onClick={() => setDashTheme(light ? 'dark' : 'light')}
            >
              {light ? <LuMoon className="h-5 w-5" /> : <LuSun className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label="Меню"
              aria-expanded={mobileNav}
              className={
                light
                  ? 'rounded-xl p-2 ring-1 ring-neutral-200 hover:bg-neutral-100'
                  : 'rounded-xl p-2 ring-1 ring-white/10 hover:bg-neutral-900'
              }
              onClick={() => setMobileNav((v) => !v)}
            >
              {mobileNav ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileNav && (
          <div
            className={
              light
                ? 'border-t border-neutral-200 bg-white px-4 py-4 lg:hidden'
                : 'border-t border-white/10 bg-neutral-950 px-4 py-4 lg:hidden'
            }
          >
            <div className="flex flex-col gap-2">{navLinks}</div>
            <button
              type="button"
              className={
                light
                  ? 'mt-3 w-full rounded-xl py-3 text-sm text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50'
                  : 'mt-3 w-full rounded-xl py-3 text-sm text-neutral-300 ring-1 ring-white/10 hover:bg-neutral-900'
              }
              onClick={() => {
                setAdminToken(null)
                navigate('/login', { replace: true })
              }}
            >
              Выход
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
