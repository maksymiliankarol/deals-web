import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { addSellListing } from '../lib/sell-storage'
import { validateDescription } from '../lib/validation'
import { ChildLayout } from '../layouts/child-layout'

export function Sell() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const msg = validateDescription(description)
    setDescriptionError(msg)
    if (msg) return

    try {
      const listing = addSellListing(description.trim())
      navigate(`/my-listings/${listing.id}`, { replace: true })
    } catch {
      setError('Could not save the listing in this browser')
    }
  }

  return (
    <ChildLayout>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-bold">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setDescriptionError(null)
            }}
            maxLength={500}
            rows={10}
            placeholder="What are you selling?"
            autoFocus
            aria-invalid={!!descriptionError}
            aria-describedby={descriptionError ? 'description-error' : undefined}
            className="w-full border-2 p-3 bg-white resize-none"
          />
          {descriptionError && (
            <p id="description-error" className="text-error">{descriptionError}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue text-white border-2 border-black px-4 py-2 hover:brightness-75 cursor-pointer"
          >
            Post
          </button>
        </div>

        {error && <p role="alert">{error}</p>}
      </form>
    </ChildLayout>
  )
}