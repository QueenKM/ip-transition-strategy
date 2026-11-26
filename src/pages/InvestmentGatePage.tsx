import {
  ChevronRight, CircleCheck, CircleHelp, CircleMinus, ClipboardCheck, GitBranch, Radio,
  ScanLine, ShieldAlert,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { DatumValue, DecisionBadge, EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { WorkstreamInputs } from '../components/evidence/WorkstreamInputs'
import { PageHeading } from '../components/layout/PageHeading'
import { gates } from '../data/gates'
import { initiatives } from '../data/initiatives'
import { project } from '../data/project'
import { risks } from '../data/risks'
import { stationServices } from '../data/services'
import { technologies } from '../data/technologies'
import { useDemoSession } from '../hooks/useDemoSession'
import type { DemoEvent, EntityRef, GateCheck, GateStage } from '../models/strategy'
import { evaluateGate } from '../utils/evaluateGate'
import { describeEntity } from '../utils/selectRecords'
import styles from './StrategyControlDetails.module.css'

function DependencyList({ refs }: { refs: readonly EntityRef[] }) {
  if (!refs.length) return <p className="muted">No data</p>

  return (
    <ul className={styles.referenceList}>
      {refs.map((ref) => {
        const item = describeEntity(ref)
        return (
          <li key={`${ref.kind}:${ref.id}`}>{item.href ? <Link to={item.href}>{item.title}</Link> : item.title}</li>
        )
      })}
    </ul>
  )
}

function describeCheck(check: GateCheck, stage: GateStage, blocked: boolean) {
  const { finding } = check
  if (finding.value === null) return { label: 'No data', state: 'missing', Icon: CircleMinus }
  if (blocked) return { label: 'BLOCKED', state: 'blocked', Icon: ShieldAlert }

  const hasCaseEvidence = (finding.evidenceType === 'VERIFIED FACT' || finding.evidenceType === 'TEAM INPUT')
    && finding.evidenceIds.length > 0 && finding.scope.trim() !== ''
  const needsVerifiedPerformance = stage === 'Scale' && check.id === 'operatingPerformance'
    && finding.evidenceType !== 'VERIFIED FACT'

  if (hasCaseEvidence && !needsVerifiedPerformance && finding.value === 'Met') {
    return { label: 'READY', state: 'ready', Icon: CircleCheck }
  }
  return { label: 'UNDER REVIEW', state: 'review', Icon: CircleHelp }
}

function CheckRow({ check, stage, decisive, blocked }: {
  check: GateCheck
  stage: GateStage
  decisive: boolean
  blocked: boolean
}) {
  const { label, state, Icon } = describeCheck(check, stage, blocked)

  return (
    <li className={decisive ? styles.decisiveCheck : undefined} data-state={state}>
      <div className={styles.checkHeading}>
        <h3>{check.title}</h3>
        <span className={styles.checkStatus}>
          <Icon size={15} aria-hidden="true" />
          {label}
        </span>
      </div>
      <p className={styles.checkTag}>{check.required ? `Needed for ${stage} stage` : `Context for ${stage} review`}
        {decisive && ' · Drives recommendation'}
      </p>
      <p>{check.rationale}</p>
      {check.finding.value === null && (
        <div className={styles.checkInputs}>
          <WorkstreamInputs requestIds={check.finding.inputRequestIds} className={styles.referenceList} />
        </div>
      )}
      <details className={styles.disclosure}>
        <summary>Owner and next evidence</summary>
        <dl className={styles.factList}>
          <div><dt>Evidence owner</dt><dd>{check.owner}</dd></div>
          <div><dt>Next action</dt><dd>{check.nextAction}</dd></div>
          <div><dt>Treatment if unmet</dt><dd>{check.blockingIfUnmet ? 'Binding constraint' : 'Review readiness'}</dd></div>
          {check.finding.value !== null && <>
            <div><dt>Recorded finding</dt><dd><DatumValue datum={check.finding} /></dd></div>
            <div><dt>Evidence type</dt><dd><EvidenceBadge type={check.finding.evidenceType} /></dd></div>
            <div><dt>Scope</dt><dd>{check.finding.scope}</dd></div>
          </>}
        </dl>
        {check.finding.value !== null && <RecordSources record={{ source: [], evidenceIds: check.finding.evidenceIds }} />}
      </details>
    </li>
  )
}

function DemandSignals({ events }: { events: readonly DemoEvent[] }) {
  return (
    <section className={`panel ${styles.supportPanel} ${styles.demandPanel}`} aria-labelledby="demand-signals">
      <div className={styles.supportHeading}>
        <Radio size={19} aria-hidden="true" />
        <h2 id="demand-signals">Demo demand signals</h2>
      </div>
      <EvidenceBadge type="ILLUSTRATIVE OR MODELLED VALUE" />
      <p>Simulated activity from Customer &amp; Fleet. The gate uses the evidence checks shown alongside it.</p>
      {events.length === 0 ? (
        <p className={styles.emptyInset}>No simulated activity for this initiative in this session.</p>
      ) : (
        <ul className={styles.signalList}>
          {[...events].reverse().map((event) => {
            const service = stationServices.find((item) => item.id === event.stationServiceId)
            const date = new Date(event.createdAt)
            return (
              <li key={event.id}>
                <strong>{event.action}</strong>
                {service
                  ? <Link to={`/mobility/journey?service=${encodeURIComponent(service.id)}`}>{service.title}</Link>
                  : <span>Fictional station service</span>}
                <time dateTime={event.createdAt}>{date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
              </li>
            )
          })}
        </ul>
      )}
      <Link to="/mobility/explore">Open station and energy services</Link>
    </section>
  )
}

export default function InvestmentGatePage() {
  const [query, setQuery] = useSearchParams()
  const { events } = useDemoSession()
  const requestedInitiative = query.get('initiative')
  const requestedStage = query.get('stage')
  const defaultInitiative = initiatives.find((item) => item.id === project.defaultInitiativeId) ?? initiatives[0]
  const initiative = initiatives.find((item) => item.id === requestedInitiative) ?? defaultInitiative
  const availableGates = gates.filter((gate) => gate.initiativeId === initiative?.id)
  const gate = availableGates.find((item) => item.stage.toLowerCase() === requestedStage?.toLowerCase())
    ?? availableGates.find((item) => item.stage === 'Pilot')
    ?? availableGates[0]
  const decision = gate ? evaluateGate(gate) : null
  const initiativeEvents = events.filter((event) => event.initiativeId === initiative?.id)
  const linkedTechnologies = technologies.filter((item) => initiative?.technologyIds.includes(item.id))
  const linkedRisks = risks.filter((item) => initiative?.riskIds.includes(item.id) || gate?.riskIds.includes(item.id))
  const dependencies = [...(initiative?.dependencies ?? []), ...(gate?.dependencies ?? [])]
  const uniqueDependencies = dependencies.filter((ref, index) => dependencies.findIndex(
    (item) => item.id === ref.id && item.kind === ref.kind,
  ) === index)

  return (
    <div className="page">
      <PageHeading
        eyebrow="Strategy control"
        title="Investment Decision Gate"
        description="See the evidence that determines whether an initiative can proceed and the human approval it requires."
      />

      <section className={`panel ${styles.gateSelection}`} aria-label="Select an initiative and decision stage">
        <label>
          <span>Initiative</span>
          <select value={initiative?.id ?? ''} onChange={(event) => setQuery({ initiative: event.target.value })}>
            {initiatives.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <label>
          <span>Decision stage</span>
          <select
            value={gate?.stage ?? ''}
            disabled={!availableGates.length}
            onChange={(event) => {
              if (initiative) setQuery({ initiative: initiative.id, stage: event.target.value.toLowerCase() })
            }}
          >
            {!availableGates.length && <option value="">No data</option>}
            {availableGates.map((item) => <option key={item.id} value={item.stage}>{item.stage}</option>)}
          </select>
        </label>
      </section>

      {!initiative || !gate || !decision ? (
        <p className={`panel ${styles.empty}`}>No data for the selected initiative or decision stage.</p>
      ) : <>
        <section className={styles.gateSummary} data-recommendation={decision.recommendation} aria-labelledby="gate-result" aria-live="polite">
          <div className={styles.gateVerdict}>
            <p className={styles.gateKicker}><ScanLine size={16} aria-hidden="true" /> Rule-based recommendation · {gate.stage} stage</p>
            <div className={styles.recommendationHeading}>
              <h2 id="gate-result">{initiative.title}</h2>
            </div>
            <div className={styles.gateDecision}>
              <DecisionBadge recommendation={decision.recommendation} />
            </div>
            {decision.recommendation === 'Insufficient evidence' && (
              <p className={styles.gatePrinciple}>Customer interest alone does not justify investment.</p>
            )}
            <p className={styles.gateReason}>{decision.reason}</p>
            <div className={styles.nextAction}>
              <ChevronRight size={18} aria-hidden="true" />
              <p><strong>Next action</strong> {decision.nextAction}</p>
            </div>
          </div>
          <div className={styles.approval}>
            <div className={styles.approvalHeading}><ClipboardCheck size={21} aria-hidden="true" /><strong>Human approval</strong></div>
            <p className={styles.approvalPrinciple}>Digital supports the decision. Humans approve the investment.</p>
            <dl className={styles.approvalFacts}>
              <div><dt>Approval status</dt><dd><DatumValue datum={gate.approval} /></dd></div>
              <div><dt>Approval role</dt><dd>{gate.approvalRole}</dd></div>
            </dl>
            <p className={styles.conceptNote}>The AI-assisted strategy layer is a future concept. This prototype applies the rules shown below.</p>
          </div>
        </section>

        <div className={styles.gateLayout}>
          <div className={styles.gateMain}>
            <section className={`panel ${styles.supportPanel} ${styles.evidenceChain}`} aria-labelledby="decision-checks">
              <div className={styles.supportHeading}>
                <GitBranch size={19} aria-hidden="true" />
                <h2 id="decision-checks">Decision checks</h2>
              </div>
              <p className="muted">Each check shows the evidence and action needed for the {gate.stage} stage.</p>
              <ul className={styles.checkList}>
                {gate.checks.map((check) => {
                  const decisive = decision.decisiveCheckIds.includes(check.id)
                  return <CheckRow key={check.id} check={check} stage={gate.stage} decisive={decisive}
                    blocked={decision.recommendation === 'Defer' && decisive} />
                })}
              </ul>
              <RecordSources record={gate} />
            </section>

            <section className={`panel ${styles.supportPanel}`} aria-labelledby="case-for-investment">
              <div className={styles.supportHeading}>
                <GitBranch size={19} aria-hidden="true" />
                <h2 id="case-for-investment">Case for investment</h2>
              </div>
              <EvidenceBadge type={initiative.evidenceType} />
              <p>{initiative.businessRationale}</p>
              <dl className={styles.factList}>
                <div><dt>Demand driver</dt><dd>{initiative.demandDriver}</dd></div>
                <div><dt>Use of assets</dt><dd>{initiative.assetFit}</dd></div>
                <div><dt>Refining–Distribution link</dt><dd>{initiative.integration}</dd></div>
                <div><dt>Investment intensity</dt><dd><DatumValue datum={initiative.investmentIntensity} /></dd></div>
                <div><dt>Time horizon</dt><dd>{initiative.timeHorizon ?? 'No data'}</dd></div>
              </dl>
              <RecordSources record={initiative} />
            </section>
          </div>

          <aside className={styles.gateAside} aria-label="Supporting evidence and dependencies">
            <DemandSignals events={initiativeEvents} />

            <section className={`panel ${styles.supportPanel}`} aria-labelledby="gate-dependencies">
              <h2 id="gate-dependencies">Dependencies and maturity</h2>
              <DependencyList refs={uniqueDependencies} />
              {linkedTechnologies.map((item) => (
                <div key={item.id} className={styles.techBlock}>
                  <strong>{item.title}</strong>
                  <dl className={styles.factList}>
                    <div><dt>Industry maturity</dt><dd><DatumValue datum={item.industryMaturity} /></dd></div>
                    <div><dt>IP readiness</dt><dd><DatumValue datum={item.ipReadiness} /></dd></div>
                  </dl>
                </div>
              ))}
              <p><strong>Review trigger</strong> {gate.reviewTrigger}</p>
            </section>

            <section className={`panel ${styles.supportPanel}`} aria-labelledby="gate-risks">
              <div className={styles.supportHeading}>
                <ShieldAlert size={19} aria-hidden="true" />
                <h2 id="gate-risks">Risks to track</h2>
              </div>
              {linkedRisks.length ? <ul className={styles.riskList}>
                {linkedRisks.map((risk) => <li key={risk.id}>
                  <h3>{risk.title}</h3>
                  <p>{risk.consequence}</p>
                  <p className="muted">{risk.mitigation}</p>
                </li>)}
              </ul> : <p className="muted">No data</p>}
            </section>

            <details className={`panel ${styles.rulesPanel}`}>
              <summary><CircleHelp size={18} aria-hidden="true" /> How the recommendation works</summary>
              <dl className={styles.factList}>
                <div><dt>Defer</dt><dd>An evidenced binding constraint prevents progression.</dd></div>
                <div><dt>Insufficient evidence</dt><dd>A required input for this stage is unavailable.</dd></div>
                <div><dt>Monitor</dt><dd>Readiness remains limited or a review trigger warrants tracking.</dd></div>
                <div><dt>Pilot</dt><dd>The bounded trial meets the requirements for its stage.</dd></div>
                <div><dt>Scale</dt><dd>The scale requirements are evidenced and ready for human review.</dd></div>
              </dl>
            </details>
          </aside>
        </div>
      </>}
    </div>
  )
}
