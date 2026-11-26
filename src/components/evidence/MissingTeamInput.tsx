import { ClipboardList } from 'lucide-react'
import type { ReactNode } from 'react'
import type { WorkstreamId } from '../../models/strategy'
import { EvidenceBadge } from './Evidence'
import styles from './MissingTeamInput.module.css'

interface MissingTeamInputProps {
  workstream: WorkstreamId
  items?: readonly string[]
  children?: ReactNode
  className?: string
}

export function MissingTeamInput({ workstream, items = [], children, className }: MissingTeamInputProps) {
  return (
    <div className={className ? `${styles.notice} ${className}` : styles.notice}>
      <div className={styles.header}>
        <strong><ClipboardList size={16} aria-hidden="true" /> INPUT REQUIRED FROM WORKSTREAM {workstream}</strong>
        <EvidenceBadge type="NO DATA" />
      </div>
      {items.length > 0 && <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>}
      {children}
    </div>
  )
}
