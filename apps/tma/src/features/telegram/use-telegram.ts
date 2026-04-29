import WebApp from '@twa-dev/sdk'

export function useTelegram() {
  if (typeof window === 'undefined') return null
  // In a regular browser (outside Telegram), Telegram WebApp APIs may be absent.
  const tg = WebApp as unknown as {
    BackButton?: unknown
    MainButton?: unknown
    initData?: unknown
  }
  const hasBackButton = !!tg.BackButton
  const hasMainButton = !!tg.MainButton
  const hasInitData = typeof tg.initData === 'string'

  if (!hasBackButton && !hasMainButton && !hasInitData) return null
  return WebApp
}

