import { useEffect, useId, useRef } from "react"
import type { ReactNode } from "react"
import { useI18n } from "../lib/i18n-context"

interface DialogProps {
  open: boolean
  title: string
  children?: ReactNode
  confirmLabel: string
  confirmDisabled?: boolean
  cancelLabel?: string
  variant?: "default" | "danger"
  pending?: boolean
  onConfirm: () => void
  onClose: () => void
}

const CONFIRM_STYLES = {
  default: "bg-green text-white",
  danger: "bg-red text-white"
}

const Dialog = ({
  open,
  title,
  children,
  confirmLabel,
  confirmDisabled,
  cancelLabel,
  variant = "default",
  pending = false,
  onConfirm,
  onClose
}: DialogProps) => {
  const { t } = useI18n()
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // Keep the native dialog in sync with the `open` prop.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Note: no display classes (flex, grid...) on <dialog> itself, or it would
  // stay visible while closed. Layout lives on the inner div.
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Escape: native "cancel" fires first. Block it while a request is running.
      onCancel={(e) => {
        if (pending) e.preventDefault()
      }}
      // Fires after Escape and after dialog.close(), so state stays in sync.
      onClose={onClose}
      // Padding lives on the inner div, so a click that lands on the <dialog>
      // itself can only be a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onClose()
      }}
      className="m-auto w-full max-w-md border-2 border-black bg-white p-0 backdrop:bg-black/50"
    >
      <div className="flex flex-col gap-2 p-6">
        <h2 id={titleId} className="text-xl font-bold">{title}</h2>

        {children}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="bg-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
          >
            {cancelLabel ?? t.common.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending || confirmDisabled}
            className={`${CONFIRM_STYLES[variant]} px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default Dialog