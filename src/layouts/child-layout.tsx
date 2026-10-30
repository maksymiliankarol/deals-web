import { Link } from "react-router";
import ArrowBack from "../assets/arrow-back.svg?react";
import { useI18n } from "../lib/i18n-context";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<Size, string> = {
  xs: "max-w-xl",
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
  const { t } = useI18n()

  return (
    <div className={`${sizeClasses[size]} flex flex-col gap-4 mx-auto`}>
      <nav>
        <Link
          to="/"
          className="flex items-center gap-2 hover:underline"
        >
          <ArrowBack />
          <span>{t.common.back}</span>
        </Link>
      </nav>
      {children}
    </div>
  );
}