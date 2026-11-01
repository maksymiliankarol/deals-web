const en = {
  layout: { home: "Home", buy: "Buy", sell: "Sell", language: "Language" },  
  home: { title: "Home" },
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
    add: "Add a listing",
    empty: "No listings yet.",
    findMatches: "Find matches",
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
  errors: {
    tooManyRequests: "Too many requests. Please wait a minute.",
    badRequest: "Please check your details and try again.",
    generic: "Something went wrong. Please try again.",
  },
};

export type Messages = typeof en;
export default en;