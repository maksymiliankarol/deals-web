import { Link } from 'react-router'
import { ChildLayout } from '../layouts/child-layout'
import { useI18n } from '../lib/i18n-context'

const linkClass = "underline hover:decoration-2"

export function Policies() {
  const { t } = useI18n()

  return (
    <ChildLayout size="xs">
      <Link to="/terms-of-service" className={linkClass}>{t.policies.termsOfService}</Link>
      <Link to="/privacy-policy" className={linkClass}>{t.policies.privacyPolicy}</Link>
    </ChildLayout>
  )
}