import { ChildLayout } from "../layouts/child-layout"
import { useI18n } from "../lib/i18n-context"

const h1ClassName = "text-2xl font-bold py-4"
const h2ClassName = "text-xl font-bold py-4"
const listClassName = "list-disc pl-6 flex flex-col gap-2"

export function HowItWorks() {
  const { t } = useI18n()
  const h = t.howItWorks

  return (
    <ChildLayout size="sm">
      <h1 className={h1ClassName}>{h.title}</h1>
      <p>{h.intro}</p>

      <h2 className={h2ClassName}>{h.buyers.title}</h2>
      <p>{h.buyers.text}</p>
      <ul className={listClassName}>
        {h.buyers.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className={h2ClassName}>{h.sellers.title}</h2>
      <p>{h.sellers.text}</p>
      <ul className={listClassName}>
        {h.sellers.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ChildLayout>
  )
}