import { ArrowUpRight, BookOpenCheck, ChartNoAxesCombined, Factory, Fuel, Presentation, Route, Settings2, Workflow } from 'lucide-react'
import { Link } from 'react-router'
import { workstreamPath } from '../../app/routes'
import type { TeamContribution } from '../../models/strategy'
import styles from './Workstreams.module.css'

const workstreamIcons = [BookOpenCheck, Factory, Settings2, Fuel, Route, ChartNoAxesCombined, Workflow, Presentation] as const

export function WorkstreamStatus({ workstream }: { workstream: TeamContribution }) {
  if (workstream.validated) return <span className={styles.status} data-tone="active">Team input validated</span>
  if (workstream.inputReceived) return <span className={styles.status} data-tone="review">Team input awaiting validation</span>
  if (workstream.frameworkAvailable) return <span className={styles.status} data-tone="active">In development / available</span>
  return <span className={styles.status} data-tone="waiting">Awaiting team input</span>
}

export function WorkstreamDirectory({ items }: { items: readonly TeamContribution[] }) {
  return (
    <ul className={styles.directory}>
      {items.map((item) => {
        const Icon = workstreamIcons[item.workstream - 1]
        return (
          <li key={item.id}>
            <article className={styles.directoryCard}>
              <div className={styles.directoryHeader}>
                <span className={styles.workstreamNumber}><Icon size={19} aria-hidden="true" /> W{item.workstream}</span>
                <WorkstreamStatus workstream={item} />
              </div>
              <h3>{item.title}</h3>
              <dl className={styles.cardReadiness}>
                <div><dt>Input readiness</dt><dd>{item.validated ? 'Validated' : item.inputReceived ? 'In review' : item.frameworkAvailable ? 'Framework available' : 'Awaiting input'}</dd></div>
                <div><dt>Evidence readiness</dt><dd>{item.validated ? 'Cited team evidence' : item.frameworkAvailable ? 'Case inputs pending' : 'No data'}</dd></div>
              </dl>
              <Link className={styles.directoryLink} to={workstreamPath(item.workstream)} aria-label={`Open section W${item.workstream}: ${item.title}`}>
                Open section <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
