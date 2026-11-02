import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { addListing } from "../lib/listings";
import { useLocale } from "../locales";

export default function SellNew() {
  const { t } = useLocale()
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = String(new FormData(e.currentTarget).get("text")).trim();

    if (!addListing(text)) {
      setError("Could not save the listing in this browser.");
      return;
    }
    navigate("/sell");
  }

  return (
    <>
      <section className="heading">
        <h1>{t.sellNew.title}</h1>
        <p>{t.sellNew.text}</p>
      </section>
      <form className="block block-medium" onSubmit={handleSubmit}>
        <label>
          <textarea 
            name="text" 
            required 
            minLength={10} 
            maxLength={500} 
            rows={4} 
          />
        </label>
        <button type="submit">Save</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  )
}