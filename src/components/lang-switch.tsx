import { langs, useLocale, type Lang } from "../locales";

export default function LangSwitch() {
  const { lang, setLang, t } = useLocale();

  return (
    <select
      className="lang-switch"
      value={lang}
      aria-label={t.layout.language}
      onChange={(e) => setLang(e.target.value as Lang)}
    >
      {langs.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}