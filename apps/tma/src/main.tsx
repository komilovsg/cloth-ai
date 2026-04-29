import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import './index.css'
import App from './App'

// Снять нативный лоадер Telegram как можно раньше (до первого paint React).
try {
  WebApp.ready()
  WebApp.expand()
} catch {
  // Вне Mini App (обычный браузер) SDK может быть недоступен.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
