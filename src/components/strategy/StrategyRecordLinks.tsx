import { Link } from 'react-router'
import type { EntityRef } from '../../models/strategy'
import { describeEntity } from '../../utils/selectRecords'
import styles from './PortfolioRoadmap.module.css'

export function StrategyRecordLinks({ records }: { records: readonly EntityRef[] }) {
  if (!records.length) return <span className="muted">No data</span>

  return (
    <ul className={styles.linkedRecords}>
      {records.map((record) => {
        const { title, href } = describeEntity(record)

        return (
          <li key={`${record.kind}-${record.id}`}>
            {href ? <Link to={href}>{title}</Link> : title}
          </li>
        )
      })}
    </ul>
  )
}
