import LangSwitch from "../components/lang-switch";
import { useLocale } from "../locales";

export default function Settings() {
  const { t } = useLocale();

  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>{t.settings.title}</h1>
          <p>{t.settings.intro}</p>
        </section>
        <LangSwitch />
      </div>
    </div>
  )
}