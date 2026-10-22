import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { createBuy, ApiError } from '../lib/api'
import { validateDescription, validateEmail, validatePhone } from '../lib/validation'
import { TIER_BUDGETS } from '../utils/pricing'
import { ChildLayout } from '../layouts/child-layout'
import type { BuyPostedState } from '../types'
import Turnstile from '../components/turnstile'

const TIERS = [0, 1, 2, 3]
const LAST_STEP = 2

type Errors = Partial<Record<'description' | 'email' | 'phone', string>>

export function Buy() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [description, setDescription] = useState('')
  const [tier, setTier] = useState(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0) 

  function clearError(field: keyof Errors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // Validates only the fields shown on the current step.
  function validateStep(): Errors {
    const found: Errors = {}

    if (step === 0) {
      const msg = validateDescription(description)
      if (msg) found.description = msg
    }

    if (step === 2) {
      const emailMsg = validateEmail(email)
      if (emailMsg) found.email = emailMsg
      const phoneMsg = validatePhone(phone)
      if (phoneMsg) found.phone = phoneMsg
    }

    return found
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const found = validateStep()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    if (step < LAST_STEP) {
      setStep(step + 1)
      return
    }

    if (!token) {
      setError('Please wait for the verification to finish')
      return
    }

    setPending(true)
    try {
      const { id } = await createBuy({
        description: description.trim(),
        tier,
        email: email.trim(),
        phone: phone.trim()
      }, token)
      navigate("/buy/posted", {
        replace: true,
        state: { id, email, phone } satisfies BuyPostedState
      })
    } catch (err) {
      if (err instanceof ApiError && err.field === 'description') {
        setErrors({ description: err.message })
        setStep(0)
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setPending(false)
      // A token works once, whatever the outcome (including the 422 contact check)
      setToken(null)
      setResetKey((k) => k + 1)
    }
  }

  function handleBack() {
    setErrors({})
    setStep(step - 1)
  }

  return (
    <ChildLayout>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {step === 0 && (
          <div className="flex flex-col gap-2">
            <label className='font-bold'>Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                clearError('description')
              }}
              maxLength={500}
              rows={10}
              placeholder="What are you looking for?"
              autoFocus
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className="w-full border-2 p-3 bg-white resize-none"
            />
            {errors.description ? (
              <p id="description-error" className="text-error">{errors.description}</p>
            ) : (
              <p>
                Don't include contact details here. You'll add your email and phone on the last
                step, and they're shared only once someone unlocks your listing.
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-bold">What's your budget for this work?</legend>
            <div className="grid md:grid-cols-2 gap-2">
              {TIERS.map((t) => (
                <label
                  key={t}
                  className={`flex items-center justify-center border-2 p-4 text-center font-bold cursor-pointer hover:brightness-95 ${
                    tier === t ? 'bg-offblack border-black text-white' : 'bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={t}
                    checked={tier === t}
                    onChange={() => setTier(t)}
                    className="sr-only"
                  />
                  {TIER_BUDGETS[t]}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <div className='grid md:grid-cols-2 gap-2'>
            <div className="flex flex-col gap-2">
              <label className='font-bold'>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError('email')
                }}
                maxLength={254}
                placeholder="Email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full border-2 p-3 bg-white"
              />
              {errors.email && (
                <p id="email-error" className="text-error">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className='font-bold'>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  clearError('phone')
                }}
                placeholder="Phone"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className="w-full border-2 p-3 bg-white"
              />
              {errors.phone && (
                <p id="phone-error" className="text-error">{errors.phone}</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && <Turnstile onToken={setToken} resetKey={resetKey} />}

        <div className="flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={pending}
              className="bg-offwhite border-2 px-4 py-2 cursor-pointer hover:brightness-75 disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={pending || (step === LAST_STEP && !token)}
            className="bg-yellow text-black border-2 border-black px-4 py-2 cursor-pointer hover:brightness-75 disabled:opacity-50"
          >
            {step < LAST_STEP
              ? `Next Step (${step + 1}/${LAST_STEP + 1})`
              : pending
                ? 'Posting…'
                : 'Post'}
          </button>
        </div>

        {error && <p role="alert">{error}</p>}
      </form>
    </ChildLayout>
  )
}