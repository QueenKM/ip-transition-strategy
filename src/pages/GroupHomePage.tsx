import { ArrowRight, BookOpenCheck, Factory, Fuel, GitBranch, Layers3, Route, ShieldCheck, Truck, Workflow } from 'lucide-react'
import { Link } from 'react-router'
import { routes, workstreamPath } from '../app/routes'
import energyImage from '../assets/energy-intelligence.webp'
import { WorkstreamDirectory } from '../components/strategy/WorkstreamDirectory'
import { workstreams } from '../data/workstreams'
import styles from './GroupHomePage.module.css'

const stages = [
  { label: 'Context', to: workstreamPath(1), Icon: BookOpenCheck },
  { label: 'Refining', to: workstreamPath(2), Icon: Factory },
  { label: 'Distribution', to: workstreamPath(4), Icon: Fuel },
  { label: 'Technology & economics', to: workstreamPath(6), Icon: Layers3 },
  { label: 'Integrated strategy', to: routes.strategy, Icon: GitBranch },
  { label: 'Roadmap', to: routes.roadmap, Icon: Route },
  { label: 'Digital demonstration', to: routes.explore, Icon: Truck },
  { label: 'Evidence-led decisions', to: routes.gate, Icon: ShieldCheck },
]

export default function GroupHomePage() {
  return (
    <div className={`page ${styles.home}`}>
      <section className={styles.hero} aria-labelledby="group-title">
        <img src={energyImage} alt="" fetchPriority="high" className={styles.art} />
        <div className={styles.heroCaption}>Illustrative scene</div>
        <div className={styles.heroContent}>
          <p className="eyebrow">University group challenge · Italy</p>
          <h1 id="group-title" tabIndex={-1}>IP Long-Term <span>Sustainability Strategy</span></h1>
          <p className={styles.subtitle}>Refining × Distribution × Multi-Energy Mobility</p>
          <p className={styles.descriptor}>Interactive Group Strategy &amp; Decision-Support Prototype</p>
          <div className={styles.heroActions}>
            <Link className="button" to={workstreamPath(1)}>Start with the context</Link>
            <Link className="button-secondary" to={routes.workstreams}><Workflow size={17} aria-hidden="true" /> View team readiness</Link>
          </div>
        </div>
      </section>

      <section className={styles.flow} aria-labelledby="strategy-flow">
        <h2 id="strategy-flow">The group strategy</h2>
        <ol>
          {stages.map(({ label, to, Icon }, index) => (
            <li key={to}>
              {index > 0 && <ArrowRight className={styles.connector} size={13} aria-hidden="true" />}
              <Link to={to}><Icon size={21} aria-hidden="true" /><span>{label}</span></Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.workstreamSection} aria-labelledby="workstream-heading">
        <div className={styles.sectionHead}>
          <div>
            <h2 id="workstream-heading">Eight workstreams</h2>
            <p>Open a section to review its evidence, readiness and required inputs.</p>
          </div>
          <Link to={routes.workstreams}>Strategy integration status</Link>
        </div>
        <WorkstreamDirectory items={workstreams} />
      </section>
    </div>
  )
}
