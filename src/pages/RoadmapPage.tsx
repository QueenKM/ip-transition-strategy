import { ArrowUpRight, ChevronDown, Factory, Fuel, GitMerge, LaptopMinimal, ListChecks, Wallet } from 'lucide-react'
import { Fragment } from 'react'
import { Link, useSearchParams } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/PortfolioRoadmap.module.css'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import { gates } from '../data/gates'
import { initiatives } from '../data/initiatives'
import { roadmap } from '../data/roadmap'
import { teamContributions } from '../data/team'
import type { Horizon, WorkstreamId } from '../models/strategy'
import { describeEntity } from '../utils/selectRecords'

const horizonNames: Record<Horizon, string> = {
  '0–3 years': 'Establish the case',
  '3–7 years': 'Replicate what works',
  '7–15+ years': 'Rebalance the portfolio',
}

const lanes = [
  { id: 'refining', title: 'Refining', Icon: Factory, workstream: 3 },
  { id: 'distribution', title: 'Distribution', Icon: Fuel, workstream: 5 },
  { id: 'digital', title: 'Digital platform', Icon: LaptopMinimal, workstream: 7 },
] as const

const phaseSummaries: Record<Horizon, { refining: string; distribution: string; digital: string; handoff?: string }> = {
  '0–3 years': {
    refining: 'Set energy and emissions baselines. Screen heat recovery, qualified feedstocks and power procurement.',
    distribution: 'Screen sites for public and depot charging, certified HVO fleet supply and station services.',
    digital: 'Test discovery, fleet requests, reservations and payments. Define usage and downtime measures.',
    handoff: 'Validate pilot results',
  },
  '3–7 years': {
    refining: 'Test suitable process electrification. Use certified output and offtake to guide the product mix. Review process hydrogen.',
    distribution: 'Scale proven HVO and charging where case evidence supports it. Assess contracted biomethane for compatible fleets.',
    digital: 'Link service and fleet-account data. Use measured demand and utilisation in network and fuel supply decisions.',
    handoff: 'Reassess investment case',
  },
  '7–15+ years': {
    refining: 'Review residual emissions, qualified e-fuels and process hydrogen against available alternatives.',
    distribution: 'Adjust capacity and station mix from measured utilisation. Review road hydrogen for contracted specialist fleets.',
    digital: 'Use shared definitions to compare carrier demand, operations and investment. Reassess service formats as conditions change.',
  },
}

