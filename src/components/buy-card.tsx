import { useState } from "react";
import { dateFormat, formatUsd, parseDbDate } from "../utils/format";
import { truncate } from "../utils/truncate";
import type { BuyMatch } from "../types";

const PREVIEW_LENGTH = 200;

interface BuyCardProps {
  match: BuyMatch;
  onClick: () => void;
}

const BuyCard = ({ match, onClick }: BuyCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const isLong = match.description.length > PREVIEW_LENGTH;
  const text =
    expanded || !isLong
      ? match.description
      : truncate(match.description, PREVIEW_LENGTH);

  return (
    <div 
      className="flex flex-col gap-2 border-2 bg-white p-4"
    >
      <div>
        <p className="whitespace-pre-wrap">{text}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 cursor-pointer font-bold underline"
          >
            {expanded ? "Show less" : "Read more..."}
          </button>
        )}
      </div>
      <p>
        Tier {match.tier} · Created:{" "}
        {dateFormat.format(parseDbDate(match.created_at))}
      </p>
      <p>Score: {match.score.toFixed(2)}</p>
      <button
        onClick={onClick}
        type="button"
        className="px-4 py-2 border-2 border-black bg-green text-white cursor-pointer hover:brightness-75"
      >
        Unlock for {formatUsd(match.price_cents)}
      </button>
    </div>
  );
};

export default BuyCard;