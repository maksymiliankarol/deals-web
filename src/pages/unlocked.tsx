import { useState } from "react";
import { formatDate } from "../lib/dates";
import { useLocale } from "../locales";
import { getSaved, removeSaved } from "../lib/unlocked";

const money = (amount: number, currency: string, lang: string) =>
  new Intl.NumberFormat(lang, { style: "currency", currency: currency.toUpperCase() })
    .format(amount / 100);

export default function Unlocked() {
  const { t, lang } = useLocale();
  const [saved, setSaved] = useState(getSaved);

  return (
    <div className="scroll">
      <div className="page xl">
        <section className="heading">
          <h1>{t.unlocked.title}</h1>
          <p>{t.unlocked.intro}</p>
        </section>

        {saved.length === 0 ? (
          <p>{t.unlocked.empty}</p>
        ) : (
          <div className="table-scroll">
            <table className="unlocked-table">
              <thead>
                <tr>
                  <th>{t.unlocked.colId}</th>
                  <th>{t.unlocked.colDate}</th>
                  <th>{t.unlocked.description}</th>
                  <th>{t.unlocked.email}</th>
                  <th>{t.unlocked.phone}</th>
                  <th>{t.unlocked.colPrice}</th>
                  <th>{t.unlocked.remove}</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{formatDate(s.unlocked_at, lang)}</td>
                    <td>{s.description}</td>
                    <td><a href={`mailto:${s.email}`}>{s.email}</a></td>
                    <td><a href={`tel:${s.phone}`}>{s.phone}</a></td>
                    <td>{money(s.price, s.currency, lang)}</td>
                    <td>
                      <button
                        type="button"
                        className="destructive"
                        onClick={() => setSaved(removeSaved(s.id))}
                      >
                        {t.unlocked.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}