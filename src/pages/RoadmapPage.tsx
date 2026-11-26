import { ArrowUpRight, Factory, Fuel, GitMerge, LaptopMinimal, ListChecks } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/PortfolioRoadmap.module.css'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import { gates } from '../data/gates'
import { initiatives } from '../data/initiatives'
import { roadmap } from '../data/roadmap'
import type { Horizon } from '../models/strategy'
import { describeEntity } from '../utils/selectRecords'

const horizonNames: Record<Horizon, string> = {
  '0–3 years': 'Establish the case',
  '3–7 years': 'Replicate what works',
  '7–15+ years': 'Rebalance the portfolio',
}

const lanes = [
  { id: 'refining', title: 'Refining', Icon: Factory },
  { id: 'distribution', title: 'Distribution', Icon: Fuel },
  { id: 'digital', title: 'Digital platform', Icon: LaptopMinimal },
] as const

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

export default function RoadmapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const phase = roadmap.find(({ id }) => id === searchParams.get('phase')) ?? roadmap[0]

  return (
    <div className={`page stack ${styles.roadmapPage}`}>
      <PageHeading
        eyebrow="Strategy control"
        title="Integrated Roadmap"
        description="The horizons run from strategy launch. Progress depends on evidence and a human decision at each gate."
      >
        <Link className="button button-secondary" to={routes.evidence}>
          Review KPIs and evidence <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </PageHeading>

      {phase ? (
        <>
          <div className={styles.horizonPicker} role="group" aria-label="Proposed time horizons">
            {roadmap.map((option) => (
              <button
                type="button"
                className={styles.horizonChoice}
                key={option.id}
                aria-pressed={option.id === phase.id}
                aria-controls="roadmap-phase"
                onClick={() => setSearchParams({ phase: option.id })}
              >
                <span className={styles.horizonMarker} aria-hidden="true" />
                <strong>{option.timeHorizon}</strong>
                <small>{horizonNames[option.timeHorizon]}</small>
              </button>
            ))}
          </div>

          <section id="roadmap-phase" className={styles.phasePanel} aria-labelledby="roadmap-phase-title">
            <header key={phase.id} className={styles.phaseIntro}>
              <div className={styles.cardHeader}>
                <span className="tag">{phase.status}</span>
                <EvidenceBadge type={phase.evidenceType} />
              </div>
              <h2 id="roadmap-phase-title">{phase.title}</h2>
              <p className={styles.phaseObjective}>{phase.objective}</p>
              {phase.description !== phase.objective && <p className="muted">{phase.description}</p>}
            </header>

            <div className={styles.lanes}>
              {lanes.map(({ id, title, Icon }) => (
                <section className={styles.lane} data-lane={id} key={id} aria-labelledby={`roadmap-lane-${id}`}>
                  <div className={styles.laneHeading}>
                    <span className={styles.laneIcon}><Icon size={20} aria-hidden="true" /></span>
                    <h3 id={`roadmap-lane-${id}`}>{title}</h3>
                  </div>
                  {phase.actions[id].length ? (
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
                  ) : <span className="muted">No data</span>}
                </section>
              ))}
              <section className={`${styles.lane} ${styles.gateLane}`} data-lane="gates" aria-labelledby="roadmap-gates">
                <div className={styles.laneHeading}>
                  <span className={styles.laneIcon}><GitMerge size={20} aria-hidden="true" /></span>
                  <h3 id="roadmap-gates">Investment gates and review triggers</h3>
                </div>
                <div className={styles.gateContent}>
                  <RoadmapList items={phase.reviewTriggers} />
                  <PhaseGateLinks ids={phase.gateIds} />
                </div>
              </section>
            </div>
          </section>

          <div className={styles.phaseDetails}>
            <section className={`panel ${styles.phaseDetail}`} aria-labelledby="roadmap-pilots">
              <h3 id="roadmap-pilots">Pilots and dependencies</h3>
              <h4>Pilot candidates</h4>
              <StrategyRecordLinks records={phase.pilotIds.map((id) => ({ kind: 'initiative', id }))} />
              <h4>Dependencies</h4>
              <StrategyRecordLinks records={phase.dependencies} />
            </section>
            <section className={`panel ${styles.phaseDetail}`} aria-labelledby="roadmap-scale">
              <h3 id="roadmap-scale">Scale-up conditions</h3>
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
          </div>
        </>
      ) : <p className="panel">No data</p>}
    </div>
  )
}
