import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LANGS, translations } from '../i18n/translations'
import type { LangCode, Translations } from '../i18n/translations'

const LS_KEY = 'clothai_lang'

function detectLang(): LangCode {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved && LANGS.some((l) => l.code === saved)) return saved as LangCode
    const browser = navigator.language.slice(0, 2).toLowerCase()
    if (browser === 'tg') return 'tg'
    if (browser === 'en') return 'en'
  } catch {}
  return 'ru'
}

interface I18nContextValue {
  lang: LangCode
  t: Translations
  setLang: (l: LangCode) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectLang)

  const setLang = useCallback((l: LangCode) => {
    setLangState(l)
    try { localStorage.setItem(LS_KEY, l) } catch {}
    document.documentElement.lang = l
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18nContextValue>(
    () => ({ lang, t: translations[lang], setLang }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
