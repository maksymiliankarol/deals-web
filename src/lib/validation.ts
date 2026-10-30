import type { Messages } from '../locales/en'

// A key into t.validation, so the UI decides the wording and language.
export type ValidationError = keyof Messages['validation']

// Client-side rules. They mirror the server's (valibot) rules, but the server
// stays the source of truth, so these only need to catch the obvious mistakes.
const MAX_DESCRIPTION = 500
const MAX_EMAIL = 254
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/

export function validateDescription(value: string): ValidationError | null {
  const v = value.trim()
  if (!v) return 'descriptionRequired'
  if (v.length > MAX_DESCRIPTION) return 'descriptionTooLong'
  return null
}

export function validateEmail(value: string): ValidationError | null {
  const v = value.trim()
  if (!v) return 'emailRequired'
  if (v.length > MAX_EMAIL || !EMAIL_PATTERN.test(v)) return 'emailInvalid'
  return null
}

export function validatePhone(value: string): ValidationError | null {
  const v = value.trim()
  if (!v) return 'phoneRequired'
  if (!PHONE_PATTERN.test(v)) return 'phoneInvalid'
  return null
}