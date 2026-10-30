import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext } from '../lib/i18n-context'
import { getInitialLang, saveLang, type Lang } from '../lib/locale'
import { messages } from '../locales'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  // keep <html lang> in sync (screen readers, hyphenation, browser translation prompts)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      t: messages[lang],
      // only an explicit choice is saved; until then the browser language applies
      setLang: (next: Lang) => {
        saveLang(next)
        setLangState(next)
      },
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}