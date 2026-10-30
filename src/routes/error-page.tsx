import { useRouteError } from 'react-router'
import { useI18n } from '../lib/i18n-context'

export function ErrorPage() {
  const { t } = useI18n()
  const error = useRouteError()
  console.error(error)

  return <p>{t.common.somethingWentWrong}</p>
}