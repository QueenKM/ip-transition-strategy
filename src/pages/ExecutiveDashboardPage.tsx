import { useState } from 'react'
import {
  ArrowDownRight, ArrowRight, BarChart3, ClipboardCheck, Factory, Fuel, MapPin,
  Route, ScrollText, Users, Waypoints,
} from 'lucide-react'
import { Link } from 'react-router'
import { routes, workstreamPath } from '../app/routes'
import { EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import styles from '../components/strategy/StrategyStory.module.css'
import { gates } from '../data/gates'
import { kpis } from '../data/kpis'
import { project } from '../data/project'
import { pillars } from '../data/strategy'
import { workstreams } from '../data/workstreams'

const pathway = [
  { label: 'Regulation & demand', Icon: ScrollText },
  { label: 'Refining transformation', Icon: Factory },
  { label: 'Lower-carbon energy', Icon: Fuel },
  { label: 'Distribution network', Icon: MapPin },
  { label: 'Customer & fleet', Icon: Users },
  { label: 'Data & evidence', Icon: BarChart3 },
  { label: 'Investment decision', Icon: ClipboardCheck },
]

const pillarCards: Partial<Record<string, { title: string; Icon: typeof Factory }>> = {
  'efficient-refining': { title: 'Efficient Refining', Icon: Factory },
  'selective-stations': { title: 'Selective Station Transformation', Icon: Route },
  'customer-fleet-services': { title: 'Customer & Fleet Services', Icon: Users },
  'evidence-led-investment': { title: 'Evidence-Led Investment', Icon: ClipboardCheck },
}

export default function ExecutiveDashboardPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const active = pillars.find(({ id }) => id === (hovered ?? focused ?? selected))
  const proposedKpis = kpis.filter((kpi) => kpi.status === 'Proposed definition')
  const verifiedBaselines = proposedKpis.filter((kpi) => kpi.baseline.evidenceType === 'VERIFIED FACT')
  const documentedApprovals = gates.filter((gate) => gate.approval.evidenceType === 'VERIFIED FACT')
  const pending = workstreams.filter((item) => !item.frameworkAvailable && !item.validated)

  function clearPillar() {
    setSelected(null)
    setHovered(null)
    setFocused(null)
  }

  function togglePillar(id: string) {
    if (selected === id) clearPillar()
    else setSelected(id)
  }

  return (
    <div className={`page ${styles.story} ${styles.dashboard}`}>
      <section className={`${styles.hero} ${styles.integrationHero}`} aria-labelledby="executive-heading">
        <div className={styles.heroContent}>
          <p className={styles.heroMeta}>Workstream 7 · Integration framework</p>
          <h1 id="executive-heading" className={styles.heroTitle} tabIndex={-1}>
            Integrated Strategy
          </h1>
          <p className={styles.heroSubtitle}>The proposed Part 7 framework connects refining, distribution and customer services to evidence-led investment review.</p>
          <div className={styles.heroLinks}>
            <Link className="button" to={routes.valueChain}>
              Explore the value chain <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to={routes.roadmap}>View the roadmap</Link>
            <details className={styles.heroDisclosure}>
              <summary>Read the Part 7 strategic thesis</summary>
              <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
              <p>{project.thesis}</p>
            </details>
          </div>
        </div>
        <div className={styles.integrationStatus}>
          <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
          <h2>Inputs that shape the group decision</h2>
          {pending.length ? (
            <ul aria-label="Workstreams with pending validated inputs">
              {pending.map((item) => <li key={item.id}><Link to={workstreamPath(item.workstream)} title={item.title}>W{item.workstream}<span className="sr-only"> {item.title}</span></Link></li>)}
            </ul>
          ) : <p>No pending workstream submissions.</p>}
          <Link to={routes.workstreams}>Review team input readiness</Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.chainPanel} panel`} aria-labelledby="pathway-heading">
        <div className={styles.sectionHeader}>
          <h2 id="pathway-heading">From regulation to investment decision</h2>
          <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
        </div>
        <ol className={styles.pathway}>
          {pathway.map(({ label, Icon }, index) => (
            <li key={label}>
              {index > 0 && <ArrowRight className={styles.pathwayArrow} size={15} aria-hidden="true" />}
              <Icon size={24} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ol>
        <p className={styles.feedback}>
          <ArrowDownRight size={17} aria-hidden="true" />
          <span>Supply, service and demand evidence would inform the next review of refinery allocation and station investment.</span>
        </p>
      </section>

      <section
        className={styles.section}
        aria-labelledby="pillars-heading"
        onPointerLeave={() => setHovered(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null)
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !active) return
          if (event.target instanceof Element && event.target.closest('#pillar-details')) {
            event.currentTarget.querySelector<HTMLButtonElement>('button[data-active="true"]')?.focus()
          }
          clearPillar()
        }}
      >
        <div className={styles.sectionHeader}>
          <h2 id="pillars-heading">Proposed strategic pillars</h2>
          <Link to={routes.portfolio} className={styles.textLink}>
            Review the portfolio <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar, index) => {
            const card = pillarCards[pillar.id]
            const Icon = card?.Icon ?? Waypoints
            return (
              <button
                type="button"
                className={styles.pillarButton}
                key={pillar.id}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'touch') setHovered(pillar.id)
                }}
                onFocus={() => {
                  setHovered(null)
                  setFocused(pillar.id)
                }}
                onClick={() => togglePillar(pillar.id)}
                aria-label={card?.title ?? pillar.title}
                aria-controls="pillar-details"
                aria-pressed={selected === pillar.id}
                data-active={active?.id === pillar.id}
              >
                <span className={styles.pillarTop}>
                  <span className={styles.pillarIcon}><Icon size={22} aria-hidden="true" /></span>
                  <strong>{card?.title ?? pillar.title}</strong>
                  <span className={styles.pillarNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className={styles.pillarSummary}>{pillar.description}</span>
              </button>
            )
          })}
        </div>
        <div id="pillar-details" className={styles.pillarDetailSlot}>
          {active && (
            <article className={`${styles.pillarDetail} panel`} aria-labelledby="pillar-detail-title" key={active.id}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 id="pillar-detail-title">{active.title}</h3>
                  <p className="muted">{active.objective}</p>
                </div>
                <EvidenceBadge type={active.evidenceType} />
              </div>
              <dl className={styles.roleGrid}>
                <div><dt>Refining role</dt><dd>{active.refiningContribution}</dd></div>
                <div><dt>Distribution role</dt><dd>{active.distributionContribution}</dd></div>
                <div><dt>Digital role</dt><dd>{active.digitalContribution}</dd></div>
                <div><dt>Decision consequence</dt><dd>{active.businessRationale}</dd></div>
              </dl>
              <details className={styles.recordDetails}>
                <summary>Audience, dependencies, risks and KPIs</summary>
                <dl className={styles.recordList}>
                  <div><dt>Audience</dt><dd>{active.customerSegments.join(', ')}</dd></div>
                  <div><dt>Dependencies</dt><dd><StrategyRecordLinks records={active.dependencies} /></dd></div>
                  <div><dt>Risks</dt><dd><StrategyRecordLinks records={active.riskIds.map((id) => ({ kind: 'risk', id }))} /></dd></div>
                  <div><dt>KPIs</dt><dd><StrategyRecordLinks records={active.kpiIds.map((id) => ({ kind: 'kpi', id }))} /></dd></div>
                </dl>
                <RecordSources record={active} />
              </details>
            </article>
          )}
        </div>
      </section>

      <section className={`${styles.section} panel`} aria-labelledby="readiness-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="readiness-heading">Evidence and delivery readiness</h2>
            <p className="muted">Coverage in the prototype register.</p>
          </div>
          <Link to={routes.evidence} className={styles.textLink}>
            Open KPI and evidence register <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <dl className={styles.readiness}>
          <div><dt>Strategic pillars</dt><dd>{pillars.length}<span>Included in the academic strategy</span></dd></div>
          <div>
            <dt>Verified KPI baselines</dt>
            <dd>
              {verifiedBaselines.length ? `${verifiedBaselines.length} of ${proposedKpis.length}` : 'No data'}
              <span>For proposed strategy KPIs</span>
            </dd>
          </div>
          <div>
            <dt>Documented gate approvals</dt>
            <dd>
              {documentedApprovals.length ? documentedApprovals.filter((gate) => gate.approval.value === 'Approved').length : 'No data'}
              <span>Requires verified human approval records</span>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
