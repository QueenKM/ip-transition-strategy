import { BookOpen, FlaskConical, Layers3, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import { project } from '../data/project'
import type { EvidenceType } from '../models/strategy'
import styles from './SystemPages.module.css'

const classifications: readonly { type: EvidenceType; description: string }[] = [
  { type: 'VERIFIED FACT', description: 'Supported by a cited source within its stated reporting boundary.' },
  { type: 'TEAM INPUT', description: 'Attributed to a contributing workstream and tracked in the register.' },
  { type: 'STRATEGIC RECOMMENDATION', description: 'A proposed action, priority, measurement or decision rule.' },
  { type: 'ASSUMPTION', description: 'A premise that requires confirmation before it can support a decision.' },
  { type: 'ILLUSTRATIVE OR MODELLED VALUE', description: 'Fictional or modelled material used to demonstrate the experience.' },
  { type: 'NO DATA', description: 'A reliable value for the stated scope is unavailable.' },
]

export default function AboutPage() {
  return (
    <div className="page">
      <PageHeading eyebrow="Academic case study" title="About the Prototype" description={project.description} />
      <div className={styles.aboutGrid}>
        <div className="stack">
          {project.about.map(({ title, description }, index) => {
            const Icon = [Layers3, FlaskConical, ShieldCheck, BookOpen][index] ?? Layers3
            return (
              <article key={title} className={`panel ${styles.aboutCard}`}>
                <span className={styles.iconTile}><Icon size={20} aria-hidden="true" /></span>
                <div><h2>{title}</h2><p>{description}</p></div>
              </article>
            )
          })}
        </div>
        <aside className={`panel ${styles.legend}`} aria-label="Evidence classifications">
          <h2>Evidence classifications</h2>
          <dl>
            {classifications.map(({ type, description }) => (
              <div key={type}><dt><EvidenceBadge type={type} /></dt><dd>{description}</dd></div>
            ))}
          </dl>
          <Link className="button-secondary" to={`${routes.evidence}?tab=evidence`}>Open the evidence register</Link>
        </aside>
      </div>
    </div>
  )
}
