import { ArrowLeft, ClipboardCheck, Inbox, Layers3, Workflow } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeading } from '../components/layout/PageHeading'
import { WorkstreamDirectory } from '../components/strategy/WorkstreamDirectory'
import styles from '../components/strategy/Workstreams.module.css'
import { workstreams } from '../data/workstreams'

export default function WorkstreamReadinessPage() {
  const awaiting = workstreams.filter((workstream) => !workstream.inputReceived && workstream.status === 'Awaiting submission')
  const inDevelopment = workstreams.filter((workstream) => workstream.status === 'In development')
  const validated = workstreams.filter((workstream) => workstream.validated)
  const inReview = workstreams.filter((workstream) => workstream.inputReceived && !workstream.validated)

  return (
    <div className={`page ${styles.workstreamPage}`}>
      <PageHeading
        eyebrow="Group challenge"
        title="Strategy Integration Status"
        description="Review which workstream inputs are available and where pending recommendations affect the integrated strategy."
      >
        <Link className="button button-secondary" to="/"><ArrowLeft size={17} aria-hidden="true" /> Group strategy</Link>
      </PageHeading>

      <section className={styles.section} aria-labelledby="input-readiness-heading">
        <div className={styles.sectionHeader}>
          <h2 id="input-readiness-heading">Team Input Readiness</h2>
          <p>Submission status for the group workstreams.</p>
        </div>
        <dl className={styles.readinessGrid}>
          <div className={styles.readinessStat} data-tone="waiting">
            <dt><Layers3 size={18} aria-hidden="true" /> Awaiting team input</dt>
            <dd>{awaiting.length}</dd>
          </div>
          <div className={styles.readinessStat} data-tone="active">
            <dt><Workflow size={18} aria-hidden="true" /> In development / available</dt>
            <dd>{inDevelopment.length}</dd>
          </div>
          <div className={styles.readinessStat}>
            <dt><Inbox size={18} aria-hidden="true" /> Received for review</dt>
            <dd>{inReview.length}</dd>
          </div>
          <div className={styles.readinessStat}>
            <dt><ClipboardCheck size={18} aria-hidden="true" /> Team inputs validated</dt>
            <dd>{validated.length}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="workstream-directory-heading">
        <div className={styles.sectionHeader}>
          <h2 id="workstream-directory-heading">Workstreams</h2>
          <p>Open a workstream to see its available evidence, required inputs and affected decisions.</p>
        </div>
        <WorkstreamDirectory items={workstreams} />
      </section>
    </div>
  )
}
