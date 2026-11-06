import { useState } from "react";
import { Link } from "react-router";
import { getErrorKind, searchBuys, startUnlock, type ErrorKind, type Match } from "../lib/api";
import { getListings, removeListing } from "../lib/listings";
import { useLocale } from "../locales";
import Truncate from "../components/truncate";
import { formatDate } from "../lib/dates";

type Search =
  | { listingId: string; status: "loading" }
  | { listingId: string; status: "done"; matches: Match[] }
  | { listingId: string; status: "error"; errorKind: ErrorKind };

export default function Sell() {
  const { t, lang } = useLocale();
  const [listings, setListings] = useState(getListings);
  const [search, setSearch] = useState<Search | null>(null);
  const [unlockingId, setUnlockingId] = useState<number | null>(null);
  const [unlockError, setUnlockError] = useState<ErrorKind | null>(null);

  async function findMatches(id: string, text: string) {
    setSearch({ listingId: id, status: "loading" });
    try {
      const matches = await searchBuys(text);
      setSearch({ listingId: id, status: "done", matches });
    } catch (err) {
      setSearch({ listingId: id, status: "error", errorKind: getErrorKind(err) });
    }
  }

  async function unlock(id: number) {
    setUnlockingId(id);
    setUnlockError(null);
    try {
      window.location.assign(await startUnlock(id));
    } catch (err) {
      setUnlockError(getErrorKind(err));
      setUnlockingId(null);
    }
  }

  function handleRemove(id: string) {
    setListings(removeListing(id));
    if (search?.listingId === id) setSearch(null);
  }

  const foundFor = search?.status === "done" && search.matches.length > 0 ? search.listingId : null;

  return (
    <div className="page xl scroll">
      <section className="heading">
        <h1>{t.sell.title}</h1>
        <p>{t.sell.intro}</p>
      </section>

      {listings.length === 0 ? (
        <p>{t.sell.empty}</p>
      ) : (
        <div className="table-scroll">
          <table className="sell-table">
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
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{formatDate(l.createdAt, lang)}</td>
                  <td>
                    <Truncate lines={3}>{l.text}</Truncate>
                  </td>
                  <td>
                    {foundFor !== l.id && (
                      <button
                        type="button"
                        onClick={() => findMatches(l.id, l.text)}
                        disabled={search?.status === "loading"}
                      >
                        {t.sell.search}
                      </button>
                    )}
                    {search?.listingId === l.id && (
                      <>
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
                              <li className="link" key={m.id}>
                                {m.description} ({formatDate(m.created_at, lang)})
                                <button
                                  type="button"
                                  className="success"
                                  disabled={unlockingId !== null}
                                  onClick={() => unlock(m.id)}
                                >
                                  {t.sell.unlock}
                                </button>
                              </li>
                            ))}
                          </ol>
                        )}
                      </>
                    )}
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="destructive" 
                      onClick={() => handleRemove(l.id)}
                    >
                      {t.sell.remove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>
      )}
      
      {unlockError && <p role="alert">{t.errors[unlockError]}</p>}
      <p>
        <Link to="/sell/new">{t.sell.add}</Link>
      </p>
    </div>
  );
}