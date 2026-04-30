import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../shared/ui/button'
import { adminLogin } from '../../shared/api/api-client'

export function LoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

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
          <p className="mt-1 text-xs text-neutral-400">Введите пароль API (ADMIN_PASSWORD).</p>
        </div>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setPending(true)
            try {
              await adminLogin(password)
              navigate('/', { replace: true })
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Ошибка входа')
            } finally {
              setPending(false)
            }
          }}
        >
          <div className="grid gap-2">
            <label className="text-xs text-neutral-400">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-white/10"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-xs text-red-400">{error}</div>}
          <Button type="submit" disabled={pending || !password}>
            {pending ? 'Вход…' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  )
}
