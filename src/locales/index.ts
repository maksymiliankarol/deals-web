import { useSyncExternalStore } from "react";
import en from "./en";
import pl from "./pl";

export const locales = { en, pl };
export type Lang = keyof typeof locales;
export const langs = Object.keys(locales) as Lang[];

const isLang = (value: string): value is Lang => Object.hasOwn(locales, value);

function detectLang(): Lang {
  const saved = document.cookie.match(/(?:^|; )lang=(\w+)/)?.[1];
  if (saved && isLang(saved)) return saved;

  return (
    navigator.languages
      .map((l) => l.slice(0, 2).toLowerCase())
      .find(isLang) ?? "en"
  );
}

let lang = detectLang();
document.documentElement.lang = lang;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setLang(next: Lang) {
  lang = next;
  document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = next;
  listeners.forEach((listener) => listener());
}

export function useLocale() {
  const current = useSyncExternalStore(subscribe, () => lang);
  return { lang: current, t: locales[current], setLang };
}