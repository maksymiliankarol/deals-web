// Client-side rules. They mirror the server's (valibot) rules, but the server
// stays the source of truth, so these only need to catch the obvious mistakes.

export function validateDescription(value: string): string | null {
  const v = value.trim()
  if (!v) return 'Please add a description'
  if (v.length > 500) return 'Keep it under 500 characters'
  return null
}

export function validateEmail(value: string): string | null {
  const v = value.trim()
  if (!v) return 'Email is required'
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return 'Enter a valid email address'
  }
  return null
}

export function validatePhone(value: string): string | null {
  const v = value.trim()
  if (!v) return 'Phone is required'
  if (!/^\+?[0-9 ()-]{7,20}$/.test(v)) {
    return 'Enter a valid phone number (7 to 20 digits, spaces, + ( ) -)'
  }
  return null
}