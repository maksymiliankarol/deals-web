import { createBrowserRouter } from "react-router";
import Layout from "./layouts/layout";
import Home from "./pages/home";
import Buy from "./pages/buy";
import Sell from "./pages/sell";
import SellNew from "./pages/sell-new";
import Settings from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "buy", Component: Buy },
      { path: "sell", Component: Sell },
      { path: "sell/new", Component: SellNew },
      { path: "settings", Component: Settings }
    ],
  },
]);