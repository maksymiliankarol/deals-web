import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getErrorKind, getUnlocked, type ErrorKind, type Unlocked } from "../lib/api";
import { useLocale } from "../locales";

type State =
  | { status: "loading" }
  | { status: "done"; data: Unlocked }
  | { status: "error"; errorKind: ErrorKind };

// The webhook usually lands within a second; give it up to 30 s.
const POLL_MS = 2000;
const MAX_TRIES = 15;

export default function Unlocked() {
  const { t } = useLocale();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<State>(
    sessionId ? { status: "loading" } : { status: "error", errorKind: "notFound" },
  );

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        for (let i = 0; i < MAX_TRIES && !cancelled; i++) {
          const data = await getUnlocked(sessionId);
          if (cancelled) return;
          if (data) return setState({ status: "done", data });
          await new Promise((resolve) => setTimeout(resolve, POLL_MS));
        }
        if (!cancelled) setState({ status: "error", errorKind: "pending" });
      } catch (err) {
        if (!cancelled) setState({ status: "error", errorKind: getErrorKind(err) });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>{t.unlocked.title}</h1>
          <p>{t.unlocked.intro}</p>
        </section>

        {state.status === "loading" && <p role="status">{t.unlocked.loading}</p>}
        {state.status === "error" && <p role="alert">{t.errors[state.errorKind]}</p>}
        {state.status === "done" && (
          <div className="column sm">
            <p>
              <strong>{t.unlocked.description}:</strong> {state.data.description}
            </p>
            <p>
              <strong>{t.unlocked.email}:</strong>{" "}
              <a href={`mailto:${state.data.email}`}>{state.data.email}</a>
            </p>
            <p>
              <strong>{t.unlocked.phone}:</strong>{" "}
              <a href={`tel:${state.data.phone}`}>{state.data.phone}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}