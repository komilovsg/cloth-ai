import { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'

export function useTelegramInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      WebApp.ready()
      WebApp.expand()
      WebApp.setHeaderColor('#0a0a0a')
      WebApp.setBackgroundColor('#0a0a0a')
      WebApp.enableClosingConfirmation()
    } catch {
      // no-op: allows running in browser outside Telegram
    }
  }, [])
}

