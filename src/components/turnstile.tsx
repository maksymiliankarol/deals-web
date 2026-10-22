import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

let scriptPromise: Promise<void> | null = null

function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null // allow a retry on the next mount
      reject(new Error("Could not load Turnstile"))
    }
    document.head.append(script)
  })
  return scriptPromise
}

interface TurnstileProps {
  // A fresh token, or null when there isn't a valid one (expired, error, reset, unmounted).
  onToken: (token: string | null) => void
  // Bump to request a new token. A token can only be used once.
  resetKey?: number
}

const Turnstile = ({ onToken, resetKey = 0 }: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  })

  useEffect(() => {
    let cancelled = false

    loadScript()
      .then(() => {
        const container = containerRef.current
        if (cancelled || !container || !window.turnstile) return

        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: SITE_KEY,
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null)
        })
      })
      .catch(() => onTokenRef.current(null))

    return () => {
      cancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
      widgetIdRef.current = null
      onTokenRef.current(null)
    }
  }, [])

  useEffect(() => {
    if (resetKey === 0 || !widgetIdRef.current) return
    window.turnstile?.reset(widgetIdRef.current)
  }, [resetKey])

  return <div ref={containerRef} />
}

export default Turnstile