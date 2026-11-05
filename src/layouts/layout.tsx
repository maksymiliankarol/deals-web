import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../components/logo";
import { useLocale } from "../locales";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "current" : undefined;

export default function Layout() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="layout">
      <header>
        <Logo />
        <button className="menu-button" aria-expanded={open} onClick={() => setOpen(true)}>
          {t.layout.menu}
        </button>
        <nav className={open ? "open" : undefined}>
          <div className="menu-header">
            <span className="menu-header-label">{t.layout.menu}</span>
            <button className="menu-close" aria-label="Close" onClick={close}>
              ×
            </button>
          </div>
          <div className="menu-items">
            <NavLink className={navClass} to="/" end onClick={close}>{t.layout.home}</NavLink>
            <NavLink className={navClass} to="/buy" onClick={close}>{t.layout.buy}</NavLink>
            <NavLink className={navClass} to="/sell" onClick={close}>{t.layout.sell}</NavLink>
            <NavLink className={navClass} to="/settings" onClick={close}>{t.layout.settings}</NavLink>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}