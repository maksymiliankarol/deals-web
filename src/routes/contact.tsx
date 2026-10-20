import { ChildLayout } from "../layouts/child-layout";

export function Contact() {
  return (
    <ChildLayout>
      <p>
        Write us:{" "}
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