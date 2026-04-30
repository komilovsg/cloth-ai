import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { LuMoon, LuSun, LuX } from 'react-icons/lu'
import { Button } from '../shared/ui/button'
import { usePrefsStore } from '../features/preferences/prefs-store'
import { t } from '../features/i18n/messages'

type Ctx = {
  openMenu: () => void
  closeMenu: () => void
}

const MenuDrawerContext = createContext<Ctx | null>(null)

export function useMenuDrawer() {
  const ctx = useContext(MenuDrawerContext)
  if (!ctx) throw new Error('useMenuDrawer requires MenuDrawerProvider')
  return ctx
}

export function MenuDrawerProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const openMenu = useCallback(() => setOpen(true), [])
  const closeMenu = useCallback(() => setOpen(false), [])

  const value = useMemo(() => ({ openMenu, closeMenu }), [openMenu, closeMenu])

  const theme = usePrefsStore((s) => s.theme)
  const locale = usePrefsStore((s) => s.locale)
  const setTheme = usePrefsStore((s) => s.setTheme)
  const setLocale = usePrefsStore((s) => s.setLocale)

  const sheetBg =
    theme === 'light'
      ? 'bg-white text-neutral-900 ring-neutral-200'
      : 'bg-neutral-950 text-neutral-50 ring-white/15'

  return (
    <MenuDrawerContext.Provider value={value}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closeMenu}
          />
          <aside
            className={[
              'relative flex h-full w-[min(88vw,320px)] flex-col gap-4 p-4 shadow-2xl ring-1',
              sheetBg,
            ].join(' ')}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">{t(locale, 'menuTitle')}</div>
              <button
                type="button"
                aria-label="Закрыть"
                className="rounded-xl p-2 ring-1 ring-current/15 hover:bg-black/5 dark:hover:bg-white/10"
                onClick={closeMenu}
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 text-sm">
              <Link to="/" className="rounded-xl px-3 py-2 ring-1 ring-black/10 hover:bg-black/[0.04] dark:ring-white/15 dark:hover:bg-white/10" onClick={closeMenu}>
                {t(locale, 'navCatalog')}
              </Link>
              <Link to="/cart" className="rounded-xl px-3 py-2 ring-1 ring-black/10 hover:bg-black/[0.04] dark:ring-white/15 dark:hover:bg-white/10" onClick={closeMenu}>
                {t(locale, 'navCart')}
              </Link>
              <Link to="/checkout" className="rounded-xl px-3 py-2 ring-1 ring-black/10 hover:bg-black/[0.04] dark:ring-white/15 dark:hover:bg-white/10" onClick={closeMenu}>
                {t(locale, 'navCheckout')}
              </Link>
              <Link to="/onboarding/avatar" className="rounded-xl px-3 py-2 ring-1 ring-black/10 hover:bg-black/[0.04] dark:ring-white/15 dark:hover:bg-white/10" onClick={closeMenu}>
                {t(locale, 'navAvatar')}
              </Link>
            </nav>

            <div className="space-y-2 rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.06]">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{t(locale, 'themeSection')}</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={theme === 'dark' ? 'primary' : 'secondary'}
                  className="flex-1 gap-2"
                  onClick={() => setTheme('dark')}
                >
                  <LuMoon className="h-4 w-4" />
                  {t(locale, 'themeDark')}
                </Button>
                <Button
                  type="button"
                  variant={theme === 'light' ? 'primary' : 'secondary'}
                  className="flex-1 gap-2"
                  onClick={() => setTheme('light')}
                >
                  <LuSun className="h-4 w-4" />
                  {t(locale, 'themeLight')}
                </Button>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.06]">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Язык / Забон</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={locale === 'ru' ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={() => setLocale('ru')}
                >
                  {t(locale, 'languageRu')}
                </Button>
                <Button
                  type="button"
                  variant={locale === 'tg' ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={() => setLocale('tg')}
                >
                  {t(locale, 'languageTg')}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </MenuDrawerContext.Provider>
  )
}
