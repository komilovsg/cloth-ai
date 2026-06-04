import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '../shared/ui/button'
import { usePrefsStore } from '../features/preferences/prefs-store'

function HangerIcon() {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      className="h-20 w-20 opacity-90"
      aria-hidden="true"
    >
      <path
        d="M50 8 C50 8 50 18 50 18 C36 18 20 26 20 40 C20 42 22 44 24 44 L76 44 C78 44 80 42 80 40 C80 26 64 18 50 18"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-400"
      />
      <circle cx="50" cy="7" r="4" stroke="currentColor" strokeWidth="3" className="text-violet-400" />
      <line x1="50" y1="3" x2="50" y2="11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-violet-500" />
      <rect x="20" y="44" width="60" height="3" rx="1.5" fill="currentColor" className="text-violet-500/40" />
    </svg>
  )
}

export function ErrorPage() {
  const error = useRouteError()
  const theme = usePrefsStore((s) => s.theme)

  const is404 = isRouteErrorResponse(error) && error.status === 404
  const isRouteError = isRouteErrorResponse(error)

  const shell =
    theme === 'light'
      ? 'min-h-dvh bg-gradient-to-b from-violet-50 via-white to-zinc-100 text-neutral-900'
      : 'min-h-dvh bg-neutral-950 text-neutral-50'

  return (
    <div className={shell}>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 pb-24 pt-12 text-center">

        {/* Animated hanger */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-2xl" />
          <div
            className="relative animate-[wiggle_3s_ease-in-out_infinite]"
            style={{
              animation: 'wiggle 3s ease-in-out infinite',
            }}
          >
            <HangerIcon />
          </div>
        </div>

        {/* 404 number */}
        {is404 && (
          <div className="relative mb-2 select-none">
            <span
              className="bg-gradient-to-br from-violet-400 via-fuchsia-400 to-violet-600 bg-clip-text text-8xl font-black tracking-tighter text-transparent"
              aria-hidden="true"
            >
              404
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          {is404 ? 'Страница не найдена' : 'Что-то пошло не так'}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {is404
            ? 'Этот товар или раздел не существует. Возможно, ссылка устарела.'
            : isRouteError
              ? `Ошибка ${error.status}: ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Неизвестная ошибка. Попробуй ещё раз.'}
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 w-full max-w-[16rem]">
          <Button onClick={() => window.location.assign('/')}>
            Вернуться в витрину
          </Button>
          {!is404 && (
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
          )}
        </div>

        {/* Decorative dots */}
        <div className="mt-12 flex gap-2 opacity-30" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-violet-500"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  )
}
