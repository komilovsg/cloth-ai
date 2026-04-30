import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'light'
export type LocaleCode = 'ru' | 'tg'

interface PrefsState {
  theme: ThemeMode
  locale: LocaleCode
  setTheme: (theme: ThemeMode) => void
  setLocale: (locale: LocaleCode) => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      locale: 'ru',
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'clothai:tma-prefs-v1' },
  ),
)
