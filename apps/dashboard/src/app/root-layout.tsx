import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { setAdminToken } from './auth-gate'
import {
  LuChevronLeft,
  LuChevronRight,
  LuLayoutDashboard,
  LuListOrdered,
  LuLogOut,
  LuMenu,
  LuMoon,
  LuPackage,
  LuPlus,
  LuSun,
  LuUsers,
  LuX,
} from 'react-icons/lu'
import { useToastStore } from '../shared/toast-store'
import { useDashboardPrefsStore } from '../features/dashboard-prefs-store'
import { useAuthMeQuery, useEndImpersonationMutation, useShopProfileQuery } from '../shared/api/queries'

const SIDEBAR_COLLAPSED_KEY = 'clothai_dash_sidebar_collapsed'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

function writeCollapsed(v: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, v ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function userInitials(email: string | null | undefined): string {
  const e = (email ?? '').trim().toLowerCase()
  if (!e) return '?'
  const local = e.split('@')[0] ?? e
  const parts = local.split(/[._\-+]+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0]!.slice(0, 1) + parts[1]!.slice(0, 1)).toUpperCase()
  }
  return local.slice(0, 2).toUpperCase() || '?'
}

function displayAccountLabel(email: string | null | undefined): string {
  const e = (email ?? '').trim()
  if (!e) return 'Аккаунт'
  const local = e.split('@')[0] ?? e
  return local.length > 28 ? `${local.slice(0, 26)}…` : local
}

function SidebarLink({
  to,
  icon,
  label,
  collapsed,
  light,
  onNavigate,
}: {
  to: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  light: boolean
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition',
          collapsed ? 'justify-center px-2' : 'px-3',
          isActive
            ? 'bg-violet-500 text-white shadow-sm ring-1 ring-violet-400/80'
            : light
              ? 'text-neutral-800 hover:bg-neutral-100'
              : 'text-neutral-200 hover:bg-white/5',
        ].join(' ')
      }
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

