import { useState } from "react";
import type { SubmitEvent } from "react";
import { createBuy, getErrorKind, type ErrorKind } from "../lib/api";
import { useLocale } from "../locales";

type Status = "idle" | "submitting" | "success" | "error";

export default function Buy() {
  const { t } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    try {
      await createBuy({
        phone: String(data.get("phone")).trim(),
        email: String(data.get("email")).trim(),
        description: String(data.get("description")).trim(),
      });
      form.reset();
      setStatus("success");
    } catch (err) {
      setErrorKind(getErrorKind(err));
      setStatus("error");
    }
  }

  return (
    <>
      <section className="heading">
        <h1>{t.buy.title}</h1>
        <p>{t.buy.intro}</p>
      </section>
      <form className="block block-medium" onSubmit={handleSubmit}>
        <label>
          {t.buy.phone}*
          <input
            name="phone"
            type="tel"
            required
            pattern="\+?[0-9]{7,15}"
            title={t.buy.phoneHint}
          />
        </label>
        <label>
          {t.buy.email}*
          <input name="email" type="email" required />
        </label>
        <label>
          {t.buy.description}*
          <textarea
            name="description"
            required
            minLength={10}
            maxLength={500}
            rows={4}
          />
        </label>
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? t.buy.submitting : t.buy.submit}
        </button>
      </form>

      {status === "success" && <p role="status">{t.buy.success}</p>}
      {status === "error" && <p role="alert">{t.errors[errorKind]}</p>}
    </>
  );
}