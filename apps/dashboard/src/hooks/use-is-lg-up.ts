import { useSyncExternalStore } from 'react'

const QUERY = '(min-width: 1024px)'

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot(): boolean {
  return true
}

/** true at lg breakpoint and above (Tailwind lg: 1024px). */
export function useIsLgUp(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