export function RootLayout() {
  const navigate = useNavigate()
  const toastMsg = useToastStore((s) => s.message)
  const theme = useDashboardPrefsStore((s) => s.theme)
  const setDashTheme = useDashboardPrefsStore((s) => s.setTheme)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsed)

  const shopProfile = useShopProfileQuery()
  const authMe = useAuthMeQuery()
  const endImpersonation = useEndImpersonationMutation()

  const light = theme === 'light'

  const showSellersNav =
    authMe.data?.role === 'super_admin' && authMe.data && !authMe.data.impersonation

  const closeMobile = () => setMobileSidebarOpen(false)

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

  const sidebarSurface = light
    ? 'border-neutral-200 bg-white'
    : 'border-white/10 bg-neutral-950'

  const headerBar = light ? 'border-neutral-200 bg-white/90' : 'border-white/10 bg-neutral-950/90'

  const initials = userInitials(authMe.data?.email ?? undefined)
  const accountLabel = displayAccountLabel(authMe.data?.email ?? undefined)

  const sidebarNav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
      <SidebarLink
        to="/"
        label="Обзор"
        icon={<LuLayoutDashboard className="h-5 w-5" />}
        collapsed={sidebarCollapsed}
        light={light}
        onNavigate={closeMobile}
      />
      <SidebarLink
        to="/orders"
        label="Заказы"
        icon={<LuListOrdered className="h-5 w-5" />}
        collapsed={sidebarCollapsed}
        light={light}
        onNavigate={closeMobile}
      />
      <SidebarLink
        to="/catalog"
        label="Каталог"
        icon={<LuPackage className="h-5 w-5" />}
        collapsed={sidebarCollapsed}
        light={light}
        onNavigate={closeMobile}
      />
      <SidebarLink
        to="/catalog/new"
        label="Добавить товар"
        icon={<LuPlus className="h-5 w-5" />}
        collapsed={sidebarCollapsed}
        light={light}
        onNavigate={closeMobile}
      />
      {showSellersNav && (
        <SidebarLink
          to="/sellers"
          label="Продавцы"
          icon={<LuUsers className="h-5 w-5" />}
          collapsed={sidebarCollapsed}
          light={light}
          onNavigate={closeMobile}
        />
      )}
    </nav>
  )

  return (
    <div className={[shell, 'flex'].join(' ')}>
      {toastMsg && (
        <div className="fixed left-1/2 top-4 z-[90] max-w-md -translate-x-1/2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl ring-1 ring-emerald-400/40">
          {toastMsg}
        </div>
      )}

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-200 lg:static lg:z-0',
          sidebarSurface,
          sidebarCollapsed ? 'lg:w-[76px]' : 'w-56 lg:w-56',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div
          className={[
            'flex items-center gap-2 border-b px-3 py-3',
            light ? 'border-neutral-200' : 'border-white/10',
          ].join(' ')}
        >
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Меню
              </div>
            </div>
          )}
          <button
            type="button"
            aria-label={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            className={
              light
                ? 'hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:inline-flex'
                : 'hidden rounded-lg p-2 text-neutral-300 hover:bg-white/5 lg:inline-flex'
            }
            onClick={() => {
              const next = !sidebarCollapsed
              setSidebarCollapsed(next)
              writeCollapsed(next)
            }}
          >
            {sidebarCollapsed ? (
              <LuChevronRight className="h-5 w-5" />
            ) : (
              <LuChevronLeft className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            aria-label="Закрыть"
            className={
              light
                ? 'rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden'
                : 'rounded-lg p-2 text-neutral-200 hover:bg-white/5 lg:hidden'
            }
            onClick={() => setMobileSidebarOpen(false)}
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {sidebarNav}
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
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

        <header className={['sticky top-0 z-30 border-b backdrop-blur', headerBar].join(' ')}>
          <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
            <button
              type="button"
              aria-label="Открыть меню"
              className={
                light
                  ? 'rounded-xl p-2 text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50 lg:hidden'
                  : 'rounded-xl p-2 text-neutral-200 ring-1 ring-white/10 hover:bg-neutral-900 lg:hidden'
              }
              onClick={() => setMobileSidebarOpen(true)}
            >
              <LuMenu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2">
              <img
                src="/brand/logo.jpg"
                alt="CLOTH.AI"
                className="h-9 w-9 shrink-0 rounded-xl bg-white object-contain ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10"
                loading="eager"
              />
              <span className="hidden truncate text-sm font-semibold tracking-tight sm:inline">
                CLOTH.AI Admin
              </span>
            </Link>

            <div className="flex flex-1 justify-end items-center gap-2">
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

              <Link
                to="/profile"
                className={
                  light
                    ? 'flex max-w-[min(100%,14rem)] items-center gap-2 rounded-xl px-2 py-1.5 ring-1 ring-neutral-200 hover:bg-neutral-50'
                    : 'flex max-w-[min(100%,14rem)] items-center gap-2 rounded-xl px-2 py-1.5 ring-1 ring-white/10 hover:bg-neutral-900'
                }
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-bold text-white shadow-sm"
                  aria-hidden
                >
                  {initials}
                </span>
                <span className="hidden min-w-0 flex-col text-left text-xs sm:flex">
                  <span className="truncate font-semibold leading-tight text-neutral-900 dark:text-neutral-50">
                    {accountLabel}
                  </span>
                  <span className="truncate text-[11px] font-normal text-neutral-500 dark:text-neutral-400">
                    Личный кабинет
                  </span>
                </span>
              </Link>

              <button
                type="button"
                aria-label="Выйти"
                title="Выйти"
                className={
                  light
                    ? 'rounded-xl p-2 text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100'
                    : 'rounded-xl p-2 text-neutral-300 ring-1 ring-white/10 hover:bg-neutral-900'
                }
                onClick={() => {
                  setAdminToken(null)
                  navigate('/login', { replace: true })
                }}
              >
                <LuLogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
