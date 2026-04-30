import { useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../shared/ui/button'
import { passwordForgot } from '../../shared/api/api-client'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
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
          <h1 className="text-lg font-semibold">Забыли пароль</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Укажите email аккаунта. Если он есть в системе, мы отправим ссылку для сброса пароля (при настроенной почте на
            сервере).
          </p>
        </div>
        {sent ? (
          <p className="text-sm text-neutral-300">
            Если адрес найден, письмо со ссылкой отправлено. Проверьте почту и папку «Спам».
          </p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              setError(null)
              setPending(true)
              try {
                await passwordForgot(email)
                setSent(true)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка')
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
            {error && <div className="text-xs text-red-400">{error}</div>}
            <Button type="submit" disabled={pending || !email.trim()}>
              {pending ? 'Отправка…' : 'Отправить ссылку'}
            </Button>
          </form>
        )}
        <div className="text-center text-xs">
          <Link to="/login" className="text-violet-400 hover:underline">
            Назад ко входу
          </Link>
        </div>
      </div>
    </div>
  )
}
