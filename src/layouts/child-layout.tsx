import { Link } from "react-router";
import ArrowBack from "../assets/arrow-back.svg?react";

type Size = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<Size, string> = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
};

interface ChildLayoutProps {
  children: React.ReactNode;
  size?: Size;
}

export function ChildLayout({ children, size = "md" }: ChildLayoutProps) {
  return (
    <div className={`${sizeClasses[size]} flex flex-col gap-4 mx-auto`}>
      <nav>
        <Link
          to="/"
          className="flex items-center gap-2 hover:underline"
        >
          <ArrowBack />
          <span>Back</span>
        </Link>
      </nav>
      {children}
    </div>
  );
}