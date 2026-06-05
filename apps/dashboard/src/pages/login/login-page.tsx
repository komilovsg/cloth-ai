import { useLayoutEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../../shared/ui/button'
import { dashboardLogin } from '../../shared/api/api-client'
import { queryKeys } from '../../shared/api/queries'

function isMockApiMode(): boolean {
  const raw = import.meta.env.VITE_API_MODE as string | undefined
  return raw?.toLowerCase() !== 'real'
}

export function LoginPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.classList.add('dark')
    document.body.style.backgroundColor = '#0a0a0a'
    document.body.style.color = '#fafafa'
    return () => {
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }
  }, [])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-4 text-neutral-50">
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-neutral-900/80 p-6 ring-1 ring-white/10">
        <div>
          <h1 className="text-lg font-semibold">CLOTH.AI Admin</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Вход по email и паролю. Первый супер-админ задаётся на backend через{' '}
            <span className="font-mono text-[11px]">SUPER_ADMIN_BOOTSTRAP_EMAIL</span> /{' '}
            <span className="font-mono text-[11px]">PASSWORD</span>. Режим mock: любые значения.
          </p>
        </div>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setPending(true)
            try {
              await dashboardLogin(email, password)
              qc.invalidateQueries({ queryKey: queryKeys.authMe() })
              navigate('/', { replace: true })
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Ошибка входа')
            } finally {
              setPending(false)
            }
          }}
        >
          <div className="grid gap-2">
            <label className="text-xs text-neutral-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-white/10"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-neutral-400">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-neutral-900 px-3 py-2 pr-9 text-sm ring-1 ring-white/10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                tabIndex={-1}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-xs text-red-400">{error}</div>}
          <Button type="submit" disabled={pending || !password || (!isMockApiMode() && !email.trim())}>
            {pending ? 'Вход…' : 'Войти'}
          </Button>
        </form>
        <div className="text-center text-xs text-neutral-500">
          <Link to="/forgot-password" className="text-violet-400 hover:underline">
            Забыли пароль?
          </Link>
        </div>
      </div>
    </div>
  )
}
