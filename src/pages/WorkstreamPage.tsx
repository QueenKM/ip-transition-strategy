import { ArrowLeft, ArrowUpRight, BookOpenCheck, ChevronDown, GitBranch, Link2, Workflow } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { routes, workstreamPath } from '../app/routes'
import { DatumValue, EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { MissingTeamInput } from '../components/evidence/MissingTeamInput'
import { PageHeading } from '../components/layout/PageHeading'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import { WorkstreamStatus } from '../components/strategy/WorkstreamDirectory'
import styles from '../components/strategy/Workstreams.module.css'
import { evidence } from '../data/evidence'
import { workstreams } from '../data/workstreams'
import type { TeamContribution, WorkstreamTopic } from '../models/strategy'
import NotFoundPage from './NotFoundPage'

const frameworkLinks = [
  { title: 'Strategic pillars', to: routes.strategy },
  { title: 'Integrated value chain', to: routes.valueChain },
  { title: 'Integrated roadmap', to: routes.roadmap },
  { title: 'Governance and investment review', to: routes.governance },
  { title: 'KPI and evidence framework', to: routes.evidence },
  { title: 'Data architecture', to: routes.architecture },
  { title: 'Digital proof of concept', to: routes.explore },
  { title: 'Investment decision gate', to: routes.gate },
]

const linkedViews: Readonly<Record<string, string>> = {
  [routes.home]: 'Group strategy', [routes.strategy]: 'Integrated strategy', [routes.valueChain]: 'Integrated value chain',
  [routes.portfolio]: 'Technology portfolio', [routes.roadmap]: 'Integrated roadmap', [routes.gate]: 'Investment gate',
  [routes.evidence]: 'KPI and evidence dashboard', [routes.architecture]: 'Data architecture', [routes.explore]: 'Station explorer',
  [routes.journey]: 'Fleet and customer journey', [routes.governance]: 'Governance', [routes.about]: 'About the prototype',
}

function PublicContext({ ids }: { ids: readonly string[] }) {
  const verified = evidence.filter((item) => ids.includes(item.id) && item.evidenceType === 'VERIFIED FACT')
  return (
    <article className={styles.contextPanel}>
      <div className={styles.contextTitle}>
        <span><BookOpenCheck size={20} aria-hidden="true" /> Public verified context</span>
        {verified.length > 0 && <EvidenceBadge type="VERIFIED FACT" />}
      </div>
      {verified.length > 0 ? (
        <>
        <ul className={styles.contextLinks}>
          {verified.slice(0, 4).map((item) => (
            <li key={item.id}>
              <Link to={`${routes.evidence}?tab=evidence&focus=${item.id}`}><span>{item.id}</span> {item.title}</Link>
            </li>
          ))}
        </ul>
        {verified.length > 4 && (
          <details className={styles.inputDetails}>
            <summary>More public and lecture references <ChevronDown size={16} aria-hidden="true" /></summary>
            <ul className={styles.contextLinks}>
              {verified.slice(4).map((item) => (
                <li key={item.id}><Link to={`${routes.evidence}?tab=evidence&focus=${item.id}`}><span>{item.id}</span> {item.title}</Link></li>
              ))}
            </ul>
          </details>
        )}
        </>
      ) : <p className="muted">No data</p>}
    </article>
  )
}

function AssessmentCard({ topic, showPlan, validated }: { topic: WorkstreamTopic; showPlan: boolean; validated: boolean }) {
  return (
    <article className={styles.topic}>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      {(showPlan || topic.publicContext) && (
        <div className={styles.topicContext}>
          <strong>Public / lecture context</strong>
          <p>{topic.publicContext ?? 'No data'}</p>
          {topic.evidenceIds.length > 0 && (
            <details>
              <summary>Evidence references</summary>
              <RecordSources record={{ source: [], evidenceIds: topic.evidenceIds }} />
            </details>
          )}
        </div>
      )}
      <dl className={styles.topicData}>
        <div><dt>Team finding</dt><dd>{(validated && topic.finding) || 'No data'}</dd></div>
        {showPlan && (
          <>
            <div><dt>Team priority</dt><dd>{(validated && topic.priority) || 'No data'}</dd></div>
            <div><dt>Team timing</dt><dd>{(validated && topic.timing) || 'No data'}</dd></div>
            <div><dt>Team rationale</dt><dd>{(validated && topic.rationale) || 'No data'}</dd></div>
          </>
        )}
      </dl>
      {validated && topic.findingEvidenceIds.length > 0 && (
        <details className={styles.inputDetails}>
          <summary>Team finding sources <ChevronDown size={16} aria-hidden="true" /></summary>
          <RecordSources record={{ source: [], evidenceIds: topic.findingEvidenceIds }} />
        </details>
      )}
    </article>
  )
}

function TeamReview({ workstream }: { workstream: TeamContribution }) {
  const { validated, inputReceived, frameworkAvailable, requests, missingData } = workstream
  const nextRequests = requests.filter((request) => request.status !== 'Validated')
  return (
    <article className={styles.teamPanel}>
      <div className={styles.contextTitle}>
        <span><Workflow size={20} aria-hidden="true" /> {validated ? 'Validated team contribution' : frameworkAvailable ? 'Integration inputs' : 'Team recommendation pending'}</span>
        {validated && <EvidenceBadge type="TEAM INPUT" />}
      </div>
      {validated ? (
        <>
          <h3>Key findings</h3>
          {workstream.keyFindings.length > 0 ? <ul>{workstream.keyFindings.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No data</p>}
          <h3>Recommendations</h3>
          {workstream.recommendations.length > 0 ? <ul>{workstream.recommendations.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No data</p>}
          <RecordSources record={{ source: workstream.sources, evidenceIds: [] }} />
        </>
      ) : (
        <MissingTeamInput workstream={workstream.workstream} items={nextRequests.map((request) => request.requirement)}>
          <p>{inputReceived ? 'Submission received and awaiting validation.' : 'Awaiting validated team analysis.'}</p>
          <ul className={styles.relatedLinks} aria-label="Affected strategy views">
            {workstream.affectedRoutes.slice(0, 3).map((path) => <li key={path}><Link to={path}>{linkedViews[path] ?? path}</Link></li>)}
          </ul>
        </MissingTeamInput>
      )}
      {missingData.length > 0 && (
        <details className={styles.inputDetails}>
          <summary>Outstanding values and conclusions <ChevronDown size={16} aria-hidden="true" /></summary>
          <ul>{missingData.map((item) => <li key={item}>{item} <span>No data</span></li>)}</ul>
        </details>
      )}
    </article>
  )
}

export default function WorkstreamPage() {
  const { id } = useParams()
  const workstream = workstreams.find((item) => `w${item.workstreamId}` === id)
  if (!workstream) return <NotFoundPage />

  const { workstreamId, frameworkAvailable, topics, metrics, requests, validated } = workstream
  const related = {
    1: [2, 4], 2: [3], 3: [2, 6], 4: [5], 5: [4, 6], 6: [3, 5], 7: [1, 2, 3, 4, 5, 6, 8], 8: [7],
  }[workstreamId]
  const showPlan = workstreamId === 3 || workstreamId === 5

  return (
    <div className={`page ${styles.workstreamPage}`}>
      <div className={styles.crumb}><Link to={routes.workstreams}><ArrowLeft size={16} aria-hidden="true" /> All workstreams</Link></div>
      <PageHeading eyebrow={`Workstream ${workstreamId}`} title={workstream.title} description={workstream.summary}>
        <WorkstreamStatus workstream={workstream} />
      </PageHeading>
      <div className={styles.detailsGrid}>
        <TeamReview workstream={workstream} />
        <PublicContext ids={topics.flatMap((topic) => topic.evidenceIds)} />
      </div>

      {frameworkAvailable && (
        <section className={styles.section} aria-labelledby="framework-title">
          <div className={styles.sectionHeader}>
            <h2 id="framework-title">Integration framework</h2>
            <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
          </div>
          <ul className={styles.frameworkLinks}>
            {frameworkLinks.map(({ title, to }) => (
              <li key={to}><Link to={to}><GitBranch size={18} aria-hidden="true" />{title}<ArrowUpRight size={16} aria-hidden="true" /></Link></li>
            ))}
          </ul>
        </section>
      )}
      {metrics.length > 0 && (
        <section className={styles.section} aria-labelledby="workstream-metrics">
          <div className={styles.sectionHeader}>
            <h2 id="workstream-metrics">Investment case metrics</h2>
            <p>Record the measurement boundary and source with each validated result.</p>
          </div>
          <dl className={styles.metricList}>
            {metrics.map((item) => (
              <div key={item.id}>
                <dt>{item.title}</dt>
                <dd>{validated ? <DatumValue datum={item.value} unit={item.unit ?? undefined} /> : 'No data'}</dd>
                <dd>{item.description}</dd>
                {validated && item.value.value !== null && (
                  <dd><EvidenceBadge type={item.value.evidenceType} /><RecordSources record={{ source: [], evidenceIds: item.value.evidenceIds }} /></dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      )}
      {!frameworkAvailable && (
        <section className={styles.section} aria-labelledby="assessment-topics">
          <div className={styles.sectionHeader}>
            <h2 id="assessment-topics">{showPlan ? 'Assessment areas' : 'Findings to validate'}</h2>
            <p>{showPlan ? 'Technical context frames each option. Team priority, timing and rationale follow validation.' : 'Each topic has a place for the validated team finding.'}</p>
          </div>
          <div className={styles.topicGrid}>
            {topics.map((topic) => <AssessmentCard key={topic.id} topic={topic} showPlan={showPlan} validated={validated} />)}
          </div>
        </section>
      )}

      <section className={styles.section} aria-labelledby="handoff-title">
        <div className={styles.sectionHeader}><h2 id="handoff-title">Review and handoff</h2></div>
        <div className={styles.detailsGrid}>
          <article className={styles.contextPanel}>
            <h3>Submission record</h3>
            <dl className={styles.metaGrid}>
              <div><dt>Owner</dt><dd>{workstream.owner ?? 'No data'}</dd></div>
              <div><dt>Date received</dt><dd>{workstream.dateReceived ?? 'No data'}</dd></div>
              <div><dt>Last validated</dt><dd>{workstream.lastValidated ?? 'No data'}</dd></div>
              <div><dt>Last updated</dt><dd>{workstream.lastUpdated ?? 'No data'}</dd></div>
            </dl>
            <details className={styles.inputDetails}>
              <summary>Open questions and assumptions <ChevronDown size={16} aria-hidden="true" /></summary>
              <ul>{workstream.unresolvedQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
              <p>Assumptions</p>
              <StrategyRecordLinks records={workstream.assumptions.map((item) => ({ kind: 'evidence', id: item }))} />
            </details>
          </article>
          <article className={styles.contextPanel}>
            <h3><Link2 size={18} aria-hidden="true" /> Affected decisions and records</h3>
            <ul className={styles.relatedLinks} aria-label="Affected views">
              {workstream.affectedRoutes.map((path) => <li key={path}><Link to={path}>{linkedViews[path] ?? path}</Link></li>)}
            </ul>
            <StrategyRecordLinks records={requests.flatMap((request) => request.affectedRecords)} />
            <ul className={styles.relatedLinks}>
              {related.map((item) => <li key={item}><Link to={workstreamPath(item)}>Workstream {item}</Link></li>)}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}
