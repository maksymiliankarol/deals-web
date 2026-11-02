import type { Lang } from "../locales";

// D1 returns "YYYY-MM-DD HH:MM:SS" in UTC with no zone, which browsers parse as local time
const parse = (s: string) =>
  new Date(/Z$|[+-]\d\d:\d\d$/.test(s) ? s : `${s.replace(" ", "T")}Z`);

export const formatDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(parse(iso));