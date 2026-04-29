import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '../shared/ui/button'

export function ErrorPage() {
  const error = useRouteError()

  const message = (() => {
    if (isRouteErrorResponse(error)) {
      return `${error.status} ${error.statusText}`
    }
    if (error instanceof Error) return error.message
    return 'Unknown error'
  })()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 text-neutral-50">
      <h1 className="text-xl font-semibold tracking-tight">Ошибка</h1>
      <p className="mt-2 text-sm text-neutral-300">{message}</p>
      <div className="mt-4">
        <Button onClick={() => window.location.assign('/')}>На главную</Button>
      </div>
    </div>
  )
}

