import { useSearchParams } from "react-router";
import { useLocale } from "../locales";

export default function CliSuccess() {
  const { t } = useLocale();
  const [params] = useSearchParams();
  const cancelled = params.has("cancelled");

  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>{cancelled ? t.cliSuccess.cancelledTitle : t.cliSuccess.title}</h1>
          <p>{cancelled ? t.cliSuccess.cancelledIntro : t.cliSuccess.intro}</p>
        </section>
      </div>
    </div>
  );
}