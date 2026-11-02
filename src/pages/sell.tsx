import { Fragment, useState } from "react";
import { Link } from "react-router";
import { getErrorKind, searchBuys, type ErrorKind } from "../lib/api";
import { getListings, removeListing } from "../lib/listings";
import { useLocale } from "../locales";
import type { Match } from "../types";

type Search =
  | { listingId: string; status: "loading" }
  | { listingId: string; status: "done"; matches: Match[] }
  | { listingId: string; status: "error"; errorKind: ErrorKind };

export default function Sell() {
  const { t } = useLocale();
  const [listings, setListings] = useState(getListings);
  const [search, setSearch] = useState<Search | null>(null);

  async function findMatches(id: string, text: string) {
    setSearch({ listingId: id, status: "loading" });
    try {
      const matches = await searchBuys(text);
      setSearch({ listingId: id, status: "done", matches });
    } catch (err) {
      setSearch({ listingId: id, status: "error", errorKind: getErrorKind(err) });
    }
  }

  function handleRemove(id: string) {
    setListings(removeListing(id));
    if (search?.listingId === id) setSearch(null);
  }

  return (
  <>
    <section className="heading">
      <h1>{t.sell.title}</h1>
      <p>
        <Link to="/sell/new">{t.sell.add}</Link>
      </p>
    </section>

    {listings.length === 0 ? (
      <p>{t.sell.empty}</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>{t.sell.colNumber}</th>
            <th>{t.sell.colDate}</th>
            <th>{t.sell.colDescription}</th>
            <th>{t.sell.colMatches}</th>
            <th>{t.sell.colRemove}</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l, i) => (
            <Fragment key={l.id}>
              <tr>
                <td>{i + 1}</td>
                <td>{l.createdAt.slice(0, 10)}</td>
                <td>{l.text}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => findMatches(l.id, l.text)}
                    disabled={search?.status === "loading"}
                  >
                    {t.sell.findMatches}
                  </button>
                </td>
                <td>
                  <button type="button" onClick={() => handleRemove(l.id)}>
                    {t.sell.remove}
                  </button>
                </td>
              </tr>

              {search?.listingId === l.id && (
                <tr className="results">
                  <td colSpan={5}>
                    {search.status === "loading" && <p>{t.sell.searching}</p>}
                    {search.status === "error" && (
                      <p role="alert">{t.errors[search.errorKind]}</p>
                    )}
                    {search.status === "done" && search.matches.length === 0 && (
                      <p>{t.sell.noMatches}</p>
                    )}
                    {search.status === "done" && search.matches.length > 0 && (
                      <ol>
                        {search.matches.map((m) => (
                          <li key={m.id}>
                            {m.description} ({m.created_at.slice(0, 10)})
                          </li>
                        ))}
                      </ol>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    )}
  </>
);
}