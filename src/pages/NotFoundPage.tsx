import { Link } from 'react-router'
import { routes } from '../app/routes'
import { PageHeading } from '../components/layout/PageHeading'

export default function NotFoundPage() {
  return (
    <div className="page">
      <PageHeading title="Page not found" description="This address has no matching screen in the prototype." />
      <div className="panel grid-two">
        <Link className="button" to={routes.strategy}>Open Strategy Control</Link>
        <Link className="button-secondary" to={routes.explore}>Open Station Explorer</Link>
      </div>
    </div>
  )
}
