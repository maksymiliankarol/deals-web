import { ChildLayout } from "../layouts/child-layout";
import { useI18n } from "../lib/i18n-context";

export function Contact() {
  const { t } = useI18n()

  return (
    <ChildLayout>
      <p>
        {t.contact.writeUs}{" "}
        <a
          href="mailto:deals@metalogrom.com"
          className="underline hover:decoration-2"
        >
          deals@metalogrom.com
        </a>
      </p>
    </ChildLayout>
  );
}