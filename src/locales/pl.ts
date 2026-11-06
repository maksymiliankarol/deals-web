import type { Messages } from "./en";

const pl: Messages = {
  languageName: "Polski",
  layout: { 
    home: "Strona główna", 
    buy: "Kupuję", 
    sell: "Sprzedaję", 
    settings: "Ustawienia",
    menu: "Menu",
    close: "Zamknij menu",
  },
  home: { 
    title: "Witaj w Deals", 
    intro: "TODO"
  },
  buy: {
    title: "Kupuję",
    intro: "Wypełnij poniższy formularz i opisz, czego szukasz.",
    phone: "Telefon",
    phoneHint: "Same cyfry, opcjonalny + na początku, od 7 do 15 cyfr",
    email: "E-mail",
    description: "Co chcesz kupić?",
    submit: "Wyślij",
    submitting: "Wysyłanie…",
    success: "Dziękujemy! Twoje zgłoszenie zostało zapisane.",
  },
  sell: {
    title: "Sprzedaję",
    intro: "Poniżej znajdziesz wszystkie swoje oferty. Kliknij „Szukaj”, aby zobaczyć, kto szuka tego, co oferujesz.",
    add: "Dodaj ofertę",
    empty: "Nie masz jeszcze ofert.",
    colNumber: "Nr",
    colDate: "Data",
    colDescription: "Opis",
    colMatches: "Dopasowania",
    colRemove: "Usuń",
    search: "Szukaj",
    unlock: "Odblokuj",
    remove: "Usuń",
    searching: "Szukanie…",
    noMatches: "Brak dopasowań.",
  },
  sellNew: {
    title: "Nowa oferta",
    text: "Co chcesz sprzedać?",
    save: "Zapisz",
    saveError: "Nie udało się zapisać oferty w tej przeglądarce.",
  },
  unlocked: {
    title: "Dane kontaktowe",
    intro: "Oto dane kontaktowe kupującego. Zachowaj link do tej strony: pokaże te dane ponownie.",
    loading: "Potwierdzanie płatności…",
    description: "Zgłoszenie",
    email: "E-mail",
    phone: "Telefon",
  },
  settings: {
    title: "Ustawienia",
    intro: "Dostosuj aplikację.",
    language: "Język",
  },
  errors: {
    tooManyRequests: "Zbyt wiele żądań. Odczekaj minutę.",
    badRequest: "Sprawdź swoje dane i spróbuj ponownie.",
    generic: "Coś poszło nie tak. Spróbuj ponownie.",
    unavailable: "To zgłoszenie jest już niedostępne.",
    notFound: "Nie znaleziono zakupu.",
    pending: "Płatność jest wciąż przetwarzana. Odśwież stronę za chwilę.",
  },
};

export default pl;