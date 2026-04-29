import { Navigate, useLocation } from 'react-router-dom'

const TOKEN_KEY = 'clothai_admin_jwt'

function getApiMode(): 'mock' | 'real' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (import.meta as any).env?.VITE_API_MODE?.toLowerCase()
  return raw === 'real' ? 'real' : 'mock'
}

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  if (getApiMode() !== 'real') return <>{children}</>
  if (!getAdminToken()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }
  return <>{children}</>
}
