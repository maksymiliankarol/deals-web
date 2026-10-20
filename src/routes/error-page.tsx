import { useRouteError } from 'react-router'

export function ErrorPage() {
  const error = useRouteError()

  return <p>{error instanceof Error ? error.message : 'Something went wrong'}</p>
}