export const LANGUAGES = ['en', 'pl'] as const
export type Lang = (typeof LANGUAGES)[number]

export const DEFAULT_LANG: Lang = 'en'

// each language written in itself, for the picker
export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: 'English',
  pl: 'Polski',
}

const COOKIE = 'herds_lang'
const MAX_AGE = 60 * 60 * 24 * 365 // one year, in seconds

const isLang = (value: unknown): value is Lang => LANGUAGES.includes(value as Lang)

// The language the user picked in settings, or null if they never did
export function getSavedLang(): Lang | null {
  try {
    const entry = document.cookie
      .split('; ')
      .find((part) => part.startsWith(`${COOKIE}=`))
    const value = entry ? decodeURIComponent(entry.slice(COOKIE.length + 1)) : null
    return isLang(value) ? value : null
  } catch {
    return null // cookies can be blocked
  }
}

// First browser language we support: "pl-PL" counts as "pl", the order of preference is kept
export function detectBrowserLang(): Lang {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of tags) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLang(base)) return base
  }
  return DEFAULT_LANG
}

// saved choice, then browser language, then English
export const getInitialLang = (): Lang => getSavedLang() ?? detectBrowserLang()

export function saveLang(lang: Lang) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${lang}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`
}