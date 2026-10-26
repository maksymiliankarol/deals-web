import { Link } from "react-router"
import { useState } from "react"
import { getSellListings } from "../lib/sell-storage"
import { dateFormat } from "../utils/format"
import { ChildLayout } from "../layouts/child-layout"
import SellCard from "../components/sell-card"

export function MyListings() {
  // Read once on mount; the route remounts on every visit, so it's always fresh.
  const [listings] = useState(getSellListings)

  return (
    <ChildLayout>
      {listings.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p>You haven't posted any listings yet.</p>
          <Link 
            to="/sell" 
            className="px-4 py-2 bg-blue w-fit text-white border-2 border-black hover:brightness-75"
          >
            Post your first listing
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <SellCard
              key={listing.id}
              to={`/my-listings/${listing.id}`}
              description={listing.description}
              createdAt={`Created: ${dateFormat.format(new Date(listing.createdAt))}`}
            />
          ))}
          <Link 
            to="/sell" 
            className="px-4 py-2 bg-blue w-fit text-white border-2 border-black hover:brightness-75"
          >
            Add new
          </Link>
        </div>
      )}
    </ChildLayout>
  )
}