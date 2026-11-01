import { NavLink, Outlet } from "react-router";
import Logo from "../components/logo";
import LangSwitch from "../components/lang-switch";

export default function Layout() {
  return (
    <div className="layout">
      <header>
        <Logo />
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/buy">Buy</NavLink>
          <NavLink to="/sell">Sell</NavLink>
          <LangSwitch />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}