import {
  ArrowDownRight,
  ArrowRight,
  ChartNoAxesCombined,
  ClipboardCheck,
  Factory,
  Fuel,
  MapPin,
  PanelsTopLeft,
  Route,
  ScrollText,
  Users,
  Waypoints,
} from 'lucide-react'
import { Link } from 'react-router'
import { routes } from '../app/routes'
import corridorImage from '../assets/energy-corridor.webp'
import { EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import styles from '../components/strategy/StrategyStory.module.css'
import { gates } from '../data/gates'
import { kpis } from '../data/kpis'
import { project } from '../data/project'
import { pillars } from '../data/strategy'

const pathway = [
  { label: 'Regulation and demand', Icon: ScrollText },
  { label: 'Refining transformation', Icon: Factory },
  { label: 'Qualified energy products', Icon: Fuel },
  { label: 'Distribution network', Icon: MapPin },
  { label: 'Digital platform', Icon: PanelsTopLeft },
  { label: 'Customer and fleet services', Icon: Users },
  { label: 'Operating and demand data', Icon: ChartNoAxesCombined },
]

const pillarIcons: Partial<Record<string, typeof Factory>> = {
  'efficient-refining': Factory,
  'selective-stations': Route,
  'customer-fleet-services': Users,
  'evidence-led-investment': ClipboardCheck,
}

export default function ExecutiveDashboardPage() {
  const proposedKpis = kpis.filter((kpi) => kpi.status === 'Proposed definition')
  const verifiedBaselines = proposedKpis.filter((kpi) => kpi.baseline.evidenceType === 'VERIFIED FACT')
  const documentedApprovals = gates.filter((gate) => gate.approval.evidenceType === 'VERIFIED FACT')

  return (
    <div className="page stack">
      <section className={styles.hero} aria-labelledby="executive-heading">
        <img src={corridorImage} className={styles.heroArt} alt="" fetchPriority="high" />
        <p className={styles.heroCaption}>Illustrative scene</p>
        <div className={styles.heroContent}>
          <p className={styles.heroMeta}>Part 7 · Academic strategy prototype</p>
          <h1 id="executive-heading" className={styles.heroTitle} tabIndex={-1}>The transition, connected.</h1>
          <p className={styles.heroThesis}>{project.thesis}</p>
          <div className={styles.heroLinks}>
            <Link className="button" to={routes.valueChain}>
              Explore the value chain <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to={routes.roadmap}>View the roadmap</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} panel`} aria-labelledby="pathway-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="pathway-heading">From regulation to investment evidence</h2>
            <p className="muted">The proposed model connects refinery and network decisions through the services customers and fleets use.</p>
          </div>
          <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
        </div>
        <ol className={styles.pathway}>
          {pathway.map(({ label, Icon }) => (
            <li key={label}><Icon size={21} aria-hidden="true" /><span>{label}</span></li>
          ))}
        </ol>
        <p className={styles.feedback}>
          <ArrowDownRight size={17} aria-hidden="true" />
          <span>Supply, service and demand evidence returns to IP for review of refinery allocation and station investment.</span>
        </p>
      </section>

      <section className={styles.section} aria-labelledby="pillars-heading">
        <div className={styles.sectionHeader}>
          <h2 id="pillars-heading">Strategic pillars</h2>
          <Link to={routes.portfolio} className={styles.textLink}>
            Review the portfolio <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => {
            const Icon = pillarIcons[pillar.id] ?? Waypoints
            return (
              <article className={`${styles.pillar} panel`} key={pillar.id}>
                <header className={styles.pillarHeader}>
                  <span className={styles.pillarIcon}><Icon size={21} aria-hidden="true" /></span>
                  <div>
                    <h3>{pillar.title}</h3>
                    <EvidenceBadge type={pillar.evidenceType} />
                  </div>
                </header>
                <p>{pillar.objective}</p>
                <dl className={styles.contributions}>
                  <div><dt>Refining</dt><dd>{pillar.refiningContribution}</dd></div>
                  <div><dt>Distribution</dt><dd>{pillar.distributionContribution}</dd></div>
                  <div><dt>Digital</dt><dd>{pillar.digitalContribution}</dd></div>
                </dl>
                <details className={styles.pillarDetails}>
                  <summary>Rationale and implementation details</summary>
                  <p>{pillar.businessRationale}</p>
                  <dl className={styles.contributions}>
                    <div><dt>Audience</dt><dd>{pillar.customerSegments.join(', ')}</dd></div>
                    <div><dt>Dependencies</dt><dd><StrategyRecordLinks records={pillar.dependencies} /></dd></div>
                    <div>
                      <dt>Risks</dt>
                      <dd><StrategyRecordLinks records={pillar.riskIds.map((id) => ({ kind: 'risk', id }))} /></dd>
                    </div>
                    <div>
                      <dt>KPIs</dt>
                      <dd><StrategyRecordLinks records={pillar.kpiIds.map((id) => ({ kind: 'kpi', id }))} /></dd>
                    </div>
                  </dl>
                  <RecordSources record={pillar} />
                </details>
              </article>
            )
          })}
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
          <div>
            <dt>Strategic pillars</dt>
            <dd>{pillars.length}<span>Included in the academic strategy</span></dd>
          </div>
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
