import { create } from 'zustand'

interface ToastState {
  message: string | null
  show: (message: string, ms?: number) => void
  hide: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message, ms = 3800) => {
    set({ message })
    window.setTimeout(() => set({ message: null }), ms)
  },
  hide: () => set({ message: null }),
}))