function RoadmapList({ items }: { items: readonly string[] }) {
  if (!items.length) return <span className="muted">No data</span>

  return (
    <ul className={styles.list}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function PhaseGateLinks({ ids }: { ids: readonly string[] }) {
  if (!ids.length) return <span className="muted">No data</span>

  return (
    <ul className={styles.gateLinks}>
      {ids.map((id) => {
        const gate = gates.find((record) => record.id === id)
        const initiative = initiatives.find((record) => record.id === gate?.initiativeId)
        const { title, href } = describeEntity({ kind: 'gate', id })

        return (
          <li key={id}>
            {href && gate ? (
              <Link to={href}>
                <span>{initiative?.title ?? title}</span>
                <span className={styles.gateStage}>{gate.title}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ) : title}
          </li>
        )
      })}
    </ul>
  )
}

function RoadmapWorkstream({ workstream, phaseId }: { workstream: WorkstreamId; phaseId: string }) {
  const contribution = teamContributions.find((record) => record.workstream === workstream)
  const topics = contribution?.validated ? contribution.topics.filter((topic) => (
    topic.affectedRecords.some(({ kind, id }) => kind === 'phase' && id === phaseId)
    && Boolean(topic.finding || topic.priority || topic.timing || topic.rationale)
  )) : []
  const teamRecord = describeEntity({ kind: 'team', id: `workstream-${workstream}` })

  return (
    <div className={styles.laneSummary}>
      {topics.length ? (
        <div className={styles.validatedInputs}>
          <EvidenceBadge type="TEAM INPUT" />
          {topics.map((topic) => (
            <div key={topic.id}>
              <p><strong>{topic.title}</strong></p>
              {topic.finding && <p>{topic.finding}</p>}
              {topic.priority && <p>Priority · {topic.priority}</p>}
              {topic.timing && <p>Timing · {topic.timing}</p>}
              {topic.rationale && <p>{topic.rationale}</p>}
              <RecordSources record={{ source: [], evidenceIds: topic.findingEvidenceIds }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <p><strong>No data</strong> · {contribution?.inputReceived && !contribution.validated ? 'Submission awaiting validation' : 'No validated recommendation for this horizon'}</p>
          <p className={styles.workstreamRequest}>[INPUT REQUIRED FROM WORKSTREAM {workstream}]</p>
        </>
      )}
      {teamRecord.href && <Link to={teamRecord.href}>Workstream {workstream} inputs</Link>}
    </div>
  )
}

export default function RoadmapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const phase = roadmap.find(({ id }) => id === searchParams.get('phase')) ?? roadmap[0]

  return (
    <div className={`page stack ${styles.roadmapPage}`}>
      <PageHeading
        eyebrow="Strategy control"
        title="Integrated Roadmap"
        description="The horizons organise the Part 7 draft from strategy launch. Refining, distribution and investment commitments depend on validated team inputs and human decisions."
      >
        <Link className="button button-secondary" to={routes.evidence}>
          Review KPIs and evidence <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </PageHeading>

      {phase ? (
        <>
          <div className={styles.horizonPicker} role="group" aria-label="Proposed time horizons">
            {roadmap.map((option, index) => {
              const handoff = phaseSummaries[option.timeHorizon].handoff
              const nextDependsOnOption = roadmap[index + 1]?.dependencies.some(
                ({ kind, id }) => kind === 'phase' && id === option.id,
              )

              return (
                <Fragment key={option.id}>
                  <button
                    type="button"
                    className={styles.horizonChoice}
                    aria-pressed={option.id === phase.id}
                    aria-controls="roadmap-phase"
                    onClick={() => setSearchParams({ phase: option.id })}
                  >
                    <span className={styles.phaseNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.horizonLabel}>
                      <strong>{option.timeHorizon}</strong>
                      <small>{horizonNames[option.timeHorizon]}</small>
                    </span>
                  </button>
                  {handoff && nextDependsOnOption && (
                    <div className={styles.horizonHandoff}>
                      <span className={styles.handoffIcon}><GitMerge size={17} aria-hidden="true" /></span>
                      <span className={styles.handoffLabel}>{handoff}</span>
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>

          <section id="roadmap-phase" className={styles.phasePanel} aria-labelledby="roadmap-phase-title">
            <header key={phase.id} className={styles.phaseIntro}>
              <div className={styles.phaseTitleRow}>
                <h2 id="roadmap-phase-title">{phase.title}</h2>
                <div className={styles.cardHeader}>
                  <span className="tag">Part 7 draft framework</span>
                  <EvidenceBadge type={phase.evidenceType} />
                </div>
              </div>
              <p className={styles.phaseObjective}>{phase.objective}</p>
            </header>

            <div className={styles.lanes}>
              {lanes.map(({ id, title, Icon, workstream }) => (
                <section className={styles.lane} data-lane={id} key={id} aria-labelledby={`roadmap-lane-${id}`}>
                  <div className={styles.laneHeading}>
                    <span className={styles.laneIcon}><Icon size={20} aria-hidden="true" /></span>
                    <h3 id={`roadmap-lane-${id}`}>{title}</h3>
                  </div>
                  {id === 'digital' ? (
                    <div className={styles.laneSummary}>
                      <p><strong>Part 7 draft</strong> · {phaseSummaries[phase.timeHorizon].digital}</p>
                      <RoadmapWorkstream workstream={workstream} phaseId={phase.id} />
                    </div>
                  ) : <RoadmapWorkstream workstream={workstream} phaseId={phase.id} />}
                  {phase.actions[id].length ? (
                    <details className={styles.laneDetails} key={`${phase.id}-${id}`}>
                      <summary>
                        <span>Part 7 hypotheses<span className="sr-only"> for {title}</span></span>
                        <ChevronDown size={16} aria-hidden="true" />
                      </summary>
                      <ul className={styles.actions}>
                        {phase.actions[id].map(({ initiativeId, action }) => {
                          const { title: initiativeTitle, href } = describeEntity({ kind: 'initiative', id: initiativeId })

                          return (
                            <li key={`${initiativeId}-${action}`}>
                              {href ? (
                                <Link className={styles.actionLink} to={href}>
                                  {initiativeTitle} <ArrowUpRight size={15} aria-hidden="true" />
                                </Link>
                              ) : <strong>{initiativeTitle}</strong>}
                              <p>{action}</p>
                            </li>
                          )
                        })}
                      </ul>
                    </details>
                  ) : <span className="muted">No data</span>}
                </section>
              ))}
              <section className={styles.lane} data-lane="economics" aria-labelledby="roadmap-economics">
                <div className={styles.laneHeading}>
                  <span className={styles.laneIcon}><Wallet size={20} aria-hidden="true" /></span>
                  <h3 id="roadmap-economics">Economics and risks</h3>
                </div>
                <RoadmapWorkstream workstream={6} phaseId={phase.id} />
              </section>
              <section className={`${styles.lane} ${styles.gateLane}`} data-lane="gates" aria-labelledby="roadmap-gates">
                <div className={styles.laneHeading}>
                  <span className={styles.laneIcon}><GitMerge size={20} aria-hidden="true" /></span>
                  <h3 id="roadmap-gates">Investment gates</h3>
                </div>
                <p className={styles.laneSummary}><strong>Part 7 draft rule</strong> · {phase.reviewTriggers[0] ?? 'No data'}</p>
                <details className={styles.laneDetails} key={phase.id}>
                  <summary>
                    <span>Proposed gates</span>
                    <ChevronDown size={16} aria-hidden="true" />
                  </summary>
                  <div className={styles.gateContent}>
                    <RoadmapList items={phase.reviewTriggers.slice(1)} />
                    <PhaseGateLinks ids={phase.gateIds} />
                  </div>
                </details>
              </section>
            </div>
          </section>

          <div className={styles.phaseDetails}>
            <section className={`panel ${styles.phaseDetail}`} aria-labelledby="roadmap-pilots">
              <h3 id="roadmap-pilots">Draft pilots and dependencies</h3>
              <h4>Pilot candidates</h4>
              <StrategyRecordLinks records={phase.pilotIds.map((id) => ({ kind: 'initiative', id }))} />
              <h4>Dependencies</h4>
              <StrategyRecordLinks records={phase.dependencies} />
            </section>
            <section className={`panel ${styles.phaseDetail}`} aria-labelledby="roadmap-scale">
              <h3 id="roadmap-scale">Draft scale-up conditions</h3>
              <RoadmapList items={phase.scaleConditions} />
            </section>
            <section className={`panel ${styles.phaseDetail} ${styles.phaseKpis}`} aria-labelledby="roadmap-kpis">
              <div className={styles.phaseDetailHeading}>
                <ListChecks size={20} aria-hidden="true" />
                <h3 id="roadmap-kpis">KPIs and evidence</h3>
              </div>
              <StrategyRecordLinks records={phase.kpiIds.map((id) => ({ kind: 'kpi', id }))} />
              <RecordSources record={phase} />
            </section>
            {phase.description !== phase.objective && (
              <details className={`panel ${styles.phaseContext}`} key={phase.id}>
                <summary>Phase context <ChevronDown size={16} aria-hidden="true" /></summary>
                <p>{phase.description}</p>
              </details>
            )}
          </div>
        </>
      ) : <p className="panel">No data</p>}
    </div>
  )
}
