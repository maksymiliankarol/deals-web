import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { addListing } from "../lib/listings";

export default function SellNew() {
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
      <h1>New listing</h1>
      <form onSubmit={handleSubmit}>
        <label>
          What do you have to sell?
          <textarea name="text" required minLength={10} maxLength={500} rows={4} />
        </label>
        <button type="submit">Save</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}