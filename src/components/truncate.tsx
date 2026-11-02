import { useState, type ReactNode } from "react";

type Props = { lines?: number; children: ReactNode };

export default function Truncate({ lines = 2, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        cursor: "pointer",
        ...(!open && {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: lines,
          overflow: "hidden",
        }),
      }}
    >
      {children}
    </div>
  );
}