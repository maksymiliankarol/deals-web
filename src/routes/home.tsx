import { Link } from "react-router";

const tile =
  "flex items-center justify-center text-center p-2 border-2 border-black " +
  "hover:brightness-75 focus-visible:brightness-75 focus-visible:outline-4 " +
  "focus-visible:outline-offset-2 focus-visible:outline-black";

type Tile = {
  label: string;
  to: string;
  className: string;
  external?: boolean;
};

const tiles: Tile[] = [
  { label: "Buy", to: "/buy", className: "col-span-2 md:row-span-2 text-2xl md:text-5xl bg-yellow text-black" },
  { label: "Sell", to: "/sell", className: "col-span-2 text-2xl md:text-3xl bg-blue text-white" },
  { label: "My Listings", to: "/my-listings", className: "text-xl bg-blue text-white" },
  { label: "Unlocked", to: "/unlocked", className: "text-xl bg-green text-white" },
  { label: "How It Works", to: "/how-it-works", className: "text-xl bg-white text-black" },
  { label: "Contact", to: "/contact", className: "text-xl bg-white text-black" },
  { label: "Terms", to: "/terms-of-service", className: "text-xl bg-white text-black" },
  { label: "Privacy", to: "/privacy-policy", className: "text-xl bg-white text-black" },
  { label: "Metalogrom", to: "https://metalogrom.com", className: "col-span-2 md:col-span-4 text-2xl md:text-3xl bg-offblack text-white", external: true },
];

export function Home() {
  return (
    <div className="max-w-3xl flex flex-col gap-8 md:py-16 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-32 gap-4">
        {tiles.map(({ label, to, className, external }) =>
          external ? (
            <a
              key={to}
              href={to}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tile} ${className}`}
            >
              {label}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ) : (
            <Link key={to} to={to} className={`${tile} ${className}`}>
              {label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}