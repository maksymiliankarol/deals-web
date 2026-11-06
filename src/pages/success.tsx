import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { getErrorKind, getUnlocked, type ErrorKind, type Unlocked } from "../lib/api";
import { useLocale } from "../locales";
import { saveUnlocked } from "../lib/unlocked";

type State =
  | { status: "loading" }
  | { status: "done"; data: Unlocked }
  | { status: "error"; errorKind: ErrorKind };

const POLL_MS = 2000;
const MAX_TRIES = 15;

// One request per session id, shared across effect re-runs (StrictMode).
const requests = new Map<string, Promise<Unlocked>>();

function fetchOnce(sessionId: string): Promise<Unlocked> {
  let p = requests.get(sessionId);
  if (!p) {
    p = (async () => {
      for (let i = 0; i < MAX_TRIES; i++) {
        const data = await getUnlocked(sessionId);
        if (data) return data;
        await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      }
      throw Object.assign(new Error("pending"), { pending: true });
    })();
    requests.set(sessionId, p);
  }
  return p;
}

export default function Success() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    fetchOnce(sessionId)
      .then((data) => {
        saveUnlocked(data); // before the cancelled check, on purpose
        if (cancelled) return;
        setState({ status: "done", data });
        navigate("/success", { replace: true }); // drop session_id from the URL
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ status: "error", errorKind: err?.pending ? "pending" : getErrorKind(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  // Opened without a session (e.g. a reload after the reveal): nothing to reveal here
  if (!sessionId && state.status === "loading") return <Navigate to="/unlocked" replace />;

  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>{t.success.title}</h1>
          <p>{t.success.intro}</p>
        </section>

        {state.status === "loading" && <p role="status">{t.success.loading}</p>}
        {state.status === "error" && <p role="alert">{t.errors[state.errorKind]}</p>}
        {state.status === "done" && (
          <div className="column sm">
            <p><strong>{t.success.description}:</strong> {state.data.description}</p>
            <p>
              <strong>{t.success.email}:</strong>{" "}
              <a href={`mailto:${state.data.email}`}>{state.data.email}</a>
            </p>
            <p>
              <strong>{t.success.phone}:</strong>{" "}
              <a href={`tel:${state.data.phone}`}>{state.data.phone}</a>
            </p>
            <p><Link to="/unlocked">{t.success.viewSaved}</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}