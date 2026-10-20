import { Link } from "react-router";

interface SellCardProps {
  description: string
  createdAt: string
  to: string
}

const SellCard = ({ description, createdAt, to }: SellCardProps) => {
  return ( 
    <Link 
      to={to}
      className="flex flex-col gap-2 border-2 bg-white p-4 cursor-pointer hover:brightness-75"
    >
      <p className="line-clamp-3">{description}</p>
      <p>{createdAt}</p>
    </Link>
   );
}
 
export default SellCard;