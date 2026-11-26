import { ArrowRight, BookOpen, FlaskConical, GraduationCap, Layers3, Network, ShieldCheck, Sparkles } from 'lucide-react'
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

const topicIcons = [GraduationCap, Layers3, FlaskConical, BookOpen, Network]

export default function AboutPage() {
  return (
    <div className={`page ${styles.darkPage}`}>
      <PageHeading eyebrow="Academic case study" title="About the Prototype" description={project.description} />
      <div className={styles.aboutGrid}>
        <section className={styles.aboutNarrative} aria-label="Prototype scope and limitations">
          {project.about.map(({ title, description }, index) => {
            const Icon = topicIcons[index] ?? Layers3
            return (
              <article key={title} className={styles.aboutCard}>
                <span className={styles.iconTile}><Icon size={19} aria-hidden="true" /></span>
                <div><h2>{title}</h2><p>{description}</p></div>
              </article>
            )
          })}
        </section>
        <aside className={styles.aboutSide} aria-label="Decision support and evidence">
          <section className={styles.decisionDisclosure} aria-labelledby="decision-support-heading">
            <div className={styles.disclosureHeading}>
              <span className={styles.iconTile}><Sparkles size={19} aria-hidden="true" /></span>
              <span className={styles.status} data-status="Future">Conceptual</span>
            </div>
            <h2 id="decision-support-heading">AI-assisted strategy layer</h2>
            <p>A future decision-support layer could summarise cited evidence and flag missing inputs for review. The current prototype uses transparent rules.</p>
            <p className={styles.humanReview}><ShieldCheck size={17} aria-hidden="true" /> An accountable human reviews and approves investment decisions.</p>
          </section>
          <section className={styles.legend} aria-labelledby="classification-heading">
            <h2 id="classification-heading">Evidence classifications</h2>
            <dl>
              {classifications.map(({ type, description }) => (
                <div key={type}><dt><EvidenceBadge type={type} /></dt><dd>{description}</dd></div>
              ))}
            </dl>
            <Link className={styles.textLink} to={`${routes.evidence}?tab=evidence`}>Open the evidence register <ArrowRight size={16} aria-hidden="true" /></Link>
          </section>
        </aside>
      </div>
    </div>
  )
}
