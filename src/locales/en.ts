const en = {
  languageName: "English",
  layout: { 
    home: "Home", 
    buy: "Buy", 
    sell: "Sell", 
    settings: "Settings",
    menu: "Menu",
    close: "Close menu",
  },  
  home: { 
    title: "Welcome at Deals", 
    intro: "TODO" 
  },
  buy: {
    title: "Buy",
    intro: "Fill out the form below and describe what you are looking for.",
    phone: "Phone",
    phoneHint: "Digits only, optional leading +, 7 to 15 digits",
    email: "Email",
    description: "What are you looking to buy?",
    submit: "Submit",
    submitting: "Sending…",
    success: "Thanks! Your request was saved.",
  },
  sell: {
    title: "Sell",
    intro: "Here are all your listings. Click 'Search' to see buyers looking for what you offer.",
    add: "Add a listing",
    empty: "No listings yet.",
    colNumber: "No.",
    colDate: "Date",
    colDescription: "Description",
    colMatches: "Matches",
    colRemove: "Remove",
    search: "Search",
    unlock: "Unlock",
    remove: "Remove",
    searching: "Searching…",
    noMatches: "No matches yet.",
  },
  sellNew: {
    title: "New listing",
    text: "What do you have to sell?",
    save: "Save",
    saveError: "Could not save the listing in this browser.",
  },
  unlocked: {
    title: "Contact details",
    intro: "Here is how to reach the buyer. Keep the link to this page: it shows these details again.",
    loading: "Confirming your payment…",
    description: "Request",
    email: "Email",
    phone: "Phone",
  },
  settings: {
    title: "Settings",
    intro: "Customize this app.",
    language: "Language",
  },
  errors: {
    tooManyRequests: "Too many requests. Please wait a minute.",
    badRequest: "Please check your details and try again.",
    generic: "Something went wrong. Please try again.",
    unavailable: "This request is no longer available.",
    notFound: "Purchase not found.",
    pending: "Your payment is still being processed. Refresh this page in a moment.",
  },
};

export type Messages = typeof en;
export default en;