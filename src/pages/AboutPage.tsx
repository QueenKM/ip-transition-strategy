import { ArrowRight, BookOpen, BrainCircuit, CircleHelp, FlaskConical, GitCompare, GraduationCap, Layers3, Network, ShieldCheck } from 'lucide-react'
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

const assistance = [
  { title: 'Evidence synthesis', Icon: BookOpen },
  { title: 'Scenario comparison', Icon: GitCompare },
  { title: 'Evidence gap detection', Icon: CircleHelp },
]

export default function AboutPage() {
  const [academicContext, ...scopeNotes] = project.about

  return (
    <div className={`page ${styles.darkPage}`}>
      <PageHeading eyebrow="Academic case study" title="About the Prototype" description={project.description} />
      <div className={styles.aboutGrid}>
        <section className={styles.aboutNarrative} aria-label="Prototype scope and limitations">
          {academicContext && (
            <article className={styles.aboutCard}>
              <span className={styles.iconTile}><GraduationCap size={19} aria-hidden="true" /></span>
              <div><h2>{academicContext.title}</h2><p>{academicContext.description}</p></div>
            </article>
          )}
          {scopeNotes.map(({ title, description }, index) => {
            const Icon = topicIcons[index + 1] ?? Layers3
            return (
              <details key={title} className={styles.aboutDetail}>
                <summary><Icon size={18} aria-hidden="true" />{title}</summary>
                <p>{description}</p>
              </details>
            )
          })}
        </section>
        <aside className={styles.aboutSide} aria-label="Decision support and evidence">
          <section className={styles.decisionDisclosure} aria-labelledby="decision-support-heading">
            <div className={styles.disclosureHeading}>
              <span className={styles.iconTile}><BrainCircuit size={19} aria-hidden="true" /></span>
              <span className={styles.status} data-status="Future">Conceptual · Decision support</span>
            </div>
            <h2 id="decision-support-heading">AI-assisted strategy layer</h2>
            <p>Potential support for an investment reviewer. The current prototype uses transparent rules.</p>
            <ul className={styles.assistanceList}>
              {assistance.map(({ title, Icon }) => (
                <li key={title}><Icon size={16} aria-hidden="true" /> {title}</li>
              ))}
            </ul>
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
