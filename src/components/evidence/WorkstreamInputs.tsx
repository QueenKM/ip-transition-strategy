import { Link } from 'react-router'
import { workstreamPath } from '../../app/routes'
import { teamContributions } from '../../data/team'

export function WorkstreamInputs({ requestIds, className, compact = false }: {
  requestIds: readonly string[]
  className?: string
  compact?: boolean
}) {
  const streams = teamContributions.filter((team) => team.requests.some(
    (request) => requestIds.includes(request.id),
  ))
  if (!streams.length) return null

  return (
    <ul className={className} aria-label="Missing workstream inputs">
      {streams.map((team) => (
        <li key={team.id}>
          <Link to={workstreamPath(team.workstreamId)}>
            {compact ? `Workstream ${team.workstreamId}` : team.validated ? `WORKSTREAM ${team.workstreamId} CASE RECORD REQUIRED` : `[INPUT REQUIRED FROM WORKSTREAM ${team.workstreamId}]`}
          </Link>
        </li>
      ))}
    </ul>
  )
}
