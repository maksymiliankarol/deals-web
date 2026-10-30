import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/root-layout";
import { ErrorPage } from "./routes/error-page";
import { NotFound } from "./routes/not-found";
import { Home } from "./routes/home";
import { Sell } from "./routes/sell";
import { MyListings } from "./routes/my-listings";
import { MyListing } from "./routes/my-listing";
import { Buy } from "./routes/buy";
import { Contact } from "./routes/contact";
import { HowItWorks } from "./routes/how-it-works";
import { UnlockSuccess } from "./routes/unlock-success";
import { Unlocked } from "./routes/unlocked";
import { BuyPosted } from "./routes/buy-posted";
import { TermsOfService } from "./routes/terms-of-service";
import { PrivacyPolicy } from "./routes/privacy-policy";
import { Policies } from "./routes/policies";
import { Settings } from "./routes/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Home /> },
          { path: "sell", element: <Sell /> },
          { path: "my-listings", element: <MyListings /> },
          { path: "my-listings/:id", element: <MyListing /> },
          { path: "buy", element: <Buy /> },
          { path: "buy/posted", element: <BuyPosted /> },
          { path: "unlock/success", element: <UnlockSuccess /> },
          { path: "unlocked", element: <Unlocked /> },
          { path: "settings", element: <Settings /> },
          { path: "contact", element: <Contact /> },
          { path: "how-it-works", element: <HowItWorks /> },
          { path: "policies", element: <Policies /> },
          { path: "terms-of-service", element: <TermsOfService /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
          { path: "*", element: <NotFound /> }
        ]
      }
    ]
  }
])