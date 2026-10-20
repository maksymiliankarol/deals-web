import Tile from "../components/tile"

export function Home() {
  return (
    <div className="max-w-3xl flex flex-col gap-8 py-4 md:py-16 p-4 mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <Tile to="/buy" title="Buy" className="bg-yellow" />
        <Tile to="/sell" title="Sell" className="bg-blue text-white" />
        <Tile to="/my-listings" title="My Listings" className="bg-blue text-white"/>
        <Tile to="/unlocked" title="Unlocked" className="bg-green text-white"/>
        <Tile to="/how-it-works" title="How It Works" className="bg-white text-black"/>
        <Tile to="/contact" title="Contact" className="bg-white text-black"/>
        <Tile to="https://metalogrom.com" title="Metalogrom" className="bg-offblack text-white"/>
      </div>
    </div>
  )
}