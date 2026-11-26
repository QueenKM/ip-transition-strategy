import { Link } from 'react-router'
import { teamContributions } from '../../data/team'

export function WorkstreamInputs({ requestIds, className }: {
  requestIds: readonly string[]
  className?: string
}) {
  const streams = teamContributions.filter((team) => team.requests.some(
    (request) => request.status === 'Missing' && requestIds.includes(request.id),
  ))
  if (!streams.length) return null

  return (
    <ul className={className} aria-label="Missing workstream inputs">
      {streams.map((team) => (
        <li key={team.id}>
          <Link to={`/strategy/evidence?tab=team-inputs&focus=${encodeURIComponent(team.id)}`}>
            [INPUT REQUIRED FROM WORKSTREAM {team.workstream}]
          </Link>
        </li>
      ))}
    </ul>
  )
}
