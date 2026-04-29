import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useCartStore } from '../features/cart/cart-store'
import { useTelegram } from '../features/telegram/use-telegram'
import { IconButton } from '../shared/ui/icon-button'
import { LuArrowLeft, LuShoppingBag } from 'react-icons/lu'

export function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useCartStore((s) => s.items.length)
  const tg = useTelegram()

  useEffect(() => {
    if (!tg?.BackButton) return

    const handleBack = () => navigate(-1)
    tg.BackButton.isVisible = location.pathname !== '/'
    tg.BackButton.offClick(handleBack)
    tg.BackButton.onClick(handleBack)

    return () => {
      tg.BackButton.offClick(handleBack)
    }
  }, [location.pathname, navigate, tg])

  useEffect(() => {
    if (!tg?.MainButton) return

    const handleCart = () => navigate('/cart')
    tg.MainButton.setParams({
      is_visible: location.pathname !== '/cart' && cartCount > 0,
      text: cartCount > 0 ? `Корзина (${cartCount})` : 'Корзина',
    })
    tg.MainButton.offClick(handleCart)
    tg.MainButton.onClick(handleCart)

    return () => {
      tg.MainButton.offClick(handleCart)
    }
  }, [cartCount, location.pathname, navigate, tg])

  const showBack = location.pathname !== '/'
  const showCartFab = cartCount > 0 && location.pathname !== '/cart'
  const title =
    location.pathname === '/cart'
      ? 'Корзина'
      : location.pathname === '/checkout'
        ? 'Оформление'
        : location.pathname.startsWith('/product/')
          ? 'Товар'
          : location.pathname.startsWith('/order/')
            ? 'Заказ'
            : location.pathname === '/onboarding/avatar'
              ? 'Типаж'
              : 'CLOTH.AI'

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50">
      <main className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        {showBack && (
          <div className="sticky top-0 z-10 -mx-4 mb-4 bg-neutral-950/80 px-4 pb-3 pt-2 backdrop-blur">
            <div className="flex items-center gap-3">
              <IconButton
                aria-label="Назад"
                onClick={() => navigate(-1)}
                className="shrink-0"
              >
                <LuArrowLeft className="h-5 w-5" />
              </IconButton>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold tracking-tight">
                  {title}
                </div>
              </div>
              <div className="w-9 shrink-0" />
            </div>
          </div>
        )}
        <Outlet />
      </main>

      {showCartFab && (
        <div className="fixed bottom-5 right-5 z-20">
          <Link to="/cart" aria-label={`Корзина (${cartCount})`}>
            <div className="relative">
              <IconButton variant="primary" className="rounded-2xl p-4 shadow-xl">
                <LuShoppingBag className="h-6 w-6" />
              </IconButton>
              <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-50 px-2 text-xs font-semibold text-neutral-950 ring-2 ring-neutral-950">
                {cartCount}
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

