import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { useMemo } from 'react'
import { router } from './app/router'
import { useTelegramInit } from './features/telegram/use-telegram-init'

export default function App() {
  useTelegramInit()

  const queryClient = useMemo(() => new QueryClient(), [])
  //...

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
