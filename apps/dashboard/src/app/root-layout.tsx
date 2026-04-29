import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { setAdminToken } from './auth-gate'
import { LuLayoutDashboard, LuListOrdered, LuPackage, LuPlus } from 'react-icons/lu'

function NavItem({
  to,
  label,
  icon,
}: {
  to: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 transition',
          isActive
            ? 'bg-violet-500 text-white ring-violet-400'
            : 'bg-neutral-950 text-neutral-200 ring-white/10 hover:bg-neutral-900',
        ].join(' ')
      }
    >
      <span className="text-neutral-200">{icon}</span>
      {label}
    </NavLink>
  )
}

export function RootLayout() {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50">
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/brand/logo.jpg"
              alt="CLOTH.AI"
              className="h-9 w-9 rounded-xl bg-white object-contain ring-1 ring-white/10"
              loading="eager"
            />
            <div className="text-sm font-semibold tracking-tight">Admin</div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <NavItem to="/" label="Обзор" icon={<LuLayoutDashboard className="h-4 w-4" />} />
            <NavItem to="/orders" label="Заказы" icon={<LuListOrdered className="h-4 w-4" />} />
            <NavItem to="/catalog" label="Каталог" icon={<LuPackage className="h-4 w-4" />} />
            <NavItem to="/catalog/new" label="Добавить" icon={<LuPlus className="h-4 w-4" />} />
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-xs text-neutral-400 ring-1 ring-white/10 hover:bg-neutral-900"
              onClick={() => {
                setAdminToken(null)
                navigate('/login', { replace: true })
              }}
            >
              Выход
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

