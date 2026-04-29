import WebApp from '@twa-dev/sdk'

export function openPaymentUrl(url: string) {
  // Prefer Telegram WebApp openLink when available
  try {
    WebApp.openLink(url)
    return
  } catch {
    // fallback below
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

