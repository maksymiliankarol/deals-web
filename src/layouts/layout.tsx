import { NavLink, Outlet } from "react-router";
import Logo from "../components/logo";
import LangSwitch from "../components/lang-switch";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "current" : undefined;

export default function Layout() {
  return (
    <div className="layout">
      <header>
        <Logo />
        <nav>
          <NavLink className={navClass} to="/" end>Home</NavLink>
          <NavLink className={navClass} to="/buy">Buy</NavLink>
          <NavLink className={navClass} to="/sell">Sell</NavLink>
          <LangSwitch />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}