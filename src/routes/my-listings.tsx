import { Link } from "react-router"
import { useState } from "react"
import { getSellListings } from "../lib/sell-storage"
import { formatDate } from "../lib/format"
import { useI18n } from "../lib/i18n-context"
import { ChildLayout } from "../layouts/child-layout"
import SellCard from "../components/sell-card"

export function MyListings() {
  const { t, lang } = useI18n()
  // Read once on mount; the route remounts on every visit, so it's always fresh.
  const [listings] = useState(getSellListings)

  return (
    <ChildLayout>
      {listings.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p>{t.myListings.empty}</p>
          <Link
            to="/sell"
            className="px-4 py-2 bg-blue w-fit text-white border-2 border-black hover:brightness-75"
          >
            {t.myListings.postFirst}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <SellCard
              key={listing.id}
              to={`/my-listings/${listing.id}`}
              description={listing.description}
              createdAt={t.myListings.created(formatDate(listing.createdAt, lang))}
            />
          ))}
          <Link
            to="/sell"
            className="px-4 py-2 bg-blue w-fit text-white border-2 border-black hover:brightness-75"
          >
            {t.myListings.addNew}
          </Link>
        </div>
      )}
    </ChildLayout>
  )
}