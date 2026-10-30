import type { Lang } from '../lib/locale'
import { en, type Messages } from './en'
import { pl } from './pl'

// Record<Lang, ...> fails the build if a language is added to LANGUAGES without messages
export const messages: Record<Lang, Messages> = { en, pl }