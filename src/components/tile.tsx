import { Link } from "react-router";

interface TileProps {
  to: string
  title: string
  className?: string
}

const Tile = ({ to, title, className }: TileProps) => {
  return (
    <Link
      to={to}
      className={`aspect-square border-2 border-black flex items-center justify-center hover:brightness-75 px-4 ${className ?? ""}`}
    >
      <span
        className="min-w-0 text-xl sm:text-2xl md:text-3xl text-center wrap-break-word hyphens-auto"
      >
        {title}
      </span>
    </Link>
  );
};
 
export default Tile;