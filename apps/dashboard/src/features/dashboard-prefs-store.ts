import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DashboardTheme = 'dark' | 'light'

interface DashPrefs {
  theme: DashboardTheme
  setTheme: (t: DashboardTheme) => void
}

export const useDashboardPrefsStore = create<DashPrefs>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'clothai:dashboard-theme-v1' },
  ),
)
