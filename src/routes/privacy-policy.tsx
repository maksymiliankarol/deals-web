import { ChildLayout } from "../layouts/child-layout";

export function PrivacyPolicy() {
  const h1ClassName = "text-2xl font-bold py-4"
  const h2ClassName = "text-xl font-bold py-4"
  const listClassName = "list-disc pl-6 flex flex-col gap-2"

  return (
    <ChildLayout size="sm">
      <h1 className={h1ClassName}>Privacy Policy</h1>
      <p>
        Last updated: 27/11/2026. Controller: metalogrom.com, contact:
        deals@metalogrom.com.
      </p>

      <h2 className={h2ClassName}>What we process</h2>
      <ul className={listClassName}>
        <li>
          <b>Buyers: description, budget range, email and phone.</b> We store them to match
          your need with sellers and to hand your contact details to the one seller who pays
          to unlock them. Basis: performing the service you asked for.
        </li>
        <li>
          <b>Sellers: the description you search with.</b> It is stored only in your browser.
          We process it to find matches, but we don't save it.
        </li>
        <li>
          <b>Payments.</b> Handled by Stripe. We never see your card details. We keep the
          price paid, the date and Stripe's session id for the purchase record.
        </li>
        <li>
          <b>IP address.</b> We use it for rate limits and to stop abuse, and keep it with a
          checkout for as long as the listing exists (at most 3 days). It may also appear in
          short-lived server logs. Basis: our legitimate interest in security.
        </li>
        <li>
          <b>Bot check.</b> Cloudflare Turnstile checks that you are human, which involves
          browser and network signals processed by Cloudflare.
        </li>
      </ul>

      <h2 className={h2ClassName}>AI processing</h2>
      <p>
        Descriptions are sent to AI services to turn them into search vectors and to check
        that they don't contain contact details. Don't write personal data in a description.
      </p>

      <h2 className={h2ClassName}>Your browser</h2>
      <p>
        Sellers' listings and unlocked details are saved in your browser's local storage
        (unlocked details for 90 days). We use no cookies, analytics or advertising.
      </p>

      <h2 className={h2ClassName}>How long we keep it</h2>
      <ul className={listClassName}>
        <li>A posted need, including its email and phone, is deleted after 3 days, or when it is unlocked.</li>
        <li>After an unlock, the details are kept on our server for 24 hours, then deleted.</li>
      </ul>

      <h2 className={h2ClassName}>Who receives it</h2>
      <p>
        Buyers' email and phone go to the one seller who unlocks the listing. Our providers
        process data on our behalf: Cloudflare (hosting, storage, bot check, AI) and Stripe
        (payments), possibly outside your country under their standard safeguards. We don't
        sell data. Sellers who receive contact details become responsible for how they use
        them.
      </p>

      <h2 className={h2ClassName}>Your rights</h2>
      <p>
        You can ask to access, correct or delete your data, to object to processing, or to
        complain to your data protection authority. Since there are no accounts, tell us what
        you posted and when so we can find it, and we may ask you to confirm the email or phone.
        Write to deals@metalogrom.com.
      </p>

      <h2 className={h2ClassName}>Children and changes</h2>
      <p>
        Deals is not for people under 18. We may update this policy and will change the date
        above when we do.
      </p>
    </ChildLayout>
  );
}