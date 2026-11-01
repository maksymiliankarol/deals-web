import type { Messages } from "./en";

const pl: Messages = {
  layout: { home: "Strona główna", buy: "Kupuję", sell: "Sprzedaję", language: "Język" },
  home: { title: "Strona główna" },
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
    add: "Dodaj ofertę",
    empty: "Nie masz jeszcze ofert.",
    findMatches: "Znajdź dopasowania",
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
  errors: {
    tooManyRequests: "Zbyt wiele żądań. Odczekaj minutę.",
    badRequest: "Sprawdź swoje dane i spróbuj ponownie.",
    generic: "Coś poszło nie tak. Spróbuj ponownie.",
  },
};

export default pl;