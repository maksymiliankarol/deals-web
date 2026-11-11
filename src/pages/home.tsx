import { useLocale } from "../locales";

const SITE = "https://metalogrom.com"

export default function Home() {
  const { t, lang } = useLocale();

  const sitePath = (path: string) =>
    `${SITE}${lang === "en" ? "" : `/${lang}`}${path}`;

  return (
    <div className="scroll">
      <div className="page md">
        <section className="heading">
          <h1>{t.home.title}</h1>
          <p>
            {t.home.intro}{" "}
            <a href="/buy">{t.home.buyLink}</a>{" "}
            {t.home.introPartTwo}{" "}
            <a href="/sell">{t.home.sellLink}</a>{" "}
            {t.home.introPartThree}
          </p>
        </section>
        <section>
          <ul>
            <li>
              <span>{t.home.contact}: </span>
              <a href="mailto:deals@metalogrom.com">
                deals@metalogrom.com
              </a>
            </li>
            <li>
              <a
                href={sitePath("/software/herds/terms")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.home.terms}
              </a>
            </li>
            <li>
              <a
                href={sitePath("/software/herds/privacy")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.home.privacy}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}