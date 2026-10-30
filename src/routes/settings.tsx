import { ChildLayout } from '../layouts/child-layout'
import { useI18n } from '../lib/i18n-context'
import { LANGUAGES, LANGUAGE_NAMES } from '../lib/locale'

export function Settings() {
  const { lang, setLang, t } = useI18n()

  return (
    <ChildLayout size="xs">
      <fieldset aria-describedby="language-hint" className="flex flex-col">
        <legend className="font-bold pb-4">{t.settings.language}</legend>

        {LANGUAGES.map((code) => (
          <label
            key={code}
            lang={code} // so screen readers pronounce each name in its own language
            className="flex items-center gap-2 py-2 cursor-pointer hover:brightness-75"
          >
            <input
              type="radio"
              name="language"
              value={code}
              checked={code === lang}
              onChange={() => setLang(code)}
              className="peer sr-only"
            />
            {/* the drawn radio: a ring that gets a yellow fill and a dot when checked */}
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-black bg-white peer-checked:bg-yellow after:size-2.5 after:rounded-full after:bg-black after:opacity-0 after:content-[''] peer-checked:after:opacity-100"
            />
            {LANGUAGE_NAMES[code]}
          </label>
        ))}
      </fieldset>
    </ChildLayout>
  )
}