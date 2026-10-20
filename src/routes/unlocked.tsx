import { useState } from "react"
import { Link } from "react-router"
import { ChildLayout } from "../layouts/child-layout"
import UnlockedCard from "../components/unlocked-card"
import { getUnlockedList } from "../lib/unlocked-storage"

export function Unlocked() {
  // Read once on mount; the route remounts on every visit.
  const [listings, setListings] = useState(getUnlockedList)

  function handleDeleted(sessionId: string) {
    setListings((prev) => prev.filter((l) => l.sessionId !== sessionId))
  }

  return (
    <ChildLayout>
      {listings.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p>You haven't unlocked any listings yet.</p>
          <Link
            to="/my-listings"
            className="px-4 py-2 bg-blue w-fit text-white border-2 border-black hover:brightness-75"
          >
            Unlock your first listing
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border-2 border-black bg-red p-4 text-white">
            <p>
              <strong>Important:</strong> Items below are stored in your browser.
              Make sure you've downloaded the PDF or saved the contact details for
              each one another way.
            </p>
          </div>
          {listings.map((listing) => (
            <UnlockedCard
              key={listing.sessionId}
              unlocked={listing}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </ChildLayout>
  )
}