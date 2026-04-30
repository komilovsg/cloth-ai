import { useLayoutEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../shared/ui/button'
import { passwordReset } from '../../shared/api/api-client'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = useMemo(() => (params.get('token') ?? '').trim(), [params])

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
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
          <h1 className="text-lg font-semibold">Новый пароль</h1>
          <p className="mt-1 text-xs text-neutral-400">Задайте новый пароль для входа в дашборд.</p>
        </div>
        {!token ? (
          <p className="text-sm text-red-400">Неверная или истёкшая ссылка (нет параметра token).</p>
        ) : done ? (
          <p className="text-sm text-neutral-300">
            Пароль обновлён.{' '}
            <button
              type="button"
              className="text-violet-400 underline"
              onClick={() => navigate('/login', { replace: true })}
            >
              Войти
            </button>
          </p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              setError(null)
              if (password.length < 8) {
                setError('Минимум 8 символов.')
                return
              }
              if (password !== password2) {
                setError('Пароли не совпадают.')
                return
              }
              setPending(true)
              try {
                await passwordReset(token, password)
                setDone(true)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка')
              } finally {
                setPending(false)
              }
            }}
          >
            <div className="grid gap-2">
              <label className="text-xs text-neutral-400">Новый пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-white/10"
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-neutral-400">Повтор пароля</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="rounded-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-white/10"
                autoComplete="new-password"
              />
            </div>
            {error && <div className="text-xs text-red-400">{error}</div>}
            <Button type="submit" disabled={pending}>
              {pending ? 'Сохранение…' : 'Сохранить пароль'}
            </Button>
          </form>
        )}
        <div className="text-center text-xs">
          <Link to="/login" className="text-violet-400 hover:underline">
            На страницу входа
          </Link>
        </div>
      </div>
    </div>
  )
}
