import { langs, locales, useLocale } from "../locales";

export default function LangSwitch() {
  const { lang, setLang, t } = useLocale();

  return (
    <fieldset className="radio-group">
      <legend>{t.settings.language}</legend>
      {langs.map((l) => (
        <label key={l} className="radio">
          <input
            type="radio"
            name="lang"
            value={l}
            checked={l === lang}
            onChange={() => setLang(l)}
          />
          {locales[l].languageName}
        </label>
      ))}
    </fieldset>
  );
}