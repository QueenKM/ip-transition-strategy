import { ClipboardCheck, GitBranch, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { routes, workstreamPath } from '../app/routes'
import { EvidenceBadge } from '../components/evidence/Evidence'
import { MissingTeamInput } from '../components/evidence/MissingTeamInput'
import { PageHeading } from '../components/layout/PageHeading'
import { governanceCycle, governanceRoles } from '../data/governance'
import { workstreams } from '../data/workstreams'
import styles from '../components/strategy/Workstreams.module.css'

export default function GovernancePage() {
  const governanceInput = workstreams.find(({ workstreamId }) => workstreamId === 7)
  return (
    <div className={`page ${styles.workstreamPage}`}>
      <PageHeading eyebrow="Integration framework" title="Governance and Investment Review"
        description="The proposed operating model assigns evidence ownership and reserves capital approval for accountable human decision-makers.">
        <Link className="button-secondary" to={routes.gate}><ShieldCheck size={18} aria-hidden="true" /> Open decision gate</Link>
      </PageHeading>
      <section className={styles.section} aria-labelledby="review-cycle">
        <div className={styles.sectionHeader}>
          <h2 id="review-cycle">Proposed review cycle</h2>
          <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
        </div>
        <div className={styles.topicGrid}>
          {governanceCycle.map(({ title, description }) => (
            <article className={styles.topic} key={title}>
              <ClipboardCheck size={23} color="var(--action)" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section} aria-labelledby="roles-heading">
        <div className={styles.sectionHeader}><h2 id="roles-heading">Roles to confirm</h2><p>Functions that would need named owners and agreed decision rights.</p></div>
        <div className={styles.topicGrid}>
          {governanceRoles.map(({ role, responsibility, workstreams: ids }) => (
            <article className={styles.topic} key={role}>
              <h3>{role}</h3>
              <p>{responsibility}</p>
              <ul className={styles.relatedLinks}>
                {ids.map((id) => <li key={id}><Link to={workstreamPath(id)}>Workstream {id}</Link></li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section} aria-labelledby="approval-heading">
        <div className={styles.sectionHeader}><h2 id="approval-heading">Human approval</h2></div>
        <div className={styles.detailsGrid}>
          <article className={styles.contextPanel}>
            <h3><GitBranch size={19} aria-hidden="true" /> Decision boundary</h3>
            <p>Digital supports the decision. Humans approve the investment. The proposed AI-assisted layer supports evidence review. The prototype applies visible rules.</p>
          </article>
          {governanceInput && !governanceInput.validated && (
            <MissingTeamInput workstream={7} items={['Confirm approval authority, operational owners and partner data rights.']}>
              <Link to={workstreamPath(7)}>Open integration inputs</Link>
            </MissingTeamInput>
          )}
        </div>
      </section>
    </div>
  )
}
