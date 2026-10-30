import { ApiError, type ErrorCode } from './api'
import type { Messages } from '../locales/en'

// fallback: the screen's own wording for errors that aren't an ApiError
export function describeError(
  t: Messages,
  error: unknown,
  fallback: string = t.common.somethingWentWrong,
): string {
  if (!(error instanceof ApiError)) return fallback

  // Fails the build if a code has no text in en.ts
  const messages: Record<ErrorCode, string> = t.err3ors

  if (error.code && error.code in messages) return messages[error.code]
  if (error.status === 429) return messages.rate_limited
  if (error.status >= 500) return messages.internal
  return fallback
}