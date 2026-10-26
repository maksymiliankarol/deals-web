import { ChildLayout } from "../layouts/child-layout";

export function TermsOfService() {
  const h1ClassName = "text-2xl font-bold py-4"
  const h2ClassName = "text-xl font-bold py-4"
  const listClassName = "list-disc pl-6 flex flex-col gap-2"

  return (
    <ChildLayout size="sm">
      <h1 className={h1ClassName}>Terms of Service</h1>
      <p>
        Last updated: [date]. Deals is operated by [operator name, address, country] ("we").
        By using it you accept these terms.
      </p>

      <h2 className={h2ClassName}>What Deals is</h2>
      <p>
        Buyers post what they need, with a budget range and contact details. Sellers search
        for matching needs and pay to unlock a buyer's email and phone. We only make the
        introduction. We are not a party to any deal between you and another user, and we
        don't verify anyone or guarantee that a deal will happen.
      </p>

      <h2 className={h2ClassName}>Posting a need (buyers)</h2>
      <ul className={listClassName}>
        <li>You must be at least 18 and the details must be yours and accurate.</li>
        <li>
          The description is visible to sellers who search. Your email and phone are shown
          only to the one seller who unlocks your listing. Don't put contact details in the
          description.
        </li>
        <li>A listing expires after 3 days, or when it is unlocked, whichever comes first.</li>
        <li>Buyers pay nothing and can't edit or delete a listing after posting.</li>
      </ul>

      <h2 className={h2ClassName}>Unlocking a need (sellers)</h2>
      <ul className={listClassName}>
        <li>The price is shown before you pay and depends on the buyer's budget range.</li>
        <li>
          Payment is processed by Stripe. After payment you get the buyer's email and phone
          immediately, and nobody else can unlock the same listing.
        </li>
        <li>
          Save or download the details right away. We keep them for 24 hours after purchase,
          and your browser keeps a copy for 90 days unless you clear it.
        </li>
        <li>Use the contact details only to respond to that need, not for spam or resale.</li>
      </ul>

      <h2 className={h2ClassName}>Refunds</h2>
      <p>
        The unlocked details are digital content delivered immediately. By paying, you ask us
        to deliver them right away and, if you are a consumer in the EU/UK, you acknowledge
        that you lose your right of withdrawal once they are delivered. Unlocks are final,
        because we can't know whether a buyer will answer. The exceptions are: the details were
        not delivered to you, or they are technically unusable and you can show it (for example,
        the bounce message of an email, or a screenshot of the call that failed because the
        number is not in service). We don't refund because a buyer didn't answer, said they
        didn't post the need, chose another seller, changed their mind or found another solution.
        We decide each request after reviewing the evidence and may refuse requests that look
        abusive, for example if the details were used successfully. To ask, write to
        deals@metalogrom.com within 14 days with the date and amount of your purchase and your
        evidence. Approved refunds go back to the original payment method.
      </p>
      <h2 className={h2ClassName}>Not allowed</h2>
      <ul className={listClassName}>
        <li>Illegal requests or offers, fraud, harassment or hate speech.</li>
        <li>Posting other people's details, or listings you don't intend to fulfil.</li>
        <li>Spam, scraping, automated use, or trying to bypass the limits of the service.</li>
      </ul>
      <p>
        We may remove listings or block access at any time. To report a listing, write to
        deals@metalogrom.com.
      </p>

      <h2 className={h2ClassName}>No guarantees</h2>
      <p>
        Deals is provided "as is" and may be unavailable or changed at any time. To the extent
        the law allows, we are not liable for what users post, for deals made or not made, or
        for indirect losses. Nothing here limits rights you have by law as a consumer.
      </p>

      <h2 className={h2ClassName}>Changes and law</h2>
      <p>
        We may update these terms; continuing to use Deals means you accept the new version.
        These terms are governed by the law of [country], subject to mandatory consumer
        protections where you live.
      </p>
    </ChildLayout>
  );
}