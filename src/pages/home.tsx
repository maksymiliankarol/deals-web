import { useLocale } from "../locales";

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="scroll">
      <div className="page md">
        <section className="heading">
          <h1>{t.home.title}</h1>
          <p>{t.home.intro}</p>
        </section>
      </div>
    </div>
  );
}