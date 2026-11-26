import {
  ArrowDownRight, ArrowRight, BarChart3, ClipboardCheck, Droplet, Factory, Fuel, MapPin,
  Network, Truck, Users, Zap,
} from 'lucide-react'
import { Link } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/StrategyStory.module.css'
import { valueChains } from '../data/strategy'

const flowTracks = [
  {
    title: 'Liquid fuel pathway', Icon: Droplet, tone: 'liquid',
    stages: [
      { label: 'Feedstock / Supply', Icon: Droplet },
      { label: 'Refining', Icon: Factory },
      { label: 'Qualified Product', Icon: Fuel },
      { label: 'Logistics', Icon: Truck },
      { label: 'Station / Fleet', Icon: MapPin },
      { label: 'Customer Demand Signal', Icon: BarChart3 },
    ],
  },
  {
    title: 'Electricity pathway', Icon: Zap, tone: 'electric',
    stages: [
      { label: 'Grid', Icon: Network },
      { label: 'Site', Icon: MapPin },
      { label: 'Charger', Icon: Zap },
      { label: 'Customer/Fleet', Icon: Users },
      { label: 'Utilisation Signal', Icon: BarChart3 },
    ],
  },
] as const

export default function ValueChainPage() {
  return (
    <div className={`page ${styles.story}`}>
      <PageHeading
        title="Integrated Value Chain"
        eyebrow="Strategy control"
        description="Trace certified fuels from refining and procurement, and charging from grid supply. Both routes meet in the customer and fleet experience and return evidence to investment review."
      >
        <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
      </PageHeading>

      <section className={styles.section} aria-labelledby="energy-pathways-heading">
        <div className={styles.sectionHeader}>
          <h2 id="energy-pathways-heading">Energy pathways</h2>
        </div>
        <div className={styles.flowLayout}>
          <div className={styles.flowTracks}>
            {flowTracks.map(({ title, Icon, tone, stages }) => (
              <article className={`panel ${styles.flowTrack}`} data-tone={tone} key={tone}>
                <h3><Icon size={20} aria-hidden="true" /> {title}</h3>
                <ol>
                  {stages.map(({ label, Icon: StageIcon }, index) => (
                    <li key={label}>
                      {index > 0 && <ArrowRight className={styles.trackArrow} size={14} aria-hidden="true" />}
                      <StageIcon size={23} aria-hidden="true" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
          <div className={styles.mergeConnector} aria-hidden="true"><ArrowRight size={25} /></div>
          <article className={`panel ${styles.mergeTarget}`} aria-labelledby="strategy-control-heading">
            <ClipboardCheck size={27} aria-hidden="true" />
            <h3 id="strategy-control-heading">Strategy Control</h3>
            <p>Combine demand and utilisation with supply, operating and investment evidence for human review.</p>
            <Link className={styles.textLink} to={routes.gate}>
              Review investment gates <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
        </div>
        <div className={styles.laneNotes}>
          {valueChains.map((chain) => (
            <details className={`panel ${styles.recordDetails}`} key={chain.id}>
              <summary>{chain.title} details</summary>
              <p>{chain.description}</p>
              <ol className={styles.stageList}>
                {chain.steps.map((step) => (
                  <li className={styles.stage} key={step.title}>
                    <h3>
                      {'initiativeId' in step ? (
                        <Link className={styles.stageLink} to={`${routes.gate}?initiative=${encodeURIComponent(step.initiativeId)}`}>
                          {step.title} <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      ) : step.title}
                    </h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="shared-platform-heading">
        <div className={styles.sectionHeader}>
          <h2 id="shared-platform-heading">Shared digital platform</h2>
          <Link to={routes.architecture} className={styles.textLink}>
            Review the data flows <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.handoffGrid}>
          <article className={`${styles.handoff} panel`}>
            <h3>Service catalogue</h3>
            <p>Present eligible fuel or charging offers with their compatibility, availability and source.</p>
          </article>
          <article className={`${styles.handoff} panel`}>
            <h3>Customer and fleet activity</h3>
            <p>Capture service requests, delivered volumes and sessions as distinct forms of evidence.</p>
          </article>
          <article className={`${styles.handoff} panel`}>
            <h3>Investment review</h3>
            <p>Compare demand with operating performance, commercial terms and risks before committing capital.</p>
          </article>
        </div>
        <p className={styles.feedback}>
          <ArrowDownRight size={17} aria-hidden="true" />
          <span>Aggregate the evidence to inform the next review of feedstocks, product mix and station upgrades.</span>
        </p>
        <div className={styles.platformLinks}>
          <Link to={routes.explore} className="button button-secondary">
            Explore sample services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
